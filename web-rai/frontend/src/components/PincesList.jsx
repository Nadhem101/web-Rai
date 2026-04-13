import React, { useState, useEffect } from 'react';
import { pinceService } from '../services/api';
import PinceForm from './PinceForm';

const PincesList = ({ searchQuery = '' }) => {
  const [pinces, setPinces] = useState([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Chargement des pinces...</div>;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden flex-1 min-h-0 flex flex-col">
        <div className="px-6 py-4 border-b border-orange-100 bg-orange-50/70 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-orange-800">🔨 Pinces</h2>
            <p className="text-sm text-orange-900/70">Informations essentielles des pinces</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm font-semibold text-orange-700">{sortedPinces.length} pince(s)</div>
            <button
              onClick={() => {
                setEditingPince(null);
                setIsFormOpen(true);
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              ➕ Nouvelle Pince
            </button>
          </div>
        </div>

        <div className="overflow-auto flex-1">
          <table className="min-w-full">
            <thead className="bg-orange-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">N° Pince</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Constructeur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Référence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Remarque</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedPinces.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Aucune pince trouvée
                  </td>
                </tr>
              ) : (
                sortedPinces.map((pince) => (
                  <tr key={pince.id} className="hover:bg-orange-50 transition">
                    <td className="px-6 py-4 font-bold text-orange-600">{pince.numero_pince}</td>
                    <td className="px-6 py-4 text-sm">{pince.Fabricant?.nom || '-'}</td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-600">{pince.reference_pince || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{pince.remarque || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
