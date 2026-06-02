import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STEP_WIDTH = 224;
const STEP_HEIGHT = 112;
const CONNECTOR_OFFSET = 18;

const DEFAULT_STEPS = [
  {
    id: 's1',
    number: 1,
    parentId: null,
    label: 'Material Reception',
    meaning: 'Operation with control',
    shape: 'operation-control',
    tools: ['Caliper'],
    parameters: ['Reference checked', 'Quantity checked', 'Visual control OK'],
    photos: [{ title: 'Reception photo', description: 'Example picture of the incoming material.' }],
    videos: [{ title: 'Reception procedure', duration: '01:24' }],
  },
  {
    id: 's2',
    number: 2,
    parentId: 's1',
    label: 'Incoming control',
    meaning: 'Control',
    shape: 'control',
    tools: ['Caliper', 'Comparator'],
    parameters: ['Dimensional control', 'Surface control', 'Traceability label'],
    photos: [{ title: 'Control reference photo', description: 'Sample image to explain the control point.' }],
    videos: [{ title: 'Incoming control demo', duration: '02:10' }],
  },
  {
    id: 's3',
    number: 3,
    parentId: 's2',
    label: 'Storage',
    meaning: 'Storage',
    shape: 'storage',
    tools: ['Racking label'],
    parameters: ['Storage location', 'FIFO', 'Humidity check'],
    photos: [{ title: 'Storage area', description: 'Warehouse zone and rack identification.' }],
    videos: [],
  },
  {
    id: 's4',
    number: 4,
    parentId: 's3',
    label: 'Cutting wires',
    meaning: 'Operation',
    shape: 'operation',
    tools: ['ORION MNT635', 'Cutting jig'],
    parameters: ['Cut length', 'Wire type', 'Tolerance'],
    photos: [{ title: 'Cutting workstation', description: 'Example machine photo for the step.' }],
    videos: [{ title: 'Wire cutting sequence', duration: '01:48' }],
  },
  {
    id: 's5',
    number: 5,
    parentId: 's4',
    label: 'Stripping wires',
    meaning: 'Operation with control',
    shape: 'operation-control',
    tools: ['Komax Alpha 530'],
    parameters: ['Strip length', 'No damage to conductor', 'Insulation removed cleanly'],
    photos: [{ title: 'Stripping step', description: 'Photo illustrating the stripped wire.' }],
    videos: [],
  },
];

