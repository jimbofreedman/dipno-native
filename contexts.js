import React from 'react';
import { ResourceStore } from '@reststate/mobx';
import axios from 'axios';

import TimerStore from './stores/timerStore';
import AuthStore from './stores/authStore';

const authStore = new AuthStore();

const httpClient = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/vnd.api+json',
  },
});

// httpClient.interceptors.request.use(request => {
//   console.log('Request:', request);
//   return request;
// });

httpClient.interceptors.request.use(config => {
  const finalChar = config.url[config.url.length - 1];

  if (finalChar === '?') {
    // eslint-disable-next-line no-param-reassign
    config.url = `${config.url.slice(0, -1)}/`;
  } else if (finalChar !== '/') {
    // eslint-disable-next-line no-param-reassign
    config.url += '/';
  }
  return config;
});

httpClient.interceptors.request.use(
  config => {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer facebook ${authStore.facebookToken}`;
    return config;
  },
  error => Promise.reject(error)
);

export default React.createContext({
  timerStore: new TimerStore(),
  authStore,
  userStore: new ResourceStore({ name: 'users', httpClient }),
});
