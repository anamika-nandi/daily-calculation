import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authApi } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const response = await authApi.getMe();
      setUser(response.user);
    } catch (error) {
      // Try refreshing the token
      try {
        await authApi.refresh();
        const response = await authApi.getMe();
        setUser(response.user);
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await authApi.login(credentials);
    if (response.success) {
      setUser(response.user);
    }
    return response;
  }, []);

  const loginWithOtp = useCallback(async (email, otp) => {
    const response = await authApi.verifyOtp(email, otp);
    if (response.success) {
      setUser(response.user);
    }
    return response;
  }, []);

  const loginWithMagicLink = useCallback(async (email, token) => {
    const response = await authApi.verifyMagicLink(email, token);
    if (response.success) {
      setUser(response.user);
    }
    return response;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    login,
    loginWithOtp,
    loginWithMagicLink,
    logout,
    checkAuth,
    isAuthenticated: !!user
  }), [user, loading, login, loginWithOtp, loginWithMagicLink, logout, checkAuth]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
