import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ecmeService } from '../../services/api';
import EcmeFormModal from '../../components/EcmeFormModal';
import { Plus, Pencil, Trash2, Search, FlaskConical, CheckCircle2, AlertCircle, PackageOpen } from 'lucide-react';
import DataLabel from '../../components/ui/DataLabel.jsx';
import KpiCard from '../../components/ui/KpiCard.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import { staggerItemVariants } from '../../components/motion/ScreenTransition.jsx';

const ALERTE_CONFIG = {
  VALABLE:      { label: 'Valable',      variant: 'ok'   },
  VERIFICATION: { label: 'Vérification', variant: 'crit' },
  EXEMPTE:      { label: 'Exempté',      variant: 'info' },
  DECLASSE:     { label: 'Déclassé',     variant: 'info' },
  INCONNU:      { label: 'Inconnu',      variant: 'warn' },
};

function AlerteBadge({ alerte }) {
  const cfg = ALERTE_CONFIG[alerte] || ALERTE_CONFIG.INCONNU;
  return <StatusBadge variant={cfg.variant}>{cfg.label}</StatusBadge>;
}

function fmtDate(raw) {
  if (!raw) return '—';
  const d = new Date(raw);
  if (isNaN(d)) return raw;
  return d.toLocaleDateString('fr-FR');
}

function Highlight({ text = '', query = '' }) {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === query.toLowerCase()
          ? <mark key={i} className="rounded-sm" style={{ background: 'var(--warn-soft)', color: 'var(--warn)' }}>{p}</mark>
          : p
      )}
    </>
  );
}

const fieldStyle = { background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--text)' };

