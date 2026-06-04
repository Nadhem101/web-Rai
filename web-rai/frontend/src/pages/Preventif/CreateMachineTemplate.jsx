import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { machineTemplateService } from '../../services/api';

const CreateMachineTemplate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    machineLabel: '',
    subtitle: 'Plan de maintenance preventive systematique',
    monthlyTasks: [{ number: 1, label: '', criterion: '' }],
    semiannualTasks: [{ number: 1, label: '', criterion: '' }],
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMonthlyTaskChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      monthlyTasks: prev.monthlyTasks.map((task, i) =>
        i === index ? { ...task, [field]: value } : task
      ),
    }));
  };

  const handleSemiannualTaskChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      semiannualTasks: prev.semiannualTasks.map((task, i) =>
        i === index ? { ...task, [field]: value } : task
      ),
    }));
  };

  const addMonthlyTask = () => {
    setFormData((prev) => ({
      ...prev,
      monthlyTasks: [
        ...prev.monthlyTasks,
        { number: prev.monthlyTasks.length + 1, label: '', criterion: '' },
      ],
    }));
  };

  const addSemiannualTask = () => {
    setFormData((prev) => ({
      ...prev,
      semiannualTasks: [
        ...prev.semiannualTasks,
        { number: prev.semiannualTasks.length + 1, label: '', criterion: '' },
      ],
    }));
  };

  const removeMonthlyTask = (index) => {
    setFormData((prev) => ({
      ...prev,
      monthlyTasks: prev.monthlyTasks.filter((_, i) => i !== index).map((task, i) => ({
        ...task,
        number: i + 1,
      })),
    }));
  };

  const removeSemiannualTask = (index) => {
    setFormData((prev) => ({
      ...prev,
      semiannualTasks: prev.semiannualTasks.filter((_, i) => i !== index).map((task, i) => ({
        ...task,
        number: i + 1,
      })),
    }));
  };

  const [saving, setSaving] = useState(false);

  const handleSaveTemplate = async () => {
    setError('');
    setSuccessMessage('');

    if (!formData.machineLabel.trim()) {
      setError('Le nom de la machine est obligatoire');
      return;
    }
    if (formData.monthlyTasks.some((task) => !task.label.trim())) {
      setError('Tous les labels des tâches mensuelles doivent être remplis');
      return;
    }
    if (formData.semiannualTasks.some((task) => !task.label.trim())) {
      setError('Tous les labels des tâches semi-annuelles doivent être remplis');
      return;
    }

    setSaving(true);
    try {
      const machineKey = formData.machineLabel
        .toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      await machineTemplateService.create({
        machineKey,
        machineLabel: formData.machineLabel,
        subtitle:     formData.subtitle,
        sections: [
          {
            key:   'monthly',
            title: 'Maintenance préventive systématique mensuelle',
            tasks: formData.monthlyTasks,
          },
          {
            key:   'semiannual',
            title: 'Maintenance préventive systématique semestrielle',
            tasks: formData.semiannualTasks,
          },
        ],
      });

      setSuccessMessage('✅ Fiche machine créée avec succès !');
      setTimeout(() => {
        navigate('/preventif/fiches-maintenance');
      }, 1200);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Erreur lors de la création');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 flex-1 overflow-auto flex flex-col">
      <div className="mb-8">
        <button
          onClick={() => navigate('/preventif/fiches-maintenance')}
          className="mb-4 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition text-sm font-medium"
        >
          ← Retour
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Créer une Fiche Machine</h1>
        <p className="text-sm text-slate-600 mt-2">
          Créez un template de maintenance pour une nouvelle machine et assignez-le à un équipement
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          ❌ {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-lg shadow border border-slate-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Informations générales</h2>

        <label className="block mb-4">
          <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-700">
            Nom de la Machine *
          </span>
          <input
            type="text"
            name="machineLabel"
            value={formData.machineLabel}
            onChange={handleInputChange}
            placeholder="ex: Machine de sertissage, Machine de coupe..."
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-700">
            Sous-titre
          </span>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>

      {/* Monthly Tasks */}
      <div className="bg-white rounded-lg shadow border border-slate-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          📅 Maintenance Mensuelle
        </h2>

        <div className="space-y-4">
          {formData.monthlyTasks.map((task, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <div className="grid grid-cols-12 gap-4 mb-3">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">N°</label>
                  <input
                    type="number"
                    value={task.number}
                    disabled
                    className="w-full rounded border border-slate-300 px-2 py-2 text-sm font-medium bg-slate-100"
                  />
                </div>
                <div className="col-span-11 flex gap-2">
                  <input
                    type="text"
                    value={task.label}
                    onChange={(e) => handleMonthlyTaskChange(index, 'label', e.target.value)}
                    placeholder="Description de la tâche..."
                    className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.monthlyTasks.length > 1 && (
                    <button
                      onClick={() => removeMonthlyTask(index)}
                      className="px-3 py-2 rounded bg-red-100 text-red-700 hover:bg-red-200 transition text-sm font-medium"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              <input
                type="text"
                value={task.criterion}
                onChange={(e) => handleMonthlyTaskChange(index, 'criterion', e.target.value)}
                placeholder="Critère d'acceptation..."
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        <button
          onClick={addMonthlyTask}
          className="mt-4 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition text-sm font-medium"
        >
          + Ajouter une tâche mensuelle
        </button>
      </div>

      {/* Semi-annual Tasks */}
      <div className="bg-white rounded-lg shadow border border-slate-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          📆 Maintenance Semi-annuelle
        </h2>

        <div className="space-y-4">
          {formData.semiannualTasks.map((task, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <div className="grid grid-cols-12 gap-4 mb-3">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">N°</label>
                  <input
                    type="number"
                    value={task.number}
                    disabled
                    className="w-full rounded border border-slate-300 px-2 py-2 text-sm font-medium bg-slate-100"
                  />
                </div>
                <div className="col-span-11 flex gap-2">
                  <input
                    type="text"
                    value={task.label}
                    onChange={(e) => handleSemiannualTaskChange(index, 'label', e.target.value)}
                    placeholder="Description de la tâche..."
                    className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.semiannualTasks.length > 1 && (
                    <button
                      onClick={() => removeSemiannualTask(index)}
                      className="px-3 py-2 rounded bg-red-100 text-red-700 hover:bg-red-200 transition text-sm font-medium"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              <input
                type="text"
                value={task.criterion}
                onChange={(e) => handleSemiannualTaskChange(index, 'criterion', e.target.value)}
                placeholder="Critère d'acceptation..."
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        <button
          onClick={addSemiannualTask}
          className="mt-4 px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition text-sm font-medium"
        >
          + Ajouter une tâche semi-annuelle
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end mb-6">
        <button
          onClick={() => navigate('/preventif/fiches-maintenance')}
          className="px-6 py-2 rounded-lg bg-slate-200 text-slate-900 hover:bg-slate-300 transition font-medium"
        >
          Annuler
        </button>
        <button
          onClick={handleSaveTemplate}
          disabled={saving}
          className="px-6 py-2 rounded-lg text-white transition font-medium disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}
        >
          {saving ? 'Sauvegarde…' : '💾 Enregistrer la fiche machine'}
        </button>
      </div>
    </div>
  );
};

export default CreateMachineTemplate;
