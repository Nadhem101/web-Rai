const { getOllamaToolDefsForRoles, findTool, extractReferences } = require('./tools');
const { canAny } = require('./permissions');
const SYSTEM_PROMPT = require('./systemPrompt');

// Local-only provider — talks to a locally-running Ollama instance.
// Never reachable in a hosted deployment unless OLLAMA_BASE_URL is set to
// something reachable from there; see assistant.controller.js for the
// ASSISTANT_PROVIDER gate that keeps this off by default in production.
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:7b';
// Keep the model resident in memory between requests so repeated questions
// during a work session don't each pay Ollama's ~10-15s cold-load cost.
const KEEP_ALIVE = process.env.OLLAMA_KEEP_ALIVE || '10m';
const MAX_ITERATIONS = 5;

async function callOllama(messages, tools) {
  let res;
  try {
    res = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, stream: false, keep_alive: KEEP_ALIVE, messages, tools }),
    });
  } catch (err) {
    throw new Error(`Impossible de joindre Ollama sur ${OLLAMA_BASE_URL} — est-il lancé ? (${err.message})`);
  }
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Ollama a répondu ${res.status}: ${body}`);
  }
  return res.json();
}

/**
 * Same external contract as orchestrator.js's runAssistantTurn — the
 * controller doesn't need to know which provider it's calling.
 * `history` here is a plain OpenAI-style message array (no system message —
 * that's injected fresh on every request, same as Anthropic's `system` param).
 */
async function runAssistantTurn({ userMessage, history = [], userRoles }) {
  const tools = getOllamaToolDefsForRoles(userRoles);
  const convo = [...history, { role: 'user', content: userMessage }];
  const trace = { iterations: 0, toolCalls: [] };
  const references = [];

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    trace.iterations = i + 1;

    const data = await callOllama([{ role: 'system', content: SYSTEM_PROMPT }, ...convo], tools);
    const msg = data.message || {};
    const toolCalls = msg.tool_calls || [];

    if (toolCalls.length === 0) {
      convo.push({ role: 'assistant', content: msg.content || '' });
      return { answer: msg.content || '', messages: convo, trace, references, outcome: 'answered' };
    }

    convo.push({ role: 'assistant', content: msg.content || '', tool_calls: toolCalls });

    for (const call of toolCalls) {
      const name = call.function?.name;
      const input = call.function?.arguments || {};
      const callTrace = { name, input };
      const tool = findTool(name);
      let content;

      if (!tool) {
        callTrace.outcome = 'unknown_tool';
        content = 'Unknown tool.';
      } else if (!canAny(userRoles, tool.sections)) {
        callTrace.outcome = 'refused_role';
        content = 'Not authorized for this tool.';
      } else if (tool.kind === 'write') {
        callTrace.outcome = 'write_not_implemented';
        content = 'Write actions are not available yet.';
      } else {
        try {
          const result = await tool.handler(input);
          callTrace.outcome = 'ok';
          references.push(...extractReferences(result));
          content = JSON.stringify(result);
        } catch (err) {
          callTrace.outcome = 'error';
          callTrace.error = err.message;
          content = `Error: ${err.message}`;
        }
      }

      trace.toolCalls.push(callTrace);
      convo.push({ role: 'tool', tool_call_id: call.id, content });
    }
  }

  return {
    answer: "Je n'ai pas pu conclure dans le nombre d'étapes autorisées — pouvez-vous préciser votre question ?",
    messages: convo,
    trace,
    references,
    outcome: 'iteration_cap',
  };
}

module.exports = { runAssistantTurn };
