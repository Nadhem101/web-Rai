import React, { useState } from 'react';
import { Routes, Route, Link, NavLink } from 'react-router-dom';
import ListeEquipements from './pages/Inventaire/ListeEquipements.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import CalendrierPreventif from './pages/Preventif/CalendrierPreventif.jsx';
import EtatECME from './pages/ECME/EtatECME.jsx';
import FicheDeVie from './pages/ECME/FicheDeVie.jsx';

const App = () => {
  const [inventaireExpanded, setInventaireExpanded] = useState(false);

  const inventaireCategories = [
    { id: 'equipement-all', label: 'Tous les équipements FC', icon: '📋' },
    { id: 'pinces', label: 'Pinces', icon: '🔨' },
    { id: 'applicateurs', label: 'Applicateurs', icon: '⚡' },
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
                {inventaireCategories.map((cat) => (
                  <NavLink
                    key={cat.id}
                    to={`/inventaire?categorie=${cat.id}`}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm ${
                        isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    {cat.icon} {cat.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          <NavLink
            to="/preventif"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            🗓️ Calendrier préventif
          </NavLink>
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
