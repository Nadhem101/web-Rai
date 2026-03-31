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

const getZoneOrderRank = (zoneName) => {
  const normalized = normalizeZoneName(zoneName);

  if (normalized.includes('bobinage')) return 1;
  if (normalized.includes('coupe')) return 2;
  if (normalized.includes('assemblage')) return 3;
  if (normalized.includes('electronique')) return 4;
  if (normalized.includes('fer') || normalized.includes('bain')) return 5;

  return 99;
};

const ListeEquipements = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [equipements, setEquipements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  const rawCategorie = searchParams.get('categorie') || 'equipement-all';
  const categorie = rawCategorie === 'all' || rawCategorie === 'equipement' ? 'equipement-all' : rawCategorie;

  const fcEquipements = equipements.filter((eq) => eq.categorie === 'equipement');
  const zoneCategories = Array.from(
    new Map(
      fcEquipements
        .filter((eq) => eq.Zone?.nom_zone)
        .map((eq) => [eq.Zone.nom_zone, eq.Zone.nom_zone])
    ).values()
  )
    .sort((a, b) => {
      const rankDiff = getZoneOrderRank(a) - getZoneOrderRank(b);
      if (rankDiff !== 0) return rankDiff;
      return a.localeCompare(b, 'fr', { sensitivity: 'base', numeric: true });
    })
    .map((zoneName) => ({
      id: `zone:${zoneName}`,
      label: zoneName,
      icon: '🏭',
      color: 'teal',
      zoneName,
    }));

  const categories = [
    { id: 'equipement-all', label: 'Tous les équipements FC', icon: '📋', color: 'blue' },
    ...zoneCategories,
    { id: 'pinces', label: 'Pinces', icon: '🔨', color: 'orange' },
    { id: 'applicateurs', label: 'Applicateurs', icon: '⚡', color: 'yellow' },
  ];

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

    // FC equipment tabs: all + per zone
    filtered = filtered.filter((eq) => eq.categorie === 'equipement');

    if (categorie.startsWith('zone:')) {
      const selectedZone = categorie.slice(5);
      filtered = filtered.filter((eq) => eq.Zone?.nom_zone === selectedZone);
    }
    
    // Filter by search
    filtered = filtered.filter((eq) =>
      eq.code_rai?.toLowerCase().includes(search.toLowerCase()) ||
      eq.designation?.toLowerCase().includes(search.toLowerCase())
    );
    
    return filtered;
  };

  const filteredEquipements = getFilteredEquipements();
  const currentCategory = categories.find(c => c.id === categorie);
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
    teal: 'bg-teal-50 border-teal-200',
    orange: 'bg-orange-50 border-orange-200',
    yellow: 'bg-yellow-50 border-yellow-200',
  };

  const buttonColorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800',
    purple: 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800',
    teal: 'bg-teal-600 hover:bg-teal-700 active:bg-teal-800',
    orange: 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800',
    yellow: 'bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800',
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

  const handleCreateNew = () => {
    if (categorie === 'pinces' || categorie === 'applicateurs') {
      setIsCreatingNew(true);
    } else {
      alert('Veuillez sélectionner une catégorie d\'équipement première');
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
          <h1 className="text-2xl font-bold">{currentCategory?.icon} {currentCategory?.label}</h1>
          <p className="text-sm text-gray-500">{filteredEquipements.length} équipement(s)</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className={`${buttonColorClasses[currentCategory?.color] || buttonColorClasses.blue} text-white px-4 py-2 rounded font-medium`}
        >
          + Nouvel équipement
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 auto-fit">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSearchParams({ categorie: cat.id })}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                categorie === cat.id
                  ? `${buttonColorClasses[cat.color] || buttonColorClasses.blue} text-white shadow-md`
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
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
