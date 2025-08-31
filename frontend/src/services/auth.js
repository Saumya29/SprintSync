import {post} from './api';

export const login = async (email, password) => {
  const data = await post('/auth/login', {email, password});
  localStorage.setItem('token', data.token);
  return data;
};

export const register = async (email, password) => {
  const data = await post('/auth/register', {email, password});
  localStorage.setItem('token', data.token);
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};
