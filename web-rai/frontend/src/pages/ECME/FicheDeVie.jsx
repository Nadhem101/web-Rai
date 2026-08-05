import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ecmeService } from '../../services/api';
import { Pencil, Save, X, Plus, Trash2, FlaskConical } from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────────────────────
const ALERTE_CONFIG = {
  VALABLE:      { label: 'Valable',                  bg: 'var(--ok-soft)',   color: 'var(--ok)',    dot: '🟢' },
  VERIFICATION: { label: 'Vérification requise',     bg: 'var(--crit-soft)', color: 'var(--crit)',  dot: '🔴' },
  EXEMPTE:      { label: 'Exempté de vérification',  bg: 'var(--info-soft)', color: 'var(--info)',  dot: '⚪' },
  DECLASSE:     { label: 'Déclassé définitivement',  bg: 'var(--panel2)',    color: 'var(--text3)', dot: '⚫' },
  INCONNU:      { label: 'Statut inconnu',            bg: 'var(--warn-soft)', color: 'var(--warn)',  dot: '🟡' },
};
const ALERTE_OPTIONS = ['VALABLE','VERIFICATION','EXEMPTE','DECLASSE'];
const VERIF_TYPE_OPTIONS = ['', 'Interne', 'Externe', 'IP', 'Exempté'];

function fmtDate(raw) {
  if (!raw) return '—';
  const d = new Date(raw);
  if (isNaN(d)) return raw;
  return d.toLocaleDateString('fr-FR');
}

const toInputDate = (val) => {
  if (!val) return '';
  const d = new Date(val);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
};

const uid = () => Math.random().toString(36).slice(2, 9);

// ── Editable field row ────────────────────────────────────────────────────────
function InfoRow({ label, value, editing, editNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-2.5 last:border-0"
      style={{ borderBottom: '1px solid var(--border2)' }}>
      <dt className="text-xs font-semibold sm:w-52 flex-shrink-0 pt-0.5" style={{ color: 'var(--text3)' }}>{label}</dt>
      <dd className="text-sm flex-1" style={{ color: 'var(--text)' }}>
        {editing ? editNode : (value || '—')}
      </dd>
    </div>
  );
}

// ── Inline input styles ───────────────────────────────────────────────────────
const inputCls = 'w-full rounded-[8px] px-2.5 py-1 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]';
const inputStyle = { background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--text)' };

