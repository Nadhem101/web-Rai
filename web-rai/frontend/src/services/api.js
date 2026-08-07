import axios from 'axios';
import { supabase } from '../lib/supabase';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

// Attach Supabase JWT to every request (skipped if Supabase not configured)
API.interceptors.request.use(async (config) => {
  if (!supabase) return config;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch {
    // silent
  }
  return config;
});

export const equipementService = {
  getAll: () => API.get('/equipements'),
  getById: (id) => API.get(`/equipements/${id}`),
  create: (data) => API.post('/equipements', data),
  update: (id, data) => API.put(`/equipements/${id}`, data),
  delete: (id) => API.delete(`/equipements/${id}`),
};

export const zoneService = {
  getAll: () => API.get('/zones'),
};

export const fabricantService = {
  getAll: () => API.get('/fabricants'),
};

export const pinceService = {
  getAll: () => API.get('/pinces'),
  getById: (id) => API.get(`/pinces/${id}`),
  create: (data) => API.post('/pinces', data),
  update: (id, data) => API.put(`/pinces/${id}`, data),
  delete: (id) => API.delete(`/pinces/${id}`),
};

export const pincePreventiveService = {
  getAll: () => API.get('/pince-preventive-records').then((res) => res.data),
  getById: (id) => API.get(`/pince-preventive-records/${id}`).then((res) => res.data),
  create: (data) => API.post('/pince-preventive-records', data).then((res) => res.data),
  update: (id, data) => API.put(`/pince-preventive-records/${id}`, data).then((res) => res.data),
  delete: (id) => API.delete(`/pince-preventive-records/${id}`).then((res) => res.data),
  // Maintenance cycle: archives active records then creates new ones with date +6M
  startMaintenance: (data) => API.post('/pince-preventive-records/maintenance', data).then((res) => res.data),
  getHistorique: () => API.get('/pince-preventive-records/historique').then((res) => res.data),
  getHistoriqueByPince: (numero_pince) =>
    API.get(`/pince-preventive-records/historique/${encodeURIComponent(numero_pince)}`).then((res) => res.data),
};

export const applicateurPreventiveService = {
  getAll: () => API.get('/applicateur-preventive-records').then((res) => res.data),
  getById: (id) => API.get(`/applicateur-preventive-records/${id}`).then((res) => res.data),
  create: (data) => API.post('/applicateur-preventive-records', data).then((res) => res.data),
  update: (id, data) => API.put(`/applicateur-preventive-records/${id}`, data).then((res) => res.data),
  delete: (id) => API.delete(`/applicateur-preventive-records/${id}`).then((res) => res.data),
  startMaintenance: (data) => API.post('/applicateur-preventive-records/maintenance', data).then((res) => res.data),
  getHistorique: () => API.get('/applicateur-preventive-records/historique').then((res) => res.data),
  getHistoriqueByOutil: (numero_outil) =>
    API.get(`/applicateur-preventive-records/historique/${encodeURIComponent(numero_outil)}`).then((res) => res.data),
};

export const cosseService = {
  getAll: () => API.get('/cosses').then((res) => res.data),
  getById: (id) => API.get(`/cosses/${id}`).then((res) => res.data),
  create: (data) => API.post('/cosses', data).then((res) => res.data),
  update: (id, data) => API.put(`/cosses/${id}`, data).then((res) => res.data),
  delete: (id) => API.delete(`/cosses/${id}`).then((res) => res.data),
};

export const maintenanceEventService = {
  // fetch all events for a given year
  getByYear: (year) => API.get('/maintenance-events', { params: { year } }),
  // create or update an event
  upsert: (data) => API.put('/maintenance-events', data),
  // delete (reset) an event
  remove: (data) => API.delete('/maintenance-events', { data }),
};

export const maintenanceSheetService = {
  getAll: (params = {}) => API.get('/maintenance-sheets', { params }).then((res) => res.data),
  getById: (id) => API.get(`/maintenance-sheets/${id}`).then((res) => res.data),
  getLatestByMachine: (machineKey) => API.get(`/maintenance-sheets/latest/${machineKey}`).then((res) => res.data),
  create: (data) => API.post('/maintenance-sheets', data).then((res) => res.data),
  update: (id, data) => API.put(`/maintenance-sheets/${id}`, data).then((res) => res.data),
  finish: (id, data) => API.post(`/maintenance-sheets/${id}/finish`, data).then((res) => res.data),
};

