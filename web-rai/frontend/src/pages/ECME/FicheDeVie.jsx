import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ecmeService } from '../../services/api';
import EcmeFormModal from '../../components/EcmeFormModal';
import { Pencil } from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────────────────────
const ALERTE_CONFIG = {
  VALABLE:      { label: 'Valable',                  bg: 'var(--ok-soft)',   color: 'var(--ok)',   dot: '🟢' },
  VERIFICATION: { label: 'Vérification requise',     bg: 'var(--crit-soft)', color: 'var(--crit)', dot: '🔴' },
  EXEMPTE:      { label: 'Exempté de vérification',  bg: 'var(--info-soft)', color: 'var(--info)', dot: '⚪' },
  DECLASSE:     { label: 'Déclassé définitivement',  bg: 'var(--panel2)',    color: 'var(--text3)', dot: '⚫' },
  INCONNU:      { label: 'Statut inconnu',            bg: 'var(--warn-soft)', color: 'var(--warn)', dot: '🟡' },
};

function fmtDate(raw) {
  if (!raw) return '—';
  const d = new Date(raw);
  if (isNaN(d)) return raw;
  return d.toLocaleDateString('fr-FR');
}

function InfoRow({ label, value, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-start gap-1 py-2 last:border-0 ${className}`}
      style={{ borderBottom: '1px solid var(--border2)' }}>
      <dt className="text-xs font-semibold sm:w-52 flex-shrink-0" style={{ color: 'var(--text3)' }}>{label}</dt>
      <dd className="text-sm flex-1" style={{ color: 'var(--text)' }}>{value || '—'}</dd>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function FicheDeVie() {
  const { code }   = useParams();
  const navigate   = useNavigate();
  const [data,       setData]      = useState(null);
  const [loading,    setLoading]   = useState(true);
  const [error,      setError]     = useState('');
  const [editOpen,   setEditOpen]  = useState(false);

  const reload = () => {
    setLoading(true);
    ecmeService.getOne(code)
      .then(({ data: d }) => setData(d))
      .catch((e) => setError(e.response?.data?.error || e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { reload(); }, [code]);

  if (loading) {
    return (
      <div className="p-6 flex-1 overflow-auto flex items-center justify-center">
        <p className="text-sm animate-pulse" style={{ color: 'var(--text3)' }}>Chargement de la fiche...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="px-[26px] pt-6 flex-1 overflow-auto" style={{ background: 'var(--bg)' }}>
        <button onClick={() => navigate(-1)} className="mb-4 text-sm hover:underline" style={{ color: 'var(--accent)' }}>
          ← Retour
        </button>
        <div className="p-4 rounded-[10px]" style={{ background: 'var(--crit-soft)', border: '1px solid var(--crit)', color: 'var(--crit)' }}>
          {error || 'ECME non trouvé'}
        </div>
      </div>
    );
  }

  const alerteCfg = ALERTE_CONFIG[data.alerte] || ALERTE_CONFIG.INCONNU;

  // Compute if overdue
  const today = new Date();
  const nextVerifDate = data.date_prochaine_verification ? new Date(data.date_prochaine_verification) : null;
  const isOverdue = nextVerifDate && nextVerifDate < today && data.alerte !== 'EXEMPTE' && data.alerte !== 'DECLASSE';

  const interventions = data.interventions || [];

  return (
    <div className="px-[26px] pt-6 pb-10 flex-1 overflow-auto space-y-4" style={{ background: 'var(--bg)' }}>
      {/* ── Back button + Edit ── */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/ecme')} className="flex items-center gap-1 text-sm hover:underline" style={{ color: 'var(--accent)' }}>
          ← Retour à la liste
        </button>
        <button onClick={() => setEditOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))', boxShadow: '0 6px 18px var(--accent-soft)' }}>
          <Pencil className="w-3.5 h-3.5" /> Modifier / Mettre à jour les dates
        </button>
      </div>

      {/* ── Header ── */}
      <div className="rounded-[14px] p-5" style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-[6px]"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>
                {data.code}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-[20px] text-xs font-bold"
                style={{ background: alerteCfg.bg, color: alerteCfg.color }}>
                {alerteCfg.dot} {alerteCfg.label}
              </span>
              {isOverdue && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[20px] text-xs font-bold text-white animate-pulse"
                  style={{ background: 'var(--crit)' }}>
                  ⚠ EN RETARD
                </span>
              )}
            </div>
            <h1 className="font-display font-semibold text-[22px]" style={{ color: 'var(--text)', letterSpacing: '-0.3px' }}>{data.designation}</h1>
            {data.affectation && (
              <p className="text-sm mt-0.5" style={{ color: 'var(--accent)' }}>📍 {data.affectation}</p>
            )}
          </div>
          <div className="text-right text-xs" style={{ color: 'var(--text3)' }}>
            <div>Fiche de vie — FQ008/00</div>
            <div className="font-mono">R.A.I.</div>
          </div>
        </div>
      </div>

      {/* ── Info cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: 'Identification', rows: [
            { label: 'Code', value: data.code },
            { label: 'Désignation', value: data.designation },
            { label: 'Marque / Modèle', value: data.marque || '—' },
            { label: 'N° de série', value: data.n_serie || '—' },
            { label: 'Affectation', value: data.affectation || '—' },
          ]},
          { title: 'Vérification', rows: [
            { label: 'Nécessite vérification', value: data.necessite_verification ? 'Oui' : 'Non' },
            { label: 'Type de vérification', value: data.verif_type || '—' },
            { label: 'Dernière vérification', value: fmtDate(data.date_derniere_verification) },
            { label: 'Prochaine vérification', value:
              <span style={{ color: isOverdue ? 'var(--crit)' : undefined, fontWeight: isOverdue ? 600 : undefined }}>
                {fmtDate(data.date_prochaine_verification)}{isOverdue && ' ⚠ Dépassée'}
              </span>
            },
            { label: 'Date alerte', value: fmtDate(data.date_alerte) },
          ]},
        ].map(({ title, rows }) => (
          <div key={title} className="rounded-[14px] p-5" style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
            <h2 className="text-sm font-bold mb-3 pb-2" style={{ color: 'var(--text)', borderBottom: '1px solid var(--border2)' }}>{title}</h2>
            <dl>{rows.map(r => <InfoRow key={r.label} label={r.label} value={r.value} />)}</dl>
          </div>
        ))}
      </div>

      {/* ── Remarks ── */}
      {data.remarques && (
        <div className="rounded-[12px] p-4" style={{ background: 'var(--warn-soft)', border: '1px solid var(--warn)' }}>
          <h2 className="text-xs font-semibold mb-1" style={{ color: 'var(--warn)' }}>📝 Remarques</h2>
          <p className="text-sm" style={{ color: 'var(--text)' }}>{data.remarques}</p>
        </div>
      )}

      {/* ── Intervention history ── */}
      <div className="rounded-[14px] overflow-hidden" style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border2)' }}>
          <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>📋 Historique des interventions</h2>
          <span className="text-xs" style={{ color: 'var(--text3)' }}>{interventions.length} entrée(s)</span>
        </div>

        {interventions.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm" style={{ color: 'var(--text3)' }}>
            Aucune intervention enregistrée
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--panel2)', borderBottom: '1px solid var(--border2)' }}>
                  {['Date','Nature','Résultat','Visa'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[9.5px] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text3)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {interventions.map((int, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border2)', background: idx%2===0 ? 'var(--panel)' : 'var(--panel2)' }}>
                    <td className="px-4 py-2.5 text-xs font-mono" style={{ color: 'var(--text3)' }}>{int.date || '—'}</td>
                    <td className="px-4 py-2.5" style={{ color: 'var(--text)' }}>{int.nature || '—'}</td>
                    <td className="px-4 py-2.5" style={{ color: 'var(--text2)' }}>{int.resultat || '—'}</td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text3)' }}>{int.visa || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <EcmeFormModal
        ecme={data}
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={() => { setEditOpen(false); reload(); }}
      />
    </div>
  );
}
