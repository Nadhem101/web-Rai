import React, { useEffect, useMemo, useState } from 'react';
import { curativeMaintenanceService, equipementService } from '../../services/api';
import {
  buildEquipmentLabel,
  buildWeekLabel,
  computeCurativeDurations,
  formatMinutes,
  normalizeSearchValue,
} from '../../utils/curativeMaintenance';

const buildInitialFormState = (record = null) => ({
  incident_date: record?.incident_date ?? '',
  week_label: record?.week_label ?? '',
  intervenant: record?.intervenant ?? '',
  zone_production: record?.zone_production ?? '',
  request_time: record?.request_time ?? '',
  started_time: record?.started_time ?? '',
  finished_time: record?.finished_time ?? '',
  description_panne: record?.description_panne ?? '',
});

const formatDateOnly = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('fr-FR');
};

const SuiviCuratif = () => {
  const [records, setRecords] = useState([]);
  const [equipements, setEquipements] = useState([]);
  const [formData, setFormData] = useState(buildInitialFormState());
  const [equipmentSearch, setEquipmentSearch] = useState('');
  const [selectedEquipmentId, setSelectedEquipmentId] = useState('');
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setLoadingOptions(true);
    setError('');

    try {
      const [recordsResponse, equipmentResponse] = await Promise.all([
        curativeMaintenanceService.getAll(),
        equipementService.getAll(),
      ]);

      setRecords(Array.isArray(recordsResponse) ? recordsResponse : []);
      setEquipements(Array.isArray(equipmentResponse?.data) ? equipmentResponse.data : []);
    } catch (loadError) {
      console.error('Erreur chargement du suivi curatif:', loadError);
      setRecords([]);
      setEquipements([]);
      setError('Impossible de charger le suivi curatif.');
    } finally {
      setLoading(false);
      setLoadingOptions(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const equipmentOptions = useMemo(
    () =>
      equipements
        .slice()
        .sort((left, right) =>
          buildEquipmentLabel(left).localeCompare(buildEquipmentLabel(right), 'fr', {
            numeric: true,
            sensitivity: 'base',
          })
        ),
    [equipements]
  );

  const filteredEquipmentOptions = useMemo(() => {
    const query = normalizeSearchValue(equipmentSearch);

    if (!query) {
      return equipmentOptions.slice(0, 12);
    }

    return equipmentOptions
      .filter((equipment) => {
        const label = normalizeSearchValue(buildEquipmentLabel(equipment));
        return (
          label.includes(query) ||
          normalizeSearchValue(equipment.code_rai).includes(query) ||
          normalizeSearchValue(equipment.designation).includes(query)
        );
      })
      .slice(0, 12);
  }, [equipmentOptions, equipmentSearch]);

  const selectedEquipment = useMemo(
    () => equipmentOptions.find((equipment) => String(equipment.id) === String(selectedEquipmentId)) || null,
    [equipmentOptions, selectedEquipmentId]
  );

  const resolveEquipmentSelection = () => {
    if (selectedEquipment) {
      return selectedEquipment;
    }

    const normalizedSearch = normalizeSearchValue(equipmentSearch);
    if (!normalizedSearch) {
      return null;
    }

    const exactMatch = equipmentOptions.find((equipment) => {
      const label = normalizeSearchValue(buildEquipmentLabel(equipment));
      return (
        label === normalizedSearch ||
        normalizeSearchValue(equipment.code_rai) === normalizedSearch ||
        normalizeSearchValue(equipment.designation) === normalizedSearch
      );
    });

    if (exactMatch) {
      return exactMatch;
    }

    if (filteredEquipmentOptions.length === 1) {
      return filteredEquipmentOptions[0];
    }

    return null;
  };

  useEffect(() => {
    if (!editingRecord) {
      setFormData(buildInitialFormState());
      setEquipmentSearch('');
      setSelectedEquipmentId('');
      return;
    }

    const matchedEquipment = equipmentOptions.find((equipment) => String(equipment.id) === String(editingRecord.equipement_id || editingRecord.Equipement?.id || ''));

    setFormData(buildInitialFormState(editingRecord));
    setSelectedEquipmentId(matchedEquipment ? String(matchedEquipment.id) : String(editingRecord.equipement_id || ''));
    setEquipmentSearch(matchedEquipment ? buildEquipmentLabel(matchedEquipment) : buildEquipmentLabel(editingRecord));
  }, [editingRecord, equipmentOptions]);

  const filteredRecords = useMemo(() => {
    const query = normalizeSearchValue(searchQuery);

    return records.filter((record) => {
      if (!query) return true;

      const searchable = [
        formatDateOnly(record.incident_date),
        record.week_label,
        record.intervenant,
        record.zone_production,
        record.request_time,
        record.started_time,
        record.finished_time,
        record.description_panne,
        record.equipement_code,
        record.equipement_label,
        record.Equipement?.code_rai,
        record.Equipement?.designation,
      ]
        .filter(Boolean)
        .join(' ');

      return normalizeSearchValue(searchable).includes(query);
    });
  }, [records, searchQuery]);

  const totalDowntime = useMemo(
    () => records.reduce((sum, record) => sum + (Number(record.downtime_minutes) || 0), 0),
    [records]
  );

  const averageDowntime = records.length > 0 ? totalDowntime / records.length : null;

  const formDurations = useMemo(
    () => computeCurativeDurations({
      requestTime: formData.request_time,
      startedTime: formData.started_time,
      finishedTime: formData.finished_time,
    }),
    [formData.finished_time, formData.request_time, formData.started_time]
  );

  const resetForm = () => {
    setEditingRecord(null);
    setFormData(buildInitialFormState());
    setEquipmentSearch('');
    setSelectedEquipmentId('');
    setError('');
  };

  const openForm = (record = null) => {
    setEditingRecord(record);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const handleEquipmentSearchChange = (event) => {
    const value = event.target.value;
    setEquipmentSearch(value);

    const exactMatch = equipmentOptions.find((equipment) => {
      const label = buildEquipmentLabel(equipment);
      return label === value || equipment.code_rai === value || equipment.designation === value;
    });

    if (exactMatch) {
      setSelectedEquipmentId(String(exactMatch.id));
      setFormData((current) => ({
        ...current,
        zone_production: current.zone_production || exactMatch.Zone?.nom_zone || '',
      }));
    } else {
      setSelectedEquipmentId('');
    }
  };

  const handleEquipmentPick = (equipment) => {
    setSelectedEquipmentId(String(equipment.id));
    setEquipmentSearch(buildEquipmentLabel(equipment));
    setFormData((current) => ({
      ...current,
      zone_production: current.zone_production || equipment.Zone?.nom_zone || '',
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => {
      const next = {
        ...current,
        [name]: value,
      };

      if (name === 'incident_date' && value) {
        next.week_label = buildWeekLabel(value);
      }

      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    const resolvedEquipment = resolveEquipmentSelection();

    if (!resolvedEquipment) {
      setSaving(false);
      setError('Veuillez sélectionner un équipement existant.');
      return;
    }

    if (!selectedEquipmentId) {
      setSelectedEquipmentId(String(resolvedEquipment.id));
      setEquipmentSearch(buildEquipmentLabel(resolvedEquipment));
    }

    if (!formData.incident_date || !formData.request_time || !formData.started_time || !formData.finished_time) {
      setSaving(false);
      setError('La date, l\'heure de demande, l\'heure de début et l\'heure de fin sont obligatoires.');
      return;
    }

    if (formDurations.downtimeMinutes === null) {
      setSaving(false);
      setError('Les heures saisies sont invalides.');
      return;
    }

    const payload = {
      equipement_id: Number(resolvedEquipment.id),
      incident_date: formData.incident_date,
      week_label: formData.week_label || buildWeekLabel(formData.incident_date),
      intervenant: formData.intervenant.trim() || null,
      zone_production: formData.zone_production.trim() || resolvedEquipment.Zone?.nom_zone || null,
      request_time: formData.request_time,
      started_time: formData.started_time,
      finished_time: formData.finished_time,
      description_panne: formData.description_panne.trim() || null,
      response_minutes: formDurations.responseMinutes,
      downtime_minutes: formDurations.downtimeMinutes,
    };

    try {
      if (editingRecord?.id) {
        await curativeMaintenanceService.update(editingRecord.id, payload);
      } else {
        await curativeMaintenanceService.create(payload);
      }

      await loadData();
      closeForm();
    } catch (saveError) {
      console.error('Erreur sauvegarde suivi curatif:', saveError);
      setError(saveError?.response?.data?.message || saveError.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (record) => {
    openForm(record);
  };

  const handleDelete = async (record) => {
    if (!window.confirm(`Supprimer l\'incident du ${formatDateOnly(record.incident_date)} ?`)) {
      return;
    }

    try {
      await curativeMaintenanceService.delete(record.id);
      await loadData();
      if (editingRecord?.id === record.id) {
        closeForm();
      }
    } catch (deleteError) {
      console.error('Erreur suppression incident curatif:', deleteError);
      setError(deleteError?.response?.data?.message || deleteError.message || 'Erreur lors de la suppression.');
    }
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-slate-50">
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-600">Maintenance curative</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Suivi curatif des équipements</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Enregistrez les incidents en panne, le démarrage de l'intervention et la durée d'arrêt réelle. Les enregistrements alimentent ensuite l'indicateur mensuel.
            </p>
          </div>

          <button
            type="button"
            onClick={() => openForm(null)}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            ➕ Nouvel incident
          </button>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Incidents enregistrés</div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{records.length}</div>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <div className="text-sm text-amber-700">Temps d'arrêt moyen</div>
            <div className="mt-2 text-3xl font-bold text-amber-900">{averageDowntime === null ? '-' : formatMinutes(averageDowntime)}</div>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 shadow-sm">
            <div className="text-sm text-orange-700">Temps d'arrêt total</div>
            <div className="mt-2 text-3xl font-bold text-orange-900">{formatMinutes(totalDowntime)}</div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Historique curatif</h2>
              <p className="text-sm text-slate-500">Les cas historiques importés depuis le suivi CSV sont visibles ici.</p>
            </div>
            <div className="w-full max-w-sm">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none"
                placeholder="Rechercher une panne, un code, une zone..."
              />
            </div>
          </div>

          <div className="overflow-auto rounded-2xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Équipement</th>
                  <th className="px-4 py-3 text-left">Zone</th>
                  <th className="px-4 py-3 text-left">Intervenant</th>
                  <th className="px-4 py-3 text-left">Demande</th>
                  <th className="px-4 py-3 text-left">Début</th>
                  <th className="px-4 py-3 text-left">Fin</th>
                  <th className="px-4 py-3 text-left">Arrêt</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-slate-400">Chargement…</td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-slate-400">Aucun incident curatif trouvé.</td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr key={record.id} className="align-top hover:bg-slate-50/70">
                      <td className="whitespace-nowrap px-4 py-3">{formatDateOnly(record.incident_date)}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{record.Equipement?.code_rai || record.equipement_code || '-'}</div>
                        <div className="text-xs text-slate-500">{record.Equipement?.designation || record.equipement_label || '-'}</div>
                        <div className="mt-1 text-[11px] text-slate-400">{record.week_label || '-'}</div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">{record.zone_production || '-'}</td>
                      <td className="whitespace-nowrap px-4 py-3">{record.intervenant || '-'}</td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-slate-700">{record.request_time || '-'}</td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-slate-700">{record.started_time || '-'}</td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-slate-700">{record.finished_time || '-'}</td>
                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-orange-700">{formatMinutes(record.downtime_minutes)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(record)}
                            className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                          >
                            Modifier
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(record)}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4" onClick={closeForm}>
          <div
            className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-900 px-6 py-5 text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-200">Maintenance curative</p>
                <h2 className="mt-1 text-2xl font-bold">{editingRecord?.id ? 'Modifier un incident' : 'Nouvel incident curatif'}</h2>
                <p className="mt-1 text-sm text-slate-200/90">Formulaire indépendant pour enregistrer un arrêt curatif.</p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="text-2xl font-bold leading-none text-white/90 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block md:col-span-2">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Équipement *</span>
                    <input
                      type="text"
                      value={equipmentSearch}
                      onChange={handleEquipmentSearchChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none"
                      placeholder="Tapez un code ou une désignation puis choisissez dans la liste"
                    />
                    {equipmentSearch && filteredEquipmentOptions.length > 0 && (
                      <div className="mt-2 max-h-56 overflow-auto rounded-xl border border-orange-100 bg-orange-50/70 p-2">
                        {filteredEquipmentOptions.map((equipment) => (
                          <button
                            key={equipment.id}
                            type="button"
                            onClick={() => handleEquipmentPick(equipment)}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-white"
                          >
                            <span>{buildEquipmentLabel(equipment)}</span>
                            <span className="ml-4 shrink-0 text-xs text-slate-400">#{equipment.id}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {equipmentSearch && !selectedEquipmentId && (
                      <p className="mt-1 text-xs font-medium text-red-600">Choisissez un équipement existant pour continuer.</p>
                    )}
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Date incident *</span>
                    <input
                      type="date"
                      name="incident_date"
                      value={formData.incident_date}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Semaine</span>
                    <input
                      type="text"
                      name="week_label"
                      value={formData.week_label}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none"
                      placeholder="KW 16"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Intervenant</span>
                    <input
                      type="text"
                      name="intervenant"
                      value={formData.intervenant}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none"
                      placeholder="Nom de l'opérateur"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Zone production</span>
                    <input
                      type="text"
                      name="zone_production"
                      value={formData.zone_production}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none"
                      placeholder="Zone de production"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Heure de demande *</span>
                    <input
                      type="time"
                      name="request_time"
                      value={formData.request_time}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Début intervention *</span>
                    <input
                      type="time"
                      name="started_time"
                      value={formData.started_time}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Fin intervention *</span>
                    <input
                      type="time"
                      name="finished_time"
                      value={formData.finished_time}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-orange-500 focus:outline-none"
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Description de la panne</span>
                    <textarea
                      name="description_panne"
                      value={formData.description_panne}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none"
                      placeholder="Décrivez le problème rencontré"
                    />
                  </label>
                </div>

                <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Délai d'intervention</div>
                    <div className="mt-1 text-lg font-bold text-slate-900">{formatMinutes(formDurations.responseMinutes)}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Temps d'arrêt</div>
                    <div className="mt-1 text-lg font-bold text-slate-900">{formatMinutes(formDurations.downtimeMinutes)}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:bg-slate-400"
                  >
                    {saving ? 'Sauvegarde…' : editingRecord?.id ? "Modifier l'incident" : "Enregistrer l'incident"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
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