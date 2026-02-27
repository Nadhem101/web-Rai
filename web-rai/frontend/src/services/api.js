import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3001/api',
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

export const maintenanceEventService = {
  // fetch all events for a given year
  getByYear: (year) => API.get('/maintenance-events', { params: { year } }),
  // create or update an event
  upsert: (data) => API.put('/maintenance-events', data),
  // delete (reset) an event
  remove: (data) => API.delete('/maintenance-events', { data }),
};

export const ecmeService = {
  getAll:          (params) => API.get('/ecme', { params }),
  getOne:          (code)   => API.get(`/ecme/${code}`),
  getAffectations: ()       => API.get('/ecme/meta/affectations'),
};
