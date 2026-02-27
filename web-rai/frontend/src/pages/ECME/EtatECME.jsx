import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ecmeService } from '../../services/api';

// ── Badge helpers ──────────────────────────────────────────────────────────────
const ALERTE_CONFIG = {
  VALABLE:      { label: 'Valable',      cls: 'bg-green-100 text-green-700 border-green-200' },
  VERIFICATION: { label: 'Vérification', cls: 'bg-red-100 text-red-700 border-red-200' },
  EXEMPTE:      { label: 'Exempté',      cls: 'bg-gray-100 text-gray-600 border-gray-200' },
  DECLASSE:     { label: 'Déclassé',     cls: 'bg-zinc-200 text-zinc-600 border-zinc-300 line-through' },
  INCONNU:      { label: 'Inconnu',      cls: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
};

function AlerteBadge({ alerte }) {
  const cfg = ALERTE_CONFIG[alerte] || ALERTE_CONFIG.INCONNU;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-semibold ${cfg.cls}`}>
      {alerte === 'VALABLE'      && '🟢 '}
      {alerte === 'VERIFICATION' && '🔴 '}
      {alerte === 'EXEMPTE'      && '⚪ '}
      {alerte === 'DECLASSE'     && '⚫ '}
      {alerte === 'INCONNU'      && '🟡 '}
      {cfg.label}
    </span>
  );
}

function fmtDate(raw) {
  if (!raw) return '—';
  const d = new Date(raw);
  if (isNaN(d)) return raw;
  return d.toLocaleDateString('fr-FR');
}

// Highlight search terms
function Highlight({ text = '', query = '' }) {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === query.toLowerCase()
          ? <mark key={i} className="bg-yellow-200 rounded-sm">{p}</mark>
          : p
      )}
    </>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function EtatECME() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [records,      setRecords]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [affectations, setAffectations] = useState([]);

  // Filters — initialise from URL query params
  const [search,       setSearch]       = useState('');
  const [filterAff,    setFilterAff]    = useState('');
  const [filterAlerte, setFilterAlerte] = useState(() => searchParams.get('alerte') || '');

  // Pagination
  const PAGE_SIZE = 25;
  const [page, setPage] = useState(1);

  // Load affectation list once
  useEffect(() => {
    ecmeService.getAffectations()
      .then(({ data }) => setAffectations(data))
      .catch(() => {});
  }, []);

  // Load records when filters change
  const load = useCallback(() => {
    setLoading(true);
    setError('');
    const params = {};
    if (filterAff)    params.affectation = filterAff;
    if (filterAlerte) params.alerte      = filterAlerte;
    if (search)       params.search      = search;

    ecmeService.getAll(params)
      .then(({ data }) => { setRecords(data); setPage(1); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [filterAff, filterAlerte, search]);

  useEffect(() => { load(); }, [load]);

  // Stats
  const total      = records.length;
  const valable    = records.filter(r => r.alerte === 'VALABLE').length;
  const verif      = records.filter(r => r.alerte === 'VERIFICATION').length;
  const exempte    = records.filter(r => r.alerte === 'EXEMPTE').length;

  // Paginated slice
  const totalPages = Math.ceil(records.length / PAGE_SIZE);
  const pageSlice  = records.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-6 flex-1 overflow-auto">
      <h1 className="text-2xl font-bold mb-2">🔬 État des ECME</h1>
      <p className="text-sm text-gray-500 mb-5">
        Équipements de Contrôle, de Mesure et d'Essai — Référence FQ0009/01
      </p>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-xs text-gray-500">Total ECME</div>
          <div className="text-3xl font-bold">{total}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="text-xs text-gray-500">Valables</div>
          <div className="text-3xl font-bold text-green-600">{valable}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <div className="text-xs text-gray-500">À vérifier</div>
          <div className="text-3xl font-bold text-red-600">{verif}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-gray-400">
          <div className="text-xs text-gray-500">Exemptés</div>
          <div className="text-3xl font-bold text-gray-500">{exempte}</div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-lg shadow p-4 mb-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-48">
          <label className="text-xs text-gray-500 block mb-1">Recherche</label>
          <input
            type="text"
            placeholder="Code, désignation, marque..."
            className="w-full border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Affectation</label>
          <select
            className="border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={filterAff}
            onChange={e => setFilterAff(e.target.value)}
          >
            <option value="">Toutes</option>
            {affectations.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Statut</label>
          <select
            className="border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={filterAlerte}
            onChange={e => setFilterAlerte(e.target.value)}
          >
            <option value="">Tous</option>
            <option value="VALABLE">🟢 Valable</option>
            <option value="VERIFICATION">🔴 À vérifier</option>
            <option value="EXEMPTE">⚪ Exempté</option>
            <option value="DECLASSE">⚫ Déclassé</option>
          </select>
        </div>
        <button
          onClick={() => { setSearch(''); setFilterAff(''); setFilterAlerte(''); }}
          className="px-3 py-1.5 text-sm text-gray-600 border rounded-md hover:bg-gray-50"
        >
          ✕ Réinitialiser
        </button>
      </div>

      {/* ── Error / Loading ── */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
          ⚠ {error} — Vérifiez que le backend est démarré et que les données sont importées.
        </div>
      )}

      {/* ── Table ── */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Code</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Désignation</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Marque</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden lg:table-cell">Affectation</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Statut</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden xl:table-cell">Dernière vérif.</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden lg:table-cell">Prochaine vérif.</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-400 animate-pulse">
                    Chargement...
                  </td>
                </tr>
              ) : pageSlice.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-400">
                    Aucun résultat
                  </td>
                </tr>
              ) : pageSlice.map(row => (
                <tr
                  key={row.code}
                  className={`hover:bg-blue-50 transition-colors cursor-pointer ${
                    row.alerte === 'DECLASSE' ? 'opacity-50' : ''
                  }`}
                  onClick={() => navigate(`/ecme/${row.code}`)}
                >
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-700">
                    <Highlight text={row.code} query={search} />
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate">
                    <Highlight text={row.designation} query={search} />
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    <Highlight text={row.marque} query={search} />
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs">
                      {row.affectation || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <AlerteBadge alerte={row.alerte} />
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden xl:table-cell">
                    {fmtDate(row.date_derniere_verification)}
                  </td>
                  <td className={`px-4 py-3 text-xs font-medium hidden lg:table-cell ${
                    row.alerte === 'VERIFICATION' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {fmtDate(row.date_prochaine_verification)}
                  </td>
                  <td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => navigate(`/ecme/${row.code}`)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                    >
                      🔍 Inspecter
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50 text-sm">
            <span className="text-gray-500">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, records.length)} sur {records.length}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-100"
              >
                ← Préc.
              </button>
              <span className="px-3 py-1 font-medium">{page} / {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-100"
              >
                Suiv. →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
