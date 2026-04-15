import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { equipementService } from '../../services/api';
import PincesList from '../../components/PincesList';
import ApplicateursList from '../../components/ApplicateursList';
import CossesList from '../../components/CossesList';
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

const formatPdrCell = (value) => value || '-';

const normalizeText = (value) => {
  if (!value) return '';
  return value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

const isFerEtBainItem = (equipement) => {
  const designation = normalizeText(equipement.designation);
  return designation.includes('fer a souder') || designation.includes('bain creuset');
};

const ListeEquipements = () => {
  const [searchParams] = useSearchParams();
  const [equipements, setEquipements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  const rawCategorie = searchParams.get('categorie') || 'equipement-all';
  const categorie = rawCategorie === 'all' || rawCategorie === 'equipement' ? 'equipement-all' : rawCategorie;
  const isSpecialCatalogue = ['pinces', 'applicateurs', 'cosses'].includes(categorie);

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
    'cosses': { label: '🔗 Cosses', icon: '🔗' },
    'fer-et-bain': { label: '🔥 Fer et bain', icon: '🔥' },
    'pdr': { label: '🧰 PDR', icon: '🧰' },
    ...zoneMap,
  };

  const currentCategory = categoryMap[categorie] || { label: 'Équipements', icon: '📋' };

  const searchPlaceholder = (() => {
    switch (categorie) {
      case 'pinces':
        return '🔍 Rechercher une pince, un fabricant ou une référence...';
      case 'applicateurs':
        return '🔍 Rechercher un applicateur, une référence ou un constructeur...';
      case 'cosses':
        return '🔍 Rechercher une cosse, une référence ou un outillage...';
      case 'fer-et-bain':
        return '🔍 Rechercher un fer à souder ou un bain creuset...';
      case 'pdr':
        return '🔍 Rechercher une piece de rechange, une reference ou un applicateur...';
      default:
        return '🔍 Rechercher par code ou désignation...';
    }
  })();

  useEffect(() => {
    if (isSpecialCatalogue) {
      setLoading(false);
      return;
    }

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
    
    if (categorie === 'pinces' || categorie === 'applicateurs' || categorie === 'cosses') {
      return [];
    }

    const allowedCategories =
      categorie === 'pdr'
        ? ['pdr']
        : categorie === 'fer-et-bain'
          ? ['equipement', 'pdr']
        : ['equipement', 'pdr'];

    filtered = filtered.filter((eq) => allowedCategories.includes(eq.categorie));

    if (categorie === 'fer-et-bain') {
      filtered = filtered.filter((eq) => isFerEtBainItem(eq));
    }

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
      eq.designation?.toLowerCase().includes(search.toLowerCase()) ||
      eq.numero_serie?.toLowerCase().includes(search.toLowerCase()) ||
      eq.remarque?.toLowerCase().includes(search.toLowerCase()) ||
      JSON.stringify(eq.pdr_details || {}).toLowerCase().includes(search.toLowerCase())
    );
    
    return filtered;
  };

  const filteredEquipements = getFilteredEquipements();

  const categorySummary = (() => {
    switch (categorie) {
      case 'pinces':
        return 'Catalogue des pinces de sertissage';
      case 'applicateurs':
        return 'Catalogue des applicateurs faisceaux';
      case 'cosses':
        return 'Références extraites du CSV fourni';
      case 'fer-et-bain':
        return 'Regroupement des fers à souder et bains creusets';
      case 'pdr':
        return 'Stock des pièces de rechange extrait du CSV';
      default:
        return `${filteredEquipements.length} équipement(s)`;
    }
  })();

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
          <p className="text-sm text-gray-500">{categorySummary}</p>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder={searchPlaceholder}
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
      ) : categorie === 'cosses' ? (
        <CossesList searchQuery={search} />
      ) : filteredEquipements.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">
            {categorie === 'pdr' ? 'Aucune pièce de rechange trouvée' : 'Aucun équipement trouvé'}
          </p>
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
                  {categorie === 'pdr' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lame cuivre réf.</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lame cuivre qté</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lame isolant réf.</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lame isolant qté</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enclume cuivre réf.</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enclume cuivre qté</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enclume isolant réf.</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enclume isolant qté</th>
                    </>
                  )}
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
                    {categorie === 'pdr' && (
                      <>
                        <td className="px-6 py-4 text-sm text-gray-700">{formatPdrCell(eq.pdr_details?.lame_cuivre?.reference)}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{formatPdrCell(eq.pdr_details?.lame_cuivre?.quantity)}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{formatPdrCell(eq.pdr_details?.lame_isolant?.reference)}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{formatPdrCell(eq.pdr_details?.lame_isolant?.quantity)}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{formatPdrCell(eq.pdr_details?.enclume_cuivre?.reference)}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{formatPdrCell(eq.pdr_details?.enclume_cuivre?.quantity)}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{formatPdrCell(eq.pdr_details?.enclume_isolant?.reference)}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{formatPdrCell(eq.pdr_details?.enclume_isolant?.quantity)}</td>
                      </>
                    )}
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
