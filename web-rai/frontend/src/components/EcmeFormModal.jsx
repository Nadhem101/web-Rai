import React, { useState, useEffect } from 'react';
import { ecmeService } from '../services/api';
import { X, FlaskConical, AlertCircle, Save } from 'lucide-react';

const ALERTE_OPTIONS = [
  { value: 'VALABLE',      label: '🟢 Valable' },
  { value: 'VERIFICATION', label: '🔴 À vérifier' },
  { value: 'EXEMPTE',      label: '⚪ Exempté' },
  { value: 'DECLASSE',     label: '⚫ Déclassé' },
];

const VERIF_TYPE_OPTIONS = ['Interne', 'Externe', 'IP', 'Exempté'];

const emptyForm = () => ({
  code:                      '',
  designation:               '',
  marque:                    '',
  n_serie:                   '',
  affectation:               '',
  necessite_verification:    true,
  verif_type:                '',
  alerte:                    'VALABLE',
  date_derniere_verification:'',
  date_prochaine_verification:'',
  date_alerte:               '',
  remarques:                 '',
});

const toInputDate = (val) => {
  if (!val) return '';
  const d = new Date(val);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
};

const toNullable = (val) => (!val || val === '') ? null : val;

/**
 * EcmeFormModal — create or edit an ECME record.
 *
 * Props:
 *   ecme      — existing record (null = create mode)
 *   isOpen    — boolean
 *   onClose   — called when modal should close
 *   onSuccess — called after successful save (with saved record)
 */
const EcmeFormModal = ({ ecme, isOpen, onClose, onSuccess }) => {
  const isEdit = Boolean(ecme?.code);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (isEdit) {
      setForm({
        code:                       ecme.code || '',
        designation:                ecme.designation || '',
        marque:                     ecme.marque || '',
        n_serie:                    ecme.n_serie || '',
        affectation:                ecme.affectation || '',
        necessite_verification:     ecme.necessite_verification ?? true,
        verif_type:                 ecme.verif_type || '',
        alerte:                     ecme.alerte || 'VALABLE',
        date_derniere_verification: toInputDate(ecme.date_derniere_verification),
        date_prochaine_verification:toInputDate(ecme.date_prochaine_verification),
        date_alerte:                toInputDate(ecme.date_alerte),
        remarques:                  ecme.remarques || '',
      });
    } else {
      setForm(emptyForm());
    }
    setError('');
  }, [isOpen, ecme]);

  if (!isOpen) return null;

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code.trim()) { setError('Le code ECME est obligatoire.'); return; }
    if (!form.designation.trim()) { setError('La désignation est obligatoire.'); return; }

    try {
      setSaving(true);
      setError('');
      const payload = {
        code:                       form.code.toUpperCase().replace(/\s+/g, ''),
        designation:                form.designation.trim(),
        marque:                     toNullable(form.marque),
        n_serie:                    toNullable(form.n_serie),
        affectation:                toNullable(form.affectation),
        necessite_verification:     form.necessite_verification,
        verif_type:                 toNullable(form.verif_type),
        alerte:                     form.alerte,
        date_derniere_verification: toNullable(form.date_derniere_verification),
        date_prochaine_verification:toNullable(form.date_prochaine_verification),
        date_alerte:                toNullable(form.date_alerte),
        remarques:                  toNullable(form.remarques),
      };

      let result;
      if (isEdit) {
        const { data } = await ecmeService.update(ecme.code, payload);
        result = data;
      } else {
        const { data } = await ecmeService.create(payload);
        result = data;
      }
      onSuccess?.(result);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, children, col = 1 }) => (
    <label className={`block ${col === 2 ? 'md:col-span-2' : ''}`}>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">{label}</span>
      {children}
    </label>
  );

  const inputCls = 'w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 flex-shrink-0"
          style={{ background: '#0f1d35', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <FlaskConical className="w-4 h-4 text-blue-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                {isEdit ? `Modifier — ${ecme.code}` : 'Nouvel ECME'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEdit ? 'Modifier les informations et les dates de vérification' : 'Créer un nouvel équipement de mesure'}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">

            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Section: Identification */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Identification</p>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Code ECME *">
                  <input type="text" value={form.code} onChange={e => set('code', e.target.value)}
                    placeholder="ex: ECME317"
                    disabled={isEdit}
                    className={`${inputCls} ${isEdit ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : ''}`} />
                </Field>
                <Field label="Désignation *">
                  <input type="text" value={form.designation} onChange={e => set('designation', e.target.value)}
                    placeholder="ex: Multimètre numérique"
                    className={inputCls} />
                </Field>
                <Field label="Marque / Modèle">
                  <input type="text" value={form.marque} onChange={e => set('marque', e.target.value)}
                    placeholder="ex: FLUKE"
                    className={inputCls} />
                </Field>
                <Field label="N° de série">
                  <input type="text" value={form.n_serie} onChange={e => set('n_serie', e.target.value)}
                    placeholder="ex: 74840401"
                    className={inputCls} />
                </Field>
                <Field label="Affectation (zone)">
                  <input type="text" value={form.affectation} onChange={e => set('affectation', e.target.value)}
                    placeholder="ex: Electronique, Maintenance…"
                    className={inputCls} />
                </Field>
                <Field label="Type de vérification">
                  <select value={form.verif_type} onChange={e => set('verif_type', e.target.value)}
                    className={inputCls}>
                    <option value="">— Choisir —</option>
                    {VERIF_TYPE_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </Field>
              </div>
            </div>

            {/* Section: Statut */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Statut & Vérification</p>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Statut alerte">
                  <select value={form.alerte} onChange={e => set('alerte', e.target.value)}
                    className={inputCls}>
                    {ALERTE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </Field>
                <Field label="Nécessite vérification">
                  <div className="flex items-center gap-3 h-[38px]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={form.necessite_verification === true}
                        onChange={() => set('necessite_verification', true)}
                        className="accent-blue-500" />
                      <span className="text-sm text-slate-700">Oui</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={form.necessite_verification === false}
                        onChange={() => set('necessite_verification', false)}
                        className="accent-blue-500" />
                      <span className="text-sm text-slate-700">Non</span>
                    </label>
                  </div>
                </Field>
              </div>
            </div>

            {/* Section: Dates — this is the key part for the maintenance director */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Dates de vérification</p>
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Dernière vérification">
                  <input type="date" value={form.date_derniere_verification}
                    onChange={e => set('date_derniere_verification', e.target.value)}
                    className={inputCls} />
                </Field>
                <Field label="Prochaine vérification">
                  <input type="date" value={form.date_prochaine_verification}
                    onChange={e => set('date_prochaine_verification', e.target.value)}
                    className={inputCls} />
                </Field>
                <Field label="Date d'alerte">
                  <input type="date" value={form.date_alerte}
                    onChange={e => set('date_alerte', e.target.value)}
                    className={inputCls} />
                </Field>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Entrez la date de retour du fabricant comme "Dernière vérification" et la date indiquée sur le rapport comme "Prochaine vérification".
              </p>
            </div>

            {/* Section: Remarques */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Remarques</p>
              <textarea value={form.remarques} onChange={e => set('remarques', e.target.value)}
                rows={3} placeholder="Notes, observations…"
                className={`${inputCls} resize-none`} />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-6 pb-6">
            <button type="submit" disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-colors"
              style={{ background: saving ? '#94a3b8' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
              <Save className="w-4 h-4" />
              {saving ? 'Sauvegarde…' : isEdit ? 'Enregistrer les modifications' : 'Créer l\'ECME'}
            </button>
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EcmeFormModal;
