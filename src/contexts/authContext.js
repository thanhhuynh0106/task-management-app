// src/contexts/authContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await authService.getToken();
      const storedUser = await authService.getStoredUser();
      const onboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      
      setIsAuthenticated(!!token);
      setUser(storedUser);
      setHasSeenOnboarding(onboarding === 'true');

      // Refresh user data from API if token exists
      if (token) {
        try {
          const response = await authService.getCurrentUser();
          setUser(response.data);
        } catch (error) {
          console.log('Could not refresh user data');
        }
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      setIsAuthenticated(true);
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      console.error('Sign in error:', error);
      return { 
        success: false, 
        error: error.error || 'Login failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData) => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      setIsAuthenticated(true);
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      console.error('Sign up error:', error);
      return { 
        success: false, 
        error: error.error || 'Registration failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Error refreshing user:', error);
      return null;
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      setHasSeenOnboarding(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        hasSeenOnboarding,
        isLoading,
        signIn,
        signUp,
        signOut,
        refreshUser,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
