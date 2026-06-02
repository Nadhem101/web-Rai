import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Skeleton data - to be replaced with database data later
const PROTOTYPES_SKELETON = [
  {
    id: 1,
    name: 'Prototype 1',
    affaire: 'OP-25_EA1800-04_Ind A',
    client: 'Perciculture',
    dateCreation: '27/03/2025',
    status: 'En cours',
  },
  {
    id: 2,
    name: 'Prototype 2',
    affaire: 'OP-25_EA1800-05_Ind B',
    client: 'Agriculture',
    dateCreation: '20/03/2025',
    status: 'Planifié',
  },
  {
    id: 3,
    name: 'Prototype 3',
    affaire: 'OP-25_EA1800-06_Ind C',
    client: 'Viticulture',
    dateCreation: '15/03/2025',
    status: 'En cours',
  },
  {
    id: 4,
    name: 'Prototype 4',
    affaire: 'OP-25_EA1800-07_Ind D',
    client: 'Arboriculture',
    dateCreation: '05/03/2025',
    status: 'Validé',
  },
  {
    id: 5,
    name: 'Prototype 5',
    affaire: 'OP-25_EA1800-08_Ind E',
    client: 'Horticulture',
    dateCreation: '28/02/2025',
    status: 'Archivé',
  },
];

const IndustrializationIndex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [prototypes] = useState(PROTOTYPES_SKELETON);
  const activeTab = location.pathname.includes('/industrialization/gammes')
    ? 'gammes'
    : location.pathname.includes('/industrialization/flow-chart')
    ? 'flow-chart'
    : 'chiffrage';

  const handlePrototypeClick = (prototype) => {
    navigate(`/industrialization/chiffrage/${prototype.id}`, { state: { prototype } });
  };

  return (
    <div className="p-6 flex-1 overflow-auto flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Industrialisation</h1>
        <p className="text-sm text-slate-600 mt-2">Gestion des prototypes et costing</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-slate-200">
        <div className="flex gap-8">
          <button
            type="button"
            onClick={() => navigate('/industrialization')}
            className={`px-4 py-3 border-b-2 font-medium transition ${
              activeTab === 'chiffrage'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-200'
            }`}
          >
            📊 Chiffrage
          </button>
          <button
            type="button"
            onClick={() => navigate('/industrialization/gammes')}
            className={`px-4 py-3 border-b-2 font-medium transition ${
              activeTab === 'gammes'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-200'
            }`}
          >
            📋 Gammes
          </button>
          <button
            type="button"
            disabled
            className="px-4 py-3 border-b-2 border-transparent text-slate-600 font-medium"
          >
            📈 Devis
          </button>
        </div>
      </div>

      {/* Prototypes List */}
      <div className="grid gap-4">
        {prototypes.map((prototype) => (
          <div
            key={prototype.id}
            onClick={() => handlePrototypeClick(prototype)}
            className="bg-white rounded-lg shadow border border-slate-200 hover:shadow-lg hover:border-blue-300 transition cursor-pointer p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900">{prototype.name}</h3>
                <p className="text-sm text-slate-600 mt-1">
                  <span className="font-medium">Affaire:</span> {prototype.affaire}
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Client:</span> {prototype.client}
                </p>
              </div>
              <div className="text-right ml-6">
                <p className="text-xs text-slate-500">Créé le</p>
                <p className="text-sm font-medium text-slate-700">{prototype.dateCreation}</p>
                <div className="mt-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      prototype.status === 'En cours'
                        ? 'bg-blue-100 text-blue-800'
                        : prototype.status === 'Planifié'
                        ? 'bg-amber-100 text-amber-800'
                        : prototype.status === 'Validé'
                        ? 'bg-green-100 text-green-800'
                        : prototype.status === 'Archivé'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {prototype.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {prototypes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-slate-500 text-lg">Aucun prototype créé</p>
          <p className="text-slate-400 text-sm mt-2">Commencez par créer un nouveau chiffrage</p>
        </div>
      )}
    </div>
  );
};

export default IndustrializationIndex;
