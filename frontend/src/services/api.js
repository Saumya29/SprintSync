const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const request = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export const get = (endpoint) => {
  return request(endpoint, {method: 'GET'});
};

export const post = (endpoint, data) => {
  return request(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const patch = (endpoint, data) => {
  return request(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const remove = (endpoint) => {
  return request(endpoint, {method: 'DELETE'});
};