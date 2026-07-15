import React, { useEffect, useMemo, useState } from 'react';
import { equipementService, fabricantService, zoneService, machineTemplateService } from '../services/api';
import { X, Plus, Trash2, AlertCircle, Pencil, Package } from 'lucide-react';

const normalizeText = (value = '') =>
  String(value ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

const normalizeFormValue = (value) => String(value ?? '').replace(/﻿/g, '').trim();

const PDR_PIECE_OPTIONS = [
  { value: 'lame_cuivre',    label: 'Lame cuivre' },
  { value: 'lame_isolant',   label: 'Lame isolant' },
  { value: 'enclume_cuivre', label: 'Enclume cuivre' },
  { value: 'enclume_isolant',label: 'Enclume isolant' },
  { value: 'lame_denudage',  label: 'Lame de dénudage' },
];

const createEmptyPdrPiece = () => ({ code: '', reference: '', quantity: '' });

const buildPdrPieces = (equipement) =>
  Object.entries(equipement?.pdr_details ?? {}).map(([code, details]) => ({
    code,
    reference: details?.reference ?? '',
    quantity:  details?.quantity  ?? '',
  }));

const buildInitialState = (equipement, defaultCategory) => ({
  code_rai:            equipement?.code_rai            ?? '',
  designation:         equipement?.designation         ?? '',
  numero_serie:        equipement?.numero_serie        ?? '',
  date_acquisition:    equipement?.date_acquisition    ?? '',
  categorie:           equipement?.categorie           ?? defaultCategory ?? 'equipement',
  statut:              equipement?.statut              ?? 'En service',
  zone_id:             String(equipement?.zone_id      ?? equipement?.Zone?.id      ?? ''),
  fabricant_id:        String(equipement?.fabricant_id ?? equipement?.Fabricant?.id ?? ''),
  machine_template_id: String(equipement?.machine_template_id ?? equipement?.MachineTemplate?.id ?? ''),
  remarque:            equipement?.remarque            ?? '',
});

// ── Shared field styles ────────────────────────────────────
const fieldClass = 'w-full rounded-[10px] px-4 py-2.5 text-sm outline-none transition-colors';
const fieldStyle = { background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--text)' };
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em]';

