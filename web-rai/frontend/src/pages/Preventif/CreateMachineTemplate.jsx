import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { machineTemplateService } from '../../services/api';

const iStyle = { background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--text)' };
const iCls   = 'w-full rounded-[8px] px-3 py-2 text-sm outline-none transition-colors';

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
  const [saving, setSaving] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMonthlyTaskChange = (index, field, value) => {
    setFormData((prev) => ({ ...prev, monthlyTasks: prev.monthlyTasks.map((task, i) => i === index ? { ...task, [field]: value } : task) }));
  };
  const handleSemiannualTaskChange = (index, field, value) => {
    setFormData((prev) => ({ ...prev, semiannualTasks: prev.semiannualTasks.map((task, i) => i === index ? { ...task, [field]: value } : task) }));
  };
  const addMonthlyTask = () => {
    setFormData((prev) => ({ ...prev, monthlyTasks: [...prev.monthlyTasks, { number: prev.monthlyTasks.length + 1, label: '', criterion: '' }] }));
  };
  const addSemiannualTask = () => {
    setFormData((prev) => ({ ...prev, semiannualTasks: [...prev.semiannualTasks, { number: prev.semiannualTasks.length + 1, label: '', criterion: '' }] }));
  };
  const removeMonthlyTask = (index) => {
    setFormData((prev) => ({ ...prev, monthlyTasks: prev.monthlyTasks.filter((_, i) => i !== index).map((task, i) => ({ ...task, number: i + 1 })) }));
  };
  const removeSemiannualTask = (index) => {
    setFormData((prev) => ({ ...prev, semiannualTasks: prev.semiannualTasks.filter((_, i) => i !== index).map((task, i) => ({ ...task, number: i + 1 })) }));
  };

  const handleSaveTemplate = async () => {
    setError(''); setSuccessMessage('');
    if (!formData.machineLabel.trim()) { setError('Le nom de la machine est obligatoire'); return; }
    if (formData.monthlyTasks.some((task) => !task.label.trim())) { setError('Tous les labels des tâches mensuelles doivent être remplis'); return; }
    if (formData.semiannualTasks.some((task) => !task.label.trim())) { setError('Tous les labels des tâches semi-annuelles doivent être remplis'); return; }
    setSaving(true);
    try {
      const machineKey = formData.machineLabel.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      await machineTemplateService.create({
        machineKey, machineLabel: formData.machineLabel, subtitle: formData.subtitle,
        sections: [
          { key: 'monthly',    title: 'Maintenance préventive systématique mensuelle',    tasks: formData.monthlyTasks },
          { key: 'semiannual', title: 'Maintenance préventive systématique semestrielle', tasks: formData.semiannualTasks },
        ],
      });
      setSuccessMessage('✅ Fiche machine créée avec succès !');
      setTimeout(() => navigate('/preventif/fiches-maintenance'), 1200);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Erreur lors de la création');
    } finally { setSaving(false); }
  };

  const TaskSection = ({ title, tasks, onAdd, onChange, onRemove, prefix }) => (
    <div className="rounded-[14px] p-6 mb-4" style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
      <h2 className="font-display font-bold text-[18px] mb-4" style={{ color: 'var(--text)' }}>{title}</h2>
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <div key={index} className="rounded-[10px] p-4" style={{ border: '1px solid var(--border2)', background: 'var(--panel2)' }}>
            <div className="grid grid-cols-12 gap-3 mb-2">
              <div className="col-span-1">
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text3)' }}>N°</label>
                <input type="number" value={task.number} disabled className={iCls} style={{ ...iStyle, opacity: 0.5 }} />
              </div>
              <div className="col-span-11 flex gap-2">
                <input type="text" value={task.label} onChange={(e) => onChange(index, 'label', e.target.value)}
                  placeholder="Description de la tâche…" className={`flex-1 ${iCls}`} style={iStyle} />
                {tasks.length > 1 && (
                  <button onClick={() => onRemove(index)}
                    className="px-3 py-2 rounded-[8px] text-sm font-semibold transition-colors hover:bg-[var(--crit-soft)] hover:text-[var(--crit)]"
                    style={{ border: '1px solid var(--border)', color: 'var(--text3)' }}>
                    ✕
                  </button>
                )}
              </div>
            </div>
            <input type="text" value={task.criterion} onChange={(e) => onChange(index, 'criterion', e.target.value)}
              placeholder="Critère d'acceptation…" className={iCls} style={iStyle} />
          </div>
        ))}
      </div>
      <button onClick={onAdd}
        className="mt-3 px-4 py-2 rounded-[8px] text-sm font-semibold transition-colors hover:bg-[var(--panel3)]"
        style={{ border: '1px dashed var(--border)', color: 'var(--accent)' }}>
        + Ajouter une tâche
      </button>
    </div>
  );

  return (
    <div className="px-[26px] pt-6 pb-10 flex-1 overflow-auto flex flex-col" style={{ background: 'var(--bg)' }}>
      <div className="mb-6">
        <button onClick={() => navigate('/preventif/fiches-maintenance')}
          className="mb-4 px-4 py-2 rounded-[8px] text-sm font-medium transition-colors hover:bg-[var(--panel3)]"
          style={{ background: 'var(--panel2)', color: 'var(--text2)', border: '1px solid var(--border)' }}>
          ← Retour
        </button>
        <h1 className="font-display font-bold text-[28px]" style={{ color: 'var(--text)', letterSpacing: '-0.5px' }}>Créer une Fiche Machine</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text3)' }}>Créez un template de maintenance pour une nouvelle machine et assignez-le à un équipement</p>
      </div>

      {error && (
        <div className="mb-4 rounded-[10px] px-4 py-3 text-sm" style={{ border: '1px solid var(--crit)', background: 'var(--crit-soft)', color: 'var(--crit)' }}>
          ❌ {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 rounded-[10px] px-4 py-3 text-sm" style={{ border: '1px solid var(--ok)', background: 'var(--ok-soft)', color: 'var(--ok)' }}>
          {successMessage}
        </div>
      )}

      {/* General info */}
      <div className="rounded-[14px] p-6 mb-4" style={{ background: 'var(--panel)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
        <h2 className="font-display font-bold text-[18px] mb-5" style={{ color: 'var(--text)' }}>Informations générales</h2>
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text3)' }}>Nom de la Machine *</span>
            <input type="text" name="machineLabel" value={formData.machineLabel} onChange={handleInputChange}
              placeholder="ex: Machine de sertissage, Machine de coupe…" className={iCls} style={iStyle} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text3)' }}>Sous-titre</span>
            <input type="text" name="subtitle" value={formData.subtitle} onChange={handleInputChange} className={iCls} style={iStyle} />
          </label>
        </div>
      </div>

      <TaskSection title="📅 Maintenance Mensuelle" tasks={formData.monthlyTasks} onAdd={addMonthlyTask} onChange={handleMonthlyTaskChange} onRemove={removeMonthlyTask} prefix="monthly" />
      <TaskSection title="📆 Maintenance Semi-annuelle" tasks={formData.semiannualTasks} onAdd={addSemiannualTask} onChange={handleSemiannualTaskChange} onRemove={removeSemiannualTask} prefix="semiannual" />

      <div className="flex gap-4 justify-end mb-6">
        <button onClick={() => navigate('/preventif/fiches-maintenance')}
          className="px-6 py-2.5 rounded-[10px] font-semibold transition-colors hover:bg-[var(--panel3)]"
          style={{ background: 'var(--panel2)', color: 'var(--text2)', border: '1px solid var(--border)' }}>
          Annuler
        </button>
        <button onClick={handleSaveTemplate} disabled={saving}
          className="px-6 py-2.5 rounded-[10px] font-bold text-white disabled:opacity-50 transition-transform hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))', boxShadow: '0 6px 18px var(--accent-soft)' }}>
          {saving ? 'Sauvegarde…' : '💾 Enregistrer la fiche machine'}
        </button>
      </div>
    </div>
  );
};

export default CreateMachineTemplate;
