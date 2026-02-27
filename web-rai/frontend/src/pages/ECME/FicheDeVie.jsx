import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ecmeService } from '../../services/api';

// ── Helpers ───────────────────────────────────────────────────────────────────
const ALERTE_CONFIG = {
  VALABLE:      { label: 'Valable',      cls: 'bg-green-100 text-green-700 border-green-200', dot: '🟢' },
  VERIFICATION: { label: 'Vérification requise', cls: 'bg-red-100 text-red-700 border-red-200', dot: '🔴' },
  EXEMPTE:      { label: 'Exempté de vérification', cls: 'bg-gray-100 text-gray-600 border-gray-200', dot: '⚪' },
  DECLASSE:     { label: 'Déclassé définitivement', cls: 'bg-zinc-100 text-zinc-600 border-zinc-300', dot: '⚫' },
  INCONNU:      { label: 'Statut inconnu',    cls: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: '🟡' },
};

function fmtDate(raw) {
  if (!raw) return '—';
  const d = new Date(raw);
  if (isNaN(d)) return raw;
  return d.toLocaleDateString('fr-FR');
}

function InfoRow({ label, value, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-start gap-1 py-2 border-b last:border-0 ${className}`}>
      <dt className="text-xs font-semibold text-gray-500 sm:w-52 flex-shrink-0">{label}</dt>
      <dd className="text-sm text-gray-800 flex-1">{value || '—'}</dd>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function FicheDeVie() {
  const { code }   = useParams();
  const navigate   = useNavigate();
  const [data,     setData]    = useState(null);
  const [loading,  setLoading] = useState(true);
  const [error,    setError]   = useState('');

  useEffect(() => {
    setLoading(true);
    ecmeService.getOne(code)
      .then(({ data: d }) => setData(d))
      .catch((e) => setError(e.response?.data?.error || e.message))
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) {
    return (
      <div className="p-6 flex-1 overflow-auto flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">Chargement de la fiche...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 flex-1 overflow-auto">
        <button onClick={() => navigate(-1)} className="mb-4 text-blue-600 hover:underline text-sm">
          ← Retour
        </button>
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
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
    <div className="p-6 flex-1 overflow-auto">
      {/* ── Back button ── */}
      <button
        onClick={() => navigate('/ecme')}
        className="mb-4 flex items-center gap-1 text-blue-600 hover:underline text-sm"
      >
        ← Retour à la liste
      </button>

      {/* ── Header ── */}
      <div className="bg-white rounded-lg shadow p-5 mb-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                {data.code}
              </span>
              <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full border text-xs font-semibold ${alerteCfg.cls}`}>
                {alerteCfg.dot} {alerteCfg.label}
              </span>
              {isOverdue && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full animate-pulse">
                  ⚠ EN RETARD
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-gray-800">{data.designation}</h1>
            {data.affectation && (
              <p className="text-sm text-indigo-600 mt-0.5">
                📍 {data.affectation}
              </p>
            )}
          </div>
          <div className="text-right text-xs text-gray-400">
            <div>Fiche de vie — FQ008/00</div>
            <div>R.A.I.</div>
          </div>
        </div>
      </div>

      {/* ── Info cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

        {/* Identity */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">Identification</h2>
          <dl>
            <InfoRow label="Code" value={data.code} />
            <InfoRow label="Désignation" value={data.designation} />
            <InfoRow label="Marque / Modèle" value={data.marque || '—'} />
            <InfoRow label="N° de série" value={data.n_serie || '—'} />
            <InfoRow label="Affectation" value={data.affectation || '—'} />
          </dl>
        </div>

        {/* Verification */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b">Vérification</h2>
          <dl>
            <InfoRow
              label="Nécessite vérification"
              value={data.necessite_verification ? 'Oui' : 'Non'}
            />
            <InfoRow label="Type de vérification" value={data.verif_type || '—'} />
            <InfoRow label="Dernière vérification" value={fmtDate(data.date_derniere_verification)} />
            <InfoRow
              label="Prochaine vérification"
              value={
                <span className={isOverdue ? 'text-red-600 font-semibold' : ''}>
                  {fmtDate(data.date_prochaine_verification)}
                  {isOverdue && ' ⚠ Dépassée'}
                </span>
              }
            />
            <InfoRow label="Date alerte" value={fmtDate(data.date_alerte)} />
          </dl>
        </div>
      </div>

      {/* ── Remarks ── */}
      {data.remarques && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-5">
          <h2 className="text-xs font-semibold text-amber-700 mb-1">📝 Remarques</h2>
          <p className="text-sm text-amber-900">{data.remarques}</p>
        </div>
      )}

      {/* ── Intervention history ── */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">
            📋 Historique des interventions
          </h2>
          <span className="text-xs text-gray-400">
            {interventions.length} entrée(s)
          </span>
        </div>

        {interventions.length === 0 ? (
          <div className="px-5 py-8 text-center text-gray-400 text-sm">
            Aucune intervention enregistrée
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 w-32">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Nature</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Résultat</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 w-28">Visa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {interventions.map((int, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2.5 text-xs text-gray-500 font-mono">{int.date || '—'}</td>
                    <td className="px-4 py-2.5">{int.nature || '—'}</td>
                    <td className="px-4 py-2.5 text-gray-600">{int.resultat || '—'}</td>
                    <td className="px-4 py-2.5 text-gray-500 text-xs">{int.visa || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
