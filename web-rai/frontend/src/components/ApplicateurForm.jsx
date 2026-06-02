import React, { useEffect, useMemo, useState } from 'react';
import { applicateurService, cosseService } from '../services/api';
import { X, Zap, Pencil, AlertCircle } from 'lucide-react';

const normalizeToolCode = (value = '') =>
  String(value ?? '').replace(/﻿/g, '').trim().replace(/\s+/g, '').toUpperCase();

const buildInitialState = (applicateur) => ({
  numero_outil:      applicateur?.numero_outil      ?? '',
  site:              applicateur?.site              ?? 'RAI',
  designation:       applicateur?.designation       ?? '',
  numero_serie:      applicateur?.numero_serie      ?? '',
  constructeur_outil:applicateur?.constructeur_outil?? '',
  statut:            applicateur?.statut            ?? 'en service',
  remarque:          applicateur?.remarque          ?? '',
});

const fieldClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-colors disabled:bg-slate-50 disabled:text-slate-400';
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500';

const ApplicateurForm = ({ applicateur, isOpen, onClose, onSuccess }) => {
  const [formData,        setFormData]        = useState(buildInitialState(applicateur));
  const [cosses,          setCosses]          = useState([]);
  const [selectedCosseId, setSelectedCosseId] = useState('');
  const [loading,         setLoading]         = useState(false);
  const [loadingOptions,  setLoadingOptions]  = useState(false);
  const [error,           setError]           = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setFormData(buildInitialState(applicateur));
    setError(null);
  }, [applicateur, isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    let cancelled = false;
    const load = async () => {
      setLoadingOptions(true);
      try {
        const cr = await cosseService.getAll();
        if (!cancelled) setCosses(Array.isArray(cr) ? cr : []);
      } catch { if (!cancelled) setCosses([]); }
      finally   { if (!cancelled) setLoadingOptions(false); }
    };
    load();
    return () => { cancelled = true; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const first = applicateur?.variants?.[0];
    if (!first || cosses.length === 0) { if (!applicateur?.id) setSelectedCosseId(''); return; }
    const match = cosses.find((c) =>
      normalizeToolCode(c.reference_tec) === normalizeToolCode(first.reference_tec) &&
      normalizeToolCode(c.reference_constructeur) === normalizeToolCode(first.reference_constructeur)
    );
    setSelectedCosseId(match ? String(match.id) : '');
  }, [applicateur, cosses, isOpen]);

  const cosseOptions = useMemo(
    () => cosses.slice().sort((a, b) => String(a.reference_tec ?? '').localeCompare(String(b.reference_tec ?? ''), 'fr', { numeric: true, sensitivity: 'base' })),
    [cosses]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // cosse link is optional — can be added later
    const payload = {
      ...formData,
      numero_outil:      formData.numero_outil.trim(),
      site:              formData.site.trim() || 'RAI',
      designation:       formData.designation.trim() || null,
      numero_serie:      formData.numero_serie.trim() || null,
      constructeur_outil:formData.constructeur_outil.trim() || null,
      statut:            formData.statut,
      remarque:          formData.remarque.trim() || null,
      ...(selectedCosseId ? { cosse_id: Number(selectedCosseId) } : {}),
    };
    try {
      if (applicateur?.id) await applicateurService.update(applicateur.id, payload);
      else                  await applicateurService.create(payload);
      onSuccess();
      onClose();
      setFormData(buildInitialState(null));
      setSelectedCosseId('');
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  const isEditing = Boolean(applicateur?.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] min-h-0 w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 flex-shrink-0"
          style={{ background: '#0f1d35', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 flex items-center justify-center flex-shrink-0">
              {isEditing ? <Pencil className="w-4 h-4 text-sky-300" /> : <Zap className="w-4 h-4 text-sky-300" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                {isEditing ? 'Modifier l\'applicateur' : 'Nouvel applicateur'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEditing ? `N° outil : ${applicateur.numero_outil}` : 'Remplissez les informations ci-dessous'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>N° Outil <span className="text-red-400">*</span></span>
              <input type="text" name="numero_outil" value={formData.numero_outil} onChange={handleChange}
                required disabled={isEditing} className={fieldClass} placeholder="ex : A1" />
            </label>
            <label className="block">
              <span className={labelClass}>Site</span>
              <input type="text" name="site" value={formData.site} onChange={handleChange}
                className={fieldClass} placeholder="ex : RAI" />
            </label>
          </div>

          <label className="block">
            <span className={labelClass}>Désignation</span>
            <input type="text" name="designation" value={formData.designation} onChange={handleChange}
              className={fieldClass} placeholder="Désignation de l'outil" />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>N° Série</span>
              <input type="text" name="numero_serie" value={formData.numero_serie} onChange={handleChange}
                className={fieldClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Constructeur</span>
              <input type="text" name="constructeur_outil" value={formData.constructeur_outil} onChange={handleChange}
                className={fieldClass} />
            </label>
          </div>

          <label className="block">
            <span className={labelClass}>Statut</span>
            <select name="statut" value={formData.statut} onChange={handleChange} className={fieldClass}>
              <option value="en service">En service</option>
              <option value="hors service">Hors service</option>
              <option value="à vérifier">À vérifier</option>
            </select>
          </label>

          <div>
            <span className={labelClass}>Cosse associée <span className="text-slate-400 normal-case font-normal">(optionnel)</span></span>
            <select value={selectedCosseId} onChange={(e) => setSelectedCosseId(e.target.value)}
              className={fieldClass} disabled={loadingOptions}>
              <option value="">{loadingOptions ? 'Chargement…' : 'Sélectionner une cosse'}</option>
              {cosseOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.reference_tec} • {c.reference_constructeur} • {c.designation_tec || 'Sans désignation'}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-slate-400">
              {loadingOptions ? 'Chargement…' : `${cosseOptions.length} cosse(s) disponible(s)`}
            </p>
          </div>

          <label className="block">
            <span className={labelClass}>Remarque</span>
            <textarea name="remarque" value={formData.remarque} onChange={handleChange} rows={3}
              className={fieldClass + ' resize-none'} placeholder="Notes et remarques…" />
          </label>

          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50"
              style={{ background: loading ? '#94a3b8' : 'linear-gradient(135deg, #0ea5e9, #0369a1)' }}>
              {loading ? 'Sauvegarde…' : isEditing ? 'Enregistrer les modifications' : 'Créer l\'applicateur'}
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

export default ApplicateurForm;
