import React, { useEffect, useMemo, useState } from 'react';
import { articleTestService } from '../../services/api';
import {
  Search, Plus, X, Pencil, Trash2, Cable, AlertCircle,
  ChevronRight, Cpu, BookOpen, XCircle,
} from 'lucide-react';

// ── Helpers ────────────────────────────────────────────────
const normalize = (v = '') =>
  String(v ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

const PROGRAMMES = ['Auto-apprentissage', 'Programmé'];
const TESTEURS   = ['1', '2', '3', '2 ET 3', '3 &2'];

const programmeBadge = (p) => {
  if (!p) return null;
  if (normalize(p) === 'programme' || normalize(p).startsWith('programm'))
    return { background: 'var(--accent-soft)', color: 'var(--accent)' };
  return { background: 'var(--info-soft)', color: 'var(--info)' };
};

const testeurBadge = () => ({ background: 'var(--warn-soft)', color: 'var(--warn)' });

// ── Shared styles ──────────────────────────────────────────
const fieldClass = 'w-full rounded-[10px] px-4 py-2.5 text-sm outline-none transition-colors';
const fieldStyle = { background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--text)' };
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em]';
const cellClass  = 'w-full rounded-[8px] px-3 py-2 text-xs outline-none transition-colors';
const cellStyle  = { background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--text)' };

