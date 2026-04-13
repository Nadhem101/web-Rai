import React, { useEffect, useState } from 'react';
import { cosseService } from '../services/api';
import CosseForm from './CosseForm';

const normalizeText = (value = '') =>
  value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const formatValue = (value) => value || '-';

const parseNumericSection = (value) => {
  if (!value) return Number.MAX_SAFE_INTEGER;
  const parsed = Number.parseFloat(value.toString().replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : Number.MAX_SAFE_INTEGER;
};

const CossesList = ({ searchQuery = '' }) => {
  const [cosses, setCosses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCosse, setEditingCosse] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadCosses();
  }, []);

  const loadCosses = async () => {
    try {
      setLoading(true);
      const response = await cosseService.getAll();
      setCosses(response);
    } catch (error) {
      console.error('Erreur chargement cosses:', error);
    } finally {
      setLoading(false);
    }
  };

  const normalizedSearch = normalizeText(searchQuery);
  const filteredCosses = cosses.filter((cosse) => {
    if (!normalizedSearch) return true;

    return [
      cosse.reference_constructeur,
      cosse.reference_tec,
      cosse.designation_tec,
      cosse.outillage,
      cosse.section_awg,
      cosse.section_mm2,
      cosse.tenue_traction_n,
      cosse.longueur_denudage_mm,
      cosse.observation,
    ].some((field) => normalizeText(field).includes(normalizedSearch));
  });

  const sortedCosses = [...filteredCosses].sort((a, b) => {
    const constructeurCompare = formatValue(a.reference_constructeur).localeCompare(
      formatValue(b.reference_constructeur),
      'fr',
      { numeric: true }
    );
    if (constructeurCompare !== 0) return constructeurCompare;

    const tecCompare = formatValue(a.reference_tec).localeCompare(formatValue(b.reference_tec), 'fr', {
      numeric: true,
    });
    if (tecCompare !== 0) return tecCompare;

    const sectionCompare = parseNumericSection(a.section_mm2) - parseNumericSection(b.section_mm2);
    if (sectionCompare !== 0) return sectionCompare;

    return formatValue(a.designation_tec).localeCompare(formatValue(b.designation_tec), 'fr', {
      numeric: true,
    });
  });

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Chargement des cosses...</div>;
  }

  if (sortedCosses.length === 0) {
    return (
      <>
        <div className="bg-white rounded-lg shadow overflow-hidden flex-1 min-h-0 flex flex-col">
          <div className="px-6 py-4 border-b border-amber-100 bg-amber-50/70 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-amber-800">🔗 Cosses</h2>
              <p className="text-sm text-amber-900/70">Données importées depuis le CSV fourni</p>
            </div>
            <button
              onClick={() => {
                setEditingCosse(null);
                setIsFormOpen(true);
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              ➕ Nouvelle cosse
            </button>
          </div>
          <div className="text-center py-8 text-gray-500">Aucune cosse trouvée</div>
        </div>

        <CosseForm
          cosse={editingCosse}
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingCosse(null);
          }}
          onSuccess={loadCosses}
        />
      </>
    );
  }

  const handleCreateClick = () => {
    setEditingCosse(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (cosse) => {
    setEditingCosse(cosse);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (cosse) => {
    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer ${formatValue(cosse.reference_constructeur)} / ${formatValue(cosse.reference_tec)} ?`
    );

    if (!confirmed) return;

    try {
      await cosseService.delete(cosse.id);
      loadCosses();
    } catch (error) {
      console.error('Erreur suppression cosse:', error);
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden flex-1 min-h-0 flex flex-col">
        <div className="px-6 py-4 border-b border-amber-100 bg-amber-50/70 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-amber-800">🔗 Cosses</h2>
            <p className="text-sm text-amber-900/70">Données importées depuis le CSV fourni</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm font-semibold text-amber-700">{sortedCosses.length} référence(s)</div>
            <button
              onClick={handleCreateClick}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              ➕ Nouvelle cosse
            </button>
          </div>
        </div>

        <div className="overflow-auto flex-1">
          <table className="min-w-full">
            <thead className="bg-amber-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Constructeur</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Réf. TEC</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Désignation</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Outillage</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">AWG</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Section mm²</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Traction</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Dénudage</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Observation</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {sortedCosses.map((cosse, index) => (
                <tr key={cosse.id} className={index % 2 === 0 ? 'bg-white' : 'bg-amber-50/30'}>
                  <td className="px-4 py-3 text-sm font-semibold text-amber-700">{formatValue(cosse.reference_constructeur)}</td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-700">{formatValue(cosse.reference_tec)}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{formatValue(cosse.designation_tec)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatValue(cosse.outillage)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatValue(cosse.section_awg)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatValue(cosse.section_mm2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatValue(cosse.tenue_traction_n)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatValue(cosse.longueur_denudage_mm)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatValue(cosse.observation)}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(cosse)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteClick(cosse)}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CosseForm
        cosse={editingCosse}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCosse(null);
        }}
        onSuccess={loadCosses}
      />
    </>
  );
};

export default CossesList;