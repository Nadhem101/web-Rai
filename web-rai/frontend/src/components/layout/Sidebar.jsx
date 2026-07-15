import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  CalendarCheck,
  Wrench,
  FlaskConical,
  Factory,
  Link2,
  Truck,
  GitBranch,
  Cable,
  User,
  LogOut,
  ChevronDown,
  List,
  Sun,
  Moon,
  ScrollText,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import DataLabel from '../ui/DataLabel.jsx';
import { subZones, zoneGroups, inventaireFixedLinks, preventifLinks, curativeLinks } from './navConfig.js';

const navItemBase =
  'relative flex items-center gap-[11px] w-full px-3 py-[9px] rounded-[10px] cursor-pointer text-[13.5px] font-semibold text-left transition-colors duration-150';

const ActiveBar = () => (
  <span
    className="absolute top-1/2 -translate-y-1/2 rounded-r-[3px]"
    style={{ left: -12, width: 3, height: 18, background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }}
  />
);

const NavItem = ({ to, icon: Icon, label, badge, end }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `${navItemBase} ${isActive ? '' : 'hover:bg-[var(--panel3)] hover:text-[var(--text)]'}`
    }
    style={({ isActive }) => ({
      background: isActive ? 'var(--accent-soft)' : 'transparent',
      color: isActive ? 'var(--accent)' : 'var(--text2)',
    })}
  >
    {({ isActive }) => (
      <>
        {isActive && <ActiveBar />}
        <Icon className="w-[17px] h-[17px] flex-shrink-0" strokeWidth={1.8} />
        <span className="flex-1 truncate">{label}</span>
        {badge > 0 && (
          <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full text-white" style={{ background: 'var(--crit)' }}>
            {badge}
          </span>
        )}
      </>
    )}
  </NavLink>
);

const SubNavItem = ({ to, label, badge }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `relative flex items-center gap-[10px] px-3 py-[7px] ml-4 rounded-[8px] text-xs transition-colors duration-150 ${
        isActive ? '' : 'hover:bg-[var(--panel3)]'
      }`
    }
    style={({ isActive }) => ({
      color: isActive ? 'var(--accent)' : 'var(--text3)',
      background: isActive ? 'var(--accent-soft)' : 'transparent',
      fontWeight: isActive ? 600 : 500,
    })}
  >
    <span className="w-1 h-1 rounded-full bg-current opacity-60 flex-shrink-0" />
    <span className="flex-1 truncate">{label}</span>
    {badge > 0 && (
      <span className="inline-flex items-center justify-center min-w-[16px] h-[16px] px-0.5 text-[9px] font-bold rounded-full text-white" style={{ background: 'var(--crit)' }}>
        {badge}
      </span>
    )}
  </NavLink>
);

const ExpandBtn = ({ icon: Icon, label, expanded, onClick, badge }) => (
  <button onClick={onClick} className={navItemBase} style={{ background: expanded ? 'var(--panel3)' : 'transparent', color: expanded ? 'var(--text)' : 'var(--text2)' }}>
    <Icon className="w-[17px] h-[17px] flex-shrink-0" strokeWidth={1.8} />
    <span className="flex-1 truncate">{label}</span>
    {badge > 0 && (
      <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full text-white mr-1" style={{ background: 'var(--crit)' }}>
        {badge}
      </span>
    )}
    <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
  </button>
);

const ModuleLabel = ({ label }) => <DataLabel className="block px-3 pt-5 pb-1.5 !text-[8.5px]">{label}</DataLabel>;