// ─────────────────────────────────────────────────────────────
// Detail modal — shows the test card for one article
// ─────────────────────────────────────────────────────────────
const DetailModal = ({ article, onClose, onEdit }) => {
  if (!article) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="flex max-h-[92vh] min-h-0 w-full max-w-2xl flex-col overflow-hidden rounded-[18px] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 flex-shrink-0"
          style={{ background: '#0f1d35', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 flex items-center justify-center flex-shrink-0">
              <Cable className="w-4 h-4 text-sky-300" />
            </div>
            <div className="min-w-0">
              <p className="text-base font-bold text-white leading-tight font-mono truncate">
                {article.numero_article}
                {article.indice ? <span className="ml-2 text-slate-400 text-sm font-normal">Ind.{article.indice}</span> : null}
              </p>
              <p className="text-xs text-slate-400 mt-0.5 truncate">{article.designation || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => { onClose(); onEdit(article); }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-sky-300 hover:bg-white/10 transition-colors"
              title="Modifier">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Test info banner */}
        <div className="flex items-center gap-4 px-6 py-3 bg-slate-50 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Testeur</span>
            <span className="ml-1 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold" style={testeurBadge()}>
              {article.numero_testeur || '—'}
            </span>
          </div>
          <div className="w-px h-4 bg-slate-200" />
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Programme</span>
            <span className="ml-1 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold" style={programmeBadge(article.programme_test) || {}}>
              {article.programme_test || '—'}
            </span>
          </div>
        </div>

        {/* Details table */}
        <div className="flex-1 min-h-0 overflow-auto">
          {!article.details?.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Cable className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">Aucune nappe renseignée</p>
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 w-[35%]">Nappe utilisée</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 w-[30%]">Emplacement</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 w-[35%]">Interface</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {article.details.map((d, i) => (
                  <tr key={d.id ?? i} className="hover:bg-sky-50/20 transition-colors">
                    <td className="px-6 py-3 font-mono text-sm font-semibold text-slate-700">
                      {d.nappe_utilisee || <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-6 py-3">
                      {d.emplacement ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700 font-mono">
                          {d.emplacement}
                        </span>
                      ) : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-6 py-3">
                      {d.interface ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 font-mono">
                          {d.interface}
                        </span>
                      ) : <span className="text-slate-300">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="px-6 py-3 border-t border-slate-100 flex-shrink-0">
          <p className="text-xs text-slate-400">
            {article.details?.length ?? 0} nappe(s) enregistrée(s)
          </p>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Form modal — create or edit an article
// ─────────────────────────────────────────────────────────────
const EMPTY_DETAIL = () => ({ nappe_utilisee: '', emplacement: '', interface: '' });

const FormModal = ({ article, onClose, onSaved }) => {
  const isEditing = Boolean(article?.id);
  const [form, setForm] = useState({
    numero_article: article?.numero_article ?? '',
    indice:         article?.indice         ?? '',
    designation:    article?.designation    ?? '',
    numero_testeur: article?.numero_testeur ?? '',
    programme_test: article?.programme_test ?? '',
  });
  const [details, setDetails] = useState(
    article?.details?.length
      ? article.details.map((d) => ({ nappe_utilisee: d.nappe_utilisee ?? '', emplacement: d.emplacement ?? '', interface: d.interface ?? '' }))
      : []
  );
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };
  const handleDetailChange = (i, field, value) =>
    setDetails((prev) => prev.map((d, idx) => idx === i ? { ...d, [field]: value } : d));
  const addDetail    = () => setDetails((p) => [...p, EMPTY_DETAIL()]);
  const removeDetail = (i) => setDetails((p) => p.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.numero_article.trim()) { setError('Le numéro article est obligatoire.'); return; }
    setSaving(true); setError('');
    try {
      const payload = { ...form, details };
      if (isEditing) await articleTestService.update(article.id, payload);
      else           await articleTestService.create(payload);
      onSaved();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] min-h-0 w-full max-w-2xl flex-col overflow-hidden rounded-[18px] shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 flex-shrink-0"
          style={{ background: '#0f1d35', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 flex items-center justify-center flex-shrink-0">
              {isEditing ? <Pencil className="w-4 h-4 text-sky-300" /> : <Plus className="w-4 h-4 text-sky-300" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                {isEditing ? 'Modifier l\'article' : 'Nouvel article'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEditing ? `N° ${article.numero_article}` : 'Renseignez les informations ci-dessous'}
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Row 1 */}
          <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
            <label className="block">
              <span className={labelClass} style={{ color: 'var(--text3)' }}>N° Article <span className="text-red-400">*</span></span>
              <input type="text" name="numero_article" value={form.numero_article}
                onChange={handleChange} required className={fieldClass} style={fieldStyle}
                placeholder="ex : KU0761073300" />
            </label>
            <label className="block">
              <span className={labelClass} style={{ color: 'var(--text3)' }}>Indice</span>
              <input type="text" name="indice" value={form.indice}
                onChange={handleChange} className={fieldClass} style={fieldStyle} placeholder="ex : 0, A, B…" />
            </label>
          </div>

          {/* Designation */}
          <label className="block">
            <span className={labelClass} style={{ color: 'var(--text3)' }}>Désignation</span>
            <input type="text" name="designation" value={form.designation}
              onChange={handleChange} className={fieldClass} style={fieldStyle}
              placeholder="ex : HARNESS WIRING SAE" />
          </label>

          {/* Testeur + Programme */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass} style={{ color: 'var(--text3)' }}>N° Testeur</span>
              <input type="text" name="numero_testeur" value={form.numero_testeur}
                onChange={handleChange} list="testeur-opts" className={fieldClass} style={fieldStyle}
                placeholder="ex : 1, 2, 3, 2 ET 3…" />
              <datalist id="testeur-opts">
                {TESTEURS.map((t) => <option key={t} value={t} />)}
              </datalist>
            </label>
            <label className="block">
              <span className={labelClass} style={{ color: 'var(--text3)' }}>Programme test</span>
              <select name="programme_test" value={form.programme_test}
                onChange={handleChange} className={fieldClass} style={fieldStyle}>
                <option value="">— Sélectionner —</option>
                {PROGRAMMES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
          </div>

          {/* Nappes (details) */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className={labelClass + ' mb-0'}>Nappes utilisées</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Chaque ligne = une position de test</p>
              </div>
              <button type="button" onClick={addDetail}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 transition-colors flex-shrink-0">
                <Plus className="w-3.5 h-3.5" /> Ajouter
              </button>
            </div>

            {details.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-4 text-xs text-slate-400 text-center">
                Aucune nappe — cliquez sur «&nbsp;Ajouter&nbsp;» pour en saisir.
              </div>
            ) : (
              <div className="space-y-2">
                {/* Column headers */}
                <div className="grid gap-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                  style={{ gridTemplateColumns: '2fr 1.5fr 1.5fr auto' }}>
                  <span>Nappe utilisée</span>
                  <span>Emplacement</span>
                  <span>Interface</span>
                  <span />
                </div>
                {details.map((d, i) => (
                  <div key={i} className="grid gap-2 items-center bg-white rounded-lg border border-slate-200 px-2 py-2"
                    style={{ gridTemplateColumns: '2fr 1.5fr 1.5fr auto' }}>
                    <input type="text" value={d.nappe_utilisee} placeholder="ex : 1/J1, 2-J2…"
                      onChange={(e) => handleDetailChange(i, 'nappe_utilisee', e.target.value)}
                      className={cellClass} style={cellStyle} />
                    <input type="text" value={d.emplacement} placeholder="ex : C-15"
                      onChange={(e) => handleDetailChange(i, 'emplacement', e.target.value)}
                      className={cellClass} style={cellStyle} />
                    <input type="text" value={d.interface} placeholder="ex : P-8"
                      onChange={(e) => handleDetailChange(i, 'interface', e.target.value)}
                      className={cellClass} style={cellStyle} />
                    <button type="button" onClick={() => removeDetail(i)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <p className="text-[11px] text-slate-400 pt-1">
                  {details.length} ligne(s) — créera autant d'enregistrements de nappe.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: saving ? 'var(--text3)' : 'linear-gradient(135deg, var(--accent3), var(--accent2))' }}>
              {saving ? 'Sauvegarde…' : isEditing ? 'Enregistrer les modifications' : 'Créer l\'article'}
            </button>
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────
const TestCables = () => {
  const [articles,       setArticles]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [search,         setSearch]         = useState('');
  const [filterTesteur,  setFilterTesteur]  = useState('');
  const [filterProg,     setFilterProg]     = useState('');
  const [detailArticle,  setDetailArticle]  = useState(null);
  const [formArticle,    setFormArticle]    = useState(null);
  const [formOpen,       setFormOpen]       = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await articleTestService.getAll();
      setArticles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur chargement articles test:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Client-side filter (fast UX, data is all loaded)
  const filtered = useMemo(() => {
    const q = normalize(search);
    return articles.filter((a) => {
      if (q && !normalize(a.numero_article).includes(q) && !normalize(a.designation).includes(q) && !normalize(a.indice).includes(q)) return false;
      if (filterTesteur && normalize(a.numero_testeur) !== normalize(filterTesteur)) return false;
      if (filterProg && normalize(a.programme_test) !== normalize(filterProg)) return false;
      return true;
    });
  }, [articles, search, filterTesteur, filterProg]);

  const handleDelete = async (article) => {
    if (!window.confirm(`Supprimer ${article.numero_article} ?`)) return;
    try {
      await articleTestService.delete(article.id);
      load();
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const openForm = (article = null) => {
    setFormArticle(article);
    setFormOpen(true);
  };

  // Unique testeur values from data
  const testeurOptions = useMemo(() => {
    const s = new Set(articles.map((a) => a.numero_testeur).filter(Boolean));
    return [...s].sort();
  }, [articles]);

  const progOptions = ['Auto-apprentissage', 'Programmé'];

  return (
    <div className="flex-1 overflow-auto p-6 space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Cable className="w-5 h-5 text-slate-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Test des câbles faisceaux</h1>
            <p className="text-xs text-slate-400 mt-0.5">Référentiel de test — nappes, emplacements et interfaces</p>
          </div>
        </div>
        <button onClick={() => openForm()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
          style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))' }}>
          <Plus className="w-4 h-4" />
          Nouvel article
        </button>
      </div>

      {/* ── Search bar ── */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par N° article ou désignation…"
          className="w-full pl-10 pr-9 py-2.5 border border-slate-200 rounded-xl bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        />
        {search && (
          <button onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Testeur :</span>
        {['', ...testeurOptions].map((t) => (
          <button key={t || 'all'}
            onClick={() => setFilterTesteur(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
              filterTesteur === t
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}>
            {t || 'Tous'}
          </button>
        ))}
        <div className="w-px h-5 bg-slate-200 mx-1" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Programme :</span>
        {['', ...progOptions].map((p) => (
          <button key={p || 'all'}
            onClick={() => setFilterProg(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
              filterProg === p
                ? 'bg-sky-500 text-white border-sky-500'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}>
            {p || 'Tous'}
          </button>
        ))}
      </div>

      {/* ── Results count ── */}
      <p className="text-xs text-slate-400 font-medium">
        {loading ? 'Chargement…' : `${filtered.length} article(s) trouvé(s) sur ${articles.length}`}
      </p>

      {/* ── Results ── */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-400">Chargement des articles…</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Cable className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm font-medium">Aucun article trouvé</p>
          {(search || filterTesteur || filterProg) && (
            <button className="mt-2 text-xs text-sky-500 hover:underline"
              onClick={() => { setSearch(''); setFilterTesteur(''); setFilterProg(''); }}>
              Effacer les filtres
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">N° Article</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Indice</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Désignation</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Testeur</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Programme</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Nappes</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((a) => (
                <tr key={a.id}
                  className="hover:bg-sky-50/30 transition-colors cursor-pointer group"
                  onClick={() => setDetailArticle(a)}>
                  <td className="px-4 py-3 font-mono font-semibold text-sky-700 whitespace-nowrap">
                    {a.numero_article}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {a.indice || <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-700 max-w-[260px] truncate" title={a.designation}>
                    {a.designation || <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {a.numero_testeur ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold" style={testeurBadge()}>
                        Testeur {a.numero_testeur}
                      </span>
                    ) : <span className="text-slate-300 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {a.programme_test ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold" style={programmeBadge(a.programme_test) || {}}>
                        {a.programme_test}
                      </span>
                    ) : <span className="text-slate-300 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                      {a.details?.length ?? 0}
                    </span>
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setDetailArticle(a)} title="Voir la fiche"
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => openForm(a)} title="Modifier"
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(a)} title="Supprimer"
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modals ── */}
      {detailArticle && (
        <DetailModal
          article={detailArticle}
          onClose={() => setDetailArticle(null)}
          onEdit={(a) => { setFormArticle(a); setFormOpen(true); }}
        />
      )}
      {formOpen && (
        <FormModal
          article={formArticle}
          onClose={() => { setFormOpen(false); setFormArticle(null); }}
          onSaved={() => { load(); setDetailArticle(null); }}
        />
      )}
    </div>
  );
};

export default TestCables;
