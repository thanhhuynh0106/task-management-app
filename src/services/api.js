import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG from '../config/api.config';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
      }
      
      return Promise.reject(data || error.message);
    } else if (error.request) {
      return Promise.reject({ error: 'Network error. Please check your connection.' });
    } else {
      return Promise.reject({ error: error.message });
    }
  }
);

export default apiClient;

