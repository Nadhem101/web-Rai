import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import ListeEquipements from './pages/Inventaire/ListeEquipements.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import CalendrierPreventif from './pages/Preventif/CalendrierPreventif.jsx';
import SuiviPreventifPinces from './pages/Preventif/SuiviPreventifPinces.jsx';
import SuiviPreventifApplicateurs from './pages/Preventif/SuiviPreventifApplicateurs.jsx';
import FichesMaintenance from './pages/Preventif/FichesMaintenance.jsx';
import CreateMachineTemplate from './pages/Preventif/CreateMachineTemplate.jsx';
import SuiviCuratif from './pages/Curatif/SuiviCuratif.jsx';
import IndicateurCuratif from './pages/Curatif/IndicateurCuratif.jsx';
import EtatECME from './pages/ECME/EtatECME.jsx';
import FicheDeVie from './pages/ECME/FicheDeVie.jsx';
import IndustrializationIndex from './pages/Industrialization/IndustrializationIndex.jsx';
import ChiffrageDetail from './pages/Industrialization/ChiffrageDetail.jsx';
import FlowChartDetail from './pages/Industrialization/FlowChartDetail.jsx';
import TestCables from './pages/Industrialization/TestCables.jsx';
import { maintenanceSheetService } from './services/api';
import {
  LayoutDashboard,
  Package,
  Wrench,
  Zap,
  Flame,
  Box,
  CalendarCheck,
  Calendar,
  FileText,
  ClipboardList,
  BarChart2,
  FlaskConical,
  Factory,
  GitBranch,
  ChevronDown,
  Link2,
  ChevronRight,
  List,
  Cable,
} from 'lucide-react';

// ── Design tokens ──────────────────────────────────────────
const SIDEBAR_BG = '#0f1d35';

// ── Reusable nav components ───────────────────────────────
const NavItem = ({ to, icon: Icon, label, badge, end }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
        isActive
          ? 'bg-sky-500/15 text-sky-300'
          : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
      }`
    }
  >
    <Icon className="w-4 h-4 flex-shrink-0" />
    <span className="flex-1 truncate">{label}</span>
    {badge > 0 && (
      <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-red-500 text-white">
        {badge}
      </span>
    )}
  </NavLink>
);

const SubNavItem = ({ to, label, badge }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-2.5 px-3 py-[7px] ml-4 rounded-md text-xs transition-colors duration-150 ${
        isActive
          ? 'text-sky-300 bg-sky-500/10 font-semibold'
          : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
      }`
    }
  >
    <span className="w-1 h-1 rounded-full bg-current opacity-60 flex-shrink-0" />
    <span className="flex-1 truncate">{label}</span>
    {badge > 0 && (
      <span className="inline-flex items-center justify-center min-w-[16px] h-[16px] px-0.5 text-[9px] font-bold rounded-full bg-red-500 text-white">
        {badge}
      </span>
    )}
  </NavLink>
);

const ExpandBtn = ({ icon: Icon, label, expanded, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
      expanded
        ? 'text-white bg-white/[0.07]'
        : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
    }`}
  >
    <Icon className="w-4 h-4 flex-shrink-0" />
    <span className="flex-1 text-left truncate">{label}</span>
    {badge > 0 && (
      <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-red-500 text-white mr-1">
        {badge}
      </span>
    )}
    <ChevronDown
      className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${
        expanded ? 'rotate-180' : ''
      }`}
    />
  </button>
);

const SectionLabel = ({ label }) => (
  <p className="px-3 pt-5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600 select-none">
    {label}
  </p>
);

// ── Route → page name mapping ──────────────────────────────
const getPageName = (pathname) => {
  if (pathname === '/') return 'Tableau de bord';
  if (pathname.startsWith('/inventaire')) return 'Inventaire';
  if (pathname === '/preventif') return 'Calendrier préventif';
  if (pathname.startsWith('/preventif/suivi-pinces')) return 'Suivi des pinces';
  if (pathname.startsWith('/preventif/suivi-applicateurs')) return 'Suivi des applicateurs';
  if (pathname.startsWith('/preventif/fiches-maintenance')) return 'Fiches de maintenance';
  if (pathname.startsWith('/curatif/indicateur')) return 'Indicateur curatif';
  if (pathname.startsWith('/curatif')) return 'Suivi curatif';
  if (pathname.startsWith('/ecme')) return 'État des ECME';
  if (pathname.startsWith('/industrialization/flow-chart')) return 'Flow Chart';
  if (pathname.startsWith('/industrialization/test-cables')) return 'Test des câbles';
  if (pathname.startsWith('/industrialization')) return 'Industrialisation';
  return 'WEB-RAI';
};

