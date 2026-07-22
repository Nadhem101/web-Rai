const { resolveRoles } = require('../services/assistant/auth');

// Which LLM backs the assistant is an env choice, not a code choice — unset
// in production (see backend/.env) means the assistant is simply off there,
// rather than a hosted deployment trying and failing to reach a local Ollama.
const PROVIDERS = {
  anthropic: require('../services/assistant/orchestrator'),
  ollama: require('../services/assistant/orchestrator.ollama'),
};

// POST /api/assistant/chat — { message, history? } -> { answer, history }
exports.chat = async (req, res) => {
  try {
    const provider = PROVIDERS[process.env.ASSISTANT_PROVIDER];
    if (!provider) {
      return res.status(503).json({ error: "Assistant indisponible dans cet environnement." });
    }

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Non authentifié' });

    const { message, history } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Le champ "message" est requis.' });
    }

    // Roles resolved server-side from the JWT-derived user id — never
    // trusted from the request body.
    const userRoles = await resolveRoles(userId);
    if (userRoles.length === 0) {
      return res.status(403).json({ error: 'Aucun rôle assigné — contactez un administrateur.' });
    }

    const { answer, messages, trace, references, outcome } = await provider.runAssistantTurn({
      userMessage: message,
      history: Array.isArray(history) ? history : [],
      userRoles,
    });

    // Trace stub for M0 — a real trace table/store is a later milestone.
    console.log('[assistant.trace]', JSON.stringify({ userId, roles: userRoles, outcome, ...trace }));

    res.json({ answer, history: messages, references: references || [] });
  } catch (err) {
    console.error('[assistant] error:', err);
    res.status(500).json({ error: err.message || 'Erreur assistant' });
  }
};