const Sidebar = ({ menuOpen, completedMaintenanceCount = 0 }) => {
  const { user, roles, logout, can } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [inventaireExpanded, setInventaireExpanded] = useState(false);
  const [equipementsExpanded, setEquipementsExpanded] = useState(true);
  const [maintenanceExpanded, setMaintenanceExpanded] = useState(false);
  const [curativeExpanded, setCurativeExpanded] = useState(false);

  const displayName = user?.email?.split('@')[0] || 'Utilisateur';
  const role = roles?.[0] ? roles[0].charAt(0).toUpperCase() + roles[0].slice(1) : '';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <aside
      className={`w-[250px] flex-shrink-0 flex flex-col fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
        menuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{ background: 'var(--panel)', borderRight: '1px solid var(--border)' }}
    >
      {/* Logo block */}
      <div className="flex items-center gap-3 px-5 pt-[22px] pb-[18px]" style={{ borderBottom: '1px solid var(--border2)' }}>
        <div
          className="w-[38px] h-[38px] rounded-[11px] flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(150deg, var(--accent3), var(--accent2))', boxShadow: '0 4px 14px var(--accent-soft)' }}
        >
          <Factory className="w-5 h-5 text-white" strokeWidth={1.9} />
        </div>
        <div className="min-w-0 leading-none">
          <p className="font-display font-bold text-[17px] tracking-wide" style={{ color: 'var(--text)' }}>R.A.I.</p>
          <p className="font-mono text-[9px] tracking-[0.16em] mt-[3px]" style={{ color: 'var(--text3)' }}>CONTROL · MAINTENANCE</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-[10px] pb-1 overflow-y-auto sidebar-scroll flex flex-col gap-0.5">
        <NavItem to="/" icon={LayoutDashboard} label="Tableau de bord" end />

        <ModuleLabel label="Gestion des actifs" />
        <ExpandBtn icon={Package} label="Inventaire" expanded={inventaireExpanded} onClick={() => setInventaireExpanded((v) => !v)} />
        {inventaireExpanded && (
          <div className="space-y-0.5 mt-0.5">
            <button
              onClick={() => setEquipementsExpanded((v) => !v)}
              className="w-full flex items-center gap-2.5 px-3 py-[7px] ml-4 rounded-[8px] text-xs transition-colors hover:bg-[var(--panel3)]"
              style={{ color: 'var(--text3)' }}
            >
              <List className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="flex-1 text-left truncate">Tous les équipements</span>
              <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform duration-150 ${equipementsExpanded ? 'rotate-180' : ''}`} />
            </button>
            {equipementsExpanded && (
              <div className="ml-4 space-y-0.5">
                {zoneGroups.map((group) => (
                  <div key={group}>
                    <DataLabel className="block px-3 pt-3 pb-1 !text-[9px]">{group}</DataLabel>
                    {subZones.filter((z) => z.group === group).map((zone) => (
                      <SubNavItem key={zone.id} to={`/inventaire?categorie=${zone.id}`} label={zone.label} />
                    ))}
                  </div>
                ))}
                <div>
                  <DataLabel className="block px-3 pt-3 pb-1 !text-[9px]">Autres zones</DataLabel>
                  {subZones.filter((z) => z.standalone).map((zone) => (
                    <SubNavItem key={zone.id} to={`/inventaire?categorie=${zone.id}`} label={zone.label} />
                  ))}
                </div>
              </div>
            )}
            {inventaireFixedLinks.map((link) => (
              <SubNavItem key={link.to} to={link.to} label={link.label} />
            ))}
          </div>
        )}

        {can('maintenance') && (
          <>
            <ModuleLabel label="Maintenance" />
            <ExpandBtn icon={CalendarCheck} label="Préventive" expanded={maintenanceExpanded} onClick={() => setMaintenanceExpanded((v) => !v)} badge={completedMaintenanceCount} />
            {maintenanceExpanded && (
              <div className="space-y-0.5 mt-0.5">
                {preventifLinks(completedMaintenanceCount).map((link) => (
                  <SubNavItem key={link.to} to={link.to} label={link.label} badge={link.badge} />
                ))}
              </div>
            )}
            <ExpandBtn icon={Wrench} label="Curative" expanded={curativeExpanded} onClick={() => setCurativeExpanded((v) => !v)} />
            {curativeExpanded && (
              <div className="space-y-0.5 mt-0.5">
                {curativeLinks.map((link) => (
                  <SubNavItem key={link.to} to={link.to} label={link.label} />
                ))}
              </div>
            )}
          </>
        )}

        {can('ecme') && (
          <>
            <ModuleLabel label="Qualité &amp; Conformité" />
            <NavItem to="/ecme" icon={FlaskConical} label="État des ECME" />
          </>
        )}

        {can('indus') && (
          <>
            <ModuleLabel label="Industrialisation" />
            <NavItem to="/industrialization" icon={Factory} label="Chiffrage" />
            <NavItem to="/industrialization/connecteurs" icon={Link2} label="Catalogue connecteurs" />
            <NavItem to="/industrialization/fournisseurs" icon={Truck} label="Catalogue fournisseurs" />
            <NavItem to="/industrialization/flow-chart" icon={GitBranch} label="Flow Chart" />
            <NavItem to="/industrialization/test-cables" icon={Cable} label="Test des câbles" />
            <NavItem to="/industrialization/suivi-moyens" icon={CalendarCheck} label="Suivi des moyens" />
            <NavItem to="/industrialization/gamme-fab" icon={ScrollText} label="Gestion outillages" />
          </>
        )}

        {can('admin') && (
          <>
            <ModuleLabel label="Administration" />
            <NavItem to="/admin/users" icon={User} label="Gestion des accès" />
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="px-[14px] pt-[14px] pb-4 flex flex-col gap-3" style={{ borderTop: '1px solid var(--border2)' }}>
        <button
          onClick={toggleTheme}
          className="flex items-center justify-between gap-2.5 px-3 py-[9px] rounded-[10px] transition-colors"
          style={{ border: '1px solid var(--border)', background: 'var(--panel2)', color: 'var(--text2)' }}
        >
          <span className="flex items-center gap-2 text-[12.5px] font-semibold">
            {isDark ? <Moon className="w-4 h-4" strokeWidth={1.8} /> : <Sun className="w-4 h-4" strokeWidth={1.8} />}
            <span>Mode {isDark ? 'sombre' : 'clair'}</span>
          </span>
          <span className="font-mono text-[9px] tracking-[0.1em]" style={{ color: 'var(--text3)' }}>{isDark ? 'DARK' : 'LIGHT'}</span>
        </button>

        <div className="flex items-center gap-[11px]">
          <div
            className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center flex-shrink-0 font-display font-bold text-[13px]"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-[12.5px] font-bold truncate" style={{ color: 'var(--text)' }}>{displayName}</p>
            <p className="text-[11px] truncate" style={{ color: 'var(--text3)' }}>{role || user?.email}</p>
          </div>
          <button
            onClick={logout}
            title="Se déconnecter"
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors hover:bg-[var(--crit-soft)] hover:text-[var(--crit)]"
            style={{ color: 'var(--text3)' }}
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
