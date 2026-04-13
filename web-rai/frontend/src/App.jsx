import React, { useState } from 'react';
import { Routes, Route, Link, NavLink } from 'react-router-dom';
import ListeEquipements from './pages/Inventaire/ListeEquipements.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import CalendrierPreventif from './pages/Preventif/CalendrierPreventif.jsx';
import SuiviPreventifPinces from './pages/Preventif/SuiviPreventifPinces.jsx';
import EtatECME from './pages/ECME/EtatECME.jsx';
import FicheDeVie from './pages/ECME/FicheDeVie.jsx';

const App = () => {
  const [inventaireExpanded, setInventaireExpanded] = useState(false);
  const [equipementsExpanded, setEquipementsExpanded] = useState(true);
  const [maintenanceExpanded, setMaintenanceExpanded] = useState(false);

  const zones = [
    { id: 'zone:Bobinage', label: 'Bobinage', icon: '🔄' },
    { id: 'zone:Câblage', label: 'Câblage', icon: '✂️' },
    { id: 'zone:Électronique', label: 'Électronique', icon: '💾' },
    { id: 'zone:Chauvin Arnoux', label: 'Chauvin Arnoux', icon: '⚙️' },
    { id: 'zone:Embases Relais', label: 'Embases Relais', icon: '🔌' },
    { id: 'zone:Kuhn', label: 'Kuhn', icon: '🏭' },
    { id: 'zone:Club', label: 'Club', icon: '🛠️' },
    { id: 'zone:Maintenance', label: 'Maintenance', icon: '🔧' },
    { id: 'zone:Électro-aimant', label: 'Électro-aimant', icon: '⚡' },
  ];

  const inventaireCategories = [
    { id: 'equipement-all', label: 'Tous les équipements', icon: '📋' },
  ];

  return (
    <div className="min-h-screen h-screen bg-gray-100 flex overflow-hidden">
      <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col">
        <div className="px-6 py-4 border-b">
          <h1 className="text-xl font-bold">WEB-RAI</h1>
          <p className="text-xs text-gray-500">Gestion des équipements</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            📊 Tableau de bord
          </NavLink>

          {/* Inventaire expandable menu */}
          <div>
            <button
              onClick={() => setInventaireExpanded(!inventaireExpanded)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between ${
                inventaireExpanded ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              📋 Inventaire
              <span className={`transform transition-transform ${inventaireExpanded ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {inventaireExpanded && (
              <div className="ml-4 mt-1 space-y-1">
                {/* All Equipment section */}
                <div>
                  <NavLink
                    to="/inventaire?categorie=equipement-all"
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between ${
                        isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                      }`
                    }
                    onClick={() => setEquipementsExpanded(!equipementsExpanded)}
                  >
                    📋 Tous les équipements
                    <span className={`transform transition-transform text-xs ${equipementsExpanded ? 'rotate-180' : ''}`}>▼</span>
                  </NavLink>
                  {equipementsExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {zones.map((zone) => (
                        <NavLink
                          key={zone.id}
                          to={`/inventaire?categorie=${zone.id}`}
                          className={({ isActive }) =>
                            `block px-3 py-2 rounded-md text-xs ${
                              isActive ? 'bg-teal-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                            }`
                          }
                        >
                          {zone.icon} {zone.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pinces */}
                <NavLink
                  to="/inventaire?categorie=pinces"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm ${
                      isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  🔨 Pinces
                </NavLink>

                {/* Applicateurs */}
                <NavLink
                  to="/inventaire?categorie=applicateurs"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm ${
                      isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  ⚡ Applicateurs
                </NavLink>

                {/* Cosses */}
                <NavLink
                  to="/inventaire?categorie=cosses"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm ${
                      isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  🔗 Cosses
                </NavLink>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setMaintenanceExpanded(!maintenanceExpanded)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between ${
                maintenanceExpanded ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              🗓️ Maintenance préventive
              <span className={`transform transition-transform ${maintenanceExpanded ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {maintenanceExpanded && (
              <div className="ml-4 mt-1 space-y-1">
                <NavLink
                  to="/preventif"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm ${
                      isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  🗓️ Calendrier préventif
                </NavLink>

                <NavLink
                  to="/preventif/suivi-pinces"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm ${
                      isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  🔨 Suivi preventive des pinces
                </NavLink>
              </div>
            )}
          </div>
          <NavLink
            to="/ecme"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            🔬 État des ECME
          </NavLink>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/" className="md:hidden font-semibold">
              WEB-RAI
            </Link>
            <span className="text-sm text-gray-500">Suivi des équipements ECME</span>
          </div>
        </header>

        <main className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventaire" element={<ListeEquipements />} />
              <Route path="/preventif" element={<CalendrierPreventif />} />
              <Route path="/preventif/suivi-pinces" element={<SuiviPreventifPinces />} />
              <Route path="/ecme" element={<EtatECME />} />
              <Route path="/ecme/:code" element={<FicheDeVie />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
