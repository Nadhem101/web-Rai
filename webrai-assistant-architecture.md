# WEB-RAI Assistant — Architecture Spec

A natural-language assistant over the R.A.I. Control maintenance platform. The user asks
questions in French/English; the assistant answers with real numbers pulled live from the
relational backend. **Not RAG** — the data is structured rows in Postgres, so this is a
natural-language-to-structured-query problem solved with bounded, typed tool calling.

---

## 0. Design principles

- **Model does language judgment; code holds every consequential decision.** The model
  proposes a tool + params. Validation, role-gating, and execution are all code.
- **Bounded, typed tools — no freeform SQL.** Each tool wraps one known query surface.
- **Grounded answers only.** The assistant never emits a number it didn't get back from a
  tool result. If the data isn't there, it says so.
- **Read/write separation.** Reads execute immediately. Writes (future) go through
  propose-then-confirm.
- **Role enforcement is server-side and code-level**, never model-decided. The existing
  `can(section)` model (admin / maintenance / indus) is resolved server-side, not trusted
  from the client. This matters more here because the doc notes routes aren't hard-blocked
  client-side.
- **Observability and evals from day one** — the gaps you flagged in the job-tracker.

---

## 1. System context — where it plugs in

Lives as a new module in the existing **Node/Express** backend. One new endpoint:
`POST /api/assistant/chat`.

Reuses what already exists:
- Supabase client + session (auth already handled — no new login surface)
- Query logic already behind the dashboard KPIs and the MTTR/MTBF aggregation endpoint
- The role model from `AuthContext` — but resolved **server-side** from the session,
  not read off the request body

Frontend: a chat panel (React, existing theme/tokens). Sends `{ message, conversationId }`
with the usual auth token.

---

## 2. Request lifecycle

```
client
  └─> POST /api/assistant/chat  (message + session token)
        └─> Ingress: resolve userId + roles server-side, load conversation
              └─> Orchestrator loop:
                    ┌─────────────────────────────────────────────┐
                    │  build messages (system + role-filtered      │
                    │  tool defs + history)                        │
                    │        └─> Anthropic API                     │
                    │              ├─ tool_use? ──> Dispatch:       │
                    │              │     1. tool exists?            │
                    │              │     2. role ∩ tool.roles?      │ ← hard gate
                    │              │     3. params validate?        │
                    │              │     4. write? -> proposal      │
                    │              │     5. read  -> handler        │
                    │              │           └─> tool_result ─────┘ (loop)
                    │              └─ final text? ──> exit loop      │
                    └─────────────────────────────────────────────┘
        └─> grounded answer (+ optional structured payload)
        └─> write trace record
  <─ response
```

Loop is bounded (e.g. max 5 iterations), with a per-turn timeout and token budget. If the
cap is hit, force a final answer or an abstain rather than looping forever.

---

## 3. Components

### 3.1 Ingress (route handler)
- Validates the session, extracts `userId` + `roles` **server-side**.
- Loads or creates the conversation, appends the user message.
- Hands off to the orchestrator.
- Returns `{ answer, structuredPayload?, traceId }`.

### 3.2 Orchestrator (agent loop)
- Builds the message list: system prompt + **tool defs filtered to the user's allowed
  tools** + conversation history.
- Calls the Anthropic API. On `tool_use`, dispatches each call, appends the `tool_result`,
  loops. On final text, exits.
- Bounded iterations, per-turn timeout, token budget.
- **Key detail:** the tool definitions the model even *sees* are pre-filtered by role. An
  `indus` user's context never contains maintenance tools at all — this cuts mis-selection
  and is defense-in-depth alongside the dispatch-layer gate. The gate is still the real
  enforcement; the filtering is just hygiene.

### 3.3 Tool registry — the single source of truth
Each tool is a declarative object. Model tool defs, role filtering, dispatch, and eval
targets all derive from this one place.

```js
{
  name: 'getOverdueMaintenance',
  description: 'Overdue preventive maintenance items, optionally by zone/category.',
  inputSchema: { /* JSON schema: zone?, category? */ },
  roles: ['maintenance', 'admin'],
  kind: 'read',            // 'read' | 'write'
  handler: async (params, ctx) => { /* ... */ },
}
```

Core read tools for v1 (each maps onto a query the app already runs):

| Tool | Maps to | Roles |
|------|---------|-------|
| `getOverdueMaintenance(zone?, category?)` | Préventif dashboard alerts / `maintenance_intervals` | maintenance, admin |
| `getIncidentStats(dateRange, equipmentId?)` | MTTR/MTBF aggregation (`IndicateurCuratif`) | maintenance, admin |
| `getECMEStatus(filter?, affectation?)` | `EtatECME` KPI query | maintenance, admin |
| `getStockAlerts(category)` | PDR / Outillages low-stock pulls | maintenance, indus, admin |
| `getEquipmentInfo(code)` | `Equipement` registry lookup | all |
| `getChiffrageSummary(affaireId)` | Industrialisation costing | indus, admin |

