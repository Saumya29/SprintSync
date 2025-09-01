import {post} from './api';

export const generateDescription = (title) => {
  return post('/ai/suggest', {title});
};