const createStepId = () => `step-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const normalizeText = (value = '') =>
  String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ');

const shapeTitles = {
  'operation-control': 'Operation with control',
  control: 'Control',
  storage: 'Storage',
  operation: 'Operation',
};

const FlowStepNode = ({ step, selected, onClick, onPointerDown }) => {
  return (
    <button
      type="button"
      onClick={() => onClick(step.id)}
      onPointerDown={(event) => onPointerDown?.(event, step.id)}
      className={`absolute z-10 flex h-28 w-56 cursor-grab items-center justify-center border border-slate-400 bg-white px-4 py-3 text-center text-sm shadow-sm transition active:cursor-grabbing ${
        selected ? 'border-blue-600 ring-4 ring-blue-100' : 'hover:border-slate-600'
      }`}
      style={{
        left: step.x,
        top: step.y,
        clipPath:
          step.shape === 'operation-control'
            ? 'polygon(15% 0,85% 0,100% 50%,85% 100%,15% 100%,0 50%)'
            : step.shape === 'control'
            ? 'polygon(50% 0,100% 50%,50% 100%,0 50%)'
            : step.shape === 'storage'
            ? 'polygon(50% 0,100% 82%,0 82%)'
            : 'none',
      }}
    >
      <div className="pointer-events-none">
        <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
          {step.number}
        </div>
        <div className="mt-1 font-semibold text-slate-900">{step.label}</div>
        <div className="mt-1 text-[11px] text-slate-600">{shapeTitles[step.shape]}</div>
      </div>
    </button>
  );
};

const FlowChartDetail = () => {
  const navigate = useNavigate();
  const dragStateRef = useRef(null);

  const [steps, setSteps] = useState(() =>
    DEFAULT_STEPS.map((step, index) => ({
      ...step,
      x: index % 2 === 0 ? 80 : 360,
      y: 60 + index * 140,
    }))
  );
  const [selectedStepId, setSelectedStepId] = useState(DEFAULT_STEPS[0].id);
  const [draft, setDraft] = useState({
    label: '',
    meaning: 'Operation',
    shape: 'operation',
    parentId: DEFAULT_STEPS[DEFAULT_STEPS.length - 1].id,
    tools: '',
    parameters: '',
    photos: '',
    videos: '',
  });

  const stepOptions = useMemo(
    () =>
      steps.map((step) => ({
        value: step.id,
        label: `${step.number}. ${step.label}`,
      })),
    [steps]
  );

  const selectedStep = useMemo(
    () => steps.find((step) => step.id === selectedStepId) || steps[0],
    [selectedStepId, steps]
  );

  useEffect(() => {
    const handlePointerMove = (event) => {
      const dragState = dragStateRef.current;
      if (!dragState) return;

      const nextX = Math.max(20, event.clientX - dragState.offsetX);
      const nextY = Math.max(20, event.clientY - dragState.offsetY);

      setSteps((current) =>
        current.map((step) =>
          step.id === dragState.stepId
            ? {
                ...step,
                x: nextX,
                y: nextY,
              }
            : step
        )
      );
    };

    const handlePointerUp = () => {
      dragStateRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  const handleDeleteStep = () => {
    if (!selectedStep) return;

    const shouldDelete = window.confirm(`Delete procedure ${selectedStep.number}. ${selectedStep.label}?`);
    if (!shouldDelete) return;

    const parentId = selectedStep.parentId || null;
    const remainingSteps = steps
      .filter((step) => step.id !== selectedStep.id)
      .map((step) => {
        if (step.parentId !== selectedStep.id) {
          return step;
        }

        return {
          ...step,
          parentId,
        };
      })
      .map((step, index) => ({
        ...step,
        number: index + 1,
      }));

    setSteps(remainingSteps);

    if (remainingSteps.length === 0) {
      setSelectedStepId('');
      return;
    }

    const nextSelectedStep =
      remainingSteps.find((step) => step.id === parentId) || remainingSteps[0];
    setSelectedStepId(nextSelectedStep.id);
  };

  const handleAddStep = () => {
    const nextLabel = normalizeText(draft.label);
    if (!nextLabel) return;

    const parentStep = steps.find((step) => step.id === draft.parentId) || steps[steps.length - 1];
    const siblingsCount = steps.filter((step) => step.parentId === parentStep.id).length;
    const offsetPattern = [0, 280, -280, 560, -560];
    const horizontalOffset = offsetPattern[siblingsCount] ?? siblingsCount * 240;
    const nextStep = {
      id: createStepId(),
      number: steps.length + 1,
      parentId: parentStep.id,
      label: nextLabel,
      meaning: draft.meaning,
      shape: draft.shape,
      tools: draft.tools
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      parameters: draft.parameters
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      photos: draft.photos
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => ({ title: item, description: 'Placeholder photo to be replaced later.' })),
      videos: draft.videos
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => ({ title: item, duration: '00:00' })),
      x: parentStep.x + horizontalOffset,
      y: parentStep.y + 160,
    };

    setSteps((current) => [...current, nextStep]);
    setSelectedStepId(nextStep.id);
    setDraft({
      label: '',
      meaning: 'Operation',
      shape: 'operation',
      parentId: nextStep.id,
      tools: '',
      parameters: '',
      photos: '',
      videos: '',
    });
  };

  const handleStepPointerDown = (event, stepId) => {
    if (event.button !== 0) return;

    const currentStep = steps.find((step) => step.id === stepId);
    if (!currentStep) return;

    dragStateRef.current = {
      stepId,
      offsetX: event.clientX - currentStep.x,
      offsetY: event.clientY - currentStep.y,
    };

    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const connectorLines = steps
    .filter((step) => step.parentId)
    .map((step) => {
      const parent = steps.find((candidate) => candidate.id === step.parentId);
      if (!parent) return null;

      const startX = parent.x + STEP_WIDTH / 2;
      const startY = parent.y + STEP_HEIGHT;
      const endX = step.x + STEP_WIDTH / 2;
      const endY = step.y + CONNECTOR_OFFSET;
      const midY = startY + 24;

      return { id: `${parent.id}-${step.id}`, startX, startY, endX, endY, midY };
    })
    .filter(Boolean);

  return (
    <div className="flex flex-1 flex-col overflow-auto bg-slate-50 p-4 md:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={() => navigate('/industrialization')}
            className="mb-3 text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            ← Retour à l'industrialisation
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Flow chart</h1>
          <p className="mt-1 text-sm text-slate-600">
            Module indépendant pour créer et documenter les procédures.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
          <div className="border-b border-slate-200 bg-slate-900 px-5 py-4 text-white">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Diagramme de fabrication</h2>
                <p className="mt-1 text-sm text-slate-300">
                  Cliquez sur une procédure pour voir ses paramètres et contenus associés.
                </p>
              </div>
              <div className="text-right text-xs text-slate-300">
                <p>{steps.length} étapes</p>
                <p>{selectedStep ? `Étape sélectionnée: ${selectedStep.number}` : 'Aucune sélection'}</p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[900px] overflow-auto bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.04),_transparent_45%),linear-gradient(180deg,_#ffffff,_#f8fafc)] p-6">
            <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                </marker>
              </defs>
              {connectorLines.map((line) => (
                <g key={line.id}>
                  <line x1={line.startX} y1={line.startY} x2={line.startX} y2={line.midY} stroke="#64748b" strokeWidth="2" />
                  <line x1={line.startX} y1={line.midY} x2={line.endX} y2={line.midY} stroke="#64748b" strokeWidth="2" />
                  <line
                    x1={line.endX}
                    y1={line.midY}
                    x2={line.endX}
                    y2={line.endY}
                    stroke="#64748b"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                </g>
              ))}
            </svg>

            {steps.map((step) => (
              <FlowStepNode
                key={step.id}
                step={step}
                selected={step.id === selectedStepId}
                onClick={setSelectedStepId}
                onPointerDown={handleStepPointerDown}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Procedure</p>
                <h3 className="mt-1 text-2xl font-bold text-slate-900">{selectedStep?.label}</h3>
                <p className="mt-1 text-sm text-slate-600">{selectedStep?.meaning}</p>
              </div>
              <div className="rounded-2xl bg-slate-100 px-3 py-2 text-right">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">N°</p>
                <p className="text-2xl font-bold text-slate-900">{selectedStep?.number}</p>
              </div>
            </div>

            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={handleDeleteStep}
                disabled={!selectedStep}
                className="inline-flex items-center rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                🗑️ Delete procedure
              </button>
            </div>

            <div className="space-y-4">
              <section>
                <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Parametres</h4>
                <div className="mt-2 space-y-2">
                  {(selectedStep?.parameters || []).map((parameter) => (
                    <div key={parameter} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                      {parameter}
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Vient de</h4>
                <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  {selectedStep?.parentId
                    ? (() => {
                        const parent = steps.find((step) => step.id === selectedStep.parentId);
                        return parent ? `${parent.number}. ${parent.label}` : 'Parent introuvable';
                      })()
                    : 'Départ'}
                </div>
              </section>

              <section>
                <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Outils / Materiel</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(selectedStep?.tools || []).map((tool) => (
                    <span key={tool} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {tool}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Photos</h4>
                <div className="mt-2 grid gap-3">
                  {(selectedStep?.photos || []).map((photo) => (
                    <div key={photo.title} className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-200 text-xs font-semibold text-slate-600">
                          PHOTO
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{photo.title}</p>
                          <p className="text-xs text-slate-600">{photo.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Videos</h4>
                <div className="mt-2 space-y-2">
                  {(selectedStep?.videos || []).length > 0 ? (
                    selectedStep.videos.map((video) => (
                      <div key={video.title} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                        <div className="font-semibold text-slate-900">{video.title}</div>
                        <div className="text-xs text-slate-500">Durée: {video.duration}</div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                      Aucun video ajoute pour cette procedure.
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Ajouter une procedure</p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">Skeleton de creation</h3>
            <p className="mt-1 text-sm text-slate-600">
              Tu pourras ensuite brancher cette zone sur la base de donnees ou l'export.
            </p>

            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Procedure</span>
                <input
                  type="text"
                  value={draft.label}
                  onChange={(event) => setDraft((current) => ({ ...current, label: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Ex: Crimping"
                />
              </label>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Vient de</span>
                  <select
                    value={draft.parentId}
                    onChange={(event) => setDraft((current) => ({ ...current, parentId: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Départ du flow</option>
                    {stepOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-slate-500">
                    Choisis le bloc d’où part la flèche pour cette nouvelle procédure.
                  </p>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Type</span>
                  <select
                    value={draft.shape}
                    onChange={(event) => setDraft((current) => ({ ...current, shape: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="operation">Operation</option>
                    <option value="control">Control</option>
                    <option value="storage">Storage</option>
                    <option value="operation-control">Operation with control</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Meaning</span>
                  <input
                    type="text"
                    value={draft.meaning}
                    onChange={(event) => setDraft((current) => ({ ...current, meaning: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="Operation"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Outils</span>
                <input
                  type="text"
                  value={draft.tools}
                  onChange={(event) => setDraft((current) => ({ ...current, tools: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Ex: Caliper, Komax Alpha 530"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Parametres</span>
                <textarea
                  value={draft.parameters}
                  onChange={(event) => setDraft((current) => ({ ...current, parameters: event.target.value }))}
                  className="min-h-24 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Un parametre par ligne"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Photos</span>
                <textarea
                  value={draft.photos}
                  onChange={(event) => setDraft((current) => ({ ...current, photos: event.target.value }))}
                  className="min-h-20 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Une ligne par photo"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Videos</span>
                <textarea
                  value={draft.videos}
                  onChange={(event) => setDraft((current) => ({ ...current, videos: event.target.value }))}
                  className="min-h-20 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Une ligne par video"
                />
              </label>

              <button
                type="button"
                onClick={handleAddStep}
                className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                + Ajouter la procedure au graphe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowChartDetail;