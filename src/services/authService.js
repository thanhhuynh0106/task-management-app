import apiClient from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authService = {
  /**
   * Register new user
   * @param {Object} userData - {email, password, role, profile}
   * @returns {Promise<{token, user}>}
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      
      if (response.token) {
        await AsyncStorage.setItem('authToken', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Login user
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{token, user}>}
   */
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      
      if (response.token) {
        await AsyncStorage.setItem('authToken', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  /**
   * Get current user from API
   * @returns {Promise<{user}>}
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      
      if (response.data) {
        await AsyncStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get stored user from AsyncStorage
   * @returns {Promise<Object|null>}
   */
  getStoredUser: async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting stored user:', error);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {Promise<boolean>}
   */
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return !!token;
    } catch (error) {
      return false;
    }
  },

  /**
   * Get auth token
   * @returns {Promise<string|null>}
   */
  getToken: async () => {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      return null;
    }
  },
};

export default authService;




