import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, User, getStoredToken, setStoredToken, clearStoredAuth, getStoredUser } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, ward?: string) => Promise<void>;
  quickDemoLogin: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  quickDemoLogin: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadStoredSession();
  }, []);

  const loadStoredSession = async () => {
    try {
      const storedTok = await getStoredToken();
      const storedUsr = await getStoredUser();
      if (storedTok && storedUsr) {
        setToken(storedTok);
        setUser(storedUsr);
      }
    } catch (e) {
      console.warn('Failed to restore auth session', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password });
      if (res.access_token && res.user) {
        setToken(res.access_token);
        setUser(res.user);
        await setStoredToken(res.access_token, res.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, ward: string = 'Ward 45 (Central)') => {
    setIsLoading(true);
    try {
      const res = await api.register({ name, email, password, ward });
      if (res.access_token && res.user) {
        setToken(res.access_token);
        setUser(res.user);
        await setStoredToken(res.access_token, res.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const quickDemoLogin = async () => {
    setIsLoading(true);
    try {
      // Automatic login as clean-air champion demo profile
      const demoUser: User = {
        id: 'usr-demo-777',
        name: 'Arjun (Delhi NCR)',
        email: 'arjun@whybadaqi.ai',
        ward: 'Ward 45 (Central)'
      };
      const demoToken = 'mock-demo-jwt-token-2026';
      setToken(demoToken);
      setUser(demoUser);
      await setStoredToken(demoToken, demoUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await clearStoredAuth();
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, quickDemoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
