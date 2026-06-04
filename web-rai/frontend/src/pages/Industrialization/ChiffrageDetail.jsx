import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  chiffrageService, chiffrageLigneService,
  connecteurCatalogueService, fournisseurCatalogueService,
} from '../../services/api';
import {
  ChevronLeft, Plus, Trash2, Save, Download, Check,
  Factory, Pencil, X, Image, Search, AlertTriangle,
  BookOpen,
} from 'lucide-react';

// ── Constants ──────────────────────────────────────────────
const STATUS_OPTIONS = [
  { value:'brouillon', label:'Brouillon' },
  { value:'en_cours',  label:'En cours'  },
  { value:'valide',    label:'Validé'    },
  { value:'archive',   label:'Archivé'   },
];

const STATUT_OPTS = [
  { value:'en_stock',    label:'En stock',         cls:'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { value:'a_commander', label:'À commander',      cls:'bg-amber-100 text-amber-800 border-amber-200'       },
  { value:'rupture',     label:'Rupture de stock', cls:'bg-red-100 text-red-700 border-red-200'              },
  { value:'interne',     label:'Solution interne', cls:'bg-purple-100 text-purple-700 border-purple-200'    },
];

const statutCls   = (v) => STATUT_OPTS.find(o => o.value === v)?.cls   || STATUT_OPTS[1].cls;
const statutLabel = (v) => STATUT_OPTS.find(o => o.value === v)?.label || 'À commander';

const fieldCls = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-colors';
const labelCls = 'mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500';

const rowTot = (l) => (Number(l.quantite)||0) * ((Number(l.prix_unitaire)||0) + (Number(l.prix_cp)||0));
const grandTot = (ls) => ls.reduce((s,l) => s + rowTot(l), 0);

const EMPTY_LIGNE = (chiffrageId, ordre) => ({
  _lid: `new-${Date.now()}`, id: null, chiffrage_id: Number(chiffrageId), ordre,
  ref_connecteur:'', designation:'', ref_contrepartie:'', photo_url:'',
  fournisseur:'', ref_fournisseur:'', statut_stock:'a_commander', prix_unitaire:0,
  fournisseur_cp:'', ref_fournisseur_cp:'', statut_cp:'a_commander', prix_cp:0,
  solution_interne:'', commentaire_rai:'', quantite:1,
});

// ── Autocomplete ───────────────────────────────────────────
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
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Catalogue</p>
          </div>
          {results.map(c => (
            <button key={c.id} type="button"
              onMouseDown={e => { e.preventDefault(); onSelect(c); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-sky-50 transition-colors border-b border-slate-50 last:border-0">
              {c.photo_url && <img src={c.photo_url} alt="" className="w-8 h-8 object-contain rounded flex-shrink-0 border border-slate-100" />}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 font-mono">{c.ref_connecteur}</p>
                <p className="text-[11px] text-slate-500 truncate">{c.designation}</p>
                {c.ref_contrepartie && <p className="text-[10px] text-indigo-600">CP: {c.ref_contrepartie}</p>}
              </div>
              <span className="text-[10px] text-sky-500 font-semibold flex-shrink-0">Utiliser →</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Supply section in edit panel ───────────────────────────
const SupplySection = ({ title, color, fournisseur, refF, statut, prix, solutionInterne,
  onFournisseur, onRefF, onStatut, onPrix, onSolutionInterne, fournisseurs }) => {

  const isInterne = statut === 'interne';
  const borderCls = color === 'sky' ? 'border-sky-200 bg-sky-50/40' : 'border-indigo-200 bg-indigo-50/40';
  const titleCls  = color === 'sky' ? 'text-sky-700'                : 'text-indigo-700';

  return (
    <div className={`rounded-xl border p-4 space-y-3 ${borderCls}`}>
      <p className={`text-xs font-bold uppercase tracking-wider ${titleCls}`}>{title}</p>
      <label className="block">
        <span className={labelCls}>Statut</span>
        <select value={statut} onChange={e => onStatut(e.target.value)}
          className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-sky-200 ${statutCls(statut)}`}>
          {STATUT_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </label>
      {!isInterne ? (
        <>
          <label className="block">
            <span className={labelCls}>Fournisseur</span>
            <input type="text" value={fournisseur} onChange={e => onFournisseur(e.target.value)}
              list={`fourn-list-${color}`} className={fieldCls} placeholder="ex : Mouser Electronics" />
            <datalist id={`fourn-list-${color}`}>
              {fournisseurs.map(f => <option key={f.id} value={f.nom} />)}
            </datalist>
          </label>
          <label className="block">
            <span className={labelCls}>Réf. fournisseur</span>
            <input type="text" value={refF} onChange={e => onRefF(e.target.value)}
              className={fieldCls} placeholder="ex : 571-966140-5" />
          </label>
          <label className="block">
            <span className={labelCls}>Prix unitaire (€)</span>
            <input type="number" min="0" step="0.01" value={prix} onChange={e => onPrix(parseFloat(e.target.value)||0)}
              className={fieldCls + ' text-right'} />
          </label>
        </>
      ) : (
        <label className="block">
          <span className={labelCls}>Description de la solution interne</span>
          <input type="text" value={solutionInterne} onChange={e => onSolutionInterne(e.target.value)}
            className={fieldCls} placeholder="ex : Impression 3D, Usinage atelier, Fabrication interne…" />
        </label>
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

  const [header,     setHeader]     = useState({ affaire:'', client:'', reference_article:'', status:'brouillon' });
  const [lignes,     setLignes]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [saved,      setSaved]      = useState(false);
  const [exporting,  setExporting]  = useState(false);
  const [fournisseurs, setFournisseurs] = useState([]);

  // Side panel state
  const [panelLigne, setPanelLigne] = useState(null); // ligne being edited
  const [connSearch, setConnSearch] = useState('');
  const [uploading,  setUploading]  = useState(false);

  // Load
  useEffect(() => {
    if (!id) return;
    Promise.all([
      chiffrageService.getById(id),
      fournisseurCatalogueService.getAll(),
    ]).then(([data, fours]) => {
      setHeader({ affaire: data.affaire||'', client: data.client||'', reference_article: data.reference_article||'', status: data.status||'brouillon' });
      setLignes((data.lignes||[]).sort((a,b) => (a.ordre??a.id)-(b.ordre??b.id)).map(l => ({ ...l, _lid: String(l.id) })));
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

  // Save a single ligne to DB
  const persistLigne = useCallback(async (l) => {
    const payload = {
      chiffrage_id: Number(id), ordre: l.ordre ?? 0,
      ref_connecteur: l.ref_connecteur||null, designation: l.designation||null,
      ref_contrepartie: l.ref_contrepartie||null, photo_url: l.photo_url||null,
      fournisseur: l.fournisseur||null, ref_fournisseur: l.ref_fournisseur||null,
      statut_stock: l.statut_stock||'a_commander', prix_unitaire: Number(l.prix_unitaire)||0,
      fournisseur_cp: l.fournisseur_cp||null, ref_fournisseur_cp: l.ref_fournisseur_cp||null,
      statut_cp: l.statut_cp||'a_commander', prix_cp: Number(l.prix_cp)||0,
      solution_interne: l.solution_interne||null,
      commentaire_rai: l.commentaire_rai||null, quantite: Number(l.quantite)||1,
    };
    if (l.id) {
      const updated = await chiffrageLigneService.update(l.id, payload);
      setLignes(prev => prev.map(x => x._lid === l._lid ? { ...updated, _lid: String(updated.id) } : x));
      return { ...updated, _lid: String(updated.id) };
    } else {
      const created = await chiffrageLigneService.create(payload);
      setLignes(prev => prev.map(x => x._lid === l._lid ? { ...created, _lid: String(created.id) } : x));
      return { ...created, _lid: String(created.id) };
    }
  }, [id]);

  // Panel helpers
  const openPanel = (l) => {
    setPanelLigne({ ...l });
    setConnSearch(l.ref_connecteur || '');
  };

  const closePanel = () => { setPanelLigne(null); setConnSearch(''); };

  const updatePanel = (field, value) => setPanelLigne(p => ({ ...p, [field]: value }));

  const savePanel = async () => {
    if (!panelLigne) return;
    setSaving(true);
    try {
      const saved = await persistLigne(panelLigne);
      setPanelLigne(null); setConnSearch('');
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleSelectCatalogue = (c) => {
    const conn = c.approvisionnements_conn?.find(a => a.prioritaire) || c.approvisionnements_conn?.[0];
    const cp   = c.approvisionnements_cp?.find(a => a.prioritaire)   || c.approvisionnements_cp?.[0];
    setPanelLigne(p => ({
      ...p,
      ref_connecteur:    c.ref_connecteur   || p.ref_connecteur,
      designation:       c.designation      || p.designation,
      ref_contrepartie:  c.ref_contrepartie || p.ref_contrepartie,
      photo_url:         c.photo_url        || p.photo_url,
      solution_interne:  c.solution_interne || '',
      fournisseur:       conn?.fournisseur     || p.fournisseur,
      ref_fournisseur:   conn?.ref_fournisseur || p.ref_fournisseur,
      prix_unitaire:     Number(conn?.prix_unitaire) || p.prix_unitaire,
      fournisseur_cp:    cp?.fournisseur     || p.fournisseur_cp,
      ref_fournisseur_cp:cp?.ref_fournisseur || p.ref_fournisseur_cp,
      prix_cp:           Number(cp?.prix_unitaire) || p.prix_cp,
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

  const uploadPhoto = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseKey) { alert('Supabase non configuré.'); return; }
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);
      const fn = `chiffrage/${id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,'_')}`;
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
      pdf.setFontSize(13); pdf.setTextColor(15,29,53);
      pdf.text(`CHIFFRAGE TABLE DE TEST — ${header.reference_article || header.affaire || ''}`, 10, 12);
      pdf.setFontSize(8); pdf.setTextColor(100,116,139);
      pdf.text(`Affaire: ${header.affaire||'—'}   Client: ${header.client||'—'}   Total: ${grandTot(lignes).toFixed(2)} €`, 10, 18);
      const imgH = (canvas.height * (W-20)) / canvas.width;
      const fH = Math.min(imgH, H-25), fW = imgH > H-25 ? ((W-20)*(H-25))/imgH : W-20;
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
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-white border-b border-slate-200 flex-shrink-0">
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
            style={{ background: saved ? '#10b981' : 'linear-gradient(135deg,#0ea5e9,#0369a1)' }}>
            {saved ? <><Check className="w-3.5 h-3.5" /> Sauvegardé</> : saving ? 'Sauvegarde…' : <><Save className="w-3.5 h-3.5" /> Sauvegarder</>}
          </button>
        </div>
      </div>

      {/* Header fields */}
      <div className="flex-shrink-0 px-5 py-4 bg-white border-b border-slate-200">
        <div className="grid gap-4 sm:grid-cols-3">
          {[{ key:'affaire', label:'AFFAIRE', ph:'OP-25_EA1800-01_Ind A' },
            { key:'client', label:'CLIENT', ph:'Perciculture' },
            { key:'reference_article', label:'RÉFÉRENCE ARTICLE', ph:'KUPREEA1800-01AP' }
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

      {/* Body: table + optional side panel */}
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
                  <tr className="bg-sky-600 text-white">
                    {['Réf. Conn.','Désignation','Contre-partie','Photo','Fourn. Conn.','Réf. Conn.','Prix Conn.','Fourn. CP','Réf. CP','Prix CP','Statuts','Qté','Total',''].map(h => (
                      <th key={h} className="px-2 py-2.5 text-left font-bold uppercase tracking-wide border-r border-sky-500 last:border-0 whitespace-nowrap text-[10px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lignes.length === 0 ? (
                    <tr><td colSpan={14} className="py-8 text-center text-slate-400 text-xs">
                      Aucun connecteur — cliquez «&nbsp;Ajouter&nbsp;» ci-dessous
                    </td></tr>
                  ) : lignes.map((l, idx) => {
                    const isSelected = panelLigne?._lid === l._lid;
                    return (
                      <tr key={l._lid}
                        onClick={() => openPanel(l)}
                        className={`cursor-pointer transition-colors ${isSelected ? 'bg-sky-50' : idx%2===0 ? 'bg-white hover:bg-sky-50/30' : 'bg-slate-50/40 hover:bg-sky-50/30'}`}>
                        <td className="px-2 py-2 font-mono font-semibold text-indigo-700 whitespace-nowrap">{l.ref_connecteur || <span className="text-slate-300">—</span>}</td>
                        <td className="px-2 py-2 text-slate-700 max-w-[140px] truncate">{l.designation || <span className="text-slate-300">—</span>}</td>
                        <td className="px-2 py-2 font-mono text-slate-600 whitespace-nowrap">{l.ref_contrepartie || <span className="text-slate-300">—</span>}</td>
                        <td className="px-2 py-2 text-center">
                          {l.photo_url ? <img src={l.photo_url} alt="" className="h-8 w-8 object-contain mx-auto rounded" /> : <span className="text-slate-300">—</span>}
                        </td>
                        <td className="px-2 py-2 text-slate-600 whitespace-nowrap">{l.fournisseur || <span className="text-slate-300">—</span>}</td>
                        <td className="px-2 py-2 text-slate-500 whitespace-nowrap max-w-[120px] truncate">{l.ref_fournisseur || <span className="text-slate-300">—</span>}</td>
                        <td className="px-2 py-2 text-right font-semibold text-slate-700 whitespace-nowrap">{Number(l.prix_unitaire)||0 > 0 ? `${Number(l.prix_unitaire).toFixed(2)} €` : '—'}</td>
                        <td className="px-2 py-2 text-slate-600 whitespace-nowrap">{l.fournisseur_cp || <span className="text-slate-300">—</span>}</td>
                        <td className="px-2 py-2 text-slate-500 whitespace-nowrap max-w-[120px] truncate">{l.ref_fournisseur_cp || <span className="text-slate-300">—</span>}</td>
                        <td className="px-2 py-2 text-right font-semibold text-slate-700 whitespace-nowrap">{Number(l.prix_cp)||0 > 0 ? `${Number(l.prix_cp).toFixed(2)} €` : '—'}</td>
                        <td className="px-2 py-2">
                          <div className="flex gap-1">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${statutCls(l.statut_stock)}`}>{l.statut_stock?.[0]?.toUpperCase()}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${statutCls(l.statut_cp)}`}>{l.statut_cp?.[0]?.toUpperCase()}</span>
                          </div>
                        </td>
                        <td className="px-2 py-2 text-center font-semibold text-slate-700">{l.quantite}</td>
                        <td className="px-2 py-2 text-right font-bold text-slate-800 whitespace-nowrap">{rowTot(l).toFixed(2)} €</td>
                        <td className="px-2 py-2" onClick={e => e.stopPropagation()}>
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
                style={{ background: 'linear-gradient(135deg,#0ea5e9,#0369a1)' }}>
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
          <div className="w-96 flex-shrink-0 border-l border-slate-200 bg-white flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-shrink-0"
              style={{ background: '#0f1d35' }}>
              <p className="text-sm font-bold text-white">
                {panelLigne.id ? 'Modifier la ligne' : 'Nouveau connecteur'}
              </p>
              <button onClick={closePanel}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">

              {/* Connector identity */}
              <div>
                <span className={labelCls}>Réf. connecteur <span className="normal-case text-slate-400 font-normal">(recherche catalogue)</span></span>
                <ConnecteurSearch
                  value={connSearch}
                  onChange={v => { setConnSearch(v); updatePanel('ref_connecteur', v); }}
                  onSelect={handleSelectCatalogue}
                />
              </div>

              <label className="block">
                <span className={labelCls}>Désignation</span>
                <input type="text" value={panelLigne.designation||''} onChange={e => updatePanel('designation', e.target.value)}
                  className={fieldCls} placeholder="CONN HSG 81PTS" />
              </label>

              <label className="block">
                <span className={labelCls}>Réf. contre-partie</span>
                <input type="text" value={panelLigne.ref_contrepartie||''} onChange={e => updatePanel('ref_contrepartie', e.target.value)}
                  className={fieldCls} placeholder="368146-1" />
              </label>

              {/* Photo */}
              <div>
                <span className={labelCls}>Photo contrepartie</span>
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
                    {uploading ? '⏳ Upload…' : <><Image className="w-4 h-4 inline mr-1" />Uploader une photo</>}
                  </button>
                )}
              </div>

              {/* Connector supply */}
              <SupplySection
                title="Approvisionnement — Connecteur"
                color="sky"
                fournisseur={panelLigne.fournisseur||''}
                refF={panelLigne.ref_fournisseur||''}
                statut={panelLigne.statut_stock||'a_commander'}
                prix={panelLigne.prix_unitaire||0}
                solutionInterne={panelLigne.solution_interne||''}
                onFournisseur={v => updatePanel('fournisseur', v)}
                onRefF={v => updatePanel('ref_fournisseur', v)}
                onStatut={v => updatePanel('statut_stock', v)}
                onPrix={v => updatePanel('prix_unitaire', v)}
                onSolutionInterne={v => updatePanel('solution_interne', v)}
                fournisseurs={fournisseurs}
              />

              {/* CP supply */}
              <SupplySection
                title="Approvisionnement — Contre-partie"
                color="indigo"
                fournisseur={panelLigne.fournisseur_cp||''}
                refF={panelLigne.ref_fournisseur_cp||''}
                statut={panelLigne.statut_cp||'a_commander'}
                prix={panelLigne.prix_cp||0}
                solutionInterne={panelLigne.solution_interne||''}
                onFournisseur={v => updatePanel('fournisseur_cp', v)}
                onRefF={v => updatePanel('ref_fournisseur_cp', v)}
                onStatut={v => updatePanel('statut_cp', v)}
                onPrix={v => updatePanel('prix_cp', v)}
                onSolutionInterne={v => updatePanel('solution_interne', v)}
                fournisseurs={fournisseurs}
              />

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className={labelCls}>Quantité</span>
                  <input type="number" min="1" step="1" value={panelLigne.quantite||1} onChange={e => updatePanel('quantite', parseInt(e.target.value)||1)}
                    className={fieldCls + ' text-right'} />
                </label>
                <div>
                  <p className={labelCls}>Total ligne</p>
                  <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-right text-slate-800">
                    {rowTot(panelLigne).toFixed(2)} €
                  </p>
                </div>
              </div>

              <label className="block">
                <span className={labelCls}>Commentaire RAI</span>
                <input type="text" value={panelLigne.commentaire_rai||''} onChange={e => updatePanel('commentaire_rai', e.target.value)}
                  className={fieldCls} placeholder="A commander, En attente…" />
              </label>
            </div>

            <div className="flex gap-2 p-4 border-t border-slate-100 flex-shrink-0">
              <button onClick={savePanel} disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#0ea5e9,#0369a1)' }}>
                {saving ? 'Sauvegarde…' : <><Check className="w-4 h-4 inline mr-1.5" />Enregistrer</>}
              </button>
              <button onClick={closePanel}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Fermer</button>
            </div>
          </div>
        )}
      </div>

      <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={uploadPhoto} />
    </div>
  );
};

export default ChiffrageDetail;
