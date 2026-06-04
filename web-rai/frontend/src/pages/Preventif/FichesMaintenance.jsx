import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { maintenanceSheetService, machineTemplateService } from '../../services/api';
import {
  buildInitialSpareParts,
  buildInitialTasks,
} from '../../data/maintenanceMachines';

const STATUS_OPTIONS = [
  { value: '', label: 'A definir' },
  { value: 'ok', label: '1 : ok' },
  { value: 'nok', label: '0 : nok' },
  { value: 'non_existe', label: '- : Non existe' },
];

const formatDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};

const formatDateOnly = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('fr-FR');
};

const formatDuration = (startValue, endValue) => {
  if (!startValue) return '-';
  const start = new Date(startValue);
  const end = endValue ? new Date(endValue) : new Date();
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return '-';

  const totalMinutes = Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours} h ${String(minutes).padStart(2, '0')} min`;
};

const getWeekNumber = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil(((target - yearStart) / 86400000 + 1) / 7);
  return `KW ${String(weekNumber).padStart(2, '0')}`;
};

const normalizeTasks = (template, sheetTasks = []) => {
  const taskMap = new Map(
    sheetTasks.map((task) => [`${task.sectionKey || task.section_key}-${task.number}`, task])
  );

  return template.sections.flatMap((section) =>
    section.tasks.map((task) => {
      const savedTask = taskMap.get(`${section.key}-${task.number}`);

      return {
        sectionKey: section.key,
        sectionTitle: section.title,
        number: task.number,
        label: task.label,
        criterion: task.criterion,
        status: savedTask?.status || '',
        note: savedTask?.note || '',
      };
    })
  );
};

const normalizeSpareParts = (sheetSpareParts = []) => {
  if (sheetSpareParts.length >= 5) {
    return sheetSpareParts.slice(0, 5).map((row) => ({
      designation: row.designation || '',
      reference: row.reference || '',
      quantity: row.quantity || '',
    }));
  }

  return [
    ...sheetSpareParts.map((row) => ({
      designation: row.designation || '',
      reference: row.reference || '',
      quantity: row.quantity || '',
    })),
    ...buildInitialSpareParts().slice(sheetSpareParts.length),
  ];
};

const buildDraftFromTemplate = (template, equipment = null) => ({
  machine_key: template.machineKey,
  machine_label: buildEquipmentLabel(equipment) || template.machineLabel,
  reference: template.reference || '',
  template,
  tasks: buildInitialTasks(template),
  spare_parts: buildInitialSpareParts(),
  observations: '',
  operator_matricule: '',
  operator_signature: '',
  started_at: null,
  finished_at: null,
  status: 'in_progress',
});

const buildDraftFromSheet = (sheet, template, equipment = null) => ({
  machine_key: sheet.machine_key,
  machine_label: buildEquipmentLabel(equipment) || sheet.machine_label,
  reference: sheet.reference || template.reference || '',
  template: sheet.template || template,
  tasks: normalizeTasks(template, sheet.tasks || []),
  spare_parts: normalizeSpareParts(sheet.spare_parts || []),
  observations: sheet.observations || '',
  operator_matricule: sheet.operator_matricule || '',
  operator_signature: sheet.operator_signature || '',
  started_at: sheet.started_at || null,
  finished_at: sheet.finished_at || null,
  status: sheet.status || 'in_progress',
});

const buildEquipmentLabel = (equipment, fallbackLabel = '') => {
  if (!equipment) return fallbackLabel;

  const equipmentIdentity = String(equipment.code_rai || equipment.code || equipment.designation || '').trim();
  if (!equipmentIdentity) return fallbackLabel;

  return fallbackLabel ? `${equipmentIdentity} • ${fallbackLabel}` : equipmentIdentity;
};

const buildPayload = (draft) => ({
  machine_key: draft.machine_key,
  machine_label: draft.machine_label,
  reference: draft.reference || null,
  template: draft.template,
  tasks: draft.tasks,
  spare_parts: draft.spare_parts,
  observations: draft.observations || null,
  operator_matricule: draft.operator_matricule || null,
  operator_signature: draft.operator_signature || null,
  started_at: draft.started_at || null,
  finished_at: draft.finished_at || null,
  status: draft.status || 'in_progress',
});

const resolveSheetTemplate = (sheet) => {
  if (sheet?.template?.sections) {
    return sheet.template;
  }

  return (
    getMaintenanceMachineTemplate(sheet?.machine_key) || {
      machineKey: sheet?.machine_key || '',
      machineLabel: sheet?.machine_label || 'Fiche de maintenance',
      reference: sheet?.reference || '',
      subtitle: 'Plan de maintenance preventive systematique',
      sections: [],
    }
  );
};

const MachineCard = ({ machine, latestSheet, onOpen }) => {
  const latestLabel = latestSheet
    ? latestSheet.status === 'in_progress'
      ? 'Fiche en cours'
      : 'Derniere fiche terminee'
    : 'Aucune fiche enregistree';

  return (
    <button
      type="button"
      onClick={onOpen}
      className="text-left rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Fiche machine</p>
          <h3 className="mt-2 text-lg font-bold text-slate-900">{machine.machineLabel}</h3>
          <p className="mt-1 text-sm text-slate-500">{machine.subtitle}</p>
        </div>
        <div className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 border border-sky-200">
          {machine.sections.length} section(s)
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
        <div>
          <span className="font-semibold text-slate-800">Dernier statut:</span> {latestLabel}
        </div>
        <div>
          <span className="font-semibold text-slate-800">Debut:</span> {formatDateTime(latestSheet?.started_at)}
        </div>
        <div>
          <span className="font-semibold text-slate-800">Fin:</span> {formatDateTime(latestSheet?.finished_at)}
        </div>
        <div>
          <span className="font-semibold text-slate-800">Total taches:</span>{' '}
          {machine.sections.reduce((count, section) => count + section.tasks.length, 0)}
        </div>
      </div>

      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-600">
        Ouvrir la fiche <span aria-hidden="true">→</span>
      </div>
    </button>
  );
};

const FichesMaintenance = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { machineKey, sheetId } = useParams();
  const [customTemplates, setCustomTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('machines');
  const [latestSheet, setLatestSheet] = useState(null);
  const [selectedSheet, setSelectedSheet] = useState(null);

  // Load custom templates from DB (replaces localStorage)
  useEffect(() => {
    machineTemplateService.getAll()
      .then(data => setCustomTemplates(Array.isArray(data) ? data : []))
      .catch(err => console.error('Erreur chargement fiches machines:', err))
      .finally(() => setLoadingTemplates(false));
  }, []);

  // All machines now come from the database (no more hardcoded list)
  const allMachines = customTemplates;

  const template = useMemo(() => {
    if (!machineKey) return null;
    return customTemplates.find((t) => t.machineKey === machineKey) || null;
  }, [machineKey, customTemplates]);

  const equipmentContext = location.state?.equipment || null;
  const equipmentLabel = buildEquipmentLabel(equipmentContext, template?.machineLabel || '');
  const [draft, setDraft] = useState(template ? buildDraftFromTemplate(template, equipmentContext) : null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (sheetId) {
      const loadSheetById = async () => {
        setLoading(true);
        setError(null);

        try {
          const sheet = await maintenanceSheetService.getById(sheetId);
          const sheetTemplate = resolveSheetTemplate(sheet);
          const relatedHistory = await maintenanceSheetService.getAll({ machine_key: sheet.machine_key });

          setSelectedSheet(sheet);
          setLatestSheet(sheet);
          setDraft(buildDraftFromSheet(sheet, sheetTemplate, equipmentContext));
          setHistory(relatedHistory || []);
          setActiveTab('completed');
        } catch (loadError) {
          setError('Impossible de charger la fiche demandee.');
          setSelectedSheet(null);
          setLatestSheet(null);
          setDraft(null);
          setHistory([]);
          console.error(loadError);
        } finally {
          setLoading(false);
        }
      };

      loadSheetById();
      return;
    }

    if (!machineKey) {
      const loadSummary = async () => {
        setLoading(true);
        setError(null);

        try {
          const sheets = await maintenanceSheetService.getAll();
          setHistory(sheets || []);
        } catch (summaryError) {
          setHistory([]);
          setError('Impossible de charger l\'historique des fiches.');
          console.error(summaryError);
        } finally {
          setLoading(false);
        }
      };

      setLatestSheet(null);
      setSelectedSheet(null);
      setDraft(null);
      loadSummary();
      return;
    }

    if (!template) {
      setError('Machine inconnue.');
      setLatestSheet(null);
      setSelectedSheet(null);
      setDraft(null);
      setHistory([]);
      return;
    }

    const loadSheet = async () => {
      setLoading(true);
      setError(null);

      try {
        const [latestResponse, historyResponse] = await Promise.all([
          maintenanceSheetService.getLatestByMachine(machineKey).catch((err) => {
            if (err?.response?.status === 404) return null;
            throw err;
          }),
          maintenanceSheetService.getAll({ machine_key: machineKey }),
        ]);

        if (latestResponse) {
          setLatestSheet(latestResponse);
          setDraft(buildDraftFromSheet(latestResponse, template, equipmentContext));
        } else {
          setLatestSheet(null);
          setDraft(buildDraftFromTemplate(template, equipmentContext));
        }

        setHistory(historyResponse || []);
      } catch (loadError) {
        setError('Impossible de charger la fiche de maintenance.');
        setLatestSheet(null);
        setSelectedSheet(null);
        setDraft(buildDraftFromTemplate(template, equipmentContext));
        setHistory([]);
        console.error(loadError);
      } finally {
        setLoading(false);
      }
    };

    loadSheet();
  }, [equipmentContext, machineKey, sheetId, template]);

  const displayTemplate = template || (selectedSheet ? resolveSheetTemplate(selectedSheet) : null);
  const activeMachineLabel = equipmentLabel || selectedSheet?.machine_label || latestSheet?.machine_label || draft?.machine_label || displayTemplate?.machineLabel || '';
  const isInspectionMode = Boolean(sheetId);
  const isSummaryView = !machineKey && !sheetId;
  const isSummaryLoading = isSummaryView && (loading || loadingTemplates);

  const groupedTasks = useMemo(() => {
    if (!draft || !displayTemplate || !Array.isArray(draft.tasks)) return [];

    return displayTemplate.sections.map((section) => ({
      ...section,
      tasks: draft.tasks.filter((task) => task.sectionKey === section.key),
    }));
  }, [draft, displayTemplate]);

  const openSheet = async () => {
    if (!template || !draft) return;

    if (latestSheet?.status === 'in_progress') {
      setError('Une fiche est deja ouverte pour cette machine.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = buildPayload({
        ...draft,
        started_at: new Date().toISOString(),
        status: 'in_progress',
      });
      const createdSheet = await maintenanceSheetService.create(payload);
      setLatestSheet(createdSheet);
      setDraft(buildDraftFromSheet(createdSheet, template, equipmentContext));
      navigate(`/preventif/fiches-maintenance/${template.machineKey}`, { replace: true });
    } catch (createError) {
      setError('Impossible de demarrer cette fiche.');
      console.error(createError);
    } finally {
      setSaving(false);
    }
  };

  const updateDraft = (updater) => {
    setDraft((current) => {
      if (!current) return current;
      return typeof updater === 'function' ? updater(current) : { ...current, ...updater };
    });
  };

  const updateTask = (sectionKey, number, field, value) => {
    updateDraft((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.sectionKey === sectionKey && task.number === number ? { ...task, [field]: value } : task
      ),
    }));
  };

  const updateSparePart = (rowIndex, field, value) => {
    updateDraft((current) => ({
      ...current,
      spare_parts: current.spare_parts.map((row, index) =>
        index === rowIndex ? { ...row, [field]: value } : row
      ),
    }));
  };

  const persistSheet = async (nextStatus = draft?.status || 'in_progress') => {
    if (!latestSheet || !draft) return null;

    setSaving(true);
    setError(null);

    try {
      const payload = buildPayload({
        ...draft,
        status: nextStatus,
      });

      const response = await maintenanceSheetService.update(latestSheet.id, payload);
      setLatestSheet(response);
      setDraft(buildDraftFromSheet(response, template, equipmentContext));
      setHistory((current) => [response, ...current.filter((entry) => entry.id !== response.id)]);
      return response;
    } catch (saveError) {
      setError('Impossible de sauvegarder la fiche.');
      console.error(saveError);
      return null;
    } finally {
      setSaving(false);
    }
  };

  const completedSheets = useMemo(
    () => history.filter((sheet) => sheet.status === 'completed'),
    [history]
  );

  const latestSheetsByMachine = useMemo(() => {
    const map = new Map();

    history.forEach((sheet) => {
      const current = map.get(sheet.machine_key);
      const currentTime = current ? new Date(current.started_at || current.createdAt || 0).getTime() : 0;
      const nextTime = new Date(sheet.started_at || sheet.createdAt || 0).getTime();

      if (!current || nextTime >= currentTime) {
        map.set(sheet.machine_key, sheet);
      }
    });

    return map;
  }, [history]);

  const saveAndFinish = async () => {
    const savedSheet = await persistSheet('in_progress');
    if (!savedSheet) return;

    setSaving(true);
    setError(null);

    try {
      const response = await maintenanceSheetService.finish(savedSheet.id, {
        ...buildPayload(draft),
        finished_at: new Date().toISOString(),
      });
      setLatestSheet(response);
      setDraft(buildDraftFromSheet(response, template, equipmentContext));
      setHistory((current) => [response, ...current.filter((entry) => entry.id !== response.id)]);
      navigate(`/preventif/fiches-maintenance/fiche/${response.id}`, { replace: true });
    } catch (finishError) {
      setError('Impossible de cloturer la fiche.');
      console.error(finishError);
    } finally {
      setSaving(false);
    }
  };

  if (isSummaryView) {
    return (
      <div className="flex flex-1 flex-col overflow-auto bg-slate-50 p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-slate-100">
              <span className="text-slate-500 text-sm font-bold">FM</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Fiches machines</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {isSummaryLoading ? 'Chargement des fiches…' : 'Ouvrez une machine, démarrez une fiche et clôturez la maintenance'}
              </p>
            </div>
          </div>
        </div>

        {completedSheets.length > 0 && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
            <div>
              <strong>{completedSheets.length}</strong> fiche(s) terminée(s) disponibles pour inspection.
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('completed')}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}
            >
              Voir les terminées
            </button>
          </div>
        )}

        <div className="mb-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('machines')}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeTab === 'machines'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Machines ({allMachines.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeTab === 'completed'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Fiches terminées ({completedSheets.length})
          </button>
        </div>

        {activeTab === 'machines' ? (
          <>
            <div className="mb-6 flex gap-3">
              <button
                onClick={() => navigate('/preventif/fiches-maintenance/create')}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition"
                style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}
              >
                + Créer une fiche machine
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {allMachines.map((machine) => (
                <MachineCard
                  key={machine.machineKey}
                  machine={machine}
                  latestSheet={latestSheetsByMachine.get(machine.machineKey) || null}
                  onOpen={() => navigate(`/preventif/fiches-maintenance/${machine.machineKey}`)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-100 px-4 py-3">
              <h2 className="text-base font-bold text-slate-900">Fiches terminées à inspecter</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Fiche</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Machine</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Debut</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Fin</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Operateur</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {completedSheets.map((sheet) => (
                    <tr key={sheet.id}>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-700">#{sheet.id}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{sheet.machine_label}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{formatDateTime(sheet.started_at)}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{formatDateTime(sheet.finished_at)}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{sheet.operator_matricule || '-'}</td>
                      <td className="px-4 py-3 text-sm">
                        <Link
                          to={`/preventif/fiches-maintenance/fiche/${sheet.id}`}
                          className="inline-flex rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700"
                        >
                          Inspecter
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!displayTemplate) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-center text-slate-600">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Machine introuvable</h1>
          <p className="mt-2 text-sm text-slate-500">La fiche demandee n\'existe pas dans la liste des templates.</p>
          <Link to="/preventif/fiches-maintenance" className="mt-4 inline-flex text-sm font-semibold text-amber-700 hover:text-amber-800">
            Retour a la liste
          </Link>
        </div>
      </div>
    );
  }

  if (loading || !draft) {
    return <div className="flex flex-1 items-center justify-center text-sm text-slate-500">Chargement de la fiche...</div>;
  }

  const isCompleted = draft.status === 'completed';
  const hasOpenSheet = latestSheet?.status === 'in_progress';
  const activeSheetLabel = latestSheet?.id ? `Fiche #${latestSheet.id}` : 'Nouvelle fiche';
  const canModifyDraft = !isInspectionMode && !isCompleted;

  return (
    <div className="flex flex-1 flex-col overflow-auto bg-slate-50 p-4 md:p-6">
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white shadow-lg">
        <div className="rounded-t-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-700 px-6 py-5 text-white">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Link to="/preventif/fiches-maintenance" className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-200 hover:text-amber-100">
                ← Retour aux machines
              </Link>
              <h1 className="mt-2 text-3xl font-bold">{activeMachineLabel || displayTemplate.machineLabel}</h1>
              {activeMachineLabel && activeMachineLabel !== displayTemplate.machineLabel && (
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/90">
                  Modèle général: {displayTemplate.machineLabel}
                </p>
              )}
              <p className="mt-2 text-sm text-slate-100/90">{displayTemplate.subtitle}</p>
              {equipmentLabel && (
                <div className="mt-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                  Équipement ciblé: {equipmentLabel}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full bg-white/10 px-3 py-1">{activeSheetLabel}</span>
              <span className="rounded-full bg-white/10 px-3 py-1">{isCompleted ? 'Cloturee' : 'En cours'}</span>
              <span className="rounded-full bg-white/10 px-3 py-1">{getWeekNumber(draft.started_at)}</span>
            </div>
          </div>
        </div>

        <div className="border-b border-slate-200 px-6 py-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Debut intervention', value: formatDateTime(draft.started_at) },
              { label: 'Fin intervention', value: formatDateTime(draft.finished_at) },
              { label: 'Date d\'execution', value: formatDateOnly(draft.started_at) },
              { label: 'Duree intervention', value: formatDuration(draft.started_at, draft.finished_at) },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Matricule</span>
              <input
                type="text"
                value={draft.operator_matricule}
                onChange={(e) => updateDraft({ operator_matricule: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                placeholder="Matricule operateur"
                disabled={!canModifyDraft}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Signature</span>
              <input
                type="text"
                value={draft.operator_signature}
                onChange={(e) => updateDraft({ operator_signature: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                placeholder="Signature / nom"
                disabled={!canModifyDraft}
              />
            </label>
          </div>

          {!isInspectionMode && (
            <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openSheet}
              disabled={saving || hasOpenSheet}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}
            >
              {hasOpenSheet ? 'Fiche deja ouverte' : 'Demarrer la maintenance'}
            </button>
            <button
              type="button"
              onClick={() => persistSheet('in_progress')}
              disabled={saving || !latestSheet || !canModifyDraft}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sauvegarder
            </button>
            <button
              type="button"
              onClick={saveAndFinish}
              disabled={saving || !latestSheet || !canModifyDraft}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              Terminer la maintenance
            </button>
            {isCompleted && (
              <button
                type="button"
                onClick={() => openSheet()}
                disabled={saving}
                className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100 disabled:cursor-not-allowed"
              >
                Nouvelle fiche
              </button>
            )}
            </div>
          )}
        </div>

        <div className="space-y-6 px-4 py-5 md:px-6">
          {groupedTasks.map((section) => (
            <div key={section.key} className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="bg-slate-100 px-4 py-3">
                <h2 className="text-base font-bold text-slate-900">{section.title}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">N°</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Points a controler</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Critere de jugement</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {section.tasks.map((task) => (
                      <tr key={`${section.key}-${task.number}`} className="align-top">
                        <td className="px-4 py-3 text-sm font-semibold text-slate-700">{task.number}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{task.label}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-900">{task.criterion}</td>
                        <td className="px-4 py-3 text-sm">
                          <select
                            value={task.status}
                            onChange={(e) => updateTask(section.key, task.number, 'status', e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                            disabled={!canModifyDraft}
                          >
                            {STATUS_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          <div className="grid gap-6 xl:grid-cols-[1.25fr_0.9fr]">
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="border-b border-slate-200 bg-slate-100 px-4 py-3">
                <h2 className="text-base font-bold text-slate-900">Observation technicien</h2>
              </div>
              <textarea
                value={draft.observations}
                onChange={(e) => updateDraft({ observations: e.target.value })}
                rows={10}
                className="w-full resize-none px-4 py-3 text-sm focus:outline-none"
                placeholder="Ajouter les observations de fin de maintenance..."
                disabled={!canModifyDraft}
              />
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="border-b border-slate-200 bg-slate-100 px-4 py-3">
                <h2 className="text-base font-bold text-slate-900">Piece de rechange utiliser</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 bg-white">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Designation</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Reference</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Quantite</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {draft.spare_parts.map((row, index) => (
                      <tr key={`spare-${index}`}>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={row.designation}
                            onChange={(e) => updateSparePart(index, 'designation', e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                            disabled={!canModifyDraft}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={row.reference}
                            onChange={(e) => updateSparePart(index, 'reference', e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                            disabled={!canModifyDraft}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={row.quantity}
                            onChange={(e) => updateSparePart(index, 'quantity', e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                            disabled={!canModifyDraft}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {history.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="border-b border-slate-200 bg-slate-100 px-4 py-3">
                <h2 className="text-base font-bold text-slate-900">Historique de la machine</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 bg-white">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Fiche</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Statut</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Debut</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Fin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {history.map((sheet) => (
                      <tr key={sheet.id}>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-700">#{sheet.id}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{sheet.status === 'completed' ? 'Cloturee' : 'En cours'}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{formatDateTime(sheet.started_at)}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{formatDateTime(sheet.finished_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FichesMaintenance;