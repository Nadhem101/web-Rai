import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { equipementService, ferBainRecordService } from '../../services/api';
import { Pencil, Trash2, Plus, X, ChevronDown, ChevronRight, Thermometer, Save } from 'lucide-react';

// ─── helpers ────────────────────────────────────────────────────────────────

const normalizeText = (v = '') =>
  String(v ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

const isFerEtBain = (eq) => {
  const cat = normalizeText(eq?.categorie);
  if (['fer-a-souder', 'bain-creuset', 'fer-et-bain'].includes(cat)) return true;
  const des = normalizeText(eq?.designation);
  return des.includes('fer a souder') || des.includes('bain creuset');
};

const fmt = (v) => (v === null || v === undefined || v === '' ? '-' : v);

const fmtDate = (v) => {
  if (!v) return '-';
  const s = String(v).trim();
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  return s;
};

const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const STATUT_OPTIONS = ['Conforme', 'Non-conforme', 'À vérifier'];

const statutStyle = (s) => {
  if (s === 'Conforme')    return { background: 'var(--ok-soft)',   color: 'var(--ok)' };
  if (s === 'Non-conforme') return { background: 'var(--crit-soft)', color: 'var(--crit)' };
  return { background: 'var(--warn-soft)', color: 'var(--warn)' };
};

// ─── RecordModal ─────────────────────────────────────────────────────────────

function RecordModal({ modal, onClose, onSaved }) {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!modal) return;
    if (modal.record) {
      setForm({
        date_controle:  modal.record.date_controle ?? todayISO(),
        valeur_mesuree: modal.record.valeur_mesuree ?? '',
        seuil_reference: modal.record.seuil_reference ?? modal.equip?.fer_bain_seuil ?? '',
        statut:         modal.record.statut ?? 'À vérifier',
        remarque:       modal.record.remarque ?? '',
      });
    } else {
      setForm({
        date_controle:  todayISO(),
        valeur_mesuree: '',
        seuil_reference: modal.equip?.fer_bain_seuil ?? '',
        statut:         'À vérifier',
        remarque:       '',
      });
    }
    setError('');
  }, [modal]);

  if (!modal || !form) return null;

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.date_controle) { setError('La date est obligatoire.'); return; }
    setSaving(true);
    setError('');
    try {
      const payload = {
        equipement_id:   modal.equip.id,
        date_controle:   form.date_controle,
        valeur_mesuree:  form.valeur_mesuree !== '' ? Number(form.valeur_mesuree) : null,
        seuil_reference: form.seuil_reference !== '' ? Number(form.seuil_reference) : null,
        statut:          form.statut,
        remarque:        form.remarque || null,
      };
      if (modal.record) {
        await ferBainRecordService.update(modal.record.id, payload);
      } else {
        await ferBainRecordService.create(payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const label = 'text-[11px] font-medium mb-1 block';
  const input = 'w-full rounded-lg border px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]';
  const inputStyle = { background: 'var(--panel2)', borderColor: 'var(--border)', color: 'var(--text)' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-[15px]" style={{ color: 'var(--text)' }}>
              {modal.record ? 'Modifier la mesure' : 'Enregistrer une mesure'}
            </h2>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text3)' }}>
              {modal.equip?.code_rai || modal.equip?.code} — {modal.equip?.designation}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:opacity-70 transition-opacity" style={{ color: 'var(--text3)' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className={label} style={{ color: 'var(--text2)' }}>Date du contrôle *</label>
            <input type="date" name="date_controle" value={form.date_controle} onChange={change}
              className={input} style={inputStyle} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label} style={{ color: 'var(--text2)' }}>Valeur mesurée (°C)</label>
              <input type="number" name="valeur_mesuree" value={form.valeur_mesuree} onChange={change}
                step="0.01" placeholder="ex: 320" className={input} style={inputStyle} />
            </div>
            <div>
              <label className={label} style={{ color: 'var(--text2)' }}>Seuil de référence (°C)</label>
              <input type="number" name="seuil_reference" value={form.seuil_reference} onChange={change}
                step="0.01" placeholder="ex: 350" className={input} style={inputStyle} />
            </div>
          </div>

          <div>
            <label className={label} style={{ color: 'var(--text2)' }}>Statut</label>
            <select name="statut" value={form.statut} onChange={change} className={input} style={inputStyle}>
              {STATUT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div>
            <label className={label} style={{ color: 'var(--text2)' }}>Remarque</label>
            <textarea name="remarque" value={form.remarque} onChange={change} rows={3}
              placeholder="Observations éventuelles..." className={input} style={inputStyle} />
          </div>

          {error && <p className="text-[12px]" style={{ color: 'var(--crit)' }}>{error}</p>}

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-xl py-2.5 text-[13px] font-medium transition-opacity hover:opacity-70"
              style={{ background: 'var(--panel2)', color: 'var(--text2)', border: '1px solid var(--border)' }}>
              Annuler
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 rounded-xl py-2.5 text-[13px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--accent)', color: '#fff' }}>
              {saving ? 'Sauvegarde...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── SeuilCell — inline edit ─────────────────────────────────────────────────

function SeuilCell({ equip, onUpdated }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState('');
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    setVal(equip.fer_bain_seuil != null ? String(equip.fer_bain_seuil) : '');
    setEditing(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await equipementService.update(equip.id, { fer_bain_seuil: val !== '' ? Number(val) : null });
      onUpdated(equip.id, val !== '' ? Number(val) : null);
    } catch {
      // silent
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <input type="number" value={val} onChange={(e) => setVal(e.target.value)} step="0.01"
          className="w-20 rounded px-2 py-1 text-[12px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          style={{ background: 'var(--bg)', border: '1px solid var(--accent)', color: 'var(--text)' }}
          autoFocus onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false); }} />
        <button onClick={save} disabled={saving} className="text-[var(--accent)] hover:opacity-70">
          <Save size={13} />
        </button>
        <button onClick={() => setEditing(false)} className="hover:opacity-70" style={{ color: 'var(--text3)' }}>
          <X size={13} />
        </button>
      </div>
    );
  }

  return (
    <button onClick={startEdit} className="flex items-center gap-1 group hover:opacity-80 transition-opacity text-left">
      <span className="text-[13px]" style={{ color: equip.fer_bain_seuil != null ? 'var(--text)' : 'var(--text3)' }}>
        {equip.fer_bain_seuil != null ? `${equip.fer_bain_seuil} °C` : '—'}
      </span>
      <Pencil size={11} className="opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: 'var(--accent)' }} />
    </button>
  );
}

