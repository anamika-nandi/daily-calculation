import client from './client';

export const feedApi = {
  // Get all feed stock records with optional filters
  getAll: async (params) => {
    const response = await client.get('/feed', { params });
    return response.data;
  },

  // Get today's records
  getToday: async () => {
    const response = await client.get('/feed/today');
    return response.data;
  },

  // Get records by date
  getByDate: async (date) => {
    const response = await client.get(`/feed/date/${date}`);
    return response.data;
  },

  // Get all locations data for a date
  getAllLocations: async (date) => {
    const response = await client.get(`/feed/all/${date}`);
    return response.data;
  },

  // Get opening stock for a date and location
  getOpening: async (date, location) => {
    const response = await client.get(`/feed/opening/${date}/${location}`);
    return response.data;
  },

  // Create or update feed stock record
  createOrUpdate: async (data) => {
    const response = await client.post('/feed', data);
    return response.data;
  },

  // Update by ID
  update: async (id, data) => {
    const response = await client.put(`/feed/${id}`, data);
    return response.data;
  },

  // Delete by ID
  delete: async (id) => {
    const response = await client.delete(`/feed/${id}`);
    return response.data;
  }
};
