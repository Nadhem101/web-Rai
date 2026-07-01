import React, { useEffect, useMemo, useState } from 'react';
import { applicateurService, cosseService, pinceService } from '../services/api';
import { X, Link2, Pencil, AlertCircle, Plus, Trash2 } from 'lucide-react';

const HEADER_INITIAL = {
  reference_constructeur: '',
  reference_tec:          '',
  designation_tec:        '',
  outillage:              '',
};

const EMPTY_ROW = () => ({
  section_awg:          '',
  section_mm2:          '',
  tenue_traction_n:     '',
  longueur_denudage_mm: '',
  observation:          '',
});

const normalizeToolCode = (value = '') =>
  String(value ?? '').replace(/﻿/g, '').trim().replace(/\s+/g, '').toUpperCase();

const fieldClass = 'w-full rounded-[10px] px-4 py-2.5 text-sm outline-none transition-colors';
const fieldStyle = { background: 'var(--panel2)', border: '1px solid var(--border)', color: 'var(--text)' };
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em]';
const cellClass  = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-100 transition-colors';

const CosseForm = ({ cosse, isOpen, onClose, onSuccess }) => {
  const isEditing = Boolean(cosse?.id);

  const [header,            setHeader]            = useState(HEADER_INITIAL);
  const [rows,              setRows]              = useState([]);   // for create: multiple rows
  const [singleRow,         setSingleRow]         = useState(EMPTY_ROW()); // for edit: single row
  const [loading,           setLoading]           = useState(false);
  const [error,             setError]             = useState(null);
  const [toolSuggestions,   setToolSuggestions]   = useState([]);
  const [loadingSuggestions,setLoadingSuggestions] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    if (cosse) {
      setHeader({
        reference_constructeur: cosse.reference_constructeur ?? '',
        reference_tec:          cosse.reference_tec          ?? '',
        designation_tec:        cosse.designation_tec        ?? '',
        outillage:              cosse.outillage              ?? '',
      });
      setSingleRow({
        section_awg:          cosse.section_awg          ?? '',
        section_mm2:          cosse.section_mm2          ?? '',
        tenue_traction_n:     cosse.tenue_traction_n     ?? '',
        longueur_denudage_mm: cosse.longueur_denudage_mm ?? '',
        observation:          cosse.observation          ?? '',
      });
      setRows([]);
    } else {
      setHeader(HEADER_INITIAL);
      setSingleRow(EMPTY_ROW());
      setRows([]);
    }
  }, [cosse, isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    let cancelled = false;
    const load = async () => {
      setLoadingSuggestions(true);
      try {
        const [pr, ar] = await Promise.all([pinceService.getAll(), applicateurService.getAll()]);
        const pinces      = Array.isArray(pr?.data) ? pr.data : [];
        const applicateurs = Array.isArray(ar)       ? ar      : [];
        const suggestions = [];
        const seen = new Set();
        const add = (v) => {
          const label = String(v ?? '').trim();
          const norm  = normalizeToolCode(label);
          if (!norm || seen.has(norm)) return;
          seen.add(norm);
          suggestions.push(label);
        };
        pinces.forEach((p) => add(p.numero_pince));
        applicateurs.forEach((a) => add(a.numero_outil));
        suggestions.sort((a, b) => a.localeCompare(b, 'fr', { numeric: true, sensitivity: 'base' }));
        if (!cancelled) setToolSuggestions(suggestions);
      } catch { if (!cancelled) setToolSuggestions([]); }
      finally   { if (!cancelled) setLoadingSuggestions(false); }
    };
    load();
    return () => { cancelled = true; };
  }, [isOpen]);

  const toolSuggestionMap = useMemo(
    () => new Map(toolSuggestions.map((v) => [normalizeToolCode(v), v])),
    [toolSuggestions]
  );

  const outillageWarning = !loadingSuggestions &&
    toolSuggestionMap.size > 0 &&
    header.outillage.trim() &&
    !toolSuggestionMap.has(normalizeToolCode(header.outillage));

  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setHeader((prev) => ({ ...prev, [name]: value }));
  };

  const handleSingleRowChange = (e) => {
    const { name, value } = e.target;
    setSingleRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (index, field, value) =>
    setRows((prev) => prev.map((r, i) => i === index ? { ...r, [field]: value } : r));

  const addRow    = () => setRows((prev) => [...prev, EMPTY_ROW()]);
  const removeRow = (index) => setRows((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!header.reference_constructeur.trim() || !header.reference_tec.trim()) {
      setLoading(false);
      setError('La référence constructeur et la référence TEC sont obligatoires.');
      return;
    }

    const resolvedOutillage = header.outillage.trim()
      ? toolSuggestionMap.get(normalizeToolCode(header.outillage)) || header.outillage.trim()
      : '';

    const basePayload = {
      reference_constructeur: header.reference_constructeur.trim(),
      reference_tec:          header.reference_tec.trim(),
      designation_tec:        header.designation_tec.trim() || '',
      outillage:              resolvedOutillage,
    };

    try {
      if (isEditing) {
        // Edit: single record update
        await cosseService.update(cosse.id, {
          ...basePayload,
          section_awg:          singleRow.section_awg          || '',
          section_mm2:          singleRow.section_mm2          || '',
          tenue_traction_n:     singleRow.tenue_traction_n     || '',
          longueur_denudage_mm: singleRow.longueur_denudage_mm || '',
          observation:          singleRow.observation          || '',
        });
      } else {
        // Create: one record per row (or one empty record if no rows)
        const rowsToCreate = rows.length > 0 ? rows : [EMPTY_ROW()];
        for (const row of rowsToCreate) {
          await cosseService.create({
            ...basePayload,
            section_awg:          row.section_awg          || '',
            section_mm2:          row.section_mm2          || '',
            tenue_traction_n:     row.tenue_traction_n     || '',
            longueur_denudage_mm: row.longueur_denudage_mm || '',
            observation:          row.observation          || '',
          });
        }
      }
      onSuccess();
      onClose();
      setHeader(HEADER_INITIAL);
      setSingleRow(EMPTY_ROW());
      setRows([]);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] min-h-0 w-full max-w-3xl flex-col overflow-hidden rounded-[18px] shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 flex-shrink-0"
          style={{ background: '#0f1d35', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 flex items-center justify-center flex-shrink-0">
              {isEditing ? <Pencil className="w-4 h-4 text-sky-300" /> : <Link2 className="w-4 h-4 text-sky-300" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                {isEditing ? 'Modifier la cosse' : 'Nouvelle cosse'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEditing
                  ? `Réf. TEC : ${cosse.reference_tec || '—'}`
                  : 'Définissez l\'identité puis ajoutez les lignes de mesure (optionnel)'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* ── Identity fields ── */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 mb-3">Identité de la cosse</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass} style={{ color: 'var(--text3)' }}>Référence constructeur <span className="text-red-400">*</span></span>
                <input type="text" name="reference_constructeur" value={header.reference_constructeur}
                  onChange={handleHeaderChange} required className={fieldClass} style={fieldStyle} placeholder="ex : 43030-0001" />
              </label>
              <label className="block">
                <span className={labelClass} style={{ color: 'var(--text3)' }}>Référence TEC <span className="text-red-400">*</span></span>
                <input type="text" name="reference_tec" value={header.reference_tec}
                  onChange={handleHeaderChange} required className={fieldClass} style={fieldStyle} placeholder="ex : 270624420" />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 mt-4">
              <label className="block">
                <span className={labelClass} style={{ color: 'var(--text3)' }}>Désignation TEC</span>
                <input type="text" name="designation_tec" value={header.designation_tec}
                  onChange={handleHeaderChange} className={fieldClass} style={fieldStyle} placeholder="Désignation produit" />
              </label>
              <div>
                <span className={labelClass} style={{ color: 'var(--text3)' }}>
                  Outillage <span className="text-slate-400 normal-case font-normal">(optionnel)</span>
                </span>
                <input type="text" name="outillage" value={header.outillage}
                  onChange={handleHeaderChange} list="cosse-outillage-opts" className={fieldClass} style={fieldStyle}
                  placeholder="ex : P1, P10, A1" />
                <datalist id="cosse-outillage-opts">
                  {toolSuggestions.map((t) => <option key={t} value={t} />)}
                </datalist>
                {outillageWarning && (
                  <p className="mt-1 text-[11px] text-amber-600">
                    Aucun outil existant trouvé — la cosse sera créée avec cet outillage libre.
                  </p>
                )}
                {!outillageWarning && (
                  <p className="mt-1 text-[11px] text-slate-400">
                    {loadingSuggestions ? 'Chargement…' : `${toolSuggestions.length} outil(s) suggéré(s)`}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Measurement rows (edit: single / create: multi) ── */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {isEditing ? 'Valeurs de mesure' : 'Lignes de mesure'}
                  {!isEditing && <span className="ml-1 text-slate-400 normal-case font-normal">(optionnel)</span>}
                </p>
                {!isEditing && (
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Chaque ligne crée un enregistrement séparé. Laissez vide pour ajouter les mesures plus tard.
                  </p>
                )}
              </div>
              {!isEditing && (
                <button type="button" onClick={addRow}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 transition-colors flex-shrink-0">
                  <Plus className="w-3.5 h-3.5" />
                  Ajouter une ligne
                </button>
              )}
            </div>

            {isEditing ? (
              /* Edit mode: single row */
              <div className="grid gap-3 sm:grid-cols-5">
                {[
                  { name: 'section_awg',          label: 'AWG',          placeholder: '20'    },
                  { name: 'section_mm2',          label: 'Section mm²',  placeholder: '0.5'   },
                  { name: 'tenue_traction_n',     label: 'Traction (N)', placeholder: '≥ 80'  },
                  { name: 'longueur_denudage_mm', label: 'Dénudage (mm)',placeholder: '4.5'   },
                  { name: 'observation',          label: 'Observation',  placeholder: 'Note…' },
                ].map(({ name, label, placeholder }) => (
                  <label key={name} className="block">
                    <span className={labelClass} style={{ color: 'var(--text3)' }}>{label}</span>
                    <input type="text" name={name} value={singleRow[name]}
                      onChange={handleSingleRowChange} className={fieldClass} style={fieldStyle} placeholder={placeholder} />
                  </label>
                ))}
              </div>
            ) : rows.length === 0 ? (
              /* Create mode: no rows yet */
              <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-5 text-center">
                <p className="text-xs text-slate-400">
                  Aucune ligne ajoutée — la cosse sera créée sans valeurs de mesure.
                </p>
                <button type="button" onClick={addRow}
                  className="mt-2 text-xs text-sky-500 hover:underline">
                  Ajouter la première ligne
                </button>
              </div>
            ) : (
              /* Create mode: rows table */
              <div className="space-y-2">
                {/* Column headers */}
                <div className="grid gap-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400"
                  style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 2fr auto' }}>
                  <span>AWG</span>
                  <span>mm²</span>
                  <span>Traction (N)</span>
                  <span>Dénudage (mm)</span>
                  <span>Observation</span>
                  <span />
                </div>

                {rows.map((row, index) => (
                  <div key={index} className="grid gap-2 items-center bg-white rounded-lg border border-slate-200 px-3 py-2"
                    style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 2fr auto' }}>
                    <input type="text" value={row.section_awg}
                      onChange={(e) => handleRowChange(index, 'section_awg', e.target.value)}
                      className={cellClass} placeholder="ex : 20" />
                    <input type="text" value={row.section_mm2}
                      onChange={(e) => handleRowChange(index, 'section_mm2', e.target.value)}
                      className={cellClass} placeholder="ex : 0.5" />
                    <input type="text" value={row.tenue_traction_n}
                      onChange={(e) => handleRowChange(index, 'tenue_traction_n', e.target.value)}
                      className={cellClass} placeholder="ex : ≥ 80" />
                    <input type="text" value={row.longueur_denudage_mm}
                      onChange={(e) => handleRowChange(index, 'longueur_denudage_mm', e.target.value)}
                      className={cellClass} placeholder="ex : 4.5" />
                    <input type="text" value={row.observation}
                      onChange={(e) => handleRowChange(index, 'observation', e.target.value)}
                      className={cellClass} placeholder="Observation…" />
                    <button type="button" onClick={() => removeRow(index)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <p className="text-[11px] text-slate-400 pt-1">
                  {rows.length} ligne(s) — créera {rows.length} enregistrement(s) dans la base.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50"
              style={{ background: loading ? 'var(--text3)' : 'linear-gradient(135deg, var(--accent3), var(--accent2))' }}>
              {loading
                ? 'Sauvegarde…'
                : isEditing
                  ? 'Enregistrer les modifications'
                  : rows.length > 1
                    ? `Créer ${rows.length} enregistrement(s)`
                    : 'Créer la cosse'}
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

export default CosseForm;
