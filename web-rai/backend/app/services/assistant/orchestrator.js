const Anthropic = require('@anthropic-ai/sdk');
const { getToolDefsForRoles, findTool, extractReferences } = require('./tools');
const { canAny } = require('./permissions');
const SYSTEM_PROMPT = require('./systemPrompt');

const anthropic = new Anthropic(); // reads ANTHROPIC_API_KEY from env

// Sonnet 5: near-Opus quality on agentic/tool-calling work, well below Opus
// pricing — the right tier for a small internal Q&A-over-structured-data
// tool. Override via ASSISTANT_MODEL if that tradeoff changes.
const MODEL = process.env.ASSISTANT_MODEL || 'claude-sonnet-5';
const MAX_TOKENS = 1024;
const MAX_ITERATIONS = 5;

/**
 * Runs one user turn through the tool-use loop.
 * `history` is the raw Anthropic message array from the previous turn's
 * response (client-managed — there's no server-side conversation store yet).
 * Returns { answer, messages, trace } — `messages` should be sent back
 * verbatim as `history` on the next turn.
 */
async function runAssistantTurn({ userMessage, history = [], userRoles }) {
  const tools = getToolDefsForRoles(userRoles);
  const messages = [...history, { role: 'user', content: userMessage }];
  const trace = { iterations: 0, toolCalls: [] };
  const references = [];

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    trace.iterations = i + 1;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      tools,
      messages,
    });

    messages.push({ role: 'assistant', content: response.content });

    if (response.stop_reason !== 'tool_use') {
      const answer = response.content.find((b) => b.type === 'text')?.text ?? '';
      return { answer, messages, trace, references, outcome: 'answered' };
    }

    const toolUseBlocks = response.content.filter((b) => b.type === 'tool_use');
    const toolResults = [];

    for (const block of toolUseBlocks) {
      const callTrace = { name: block.name, input: block.input };
      const tool = findTool(block.name);

      if (!tool) {
        callTrace.outcome = 'unknown_tool';
        toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: 'Unknown tool.', is_error: true });
      } else if (!canAny(userRoles, tool.sections)) {
        // The hard gate — model intent is irrelevant here. Even if the tool
        // wasn't in the filtered list the model saw, this still blocks it.
        callTrace.outcome = 'refused_role';
        toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: 'Not authorized for this tool.', is_error: true });
      } else if (tool.kind === 'write') {
        // No write tools registered yet — this branch exists so the
        // propose-then-confirm path has somewhere to plug in later.
        callTrace.outcome = 'write_not_implemented';
        toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: 'Write actions are not available yet.', is_error: true });
      } else {
        try {
          const result = await tool.handler(block.input || {});
          callTrace.outcome = 'ok';
          references.push(...extractReferences(result));
          toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: JSON.stringify(result) });
        } catch (err) {
          callTrace.outcome = 'error';
          callTrace.error = err.message;
          toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: `Error: ${err.message}`, is_error: true });
        }
      }
      trace.toolCalls.push(callTrace);
    }

    messages.push({ role: 'user', content: toolResults });
  }

  return {
    answer: "Je n'ai pas pu conclure dans le nombre d'étapes autorisées — pouvez-vous préciser votre question ?",
    messages,
    trace,
    references,
    outcome: 'iteration_cap',
  };
}

module.exports = { runAssistantTurn };
