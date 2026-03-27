import React, { useState, useEffect } from 'react';
import { applicateurService } from '../services/api';
import ApplicateurDetailModal from './ApplicateurDetailModal';
import ApplicateurForm from './ApplicateurForm';

const ApplicateursList = () => {
  const [applicateurs, setApplicateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicateur, setSelectedApplicateur] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingApplicateur, setEditingApplicateur] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchApplicateurs();
  }, []);

  const fetchApplicateurs = async () => {
    try {
      setLoading(true);
      const response = await applicateurService.getAll();
      setApplicateurs(response);
    } catch (error) {
      console.error('Erreur lors du chargement des applicateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDetailClick = (applicateur) => {
    setSelectedApplicateur(applicateur);
    setShowModal(true);
  };

  const handleEditClick = (applicateur) => {
    setEditingApplicateur(applicateur);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (applicateur) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${applicateur.numero_outil} ?`)) {
      try {
        await applicateurService.delete(applicateur.id);
        fetchApplicateurs();
      } catch (error) {
        console.error('Erreur suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingApplicateur(null);
  };

  const handleFormSuccess = () => {
    fetchApplicateurs();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner">⏳ Chargement des applicateurs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-orange-700 mb-6">🔧 Applicateurs Faisceaux</h2>

      <div className="overflow-x-auto border-2 border-orange-200 rounded-lg">
        <table className="w-full">
          <thead className="bg-orange-100 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">N° Outil</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Désignation</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Constructeur</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">N° Série</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Cosses</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Statut</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-orange-100">
            {applicateurs.map((applicateur, idx) => (
              <tr key={applicateur.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-orange-50'}>
                <td className="px-4 py-3 text-sm font-bold text-orange-700">{applicateur.numero_outil}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{applicateur.designation || '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{applicateur.constructeur_outil || '-'}</td>
                <td className="px-4 py-3 text-sm font-mono text-gray-700">{applicateur.numero_serie || '-'}</td>
                <td className="px-4 py-3 text-sm text-center">
                  <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold">
                    {applicateur.variants?.length || 0}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      applicateur.statut === 'en service'
                        ? 'bg-green-100 text-green-800'
                        : applicateur.statut === 'hors service'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {applicateur.statut === 'en service'
                      ? '✓ En service'
                      : applicateur.statut === 'hors service'
                      ? '✗ Hors service'
                      : '⚠ À vérifier'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleDetailClick(applicateur)}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm font-medium transition"
                    >
                      Détails
                    </button>
                    <button
                      onClick={() => handleEditClick(applicateur)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteClick(applicateur)}
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

      {applicateurs.length === 0 && (
        <div className="p-4 rounded bg-gray-100 text-center text-sm text-gray-600">
          ⚠️ Aucun applicateur trouvé
        </div>
      )}

      <ApplicateurDetailModal
        applicateur={selectedApplicateur}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedApplicateur(null);
        }}
      />
      <ApplicateurForm 
        applicateur={editingApplicateur} 
        isOpen={isFormOpen} 
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default ApplicateursList;
