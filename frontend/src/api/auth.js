import client from './client';

export const authApi = {
  // Local login (username + password)
  login: async (credentials) => {
    const response = await client.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await client.get('/auth/me');
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await client.post('/auth/logout');
    return response.data;
  },

  // Change password
  changePassword: async (data) => {
    const response = await client.put('/auth/change-password', data);
    return response.data;
  },

  // Refresh access token
  refresh: async () => {
    const response = await client.post('/auth/refresh');
    return response.data;
  },

  // ─── OTP ─────────────────────────────────────────────────────
  sendOtp: async (email) => {
    const response = await client.post('/auth/otp/send', { email });
    return response.data;
  },

  verifyOtp: async (email, otp) => {
    const response = await client.post('/auth/otp/verify', { email, otp });
    return response.data;
  },

  // ─── Magic Link ──────────────────────────────────────────────
  sendMagicLink: async (email) => {
    const response = await client.post('/auth/magic-link/send', { email });
    return response.data;
  },

  verifyMagicLink: async (email, token) => {
    const response = await client.post('/auth/magic-link/verify', { email, token });
    return response.data;
  },

  // ─── OAuth URLs ──────────────────────────────────────────────
  getGoogleAuthUrl: () => '/api/auth/google',
  getGithubAuthUrl: () => '/api/auth/github'
};
