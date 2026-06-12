import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { suiviMoyenService, suiviMoyenLigneService } from '../../services/api';
import {
  ChevronLeft, Plus, Trash2, Save, Check, X, Activity,
  ChevronLeft as PrevWeek, ChevronRight as NextWeek, Download,
  User, Calendar, Pencil,
} from 'lucide-react';

// ── Helpers ────────────────────────────────────────────────
const toInputDate = (v) => {
  if (!v) return '';
  const d = new Date(v);
  if (isNaN(d)) return '';
  return d.toISOString().slice(0, 10);
};

const fmtDate = (v) => {
  if (!v) return '—';
  const d = new Date(v);
  if (isNaN(d)) return '—';
  return d.toLocaleDateString('fr-FR');
};

const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};

const diffDays = (a, b) => {
  if (!a || !b) return null;
  const da = new Date(a), db = new Date(b);
  if (isNaN(da) || isNaN(db)) return null;
  return Math.round((db - da) / 86400000) + 1;
};

const dayName = (d) => ['Di','Lu','Ma','Me','Je','Ve','Sa'][d.getDay()];
const isWeekend = (d) => d.getDay() === 0 || d.getDay() === 6;

const PRIORITE_OPTS = ['Haute', 'Normale', 'Basse'];
const PRIORITE_CLS  = {
  Haute:   'bg-red-100 text-red-700 border-red-200',
  Normale: 'bg-sky-100 text-sky-700 border-sky-200',
  Basse:   'bg-slate-100 text-slate-500 border-slate-200',
};

const fieldCls = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-colors';
const labelCls = 'mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500';

const EMPTY_LIGNE = (suiviId, ordre) => ({
  _lid: `new-${Date.now()}`, id: null, suivi_moyen_id: Number(suiviId), ordre,
  client: '', numero_affaire: '', reference: '', delai_max: '',
  priorite: 'Normale', type_demande: '', activite: '', attribue_a: '',
  avancement: 0, date_debut: '', date_fin: '', commentaire: '',
});

// ── Bar color ──────────────────────────────────────────────
const getBarColor = (ligne, today) => {
  const av = Number(ligne.avancement) || 0;
  if (av >= 100) return '#22c55e';        // green — done
  const fin = ligne.date_fin ? new Date(ligne.date_fin) : null;
  if (fin && fin < today && av < 100) return '#ef4444';  // red — overdue
  if (av > 0) return '#f59e0b';           // amber — in progress
  return '#93c5fd';                       // light blue — not started
};

// ── Progress overview ─────────────────────────────────────
const ProgressBar = ({ lignes }) => {
  const total   = lignes.length;
  const done    = lignes.filter(l => Number(l.avancement) >= 100).length;
  const inProg  = lignes.filter(l => Number(l.avancement) > 0 && Number(l.avancement) < 100).length;
  const notStart= total - done - inProg;
  const pctDone = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex-1 min-w-[200px]">
        <div className="flex justify-between text-xs mb-1">
          <span className="font-semibold text-slate-600">{pctDone}% Finalisé</span>
          <span className="text-slate-400">{done}/{total} tâches</span>
        </div>
        <div className="h-3 rounded-full bg-slate-100 overflow-hidden flex">
          <div className="bg-green-500 transition-all" style={{ width: `${(done/Math.max(total,1))*100}%` }} />
          <div className="bg-amber-400 transition-all" style={{ width: `${(inProg/Math.max(total,1))*100}%` }} />
        </div>
        <div className="flex gap-3 mt-1 text-[10px] text-slate-500">
          <span><span className="inline-block w-2 h-2 rounded-sm bg-green-500 mr-1" />Finalisé ({done})</span>
          <span><span className="inline-block w-2 h-2 rounded-sm bg-amber-400 mr-1" />En cours ({inProg})</span>
          <span><span className="inline-block w-2 h-2 rounded-sm bg-blue-300 mr-1" />Non démarré ({notStart})</span>
        </div>
      </div>
    </div>
  );
};

