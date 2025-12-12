import client from './client';

export const getDashboardSummary = async () => {
  const response = await client.get('/reports/summary');
  return response.data;
};

export const getSummaryByDate = async (date) => {
  const response = await client.get(`/reports/summary/${date}`);
  return response.data;
};

export const getLocationSummary = async (date) => {
  const response = await client.get(`/reports/locations/${date}`);
  return response.data;
};
