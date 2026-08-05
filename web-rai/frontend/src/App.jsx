import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ListeEquipements from './pages/Inventaire/ListeEquipements.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import CalendrierPreventif from './pages/Preventif/CalendrierPreventif.jsx';
import SuiviPreventifPinces from './pages/Preventif/SuiviPreventifPinces.jsx';
import SuiviPreventifApplicateurs from './pages/Preventif/SuiviPreventifApplicateurs.jsx';
import SuiviFerBain from './pages/Preventif/SuiviFerBain.jsx';
import FichesMaintenance from './pages/Preventif/FichesMaintenance.jsx';
import CreateMachineTemplate from './pages/Preventif/CreateMachineTemplate.jsx';
import SuiviCuratif from './pages/Curatif/SuiviCuratif.jsx';
import IndicateurCuratif from './pages/Curatif/IndicateurCuratif.jsx';
import EtatECME from './pages/ECME/EtatECME.jsx';
import SuiviECME from './pages/ECME/SuiviECME.jsx';
import FicheDeVie from './pages/ECME/FicheDeVie.jsx';
import IndustrializationIndex from './pages/Industrialization/IndustrializationIndex.jsx';
import ChiffrageDetail from './pages/Industrialization/ChiffrageDetail.jsx';
import CatalogueFournisseurs from './pages/Industrialization/CatalogueFournisseurs.jsx';
import CatalogueConnecteurs from './pages/Industrialization/CatalogueConnecteurs.jsx';
import FlowChartsIndex from './pages/Industrialization/FlowChartsIndex.jsx';
import FlowChartEditor from './pages/Industrialization/FlowChartEditor.jsx';
import FlowChartViewer from './pages/Industrialization/FlowChartViewer.jsx';
import TestCables from './pages/Industrialization/TestCables.jsx';
import SuiviMoyensIndex from './pages/Industrialization/SuiviMoyensIndex.jsx';
import SuiviMoyensDetail from './pages/Industrialization/SuiviMoyensDetail.jsx';
import OutillagesInventaire from './pages/Industrialization/OutillagesInventaire.jsx';
import GammeFabrication from './pages/Industrialization/GammeFabrication.jsx';
import AdminUsers from './pages/Admin/AdminUsers.jsx';
import Assistant from './pages/Assistant/Assistant.jsx';

const App = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/assistant" element={<Assistant />} />
    <Route path="/inventaire" element={<ListeEquipements />} />
    <Route path="/preventif" element={<CalendrierPreventif />} />
    <Route path="/preventif/suivi-pinces" element={<SuiviPreventifPinces />} />
    <Route path="/preventif/suivi-applicateurs" element={<SuiviPreventifApplicateurs />} />
    <Route path="/preventif/suivi-fer-bain" element={<SuiviFerBain />} />
    <Route path="/preventif/fiches-maintenance/create" element={<CreateMachineTemplate />} />
    <Route path="/preventif/fiches-maintenance" element={<FichesMaintenance />} />
    <Route path="/preventif/fiches-maintenance/:machineKey" element={<FichesMaintenance />} />
    <Route path="/preventif/fiches-maintenance/fiche/:sheetId" element={<FichesMaintenance />} />
    <Route path="/curatif" element={<SuiviCuratif />} />
    <Route path="/curatif/suivi" element={<SuiviCuratif />} />
    <Route path="/curatif/indicateur" element={<IndicateurCuratif />} />
    <Route path="/ecme" element={<EtatECME />} />
    <Route path="/ecme/suivi" element={<SuiviECME />} />
    <Route path="/ecme/:code" element={<FicheDeVie />} />
    <Route path="/industrialization" element={<IndustrializationIndex />} />
    <Route path="/industrialization/connecteurs" element={<CatalogueConnecteurs />} />
    <Route path="/industrialization/fournisseurs" element={<CatalogueFournisseurs />} />
    <Route path="/industrialization/flow-chart" element={<FlowChartsIndex />} />
    <Route path="/industrialization/flow-chart/:id" element={<FlowChartEditor />} />
    <Route path="/industrialization/flow-chart/:id/view" element={<FlowChartViewer />} />
    <Route path="/industrialization/chiffrage/:id" element={<ChiffrageDetail />} />
    <Route path="/industrialization/test-cables" element={<TestCables />} />
    <Route path="/industrialization/suivi-moyens" element={<SuiviMoyensIndex />} />
    <Route path="/industrialization/suivi-moyens/:id" element={<SuiviMoyensDetail />} />
    <Route path="/inventaire/outillages" element={<OutillagesInventaire />} />
    <Route path="/industrialization/gamme-fab" element={<GammeFabrication />} />
    <Route path="/admin/users" element={<AdminUsers />} />
  </Routes>
);

export default App;