// ── App ────────────────────────────────────────────────────
const App = () => {
  const location = useLocation();
  const pageName = getPageName(location.pathname);

  const [inventaireExpanded, setInventaireExpanded] = useState(false);
  const [equipementsExpanded, setEquipementsExpanded] = useState(true);
  const [maintenanceExpanded, setMaintenanceExpanded] = useState(false);
  const [curativeExpanded, setCurativeExpanded] = useState(false);
  const [completedMaintenanceCount, setCompletedMaintenanceCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const completed = await maintenanceSheetService.getAll({ status: 'completed' });
        if (isMounted) setCompletedMaintenanceCount(Array.isArray(completed) ? completed.length : 0);
      } catch {
        if (isMounted) setCompletedMaintenanceCount(0);
      }
    };
    load();
    const id = window.setInterval(load, 60000);
    return () => { isMounted = false; window.clearInterval(id); };
  }, []);

  const subZones = [
    // Assemblage Meca
    { group: 'Assemblage Meca', id: 'zone:Bobinage', label: 'Bobinage' },
    { group: 'Assemblage Meca', id: 'zone:Chevain Arnoux', label: 'Chevain Arnoux' },
    { group: 'Assemblage Meca', id: 'zone:Electro Aimants', label: 'Electro Aimants' },
    { group: 'Assemblage Meca', id: 'zone:Embases Relais', label: 'Embases Relais' },
    // Faisceau Cable
    { group: 'Faisceau Cable', id: 'zone:Khun', label: 'Khun' },
    { group: 'Faisceau Cable', id: 'zone:Club', label: 'Club' },
    { group: 'Faisceau Cable', id: 'zone:Cablage', label: 'Cablage' },
    // Individual zones
    { group: 'Electronique', id: 'zone:Electronique', label: 'Electronique', standalone: true },
    { group: 'Maintenance', id: 'zone:Maintenance', label: 'Maintenance', standalone: true },
  ];

  const zoneGroups = ['Assemblage Meca', 'Faisceau Cable'];

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <div className="min-h-screen h-screen flex overflow-hidden" style={{ background: 'var(--content-bg)' }}>

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside
        className="w-64 hidden md:flex flex-col flex-shrink-0"
        style={{ background: SIDEBAR_BG }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)' }}>
            <Factory className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-sm leading-tight tracking-wide">WEB-RAI</p>
            <p className="text-slate-500 text-[10px] leading-tight tracking-wide">Gestion Industrielle</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto sidebar-scroll space-y-0.5">

          <NavItem to="/" icon={LayoutDashboard} label="Tableau de bord" end />

          {/* ── GESTION DES ACTIFS ── */}
          <SectionLabel label="Gestion des actifs" />

          <ExpandBtn
            icon={Package}
            label="Inventaire"
            expanded={inventaireExpanded}
            onClick={() => setInventaireExpanded(!inventaireExpanded)}
          />

          {inventaireExpanded && (
            <div className="space-y-0.5 mt-0.5">
              {/* All equipment toggle */}
              <button
                onClick={() => setEquipementsExpanded(!equipementsExpanded)}
                className="w-full flex items-center gap-2.5 px-3 py-[7px] ml-4 rounded-md text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors"
              >
                <List className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="flex-1 text-left truncate">Tous les équipements</span>
                <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform duration-150 ${equipementsExpanded ? 'rotate-180' : ''}`} />
              </button>

              {equipementsExpanded && (
                <div className="ml-4 space-y-0.5">
                  {zoneGroups.map(group => (
                    <div key={group}>
                      <p className="px-3 pt-3 pb-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600 select-none">
                        {group}
                      </p>
                      {subZones.filter(z => z.group === group).map(zone => (
                        <SubNavItem key={zone.id} to={`/inventaire?categorie=${zone.id}`} label={zone.label} />
                      ))}
                    </div>
                  ))}
                  <div>
                    <p className="px-3 pt-3 pb-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600 select-none">
                      Autres zones
                    </p>
                    {subZones.filter(z => z.standalone).map(zone => (
                      <SubNavItem key={zone.id} to={`/inventaire?categorie=${zone.id}`} label={zone.label} />
                    ))}
                  </div>
                </div>
              )}

              <SubNavItem to="/inventaire?categorie=pinces" label="Pinces" />
              <SubNavItem to="/inventaire?categorie=applicateurs" label="Applicateurs" />
              <SubNavItem to="/inventaire?categorie=cosses" label="Cosses" />
              <SubNavItem to="/inventaire?categorie=fer-et-bain" label="Fer et bain" />
              <SubNavItem to="/inventaire?categorie=pdr" label="PDR — Pièces de rechange" />
            </div>
          )}

          {/* ── MAINTENANCE ── */}
          <SectionLabel label="Maintenance" />

          <ExpandBtn
            icon={CalendarCheck}
            label="Préventive"
            expanded={maintenanceExpanded}
            onClick={() => setMaintenanceExpanded(!maintenanceExpanded)}
            badge={completedMaintenanceCount}
          />

          {maintenanceExpanded && (
            <div className="space-y-0.5 mt-0.5">
              <SubNavItem to="/preventif" label="Calendrier préventif" />
              <SubNavItem to="/preventif/suivi-pinces" label="Suivi des pinces" />
              <SubNavItem to="/preventif/suivi-applicateurs" label="Suivi des applicateurs" />
              <SubNavItem to="/preventif/fiches-maintenance" label="Fiches machines" badge={completedMaintenanceCount} />
            </div>
          )}

          <ExpandBtn
            icon={Wrench}
            label="Curative"
            expanded={curativeExpanded}
            onClick={() => setCurativeExpanded(!curativeExpanded)}
          />

          {curativeExpanded && (
            <div className="space-y-0.5 mt-0.5">
              <SubNavItem to="/curatif" label="Suivi curatif" />
              <SubNavItem to="/curatif/indicateur" label="Indicateur curatif" />
            </div>
          )}

          {/* ── QUALITÉ & CONFORMITÉ ── */}
          <SectionLabel label="Qualité & Conformité" />

          <NavItem to="/ecme" icon={FlaskConical} label="État des ECME" />

          {/* ── INDUSTRIALISATION ── */}
          <SectionLabel label="Industrialisation" />

          <NavItem to="/industrialization" icon={Factory} label="Industrialisation" />
          <NavItem to="/industrialization/flow-chart" icon={GitBranch} label="Flow Chart" />
          <NavItem to="/industrialization/test-cables" icon={Cable} label="Test des câbles" />
        </nav>

        {/* Sidebar footer */}
        <div className="px-5 py-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-[10px] text-slate-600 select-none">RAI © {new Date().getFullYear()} · v1.0</p>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top header */}
        <header className="bg-white flex-shrink-0 px-6 py-0 flex items-center justify-between h-14"
          style={{ borderBottom: '1px solid #e2e8f0' }}>
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="md:hidden font-bold text-slate-800">WEB-RAI</Link>
            <span className="hidden md:inline text-slate-400 font-medium text-xs uppercase tracking-wider">WEB-RAI</span>
            <ChevronRight className="hidden md:inline w-3.5 h-3.5 text-slate-300" />
            <span className="hidden md:inline text-slate-700 font-semibold text-sm">{pageName}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-xs text-slate-400 font-medium">{todayCapitalized}</span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)' }}
            >
              R
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventaire" element={<ListeEquipements />} />
              <Route path="/preventif" element={<CalendrierPreventif />} />
              <Route path="/preventif/suivi-pinces" element={<SuiviPreventifPinces />} />
              <Route path="/preventif/suivi-applicateurs" element={<SuiviPreventifApplicateurs />} />
              <Route path="/preventif/fiches-maintenance/create" element={<CreateMachineTemplate />} />
              <Route path="/preventif/fiches-maintenance" element={<FichesMaintenance />} />
              <Route path="/preventif/fiches-maintenance/:machineKey" element={<FichesMaintenance />} />
              <Route path="/preventif/fiches-maintenance/fiche/:sheetId" element={<FichesMaintenance />} />
              <Route path="/curatif" element={<SuiviCuratif />} />
              <Route path="/curatif/suivi" element={<SuiviCuratif />} />
              <Route path="/curatif/indicateur" element={<IndicateurCuratif />} />
              <Route path="/ecme" element={<EtatECME />} />
              <Route path="/ecme/:code" element={<FicheDeVie />} />
              <Route path="/industrialization" element={<IndustrializationIndex />} />
              <Route path="/industrialization/gammes" element={<IndustrializationIndex />} />
              <Route path="/industrialization/flow-chart" element={<FlowChartDetail />} />
              <Route path="/industrialization/chiffrage/:id" element={<ChiffrageDetail />} />
              <Route path="/industrialization/test-cables" element={<TestCables />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
