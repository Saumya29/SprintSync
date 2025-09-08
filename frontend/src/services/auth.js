import {post} from './api';

export const login = async (email, password) => {
  const data = await post('/auth/login', {email, password});
  localStorage.setItem('token', data.token);
  localStorage.setItem('userEmail', email);
  localStorage.setItem('isAdmin', data.user?.isAdmin || false);
  return data;
};

export const register = async (email, password) => {
  const data = await post('/auth/register', {email, password});
  localStorage.setItem('token', data.token);
  localStorage.setItem('userEmail', email);
  localStorage.setItem('isAdmin', data.isAdmin || false);
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('isAdmin');
  window.location.href = '/login';
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getCurrentUserEmail = () => {
  return localStorage.getItem('userEmail');
};

export const isAdmin = () => {
  return localStorage.getItem('isAdmin') === 'true';
};