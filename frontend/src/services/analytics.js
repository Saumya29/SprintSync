import {get} from './api';

export const getTimeLoggedPerDay = async () => {
  return get('/analytics/time-logged');
};