import React, { useEffect, useMemo, useState } from 'react';
import { equipementService, fabricantService, zoneService } from '../services/api';

const normalizeText = (value = '') =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const normalizeFormValue = (value) => String(value ?? '').replace(/\uFEFF/g, '').trim();

const PDR_PIECE_OPTIONS = [
  { value: 'lame_cuivre', label: 'Lame cuivre' },
  { value: 'lame_isolant', label: 'Lame isolant' },
  { value: 'enclume_cuivre', label: 'Enclume cuivre' },
  { value: 'enclume_isolant', label: 'Enclume isolant' },
];

const createEmptyPdrPiece = () => ({
  code: '',
  reference: '',
  quantity: '',
});

const buildPdrPieces = (equipement) =>
  Object.entries(equipement?.pdr_details ?? {}).map(([code, details]) => ({
    code,
    reference: details?.reference ?? '',
    quantity: details?.quantity ?? '',
  }));

const buildInitialState = (equipement, defaultCategory) => ({
  code_rai: equipement?.code_rai ?? '',
  designation: equipement?.designation ?? '',
  numero_serie: equipement?.numero_serie ?? '',
  date_acquisition: equipement?.date_acquisition ?? '',
  categorie: equipement?.categorie ?? defaultCategory ?? 'equipement',
  statut: equipement?.statut ?? 'En service',
  zone_id: String(equipement?.zone_id ?? equipement?.Zone?.id ?? ''),
  fabricant_id: String(equipement?.fabricant_id ?? equipement?.Fabricant?.id ?? ''),
  remarque: equipement?.remarque ?? '',
});