export const ferBainRecordService = {
  getAll: () => API.get('/fer-bain-records').then((res) => res.data),
  getByEquipement: (equipementId) => API.get(`/fer-bain-records/equipement/${equipementId}`).then((res) => res.data),
  create: (data) => API.post('/fer-bain-records', data).then((res) => res.data),
  update: (id, data) => API.put(`/fer-bain-records/${id}`, data).then((res) => res.data),
  delete: (id) => API.delete(`/fer-bain-records/${id}`).then((res) => res.data),
};

export const curativeMaintenanceService = {
  getAll: (params = {}) => API.get('/curative-maintenance-records', { params }).then((res) => res.data),
  getById: (id) => API.get(`/curative-maintenance-records/${id}`).then((res) => res.data),
  create: (data) => API.post('/curative-maintenance-records', data).then((res) => res.data),
  update: (id, data) => API.put(`/curative-maintenance-records/${id}`, data).then((res) => res.data),
  delete: (id) => API.delete(`/curative-maintenance-records/${id}`).then((res) => res.data),
  getMonthlySummary: (params = {}) => API.get('/curative-maintenance-records/summary/monthly', { params }).then((res) => res.data),
};

export const ecmeService = {
  getAll:          (params) => API.get('/ecme', { params }),
  getOne:          (code)   => API.get(`/ecme/${code}`),
  getAffectations: ()       => API.get('/ecme/meta/affectations'),
  create:          (data)   => API.post('/ecme', data),
  update:          (code, data) => API.put(`/ecme/${code}`, data),
  delete:          (code)   => API.delete(`/ecme/${code}`),
  // Interventions
  createIntervention: (code, data) => API.post(`/ecme/${code}/interventions`, data).then(r => r.data),
  updateIntervention: (code, id, data) => API.put(`/ecme/${code}/interventions/${id}`, data).then(r => r.data),
  deleteIntervention: (code, id) => API.delete(`/ecme/${code}/interventions/${id}`).then(r => r.data),
};

export const applicateurService = {
  getAll: () => API.get('/applicateurs').then(res => res.data),
  getById: (id) => API.get(`/applicateurs/${id}`).then(res => res.data),
  create: (data) => API.post('/applicateurs', data).then(res => res.data),
  update: (id, data) => API.put(`/applicateurs/${id}`, data).then(res => res.data),
  delete: (id) => API.delete(`/applicateurs/${id}`).then(res => res.data),
};

export const applicateurThresholdService = {
  getAll: () => API.get('/applicateur-thresholds').then((res) => res.data),
};

export const fournisseurCatalogueService = {
  getAll:  (params = {}) => API.get('/fournisseurs-catalogue', { params }).then(r => r.data),
  create:  (data)        => API.post('/fournisseurs-catalogue', data).then(r => r.data),
  update:  (id, data)    => API.put(`/fournisseurs-catalogue/${id}`, data).then(r => r.data),
  delete:  (id)          => API.delete(`/fournisseurs-catalogue/${id}`).then(r => r.data),
};

export const connecteurCatalogueService = {
  getAll:  (params = {}) => API.get('/connecteurs-catalogue', { params }).then(r => r.data),
  getById: (id)          => API.get(`/connecteurs-catalogue/${id}`).then(r => r.data),
  create:  (data)        => API.post('/connecteurs-catalogue', data).then(r => r.data),
  update:  (id, data)    => API.put(`/connecteurs-catalogue/${id}`, data).then(r => r.data),
  delete:  (id)          => API.delete(`/connecteurs-catalogue/${id}`).then(r => r.data),
};

export const chiffrageService = {
  getAll:  (params = {}) => API.get('/chiffrages', { params }).then(r => r.data),
  getById: (id)          => API.get(`/chiffrages/${id}`).then(r => r.data),
  create:  (data)        => API.post('/chiffrages', data).then(r => r.data),
  update:  (id, data)    => API.put(`/chiffrages/${id}`, data).then(r => r.data),
  delete:  (id)          => API.delete(`/chiffrages/${id}`).then(r => r.data),
};

export const chiffrageLigneService = {
  create: (data)       => API.post('/chiffrage-lignes', data).then(r => r.data),
  update: (id, data)   => API.put(`/chiffrage-lignes/${id}`, data).then(r => r.data),
  delete: (id)         => API.delete(`/chiffrage-lignes/${id}`).then(r => r.data),
};