// ── Main component ─────────────────────────────────────────
const SuiviMoyensDetail = () => {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [header,    setHeader]    = useState({ titre: '', pilote: '', date_debut: '', status: 'actif' });
  const [lignes,    setLignes]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [panel,     setPanel]     = useState(null);   // ligne being edited
  const [editHeader,setEditHeader]= useState(false);

  // Gantt window: offset in weeks from project start
  const [ganttOffset, setGanttOffset] = useState(0);
  const GANTT_WEEKS = 10;

  useEffect(() => {
    if (!id) return;
    suiviMoyenService.getById(id).then(data => {
      setHeader({
        titre:      data.titre      || '',
        pilote:     data.pilote     || '',
        date_debut: toInputDate(data.date_debut) || new Date().toISOString().slice(0,10),
        status:     data.status     || 'actif',
      });
      setLignes((data.lignes || []).map(l => ({ ...EMPTY_LIGNE(id, 0), ...l, _lid: String(l.id) })));
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const saveHeader = useCallback(async (h = header) => {
    setSaving(true);
    try {
      await suiviMoyenService.update(id, h);
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  }, [id, header]);

  const persistLigne = useCallback(async (l) => {
    const payload = {
      suivi_moyen_id: Number(id), ordre: l.ordre ?? 0,
      client: l.client || null, numero_affaire: l.numero_affaire || null,
      reference: l.reference || null, delai_max: l.delai_max || null,
      priorite: l.priorite || 'Normale', type_demande: l.type_demande || null,
      activite: l.activite || null, attribue_a: l.attribue_a || null,
      avancement: Number(l.avancement) || 0,
      date_debut: l.date_debut || null, date_fin: l.date_fin || null,
      commentaire: l.commentaire || null,
    };
    if (l.id) {
      const updated = await suiviMoyenLigneService.update(l.id, payload);
      setLignes(prev => prev.map(x => x._lid === l._lid ? { ...updated, _lid: String(updated.id) } : x));
    } else {
      const created = await suiviMoyenLigneService.create(payload);
      setLignes(prev => prev.map(x => x._lid === l._lid ? { ...created, _lid: String(created.id) } : x));
    }
  }, [id]);

  const addLigne = () => {
    const l = EMPTY_LIGNE(id, lignes.length);
    setLignes(prev => [...prev, l]);
    setPanel({ ...l });
  };

  const deleteLigne = async (l) => {
    if (l.id) try { await suiviMoyenLigneService.delete(l.id); } catch { return; }
    setLignes(prev => prev.filter(x => x._lid !== l._lid));
    if (panel?._lid === l._lid) setPanel(null);
  };

  const savePanel = async () => {
    if (!panel) return;
    setSaving(true);
    try { await persistLigne(panel); setPanel(null); }
    catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const up = (f, v) => setPanel(p => ({ ...p, [f]: v }));

  // ── Gantt date range ────────────────────────────────────
  const ganttStart = useMemo(() => {
    const base = header.date_debut ? new Date(header.date_debut) : new Date();
    return addDays(base, ganttOffset * 7);
  }, [header.date_debut, ganttOffset]);

  const ganttDays = useMemo(() => {
    return Array.from({ length: GANTT_WEEKS * 7 }, (_, i) => addDays(ganttStart, i));
  }, [ganttStart]);

  const weekGroups = useMemo(() => {
    const groups = [];
    let cur = null;
    ganttDays.forEach(d => {
      const weekLabel = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
      // Start new group on Monday (or first day)
      if (!cur || d.getDay() === 1) {
        cur = { label: d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }), days: [] };
        groups.push(cur);
      }
      cur.days.push(d);
    });
    return groups;
  }, [ganttDays]);

  const today = useMemo(() => { const t = new Date(); t.setHours(0,0,0,0); return t; }, []);

  // Is a day in a ligne's range?
  const dayInRange = (ligne, day) => {
    if (!ligne.date_debut || !ligne.date_fin) return false;
    const s = new Date(ligne.date_debut); s.setHours(0,0,0,0);
    const e = new Date(ligne.date_fin);   e.setHours(0,0,0,0);
    const d = new Date(day);              d.setHours(0,0,0,0);
    return d >= s && d <= e;
  };

  // Export simple PDF (table only, no Gantt for readability)
  const exportPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const PW = pdf.internal.pageSize.getWidth();
    const PH = pdf.internal.pageSize.getHeight();
    const M  = 10;

    pdf.setFillColor(15, 29, 53);
    pdf.rect(0, 0, PW, 22, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(13); pdf.setFont('helvetica','bold');
    pdf.text(header.titre || 'Suivi des moyens', M, 10);
    pdf.setFontSize(8); pdf.setFont('helvetica','normal');
    pdf.text(`Pilote: ${header.pilote || '—'}   Début: ${fmtDate(header.date_debut)}   Exporté le ${new Date().toLocaleDateString('fr-FR')}`, M, 17);

    let y = 28;
    const cols = [
      { label: 'Client',       w: 22 },
      { label: 'N° Affaire',   w: 22 },
      { label: 'Référence',    w: 35 },
      { label: 'Délai max',    w: 20 },
      { label: 'Priorité',     w: 16 },
      { label: 'Type demande', w: 30 },
      { label: 'Activité',     w: 35 },
      { label: 'Attribuée à',  w: 28 },
      { label: 'Avanc.%',      w: 15 },
      { label: 'Début',        w: 18 },
      { label: 'Fin',          w: 18 },
      { label: 'Jours',        w: 12 },
      { label: 'Commentaire',  w: 0  },
    ];
    const usedW = cols.slice(0,-1).reduce((s,c) => s+c.w, 0);
    cols[cols.length-1].w = PW - 2*M - usedW;

    // Header row
    pdf.setFillColor(14, 165, 233);
    pdf.rect(M, y, PW-2*M, 7, 'F');
    pdf.setTextColor(255,255,255); pdf.setFontSize(7); pdf.setFont('helvetica','bold');
    let x = M;
    cols.forEach(c => { pdf.text(c.label, x+1, y+5); x += c.w; });
    y += 8;

    lignes.forEach((l, i) => {
      if (y > PH - 15) { pdf.addPage(); y = 15; }
      pdf.setFillColor(i%2===0 ? 255 : 248);
      pdf.rect(M, y, PW-2*M, 7, 'F');
      pdf.setTextColor(30,41,59); pdf.setFont('helvetica','normal'); pdf.setFontSize(7);
      x = M;
      const jours = diffDays(l.date_debut, l.date_fin);
      const vals = [
        l.client||'', l.numero_affaire||'', l.reference||'',
        fmtDate(l.delai_max), l.priorite||'', l.type_demande||'',
        l.activite||'', l.attribue_a||'', `${l.avancement||0}%`,
        fmtDate(l.date_debut), fmtDate(l.date_fin),
        jours!=null?String(jours):'—', l.commentaire||'',
      ];
      cols.forEach((c, ci) => {
        const txt = pdf.splitTextToSize(vals[ci]||'', c.w-2)[0] || '';
        pdf.text(txt, x+1, y+5);
        x += c.w;
      });
      // Avancement color bar
      if (l.avancement > 0) {
        const avX = M + cols.slice(0,8).reduce((s,c)=>s+c.w,0);
        const barW = (cols[8].w-4) * (Number(l.avancement)/100);
        pdf.setFillColor(34,197,94);
        pdf.rect(avX+1, y+1, barW, 5, 'F');
      }
      y += 8;
    });

    pdf.save(`suivi-moyens-${id}.pdf`);
  };

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden" style={{ background: 'var(--content-bg)' }}>

      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-white border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={() => navigate('/industrialization/suivi-moyens')}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 flex-shrink-0">
            <ChevronLeft className="w-3.5 h-3.5" /> Suivi des moyens
          </button>
          <div className="w-px h-4 bg-slate-200 flex-shrink-0" />
          <Activity className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
          <span className="text-sm font-bold text-slate-800 truncate">{header.titre || 'Suivi'}</span>
          <button onClick={() => setEditHeader(v => !v)}
            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-sky-600 transition-colors flex-shrink-0">
            <Pencil className="w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={exportPDF}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold text-red-600 bg-white hover:bg-red-50">
            <Download className="w-3.5 h-3.5" /> PDF
          </button>
          <button onClick={() => saveHeader()} disabled={saving}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
            style={{ background: saved ? '#10b981' : 'linear-gradient(135deg,#0ea5e9,#0369a1)' }}>
            {saved ? <><Check className="w-3.5 h-3.5" /> Sauvegardé</> : saving ? 'Sauvegarde…' : <><Save className="w-3.5 h-3.5" /> Sauvegarder</>}
          </button>
        </div>
      </div>

      {/* Header edit panel */}
      {editHeader && (
        <div className="flex-shrink-0 border-b border-slate-200 bg-slate-50 px-5 py-4">
          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <p className={labelCls}>Titre</p>
              <input type="text" value={header.titre} onChange={e => setHeader(h => ({ ...h, titre: e.target.value }))}
                onBlur={() => saveHeader()} className={fieldCls} />
            </div>
            <div>
              <p className={labelCls}>Pilote</p>
              <input type="text" value={header.pilote} onChange={e => setHeader(h => ({ ...h, pilote: e.target.value }))}
                onBlur={() => saveHeader()} className={fieldCls} placeholder="Nom du pilote" />
            </div>
            <div>
              <p className={labelCls}>Début du projet</p>
              <input type="date" value={header.date_debut} onChange={e => setHeader(h => ({ ...h, date_debut: e.target.value }))}
                onBlur={() => saveHeader()} className={fieldCls} />
            </div>
            <div>
              <p className={labelCls}>Statut</p>
              <select value={header.status} onChange={e => { const v = e.target.value; setHeader(h => ({ ...h, status: v })); saveHeader({ ...header, status: v }); }}
                className={fieldCls}>
                <option value="actif">Actif</option>
                <option value="archive">Archivé</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Info bar */}
      <div className="flex-shrink-0 px-5 py-3 bg-white border-b border-slate-100 flex flex-wrap items-center gap-6">
        {header.pilote && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold">Pilote :</span> {header.pilote}
          </div>
        )}
        {header.date_debut && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold">Début :</span> {fmtDate(header.date_debut)}
          </div>
        )}
        <div className="flex-1 min-w-[200px]">
          <ProgressBar lignes={lignes} />
        </div>
      </div>

      {/* Body: table + gantt */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Left: data table */}
        <div className={`flex flex-col overflow-hidden border-r border-slate-200 ${panel ? 'hidden lg:flex lg:w-auto' : 'flex-1'}`}>
          <div className="overflow-auto flex-1">
            <table className="border-collapse text-xs" style={{ minWidth: 900 }}>
              <thead className="sticky top-0 z-10">
                <tr style={{ background: '#0f1d35' }}>
                  {['Client','N° Affaire','Référence','Délai max','Priorité','Type de demande','Activité','Attribuée à','Avanc.','Début','FIN','Jours','Commentaire',''].map(h => (
                    <th key={h} className="px-2 py-2.5 text-left text-[10px] font-bold uppercase tracking-wide text-white border-r border-white/10 last:border-0 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lignes.length === 0 ? (
                  <tr><td colSpan={14} className="py-10 text-center text-slate-400">
                    Aucune tâche — cliquez «&nbsp;Ajouter&nbsp;» ci-dessous
                  </td></tr>
                ) : lignes.map((l, idx) => {
                  const av = Number(l.avancement) || 0;
                  const jours = diffDays(l.date_debut, l.date_fin);
                  const isOverdue = l.date_fin && new Date(l.date_fin) < today && av < 100;
                  const isActive = panel?._lid === l._lid;
                  return (
                    <tr key={l._lid} onClick={() => setPanel({ ...l })}
                      className={`cursor-pointer transition-colors ${isActive ? 'bg-sky-50 ring-1 ring-inset ring-sky-200' : idx%2===0 ? 'bg-white hover:bg-sky-50/30' : 'bg-slate-50/40 hover:bg-sky-50/30'}`}>
                      <td className="px-2 py-2 text-slate-700 max-w-[80px] truncate">{l.client||'—'}</td>
                      <td className="px-2 py-2 font-mono text-slate-600 whitespace-nowrap">{l.numero_affaire||'—'}</td>
                      <td className="px-2 py-2 text-slate-700 max-w-[100px] truncate">{l.reference||'—'}</td>
                      <td className={`px-2 py-2 whitespace-nowrap ${isOverdue?'text-red-600 font-semibold':'text-slate-500'}`}>{fmtDate(l.delai_max)}</td>
                      <td className="px-2 py-2">
                        {l.priorite && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${PRIORITE_CLS[l.priorite]||PRIORITE_CLS.Normale}`}>{l.priorite}</span>
                        )}
                      </td>
                      <td className="px-2 py-2 text-slate-600 max-w-[100px] truncate">{l.type_demande||'—'}</td>
                      <td className="px-2 py-2 text-slate-700 max-w-[120px] truncate font-medium">{l.activite||'—'}</td>
                      <td className="px-2 py-2 text-slate-500 whitespace-nowrap">{l.attribue_a||'—'}</td>
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-14 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full rounded-full transition-all"
                              style={{ width: `${av}%`, background: av>=100?'#22c55e':isOverdue?'#ef4444':'#f59e0b' }} />
                          </div>
                          <span className={`text-[10px] font-bold ${av>=100?'text-green-600':isOverdue?'text-red-600':'text-slate-600'}`}>{av}%</span>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-slate-500 whitespace-nowrap">{fmtDate(l.date_debut)}</td>
                      <td className={`px-2 py-2 whitespace-nowrap ${isOverdue?'text-red-600 font-semibold':'text-slate-500'}`}>{fmtDate(l.date_fin)}</td>
                      <td className="px-2 py-2 text-center font-semibold text-slate-700">{jours??'—'}</td>
                      <td className="px-2 py-2 text-slate-400 max-w-[100px] truncate">{l.commentaire||'—'}</td>
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

          {/* Gantt chart */}
          <div className="flex-shrink-0 border-t border-slate-200">
            {/* Gantt controls */}
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Diagramme de Gantt</span>
              <div className="flex items-center gap-1 ml-auto">
                <button onClick={() => setGanttOffset(o => o-1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100">
                  <PrevWeek className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-semibold text-slate-600 px-2">
                  {ganttStart.toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' })}
                </span>
                <button onClick={() => setGanttOffset(o => o+1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100">
                  <NextWeek className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setGanttOffset(0)}
                  className="ml-1 text-xs font-semibold text-sky-600 hover:underline px-2">
                  Aujourd'hui
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="border-collapse text-[10px]" style={{ minWidth: GANTT_WEEKS*7*24 }}>
                {/* Week headers */}
                <thead>
                  <tr className="bg-slate-100">
                    <th className="sticky left-0 z-20 bg-slate-100 border-r border-slate-200 px-2 py-1 text-[10px] font-bold text-slate-500 text-left whitespace-nowrap w-32">Tâche</th>
                    {weekGroups.map((wg, wi) => (
                      <th key={wi} colSpan={wg.days.length}
                        className="px-1 py-1 font-bold text-slate-600 border-l border-slate-300 text-center whitespace-nowrap">
                        {wg.label}
                      </th>
                    ))}
                  </tr>
                  <tr className="bg-white border-b border-slate-200">
                    <th className="sticky left-0 z-20 bg-white border-r border-slate-200 px-2 py-1" />
                    {ganttDays.map((d, di) => {
                      const isToday = d.toDateString() === today.toDateString();
                      const weekend = isWeekend(d);
                      return (
                        <th key={di}
                          className={`px-0 py-1 text-center font-semibold border-l border-slate-100 w-6 ${
                            isToday ? 'bg-sky-500 text-white' : weekend ? 'text-slate-400 bg-slate-50' : 'text-slate-500'
                          }`}
                          style={{ width: 24, minWidth: 24 }}>
                          {dayName(d)}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {lignes.map((l, li) => {
                    const av = Number(l.avancement) || 0;
                    const barColor = getBarColor(l, today);
                    return (
                      <tr key={l._lid} className={li%2===0 ? 'bg-white' : 'bg-slate-50/40'}>
                        <td className="sticky left-0 z-10 border-r border-slate-200 px-2 py-1 font-medium text-slate-700 whitespace-nowrap max-w-[128px] truncate"
                          style={{ background: li%2===0 ? '#fff' : '#f8fafc' }}>
                          {l.activite || l.reference || `Tâche ${li+1}`}
                        </td>
                        {ganttDays.map((d, di) => {
                          const inRange = dayInRange(l, d);
                          const isToday = d.toDateString() === today.toDateString();
                          const weekend = isWeekend(d);
                          return (
                            <td key={di}
                              className={`border-l border-slate-100 ${weekend ? 'bg-slate-50' : ''} ${isToday ? 'border-l-sky-400' : ''}`}
                              style={{ width: 24, minWidth: 24, height: 24, padding: 1 }}>
                              {inRange && (
                                <div className="w-full h-full rounded-sm"
                                  style={{ background: barColor, opacity: 0.85 }} />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add button */}
          <div className="flex-shrink-0 px-4 py-3 border-t border-slate-200 bg-slate-50">
            <button onClick={addLigne}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#0ea5e9,#0369a1)' }}>
              <Plus className="w-3.5 h-3.5" /> Ajouter une tâche
            </button>
          </div>
        </div>

        {/* Right: edit panel */}
        {panel && (
          <div className="w-full lg:w-96 flex-shrink-0 border-l border-slate-200 bg-white flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-shrink-0"
              style={{ background: '#0f1d35' }}>
              <p className="text-sm font-bold text-white">
                {panel.id ? 'Modifier la tâche' : 'Nouvelle tâche'}
              </p>
              <button onClick={() => setPanel(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className={labelCls}>Client</span>
                  <input type="text" value={panel.client||''} onChange={e=>up('client',e.target.value)} className={fieldCls} placeholder="Client…" />
                </label>
                <label className="block">
                  <span className={labelCls}>N° Affaire</span>
                  <input type="text" value={panel.numero_affaire||''} onChange={e=>up('numero_affaire',e.target.value)} className={fieldCls} placeholder="OP-25_…" />
                </label>
              </div>

              <label className="block">
                <span className={labelCls}>Référence</span>
                <input type="text" value={panel.reference||''} onChange={e=>up('reference',e.target.value)} className={fieldCls} placeholder="KUPREEA1800…" />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className={labelCls}>Priorité</span>
                  <select value={panel.priorite||'Normale'} onChange={e=>up('priorite',e.target.value)} className={fieldCls}>
                    {PRIORITE_OPTS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className={labelCls}>Délai max</span>
                  <input type="date" value={toInputDate(panel.delai_max)} onChange={e=>up('delai_max',e.target.value)} className={fieldCls} />
                </label>
              </div>

              <label className="block">
                <span className={labelCls}>Type de demande</span>
                <input type="text" value={panel.type_demande||''} onChange={e=>up('type_demande',e.target.value)} className={fieldCls} placeholder="Moyen de test, Outillage…" />
              </label>

              <label className="block">
                <span className={labelCls}>Activité</span>
                <input type="text" value={panel.activite||''} onChange={e=>up('activite',e.target.value)} className={fieldCls} placeholder="Description de l'activité…" />
              </label>

              <label className="block">
                <span className={labelCls}>Attribuée à</span>
                <input type="text" value={panel.attribue_a||''} onChange={e=>up('attribue_a',e.target.value)} className={fieldCls} placeholder="Nom du responsable" />
              </label>

              {/* Avancement */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={labelCls}>Avancement</span>
                  <span className={`text-xs font-bold ${Number(panel.avancement)>=100?'text-green-600':'text-slate-600'}`}>
                    {panel.avancement||0}%
                  </span>
                </div>
                <input type="range" min={0} max={100} step={5} value={panel.avancement||0}
                  onChange={e=>up('avancement',parseInt(e.target.value))}
                  className="w-full accent-sky-500" />
                <div className="h-2 rounded-full bg-slate-100 mt-1 overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width:`${panel.avancement||0}%`, background: Number(panel.avancement)>=100?'#22c55e':'#0ea5e9' }} />
                </div>
                {/* Quick buttons */}
                <div className="flex gap-1 mt-2 flex-wrap">
                  {[0,25,50,75,100].map(v => (
                    <button key={v} type="button" onClick={() => up('avancement',v)}
                      className={`text-[10px] font-bold px-2 py-1 rounded border transition-colors ${
                        panel.avancement===v ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}>{v}%</button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className={labelCls}>Date début</span>
                  <input type="date" value={toInputDate(panel.date_debut)} onChange={e=>up('date_debut',e.target.value)} className={fieldCls} />
                </label>
                <label className="block">
                  <span className={labelCls}>Date fin</span>
                  <input type="date" value={toInputDate(panel.date_fin)} onChange={e=>up('date_fin',e.target.value)} className={fieldCls} />
                </label>
              </div>

              {panel.date_debut && panel.date_fin && (
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">
                  <span className="text-xs text-slate-500">Durée :</span>
                  <span className="text-xs font-bold text-slate-800">
                    {diffDays(panel.date_debut, panel.date_fin) ?? '—'} jour(s)
                  </span>
                </div>
              )}

              <label className="block">
                <span className={labelCls}>Commentaire</span>
                <textarea value={panel.commentaire||''} onChange={e=>up('commentaire',e.target.value)}
                  rows={2} className={fieldCls + ' resize-none'} placeholder="Notes, observations…" />
              </label>
            </div>

            <div className="flex gap-2 p-4 border-t border-slate-100 flex-shrink-0">
              <button onClick={savePanel} disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#0ea5e9,#0369a1)' }}>
                {saving ? 'Sauvegarde…' : <><Check className="w-4 h-4 inline mr-1.5" />Enregistrer</>}
              </button>
              <button onClick={() => setPanel(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuiviMoyensDetail;
