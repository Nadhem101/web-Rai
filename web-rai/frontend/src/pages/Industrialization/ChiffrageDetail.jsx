import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  chiffrageService, chiffrageLigneService,
  connecteurCatalogueService, fournisseurCatalogueService,
} from '../../services/api';
import {
  ChevronLeft, Plus, Trash2, Save, Download, Check,
  Factory, Pencil, X, Image, Search, BookOpen,
  Link2, Package, Layers, FileText, ToggleLeft, ToggleRight,
} from 'lucide-react';

// ── Constants ──────────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: 'brouillon', label: 'Brouillon' },
  { value: 'en_cours',  label: 'En cours'  },
  { value: 'valide',    label: 'Validé'    },
  { value: 'archive',   label: 'Archivé'   },
];

const STATUT_OPTS = [
  { value: 'en_stock',    label: 'En stock',         cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { value: 'a_commander', label: 'À commander',      cls: 'bg-amber-100 text-amber-800 border-amber-200'       },
  { value: 'rupture',     label: 'Rupture de stock', cls: 'bg-red-100 text-red-700 border-red-200'              },
  { value: 'interne',     label: 'Solution interne', cls: 'bg-purple-100 text-purple-700 border-purple-200'    },
];

const COMPOSANT_TYPES = [
  { value: 'cosse',  label: 'Cosse',  icon: Link2,    color: 'sky'    },
  { value: 'joint',  label: 'Joint',  icon: Package,  color: 'amber'  },
  { value: 'cale',   label: 'Cale',   icon: Layers,   color: 'indigo' },
  { value: 'autre',  label: 'Autre',  icon: FileText, color: 'slate'  },
];

const TYPE_STYLE = {
  cosse:  { badge: 'bg-sky-100 text-sky-700 border-sky-200',     bar: 'border-l-sky-400'    },
  joint:  { badge: 'bg-amber-100 text-amber-700 border-amber-200', bar: 'border-l-amber-400' },
  cale:   { badge: 'bg-indigo-100 text-indigo-700 border-indigo-200', bar: 'border-l-indigo-400' },
  autre:  { badge: 'bg-slate-100 text-slate-600 border-slate-200',  bar: 'border-l-slate-300' },
};

const statutCls   = (v) => STATUT_OPTS.find(o => o.value === v)?.cls   || STATUT_OPTS[1].cls;
const statutLabel = (v) => STATUT_OPTS.find(o => o.value === v)?.label || 'À commander';

const fieldCls = 'w-full rounded-[10px] px-3 py-2 text-sm outline-none transition-colors';
const fieldClsStyle = { background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--text)' };
const labelCls = 'mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500';

const createCmpId = () => `cmp-${Date.now()}-${Math.floor(Math.random()*9999)}`;

const emptyComposant = (type = 'cosse') => ({
  id: createCmpId(),
  type,
  designation: '',
  ref_fournisseur: '',
  ref_interne: '',
  qte_besoin: 1,
  acheter: true,
  recu: false,
  fournisseur: '',
  prix_unitaire: 0,
  statut: 'a_commander',
});

const EMPTY_LIGNE = (chiffrageId, ordre) => ({
  _lid: `new-${Date.now()}`, id: null, chiffrage_id: Number(chiffrageId), ordre,
  ref_connecteur: '', designation: '', ref_interne: '',
  photo_url: '', fournisseur: '', ref_fournisseur: '',
  statut_stock: 'a_commander', prix_unitaire: 0,
  quantite: 1, qte_besoin: 1,
  besoin_contrepartie: true,
  composants: [],
  commentaire_rai: '',
  // legacy kept for backward compat
  ref_contrepartie: '', fournisseur_cp: '', ref_fournisseur_cp: '',
  statut_cp: 'a_commander', prix_cp: 0, solution_interne: '',
});

const rowTot = (l) => {
  const connTotal = (Number(l.prix_unitaire) || 0) * (Number(l.quantite) || 1);
  const cmpTotal  = (l.composants || []).reduce((s, c) =>
    s + (Number(c.prix_unitaire) || 0) * (Number(c.qte_besoin) || 1), 0);
  return connTotal + cmpTotal;
};
const grandTot = (ls) => ls.reduce((s, l) => s + rowTot(l), 0);

// ── Catalogue search ───────────────────────────────────────
const ConnecteurSearch = ({ value, onChange, onSelect }) => {
  const [results, setResults] = useState([]);
  const [open,    setOpen]    = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    clearTimeout(timer.current);
    if (!value.trim()) { setResults([]); setOpen(false); return; }
    timer.current = setTimeout(async () => {
      try {
        const data = await connecteurCatalogueService.getAll({ q: value });
        setResults(Array.isArray(data) ? data.slice(0, 8) : []);
        setOpen(true);
      } catch { setResults([]); }
    }, 250);
    return () => clearTimeout(timer.current);
  }, [value]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => value.trim() && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          className={fieldCls + ' pl-8'} placeholder="Réf. connecteur ou désignation…" />
      </div>
      {open && results.length > 0 && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5">
            <BookOpen className="w-3 h-3 text-slate-400" />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Catalogue connecteurs</p>
          </div>
          {results.map(c => (
            <button key={c.id} type="button"
              onMouseDown={e => { e.preventDefault(); onSelect(c); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-sky-50 transition-colors border-b border-slate-50 last:border-0">
              {c.photo_url && <img src={c.photo_url} alt="" className="w-8 h-8 object-contain rounded flex-shrink-0 border border-slate-100" />}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 font-mono">{c.ref_connecteur}</p>
                <p className="text-[11px] text-slate-500 truncate">{c.designation}</p>
              </div>
              <span className="text-[10px] text-sky-500 font-semibold flex-shrink-0">Utiliser →</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Composant card in panel ────────────────────────────────
const ComposantCard = ({ cmp, index, fournisseurs, onChange, onRemove }) => {
  const [open, setOpen] = useState(true);
  const style = TYPE_STYLE[cmp.type] || TYPE_STYLE.autre;
  const typeCfg = COMPOSANT_TYPES.find(t => t.value === cmp.type) || COMPOSANT_TYPES[3];
  const IconComp = typeCfg.icon;

  const set = (field, val) => onChange(index, { ...cmp, [field]: val });

  return (
    <div className={`rounded-xl border border-slate-200 overflow-hidden border-l-4 ${style.bar}`}>
      {/* Card header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 cursor-pointer" onClick={() => setOpen(o => !o)}>
        <IconComp className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        <span className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5 border ${style.badge}`}>
          {typeCfg.label}
        </span>
        <span className="text-xs text-slate-600 flex-1 truncate">
          {cmp.ref_fournisseur || cmp.designation || <span className="italic text-slate-400">Sans référence</span>}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Acheter badge */}
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
            cmp.acheter ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
          }`}>
            {cmp.acheter ? 'À acheter' : 'En stock'}
          </span>
          {cmp.recu && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-emerald-100 text-emerald-700 border-emerald-200">Reçu ✓</span>
          )}
          <button type="button" onClick={e => { e.stopPropagation(); onRemove(index); }}
            className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {open && (
        <div className="p-3 space-y-3 bg-white">
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className={labelCls}>Réf. fournisseur</span>
              <input type="text" value={cmp.ref_fournisseur} onChange={e => set('ref_fournisseur', e.target.value)}
                className={fieldCls} style={fieldClsStyle} placeholder="Ex: 966140-5" />
            </label>
            <label className="block">
              <span className={labelCls}>Réf. interne</span>
              <input type="text" value={cmp.ref_interne} onChange={e => set('ref_interne', e.target.value)}
                className={fieldCls} style={fieldClsStyle} placeholder="Ex: 27062567..." />
            </label>
          </div>

          <label className="block">
            <span className={labelCls}>Désignation</span>
            <input type="text" value={cmp.designation} onChange={e => set('designation', e.target.value)}
              className={fieldCls} style={fieldClsStyle} placeholder="Description courte…" />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className={labelCls}>Fournisseur</span>
              <input type="text" value={cmp.fournisseur} onChange={e => set('fournisseur', e.target.value)}
                list="fourn-list-cmp" className={fieldCls} style={fieldClsStyle} placeholder="Ex: Mouser…" />
              <datalist id="fourn-list-cmp">
                {fournisseurs.map(f => <option key={f.id} value={f.nom} />)}
              </datalist>
            </label>
            <label className="block">
              <span className={labelCls}>Prix unitaire (€)</span>
              <input type="number" min="0" step="0.01" value={cmp.prix_unitaire}
                onChange={e => set('prix_unitaire', parseFloat(e.target.value) || 0)}
                className={fieldCls + ' text-right'} />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className={labelCls}>Qté besoin</span>
              <input type="number" min="1" step="1" value={cmp.qte_besoin}
                onChange={e => set('qte_besoin', parseInt(e.target.value) || 1)}
                className={fieldCls + ' text-right'} />
            </label>
            <label className="block">
              <span className={labelCls}>Statut</span>
              <select value={cmp.statut} onChange={e => set('statut', e.target.value)}
                className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold focus:outline-none ${statutCls(cmp.statut)}`}>
                {STATUT_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
          </div>

          {/* Acheter / Reçu toggles */}
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => set('acheter', !cmp.acheter)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                cmp.acheter
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
              {cmp.acheter ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
              {cmp.acheter ? 'À acheter' : 'En stock'}
            </button>
            <button type="button" onClick={() => set('recu', !cmp.recu)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                cmp.recu
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}>
              <Check className="w-3 h-3" />
              {cmp.recu ? 'Reçu ✓' : 'Non reçu'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main ───────────────────────────────────────────────────
const ChiffrageDetail = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const photoRef = useRef(null);

  const [header,       setHeader]       = useState({ affaire: '', client: '', reference_article: '', status: 'brouillon' });
  const [lignes,       setLignes]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [saved,        setSaved]        = useState(false);
  const [exporting,    setExporting]    = useState(false);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [panelLigne,   setPanelLigne]   = useState(null);
  const [connSearch,   setConnSearch]   = useState('');
  const [uploading,    setUploading]    = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      chiffrageService.getById(id),
      fournisseurCatalogueService.getAll(),
    ]).then(([data, fours]) => {
      setHeader({ affaire: data.affaire || '', client: data.client || '', reference_article: data.reference_article || '', status: data.status || 'brouillon' });
      setLignes((data.lignes || []).sort((a, b) => (a.ordre ?? a.id) - (b.ordre ?? b.id)).map(l => ({
        ...EMPTY_LIGNE(id, 0),
        ...l,
        _lid: String(l.id),
        composants: Array.isArray(l.composants) ? l.composants : [],
        besoin_contrepartie: l.besoin_contrepartie !== false,
      })));
      setFournisseurs(Array.isArray(fours) ? fours : []);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const saveHeader = useCallback(async (h = header) => {
    if (!id) return;
    setSaving(true);
    try { await chiffrageService.update(id, h); setSaved(true); setTimeout(() => setSaved(false), 2000); }
    catch (err) { console.error(err); }
    finally { setSaving(false); }
  }, [id, header]);

  const persistLigne = useCallback(async (l) => {
    const payload = {
      chiffrage_id: Number(id), ordre: l.ordre ?? 0,
      ref_connecteur: l.ref_connecteur || null,
      designation: l.designation || null,
      ref_interne: l.ref_interne || null,
      photo_url: l.photo_url || null,
      fournisseur: l.fournisseur || null,
      ref_fournisseur: l.ref_fournisseur || null,
      statut_stock: l.statut_stock || 'a_commander',
      prix_unitaire: Number(l.prix_unitaire) || 0,
      quantite: Number(l.quantite) || 1,
      qte_besoin: Number(l.qte_besoin) || 1,
      besoin_contrepartie: l.besoin_contrepartie !== false,
      composants: Array.isArray(l.composants) ? l.composants : [],
      commentaire_rai: l.commentaire_rai || null,
      // legacy fields kept for backward compat
      ref_contrepartie: l.ref_contrepartie || null,
      fournisseur_cp: l.fournisseur_cp || null,
      ref_fournisseur_cp: l.ref_fournisseur_cp || null,
      statut_cp: l.statut_cp || 'a_commander',
      prix_cp: Number(l.prix_cp) || 0,
      solution_interne: l.solution_interne || null,
    };
    if (l.id) {
      const updated = await chiffrageLigneService.update(l.id, payload);
      setLignes(prev => prev.map(x => x._lid === l._lid ? { ...updated, _lid: String(updated.id), composants: updated.composants || [], besoin_contrepartie: updated.besoin_contrepartie !== false } : x));
      return updated;
    } else {
      const created = await chiffrageLigneService.create(payload);
      setLignes(prev => prev.map(x => x._lid === l._lid ? { ...created, _lid: String(created.id), composants: created.composants || [], besoin_contrepartie: created.besoin_contrepartie !== false } : x));
      return created;
    }
  }, [id]);

  const openPanel = (l) => { setPanelLigne({ ...l, composants: Array.isArray(l.composants) ? [...l.composants] : [] }); setConnSearch(l.ref_connecteur || ''); };
  const closePanel = () => { setPanelLigne(null); setConnSearch(''); };
  const updatePanel = (field, value) => setPanelLigne(p => ({ ...p, [field]: value }));

  const savePanel = async () => {
    if (!panelLigne) return;
    setSaving(true);
    try { await persistLigne(panelLigne); closePanel(); }
    catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleSelectCatalogue = (c) => {
    const conn = c.approvisionnements_conn?.find(a => a.prioritaire) || c.approvisionnements_conn?.[0];
    setPanelLigne(p => ({
      ...p,
      ref_connecteur:  c.ref_connecteur  || p.ref_connecteur,
      designation:     c.designation     || p.designation,
      photo_url:       c.photo_url       || p.photo_url,
      fournisseur:     conn?.fournisseur  || p.fournisseur,
      ref_fournisseur: conn?.ref_fournisseur || p.ref_fournisseur,
      prix_unitaire:   Number(conn?.prix_unitaire) || p.prix_unitaire,
    }));
    setConnSearch(c.ref_connecteur || '');
  };

  const addLigne = () => {
    const l = EMPTY_LIGNE(id, lignes.length);
    setLignes(prev => [...prev, l]);
    openPanel(l);
  };

  const deleteLigne = async (l) => {
    if (l.id) try { await chiffrageLigneService.delete(l.id); } catch (err) { console.error(err); return; }
    setLignes(prev => prev.filter(x => x._lid !== l._lid));
    if (panelLigne?._lid === l._lid) closePanel();
  };

  // Composant helpers
  const addComposant = (type) => {
    setPanelLigne(p => ({ ...p, composants: [...(p.composants || []), emptyComposant(type)] }));
  };
  const updateComposant = (index, updated) => {
    setPanelLigne(p => ({
      ...p,
      composants: (p.composants || []).map((c, i) => i === index ? updated : c),
    }));
  };
  const removeComposant = (index) => {
    setPanelLigne(p => ({ ...p, composants: (p.composants || []).filter((_, i) => i !== index) }));
  };

  const uploadPhoto = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseKey) { alert('Supabase non configuré.'); return; }
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);
      const fn = `chiffrage/${id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const { data, error } = await supabase.storage.from('flowchart-media').upload(fn, file, { upsert: false });
      if (error) { alert('Erreur upload : ' + error.message); return; }
      const { data: { publicUrl } } = supabase.storage.from('flowchart-media').getPublicUrl(data.path);
      updatePanel('photo_url', publicUrl);
    } finally { setUploading(false); e.target.value = ''; }
  };

  const exportPDF = async () => {
    if (!tableRef.current) return;
    setExporting(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
      const canvas = await html2canvas(tableRef.current, { scale: 1.5, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const W = pdf.internal.pageSize.getWidth(), H = pdf.internal.pageSize.getHeight();
      pdf.setFontSize(13); pdf.setTextColor(15, 29, 53);
      pdf.text(`CHIFFRAGE — ${header.reference_article || header.affaire || ''}`, 10, 12);
      pdf.setFontSize(8); pdf.setTextColor(100, 116, 139);
      pdf.text(`Affaire: ${header.affaire || '—'}   Client: ${header.client || '—'}   Total: ${grandTot(lignes).toFixed(2)} €`, 10, 18);
      const imgH = (canvas.height * (W - 20)) / canvas.width;
      const fH = Math.min(imgH, H - 25), fW = imgH > H - 25 ? ((W - 20) * (H - 25)) / imgH : W - 20;
      pdf.addImage(imgData, 'PNG', 10, 22, fW, fH);
      pdf.save(`chiffrage-${header.reference_article || id}.pdf`);
    } catch (err) { console.error(err); }
    finally { setExporting(false); }
  };

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin" />
    </div>
  );

  const total = grandTot(lignes);

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden" style={{ background: 'var(--content-bg)' }}>

      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 flex-shrink-0" style={{ background: 'var(--panel)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={() => navigate('/industrialization')}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 flex-shrink-0">
            <ChevronLeft className="w-3.5 h-3.5" /> Chiffrages
          </button>
          <div className="w-px h-4 bg-slate-200 flex-shrink-0" />
          <Factory className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-sm font-bold text-slate-800 truncate">{header.affaire || header.reference_article || 'Chiffrage'}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <select value={header.status}
            onChange={e => { const v = e.target.value; setHeader(h => ({ ...h, status: v })); saveHeader({ ...header, status: v }); }}
            className="text-[11px] font-semibold rounded-full px-2.5 py-1 border bg-white focus:outline-none cursor-pointer text-slate-600 border-slate-200">
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button onClick={exportPDF} disabled={exporting}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold text-red-600 bg-white hover:bg-red-50 disabled:opacity-50">
            <Download className="w-3.5 h-3.5" />{exporting ? 'Export…' : 'PDF'}
          </button>
          <button onClick={() => saveHeader()} disabled={saving}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
            style={{ background: saved ? 'var(--ok)' : 'linear-gradient(135deg, var(--accent3), var(--accent2))' }}>
            {saved ? <><Check className="w-3.5 h-3.5" /> Sauvegardé</> : saving ? 'Sauvegarde…' : <><Save className="w-3.5 h-3.5" /> Sauvegarder</>}
          </button>
        </div>
      </div>

      {/* Header fields */}
      <div className="flex-shrink-0 px-5 py-4 bg-white border-b border-slate-200">
        <div className="grid gap-4 sm:grid-cols-3">
          {[{ key: 'affaire', label: 'AFFAIRE', ph: 'OP-25_EA1800-01' },
            { key: 'client',  label: 'CLIENT',  ph: 'Perciculture'   },
            { key: 'reference_article', label: 'RÉFÉRENCE ARTICLE', ph: 'KUPREEA1800-01AP' },
          ].map(({ key, label, ph }) => (
            <div key={key}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{label}</p>
              <input type="text" value={header[key]} onChange={e => setHeader(h => ({ ...h, [key]: e.target.value }))}
                onBlur={() => saveHeader()}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                placeholder={ph} />
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Table */}
        <div className="flex-1 overflow-auto p-4 min-w-0">
          <div ref={tableRef} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-[#0f1d35] px-5 py-3 flex items-center justify-between">
              <p className="text-sm font-bold text-white tracking-wider uppercase">Chiffrage Table de Test</p>
              {header.reference_article && <p className="text-xs font-mono font-semibold text-sky-300">{header.reference_article}</p>}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-sky-700 text-white">
                    <th className="px-3 py-2.5 text-left font-bold uppercase tracking-wide border-r border-sky-600 whitespace-nowrap text-[10px]">Réf. Connecteur</th>
                    <th className="px-3 py-2.5 text-left font-bold uppercase tracking-wide border-r border-sky-600 whitespace-nowrap text-[10px]">Désignation</th>
                    <th className="px-3 py-2.5 text-left font-bold uppercase tracking-wide border-r border-sky-600 whitespace-nowrap text-[10px]">Réf. Interne</th>
                    <th className="px-3 py-2.5 text-left font-bold uppercase tracking-wide border-r border-sky-600 whitespace-nowrap text-[10px]">Fourn.</th>
                    <th className="px-3 py-2.5 text-center font-bold uppercase tracking-wide border-r border-sky-600 whitespace-nowrap text-[10px]">Qté</th>
                    <th className="px-3 py-2.5 text-center font-bold uppercase tracking-wide border-r border-sky-600 whitespace-nowrap text-[10px]">Qté besoin</th>
                    <th className="px-3 py-2.5 text-left font-bold uppercase tracking-wide border-r border-sky-600 whitespace-nowrap text-[10px] bg-indigo-700">Contrepartie</th>
                    <th className="px-3 py-2.5 text-right font-bold uppercase tracking-wide border-r border-sky-600 whitespace-nowrap text-[10px]">Total</th>
                    <th className="px-3 py-2.5 text-center font-bold uppercase tracking-wide whitespace-nowrap text-[10px]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lignes.length === 0 ? (
                    <tr><td colSpan={9} className="py-10 text-center text-slate-400 text-xs">
                      Aucun connecteur — cliquez «&nbsp;Ajouter&nbsp;» ci-dessous
                    </td></tr>
                  ) : lignes.map((l, idx) => {
                    const isSelected = panelLigne?._lid === l._lid;
                    const cosses = (l.composants || []).filter(c => c.type === 'cosse');
                    const joints = (l.composants || []).filter(c => c.type === 'joint');
                    const cales  = (l.composants || []).filter(c => c.type === 'cale');
                    const autres = (l.composants || []).filter(c => c.type === 'autre');
                    return (
                      <tr key={l._lid} onClick={() => openPanel(l)}
                        className={`cursor-pointer transition-colors ${isSelected ? 'bg-sky-50 ring-1 ring-inset ring-sky-200' : idx % 2 === 0 ? 'bg-white hover:bg-sky-50/30' : 'bg-slate-50/40 hover:bg-sky-50/30'}`}>
                        <td className="px-3 py-2.5 font-mono font-semibold text-indigo-700 whitespace-nowrap">
                          {l.ref_connecteur || <span className="text-slate-300">—</span>}
                        </td>
                        <td className="px-3 py-2.5 text-slate-700 max-w-[140px] truncate">
                          {l.designation || <span className="text-slate-300">—</span>}
                        </td>
                        <td className="px-3 py-2.5 font-mono text-slate-500 whitespace-nowrap text-[10px]">
                          {l.ref_interne || <span className="text-slate-300">—</span>}
                        </td>
                        <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap text-[10px]">
                          {l.fournisseur || <span className="text-slate-300">—</span>}
                        </td>
                        <td className="px-3 py-2.5 text-center font-semibold text-slate-700">{l.quantite}</td>
                        <td className="px-3 py-2.5 text-center font-semibold text-slate-700">{l.qte_besoin}</td>
                        <td className="px-3 py-2.5">
                          {!l.besoin_contrepartie ? (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                              Assemblé complet
                            </span>
                          ) : (l.composants || []).length === 0 ? (
                            <span className="text-[9px] text-slate-400 italic">À définir</span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {cosses.length > 0 && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-sky-100 text-sky-700 border-sky-200">{cosses.length} cosse{cosses.length > 1 ? 's' : ''}</span>}
                              {joints.length > 0 && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-amber-100 text-amber-700 border-amber-200">{joints.length} joint{joints.length > 1 ? 's' : ''}</span>}
                              {cales.length  > 0 && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-indigo-100 text-indigo-700 border-indigo-200">{cales.length} cale{cales.length > 1 ? 's' : ''}</span>}
                              {autres.length > 0 && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-slate-100 text-slate-600 border-slate-200">{autres.length} autre{autres.length > 1 ? 's' : ''}</span>}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-right font-bold text-slate-800 whitespace-nowrap">
                          {rowTot(l) > 0 ? `${rowTot(l).toFixed(2)} €` : '—'}
                        </td>
                        <td className="px-3 py-2.5" onClick={e => e.stopPropagation()}>
                          <button onClick={() => deleteLigne(l)}
                            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200">
              <button onClick={addLigne}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))' }}>
                <Plus className="w-3.5 h-3.5" /> Ajouter un connecteur
              </button>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total chiffrage</p>
                <p className="text-2xl font-bold text-slate-900">{total.toFixed(2)} €</p>
              </div>
            </div>
          </div>
        </div>

        {/* Side panel */}
        {panelLigne && (
          <div className="w-[420px] flex-shrink-0 flex flex-col overflow-hidden" style={{ borderLeft: '1px solid var(--border)', background: 'var(--panel)' }}>
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-shrink-0"
              style={{ background: '#0f1d35' }}>
              <p className="text-sm font-bold text-white">
                {panelLigne.id ? 'Modifier le connecteur' : 'Nouveau connecteur'}
              </p>
              <button onClick={closePanel}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5">

              {/* ── Section 1: Connecteur ── */}
              <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-4 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-sky-700">Connecteur</p>

                <div>
                  <span className={labelCls}>Réf. fournisseur <span className="normal-case text-slate-400 font-normal">(recherche catalogue)</span></span>
                  <ConnecteurSearch
                    value={connSearch}
                    onChange={v => { setConnSearch(v); updatePanel('ref_connecteur', v); }}
                    onSelect={handleSelectCatalogue}
                  />
                </div>

                <label className="block">
                  <span className={labelCls}>Désignation</span>
                  <input type="text" value={panelLigne.designation || ''} onChange={e => updatePanel('designation', e.target.value)}
                    className={fieldCls} style={fieldClsStyle} placeholder="CONN HSG 81PTS" />
                </label>

                <label className="block">
                  <span className={labelCls}>Réf. interne</span>
                  <input type="text" value={panelLigne.ref_interne || ''} onChange={e => updatePanel('ref_interne', e.target.value)}
                    className={fieldCls} style={fieldClsStyle} placeholder="Ex: 27062594 / Ref TEC interne" />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className={labelCls}>Fournisseur</span>
                    <input type="text" value={panelLigne.fournisseur || ''} onChange={e => updatePanel('fournisseur', e.target.value)}
                      list="fourn-list-conn" className={fieldCls} style={fieldClsStyle} placeholder="Ex: Mouser" />
                    <datalist id="fourn-list-conn">
                      {fournisseurs.map(f => <option key={f.id} value={f.nom} />)}
                    </datalist>
                  </label>
                  <label className="block">
                    <span className={labelCls}>Prix unitaire (€)</span>
                    <input type="number" min="0" step="0.01" value={panelLigne.prix_unitaire || 0}
                      onChange={e => updatePanel('prix_unitaire', parseFloat(e.target.value) || 0)}
                      className={fieldCls + ' text-right'} />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className={labelCls}>Statut</span>
                    <select value={panelLigne.statut_stock || 'a_commander'} onChange={e => updatePanel('statut_stock', e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold focus:outline-none ${statutCls(panelLigne.statut_stock)}`}>
                      {STATUT_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block">
                      <span className={labelCls}>Qté</span>
                      <input type="number" min="1" value={panelLigne.quantite || 1}
                        onChange={e => updatePanel('quantite', parseInt(e.target.value) || 1)}
                        className={fieldCls + ' text-right'} />
                    </label>
                    <label className="block">
                      <span className={labelCls}>Qté besoin</span>
                      <input type="number" min="1" value={panelLigne.qte_besoin || 1}
                        onChange={e => updatePanel('qte_besoin', parseInt(e.target.value) || 1)}
                        className={fieldCls + ' text-right'} />
                    </label>
                  </div>
                </div>

                {/* Photo */}
                <div>
                  <span className={labelCls}>Photo</span>
                  {panelLigne.photo_url ? (
                    <div className="flex items-center gap-3">
                      <img src={panelLigne.photo_url} alt="" className="h-12 w-12 object-contain rounded border border-slate-200" />
                      <div className="space-y-1">
                        <button type="button" onClick={() => photoRef.current?.click()}
                          className="block text-xs text-sky-600 hover:underline">{uploading ? 'Upload…' : 'Changer'}</button>
                        <button type="button" onClick={() => updatePanel('photo_url', '')}
                          className="block text-xs text-red-500 hover:underline">Retirer</button>
                      </div>
                    </div>
                  ) : (
                    <button type="button" onClick={() => photoRef.current?.click()} disabled={uploading}
                      className="w-full py-2 rounded-xl border-2 border-dashed border-slate-300 text-xs text-slate-400 hover:border-sky-400 hover:text-sky-600 transition-colors disabled:opacity-50">
                      {uploading ? '⏳ Upload…' : <><Image className="w-3.5 h-3.5 inline mr-1" />Photo</>}
                    </button>
                  )}
                </div>
              </div>

              {/* ── Section 2: Contrepartie toggle ── */}
              <div className="rounded-xl border border-slate-200 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-700">Contrepartie nécessaire</p>
                  <button type="button"
                    onClick={() => updatePanel('besoin_contrepartie', !panelLigne.besoin_contrepartie)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      panelLigne.besoin_contrepartie
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                    {panelLigne.besoin_contrepartie
                      ? <><ToggleRight className="w-4 h-4" /> OUI</>
                      : <><ToggleLeft  className="w-4 h-4" /> NON — Connecteur assemblé complet</>}
                  </button>
                </div>

                {/* ── Composants section ── */}
                {panelLigne.besoin_contrepartie && (
                  <div className="space-y-3">
                    {/* Add buttons */}
                    <div className="flex flex-wrap gap-2">
                      {COMPOSANT_TYPES.map(t => {
                        const IconComp = t.icon;
                        return (
                          <button key={t.value} type="button" onClick={() => addComposant(t.value)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold bg-white hover:bg-slate-50 transition-colors text-slate-600 border-slate-200">
                            <IconComp className="w-3 h-3" />
                            + {t.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Composant cards */}
                    {(panelLigne.composants || []).length === 0 ? (
                      <p className="text-xs text-slate-400 italic text-center py-3">
                        Ajoutez les composants de la contrepartie ci-dessus
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {(panelLigne.composants || []).map((cmp, i) => (
                          <ComposantCard
                            key={cmp.id || i}
                            cmp={cmp}
                            index={i}
                            fournisseurs={fournisseurs}
                            onChange={updateComposant}
                            onRemove={removeComposant}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── Commentaire ── */}
              <label className="block">
                <span className={labelCls}>Commentaire RAI</span>
                <input type="text" value={panelLigne.commentaire_rai || ''} onChange={e => updatePanel('commentaire_rai', e.target.value)}
                  className={fieldCls} style={fieldClsStyle} placeholder="A commander, En attente de livraison…" />
              </label>

              {/* Total */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total ligne</span>
                <span className="text-lg font-bold text-slate-900">{rowTot(panelLigne).toFixed(2)} €</span>
              </div>
            </div>

            <div className="flex gap-2 p-4 border-t border-slate-100 flex-shrink-0">
              <button onClick={savePanel} disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))' }}>
                {saving ? 'Sauvegarde…' : <><Check className="w-4 h-4 inline mr-1.5" />Enregistrer</>}
              </button>
              <button onClick={closePanel}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>

      <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={uploadPhoto} />
    </div>
  );
};

export default ChiffrageDetail;
