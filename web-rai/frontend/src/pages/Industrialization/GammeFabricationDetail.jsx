import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { gammeFabService, outillageService } from '../../services/api';
import {
  Plus, Trash2, Pencil, X, Check, ScrollText, Package, Search,
  ZoomIn, ChevronLeft, Printer,
} from 'lucide-react';
import PhotoLightbox from '../../components/ui/PhotoLightbox.jsx';

// ─── flatten one processus's étapes into table rows ────────────────────────
function buildRows(etapes) {
  const rows = [];
  etapes.forEach((etape, ei) => {
    const outs = etape.gammeOutillages || [];
    const etapeStart = rows.length;

    if (outs.length === 0) {
      rows.push({ key: `e${etape.id}-ph`, type: 'empty-out', etape, etapeIndex: ei });
    } else {
      outs.forEach((g) => {
        rows.push({ key: `e${etape.id}-g${g.id}`, type: 'data', etape, g, etapeIndex: ei });
      });
    }
    rows.push({ key: `e${etape.id}-ao`, type: 'add-out', etape, etapeIndex: ei });

    const span = rows.length - etapeStart;
    rows[etapeStart]._etapeStart = true;
    rows[etapeStart]._etapeSpan = span;
  });
  return rows;
}

// ─── Component ─────────────────────────────────────────────────────────────
export default function GammeFabricationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [proc,        setProc]        = useState(null);
  const [outillages,  setOutillages]  = useState([]);
  const [loading,     setLoading]     = useState(true);

  // processus rename
  const [editingNom, setEditingNom] = useState(false);
  const [nomDraft,   setNomDraft]   = useState('');

  // étape editing state
  const [editEtapeId,  setEditEtapeId]  = useState(null);
  const [editEtapeNom, setEditEtapeNom] = useState('');

  // adding state
  const [addingEtape, setAddingEtape] = useState(false);
  const [newEtapeNom, setNewEtapeNom] = useState('');

  // outillage picker
  const [pickerEtapeId, setPickerEtapeId] = useState(null);
  const [search,        setSearch]        = useState('');

  // photo lightbox
  const [lightbox, setLightbox] = useState(null); // null | { photos, index }
  const openLightbox = (photos, index) => setLightbox({ photos, index });

  const printRef = useRef(null);

  const load = async () => {
    try {
      setLoading(true);
      const [p, outil] = await Promise.all([gammeFabService.getById(id), outillageService.getAll()]);
      setProc(p);
      setOutillages(Array.isArray(outil) ? outil : []);
    } catch { setProc(null); setOutillages([]); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [id]);

  const etapes = proc?.etapes || [];
  const rows = useMemo(() => buildRows(etapes), [etapes]);

  const filteredOut = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return outillages;
    return outillages.filter((o) =>
      o.designation.toLowerCase().includes(q) ||
      (o.references || []).some((r) => r.reference.toLowerCase().includes(q)));
  }, [outillages, search]);

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const saveNom = async () => {
    if (!nomDraft.trim()) return;
    await gammeFabService.updateProcessus(id, { nom: nomDraft.trim() });
    setEditingNom(false); load();
  };
  const deleteProc = async () => {
    if (!proc || !window.confirm(`Supprimer "${proc.nom}" et toutes ses étapes ?`)) return;
    await gammeFabService.deleteProcessus(id);
    navigate('/industrialization/gamme-fab');
  };

  const saveEtape = async (etapeId) => {
    if (!editEtapeNom.trim()) return;
    await gammeFabService.updateEtape(etapeId, { nom_etape: editEtapeNom.trim() });
    setEditEtapeId(null); load();
  };
  const deleteEtape = async (e) => {
    if (!window.confirm(`Supprimer "${e.nom_etape}" ?`)) return;
    await gammeFabService.deleteEtape(e.id); load();
  };
  const createEtape = async () => {
    if (!newEtapeNom.trim()) return;
    await gammeFabService.createEtape({ processus_id: id, nom_etape: newEtapeNom.trim() });
    setNewEtapeNom(''); setAddingEtape(false); load();
  };

  const addOutillage = async (etape_id, outillage_id) => {
    await gammeFabService.addOutillageToEtape({ etape_id, outillage_id });
    setPickerEtapeId(null); setSearch(''); load();
  };
  const removeOutillage = async (gid) => {
    await gammeFabService.removeOutillageFromEtape(gid); load();
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const inp = 'rounded-[7px] border px-2.5 py-1 text-[13px] outline-none focus:ring-2 focus:ring-[var(--accent)] transition';
  const inpSt = { background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' };
  const th = 'px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider';

  if (loading) {
    return (
      <div className="flex items-center justify-center flex-1" style={{ background: 'var(--bg)' }}>
        <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
      </div>
    );
  }

  if (!proc) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3" style={{ background: 'var(--bg)', color: 'var(--text3)' }}>
        <p className="text-sm font-medium">Processus introuvable.</p>
        <button onClick={() => navigate('/industrialization/gamme-fab')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--accent)' }}>
          <ChevronLeft className="w-3.5 h-3.5" /> Retour aux gammes de fabrication
        </button>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col flex-1 overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Print-only styling: hide everything except #gamme-print-area, and
          force readable ink-on-paper colors regardless of the active theme. */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #gamme-print-area, #gamme-print-area * { visibility: visible; }
          #gamme-print-area { position: absolute; left: 0; top: 0; width: 100%; }
          #gamme-print-area, #gamme-print-area * {
            background: #ffffff !important;
            color: #0f1d35 !important;
            border-color: #cbd5e1 !important;
            box-shadow: none !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Header */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 px-[26px] py-4 border-b flex-shrink-0"
        style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => navigate('/industrialization/gamme-fab')}
            className="flex items-center gap-1 text-xs font-semibold flex-shrink-0 transition-colors hover:text-[var(--accent)]"
            style={{ color: 'var(--text3)' }}>
            <ChevronLeft className="w-3.5 h-3.5" /> Gammes de fabrication
          </button>
          <div className="w-px h-4 flex-shrink-0" style={{ background: 'var(--border)' }} />
          <div className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            <ScrollText className="w-4 h-4" strokeWidth={1.8} />
          </div>
          {editingNom ? (
            <div className="flex items-center gap-1.5 min-w-0">
              <input autoFocus className={`${inp} font-semibold`} style={{ ...inpSt, minWidth: 220 }}
                value={nomDraft} onChange={(e) => setNomDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') saveNom(); if (e.key === 'Escape') setEditingNom(false); }} />
              <button onClick={saveNom} className="p-1.5 rounded-[6px] text-white flex-shrink-0" style={{ background: 'var(--accent)' }}>
                <Check className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setEditingNom(false)} className="p-1.5 rounded-[6px] flex-shrink-0" style={{ color: 'var(--text3)' }}>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button onClick={() => { setEditingNom(true); setNomDraft(proc.nom); }}
              className="group/title flex items-center gap-2 min-w-0 text-left">
              <h1 className="font-display font-semibold text-[19px] truncate" style={{ color: 'var(--text)', letterSpacing: '-0.3px' }}>
                {proc.nom}
              </h1>
              <Pencil className="w-3.5 h-3.5 flex-shrink-0 opacity-0 group-hover/title:opacity-100 transition-opacity" style={{ color: 'var(--text3)' }} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[9px] text-xs font-semibold transition-colors hover:bg-[var(--panel3)]"
            style={{ border: '1px solid var(--border)', color: 'var(--text2)' }}>
            <Printer className="w-3.5 h-3.5" strokeWidth={1.8} />
            Imprimer / Export PDF
          </button>
          <button onClick={deleteProc}
            className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center transition-colors hover:bg-[var(--crit-soft)] hover:text-[var(--crit)]"
            style={{ color: 'var(--text3)' }}>
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-[26px] py-5">
        <div id="gamme-print-area">
          {/* Print-only title block (hidden on screen, shown only when printing) */}
          <div className="hidden print:block mb-4">
            <h2 className="text-[18px] font-bold">{proc.nom}</h2>
            <p className="text-[11px] mt-0.5" style={{ color: '#475569' }}>
              Gamme de fabrication — exportée le {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>

          <div className="rounded-[14px] overflow-hidden border"
            style={{ borderColor: 'var(--border)', background: 'var(--bg2)' }}>
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr style={{ background: 'var(--bg3)', borderBottom: '2px solid var(--border)' }}>
                  <th className={th} style={{ color: 'var(--text3)', width: '20%' }}>Étape</th>
                  <th className={th} style={{ color: 'var(--text3)' }}>Désignation</th>
                  <th className={th} style={{ color: 'var(--text3)' }}>Références</th>
                  <th className={th} style={{ color: 'var(--text3)', width: '60px' }}>Qté</th>
                  <th className={`${th} no-print`} style={{ color: 'var(--text3)', width: '90px' }}>Photos</th>
                  <th className="no-print" style={{ width: '40px' }} />
                </tr>
              </thead>

              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-[12px]" style={{ color: 'var(--text3)' }}>
                      Aucune étape — ajoutez-en une ci-dessous.
                    </td>
                  </tr>
                )}

                {rows.map((row) => (
                  <tr key={row.key}
                    className={row.type === 'data' ? 'group/row hover:bg-[var(--bg3)] transition-colors' : ''}
                    style={{ borderBottom: '1px solid var(--border)' }}>

                    {/* ── Col 1: Étape (rowspan) ── */}
                    {row.type === 'add-out' ? null : row._etapeStart ? (
                      <td rowSpan={row._etapeSpan} className="px-4 py-3 align-top group/etape"
                        style={{ borderRight: '1px solid var(--border)', verticalAlign: 'top', paddingTop: '14px' }}>
                        {editEtapeId === row.etape.id ? (
                          <div className="flex flex-col gap-1.5">
                            <input autoFocus className={`w-full ${inp}`} style={inpSt}
                              value={editEtapeNom} onChange={(e) => setEditEtapeNom(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEtape(row.etape.id);
                                if (e.key === 'Escape') setEditEtapeId(null);
                              }} />
                            <div className="flex gap-1 no-print">
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
                              <span className="font-semibold text-[13px] leading-snug" style={{ color: 'var(--text)' }}>
                                {row.etape.nom_etape}
                              </span>
                            </div>
                            <div className="flex gap-0.5 opacity-0 group-hover/etape:opacity-100 transition-opacity flex-shrink-0 no-print">
                              <button onClick={() => { setEditEtapeId(row.etape.id); setEditEtapeNom(row.etape.nom_etape); }}
                                className="p-1 rounded-[5px] hover:bg-[var(--accent-soft)]" style={{ color: 'var(--accent)' }}>
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button onClick={() => deleteEtape(row.etape)}
                                className="p-1 rounded-[5px] hover:bg-red-100 dark:hover:bg-red-900/20" style={{ color: 'var(--crit)' }}>
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    ) : null}

                    {/* ── Cols 2-6: Data / add-out / empty-out ── */}
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
                        <td className="px-4 py-2.5 font-semibold text-center" style={{ color: 'var(--text)' }}>
                          {row.g?.outillage?.quantity ?? '—'}
                        </td>
                        <td className="px-4 py-2.5 no-print">
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
                        <td className="px-2 py-2.5 no-print">
                          <button onClick={() => removeOutillage(row.g.id)}
                            className="opacity-0 group-hover/row:opacity-100 p-1 rounded-[5px] hover:bg-red-100 dark:hover:bg-red-900/20 transition"
                            style={{ color: 'var(--crit)' }}>
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </>
                    )}

                    {row.type === 'empty-out' && (
                      <td colSpan={5} className="px-4 py-2.5 text-[12px]" style={{ color: 'var(--text3)' }}>
                        Aucun outillage
                      </td>
                    )}

                    {row.type === 'add-out' && (
                      <td colSpan={5} className="px-4 py-2 no-print">
                        {pickerEtapeId === row.etape.id ? (
                          <div className="rounded-[10px] border overflow-hidden" style={{ borderColor: 'var(--accent)', background: 'var(--bg2)' }}>
                            <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                              <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text3)' }} />
                              <input autoFocus className="flex-1 text-[13px] bg-transparent outline-none" style={{ color: 'var(--text)' }}
                                value={search} onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Escape') { setPickerEtapeId(null); setSearch(''); } }}
                                placeholder="Rechercher par désignation ou référence…" />
                              <button onClick={() => { setPickerEtapeId(null); setSearch(''); }} style={{ color: 'var(--text3)' }}>
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="max-h-[180px] overflow-y-auto">
                              {filteredOut.length === 0 ? (
                                <p className="text-center py-3 text-[12px]" style={{ color: 'var(--text3)' }}>Aucun résultat</p>
                              ) : filteredOut.map((o) => (
                                <button key={o.id}
                                  onClick={() => addOutillage(row.etape.id, o.id)}
                                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[var(--bg3)] text-left border-b last:border-0 transition-colors"
                                  style={{ borderColor: 'var(--border)' }}>
                                  <Package className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                                  <span className="flex-1 text-[13px] font-medium" style={{ color: 'var(--text)' }}>{o.designation}</span>
                                  <div className="flex flex-wrap gap-1">
                                    {(o.references || []).map((r, ri) => (
                                      <span key={ri} className="font-mono text-[10px]" style={{ color: 'var(--text3)' }}>{r.reference}</span>
                                    ))}
                                  </div>
                                  <span className="text-[11px] font-semibold flex-shrink-0" style={{ color: 'var(--text3)' }}>Qté {o.quantity}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => { setPickerEtapeId(row.etape.id); setSearch(''); }}
                            className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-[7px] transition-colors hover:bg-[var(--accent-soft)]"
                            style={{ color: 'var(--accent)' }}>
                            <Plus className="w-3 h-3" /> Ajouter un outillage
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}

                {/* ── Add étape row ── */}
                <tr className="no-print" style={{ borderTop: '2px solid var(--border)' }}>
                  <td colSpan={6} className="px-4 py-3" style={{ background: 'var(--bg3)' }}>
                    {addingEtape ? (
                      <div className="flex items-center gap-2">
                        <input autoFocus className={`flex-1 max-w-xs ${inp}`} style={inpSt}
                          value={newEtapeNom} onChange={(e) => setNewEtapeNom(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') createEtape();
                            if (e.key === 'Escape') { setAddingEtape(false); setNewEtapeNom(''); }
                          }}
                          placeholder="Nom de l'étape…" />
                        <button onClick={createEtape} className="p-1.5 rounded-[7px] text-white" style={{ background: 'var(--accent)' }}>
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { setAddingEtape(false); setNewEtapeNom(''); }}
                          className="p-1.5 rounded-[7px]" style={{ color: 'var(--text3)', background: 'var(--bg)' }}>
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setAddingEtape(true)}
                        className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-[8px] border border-dashed transition-colors hover:bg-[var(--bg2)]"
                        style={{ borderColor: 'var(--border)', color: 'var(--text3)' }}>
                        <Plus className="w-3.5 h-3.5" /> Ajouter une étape
                      </button>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

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