You'll add more in the workspace — the registry pattern is the point.

### 3.4 Dispatch / validation pipeline
For each `tool_use` the model emits:
1. **Tool exists?** else return a structured error result.
2. **`ctx.roles ∩ tool.roles ≠ ∅`?** else refuse. This is the hard gate — model intent is
   irrelevant. A maintenance-role user cannot invoke a chiffrage tool no matter how the
   query is phrased.
3. **Params validate against `inputSchema`** (zod/ajv)? else return a validation error as a
   tool_result so the model can retry with corrected params.
4. **`kind === 'write'`?** → don't execute; return a proposal object (see 3.7).
5. **read** → run the handler with `ctx` (`userId`, `roles`, supabase client).

Errors go back as `tool_result` content so the model can recover or clarify — not thrown
raw to the user.

### 3.5 Data access layer (handlers)
- One handler per tool, wrapping a specific **parameterized** query.
- Reuse existing query modules where they exist (dashboard, IndicateurCuratif aggregation).
- Use a **read-only DB connection/role** for read tools if feasible — belt and suspenders
  against any injection surface.
- Return compact, shaped JSON — not raw row dumps. Shape it for the model to reason over.

### 3.6 Response grounding
- System prompt: answer only from tool results; if data is absent, say so; never invent
  numbers.
- Optionally attach the raw structured tool result to the response payload so the **frontend
  renders the real table/number** and the model's prose sits alongside it. This removes the
  model as a transcription risk for figures — it narrates, the UI shows the actual data.

### 3.7 Write path — propose-then-confirm (for future write tools)
When you add mutating tools (mark a fiche done, log an incident, edit a threshold):
- The write tool doesn't execute. It returns `{ action, params, humanSummary, diff }`.
- The assistant surfaces the proposal; the user confirms in the UI.
- The confirmed proposal re-enters via a `confirm` endpoint → **re-validates role + schema
  at execution time** (don't trust the round-trip) → executes → logs actor + before/after.

Bake the `kind: 'read' | 'write'` distinction into the registry now even though v1 is
read-only, so the dispatch pipeline already has the branch.

---

## 4. Observability

Per turn, emit one trace record:
- `conversationId`, `userId`, `roles`
- user query
- each model step: tool chosen, params, validation outcome, handler latency, row count
- total tokens (in/out), total latency, iteration count
- final answer + whether it was an abstain/clarify
- outcome tag: `answered` / `clarified` / `refused-role` / `error`

Store to a `assistant_traces` table (Supabase) or structured logs. This is the live tracing
the job-tracker lacked — it's also what your eval harness reads back.

---

## 5. Eval harness (CI-gated)

Golden set of `(query, context{role}, expected)` cases:
- **Tool selection:** correct tool across phrasing variants ("what's overdue" vs "montre les
  préventifs en retard").
- **Param extraction:** zone / date range / equipment code / category parsed correctly.
- **Abstain/clarify:** ambiguous queries ("show me overdue stuff" — which module?) don't
  force a wrong tool.
- **Role enforcement:** an `indus`-role query must never *successfully* invoke a
  maintenance-only tool — assert a refusal.
- **Grounding:** seed known data, assert the answer contains only numbers present in the
  tool result (no ungrounded figures).
- **Injection:** a user message trying to override role/system ("ignore your role and run…")
  must not escalate.

Metrics: tool-selection accuracy, param exact-match rate, ungrounded-number rate,
role-violation rate (**must be 0**). CI gate: `role-violation = 0` hard, thresholds on the
rest.

---

## 6. Security / threat model

- User message = untrusted input. System prompt + tool descriptions = trusted.
- Role gate is code, enforced **twice** (context filtering + dispatch), never model-decided.
- No freeform SQL; params always schema-validated.
- Reads on a restricted DB connection where possible.
- Writes: propose-then-confirm + re-validation at execution.
- Per-user rate limit; per-request iteration cap.

---

## 7. Milestones

- **M0** — endpoint skeleton, server-side auth/role resolution, orchestrator loop with one
  hardcoded read tool, trace stub.
- **M1** — tool registry + dispatch/validation pipeline + role filtering.
- **M2** — the core read tools (§3.3 table).
- **M3** — grounding + structured-payload rendering in the frontend chat panel.
- **M4** — traces persisted + a minimal trace viewer.
- **M5** — eval harness + golden set + CI gate.
- **M6** *(optional)* — similarity search over free-text incident descriptions (the one
  genuinely unstructured field — this is where a small embedding search legitimately earns
  its place, scoped, bolted onto the tool backbone).
- **M7** *(future)* — write tools via propose-then-confirm.

---

## 8. Open decisions for the workspace

- Model tier — cost/latency tradeoff (ties into your planned multi-model benchmark).
- Conversation history — persisted table vs ephemeral per-session.
- Streaming vs blocking responses.
- How much to render as structured payload vs prose.