export default function EtatECME() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [records,      setRecords]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [affectations, setAffectations] = useState([]);
  const [search,       setSearch]       = useState('');
  const [filterAff,    setFilterAff]    = useState('');
  const [filterAlerte, setFilterAlerte] = useState(() => searchParams.get('alerte') || '');
  const PAGE_SIZE = 25;
  const [page, setPage] = useState(1);
  const [formModal, setFormModal] = useState({ open: false, ecme: null });

  useEffect(() => {
    ecmeService.getAffectations()
      .then(({ data }) => setAffectations(data))
      .catch(() => {});
  }, []);

  const load = useCallback(() => {
    setLoading(true); setError('');
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

  const handleDelete = async (code, e) => {
    e.stopPropagation();
    if (!window.confirm(`Supprimer définitivement ${code} ?`)) return;
    try {
      await ecmeService.delete(code); load();
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de la suppression');
    }
  };

  const total   = records.length;
  const valable = records.filter(r => r.alerte === 'VALABLE').length;
  const verif   = records.filter(r => r.alerte === 'VERIFICATION').length;
  const exempte = records.filter(r => r.alerte === 'EXEMPTE').length;
  const totalPages = Math.ceil(records.length / PAGE_SIZE);
  const pageSlice  = records.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="px-[26px] pt-6 pb-10 flex-1 overflow-auto space-y-[18px]" style={{ background: 'var(--bg)' }}>

      {/* Header */}
      <motion.div variants={staggerItemVariants} className="flex flex-wrap items-end justify-between gap-3.5">
        <div className="flex items-center gap-3.5">
          <div className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            <FlaskConical className="w-5 h-5" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="font-display font-semibold text-[25px]" style={{ color: 'var(--text)', letterSpacing: '-0.4px' }}>État des ECME</h1>
            <p className="text-[13px] mt-1" style={{ color: 'var(--text3)' }}>Équipements de Contrôle, de Mesure et d'Essai — Réf. FQ0009/01</p>
          </div>
        </div>
        <button onClick={() => setFormModal({ open: true, ecme: null })}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))', boxShadow: '0 6px 18px var(--accent-soft)' }}>
          <Plus className="w-4 h-4" /> Nouvel ECME
        </button>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <KpiCard label="Total ECME"  value={total}   icon={FlaskConical}  accentVariant="accent" loading={loading} />
        <KpiCard label="Valables"    value={valable}  icon={CheckCircle2} accentVariant="ok"     loading={loading} />
        <KpiCard label="À vérifier"  value={verif}    icon={AlertCircle}  accentVariant="crit"   loading={loading} />
        <KpiCard label="Exemptés"    value={exempte}  icon={PackageOpen}  accentVariant="warn"   loading={loading} />
      </div>

      {/* Filters */}
      <motion.div variants={staggerItemVariants} className="rounded-[14px] p-4 flex flex-wrap gap-3 items-end"
        style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
        <div className="flex-1 min-w-[180px] relative">
          <DataLabel as="p" className="mb-1">Recherche</DataLabel>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: 'var(--text3)' }} />
            <input type="text" placeholder="Code, désignation, marque..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-[8px] pl-9 pr-3 py-1.5 text-sm outline-none"
              style={fieldStyle} />
          </div>
        </div>
        <div>
          <DataLabel as="p" className="mb-1">Affectation</DataLabel>
          <select value={filterAff} onChange={e => setFilterAff(e.target.value)}
            className="rounded-[8px] px-3 py-1.5 text-sm outline-none" style={fieldStyle}>
            <option value="">Toutes</option>
            {affectations.map(a => <option key={a} value={a} style={{ color: '#000' }}>{a}</option>)}
          </select>
        </div>
        <div>
          <DataLabel as="p" className="mb-1">Statut</DataLabel>
          <select value={filterAlerte} onChange={e => setFilterAlerte(e.target.value)}
            className="rounded-[8px] px-3 py-1.5 text-sm outline-none" style={fieldStyle}>
            <option value="">Tous</option>
            <option value="VALABLE">🟢 Valable</option>
            <option value="VERIFICATION">🔴 À vérifier</option>
            <option value="EXEMPTE">⚪ Exempté</option>
            <option value="DECLASSE">⚫ Déclassé</option>
          </select>
        </div>
        <button onClick={() => { setSearch(''); setFilterAff(''); setFilterAlerte(''); }}
          className="px-3 py-1.5 text-sm rounded-[8px] transition-colors hover:bg-[var(--panel3)]"
          style={{ border: '1px solid var(--border)', color: 'var(--text2)' }}>
          ✕ Réinitialiser
        </button>
      </motion.div>

      {error && (
        <div className="rounded-[10px] p-3 text-sm" style={{ background: 'var(--crit-soft)', border: '1px solid var(--crit)', color: 'var(--crit)' }}>
          ⚠ {error}
        </div>
      )}

      {/* Table */}
      <motion.div variants={staggerItemVariants} className="rounded-[14px] overflow-hidden"
        style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--panel2)', borderBottom: '1px solid var(--border2)' }}>
                <th className="px-4 py-3 text-left"><DataLabel>Code</DataLabel></th>
                <th className="px-4 py-3 text-left"><DataLabel>Désignation</DataLabel></th>
                <th className="px-4 py-3 text-left hidden md:table-cell"><DataLabel>Marque</DataLabel></th>
                <th className="px-4 py-3 text-left hidden md:table-cell"><DataLabel>N° Série</DataLabel></th>
                <th className="px-4 py-3 text-left hidden lg:table-cell"><DataLabel>Affectation</DataLabel></th>
                <th className="px-4 py-3 text-left"><DataLabel>Statut</DataLabel></th>
                <th className="px-4 py-3 text-left hidden xl:table-cell"><DataLabel>Remarques</DataLabel></th>
                <th className="px-4 py-3 text-center"><DataLabel>Actions</DataLabel></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-10 text-center animate-pulse" style={{ color: 'var(--text3)' }}>Chargement...</td></tr>
              ) : pageSlice.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-10 text-center" style={{ color: 'var(--text3)' }}>Aucun résultat</td></tr>
              ) : pageSlice.map(row => (
                <tr key={row.code}
                  className="cursor-pointer transition-colors hover:bg-[var(--panel2)]"
                  style={{ borderBottom: '1px solid var(--border2)', opacity: row.alerte === 'DECLASSE' ? 0.5 : 1 }}
                  onClick={() => navigate(`/ecme/${row.code}`)}>
                  <td className="px-4 py-3 font-mono text-xs font-bold" style={{ color: 'var(--accent)' }}>
                    <Highlight text={row.code} query={search} />
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate" style={{ color: 'var(--text)' }}>
                    <Highlight text={row.designation} query={search} />
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell" style={{ color: 'var(--text2)' }}>
                    <Highlight text={row.marque} query={search} />
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell font-mono text-xs" style={{ color: 'var(--text3)' }}>
                    {row.n_serie || '—'}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="px-2 py-0.5 rounded text-xs" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                      {row.affectation || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3"><AlerteBadge alerte={row.alerte} /></td>
                  <td className="px-4 py-3 text-xs hidden xl:table-cell max-w-[200px] truncate" style={{ color: 'var(--text3)' }}
                    title={row.remarques || ''}>
                    {row.remarques || '—'}
                  </td>
                  <td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => navigate(`/ecme/${row.code}`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] text-xs font-bold text-white"
                        style={{ background: 'var(--accent)' }} title="Inspecter">🔍</button>
                      <button onClick={e => { e.stopPropagation(); setFormModal({ open: true, ecme: row }); }}
                        className="w-7 h-7 rounded-[6px] flex items-center justify-center transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
                        style={{ color: 'var(--text3)' }} title="Modifier">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={e => handleDelete(row.code, e)}
                        className="w-7 h-7 rounded-[6px] flex items-center justify-center transition-colors hover:bg-[var(--crit-soft)] hover:text-[var(--crit)]"
                        style={{ color: 'var(--text3)' }} title="Supprimer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 text-sm" style={{ borderTop: '1px solid var(--border2)', background: 'var(--panel2)' }}>
            <span style={{ color: 'var(--text3)' }}>
              {(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, records.length)} sur {records.length}
            </span>
            <div className="flex gap-2">
              <button disabled={page===1} onClick={() => setPage(p => p-1)}
                className="px-3 py-1 rounded-[8px] disabled:opacity-40 transition-colors hover:bg-[var(--panel3)]"
                style={{ border: '1px solid var(--border)', color: 'var(--text2)' }}>← Préc.</button>
              <span className="px-3 py-1 font-medium" style={{ color: 'var(--text2)' }}>{page} / {totalPages}</span>
              <button disabled={page===totalPages} onClick={() => setPage(p => p+1)}
                className="px-3 py-1 rounded-[8px] disabled:opacity-40 transition-colors hover:bg-[var(--panel3)]"
                style={{ border: '1px solid var(--border)', color: 'var(--text2)' }}>Suiv. →</button>
            </div>
          </div>
        )}
      </motion.div>

      <EcmeFormModal
        ecme={formModal.ecme}
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, ecme: null })}
        onSuccess={() => { setFormModal({ open: false, ecme: null }); load(); }}
      />
    </div>
  );
}
