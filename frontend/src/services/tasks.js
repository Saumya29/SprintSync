import {get, post, patch, remove} from './api';

export const getTasks = (page = 1, limit = 10) => {
  return get(`/tasks?page=${page}&limit=${limit}`);
};

export const getTask = (id) => {
  return get(`/tasks/${id}`);
};

export const createTask = (task) => {
  return post('/tasks', task);
};

export const updateTask = (id, updates) => {
  return patch(`/tasks/${id}`, updates);
};

export const deleteTask = (id) => {
  return remove(`/tasks/${id}`);
};

export const updateTaskStatus = (id, status) => {
  return patch(`/tasks/${id}`, {status});
};