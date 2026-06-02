import React, { useEffect, useMemo, useState } from 'react';
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

// ── Shared styles ──────────────────────────────────────────
const fieldClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-colors';
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500';

// ── KPI card ───────────────────────────────────────────────
const KpiCard = ({ label, value, icon: Icon, iconBg, iconColor, sub }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
    </div>
    <div className="text-3xl font-bold text-slate-800 mb-1">{value}</div>
    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
    {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
  </div>
);

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
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden" style={{ background: 'var(--content-bg)' }}>
      <div className="flex-1 overflow-auto p-6 space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
              <ClipboardList className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Suivi curatif</h1>
              <p className="text-xs text-slate-400 mt-0.5">Enregistrement des incidents et temps d'arrêt</p>
            </div>
          </div>
          <button
            type="button" onClick={() => openForm(null)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}
          >
            <Plus className="w-4 h-4" />
            Nouvel incident
          </button>
        </div>

        {/* ── KPIs ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiCard label="Incidents enregistrés" value={records.length} icon={ClipboardList} iconBg="bg-slate-100" iconColor="text-slate-500" />
          <KpiCard label="Temps d'arrêt moyen"
            value={averageDowntime === null ? '—' : formatMinutes(averageDowntime)}
            icon={Clock} iconBg="bg-amber-50" iconColor="text-amber-500"
            sub="Par incident" />
          <KpiCard label="Temps d'arrêt total" value={formatMinutes(totalDowntime)}
            icon={Timer} iconBg="bg-red-50" iconColor="text-red-400"
            sub="Tous incidents cumulés" />
        </div>

        {/* ── Table card ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
            <div>
              <p className="text-sm font-bold text-slate-800">Historique curatif</p>
              <p className="text-xs text-slate-400 mt-0.5">{filteredRecords.length} incident(s)</p>
            </div>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                placeholder="Rechercher une panne, un code, une zone…"
              />
            </div>
          </div>

          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['Date','Équipement','Zone','Intervenant','Demande','Début','Fin','Arrêt','Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={9} className="py-12 text-center">
                    <div className="w-6 h-6 border-2 border-sky-200 border-t-sky-500 rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-xs text-slate-400">Chargement…</p>
                  </td></tr>
                ) : filteredRecords.length === 0 ? (
                  <tr><td colSpan={9} className="py-12 text-center">
                    <ClipboardList className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm text-slate-400">Aucun incident curatif trouvé</p>
                  </td></tr>
                ) : filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors align-top">
                    <td className="px-4 py-3 whitespace-nowrap text-slate-700">{formatDateOnly(record.incident_date)}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{record.Equipement?.code_rai || record.equipement_code || '—'}</div>
                      <div className="text-xs text-slate-500">{record.Equipement?.designation || record.equipement_label || '—'}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{record.week_label || '—'}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-500">{record.zone_production || '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-500">{record.intervenant || '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-slate-600">{record.request_time || '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-slate-600">{record.started_time || '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-slate-600">{record.finished_time || '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 border border-red-200 text-red-700">
                        {formatMinutes(record.downtime_minutes)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openForm(record)} title="Modifier"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(record)} title="Supprimer"
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
        </div>
      </div>

      {/* ── Modal ── */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={closeForm}>
          <div
            className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between gap-4 px-6 py-5 flex-shrink-0"
              style={{ background: '#0f1d35', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                  {editingRecord?.id ? <Pencil className="w-4 h-4 text-sky-300" /> : <AlertTriangle className="w-4 h-4 text-sky-300" />}
                </div>
                <div>
                  <h2 className="text-base font-bold text-white leading-tight">
                    {editingRecord?.id ? 'Modifier l\'incident' : 'Nouvel incident curatif'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Formulaire d'enregistrement d'un arrêt curatif</p>
                </div>
              </div>
              <button onClick={closeForm}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-auto p-6">
              {error && (
                <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Equipment search */}
                <div>
                  <span className={labelClass}>Équipement <span className="text-red-400">*</span></span>
                  <input type="text" value={equipmentSearch} onChange={handleEquipmentSearchChange}
                    className={fieldClass} placeholder="Tapez un code ou une désignation…" />
                  {equipmentSearch && filteredEquipmentOptions.length > 0 && (
                    <div className="mt-1.5 max-h-48 overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                      {filteredEquipmentOptions.map((eq) => (
                        <button key={eq.id} type="button" onClick={() => handleEquipmentPick(eq)}
                          className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-slate-700 hover:bg-sky-50 transition-colors border-b border-slate-50 last:border-0">
                          <span>{buildEquipmentLabel(eq)}</span>
                          <span className="ml-4 shrink-0 text-xs text-slate-400">#{eq.id}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {equipmentSearch && !selectedEquipmentId && (
                    <p className="mt-1 text-[11px] text-amber-600">Sélectionnez un équipement existant dans la liste.</p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className={labelClass}>Date incident <span className="text-red-400">*</span></span>
                    <input type="date" name="incident_date" value={formData.incident_date} onChange={handleChange} className={fieldClass} />
                  </label>
                  <label className="block">
                    <span className={labelClass}>Semaine</span>
                    <input type="text" name="week_label" value={formData.week_label} onChange={handleChange} className={fieldClass} placeholder="KW 16" />
                  </label>
                  <label className="block">
                    <span className={labelClass}>Intervenant</span>
                    <input type="text" name="intervenant" value={formData.intervenant} onChange={handleChange} className={fieldClass} placeholder="Nom de l'opérateur" />
                  </label>
                  <label className="block">
                    <span className={labelClass}>Zone production</span>
                    <input type="text" name="zone_production" value={formData.zone_production} onChange={handleChange} className={fieldClass} placeholder="Zone de production" />
                  </label>
                  <label className="block">
                    <span className={labelClass}>Heure de demande <span className="text-red-400">*</span></span>
                    <input type="time" name="request_time" value={formData.request_time} onChange={handleChange} className={fieldClass} />
                  </label>
                  <label className="block">
                    <span className={labelClass}>Début intervention <span className="text-red-400">*</span></span>
                    <input type="time" name="started_time" value={formData.started_time} onChange={handleChange} className={fieldClass} />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className={labelClass}>Fin intervention <span className="text-red-400">*</span></span>
                    <input type="time" name="finished_time" value={formData.finished_time} onChange={handleChange} className={fieldClass} />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className={labelClass}>Description de la panne</span>
                    <textarea name="description_panne" value={formData.description_panne} onChange={handleChange} rows={3}
                      className={fieldClass + ' resize-none'} placeholder="Décrivez le problème rencontré" />
                  </label>
                </div>

                {/* Computed durations */}
                <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div>
                    <p className={labelClass}>Délai d'intervention</p>
                    <p className="text-lg font-bold text-slate-800">{formatMinutes(formDurations.responseMinutes)}</p>
                  </div>
                  <div>
                    <p className={labelClass}>Temps d'arrêt</p>
                    <p className="text-lg font-bold text-slate-800">{formatMinutes(formDurations.downtimeMinutes)}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-1">
                  <button type="submit" disabled={saving}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                    style={{ background: saving ? '#94a3b8' : 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}>
                    {saving ? 'Sauvegarde…' : editingRecord?.id ? "Modifier l'incident" : "Enregistrer l'incident"}
                  </button>
                  <button type="button" onClick={resetForm}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                    Réinitialiser
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuiviCuratif;
