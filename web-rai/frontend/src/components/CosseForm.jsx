import React, { useEffect, useMemo, useState } from 'react';
import { applicateurService, cosseService, pinceService } from '../services/api';

const initialState = {
  reference_constructeur: '',
  reference_tec: '',
  designation_tec: '',
  outillage: '',
  section_awg: '',
  section_mm2: '',
  tenue_traction_n: '',
  longueur_denudage_mm: '',
  observation: '',
};

const normalizeToolCode = (value = '') =>
  String(value ?? '')
    .replace(/\uFEFF/g, '')
    .trim()
    .replace(/\s+/g, '')
    .toUpperCase();

const CosseForm = ({ cosse, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toolSuggestions, setToolSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setFormData(cosse ? { ...initialState, ...cosse } : initialState);
    setError(null);
  }, [cosse, isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    let cancelled = false;

    const loadToolSuggestions = async () => {
      setLoadingSuggestions(true);

      try {
        const [pinceResponse, applicateurRecords] = await Promise.all([
          pinceService.getAll(),
          applicateurService.getAll(),
        ]);

        const pinceRecords = Array.isArray(pinceResponse?.data) ? pinceResponse.data : [];
        const applicateurs = Array.isArray(applicateurRecords) ? applicateurRecords : [];
        const nextSuggestions = [];
        const seen = new Set();

        const addSuggestion = (value) => {
          const label = String(value ?? '').trim();
          const normalized = normalizeToolCode(label);

          if (!normalized || seen.has(normalized)) return;
          seen.add(normalized);
          nextSuggestions.push(label);
        };

        pinceRecords.forEach((pince) => addSuggestion(pince.numero_pince));
        applicateurs.forEach((applicateur) => addSuggestion(applicateur.numero_outil));

        nextSuggestions.sort((left, right) => left.localeCompare(right, 'fr', { numeric: true, sensitivity: 'base' }));

        if (!cancelled) {
          setToolSuggestions(nextSuggestions);
        }
      } catch (fetchError) {
        console.error('Erreur chargement suggestions outillage:', fetchError);
        if (!cancelled) {
          setToolSuggestions([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingSuggestions(false);
        }
      }
    };

    loadToolSuggestions();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const toolSuggestionMap = useMemo(() => {
    return new Map(toolSuggestions.map((value) => [normalizeToolCode(value), value]));
  }, [toolSuggestions]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const normalizedOutillage = formData.outillage.trim();
    const shouldValidateOutillage = !loadingSuggestions && toolSuggestionMap.size > 0;

    if (shouldValidateOutillage && normalizedOutillage && !toolSuggestionMap.has(normalizeToolCode(normalizedOutillage))) {
      setLoading(false);
      setError('L\'outillage doit correspondre à une pince ou un applicateur existant.');
      return;
    }

    const payload = {
      ...formData,
      outillage: normalizedOutillage ? toolSuggestionMap.get(normalizeToolCode(normalizedOutillage)) || normalizedOutillage : '',
    };

    try {
      if (cosse?.id) {
        await cosseService.update(cosse.id, payload);
      } else {
        await cosseService.create(payload);
      }

      onSuccess();
      onClose();
      setFormData(initialState);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Erreur lors de la sauvegarde');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 flex flex-col max-h-[90vh]">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{cosse?.id ? '✏️ Modifier Cosse' : '➕ Nouvelle Cosse'}</h2>
          <button onClick={onClose} className="text-2xl font-bold hover:opacity-80">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto">
          {error && <div className="p-3 rounded bg-red-100 text-red-700 text-sm">❌ {error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Référence constructeur *</label>
              <input
                type="text"
                name="reference_constructeur"
                value={formData.reference_constructeur}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
                placeholder="ex: 43030-0001"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Référence TEC *</label>
              <input
                type="text"
                name="reference_tec"
                value={formData.reference_tec}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
                placeholder="ex: 270624420"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Désignation TEC</label>
            <input
              type="text"
              name="designation_tec"
              value={formData.designation_tec}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
              placeholder="Désignation produit"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Outillage</label>
            <input
              type="text"
              name="outillage"
              value={formData.outillage}
              onChange={handleChange}
              list="cosse-outillage-options"
              className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
              placeholder="ex: P1, P10, A1"
            />
            <p className="mt-1 text-xs text-gray-500">
              Choisis une pince ou un applicateur existant dans la base.{' '}
              {loadingSuggestions ? 'Chargement des suggestions...' : `${toolSuggestions.length} suggestion(s) disponibles`}
            </p>
            <datalist id="cosse-outillage-options">
              {toolSuggestions.map((toolCode) => (
                <option key={toolCode} value={toolCode} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">AWG</label>
              <input
                type="text"
                name="section_awg"
                value={formData.section_awg}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
                placeholder="ex: 20"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Section mm²</label>
              <input
                type="text"
                name="section_mm2"
                value={formData.section_mm2}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
                placeholder="ex: 0.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tenue à la traction (N)</label>
              <input
                type="text"
                name="tenue_traction_n"
                value={formData.tenue_traction_n}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
                placeholder="ex: ≥ 80"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Longueur de dénudage (mm)</label>
              <input
                type="text"
                name="longueur_denudage_mm"
                value={formData.longueur_denudage_mm}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
                placeholder="ex: 4.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Observation</label>
            <textarea
              name="observation"
              value={formData.observation}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
              placeholder="Commentaires ou remarques..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              {loading ? 'Sauvegarde...' : cosse?.id ? 'Modifier' : 'Créer'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CosseForm;