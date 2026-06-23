import { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';

const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('focus90_token') || sessionStorage.getItem('focus90_token');
    if (!token) return setLoading(false);
    api.get('/auth/me').then(({ data }) => setUser(data.user)).catch(() => {}).finally(() => setLoading(false));
  }, []);
  const login = async (credentials, remember) => {
    const { data } = await api.post('/auth/login', credentials);
    (remember ? localStorage : sessionStorage).setItem('focus90_token', data.token);
    setUser(data.user);
  };
  const signup = async (payload) => {
    const { data } = await api.post('/auth/signup', payload);
    localStorage.setItem('focus90_token', data.token);
    setUser(data.user);
  };
  const logout = () => { localStorage.removeItem('focus90_token'); sessionStorage.removeItem('focus90_token'); setUser(null); };
  return <AuthContext.Provider value={{ user, setUser, loading, login, signup, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
