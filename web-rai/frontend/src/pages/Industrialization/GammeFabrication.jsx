import React, { useEffect, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { gammeFabService, outillageService } from '../../services/api';
import { Plus, Trash2, Pencil, X, Check, ScrollText, Package, Search, ChevronDown, ChevronRight, ZoomIn } from 'lucide-react';
import PhotoLightbox from '../../components/ui/PhotoLightbox.jsx';

// ─── flatten processus tree into table rows ────────────────────────────────
function buildRows(processus, collapsed) {
  const rows = [];

  for (const proc of processus) {
    // Collapsed: single row showing only the processus name
    if (collapsed.has(proc.id)) {
      rows.push({ key: `p${proc.id}-coll`, type: 'collapsed', proc, _procStart: true, _procSpan: 1 });
      continue;
    }

    const etapes = proc.etapes || [];
    const procStart = rows.length;

    if (etapes.length === 0) {
      // empty processus: one placeholder row + one add-etape row
      rows.push({ key: `p${proc.id}-ph`, type: 'placeholder', proc });
      rows.push({ key: `p${proc.id}-ae`, type: 'add-etape', proc });
    } else {
      etapes.forEach((etape, ei) => {
        const outs = etape.gammeOutillages || [];
        const etapeStart = rows.length;

        if (outs.length === 0) {
          rows.push({ key: `e${etape.id}-ph`, type: 'empty-out', proc, etape, etapeIndex: ei });
        } else {
          outs.forEach(g => {
            rows.push({ key: `e${etape.id}-g${g.id}`, type: 'data', proc, etape, g, etapeIndex: ei });
          });
        }
        rows.push({ key: `e${etape.id}-ao`, type: 'add-out', proc, etape, etapeIndex: ei });

        const span = rows.length - etapeStart;
        rows[etapeStart]._etapeStart = true;
        rows[etapeStart]._etapeSpan = span;
      });
      rows.push({ key: `p${proc.id}-ae`, type: 'add-etape', proc });
    }

    const span = rows.length - procStart;
    rows[procStart]._procStart = true;
    rows[procStart]._procSpan = span;
  }

  return rows;
}

// ─── Component ─────────────────────────────────────────────────────────────
export default function GammeFabrication() {
  const [processus,   setProcessus]   = useState([]);
  const [outillages,  setOutillages]  = useState([]);
  const [loading,     setLoading]     = useState(true);

  // editing state
  const [editProcId,  setEditProcId]  = useState(null);
  const [editProcNom, setEditProcNom] = useState('');
  const [editEtapeId, setEditEtapeId] = useState(null);
  const [editEtapeNom,setEditEtapeNom]= useState('');

  // adding state
  const [addingEtapeFor, setAddingEtapeFor] = useState(null); // proc.id
  const [newEtapeNom,    setNewEtapeNom]    = useState('');
  const [addingProc,     setAddingProc]     = useState(false);
  const [newProcNom,     setNewProcNom]     = useState('');
  const [collapsed,      setCollapsed]      = useState(new Set());

  // outillage picker
  const [pickerEtapeId, setPickerEtapeId] = useState(null);
  const [search,        setSearch]        = useState('');

  // photo lightbox
  const [lightbox, setLightbox] = useState(null); // null | { photos, index }
  const openLightbox = (photos, index) => setLightbox({ photos, index });

  const loadAll = async () => {
    try {
      setLoading(true);
      const [proc, outil] = await Promise.all([gammeFabService.getAll(), outillageService.getAll()]);
      setProcessus(Array.isArray(proc) ? proc : []);
      setOutillages(Array.isArray(outil) ? outil : []);
    } catch { setProcessus([]); setOutillages([]); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadAll(); }, []);

  const toggleCollapse = (id) => setCollapsed(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const rows = useMemo(() => buildRows(processus, collapsed), [processus, collapsed]);

  const filteredOut = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return outillages;
    return outillages.filter(o =>
      o.designation.toLowerCase().includes(q) ||
      (o.references || []).some(r => r.reference.toLowerCase().includes(q))
    );
  }, [outillages, search]);

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const saveProc = async (id) => {
    if (!editProcNom.trim()) return;
    await gammeFabService.updateProcessus(id, { nom: editProcNom.trim() });
    setEditProcId(null); loadAll();
  };
  const deleteProc = async (p) => {
    if (!window.confirm(`Supprimer "${p.nom}" et toutes ses étapes ?`)) return;
    await gammeFabService.deleteProcessus(p.id); loadAll();
  };
  const createProc = async () => {
    if (!newProcNom.trim()) return;
    await gammeFabService.createProcessus({ nom: newProcNom.trim() });
    setNewProcNom(''); setAddingProc(false); loadAll();
  };

  const saveEtape = async (id) => {
    if (!editEtapeNom.trim()) return;
    await gammeFabService.updateEtape(id, { nom_etape: editEtapeNom.trim() });
    setEditEtapeId(null); loadAll();
  };
  const deleteEtape = async (e) => {
    if (!window.confirm(`Supprimer "${e.nom_etape}" ?`)) return;
    await gammeFabService.deleteEtape(e.id); loadAll();
  };
  const createEtape = async (proc_id) => {
    if (!newEtapeNom.trim()) return;
    await gammeFabService.createEtape({ processus_id: proc_id, nom_etape: newEtapeNom.trim() });
    setNewEtapeNom(''); setAddingEtapeFor(null); loadAll();
  };

  const addOutillage = async (etape_id, outillage_id) => {
    await gammeFabService.addOutillageToEtape({ etape_id, outillage_id });
    setPickerEtapeId(null); setSearch(''); loadAll();
  };
  const removeOutillage = async (id) => {
    await gammeFabService.removeOutillageFromEtape(id); loadAll();
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const inp = 'rounded-[7px] border px-2.5 py-1 text-[13px] outline-none focus:ring-2 focus:ring-[var(--accent)] transition';
  const inpSt = { background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' };
  const th = 'px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider';

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col flex-1 overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="flex items-center gap-3.5 px-[26px] py-4 border-b flex-shrink-0"
        style={{ borderColor: 'var(--border)' }}>
        <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center"
          style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
          <ScrollText className="w-4.5 h-4.5" strokeWidth={1.8} />
        </div>
        <div>
          <h1 className="font-display font-semibold text-[22px]"
            style={{ color: 'var(--text)', letterSpacing: '-0.4px' }}>Gestion outillages</h1>
          <p className="text-[12px]" style={{ color: 'var(--text3)' }}>
            Gammes de fabrication · Processus, étapes et outillages
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center flex-1">
          <div className="w-8 h-8 border-4 rounded-full animate-spin"
            style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
        </div>
      ) : (
        <div className="flex-1 overflow-auto px-[26px] py-5">
          <div className="rounded-[14px] overflow-hidden border"
            style={{ borderColor: 'var(--border)', background: 'var(--bg2)' }}>
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr style={{ background: 'var(--bg3)', borderBottom: '2px solid var(--border)' }}>
                  <th className={th} style={{ color: 'var(--text3)', width: '18%' }}>
                    Processus de fabrication
                  </th>
                  <th className={th} style={{ color: 'var(--text3)', width: '18%' }}>Étape</th>
                  <th className={th} style={{ color: 'var(--text3)' }}>Désignation</th>
                  <th className={th} style={{ color: 'var(--text3)' }}>Références</th>
                  <th className={th} style={{ color: 'var(--text3)', width: '60px' }}>Qté</th>
                  <th className={th} style={{ color: 'var(--text3)', width: '90px' }}>Photos</th>
                  <th style={{ width: '40px' }} />
                </tr>
              </thead>

              <tbody>
                {rows.map(row => (
                  <tr key={row.key}
                    className={row.type === 'data' ? 'group/row hover:bg-[var(--bg3)] transition-colors' : ''}
                    style={{ borderBottom: '1px solid var(--border)' }}>

                    {/* ── Col 1: Processus (rowspan) ── */}
                    {row._procStart && (
                      <td rowSpan={row._procSpan} className="px-4 py-3 align-middle group/proc"
                        style={{
                          borderRight: '2px solid var(--border)',
                          background: 'var(--bg3)',
                          verticalAlign: 'top',
                          paddingTop: '14px',
                        }}>
                        {editProcId === row.proc.id ? (
                          <div className="flex flex-col gap-1.5">
                            <input autoFocus className={`w-full ${inp}`} style={inpSt}
                              value={editProcNom} onChange={e => setEditProcNom(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') saveProc(row.proc.id);
                                if (e.key === 'Escape') setEditProcId(null);
                              }} />
                            <div className="flex gap-1">
                              <button onClick={() => saveProc(row.proc.id)}
                                className="flex-1 py-1 rounded-[6px] text-[12px] font-bold text-white"
                                style={{ background: 'var(--accent)' }}>OK</button>
                              <button onClick={() => setEditProcId(null)}
                                className="px-2 py-1 rounded-[6px]"
                                style={{ background: 'var(--bg)', color: 'var(--text3)' }}>
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <button onClick={() => toggleCollapse(row.proc.id)}
                                className="flex-shrink-0 p-0.5 rounded transition-colors hover:bg-[var(--bg)]"
                                style={{ color: 'var(--text3)' }}>
                                {collapsed.has(row.proc.id)
                                  ? <ChevronRight className="w-3.5 h-3.5" />
                                  : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                              <span className="font-bold text-[13px] leading-snug"
                                style={{ color: 'var(--text)' }}>
                                {row.proc.nom}
                              </span>
                            </div>
                            <div className="flex gap-0.5 opacity-0 group-hover/proc:opacity-100 transition-opacity flex-shrink-0">
                              <button onClick={() => { setEditProcId(row.proc.id); setEditProcNom(row.proc.nom); }}
                                className="p-1 rounded-[5px] hover:bg-[var(--accent-soft)]"
                                style={{ color: 'var(--accent)' }}>
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button onClick={() => deleteProc(row.proc)}
                                className="p-1 rounded-[5px] hover:bg-red-100 dark:hover:bg-red-900/20"
                                style={{ color: 'var(--crit)' }}>
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    )}

                    {/* ── Collapsed processus: single summary row ── */}
                    {row.type === 'collapsed' && (
                      <td colSpan={6} className="px-4 py-3"
                        style={{ color: 'var(--text3)', fontStyle: 'italic', fontSize: '12px' }}>
                        {(row.proc.etapes || []).length} étape{(row.proc.etapes || []).length !== 1 ? 's' : ''} — cliquez sur
                        {' '}<ChevronRight className="inline w-3 h-3" />{' '}pour développer
                      </td>
                    )}

                    {/* ── Col 2: Étape (rowspan) ── */}
                    {row.type === 'add-etape' ? (
                      <td colSpan={6} className="px-4 py-2"
                        style={{ background: 'var(--bg2)' }}>
                        {addingEtapeFor === row.proc.id ? (
                          <div className="flex items-center gap-2">
                            <input autoFocus className={`flex-1 ${inp}`} style={inpSt}
                              value={newEtapeNom} onChange={e => setNewEtapeNom(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') createEtape(row.proc.id);
                                if (e.key === 'Escape') { setAddingEtapeFor(null); setNewEtapeNom(''); }
                              }}
                              placeholder="Nom de l'étape…" />
                            <button onClick={() => createEtape(row.proc.id)}
                              className="p-1.5 rounded-[6px] text-white" style={{ background: 'var(--accent)' }}>
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => { setAddingEtapeFor(null); setNewEtapeNom(''); }}
                              className="p-1.5 rounded-[6px]" style={{ color: 'var(--text3)' }}>
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => { setAddingEtapeFor(row.proc.id); setNewEtapeNom(''); }}
                            className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-[7px] border border-dashed transition-colors hover:bg-[var(--bg3)]"
                            style={{ borderColor: 'var(--border)', color: 'var(--text3)' }}>
                            <Plus className="w-3 h-3" /> Ajouter une étape
                          </button>
                        )}
                      </td>
                    ) : row.type === 'placeholder' ? (
                      <td colSpan={6} className="px-4 py-3 text-[12px]"
                        style={{ color: 'var(--text3)' }}>
                        Aucune étape
                      </td>
                    ) : row._etapeStart ? (
                      <td rowSpan={row._etapeSpan} className="px-4 py-3 align-top group/etape"
                        style={{ borderRight: '1px solid var(--border)', verticalAlign: 'top', paddingTop: '14px' }}>
                        {editEtapeId === row.etape.id ? (
                          <div className="flex flex-col gap-1.5">
                            <input autoFocus className={`w-full ${inp}`} style={inpSt}
                              value={editEtapeNom} onChange={e => setEditEtapeNom(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') saveEtape(row.etape.id);
                                if (e.key === 'Escape') setEditEtapeId(null);
                              }} />
                            <div className="flex gap-1">
                              <button onClick={() => saveEtape(row.etape.id)}
                                className="flex-1 py-1 rounded-[6px] text-[12px] font-bold text-white"
                                style={{ background: 'var(--accent)' }}>OK</button>
                              <button onClick={() => setEditEtapeId(null)}
                                className="px-2 py-1 rounded-[6px]"
                                style={{ background: 'var(--bg)', color: 'var(--text3)' }}>
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                                style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                                {row.etapeIndex + 1}
                              </span>
                              <span className="font-semibold text-[13px] leading-snug"
                                style={{ color: 'var(--text)' }}>
                                {row.etape.nom_etape}
                              </span>
                            </div>
                            <div className="flex gap-0.5 opacity-0 group-hover/etape:opacity-100 transition-opacity flex-shrink-0">
                              <button onClick={() => { setEditEtapeId(row.etape.id); setEditEtapeNom(row.etape.nom_etape); }}
                                className="p-1 rounded-[5px] hover:bg-[var(--accent-soft)]"
                                style={{ color: 'var(--accent)' }}>
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button onClick={() => deleteEtape(row.etape)}
                                className="p-1 rounded-[5px] hover:bg-red-100 dark:hover:bg-red-900/20"
                                style={{ color: 'var(--crit)' }}>
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    ) : null /* cols 3-7 only, étape cell already rendered via rowspan */}

                    {/* ── Cols 3-7: Data / add-out / empty-out ── */}
                    {row.type === 'data' && (
                      <>
                        <td className="px-4 py-2.5 font-medium" style={{ color: 'var(--text)' }}>
                          {row.g?.outillage?.designation || '—'}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex flex-wrap gap-1">
                            {(row.g?.outillage?.references || []).map((r, ri) => (
                              <span key={ri} className="px-1.5 py-0.5 rounded-[5px] font-mono text-[11px]"
                                style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                                {r.reference}{r.label ? <span style={{ color: 'var(--text3)' }}> · {r.label}</span> : null}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-2.5 font-semibold text-center"
                          style={{ color: 'var(--text)' }}>
                          {row.g?.outillage?.quantity ?? '—'}
                        </td>
                        <td className="px-4 py-2.5">
                          {row.g?.outillage?.photos?.length > 0 ? (
                            <div className="flex gap-1">
                              {row.g.outillage.photos.slice(0, 2).map((p, pi) => (
                                <button key={pi} onClick={() => openLightbox(row.g.outillage.photos, pi)}
                                  className="relative group/thumb w-8 h-8 rounded-[5px] overflow-hidden border flex-shrink-0"
                                  style={{ borderColor: 'var(--border)' }}>
                                  <img src={p.photo_data} alt="" className="w-full h-full object-cover" />
                                  <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/thumb:bg-black/40 transition-colors">
                                    <ZoomIn className="w-3 h-3 text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity" />
                                  </span>
                                </button>
                              ))}
                              {row.g.outillage.photos.length > 2 && (
                                <button onClick={() => openLightbox(row.g.outillage.photos, 2)}
                                  className="w-8 h-8 rounded-[5px] flex items-center justify-center text-[9px] font-bold hover:brightness-95 transition-all flex-shrink-0"
                                  style={{ background: 'var(--bg3)', color: 'var(--text3)' }}>
                                  +{row.g.outillage.photos.length - 2}
                                </button>
                              )}
                            </div>
                          ) : <span style={{ color: 'var(--text3)' }}>—</span>}
                        </td>
                        <td className="px-2 py-2.5">
                          <button onClick={() => removeOutillage(row.g.id)}
                            className="opacity-0 group-hover/row:opacity-100 p-1 rounded-[5px] hover:bg-red-100 dark:hover:bg-red-900/20 transition"
                            style={{ color: 'var(--crit)' }}>
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </>
                    )}

                    {row.type === 'empty-out' && (
                      <td colSpan={5} className="px-4 py-2.5 text-[12px]"
                        style={{ color: 'var(--text3)' }}>
                        Aucun outillage
                      </td>
                    )}

                    {row.type === 'add-out' && (
                      <td colSpan={5} className="px-4 py-2">
                        {pickerEtapeId === row.etape.id ? (
                          <div className="rounded-[10px] border overflow-hidden"
                            style={{ borderColor: 'var(--accent)', background: 'var(--bg2)' }}>
                            <div className="flex items-center gap-2 px-3 py-2 border-b"
                              style={{ borderColor: 'var(--border)' }}>
                              <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text3)' }} />
                              <input autoFocus className="flex-1 text-[13px] bg-transparent outline-none"
                                style={{ color: 'var(--text)' }}
                                value={search} onChange={e => setSearch(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Escape') { setPickerEtapeId(null); setSearch(''); } }}
                                placeholder="Rechercher par désignation ou référence…" />
                              <button onClick={() => { setPickerEtapeId(null); setSearch(''); }}
                                style={{ color: 'var(--text3)' }}>
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="max-h-[180px] overflow-y-auto">
                              {filteredOut.length === 0 ? (
                                <p className="text-center py-3 text-[12px]" style={{ color: 'var(--text3)' }}>
                                  Aucun résultat
                                </p>
                              ) : filteredOut.map(o => (
                                <button key={o.id}
                                  onClick={() => addOutillage(row.etape.id, o.id)}
                                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[var(--bg3)] text-left border-b last:border-0 transition-colors"
                                  style={{ borderColor: 'var(--border)' }}>
                                  <Package className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                                  <span className="flex-1 text-[13px] font-medium" style={{ color: 'var(--text)' }}>
                                    {o.designation}
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {(o.references || []).map((r, ri) => (
                                      <span key={ri} className="font-mono text-[10px]"
                                        style={{ color: 'var(--text3)' }}>
                                        {r.reference}
                                      </span>
                                    ))}
                                  </div>
                                  <span className="text-[11px] font-semibold flex-shrink-0"
                                    style={{ color: 'var(--text3)' }}>
                                    Qté {o.quantity}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setPickerEtapeId(row.etape.id); setSearch(''); }}
                            className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-[7px] transition-colors hover:bg-[var(--accent-soft)]"
                            style={{ color: 'var(--accent)' }}>
                            <Plus className="w-3 h-3" /> Ajouter un outillage
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}

                {/* ── Add processus row ── */}
                <tr style={{ borderTop: '2px solid var(--border)' }}>
                  <td colSpan={7} className="px-4 py-3" style={{ background: 'var(--bg3)' }}>
                    {addingProc ? (
                      <div className="flex items-center gap-2">
                        <input autoFocus className={`flex-1 max-w-xs ${inp}`} style={inpSt}
                          value={newProcNom} onChange={e => setNewProcNom(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') createProc();
                            if (e.key === 'Escape') { setAddingProc(false); setNewProcNom(''); }
                          }}
                          placeholder="Nom du processus de fabrication…" />
                        <button onClick={createProc}
                          className="p-1.5 rounded-[7px] text-white" style={{ background: 'var(--accent)' }}>
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { setAddingProc(false); setNewProcNom(''); }}
                          className="p-1.5 rounded-[7px]" style={{ color: 'var(--text3)', background: 'var(--bg)' }}>
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setAddingProc(true)}
                        className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-[8px] border border-dashed transition-colors hover:bg-[var(--bg2)]"
                        style={{ borderColor: 'var(--border)', color: 'var(--text3)' }}>
                        <Plus className="w-3.5 h-3.5" /> Nouveau processus de fabrication
                      </button>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Photo lightbox */}
      <AnimatePresence>
        {lightbox && (
          <PhotoLightbox
            photos={lightbox.photos}
            index={lightbox.index}
            onIndexChange={(i) => setLightbox((l) => ({ ...l, index: i }))}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