const EquipementForm = ({ equipement, isOpen, onClose, onSuccess, defaultCategory = 'equipement', defaultZoneName = '' }) => {
  const [formData, setFormData] = useState(buildInitialState(equipement, defaultCategory));
  const [pdrPieces, setPdrPieces] = useState(() => buildPdrPieces(equipement));
  const [zones, setZones] = useState([]);
  const [fabricants, setFabricants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    setFormData(buildInitialState(equipement, defaultCategory));
    setPdrPieces(buildPdrPieces(equipement));
    setError('');
  }, [equipement, defaultCategory, isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    let cancelled = false;

    const loadOptions = async () => {
      setLoadingOptions(true);

      try {
        const [zoneResponse, fabricantResponse] = await Promise.all([zoneService.getAll(), fabricantService.getAll()]);
        const nextZones = Array.isArray(zoneResponse?.data) ? zoneResponse.data : [];
        const nextFabricants = Array.isArray(fabricantResponse?.data) ? fabricantResponse.data : [];

        if (!cancelled) {
          setZones(nextZones);
          setFabricants(nextFabricants);
        }
      } catch (loadError) {
        console.error('Erreur chargement options équipement:', loadError);
        if (!cancelled) {
          setZones([]);
          setFabricants([]);
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
    if (!isOpen || equipement?.id || !defaultZoneName || zones.length === 0) return;

    const normalizedZoneName = normalizeText(defaultZoneName);
    const matchedZone = zones.find((zone) => normalizeText(zone.nom_zone) === normalizedZoneName);

    if (matchedZone) {
      setFormData((previous) => ({
        ...previous,
        zone_id: String(matchedZone.id),
      }));
    }
  }, [defaultZoneName, equipement?.id, isOpen, zones]);

  const fabricantOptions = useMemo(() => fabricants.slice().sort((left, right) => String(left.nom ?? '').localeCompare(String(right.nom ?? ''), 'fr', { numeric: true, sensitivity: 'base' })), [fabricants]);

  const zoneOptions = useMemo(() => zones.slice().sort((left, right) => String(left.nom_zone ?? '').localeCompare(String(right.nom_zone ?? ''), 'fr', { numeric: true, sensitivity: 'base' })), [zones]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePdrPieceChange = (index, field, value) => {
    setPdrPieces((previous) =>
      previous.map((piece, currentIndex) =>
        currentIndex === index
          ? {
              ...piece,
              [field]: value,
            }
          : piece
      )
    );
  };

  const addPdrPiece = () => {
    setPdrPieces((previous) => [...previous, createEmptyPdrPiece()]);
  };

  const removePdrPiece = (index) => {
    setPdrPieces((previous) => previous.filter((_, currentIndex) => currentIndex !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const cleanedCode = normalizeFormValue(formData.code_rai);
    const cleanedDesignation = normalizeFormValue(formData.designation);
    const cleanedNumeroSerie = normalizeFormValue(formData.numero_serie);
    const cleanedDateAcquisition = normalizeFormValue(formData.date_acquisition);
    const cleanedRemarque = normalizeFormValue(formData.remarque);
    if (!cleanedCode || !cleanedDesignation) {
      setLoading(false);
      setError('Le code RAI et la désignation sont obligatoires.');
      return;
    }

    let pdrDetails;
    if (formData.categorie === 'pdr') {
      const nextPdrDetails = {};

      for (const piece of pdrPieces) {
        const code = normalizeFormValue(piece.code);
        const reference = normalizeFormValue(piece.reference);
        const quantity = normalizeFormValue(piece.quantity);

        if (!code && !reference && !quantity) {
          continue;
        }

        if (!code) {
          setLoading(false);
          setError('Chaque pièce PDR doit avoir une clé.');
          return;
        }

        if (nextPdrDetails[code]) {
          setLoading(false);
          setError('Chaque pièce PDR doit avoir une clé unique.');
          return;
        }

        nextPdrDetails[code] = {
          reference: reference || null,
          quantity: quantity || null,
        };
      }

      pdrDetails = nextPdrDetails;
    }

    const payload = {
      code_rai: cleanedCode,
      designation: cleanedDesignation,
      numero_serie: cleanedNumeroSerie || null,
      date_acquisition: cleanedDateAcquisition || null,
      categorie: formData.categorie,
      statut: formData.statut,
      zone_id: formData.zone_id ? Number(formData.zone_id) : null,
      fabricant_id: formData.fabricant_id ? Number(formData.fabricant_id) : null,
      remarque: cleanedRemarque || null,
      ...(pdrDetails !== undefined ? { pdr_details: pdrDetails } : {}),
    };

    try {
      if (equipement?.id) {
        await equipementService.update(equipement.id, payload);
      } else {
        await equipementService.create(payload);
      }

      onSuccess();
      onClose();
    } catch (saveError) {
      console.error('Erreur sauvegarde équipement:', saveError);
      setError(saveError?.response?.data?.message || saveError.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] min-h-0 w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-blue-100 bg-blue-600 px-6 py-5 text-white">
          <div>
            <h2 className="text-2xl font-bold">{equipement?.id ? '✏️ Modifier équipement' : '➕ Nouvel équipement'}</h2>
            <p className="mt-1 text-sm text-blue-50/90">Gestion des équipements de la base de données.</p>
          </div>
          <button onClick={onClose} className="text-2xl font-bold leading-none hover:opacity-80">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 min-h-0 overflow-y-auto p-6">
          {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">❌ {error}</div>}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Code RAI *</span>
              <input
                type="text"
                name="code_rai"
                value={formData.code_rai}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="ex: EQUIP999"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Catégorie</span>
              <select
                name="categorie"
                value={formData.categorie}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="equipement">Équipement</option>
                <option value="pdr">PDR</option>
                <option value="fer-et-bain">Fer et bain</option>
              </select>
            </label>

            <label className="block md:col-span-2">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Désignation *</span>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="ex: Bain creuset"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Fabricant</span>
              <select
                name="fabricant_id"
                value={formData.fabricant_id}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Aucun fabricant</option>
                {fabricantOptions.map((fabricant) => (
                  <option key={fabricant.id} value={fabricant.id}>
                    {fabricant.nom}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Zone</span>
              <select
                name="zone_id"
                value={formData.zone_id}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Aucune zone</option>
                {zoneOptions.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.nom_zone}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">N° Série</span>
              <input
                type="text"
                name="numero_serie"
                value={formData.numero_serie}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Numéro de série"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Date acquisition</span>
              <input
                type="date"
                name="date_acquisition"
                value={formData.date_acquisition}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Statut</span>
              <select
                name="statut"
                value={formData.statut}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="En service">En service</option>
                <option value="Hors service">Hors service</option>
                <option value="En maintenance">En maintenance</option>
              </select>
            </label>

            {formData.categorie === 'pdr' && (
              <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Détails PDR</span>
                    <p className="mt-1 text-sm text-slate-600">
                      Ajoutez une ou plusieurs pièces. Le bouton ci-dessous ouvre une nouvelle ligne à compléter.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addPdrPiece}
                    className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    ➕ Ajouter une pièce
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {pdrPieces.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-500">
                      Aucune pièce ajoutée pour le moment.
                    </div>
                  ) : (
                    pdrPieces.map((piece, index) => (
                      <div key={`${piece.code || 'piece'}-${index}`} className="grid gap-3 rounded-lg border border-slate-200 bg-white p-3 md:grid-cols-[1.2fr_2fr_1fr_auto] md:items-end">
                        <label className="block">
                          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Pièce</span>
                          <select
                            value={piece.code}
                            onChange={(event) => handlePdrPieceChange(index, 'code', event.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                          >
                            <option value="">Choisir</option>
                            {PDR_PIECE_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="block">
                          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Référence</span>
                          <input
                            type="text"
                            value={piece.reference}
                            onChange={(event) => handlePdrPieceChange(index, 'reference', event.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="Référence pièce"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Quantité</span>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={piece.quantity}
                            onChange={(event) => handlePdrPieceChange(index, 'quantity', event.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="0"
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => removePdrPiece(index)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            <label className="block md:col-span-2">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Remarque</span>
              <textarea
                name="remarque"
                value={formData.remarque}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Commentaires, état, observation..."
              />
            </label>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? 'Sauvegarde...' : equipement?.id ? 'Modifier' : 'Créer'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipementForm;