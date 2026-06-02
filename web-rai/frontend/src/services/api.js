import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
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

export const articleTestService = {
  getAll:   (params = {}) => API.get('/articles-test', { params }).then((res) => res.data),
  getById:  (id)          => API.get(`/articles-test/${id}`).then((res) => res.data),
  create:   (data)        => API.post('/articles-test', data).then((res) => res.data),
  update:   (id, data)    => API.put(`/articles-test/${id}`, data).then((res) => res.data),
  delete:   (id)          => API.delete(`/articles-test/${id}`).then((res) => res.data),
};
