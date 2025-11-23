// src/contexts/authContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
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
      if (token && storedUser) {
        try {
          const response = await authService.getCurrentUser();
          
          // authService.getCurrentUser returns { success, data }
          if (response?.data) {
            setUser(response.data);
          } else {
          }
        } catch (error) {
          console.log('❌ Could not refresh user data:', error);
        }
      }
    } catch (error) {
      console.error('❌ Error checking auth state:', error);
    } finally {

      setIsLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setIsLoading(true);
      
      const response = await authService.login(email, password);
      
      // authService.login returns { success, token, user }
      if (response?.token && response?.user) {

        
        setIsAuthenticated(true);
        setUser(response.user);
        
        return { 
          success: true, 
          user: response.user 
        };
      }
      
      return { 
        success: false, 
        error: response?.error || response?.message || 'Login failed' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error?.error || error?.message || 'Login failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData) => {
    try {
      setIsLoading(true);
      
      const response = await authService.register(userData);
      
      // authService.register returns { success, token, user }
      if (response?.token && response?.user) {

        
        setIsAuthenticated(true);
        setUser(response.user);
        
        return { 
          success: true, 
          user: response.user 
        };
      }
      
      return { 
        success: false, 
        error: response?.error || response?.message || 'Registration failed' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error?.error || error?.message || 'Registration failed. Please try again.' 
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
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      
      // authService.getCurrentUser returns { success, data }
      if (response?.data) {
        setUser(response.data);
        return response.data;
      }
      
      return null;
    } catch (error) {
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

  // === HELPER: CHECK ROLE ===
  const hasRole = (role) => {
    const userRole = user?.role;
    const result = userRole === role;
    return result;
  };

  const canManageTasks = () => {
    const userRole = user?.role;
    const canManage = userRole && ['team_lead', 'hr_manager'].includes(userRole);
    return canManage;
  };

  const isHRManager = () => {
    const result = user?.role === 'hr_manager';
    return result;
  };

  const isTeamLead = () => {
    const result = user?.role === 'team_lead';
    return result;
  };

  const isEmployee = () => {
    const result = user?.role === 'employee';
    return result;
  };

  // Log current state whenever it changes
  useEffect(() => {
    if (!isLoading) {
      console.log('🔄 Auth State Updated:', {
        isAuthenticated,
        hasUser: !!user,
        userRole: user?.role,
        userEmail: user?.email,
        userName: user?.profile?.fullName,
        isLoading
      });
    }
  }, [isAuthenticated, user, isLoading]);

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
        hasRole,
        canManageTasks,
        isHRManager,
        isTeamLead,
        isEmployee,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};