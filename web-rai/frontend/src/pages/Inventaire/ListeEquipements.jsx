import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { equipementService } from '../../services/api';
import PincesList from '../../components/PincesList';
import ApplicateursList from '../../components/ApplicateursList';
import PinceForm from '../../components/PinceForm';
import ApplicateurForm from '../../components/ApplicateurForm';

const normalizeZoneName = (value) => {
  if (!value) return '';
  return value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

const ListeEquipements = () => {
  const [searchParams] = useSearchParams();
  const [equipements, setEquipements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  const rawCategorie = searchParams.get('categorie') || 'equipement-all';
  const categorie = rawCategorie === 'all' || rawCategorie === 'equipement' ? 'equipement-all' : rawCategorie;

  // Zone mapping for display
  const zoneMap = {
    'zone:Bobinage': { label: 'Bobinage', icon: '🔄' },
    'zone:Câblage': { label: 'Câblage', icon: '✂️' },
    'zone:Électronique': { label: 'Électronique', icon: '💾' },
    'zone:Chauvin Arnoux': { label: 'Chauvin Arnoux', icon: '⚙️' },
    'zone:Embases Relais': { label: 'Embases Relais', icon: '🔌' },
    'zone:Kuhn': { label: 'Kuhn', icon: '🏭' },
    'zone:Club': { label: 'Club', icon: '🛠️' },
    'zone:Maintenance': { label: 'Maintenance', icon: '🔧' },
    'zone:Électro-aimant': { label: 'Électro-aimant', icon: '⚡' },
  };

  const categoryMap = {
    'equipement-all': { label: '📋 Tous les équipements', icon: '📋' },
    'pinces': { label: '🔨 Pinces', icon: '🔨' },
    'applicateurs': { label: '⚡ Applicateurs', icon: '⚡' },
    ...zoneMap,
  };

  const currentCategory = categoryMap[categorie] || { label: 'Équipements', icon: '📋' };

  useEffect(() => {
    loadEquipements();
  }, [categorie]);

  const loadEquipements = async () => {
    try {
      setLoading(true);
      const response = await equipementService.getAll();
      setEquipements(response.data);
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredEquipements = () => {
    let filtered = equipements;
    
    if (categorie === 'pinces' || categorie === 'applicateurs') {
      return [];
    }

    // FC equipment: filter by categorie
    filtered = filtered.filter((eq) => eq.categorie === 'equipement');

    // If zone is selected, filter by zone
    if (categorie.startsWith('zone:')) {
      const selectedZone = categorie.slice(5);
      const normalizedSelectedZone = normalizeZoneName(selectedZone);
      filtered = filtered.filter((eq) => {
        if (!eq.Zone?.nom_zone) return false;
        const dbZoneNormalized = normalizeZoneName(eq.Zone.nom_zone);
        return dbZoneNormalized === normalizedSelectedZone;
      });
    }
    
    // Filter by search
    filtered = filtered.filter((eq) =>
      eq.code_rai?.toLowerCase().includes(search.toLowerCase()) ||
      eq.designation?.toLowerCase().includes(search.toLowerCase())
    );
    
    return filtered;
  };

  const filteredEquipements = getFilteredEquipements();

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    teal: 'bg-teal-50 border-teal-200',
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'En service':
        return 'bg-green-100 text-green-800';
      case 'Hors service':
        return 'bg-red-100 text-red-800';
      case 'En maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFormClose = () => {
    setIsCreatingNew(false);
  };

  const handleFormSuccess = () => {
    setIsCreatingNew(false);
  };

  return (
    <div className="p-6 flex-1 overflow-auto flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{currentCategory.label}</h1>
          <p className="text-sm text-gray-500">{filteredEquipements.length} équipement(s)</p>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Rechercher par code ou désignation..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : categorie === 'pinces' ? (
        <PincesList searchQuery={search} />
      ) : categorie === 'applicateurs' ? (
        <ApplicateursList searchQuery={search} />
      ) : filteredEquipements.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Aucun équipement trouvé</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden flex-1 flex flex-col">
          <div className="overflow-auto flex-1">
            <table className="min-w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code RAI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Désignation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Série</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Zone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fabricant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEquipements.map((eq) => (
                  <tr key={eq.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm">{eq.code_rai}</td>
                    <td className="px-6 py-4">{eq.designation}</td>
                    <td className="px-6 py-4">{eq.numero_serie || '-'}</td>
                    <td className="px-6 py-4">{eq.Zone?.nom_zone || '-'}</td>
                    <td className="px-6 py-4">{eq.Fabricant?.nom || '-'}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(
                          eq.statut
                        )}`}
                      >
                        {eq.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-900 mr-2">✏️</button>
                      <button className="text-red-600 hover:text-red-900">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Forms for creating new equipment */}
      {categorie === 'pinces' && (
        <PinceForm 
          pince={null} 
          isOpen={isCreatingNew} 
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {categorie === 'applicateurs' && (
        <ApplicateurForm 
          applicateur={null} 
          isOpen={isCreatingNew} 
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default ListeEquipements;
