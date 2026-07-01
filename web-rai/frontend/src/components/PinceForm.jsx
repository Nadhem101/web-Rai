import React, { useEffect, useMemo, useState } from 'react';
import { cosseService, fabricantService, pinceService } from '../services/api';
import { X, Wrench, Pencil, AlertCircle } from 'lucide-react';

const normalizeToolCode = (value = '') =>
  String(value ?? '').replace(/﻿/g, '').trim().replace(/\s+/g, '').toUpperCase();

const normalizeSearchValue = (value = '') =>
  String(value ?? '').replace(/﻿/g, '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

const buildCosseLabel = (cosse) =>
  `${cosse.reference_tec || ''} • ${cosse.reference_constructeur || ''} • ${cosse.designation_tec || 'Sans désignation'}`;

const buildInitialState = (pince) => ({
  numero_pince:     pince?.numero_pince     ?? '',
  reference_pince:  pince?.reference_pince  ?? '',
  date_verification:pince?.date_verification?? '',
  fabricant_nom:    pince?.Fabricant?.nom   ?? '',
  statut:           pince?.statut           ?? 'À vérifier',
  remarque:         pince?.remarque         ?? '',
});

const fieldClass = 'w-full rounded-[10px] px-4 py-2.5 text-sm outline-none transition-colors';
const fieldStyle = { background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--text)' };
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em]';

