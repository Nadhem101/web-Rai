import React, { useEffect, useMemo, useState } from 'react';
import { cosseService, fabricantService, pinceService } from '../services/api';

const normalizeToolCode = (value = '') =>
  String(value ?? '')
    .replace(/\uFEFF/g, '')
    .trim()
    .replace(/\s+/g, '')
    .toUpperCase();

const normalizeSearchValue = (value = '') =>
  String(value ?? '')
    .replace(/\uFEFF/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const buildCosseLabel = (cosse) =>
  `${cosse.reference_tec || ''} • ${cosse.reference_constructeur || ''} • ${cosse.designation_tec || 'Sans désignation'}`;

const buildInitialState = (pince) => ({
  numero_pince: pince?.numero_pince ?? '',
  reference_pince: pince?.reference_pince ?? '',
  date_verification: pince?.date_verification ?? '',
  fabricant_nom: pince?.Fabricant?.nom ?? '',
  statut: pince?.statut ?? 'À vérifier',
  remarque: pince?.remarque ?? '',
});

const PinceForm = ({ pince, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(buildInitialState(pince));
  const [fabricants, setFabricants] = useState([]);
  const [cosses, setCosses] = useState([]);
  const [selectedCosseId, setSelectedCosseId] = useState('');
  const [cosseSearch, setCosseSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    setFormData(buildInitialState(pince));
    setError(null);
    setCosseSearch('');
  }, [pince, isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    let cancelled = false;

    const loadOptions = async () => {
      setLoadingOptions(true);

      try {
        const [fabricantResponse, cosseResponse] = await Promise.all([
          fabricantService.getAll(),
          cosseService.getAll(),
        ]);

        const nextFabricants = Array.isArray(fabricantResponse?.data) ? fabricantResponse.data : [];
        const nextCosses = Array.isArray(cosseResponse) ? cosseResponse : [];

        if (!cancelled) {
          setFabricants(nextFabricants);
          setCosses(nextCosses);
        }
      } catch (loadError) {
        console.error('Erreur chargement options pince:', loadError);
        if (!cancelled) {
          setFabricants([]);
          setCosses([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingOptions(false);
        }
      }
    };

    loadOptions();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const firstVariant = pince?.variants?.[0];
    if (!firstVariant || cosses.length === 0) {
      if (!pince?.id) setSelectedCosseId('');
      if (!pince?.id) setCosseSearch('');
      return;
    }

    const normalizedRefTec = normalizeToolCode(firstVariant.reference_tec);
    const normalizedRefConstructeur = normalizeToolCode(firstVariant.reference_constructeur);
    const matchedCosse = cosses.find((cosse) => {
      return (
        normalizeToolCode(cosse.reference_tec) === normalizedRefTec &&
        normalizeToolCode(cosse.reference_constructeur) === normalizedRefConstructeur
      );
    });

    if (matchedCosse) {
      const cosseLabel = buildCosseLabel(matchedCosse);
      setSelectedCosseId(String(matchedCosse.id));
      setCosseSearch(cosseLabel);
    } else if (!pince?.id) {
      setSelectedCosseId('');
      setCosseSearch('');
    }
  }, [cosses, isOpen, pince]);

  const fabricantOptions = useMemo(
    () => fabricants.slice().sort((left, right) => String(left.nom ?? '').localeCompare(String(right.nom ?? ''), 'fr', { numeric: true, sensitivity: 'base' })),
    [fabricants]
  );

  const cosseOptions = useMemo(
    () =>
      cosses
        .slice()
        .sort((left, right) => buildCosseLabel(left).localeCompare(buildCosseLabel(right), 'fr', { numeric: true, sensitivity: 'base' })),
    [cosses]
  );

  const filteredCosseOptions = useMemo(() => {
    const query = normalizeSearchValue(cosseSearch);

    if (!query) {
      return cosseOptions.slice(0, 20);
    }

    return cosseOptions
      .filter((cosse) => {
        const label = normalizeSearchValue(buildCosseLabel(cosse));
        return (
          label.includes(query) ||
          normalizeSearchValue(cosse.reference_tec).includes(query) ||
          normalizeSearchValue(cosse.reference_constructeur).includes(query) ||
          normalizeSearchValue(cosse.designation_tec).includes(query)
        );
      })
      .slice(0, 20);
  }, [cosseOptions, cosseSearch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCosseSearchChange = (e) => {
    const { value } = e.target;
    setCosseSearch(value);

    const exactMatch = cosseOptions.find((cosse) => buildCosseLabel(cosse) === value);
    setSelectedCosseId(exactMatch ? String(exactMatch.id) : '');
  };

  const handleCossePick = (cosse) => {
    setCosseSearch(buildCosseLabel(cosse));
    setSelectedCosseId(String(cosse.id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!selectedCosseId) {
      setLoading(false);
      setError('Veuillez sélectionner une cosse existante dans la base.');
      return;
    }

    const payload = {
      ...formData,
      numero_pince: formData.numero_pince.trim(),
      reference_pince: formData.reference_pince.trim() || null,
      date_verification: formData.date_verification || null,
      fabricant_nom: formData.fabricant_nom.trim() || null,
      statut: formData.statut,
      remarque: formData.remarque.trim() || null,
      ...(selectedCosseId ? { cosse_id: Number(selectedCosseId) } : {}),
    };

    try {
      if (pince?.id) {
        // Update existing pince
        await pinceService.update(pince.id, payload);
      } else {
        // Create new pince
        await pinceService.create(payload);
      }
      onSuccess();
      onClose();
      setFormData(buildInitialState(null));
      setSelectedCosseId('');
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 flex max-h-[90vh] min-h-0 flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {pince?.id ? '✏️ Modifier Pince' : '➕ Nouvelle Pince'}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold hover:opacity-80"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 min-h-0 space-y-4 overflow-y-auto p-6">
          {error && (
            <div className="p-3 rounded bg-red-100 text-red-700 text-sm">
              ❌ {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              N° Pince *
            </label>
            <input
              type="text"
              name="numero_pince"
              value={formData.numero_pince}
              onChange={handleChange}
              required
              disabled={!!pince?.id}
              className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500 disabled:bg-gray-100"
              placeholder="ex: P01+P02"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fabricant</label>
              <input
                type="text"
                name="fabricant_nom"
                list="fabricant-options"
                value={formData.fabricant_nom}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="Choisir un fabricant existant ou en saisir un nouveau"
              />
              <datalist id="fabricant-options">
                {fabricantOptions.map((fabricant) => (
                  <option key={fabricant.id} value={fabricant.nom} />
                ))}
              </datalist>
              <p className="mt-1 text-xs text-gray-500">Vous pouvez saisir un nouveau fabricant ou choisir un nom existant.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Référence pince</label>
              <input
                type="text"
                name="reference_pince"
                value={formData.reference_pince}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="ex: 539 773-2A"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date de vérification</label>
              <input
                type="date"
                name="date_verification"
                value={formData.date_verification}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cosse associée *</label>
              <input
                type="text"
                value={cosseSearch}
                onChange={handleCosseSearchChange}
                list="cosse-options"
                className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="Tapez une référence TEC, constructeur ou désignation"
              />
              <datalist id="cosse-options">
                {cosseOptions.map((cosse) => (
                  <option key={cosse.id} value={buildCosseLabel(cosse)} />
                ))}
              </datalist>
              <p className="mt-1 text-xs text-gray-500">
                {loadingOptions ? 'Chargement des cosses...' : `${filteredCosseOptions.length} résultat(s) affiché(s) sur ${cosseOptions.length}.`}
              </p>
              {cosseSearch && filteredCosseOptions.length > 0 && (
                <div className="mt-2 max-h-40 overflow-auto rounded-lg border border-orange-100 bg-orange-50/60 p-2">
                  {filteredCosseOptions.map((cosse) => (
                    <button
                      key={cosse.id}
                      type="button"
                      onClick={() => handleCossePick(cosse)}
                      className="mb-1 flex w-full items-start justify-between rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-white"
                    >
                      <span>{buildCosseLabel(cosse)}</span>
                      <span className="ml-4 shrink-0 text-xs text-slate-400">#{cosse.id}</span>
                    </button>
                  ))}
                </div>
              )}
              {cosseSearch && !selectedCosseId && (
                <p className="mt-1 text-xs font-medium text-red-600">Choisissez une cosse existante dans la base pour pouvoir enregistrer.</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Statut
            </label>
            <select
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500"
            >
              <option value="En service">✓ En service</option>
              <option value="Hors service">✗ Hors service</option>
              <option value="À vérifier">⚠ À vérifier</option>
              <option value="Manque cosse">⚠ Manque cosse</option>
              <option value="Vérification visuelle">👁 Vérification visuelle</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Remarque
            </label>
            <textarea
              name="remarque"
              value={formData.remarque}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500"
              placeholder="Notes et remarques..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              {loading ? 'Sauvegarde...' : pince?.id ? 'Modifier' : 'Créer'}
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

export default PinceForm;
