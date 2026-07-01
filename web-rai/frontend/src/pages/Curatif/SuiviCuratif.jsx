import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { curativeMaintenanceService, equipementService } from '../../services/api';
import {
  buildEquipmentLabel,
  buildWeekLabel,
  computeCurativeDurations,
  formatMinutes,
  normalizeSearchValue,
} from '../../utils/curativeMaintenance';
import {
  Plus, Pencil, Trash2, Search, X, AlertCircle,
  ClipboardList, Clock, AlertTriangle, Timer,
} from 'lucide-react';
import KpiCard from '../../components/ui/KpiCard.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import DataLabel from '../../components/ui/DataLabel.jsx';
import { staggerItemVariants } from '../../components/motion/ScreenTransition.jsx';

// ── Helpers ────────────────────────────────────────────────
const buildInitialFormState = (record = null) => ({
  incident_date:     record?.incident_date     ?? '',
  week_label:        record?.week_label        ?? '',
  intervenant:       record?.intervenant       ?? '',
  zone_production:   record?.zone_production   ?? '',
  request_time:      record?.request_time      ?? '',
  started_time:      record?.started_time      ?? '',
  finished_time:     record?.finished_time     ?? '',
  description_panne: record?.description_panne ?? '',
});

const formatDateOnly = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('fr-FR');
};

const downtimeSeverity = (minutes) => {
  const n = Number(minutes) || 0;
  if (n >= 70) return 'crit';
  if (n >= 40) return 'warn';
  return 'ok';
};

// ── Shared field styles ──────────────────────────────────────
const fieldClass = 'w-full rounded-[10px] px-4 py-2.5 text-sm placeholder-[var(--text3)] outline-none transition-colors';
const fieldStyle = { background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--text)' };
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em]';

