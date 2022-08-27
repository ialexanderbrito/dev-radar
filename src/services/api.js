import axios from 'axios';

const api = axios.create({
  baseURL: 'https://devradar-api.ialexanderbrito.dev',
});

export default api;