// ─── HistoryRows ──────────────────────────────────────────────────────────────

function HistoryRows({ records, onEdit, onDelete }) {
  if (records.length === 0) {
    return (
      <tr>
        <td colSpan={8} className="py-3 text-center text-[12px] italic" style={{ color: 'var(--text3)', background: 'var(--panel2)' }}>
          Aucun enregistrement pour cet équipement.
        </td>
      </tr>
    );
  }

  return records.map((rec) => (
    <tr key={rec.id} style={{ background: 'var(--panel2)', borderTop: '1px solid var(--border)' }}>
      <td colSpan={2} />
      <td className="px-4 py-2 text-[12px]" style={{ color: 'var(--text3)' }}>{fmtDate(rec.date_controle)}</td>
      <td className="px-4 py-2 text-[12px] font-mono" style={{ color: 'var(--text)' }}>
        {rec.valeur_mesuree != null ? `${rec.valeur_mesuree} °C` : '—'}
      </td>
      <td className="px-4 py-2 text-[12px]" style={{ color: 'var(--text3)' }}>
        {rec.seuil_reference != null ? `${rec.seuil_reference} °C` : '—'}
      </td>
      <td className="px-4 py-2">
        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={statutStyle(rec.statut)}>
          {rec.statut ?? '—'}
        </span>
      </td>
      <td className="px-4 py-2 text-[12px]" style={{ color: 'var(--text2)' }}>{rec.remarque || '—'}</td>
      <td className="px-4 py-2">
        <div className="flex items-center gap-1">
          <button onClick={() => onEdit(rec)} title="Modifier"
            className="p-1 rounded hover:opacity-70 transition-opacity" style={{ color: 'var(--accent)' }}>
            <Pencil size={13} />
          </button>
          <button onClick={() => onDelete(rec)} title="Supprimer"
            className="p-1 rounded hover:opacity-70 transition-opacity" style={{ color: 'var(--crit)' }}>
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  ));
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SuiviFerBain() {
  const location = useLocation();
  const preselectedId = location.state?.equipId ? Number(location.state.equipId) : null;

  const [equipements, setEquipements] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    try {
      const [eqRes, recRes] = await Promise.all([
        equipementService.getAll(),
        ferBainRecordService.getAll(),
      ]);
      const allEq = Array.isArray(eqRes.data) ? eqRes.data : (eqRes.data?.equipements ?? []);
      setEquipements(allEq.filter(isFerEtBain));
      setRecords(Array.isArray(recRes) ? recRes : []);
    } catch (err) {
      console.error('Erreur chargement SuiviFerBain:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const autoOpenedRef = React.useRef(false);
  useEffect(() => {
    if (preselectedId && equipements.length > 0 && !autoOpenedRef.current) {
      autoOpenedRef.current = true;
      setExpandedIds((prev) => new Set([...prev, preselectedId]));
      const equip = equipements.find((e) => e.id === preselectedId);
      if (equip) setModal({ equip, record: null });
    }
  }, [preselectedId, equipements]);

  const recordsByEquip = useMemo(() => {
    const map = {};
    records.forEach((r) => {
      const id = r.equipement_id;
      if (!map[id]) map[id] = [];
      map[id].push(r);
    });
    Object.values(map).forEach((arr) => arr.sort((a, b) => {
      if (a.date_controle > b.date_controle) return -1;
      if (a.date_controle < b.date_controle) return 1;
      return 0;
    }));
    return map;
  }, [records]);

  const normalizedSearch = normalizeText(search);
  const filtered = useMemo(() => {
    if (!normalizedSearch) return equipements;
    return equipements.filter((eq) =>
      normalizeText(eq.code_rai).includes(normalizedSearch) ||
      normalizeText(eq.code).includes(normalizedSearch) ||
      normalizeText(eq.designation).includes(normalizedSearch) ||
      normalizeText(eq.Zone?.nom_zone).includes(normalizedSearch)
    );
  }, [equipements, normalizedSearch]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const openAdd = (equip) => setModal({ equip, record: null });
  const openEdit = (equip, record) => setModal({ equip, record });

  const handleDelete = async (rec) => {
    if (!window.confirm(`Supprimer la mesure du ${fmtDate(rec.date_controle)} ?`)) return;
    try {
      await ferBainRecordService.delete(rec.id);
      await load();
    } catch {
      alert('Erreur lors de la suppression.');
    }
  };

  const handleSeuilUpdated = (id, newVal) => {
    setEquipements((prev) => prev.map((e) => e.id === id ? { ...e, fer_bain_seuil: newVal } : e));
  };

  const totalRecords = records.length;
  const conformeCount = records.filter((r) => r.statut === 'Conforme').length;
  const nonConformeCount = records.filter((r) => r.statut === 'Non-conforme').length;

  const th = 'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide';
  const thStyle = { color: 'var(--text3)', borderBottom: '1px solid var(--border)' };

  return (
    <div className="px-[26px] pt-6 pb-10 flex-1 min-h-0 overflow-auto flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display font-semibold text-[25px]" style={{ color: 'var(--text)', letterSpacing: '-0.4px' }}>
          Suivi des Fer et Bain
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--text3)' }}>
          Historique des mesures thermiques pour les fers à souder et bains créuset.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Équipements', value: equipements.length, color: 'var(--accent)' },
          { label: 'Contrôles enregistrés', value: totalRecords, color: 'var(--text)' },
          { label: 'Non-conformes', value: nonConformeCount, color: nonConformeCount > 0 ? 'var(--crit)' : 'var(--ok)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl p-4" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>
            <p className="text-[11px] uppercase tracking-wide mb-1" style={{ color: 'var(--text3)' }}>{label}</p>
            <p className="text-[24px] font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par code, désignation, zone..."
          className="w-full max-w-sm rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          style={{ background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text)' }}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center" style={{ color: 'var(--text3)' }}>
          Chargement...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2" style={{ color: 'var(--text3)' }}>
          <Thermometer size={32} className="opacity-30" />
          <p className="text-[14px]">Aucun équipement fer et bain trouvé.</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <table className="w-full border-collapse">
            <thead style={{ background: 'var(--panel)' }}>
              <tr>
                <th className={th} style={{ ...thStyle, width: 32 }} />
                <th className={th} style={thStyle}>Code RAI</th>
                <th className={th} style={thStyle}>Désignation</th>
                <th className={th} style={thStyle}>Zone</th>
                <th className={th} style={thStyle}>Seuil</th>
                <th className={th} style={thStyle}>Dernier contrôle</th>
                <th className={th} style={thStyle}>Dernière valeur</th>
                <th className={th} style={thStyle}>Statut</th>
                <th className={th} style={thStyle} />
              </tr>
            </thead>
            <tbody>
              {filtered.map((equip, idx) => {
                const eqRecords = recordsByEquip[equip.id] ?? [];
                const latest = eqRecords[0] ?? null;
                const isExpanded = expandedIds.has(equip.id);
                const isPreselected = equip.id === preselectedId;
                const rowBg = idx % 2 === 0 ? 'var(--panel)' : 'var(--panel2)';

                return (
                  <React.Fragment key={equip.id}>
                    <tr
                      style={{
                        background: isPreselected ? 'var(--accent-soft, color-mix(in srgb, var(--accent) 10%, transparent))' : rowBg,
                        borderTop: idx > 0 ? '1px solid var(--border)' : undefined,
                      }}
                    >
                      {/* Expand toggle */}
                      <td className="px-2 py-3">
                        <button
                          onClick={() => toggleExpand(equip.id)}
                          className="rounded p-1 hover:opacity-70 transition-opacity"
                          style={{ color: 'var(--text3)' }}
                        >
                          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                      </td>

                      <td className="px-4 py-3 text-[13px] font-mono" style={{ color: 'var(--text2)' }}>
                        {fmt(equip.code_rai || equip.code)}
                      </td>
                      <td className="px-4 py-3 text-[13px] font-medium" style={{ color: 'var(--text)' }}>
                        {fmt(equip.designation)}
                      </td>
                      <td className="px-4 py-3 text-[13px]" style={{ color: 'var(--text2)' }}>
                        {fmt(equip.Zone?.nom_zone)}
                      </td>
                      <td className="px-4 py-3">
                        <SeuilCell equip={equip} onUpdated={handleSeuilUpdated} />
                      </td>
                      <td className="px-4 py-3 text-[13px]" style={{ color: 'var(--text2)' }}>
                        {latest ? fmtDate(latest.date_controle) : <span style={{ color: 'var(--text3)' }}>—</span>}
                      </td>
                      <td className="px-4 py-3 text-[13px] font-mono" style={{ color: 'var(--text)' }}>
                        {latest?.valeur_mesuree != null
                          ? `${latest.valeur_mesuree} °C`
                          : <span style={{ color: 'var(--text3)' }}>—</span>}
                      </td>
                      <td className="px-4 py-3">
                        {latest ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium" style={statutStyle(latest.statut)}>
                            {latest.statut}
                          </span>
                        ) : (
                          <span className="text-[12px]" style={{ color: 'var(--text3)' }}>—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => { openAdd(equip); }}
                          title="Enregistrer une mesure"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-opacity hover:opacity-80"
                          style={{ background: 'var(--accent)', color: '#fff' }}
                        >
                          <Plus size={13} />
                          Mesure
                        </button>
                      </td>
                    </tr>

                    {/* History rows */}
                    {isExpanded && (
                      <>
                        {/* History header */}
                        <tr style={{ background: 'var(--panel2)' }}>
                          <td colSpan={2} />
                          <td className="px-4 py-1.5 text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text3)' }}>Date</td>
                          <td className="px-4 py-1.5 text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text3)' }}>Valeur</td>
                          <td className="px-4 py-1.5 text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text3)' }}>Seuil réf.</td>
                          <td className="px-4 py-1.5 text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text3)' }}>Statut</td>
                          <td className="px-4 py-1.5 text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text3)' }}>Remarque</td>
                          <td />
                        </tr>
                        <HistoryRows
                          records={eqRecords}
                          onEdit={(rec) => openEdit(equip, rec)}
                          onDelete={handleDelete}
                        />
                      </>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <RecordModal modal={modal} onClose={() => setModal(null)} onSaved={load} />
    </div>
  );
}