// ── Main ───────────────────────────────────────────────────
const SuiviCuratif = () => {
  const [records,              setRecords]              = useState([]);
  const [equipements,          setEquipements]          = useState([]);
  const [formData,             setFormData]             = useState(buildInitialFormState());
  const [equipmentSearch,      setEquipmentSearch]      = useState('');
  const [selectedEquipmentId,  setSelectedEquipmentId]  = useState('');
  const [editingRecord,        setEditingRecord]        = useState(null);
  const [loading,              setLoading]              = useState(true);
  const [loadingOptions,       setLoadingOptions]       = useState(true);
  const [saving,               setSaving]              = useState(false);
  const [searchQuery,          setSearchQuery]          = useState('');
  const [error,                setError]                = useState('');
  const [isFormOpen,           setIsFormOpen]           = useState(false);

  const loadData = async () => {
    setLoading(true); setLoadingOptions(true); setError('');
    try {
      const [rr, er] = await Promise.all([
        curativeMaintenanceService.getAll(),
        equipementService.getAll(),
      ]);
      setRecords(Array.isArray(rr) ? rr : []);
      setEquipements(Array.isArray(er?.data) ? er.data : []);
    } catch {
      setRecords([]); setEquipements([]);
      setError('Impossible de charger le suivi curatif.');
    } finally {
      setLoading(false); setLoadingOptions(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const equipmentOptions = useMemo(
    () => equipements.slice().sort((a, b) =>
      buildEquipmentLabel(a).localeCompare(buildEquipmentLabel(b), 'fr', { numeric: true, sensitivity: 'base' })
    ),
    [equipements]
  );

  const filteredEquipmentOptions = useMemo(() => {
    const q = normalizeSearchValue(equipmentSearch);
    if (!q) return equipmentOptions.slice(0, 12);
    return equipmentOptions.filter((e) => {
      const label = normalizeSearchValue(buildEquipmentLabel(e));
      return label.includes(q) || normalizeSearchValue(e.code_rai).includes(q) || normalizeSearchValue(e.designation).includes(q);
    }).slice(0, 12);
  }, [equipmentOptions, equipmentSearch]);

  const selectedEquipment = useMemo(
    () => equipmentOptions.find((e) => String(e.id) === String(selectedEquipmentId)) || null,
    [equipmentOptions, selectedEquipmentId]
  );

  const resolveEquipmentSelection = () => {
    if (selectedEquipment) return selectedEquipment;
    const q = normalizeSearchValue(equipmentSearch);
    if (!q) return null;
    const exact = equipmentOptions.find((e) => {
      const label = normalizeSearchValue(buildEquipmentLabel(e));
      return label === q || normalizeSearchValue(e.code_rai) === q || normalizeSearchValue(e.designation) === q;
    });
    if (exact) return exact;
    if (filteredEquipmentOptions.length === 1) return filteredEquipmentOptions[0];
    return null;
  };

  useEffect(() => {
    if (!editingRecord) {
      setFormData(buildInitialFormState()); setEquipmentSearch(''); setSelectedEquipmentId(''); return;
    }
    const match = equipmentOptions.find((e) => String(e.id) === String(editingRecord.equipement_id || editingRecord.Equipement?.id || ''));
    setFormData(buildInitialFormState(editingRecord));
    setSelectedEquipmentId(match ? String(match.id) : String(editingRecord.equipement_id || ''));
    setEquipmentSearch(match ? buildEquipmentLabel(match) : buildEquipmentLabel(editingRecord));
  }, [editingRecord, equipmentOptions]);

  const filteredRecords = useMemo(() => {
    const q = normalizeSearchValue(searchQuery);
    return records.filter((r) => {
      if (!q) return true;
      const s = [
        formatDateOnly(r.incident_date), r.week_label, r.intervenant, r.zone_production,
        r.request_time, r.started_time, r.finished_time, r.description_panne,
        r.equipement_code, r.equipement_label, r.Equipement?.code_rai, r.Equipement?.designation,
      ].filter(Boolean).join(' ');
      return normalizeSearchValue(s).includes(q);
    });
  }, [records, searchQuery]);

  const totalDowntime   = useMemo(() => records.reduce((sum, r) => sum + (Number(r.downtime_minutes) || 0), 0), [records]);
  const averageDowntime = records.length > 0 ? totalDowntime / records.length : null;

  const formDurations = useMemo(() => computeCurativeDurations({
    requestTime: formData.request_time, startedTime: formData.started_time, finishedTime: formData.finished_time,
  }), [formData.finished_time, formData.request_time, formData.started_time]);

  const resetForm = () => { setEditingRecord(null); setFormData(buildInitialFormState()); setEquipmentSearch(''); setSelectedEquipmentId(''); setError(''); };
  const openForm  = (record = null) => { setEditingRecord(record); setIsFormOpen(true); };
  const closeForm = () => { setIsFormOpen(false); resetForm(); };

  const handleEquipmentSearchChange = (e) => {
    const value = e.target.value;
    setEquipmentSearch(value);
    const exact = equipmentOptions.find((eq) => buildEquipmentLabel(eq) === value || eq.code_rai === value || eq.designation === value);
    if (exact) {
      setSelectedEquipmentId(String(exact.id));
      setFormData((c) => ({ ...c, zone_production: c.zone_production || exact.Zone?.nom_zone || '' }));
    } else {
      setSelectedEquipmentId('');
    }
  };

  const handleEquipmentPick = (eq) => {
    setSelectedEquipmentId(String(eq.id));
    setEquipmentSearch(buildEquipmentLabel(eq));
    setFormData((c) => ({ ...c, zone_production: c.zone_production || eq.Zone?.nom_zone || '' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((c) => {
      const next = { ...c, [name]: value };
      if (name === 'incident_date' && value) next.week_label = buildWeekLabel(value);
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    const resolved = resolveEquipmentSelection();
    if (!resolved) { setSaving(false); setError('Veuillez sélectionner un équipement existant.'); return; }
    if (!selectedEquipmentId) { setSelectedEquipmentId(String(resolved.id)); setEquipmentSearch(buildEquipmentLabel(resolved)); }
    if (!formData.incident_date || !formData.request_time || !formData.started_time || !formData.finished_time) {
      setSaving(false); setError('La date, l\'heure de demande, l\'heure de début et l\'heure de fin sont obligatoires.'); return;
    }
    if (formDurations.downtimeMinutes === null) { setSaving(false); setError('Les heures saisies sont invalides.'); return; }
    const payload = {
      equipement_id:     Number(resolved.id),
      incident_date:     formData.incident_date,
      week_label:        formData.week_label || buildWeekLabel(formData.incident_date),
      intervenant:       formData.intervenant.trim() || null,
      zone_production:   formData.zone_production.trim() || resolved.Zone?.nom_zone || null,
      request_time:      formData.request_time,
      started_time:      formData.started_time,
      finished_time:     formData.finished_time,
      description_panne: formData.description_panne.trim() || null,
      response_minutes:  formDurations.responseMinutes,
      downtime_minutes:  formDurations.downtimeMinutes,
    };
    try {
      if (editingRecord?.id) await curativeMaintenanceService.update(editingRecord.id, payload);
      else                   await curativeMaintenanceService.create(payload);
      await loadData(); closeForm();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (record) => {
    if (!window.confirm(`Supprimer l'incident du ${formatDateOnly(record.incident_date)} ?`)) return;
    try {
      await curativeMaintenanceService.delete(record.id);
      await loadData();
      if (editingRecord?.id === record.id) closeForm();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Erreur lors de la suppression.');
    }
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div className="flex-1 overflow-auto px-[26px] pt-6 pb-10 space-y-[18px]">

        {/* ── Header ── */}
        <motion.div variants={staggerItemVariants} className="flex flex-wrap items-end justify-between gap-3.5">
          <div>
            <h1 className="font-display font-semibold text-[25px]" style={{ color: 'var(--text)', letterSpacing: '-0.4px' }}>Suivi curatif</h1>
            <p className="text-[13px] mt-1" style={{ color: 'var(--text3)' }}>Enregistrement des incidents et temps d'arrêt machine</p>
          </div>
          <button
            type="button" onClick={() => openForm(null)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))', boxShadow: '0 6px 18px var(--accent-soft)' }}
          >
            <Plus className="w-4 h-4" />
            Nouvel incident
          </button>
        </motion.div>

        {/* ── KPIs ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <KpiCard label="Incidents enregistrés" value={records.length} icon={ClipboardList} accentVariant="accent" loading={loading} />
          <KpiCard
            label="Temps d'arrêt moyen" value={averageDowntime ?? 0} suffix=" min" icon={Clock} accentVariant="warn"
            loading={loading || averageDowntime === null}
          />
          <KpiCard label="Temps d'arrêt total" value={totalDowntime} suffix=" min" icon={Timer} accentVariant="crit" loading={loading} />
        </div>

        {/* ── Table card ── */}
        <motion.div
          variants={staggerItemVariants}
          className="rounded-[14px] overflow-hidden"
          style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 px-[18px] py-[14px]" style={{ borderBottom: '1px solid var(--border2)' }}>
            <div>
              <p className="font-semibold text-[13.5px]" style={{ color: 'var(--text)' }}>Historique curatif</p>
              <DataLabel className="mt-0.5">{filteredRecords.length} incident(s)</DataLabel>
            </div>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text3)' }} />
              <input
                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-[9px] text-[12.5px] outline-none"
                style={fieldStyle}
                placeholder="Rechercher une panne, un code, une zone…"
              />
            </div>
          </div>

          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--panel2)', borderBottom: '1px solid var(--border2)' }}>
                  {['Date','Équipement','Zone','Intervenant','Demande','Début','Fin','Arrêt','Actions'].map((h) => (
                    <th key={h} className="px-3.5 py-2.5 text-left whitespace-nowrap">
                      <DataLabel>{h}</DataLabel>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} className="py-12 text-center">
                    <div className="w-6 h-6 border-2 rounded-full animate-spin mx-auto mb-2" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
                    <p className="text-xs" style={{ color: 'var(--text3)' }}>Chargement…</p>
                  </td></tr>
                ) : filteredRecords.length === 0 ? (
                  <tr><td colSpan={9} className="py-12 text-center">
                    <ClipboardList className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text3)' }} />
                    <p className="text-sm" style={{ color: 'var(--text3)' }}>Aucun incident curatif trouvé</p>
                  </td></tr>
                ) : filteredRecords.map((record) => (
                  <tr key={record.id} className="align-top transition-colors hover:bg-[var(--panel2)]" style={{ borderBottom: '1px solid var(--border2)' }}>
                    <td className="px-3.5 py-2.5 whitespace-nowrap font-mono text-xs" style={{ color: 'var(--text2)' }}>{formatDateOnly(record.incident_date)}</td>
                    <td className="px-3.5 py-2.5">
                      <div className="font-mono font-bold text-[12.5px]" style={{ color: 'var(--accent)' }}>{record.Equipement?.code_rai || record.equipement_code || '—'}</div>
                      <div className="text-[11.5px] mt-0.5" style={{ color: 'var(--text2)' }}>{record.Equipement?.designation || record.equipement_label || '—'}</div>
                      <div className="text-[11px] mt-0.5" style={{ color: 'var(--text3)' }}>{record.week_label || '—'}</div>
                    </td>
                    <td className="px-3.5 py-2.5 whitespace-nowrap" style={{ color: 'var(--text2)' }}>{record.zone_production || '—'}</td>
                    <td className="px-3.5 py-2.5 whitespace-nowrap" style={{ color: 'var(--text2)' }}>{record.intervenant || '—'}</td>
                    <td className="px-3.5 py-2.5 whitespace-nowrap font-mono text-xs" style={{ color: 'var(--text3)' }}>{record.request_time || '—'}</td>
                    <td className="px-3.5 py-2.5 whitespace-nowrap font-mono text-xs" style={{ color: 'var(--text3)' }}>{record.started_time || '—'}</td>
                    <td className="px-3.5 py-2.5 whitespace-nowrap font-mono text-xs" style={{ color: 'var(--text3)' }}>{record.finished_time || '—'}</td>
                    <td className="px-3.5 py-2.5 whitespace-nowrap">
                      <StatusBadge variant={downtimeSeverity(record.downtime_minutes)}>{formatMinutes(record.downtime_minutes)}</StatusBadge>
                    </td>
                    <td className="px-3.5 py-2.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openForm(record)} title="Modifier"
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
                          style={{ color: 'var(--text3)' }}>
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(record)} title="Supprimer"
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--crit-soft)] hover:text-[var(--crit)]"
                          style={{ color: 'var(--text3)' }}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* ── Modal ── */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={closeForm}>
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[18px] shadow-2xl"
            style={{ background: 'var(--panel)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between gap-4 px-6 py-5 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #0d1828, #0a2820)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-soft)' }}>
                  {editingRecord?.id ? <Pencil className="w-4 h-4" style={{ color: 'var(--accent3)' }} /> : <AlertTriangle className="w-4 h-4" style={{ color: 'var(--accent3)' }} />}
                </div>
                <div>
                  <h2 className="text-base font-bold text-white leading-tight font-display">
                    {editingRecord?.id ? 'Modifier l\'incident' : 'Nouvel incident curatif'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Formulaire d'enregistrement d'un arrêt curatif</p>
                </div>
              </div>
              <button onClick={closeForm}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-auto p-6">
              {error && (
                <div
                  className="mb-4 flex items-start gap-2.5 rounded-[10px] px-4 py-3 text-sm"
                  style={{ border: '1px solid var(--crit)', background: 'var(--crit-soft)', color: 'var(--crit)' }}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Equipment search */}
                <div>
                  <span className={labelClass} style={{ color: 'var(--text3)' }}>Équipement <span style={{ color: 'var(--crit)' }}>*</span></span>
                  <input type="text" value={equipmentSearch} onChange={handleEquipmentSearchChange}
                    className={fieldClass} style={fieldStyle} placeholder="Tapez un code ou une désignation…" />
                  {equipmentSearch && filteredEquipmentOptions.length > 0 && (
                    <div className="mt-1.5 max-h-48 overflow-auto rounded-[10px]" style={{ border: '1px solid var(--border)', background: 'var(--panel)' }}>
                      {filteredEquipmentOptions.map((eq) => (
                        <button key={eq.id} type="button" onClick={() => handleEquipmentPick(eq)}
                          className="flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--panel3)]"
                          style={{ color: 'var(--text2)', borderBottom: '1px solid var(--border2)' }}>
                          <span>{buildEquipmentLabel(eq)}</span>
                          <span className="ml-4 shrink-0 text-xs" style={{ color: 'var(--text3)' }}>#{eq.id}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {equipmentSearch && !selectedEquipmentId && (
                    <p className="mt-1 text-[11px]" style={{ color: 'var(--warn)' }}>Sélectionnez un équipement existant dans la liste.</p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className={labelClass} style={{ color: 'var(--text3)' }}>Date incident <span style={{ color: 'var(--crit)' }}>*</span></span>
                    <input type="date" name="incident_date" value={formData.incident_date} onChange={handleChange} className={fieldClass} style={fieldStyle} />
                  </label>
                  <label className="block">
                    <span className={labelClass} style={{ color: 'var(--text3)' }}>Semaine</span>
                    <input type="text" name="week_label" value={formData.week_label} onChange={handleChange} className={fieldClass} style={fieldStyle} placeholder="KW 16" />
                  </label>
                  <label className="block">
                    <span className={labelClass} style={{ color: 'var(--text3)' }}>Intervenant</span>
                    <input type="text" name="intervenant" value={formData.intervenant} onChange={handleChange} className={fieldClass} style={fieldStyle} placeholder="Nom de l'opérateur" />
                  </label>
                  <label className="block">
                    <span className={labelClass} style={{ color: 'var(--text3)' }}>Zone production</span>
                    <input type="text" name="zone_production" value={formData.zone_production} onChange={handleChange} className={fieldClass} style={fieldStyle} placeholder="Zone de production" />
                  </label>
                  <label className="block">
                    <span className={labelClass} style={{ color: 'var(--text3)' }}>Heure de demande <span style={{ color: 'var(--crit)' }}>*</span></span>
                    <input type="time" name="request_time" value={formData.request_time} onChange={handleChange} className={fieldClass} style={fieldStyle} />
                  </label>
                  <label className="block">
                    <span className={labelClass} style={{ color: 'var(--text3)' }}>Début intervention <span style={{ color: 'var(--crit)' }}>*</span></span>
                    <input type="time" name="started_time" value={formData.started_time} onChange={handleChange} className={fieldClass} style={fieldStyle} />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className={labelClass} style={{ color: 'var(--text3)' }}>Fin intervention <span style={{ color: 'var(--crit)' }}>*</span></span>
                    <input type="time" name="finished_time" value={formData.finished_time} onChange={handleChange} className={fieldClass} style={fieldStyle} />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className={labelClass} style={{ color: 'var(--text3)' }}>Description de la panne</span>
                    <textarea name="description_panne" value={formData.description_panne} onChange={handleChange} rows={3}
                      className={fieldClass + ' resize-none'} style={fieldStyle} placeholder="Décrivez le problème rencontré" />
                  </label>
                </div>

                {/* Computed durations */}
                <div className="grid grid-cols-2 gap-3 rounded-[10px] p-4" style={{ border: '1px dashed var(--border)', background: 'var(--panel2)' }}>
                  <div>
                    <DataLabel>Délai d'intervention</DataLabel>
                    <p className="text-lg font-bold mt-1" style={{ color: 'var(--text)' }}>{formatMinutes(formDurations.responseMinutes)}</p>
                  </div>
                  <div>
                    <DataLabel>Temps d'arrêt</DataLabel>
                    <p className="text-lg font-bold mt-1" style={{ color: 'var(--text)' }}>{formatMinutes(formDurations.downtimeMinutes)}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-1">
                  <button type="submit" disabled={saving}
                    className="flex-1 py-2.5 rounded-[10px] text-sm font-bold text-white disabled:opacity-50 transition-transform hover:-translate-y-0.5"
                    style={{ background: saving ? 'var(--text3)' : 'linear-gradient(135deg, var(--accent3), var(--accent2))', boxShadow: '0 6px 18px var(--accent-soft)' }}>
                    {saving ? 'Sauvegarde…' : editingRecord?.id ? "Modifier l'incident" : "Enregistrer l'incident"}
                  </button>
                  <button type="button" onClick={resetForm}
                    className="px-5 py-2.5 rounded-[10px] text-sm font-semibold transition-colors hover:bg-[var(--panel3)]"
                    style={{ border: '1px solid var(--border)', color: 'var(--text2)' }}>
                    Réinitialiser
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SuiviCuratif;
