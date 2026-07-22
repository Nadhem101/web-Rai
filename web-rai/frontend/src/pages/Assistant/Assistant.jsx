import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Send, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { assistantService } from '../../services/api';

const Assistant = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [thread, setThread] = useState([]); // [{ role: 'user' | 'assistant', text, references? }]
  const [history, setHistory] = useState([]); // opaque provider history, threaded back to the backend
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread, loading]);

  const send = async () => {
    const message = input.trim();
    if (!message || loading) return;
    setInput('');
    setError('');
    setThread((t) => [...t, { role: 'user', text: message }]);
    setLoading(true);
    try {
      const data = await assistantService.chat(message, history);
      setThread((t) => [...t, { role: 'assistant', text: data.answer, references: data.references || [] }]);
      setHistory(data.history || []);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Erreur de l'assistant");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="flex items-center gap-3.5 px-[26px] py-4 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
          <Bot className="w-5 h-5" strokeWidth={1.8} />
        </div>
        <div>
          <h1 className="font-display font-semibold text-[22px]" style={{ color: 'var(--text)', letterSpacing: '-0.4px' }}>Assistant</h1>
          <p className="text-[13px] mt-0.5" style={{ color: 'var(--text3)' }}>
            Questions sur les données de l'application — répond uniquement à partir de résultats d'outils réels
          </p>
        </div>
      </div>

      {/* Thread */}
      <div className="flex-1 overflow-y-auto px-[26px] py-5 space-y-3.5">
        {thread.length === 0 && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-center" style={{ color: 'var(--text3)' }}>
            <Sparkles className="w-8 h-8 mb-3 opacity-30" />
            <p className="text-sm font-medium">Posez une question sur la maintenance, les incidents, le stock…</p>
            <p className="text-xs mt-1">ex. « Combien d'incidents curatifs ce mois-ci ? »</p>
          </div>
        )}

        {thread.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} gap-1.5`}>
            <div
              className="max-w-[70%] rounded-[14px] px-4 py-2.5 text-[13.5px] leading-relaxed whitespace-pre-wrap"
              style={
                m.role === 'user'
                  ? { background: 'linear-gradient(135deg, var(--accent3), var(--accent2))', color: '#fff' }
                  : { background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text)' }
              }
            >
              {m.text}
            </div>
            {/* References are built server-side from real tool results — never
                parsed out of the model's own text — so the link is always real. */}
            {m.references?.length > 0 && (
              <div className="flex flex-wrap gap-2 max-w-[70%]">
                {m.references
                  .filter((ref, idx, arr) => arr.findIndex((r) => r.path === ref.path) === idx)
                  .map((ref) => (
                    <button
                      key={ref.path}
                      onClick={() => navigate(ref.path)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-semibold transition-transform hover:-translate-y-0.5"
                      style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--accent)' }}
                    >
                      {ref.label} <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-[14px] px-4 py-2.5 flex items-center gap-2" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
              <div className="w-3.5 h-3.5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
              <span className="text-xs" style={{ color: 'var(--text3)' }}>Réflexion…</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2.5 rounded-[10px] px-4 py-3 text-sm mx-auto max-w-md" style={{ border: '1px solid var(--crit)', background: 'var(--crit-soft)', color: 'var(--crit)' }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-[26px] py-4 flex-shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-end gap-2.5">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Écrire un message…"
            className="flex-1 resize-none rounded-[12px] px-4 py-3 text-[13.5px] outline-none transition-colors"
            style={{ background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text)' }}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            aria-label="Envoyer"
            className="w-11 h-11 rounded-[12px] flex items-center justify-center text-white flex-shrink-0 disabled:opacity-40 transition-transform hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))', boxShadow: '0 6px 18px var(--accent-soft)' }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
