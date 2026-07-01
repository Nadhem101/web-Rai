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
          style={{ background: 'linear-gradient(135deg, #0d1828, #0a2820)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-soft)' }}>
              <Cable className="w-4 h-4" style={{ color: 'var(--accent3)' }} />
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
        <div className="flex items-center gap-4 px-6 py-3 flex-shrink-0" style={{ background: 'var(--panel2)', borderBottom: '1px solid var(--border2)' }}>
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5" style={{ color: 'var(--text3)' }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text3)' }}>Testeur</span>
            <span className="ml-1 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold" style={testeurBadge()}>
              {article.numero_testeur || '—'}
            </span>
          </div>
          <div className="w-px h-4" style={{ background: 'var(--border)' }} />
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" style={{ color: 'var(--text3)' }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text3)' }}>Programme</span>
            <span className="ml-1 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold" style={programmeBadge(article.programme_test) || {}}>
              {article.programme_test || '—'}
            </span>
          </div>
        </div>

        {/* Details table */}
        <div className="flex-1 min-h-0 overflow-auto">
          {!article.details?.length ? (
            <div className="flex flex-col items-center justify-center py-12" style={{ color: 'var(--text3)' }}>
              <Cable className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">Aucune nappe renseignée</p>
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--panel2)', borderBottom: '1px solid var(--border2)' }}>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider w-[35%]" style={{ color: 'var(--text3)' }}>Nappe utilisée</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider w-[30%]" style={{ color: 'var(--text3)' }}>Emplacement</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider w-[35%]" style={{ color: 'var(--text3)' }}>Interface</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {article.details.map((d, i) => (
                  <tr key={d.id ?? i} className="transition-colors hover:bg-[var(--panel2)]" style={{ borderBottom: '1px solid var(--border2)' }}>
                    <td className="px-6 py-3 font-mono text-sm font-semibold" style={{ color: 'var(--text)' }}>
                      {d.nappe_utilisee || <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-6 py-3">
                      {d.emplacement ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono" style={{ background: 'var(--panel3)', color: 'var(--text2)' }}>
                          {d.emplacement}
                        </span>
                      ) : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-6 py-3">
                      {d.interface ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono" style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>
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

        <div className="px-6 py-3 flex-shrink-0" style={{ borderTop: '1px solid var(--border2)' }}>
          <p className="text-xs" style={{ color: 'var(--text3)' }}>
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
          style={{ background: 'linear-gradient(135deg, #0d1828, #0a2820)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-soft)' }}>
              {isEditing ? <Pencil className="w-4 h-4" style={{ color: 'var(--accent3)' }} /> : <Plus className="w-4 h-4" style={{ color: 'var(--accent3)' }} />}
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
            <div className="flex items-start gap-2.5 rounded-[10px] px-4 py-3 text-sm" style={{ border: '1px solid var(--crit)', background: 'var(--crit-soft)', color: 'var(--crit)' }}>
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
          <div className="rounded-[10px] p-4 space-y-3" style={{ border: '1px solid var(--border)', background: 'var(--panel2)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className={labelClass} style={{ color: 'var(--text3)', marginBottom: 0 }}>Nappes utilisées</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text3)' }}>Chaque ligne = une position de test</p>
              </div>
              <button type="button" onClick={addDetail}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[8px] text-xs font-bold text-white transition-transform hover:-translate-y-0.5 flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))' }}>
                <Plus className="w-3.5 h-3.5" /> Ajouter
              </button>
            </div>

            {details.length === 0 ? (
              <div className="rounded-[8px] px-4 py-4 text-xs text-center"
                style={{ border: '1px dashed var(--border)', background: 'var(--panel)', color: 'var(--text3)' }}>
                Aucune nappe — cliquez sur «&nbsp;Ajouter&nbsp;» pour en saisir.
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid gap-2 px-2 text-[10px] font-semibold uppercase tracking-wider"
                  style={{ gridTemplateColumns: '2fr 1.5fr 1.5fr auto', color: 'var(--text3)' }}>
                  <span>Nappe utilisée</span>
                  <span>Emplacement</span>
                  <span>Interface</span>
                  <span />
                </div>
                {details.map((d, i) => (
                  <div key={i} className="grid gap-2 items-center rounded-[8px] px-2 py-2"
                    style={{ gridTemplateColumns: '2fr 1.5fr 1.5fr auto', background: 'var(--panel)', border: '1px solid var(--border2)' }}>
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
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--crit-soft)] hover:text-[var(--crit)]"
                      style={{ color: 'var(--text3)' }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <p className="text-[11px] pt-1" style={{ color: 'var(--text3)' }}>
                  {details.length} ligne(s) — créera autant d'enregistrements de nappe.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-[10px] text-sm font-bold text-white disabled:opacity-50 transition-transform hover:-translate-y-0.5"
              style={{ background: saving ? 'var(--text3)' : 'linear-gradient(135deg, var(--accent3), var(--accent2))', boxShadow: '0 6px 18px var(--accent-soft)' }}>
              {saving ? 'Sauvegarde…' : isEditing ? 'Enregistrer les modifications' : 'Créer l\'article'}
            </button>
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-[10px] text-sm font-semibold transition-colors hover:bg-[var(--panel3)]"
              style={{ border: '1px solid var(--border)', color: 'var(--text2)' }}>
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
    <div className="px-[26px] pt-6 pb-10 flex-1 overflow-auto space-y-[18px]" style={{ background: 'var(--bg)' }}>

      {/* ── Header ── */}
      <div className="flex flex-wrap items-end justify-between gap-3.5">
        <div className="flex items-center gap-3.5">
          <div className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            <Cable className="w-5 h-5" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="font-display font-semibold text-[25px]" style={{ color: 'var(--text)', letterSpacing: '-0.4px' }}>Test des câbles faisceaux</h1>
            <p className="text-[13px] mt-1" style={{ color: 'var(--text3)' }}>Référentiel de test — nappes, emplacements et interfaces</p>
          </div>
        </div>
        <button onClick={() => openForm()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))', boxShadow: '0 6px 18px var(--accent-soft)' }}>
          <Plus className="w-4 h-4" /> Nouvel article
        </button>
      </div>

      {/* ── Search bar ── */}
      <div className="relative max-w-[520px]">
        <Search className="absolute left-[13px] top-1/2 -translate-y-1/2 w-[15px] h-[15px] pointer-events-none" style={{ color: 'var(--text3)' }} />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par N° article ou désignation…"
          className="w-full pl-10 pr-9 py-[11px] rounded-[11px] text-[13px] outline-none"
          style={{ background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text)' }} />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70" style={{ color: 'var(--text3)' }}>
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text3)' }}>Testeur :</span>
        {['', ...testeurOptions].map((t) => (
          <button key={t || 'all'} onClick={() => setFilterTesteur(t)}
            className="px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors"
            style={filterTesteur === t
              ? { background: 'var(--warn)', color: '#fff', border: '1px solid var(--warn)' }
              : { background: 'var(--panel)', color: 'var(--text2)', border: '1px solid var(--border)' }}>
            {t || 'Tous'}
          </button>
        ))}
        <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text3)' }}>Programme :</span>
        {['', ...progOptions].map((p) => (
          <button key={p || 'all'} onClick={() => setFilterProg(p)}
            className="px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors"
            style={filterProg === p
              ? { background: 'var(--accent)', color: '#fff', border: '1px solid var(--accent)' }
              : { background: 'var(--panel)', color: 'var(--text2)', border: '1px solid var(--border)' }}>
            {p || 'Tous'}
          </button>
        ))}
      </div>

      {/* ── Results count ── */}
      <p className="text-xs font-medium" style={{ color: 'var(--text3)' }}>
        {loading ? 'Chargement…' : `${filtered.length} article(s) trouvé(s) sur ${articles.length}`}
      </p>

      {/* ── Results ── */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-8 h-8 border-4 rounded-full animate-spin mx-auto mb-3" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
            <p className="text-sm" style={{ color: 'var(--text3)' }}>Chargement des articles…</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16" style={{ color: 'var(--text3)' }}>
          <Cable className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm font-medium">Aucun article trouvé</p>
          {(search || filterTesteur || filterProg) && (
            <button className="mt-2 text-xs hover:underline" style={{ color: 'var(--accent)' }}
              onClick={() => { setSearch(''); setFilterTesteur(''); setFilterProg(''); }}>
              Effacer les filtres
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-[14px] overflow-hidden" style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
          <table className="min-w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--panel2)', borderBottom: '1px solid var(--border2)' }}>
                {['N° Article','Indice','Désignation','Testeur','Programme','Nappes','Actions'].map(h => (
                  <th key={h} className={`px-4 py-2.5 text-[9.5px] font-bold uppercase tracking-[0.1em] ${h==='Nappes'||h==='Actions'?'text-center':'text-left'}`} style={{ color: 'var(--text3)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}
                  className="transition-colors cursor-pointer hover:bg-[var(--panel2)]"
                  style={{ borderBottom: '1px solid var(--border2)' }}
                  onClick={() => setDetailArticle(a)}>
                  <td className="px-4 py-3 font-mono font-bold whitespace-nowrap" style={{ color: 'var(--accent)' }}>{a.numero_article}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--text3)' }}>{a.indice || '—'}</td>
                  <td className="px-4 py-3 max-w-[260px] truncate" style={{ color: 'var(--text)' }} title={a.designation}>{a.designation || '—'}</td>
                  <td className="px-4 py-3">
                    {a.numero_testeur
                      ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold" style={testeurBadge()}>Testeur {a.numero_testeur}</span>
                      : <span style={{ color: 'var(--border)' }}>—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {a.programme_test
                      ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold" style={programmeBadge(a.programme_test) || {}}>{a.programme_test}</span>
                      : <span style={{ color: 'var(--border)' }}>—</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: 'var(--panel2)', color: 'var(--text2)' }}>
                      {a.details?.length ?? 0}
                    </span>
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setDetailArticle(a)} title="Voir la fiche"
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
                        style={{ color: 'var(--text3)' }}><ChevronRight className="w-3.5 h-3.5" /></button>
                      <button onClick={() => openForm(a)} title="Modifier"
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
                        style={{ color: 'var(--text3)' }}><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(a)} title="Supprimer"
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--crit-soft)] hover:text-[var(--crit)]"
                        style={{ color: 'var(--text3)' }}><Trash2 className="w-3.5 h-3.5" /></button>
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