const PinceForm = ({ pince, isOpen, onClose, onSuccess }) => {
  const [formData,       setFormData]       = useState(buildInitialState(pince));
  const [fabricants,     setFabricants]     = useState([]);
  const [cosses,         setCosses]         = useState([]);
  const [selectedCosseId, setSelectedCosseId] = useState('');
  const [cosseSearch,    setCosseSearch]    = useState('');
  const [loading,        setLoading]        = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [error,          setError]          = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setFormData(buildInitialState(pince));
    setError(null);
    setCosseSearch('');
  }, [pince, isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    let cancelled = false;
    const load = async () => {
      setLoadingOptions(true);
      try {
        const [fr, cr] = await Promise.all([fabricantService.getAll(), cosseService.getAll()]);
        if (!cancelled) {
          setFabricants(Array.isArray(fr?.data) ? fr.data : []);
          setCosses(Array.isArray(cr) ? cr : []);
        }
      } catch { if (!cancelled) { setFabricants([]); setCosses([]); } }
      finally   { if (!cancelled) setLoadingOptions(false); }
    };
    load();
    return () => { cancelled = true; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const first = pince?.variants?.[0];
    if (!first || cosses.length === 0) {
      if (!pince?.id) { setSelectedCosseId(''); setCosseSearch(''); }
      return;
    }
    const match = cosses.find((c) =>
      normalizeToolCode(c.reference_tec) === normalizeToolCode(first.reference_tec) &&
      normalizeToolCode(c.reference_constructeur) === normalizeToolCode(first.reference_constructeur)
    );
    if (match) { setCosseSearch(buildCosseLabel(match)); setSelectedCosseId(String(match.id)); }
    else if (!pince?.id) { setSelectedCosseId(''); setCosseSearch(''); }
  }, [cosses, isOpen, pince]);

  const fabricantOptions = useMemo(
    () => fabricants.slice().sort((a, b) => String(a.nom ?? '').localeCompare(String(b.nom ?? ''), 'fr', { numeric: true, sensitivity: 'base' })),
    [fabricants]
  );
  const cosseOptions = useMemo(
    () => cosses.slice().sort((a, b) => buildCosseLabel(a).localeCompare(buildCosseLabel(b), 'fr', { numeric: true, sensitivity: 'base' })),
    [cosses]
  );
  const filteredCosseOptions = useMemo(() => {
    const q = normalizeSearchValue(cosseSearch);
    if (!q) return cosseOptions.slice(0, 20);
    return cosseOptions.filter((c) =>
      normalizeSearchValue(buildCosseLabel(c)).includes(q) ||
      normalizeSearchValue(c.reference_tec).includes(q) ||
      normalizeSearchValue(c.reference_constructeur).includes(q) ||
      normalizeSearchValue(c.designation_tec).includes(q)
    ).slice(0, 20);
  }, [cosseOptions, cosseSearch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCosseSearchChange = (e) => {
    const { value } = e.target;
    setCosseSearch(value);
    const exact = cosseOptions.find((c) => buildCosseLabel(c) === value);
    setSelectedCosseId(exact ? String(exact.id) : '');
  };

  const handleCossePick = (cosse) => {
    setCosseSearch(buildCosseLabel(cosse));
    setSelectedCosseId(String(cosse.id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload = {
      ...formData,
      numero_pince:     formData.numero_pince.trim(),
      reference_pince:  formData.reference_pince.trim() || null,
      date_verification:formData.date_verification || null,
      fabricant_nom:    formData.fabricant_nom.trim() || null,
      statut:           formData.statut,
      remarque:         formData.remarque.trim() || null,
      ...(selectedCosseId ? { cosse_id: Number(selectedCosseId) } : {}),
    };
    try {
      if (pince?.id) await pinceService.update(pince.id, payload);
      else           await pinceService.create(payload);
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
  const isEditing = Boolean(pince?.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] min-h-0 w-full max-w-2xl flex-col overflow-hidden rounded-[18px] shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 flex-shrink-0"
          style={{ background: '#0f1d35', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 flex items-center justify-center flex-shrink-0">
              {isEditing ? <Pencil className="w-4 h-4 text-sky-300" /> : <Wrench className="w-4 h-4 text-sky-300" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                {isEditing ? 'Modifier la pince' : 'Nouvelle pince'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEditing ? `N° ${pince.numero_pince}` : 'Remplissez les informations ci-dessous'}
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

          <label className="block">
            <span className={labelClass} style={{ color: 'var(--text3)' }}>N° Pince <span className="text-red-400">*</span></span>
            <input type="text" name="numero_pince" value={formData.numero_pince} onChange={handleChange}
              required disabled={isEditing} className={fieldClass} style={fieldStyle} placeholder="ex : P01+P02" />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass} style={{ color: 'var(--text3)' }}>Fabricant</span>
              <input type="text" name="fabricant_nom" list="pince-fabricant-opts"
                value={formData.fabricant_nom} onChange={handleChange}
                className={fieldClass} style={fieldStyle} placeholder="Saisir ou choisir un fabricant" />
              <datalist id="pince-fabricant-opts">
                {fabricantOptions.map((f) => <option key={f.id} value={f.nom} />)}
              </datalist>
              <p className="mt-1 text-[11px] text-slate-400">Existant ou nouveau fabricant</p>
            </label>

            <label className="block">
              <span className={labelClass} style={{ color: 'var(--text3)' }}>Référence pince</span>
              <input type="text" name="reference_pince" value={formData.reference_pince}
                onChange={handleChange} className={fieldClass} style={fieldStyle} placeholder="ex : 539 773-2A" />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass} style={{ color: 'var(--text3)' }}>Date de vérification</span>
              <input type="date" name="date_verification" value={formData.date_verification}
                onChange={handleChange} className={fieldClass} style={fieldStyle} />
            </label>

            <div>
              <span className={labelClass} style={{ color: 'var(--text3)' }}>Cosse associée <span className="text-slate-400 normal-case font-normal">(optionnel)</span></span>
              <input type="text" value={cosseSearch} onChange={handleCosseSearchChange}
                list="pince-cosse-opts" className={fieldClass} style={fieldStyle}
                placeholder="Tapez une référence TEC ou constructeur…" />
              <datalist id="pince-cosse-opts">
                {cosseOptions.map((c) => <option key={c.id} value={buildCosseLabel(c)} />)}
              </datalist>
              <p className="mt-1 text-[11px] text-slate-400">
                {loadingOptions ? 'Chargement…' : `${filteredCosseOptions.length} résultat(s) sur ${cosseOptions.length}`}
              </p>
              {cosseSearch && filteredCosseOptions.length > 0 && (
                <div className="mt-1.5 max-h-36 overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                  {filteredCosseOptions.map((c) => (
                    <button key={c.id} type="button" onClick={() => handleCossePick(c)}
                      className="flex w-full items-start justify-between px-3 py-2 text-left text-xs text-slate-700 hover:bg-sky-50 transition-colors border-b border-slate-50 last:border-0">
                      <span>{buildCosseLabel(c)}</span>
                      <span className="ml-3 shrink-0 text-slate-400">#{c.id}</span>
                    </button>
                  ))}
                </div>
              )}
              {cosseSearch && !selectedCosseId && (
                <p className="mt-1 text-[11px] text-amber-600">Aucune cosse correspondante sélectionnée — la pince sera créée sans lien cosse.</p>
              )}
            </div>
          </div>

          <label className="block">
            <span className={labelClass} style={{ color: 'var(--text3)' }}>Statut</span>
            <select name="statut" value={formData.statut} onChange={handleChange} className={fieldClass} style={fieldStyle}>
              <option value="En service">En service</option>
              <option value="Hors service">Hors service</option>
              <option value="À vérifier">À vérifier</option>
              <option value="Manque cosse">Manque cosse</option>
              <option value="Vérification visuelle">Vérification visuelle</option>
            </select>
          </label>

          <label className="block">
            <span className={labelClass} style={{ color: 'var(--text3)' }}>Remarque</span>
            <textarea name="remarque" value={formData.remarque} onChange={handleChange} rows={3}
              className={fieldClass + ' resize-none'} placeholder="Notes et remarques…" />
          </label>

          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50"
              style={{ background: loading ? 'var(--text3)' : 'linear-gradient(135deg, var(--accent3), var(--accent2))' }}>
              {loading ? 'Sauvegarde…' : isEditing ? 'Enregistrer les modifications' : 'Créer la pince'}
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

export default PinceForm;
