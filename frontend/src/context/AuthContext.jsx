import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const getStoredAuth = () => {
  try {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    return {
      token: token || null,
      user: userJson ? JSON.parse(userJson) : null,
    };
  } catch {
  
    return { token: null, user: null };
  }
};

export function AuthProvider({ children }) {
  const [{ token, user }, setAuth] = useState(getStoredAuth);

  const setAuthData = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({ token, user });
  };

  const register = async (name, email) => {
    const res = await axios.post('/api/auth/register', { name, email });
    return res.data.message;
  };

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    const { token, user } = res.data.data;
    setAuthData(token, user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ token: null, user: null });
  };

  const changePassword = async (oldPassword, newPassword) => {
    const res = await axios.put('/api/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return res.data.message;
  };

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token),
    register,
    login,
    logout,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside an <AuthProvider>');
  }
  return ctx;
}