// ── Main component ────────────────────────────────────────────────────────────
export default function FicheDeVie() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [editing, setEditing] = useState(false);
  const [form,    setForm]    = useState({});
  const [saving,  setSaving]  = useState(false);
  const [saveErr, setSaveErr] = useState('');

  // Remarques rows (always live-editable)
  const [rows,    setRows]    = useState([]);

  const reload = useCallback(() => {
    setLoading(true);
    ecmeService.getOne(code)
      .then(({ data: d }) => {
        setData(d);
        setRows(Array.isArray(d.details_maintenance) ? d.details_maintenance : []);
      })
      .catch(e => setError(e.response?.data?.error || e.message))
      .finally(() => setLoading(false));
  }, [code]);

  useEffect(() => { reload(); }, [reload]);

  // Seed the edit form from current data
  const startEdit = () => {
    if (!data) return;
    setForm({
      designation:                data.designation || '',
      marque:                     data.marque || '',
      n_serie:                    data.n_serie || '',
      affectation:                data.affectation || '',
      necessite_verification:     data.necessite_verification ?? true,
      verif_type:                 data.verif_type || '',
      emt:                        data.emt || '',
      alerte:                     data.alerte || 'VALABLE',
      date_derniere_verification: toInputDate(data.date_derniere_verification),
      date_prochaine_verification: toInputDate(data.date_prochaine_verification),
      date_alerte:                toInputDate(data.date_alerte),
      remarques:                  data.remarques || '',
    });
    setSaveErr('');
    setEditing(true);
  };

  const cancelEdit = () => { setEditing(false); setSaveErr(''); };

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const save = async () => {
    setSaving(true); setSaveErr('');
    try {
      await ecmeService.update(code, {
        ...form,
        emt: form.emt.trim() || null,
        details_maintenance: rows,
        date_derniere_verification:  form.date_derniere_verification  || null,
        date_prochaine_verification: form.date_prochaine_verification || null,
        date_alerte:                 form.date_alerte                 || null,
      });
      setEditing(false);
      reload();
    } catch (e) {
      setSaveErr(e.response?.data?.error || e.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  // Save only the rows (without entering full edit mode)
  const saveRows = useCallback(async (nextRows) => {
    if (!data) return;
    try {
      await ecmeService.update(code, { details_maintenance: nextRows });
    } catch {
      // silent — rows are still in local state
    }
  }, [code, data]);

  // Row helpers
  const addRow = () => {
    const next = [...rows, { id: uid(), description: '', valeur: '' }];
    setRows(next);
    saveRows(next);
  };

  const updateRow = (id, field, value) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  // Save rows on blur (debounced via useRef)
  const saveTimer = useRef(null);
  const scheduleSaveRows = (nextRows) => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveRows(nextRows), 800);
  };

  const handleRowChange = (id, field, value) => {
    const next = rows.map(r => r.id === id ? { ...r, [field]: value } : r);
    setRows(next);
    scheduleSaveRows(next);
  };

  const deleteRow = (id) => {
    const next = rows.filter(r => r.id !== id);
    setRows(next);
    saveRows(next);
  };

  // ── Loading / Error states ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 flex-1 overflow-auto flex items-center justify-center">
        <p className="text-sm animate-pulse" style={{ color: 'var(--text3)' }}>Chargement de la fiche...</p>
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="px-[26px] pt-6 flex-1 overflow-auto" style={{ background: 'var(--bg)' }}>
        <button onClick={() => navigate(-1)} className="mb-4 text-sm hover:underline" style={{ color: 'var(--accent)' }}>← Retour</button>
        <div className="p-4 rounded-[10px]" style={{ background: 'var(--crit-soft)', border: '1px solid var(--crit)', color: 'var(--crit)' }}>
          {error || 'ECME non trouvé'}
        </div>
      </div>
    );
  }

  const alerteCfg = ALERTE_CONFIG[data.alerte] || ALERTE_CONFIG.INCONNU;
  const today = new Date();
  const nextVerifDate = data.date_prochaine_verification ? new Date(data.date_prochaine_verification) : null;
  const isOverdue = nextVerifDate && nextVerifDate < today && data.alerte !== 'EXEMPTE' && data.alerte !== 'DECLASSE';
  const interventions = data.interventions || [];

  return (
    <div className="px-[26px] pt-6 pb-10 flex-1 overflow-auto space-y-4" style={{ background: 'var(--bg)' }}>

      {/* ── Topbar ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button onClick={() => navigate('/ecme')} className="flex items-center gap-1 text-sm hover:underline" style={{ color: 'var(--accent)' }}>
          ← Retour à la liste
        </button>

        {editing ? (
          <div className="flex items-center gap-2">
            {saveErr && <span className="text-xs" style={{ color: 'var(--crit)' }}>{saveErr}</span>}
            <button onClick={cancelEdit}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[13px] font-medium transition-colors hover:bg-[var(--panel3)]"
              style={{ border: '1px solid var(--border)', color: 'var(--text2)' }}>
              <X size={14} /> Annuler
            </button>
            <button onClick={save} disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] text-[13px] font-bold text-white disabled:opacity-50 transition-transform hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))', boxShadow: '0 4px 14px var(--accent-soft)' }}>
              <Save size={14} /> {saving ? 'Sauvegarde…' : 'Enregistrer'}
            </button>
          </div>
        ) : (
          <button onClick={startEdit}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))', boxShadow: '0 4px 14px var(--accent-soft)' }}>
            <Pencil size={14} /> Modifier
          </button>
        )}
      </div>

      {/* ── Header card ── */}
      <div className="rounded-[14px] p-5" style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5 mb-2 flex-wrap">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-[6px]"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>
                {data.code}
              </span>
              {editing ? (
                <select value={form.alerte} onChange={e => set('alerte', e.target.value)}
                  className="rounded-[20px] px-3 py-0.5 text-xs font-bold outline-none"
                  style={{ background: ALERTE_CONFIG[form.alerte]?.bg, color: ALERTE_CONFIG[form.alerte]?.color, border: 'none' }}>
                  {ALERTE_OPTIONS.map(o => (
                    <option key={o} value={o} style={{ color: '#000' }}>
                      {ALERTE_CONFIG[o]?.dot} {ALERTE_CONFIG[o]?.label}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-[20px] text-xs font-bold"
                  style={{ background: alerteCfg.bg, color: alerteCfg.color }}>
                  {alerteCfg.dot} {alerteCfg.label}
                </span>
              )}
              {isOverdue && !editing && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[20px] text-xs font-bold text-white animate-pulse"
                  style={{ background: 'var(--crit)' }}>
                  ⚠ EN RETARD
                </span>
              )}
            </div>
            {editing ? (
              <input value={form.designation} onChange={e => set('designation', e.target.value)}
                className="font-display font-semibold text-[22px] bg-transparent outline-none border-b-2 w-full"
                style={{ color: 'var(--text)', borderColor: 'var(--accent)', letterSpacing: '-0.3px' }} />
            ) : (
              <h1 className="font-display font-semibold text-[22px]" style={{ color: 'var(--text)', letterSpacing: '-0.3px' }}>{data.designation}</h1>
            )}
            {!editing && data.affectation && (
              <p className="text-sm mt-0.5" style={{ color: 'var(--accent)' }}>📍 {data.affectation}</p>
            )}
          </div>
          <div className="text-right text-xs" style={{ color: 'var(--text3)' }}>
            <div>Fiche de vie — FQ008/00</div>
            <div className="font-mono">R.A.I.</div>
          </div>
        </div>
      </div>

      {/* ── Info cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Identification */}
        <div className="rounded-[14px] p-5" style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
          <h2 className="text-sm font-bold mb-3 pb-2" style={{ color: 'var(--text)', borderBottom: '1px solid var(--border2)' }}>Identification</h2>
          <dl>
            <InfoRow label="Code" value={data.code} editing={false} />
            <InfoRow label="Désignation" value={data.designation} editing={editing}
              editNode={<input value={form.designation} onChange={e => set('designation', e.target.value)} className={inputCls} style={inputStyle} />} />
            <InfoRow label="Marque / Modèle" value={data.marque} editing={editing}
              editNode={<input value={form.marque} onChange={e => set('marque', e.target.value)} placeholder="ex: MITUTOYO" className={inputCls} style={inputStyle} />} />
            <InfoRow label="N° de série" value={data.n_serie} editing={editing}
              editNode={<input value={form.n_serie} onChange={e => set('n_serie', e.target.value)} placeholder="ex: 7C3857" className={inputCls} style={inputStyle} />} />
            <InfoRow label="Affectation" value={data.affectation} editing={editing}
              editNode={<input value={form.affectation} onChange={e => set('affectation', e.target.value)} placeholder="ex: Maintenance" className={inputCls} style={inputStyle} />} />
          </dl>
        </div>

        {/* Vérification */}
        <div className="rounded-[14px] p-5" style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
          <h2 className="text-sm font-bold mb-3 pb-2" style={{ color: 'var(--text)', borderBottom: '1px solid var(--border2)' }}>Vérification</h2>
          <dl>
            <InfoRow label="Nécessite vérification"
              value={data.necessite_verification ? 'Oui' : 'Non'}
              editing={editing}
              editNode={
                <div className="flex items-center gap-4">
                  {[true, false].map(v => (
                    <label key={String(v)} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" checked={form.necessite_verification === v}
                        onChange={() => set('necessite_verification', v)}
                        style={{ accentColor: 'var(--accent)' }} />
                      <span className="text-sm">{v ? 'Oui' : 'Non'}</span>
                    </label>
                  ))}
                </div>
              } />
            <InfoRow label="Type de vérification" value={data.verif_type} editing={editing}
              editNode={
                <select value={form.verif_type} onChange={e => set('verif_type', e.target.value)} className={inputCls} style={inputStyle}>
                  {VERIF_TYPE_OPTIONS.map(v => <option key={v} value={v}>{v || '— Choisir —'}</option>)}
                </select>
              } />
            <InfoRow label="Dernière vérification" value={fmtDate(data.date_derniere_verification)} editing={editing}
              editNode={<input type="date" value={form.date_derniere_verification} onChange={e => set('date_derniere_verification', e.target.value)} className={inputCls} style={inputStyle} />} />
            <InfoRow label="Prochaine vérification"
              value={<span style={{ color: isOverdue ? 'var(--crit)' : undefined, fontWeight: isOverdue ? 600 : undefined }}>
                {fmtDate(data.date_prochaine_verification)}{isOverdue && ' ⚠ Dépassée'}
              </span>}
              editing={editing}
              editNode={<input type="date" value={form.date_prochaine_verification} onChange={e => set('date_prochaine_verification', e.target.value)} className={inputCls} style={inputStyle} />} />
            <InfoRow label="Date alerte" value={fmtDate(data.date_alerte)} editing={editing}
              editNode={<input type="date" value={form.date_alerte} onChange={e => set('date_alerte', e.target.value)} className={inputCls} style={inputStyle} />} />
            <InfoRow label="EMT"
              value={data.emt
                ? <span className="font-mono text-sm px-2 py-0.5 rounded" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>{data.emt}</span>
                : '—'}
              editing={editing}
              editNode={<input value={form.emt} onChange={e => set('emt', e.target.value)} placeholder="ex: ± 1 Ω" className={inputCls} style={inputStyle} />} />
          </dl>
        </div>
      </div>

      {/* ── Remarques table ── */}
      <div className="rounded-[14px] overflow-hidden" style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border2)' }}>
          <div>
            <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>📝 Remarques</h2>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text3)' }}>
              Détails de maintenance, contrôles à effectuer et valeurs de référence
            </p>
          </div>
          <button onClick={addRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-semibold text-white transition-opacity hover:opacity-80"
            style={{ background: 'var(--accent)' }}>
            <Plus size={13} /> Ajouter
          </button>
        </div>

        {rows.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm" style={{ color: 'var(--text3)' }}>
            Aucune remarque. Cliquez sur «&nbsp;Ajouter&nbsp;» pour commencer.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--panel2)', borderBottom: '1px solid var(--border2)' }}>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wide w-8" style={{ color: 'var(--text3)' }}>#</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--text3)' }}>Description / Contrôle</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wide w-48" style={{ color: 'var(--text3)' }}>Valeur / Référence</th>
                  <th className="px-2 py-2.5 w-8" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid var(--border2)', background: idx % 2 === 0 ? 'var(--panel)' : 'var(--panel2)' }}>
                    <td className="px-4 py-2 text-xs font-mono" style={{ color: 'var(--text3)' }}>{idx + 1}</td>
                    <td className="px-4 py-2">
                      <input
                        value={row.description}
                        onChange={e => handleRowChange(row.id, 'description', e.target.value)}
                        placeholder="ex: Vérifier la précision de mesure"
                        className="w-full bg-transparent outline-none text-sm border-b border-transparent focus:border-[var(--accent)]"
                        style={{ color: 'var(--text)' }}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        value={row.valeur}
                        onChange={e => handleRowChange(row.id, 'valeur', e.target.value)}
                        placeholder="ex: ± 0.02 mm"
                        className="w-full bg-transparent outline-none text-sm border-b border-transparent focus:border-[var(--accent)]"
                        style={{ color: 'var(--text2)' }}
                      />
                    </td>
                    <td className="px-2 py-2">
                      <button onClick={() => deleteRow(row.id)}
                        className="p-1 rounded transition-colors hover:bg-[var(--crit-soft)] hover:text-[var(--crit)]"
                        style={{ color: 'var(--text3)' }}>
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Remarque texte libre (existing field) ── */}
      {(data.remarques || editing) && (
        <div className="rounded-[12px] p-4" style={{ background: 'var(--warn-soft)', border: '1px solid var(--warn)' }}>
          <h2 className="text-xs font-semibold mb-2" style={{ color: 'var(--warn)' }}>📌 Note générale</h2>
          {editing ? (
            <textarea value={form.remarques} onChange={e => set('remarques', e.target.value)}
              rows={3} placeholder="Notes, observations…"
              className="w-full rounded-[8px] px-3 py-2 text-sm outline-none resize-none focus:ring-2 focus:ring-[var(--accent)]"
              style={{ background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text)' }} />
          ) : (
            <p className="text-sm" style={{ color: 'var(--text)' }}>{data.remarques}</p>
          )}
        </div>
      )}

      {/* ── Intervention history ── */}
      <div className="rounded-[14px] overflow-hidden" style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border2)' }}>
          <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>📋 Historique des interventions</h2>
          <span className="text-xs" style={{ color: 'var(--text3)' }}>{interventions.length} entrée(s)</span>
        </div>
        {interventions.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm" style={{ color: 'var(--text3)' }}>Aucune intervention enregistrée</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--panel2)', borderBottom: '1px solid var(--border2)' }}>
                  {['Date','Nature','Résultat','Visa'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[9.5px] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text3)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {interventions.map((int, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border2)', background: idx%2===0 ? 'var(--panel)' : 'var(--panel2)' }}>
                    <td className="px-4 py-2.5 text-xs font-mono" style={{ color: 'var(--text3)' }}>{int.date || '—'}</td>
                    <td className="px-4 py-2.5" style={{ color: 'var(--text)' }}>{int.nature || '—'}</td>
                    <td className="px-4 py-2.5" style={{ color: 'var(--text2)' }}>{int.resultat || '—'}</td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text3)' }}>{int.visa || '—'}</td>
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
