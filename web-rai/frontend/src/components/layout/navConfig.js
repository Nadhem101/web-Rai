// Static nav-tree data extracted from the old monolithic App.jsx sidebar.
// Inventaire's two-level expand/collapse behavior stays hand-written in
// Sidebar.jsx (it has its own local expand state) — this just holds the data
// it maps over.

export const subZones = [
  // Assemblage Meca
  { group: 'Assemblage Meca', id: 'zone:Bobinage', label: 'Bobinage' },
  { group: 'Assemblage Meca', id: 'zone:Embases Relais', label: 'Embases Relais' },
  // Faisceau Cable
  { group: 'Faisceau Cable', id: 'zone:Club', label: 'Club' },
  { group: 'Faisceau Cable', id: 'zone:Cablage', label: 'Cablage' },
  // Individual zones
  { group: 'Electronique', id: 'zone:Electronique', label: 'Electronique', standalone: true },
  { group: 'Maintenance', id: 'zone:Maintenance', label: 'Maintenance', standalone: true },
];

export const zoneGroups = ['Assemblage Meca', 'Faisceau Cable'];

export const inventaireFixedLinks = [
  { to: '/inventaire?categorie=pinces', label: 'Pinces' },
  { to: '/inventaire?categorie=applicateurs', label: 'Applicateurs' },
  { to: '/inventaire?categorie=cosses', label: 'Cosses' },
  { to: '/inventaire?categorie=fer-et-bain', label: 'Fer et bain' },
  { to: '/inventaire?categorie=pdr', label: 'PDR — Pièces de rechange' },
  { to: '/inventaire/outillages', label: 'Outillages' },
];

export const preventifLinks = (completedMaintenanceCount) => [
  { to: '/preventif', label: 'Calendrier préventif' },
  { to: '/preventif/suivi-pinces', label: 'Suivi des pinces' },
  { to: '/preventif/suivi-applicateurs', label: 'Suivi des applicateurs' },
  { to: '/preventif/suivi-fer-bain', label: 'Suivi fer et bain' },
  { to: '/preventif/fiches-maintenance', label: 'Fiches machines', badge: completedMaintenanceCount },
];

export const curativeLinks = [
  { to: '/curatif', label: 'Suivi curatif' },
  { to: '/curatif/indicateur', label: 'Indicateur curatif' },
];

// {match: pathname-prefix, number: '01'..'NN', title} — ordered, first match wins.
// Drives both the sidebar active-item highlighting context and the topbar
// screen number + title.
export const ROUTE_INFO = [
  { match: '/', exact: true, number: '01', title: 'Tableau de bord' },
  { match: '/inventaire', number: '02', title: 'Inventaire' },
  { match: '/preventif/suivi-pinces', number: '03', title: 'Suivi des pinces' },
  { match: '/preventif/suivi-applicateurs', number: '03', title: 'Suivi des applicateurs' },
  { match: '/preventif/suivi-fer-bain', number: '03', title: 'Suivi fer et bain' },
  { match: '/preventif/fiches-maintenance', number: '03', title: 'Fiches de maintenance' },
  { match: '/preventif', number: '03', title: 'Calendrier préventif' },
  { match: '/curatif/indicateur', number: '04', title: 'Indicateur curatif' },
  { match: '/curatif', number: '04', title: 'Suivi curatif' },
  { match: '/ecme', number: '05', title: 'État des ECME' },
  { match: '/industrialization/connecteurs', number: '06', title: 'Catalogue connecteurs' },
  { match: '/industrialization/fournisseurs', number: '06', title: 'Catalogue fournisseurs' },
  { match: '/industrialization/flow-chart', number: '06', title: 'Flow Chart' },
  { match: '/industrialization/test-cables', number: '06', title: 'Test des câbles' },
  { match: '/industrialization/suivi-moyens', number: '06', title: 'Suivi des moyens' },
  { match: '/inventaire/outillages', number: '02', title: 'Inventaire outillages' },
  { match: '/industrialization/gamme-fab', number: '06', title: 'Gestion outillages' },
  { match: '/industrialization', number: '06', title: 'Chiffrage' },
  { match: '/admin', number: '07', title: 'Administration' },
];

export const getRouteInfo = (pathname) => {
  for (const entry of ROUTE_INFO) {
    if (entry.exact ? pathname === entry.match : pathname.startsWith(entry.match)) {
      return entry;
    }
  }
  return { number: '00', title: 'WEB-RAI' };
};