// ── EquipementForm ─────────────────────────────────────────
const EquipementForm = ({
  equipement, isOpen, onClose, onSuccess,
  defaultCategory = 'equipement', defaultZoneName = '',
}) => {
  const [formData,       setFormData]       = useState(buildInitialState(equipement, defaultCategory));
  const [pdrPieces,      setPdrPieces]      = useState(() => buildPdrPieces(equipement));
  const [zones,          setZones]          = useState([]);
  const [fabricants,     setFabricants]     = useState([]);
  const [templates,      setTemplates]      = useState([]);
  const [loading,        setLoading]        = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [error,          setError]          = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setFormData(buildInitialState(equipement, defaultCategory));
    setPdrPieces(buildPdrPieces(equipement));
    setError('');
  }, [equipement, defaultCategory, isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    let cancelled = false;
    const load = async () => {
      setLoadingOptions(true);
      try {
        const [zr, fr, tr] = await Promise.all([zoneService.getAll(), fabricantService.getAll(), machineTemplateService.getAll()]);
        if (!cancelled) {
          setZones(Array.isArray(zr?.data) ? zr.data : []);
          setFabricants(Array.isArray(fr?.data) ? fr.data : []);
          setTemplates(Array.isArray(tr) ? tr : []);
        }
      } catch {
        if (!cancelled) { setZones([]); setFabricants([]); setTemplates([]); }
      } finally {
        if (!cancelled) setLoadingOptions(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || equipement?.id || !defaultZoneName || zones.length === 0) return;
    const norm = normalizeText(defaultZoneName);
    const match = zones.find((z) => normalizeText(z.nom_zone) === norm);
    if (match) setFormData((prev) => ({ ...prev, zone_id: String(match.id) }));
  }, [defaultZoneName, equipement?.id, isOpen, zones]);

  const fabricantOptions = useMemo(
    () => fabricants.slice().sort((a, b) => String(a.nom ?? '').localeCompare(String(b.nom ?? ''), 'fr', { numeric: true, sensitivity: 'base' })),
    [fabricants]
  );
  const zoneOptions = useMemo(
    () => zones.slice().sort((a, b) => String(a.nom_zone ?? '').localeCompare(String(b.nom_zone ?? ''), 'fr', { numeric: true, sensitivity: 'base' })),
    [zones]
  );
  const zoneGroups = useMemo(() => {
    const groups = {};
    const rootZones = [];
    zoneOptions.forEach((zone) => {
      if (zone.parent_id) {
        const parentName = zones.find((z) => z.id === zone.parent_id)?.nom_zone || 'Autres';
        if (!groups[parentName]) groups[parentName] = [];
        groups[parentName].push(zone);
      } else {
        rootZones.push(zone);
      }
    });
    return { rootZones, groups };
  }, [zoneOptions, zones]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePdrChange = (index, field, value) =>
    setPdrPieces((prev) => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));

  const addPdrPiece = () => setPdrPieces((prev) => [...prev, createEmptyPdrPiece()]);
  const removePdrPiece = (index) => setPdrPieces((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const cleanedCode = normalizeFormValue(formData.code_rai);
    const cleanedDes  = normalizeFormValue(formData.designation);
    if (!cleanedCode || !cleanedDes) {
      setLoading(false);
      setError('Le code RAI et la désignation sont obligatoires.');
      return;
    }

    let pdrDetails;
    if (formData.categorie === 'pdr') {
      const next = {};
      for (const piece of pdrPieces) {
        const code = normalizeFormValue(piece.code);
        const ref  = normalizeFormValue(piece.reference);
        const qty  = normalizeFormValue(piece.quantity);
        if (!code && !ref && !qty) continue;
        if (!code) { setLoading(false); setError('Chaque pièce PDR doit avoir une clé.'); return; }
        if (next[code]) { setLoading(false); setError('Chaque pièce PDR doit avoir une clé unique.'); return; }
        next[code] = { reference: ref || null, quantity: qty || null };
      }
      pdrDetails = next;
    }

    const payload = {
      code_rai:            cleanedCode,
      designation:         cleanedDes,
      numero_serie:        normalizeFormValue(formData.numero_serie) || null,
      date_acquisition:    normalizeFormValue(formData.date_acquisition) || null,
      categorie:           formData.categorie,
      statut:              formData.statut,
      zone_id:             formData.zone_id             ? Number(formData.zone_id)             : null,
      fabricant_id:        formData.fabricant_id        ? Number(formData.fabricant_id)        : null,
      machine_template_id: formData.machine_template_id ? Number(formData.machine_template_id) : null,
      remarque:            normalizeFormValue(formData.remarque) || null,
      ...(pdrDetails !== undefined ? { pdr_details: pdrDetails } : {}),
    };

    try {
      if (equipement?.id) await equipementService.update(equipement.id, payload);
      else                 await equipementService.create(payload);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isEditing = Boolean(equipement?.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] min-h-0 w-full max-w-2xl flex-col overflow-hidden rounded-[18px] shadow-2xl" style={{ background: 'var(--panel)' }}>

        {/* ── Modal header ── */}
        <div
          className="flex items-start justify-between gap-4 px-6 py-5 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #0d1828, #0a2820)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-soft)' }}>
              {isEditing ? <Pencil className="w-4 h-4" style={{ color: 'var(--accent3)' }} /> : <Package className="w-4 h-4" style={{ color: 'var(--accent3)' }} />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                {isEditing ? 'Modifier l\'équipement' : 'Nouvel équipement'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEditing ? `Code : ${equipement.code_rai}` : 'Remplissez les informations ci-dessous'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5">

          {error && (
            <div className="flex items-start gap-2.5 rounded-[10px] px-4 py-3 text-sm"
              style={{ border: '1px solid var(--crit)', background: 'var(--crit-soft)', color: 'var(--crit)' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Row 1 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass} style={{ color: 'var(--text3)' }}>Code RAI <span style={{ color: 'var(--crit)' }}>*</span></span>
              <input
                type="text" name="code_rai" value={formData.code_rai}
                onChange={handleChange} required className={fieldClass} style={fieldStyle}
                placeholder="ex : EQUIP999"
              />
            </label>
            <label className="block">
              <span className={labelClass} style={{ color: 'var(--text3)' }}>Catégorie</span>
              <select name="categorie" value={formData.categorie} onChange={handleChange} className={fieldClass} style={fieldStyle}>
                <option value="equipement">Équipement</option>
                <option value="pdr">PDR</option>
                <option value="fer-a-souder">Fer à souder</option>
                <option value="bain-creuset">Bain creuset</option>
                {formData.categorie === 'fer-et-bain' && <option value="fer-et-bain">Fer et bain (ancien)</option>}
              </select>
            </label>
          </div>

          {/* Désignation full width */}
          <label className="block">
            <span className={labelClass} style={{ color: 'var(--text3)' }}>Désignation <span style={{ color: 'var(--crit)' }}>*</span></span>
            <input
              type="text" name="designation" value={formData.designation}
              onChange={handleChange} required className={fieldClass} style={fieldStyle}
              placeholder="ex : Bain creuset"
            />
          </label>

          {/* Row 2 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass} style={{ color: 'var(--text3)' }}>Fabricant</span>
              <select name="fabricant_id" value={formData.fabricant_id} onChange={handleChange} className={fieldClass} style={fieldStyle} disabled={loadingOptions}>
                <option value="">{loadingOptions ? 'Chargement…' : 'Aucun fabricant'}</option>
                {fabricantOptions.map((f) => <option key={f.id} value={f.id}>{f.nom}</option>)}
              </select>
            </label>
            <label className="block">
              <span className={labelClass} style={{ color: 'var(--text3)' }}>Zone</span>
              <select name="zone_id" value={formData.zone_id} onChange={handleChange} className={fieldClass} style={fieldStyle} disabled={loadingOptions}>
                <option value="">{loadingOptions ? 'Chargement…' : 'Aucune zone'}</option>
                {zoneGroups.rootZones
                  .filter((z) => !z.subzones?.length)
                  .map((z) => <option key={z.id} value={z.id}>{z.nom_zone}</option>)}
                {Object.entries(zoneGroups.groups).map(([groupName, groupZones]) => (
                  <optgroup key={groupName} label={groupName}>
                    {groupZones.map((z) => <option key={z.id} value={z.id}>{z.nom_zone}</option>)}
                  </optgroup>
                ))}
              </select>
            </label>
          </div>

          {/* Row 3 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass} style={{ color: 'var(--text3)' }}>N° Série</span>
              <input
                type="text" name="numero_serie" value={formData.numero_serie}
                onChange={handleChange} className={fieldClass} style={fieldStyle} placeholder="Numéro de série"
              />
            </label>
            <label className="block">
              <span className={labelClass} style={{ color: 'var(--text3)' }}>Date d'acquisition</span>
              <input
                type="date" name="date_acquisition" value={formData.date_acquisition}
                onChange={handleChange} className={fieldClass} style={fieldStyle}
              />
            </label>
          </div>

          {/* Statut */}
          <label className="block">
            <span className={labelClass} style={{ color: 'var(--text3)' }}>Statut</span>
            <select name="statut" value={formData.statut} onChange={handleChange} className={fieldClass} style={fieldStyle}>
              <option value="En service">En service</option>
              <option value="Hors service">Hors service</option>
              <option value="En maintenance">En maintenance</option>
            </select>
          </label>

          {/* Fiche de maintenance */}
          {formData.categorie !== 'pdr' && formData.categorie !== 'fer-a-souder' && formData.categorie !== 'bain-creuset' && formData.categorie !== 'fer-et-bain' && (
            <label className="block">
              <span className={labelClass} style={{ color: 'var(--text3)' }}>Fiche de maintenance associée</span>
              <select name="machine_template_id" value={formData.machine_template_id} onChange={handleChange} className={fieldClass} style={fieldStyle} disabled={loadingOptions}>
                <option value="">Aucune fiche</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>{t.machineLabel}</option>
                ))}
              </select>
            </label>
          )}

          {/* PDR details */}
          {formData.categorie === 'pdr' && (
            <div className="rounded-[10px] p-4 space-y-3" style={{ border: '1px solid var(--border)', background: 'var(--panel2)' }}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className={labelClass} style={{ color: 'var(--text3)' }}>Détails PDR</p>
                  <p className="text-xs" style={{ color: 'var(--text3)' }}>Ajoutez chaque pièce de rechange avec sa référence et quantité.</p>
                </div>
                <button type="button" onClick={addPdrPiece}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[8px] text-xs font-bold text-white transition-transform hover:-translate-y-0.5 flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent2))' }}>
                  <Plus className="w-3.5 h-3.5" /> Ajouter
                </button>
              </div>

              {pdrPieces.length === 0 ? (
                <div className="rounded-[8px] px-4 py-4 text-xs text-center"
                  style={{ border: '1px dashed var(--border)', background: 'var(--panel)', color: 'var(--text3)' }}>
                  Aucune pièce ajoutée. Cliquez sur «&nbsp;Ajouter&nbsp;» pour commencer.
                </div>
              ) : (
                <div className="space-y-2">
                  {pdrPieces.map((piece, index) => (
                    <div key={`${piece.code || 'piece'}-${index}`}
                      className="grid gap-2 rounded-[8px] p-3 sm:grid-cols-[1.2fr_2fr_1fr_auto] sm:items-end"
                      style={{ border: '1px solid var(--border)', background: 'var(--panel)' }}>
                      <label className="block">
                        <span className={labelClass} style={{ color: 'var(--text3)' }}>Pièce</span>
                        <select value={piece.code} onChange={(e) => handlePdrChange(index, 'code', e.target.value)}
                          className={fieldClass} style={fieldStyle}>
                          <option value="">Choisir…</option>
                          {PDR_PIECE_OPTIONS.map((o) => <option key={o.value} value={o.value} style={{ color: '#000' }}>{o.label}</option>)}
                        </select>
                      </label>
                      <label className="block">
                        <span className={labelClass} style={{ color: 'var(--text3)' }}>Référence</span>
                        <input type="text" value={piece.reference} placeholder="Référence pièce"
                          onChange={(e) => handlePdrChange(index, 'reference', e.target.value)}
                          className={fieldClass} style={fieldStyle} />
                      </label>
                      <label className="block">
                        <span className={labelClass} style={{ color: 'var(--text3)' }}>Quantité</span>
                        <input type="number" min="0" step="any" value={piece.quantity} placeholder="0"
                          onChange={(e) => handlePdrChange(index, 'quantity', e.target.value)}
                          className={fieldClass} style={fieldStyle} />
                      </label>
                      <button type="button" onClick={() => removePdrPiece(index)}
                        className="self-end h-[38px] px-3 rounded-[8px] text-xs font-semibold transition-colors hover:bg-[var(--crit-soft)] hover:text-[var(--crit)] flex items-center gap-1"
                        style={{ border: '1px solid var(--border)', color: 'var(--text3)' }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Remarque */}
          <label className="block">
            <span className={labelClass} style={{ color: 'var(--text3)' }}>Remarque</span>
            <textarea name="remarque" value={formData.remarque} onChange={handleChange} rows={3}
              className={fieldClass + ' resize-none'} style={fieldStyle}
              placeholder="Commentaires, état, observation…" />
          </label>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-[10px] text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:-translate-y-0.5"
              style={{ background: loading ? 'var(--text3)' : 'linear-gradient(135deg, var(--accent3), var(--accent2))', boxShadow: '0 6px 18px var(--accent-soft)' }}>
              {loading ? 'Sauvegarde en cours…' : isEditing ? 'Enregistrer les modifications' : 'Créer l\'équipement'}
            </button>
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-[10px] text-sm font-semibold transition-colors hover:bg-[var(--panel3)]"
              style={{ border: '1px solid var(--border)', color: 'var(--text2)' }}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipementForm;
