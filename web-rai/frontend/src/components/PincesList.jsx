import React, { useState, useEffect } from 'react';
import { pinceService } from '../services/api';
import PinceDetailModal from './PinceDetailModal';
import PinceForm from './PinceForm';

const PincesList = ({ searchQuery = '' }) => {
  const [pinces, setPinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPince, setSelectedPince] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPince, setEditingPince] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadPinces();
  }, []);

  const loadPinces = async () => {
    try {
      setLoading(true);
      const response = await pinceService.getAll();
      setPinces(response.data);
    } catch (error) {
      console.error('Erreur chargement pinces:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPinces = pinces.filter((pince) =>
    pince.numero_pince?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pince.Fabricant?.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pince.reference_pince?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPinceSortKey = (numero = '') => {
    const base = numero.toUpperCase().split('+')[0] || '';
    const match = base.match(/^P(\d{1,3})$/);
    return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
  };

  const sortedPinces = [...filteredPinces].sort((a, b) => {
    const keyA = getPinceSortKey(a.numero_pince);
    const keyB = getPinceSortKey(b.numero_pince);
    if (keyA !== keyB) return keyA - keyB;
    return (a.numero_pince || '').localeCompare(b.numero_pince || '', 'fr', { numeric: true });
  });

  const openModal = (pince) => {
    setSelectedPince(pince);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPince(null);
  };

  const handleEditClick = (pince) => {
    setEditingPince(pince);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (pince) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${pince.numero_pince} ?`)) {
      try {
        await pinceService.delete(pince.id);
        loadPinces();
      } catch (error) {
        console.error('Erreur suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingPince(null);
  };

  const handleFormSuccess = () => {
    loadPinces();
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'En service':
        return 'bg-green-100 text-green-800';
      case 'Hors service':
        return 'bg-red-100 text-red-800';
      case 'À vérifier':
        return 'bg-yellow-100 text-yellow-800';
      case 'Manque cosse':
        return 'bg-orange-100 text-orange-800';
      case 'Vérification visuelle':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Chargement des pinces...</div>;
  }

  if (filteredPinces.length === 0) {
    return <div className="text-center py-8 text-gray-500">Aucune pince trouvée</div>;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden flex-1 min-h-0 flex flex-col">
        <div className="overflow-auto flex-1">
          <table className="min-w-full">
            <thead className="bg-orange-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">N° Pince</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Fabricant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Référence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Variantes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Vérifications</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Dernière Verif.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedPinces.map((pince) => {
                const lastRecord = pince.variants?.[0]?.maintenanceRecords?.[0];
                return (
                  <tr key={pince.id} className="hover:bg-orange-50 transition">
                    <td className="px-6 py-4 font-bold text-orange-600">{pince.numero_pince}</td>
                    <td className="px-6 py-4 text-sm">{pince.Fabricant?.nom || '-'}</td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-600">{pince.reference_pince || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                        {pince.variants?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-semibold">
                        {pince.variants?.reduce((acc, v) => acc + (v.maintenanceRecords?.length || 0), 0) || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(pince.statut)}`}>
                        {pince.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {lastRecord?.date_verification ? (
                        <div>
                          <div className="font-mono">{lastRecord.date_verification}</div>
                          <div className="text-xs text-gray-500">{lastRecord.moyenne}N moy.</div>
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal(pince)}
                          className="text-orange-600 hover:text-orange-900 font-semibold hover:underline"
                        >
                          Détails →
                        </button>
                        <button
                          onClick={() => handleEditClick(pince)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Modifier"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteClick(pince)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <PinceDetailModal pince={selectedPince} isOpen={isModalOpen} onClose={closeModal} />
      <PinceForm 
        pince={editingPince} 
        isOpen={isFormOpen} 
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    </>
  );
};

export default PincesList;
