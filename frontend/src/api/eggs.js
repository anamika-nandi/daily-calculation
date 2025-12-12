import client from './client';

export const eggsApi = {
  // Get all egg stock records with optional filters
  getAll: async (params) => {
    const response = await client.get('/eggs', { params });
    return response.data;
  },

  // Get today's records
  getToday: async () => {
    const response = await client.get('/eggs/today');
    return response.data;
  },

  // Get records by date
  getByDate: async (date) => {
    const response = await client.get(`/eggs/date/${date}`);
    return response.data;
  },

  // Get all locations data for a date
  getAllLocations: async (date) => {
    const response = await client.get(`/eggs/all/${date}`);
    return response.data;
  },

  // Get opening stock for a date and location
  getOpening: async (date, location) => {
    const response = await client.get(`/eggs/opening/${date}/${location}`);
    return response.data;
  },

  // Create or update egg stock record
  createOrUpdate: async (data) => {
    const response = await client.post('/eggs', data);
    return response.data;
  },

  // Update by ID
  update: async (id, data) => {
    const response = await client.put(`/eggs/${id}`, data);
    return response.data;
  },

  // Delete by ID
  delete: async (id) => {
    const response = await client.delete(`/eggs/${id}`);
    return response.data;
  }
};
