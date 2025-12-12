import client from './client';

export const birdsApi = {
  // Get all bird stock records with optional filters
  getAll: async (params) => {
    const response = await client.get('/birds', { params });
    return response.data;
  },

  // Get today's records
  getToday: async () => {
    const response = await client.get('/birds/today');
    return response.data;
  },

  // Get records by date
  getByDate: async (date) => {
    const response = await client.get(`/birds/date/${date}`);
    return response.data;
  },

  // Get all locations data for a date
  getAllLocations: async (date) => {
    const response = await client.get(`/birds/all/${date}`);
    return response.data;
  },

  // Get previous day's data for a location
  getPrevious: async (date, location) => {
    const response = await client.get(`/birds/previous/${date}/${location}`);
    return response.data;
  },

  // Create or update bird stock record
  createOrUpdate: async (data) => {
    const response = await client.post('/birds', data);
    return response.data;
  },

  // Update by ID
  update: async (id, data) => {
    const response = await client.put(`/birds/${id}`, data);
    return response.data;
  },

  // Delete by ID
  delete: async (id) => {
    const response = await client.delete(`/birds/${id}`);
    return response.data;
  }
};
