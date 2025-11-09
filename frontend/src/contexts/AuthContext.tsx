import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import getApiBaseUrl from '../config/api';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'student';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Configure axios to include auth token
  const setupAxiosInterceptors = (token: string) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setupAxiosInterceptors(token);
      // Verify token with backend
      axios.get(`${getApiBaseUrl()}/auth/me`)
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${getApiBaseUrl()}/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setupAxiosInterceptors(token);
      setUser(user);
    } catch (error: any) {
      // Provide helpful error messages for different environments
      if (error.code === 'ERR_NETWORK' || !error.response) {
        const isProduction = window.location.hostname.includes('vercel.app');
        if (isProduction) {
          throw new Error('Unable to connect to the authentication service. Please try again in a moment.');
        } else {
          throw new Error('Cannot connect to server. Make sure the backend is running on http://localhost:3001');
        }
      }
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await axios.post(`${getApiBaseUrl()}/auth/register`, {
        email,
        password,
        name,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setupAxiosInterceptors(token);
      setUser(user);
    } catch (error: any) {
      // Provide helpful error messages for different environments
      if (error.code === 'ERR_NETWORK' || !error.response) {
        const isProduction = window.location.hostname.includes('vercel.app');
        if (isProduction) {
          throw new Error('Unable to connect to the registration service. Please try again in a moment.');
        } else {
          throw new Error('Cannot connect to server. Make sure the backend is running on http://localhost:3001');
        }
      }
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
