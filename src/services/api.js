import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dev-radar-oficial.herokuapp.com',
});

export default api;