export const machineTemplateService = {
  getAll:  ()          => API.get('/machine-templates').then(r => r.data),
  create:  (data)      => API.post('/machine-templates', data).then(r => r.data),
  update:  (id, data)  => API.put(`/machine-templates/${id}`, data).then(r => r.data),
  delete:  (id)        => API.delete(`/machine-templates/${id}`).then(r => r.data),
};

export const flowchartService = {
  getAll:  (params = {}) => API.get('/flowcharts', { params }).then(r => r.data),
  getById: (id)          => API.get(`/flowcharts/${id}`).then(r => r.data),
  create:  (data)        => API.post('/flowcharts', data).then(r => r.data),
  update:  (id, data)    => API.put(`/flowcharts/${id}`, data).then(r => r.data),
  delete:  (id)          => API.delete(`/flowcharts/${id}`).then(r => r.data),
};

export const suiviMoyenService = {
  getAll:  ()        => API.get('/suivi-moyens').then(r => r.data),
  getById: (id)      => API.get(`/suivi-moyens/${id}`).then(r => r.data),
  create:  (data)    => API.post('/suivi-moyens', data).then(r => r.data),
  update:  (id, data)=> API.put(`/suivi-moyens/${id}`, data).then(r => r.data),
  delete:  (id)      => API.delete(`/suivi-moyens/${id}`).then(r => r.data),
};

export const suiviMoyenLigneService = {
  create:  (data)    => API.post('/suivi-moyen-lignes', data).then(r => r.data),
  update:  (id, data)=> API.put(`/suivi-moyen-lignes/${id}`, data).then(r => r.data),
  delete:  (id)      => API.delete(`/suivi-moyen-lignes/${id}`).then(r => r.data),
};

export const procedureService = {
  getAll:  (params = {}) => API.get('/procedures', { params }).then(r => r.data),
  getById: (id)          => API.get(`/procedures/${id}`).then(r => r.data),
  create:  (data)        => API.post('/procedures', data).then(r => r.data),
  update:  (id, data)    => API.put(`/procedures/${id}`, data).then(r => r.data),
  delete:  (id)          => API.delete(`/procedures/${id}`).then(r => r.data),
};

export const articleTestService = {
  getAll:   (params = {}) => API.get('/articles-test', { params }).then((res) => res.data),
  getById:  (id)          => API.get(`/articles-test/${id}`).then((res) => res.data),
  create:   (data)        => API.post('/articles-test', data).then((res) => res.data),
  update:   (id, data)    => API.put(`/articles-test/${id}`, data).then((res) => res.data),
  delete:   (id)          => API.delete(`/articles-test/${id}`).then((res) => res.data),
};

export const outillageService = {
  getAll:  ()         => API.get('/outillages').then(r => r.data),
  getById: (id)       => API.get(`/outillages/${id}`).then(r => r.data),
  create:  (data)     => API.post('/outillages', data).then(r => r.data),
  update:  (id, data) => API.put(`/outillages/${id}`, data).then(r => r.data),
  delete:  (id)       => API.delete(`/outillages/${id}`).then(r => r.data),
};

export const gammeFabService = {
  getAll:                   ()         => API.get('/gamme-fab').then(r => r.data),
  getById:                  (id)       => API.get(`/gamme-fab/${id}`).then(r => r.data),
  createProcessus:          (data)     => API.post('/gamme-fab', data).then(r => r.data),
  updateProcessus:          (id, data) => API.put(`/gamme-fab/${id}`, data).then(r => r.data),
  deleteProcessus:          (id)       => API.delete(`/gamme-fab/${id}`).then(r => r.data),
  createEtape:              (data)     => API.post('/gamme-fab/etapes', data).then(r => r.data),
  updateEtape:              (id, data) => API.put(`/gamme-fab/etapes/${id}`, data).then(r => r.data),
  deleteEtape:              (id)       => API.delete(`/gamme-fab/etapes/${id}`).then(r => r.data),
  addOutillageToEtape:      (data)     => API.post('/gamme-fab/etapes/outillages', data).then(r => r.data),
  removeOutillageFromEtape: (id)       => API.delete(`/gamme-fab/etapes/outillages/${id}`).then(r => r.data),
};

export const assistantService = {
  // `history` is the opaque provider-shaped message array returned by the
  // previous call — pass it straight back to continue the conversation.
  chat: (message, history = []) => API.post('/assistant/chat', { message, history }).then((res) => res.data),
};
