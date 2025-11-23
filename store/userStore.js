import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import authService from '../src/services/authService';

const useAuthStore = create((set, get) => ({
  // States
  isAuthenticated: false,
  user: null,
  hasSeenOnboarding: false,
  isLoading: true,
  error: null,

  /**
   * Initialize auth state on app start
   */
  initialize: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = await authService.getToken();
      const storedUser = await authService.getStoredUser();
      const onboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      
      set({
        isAuthenticated: !!token,
        user: storedUser,
        hasSeenOnboarding: onboarding === 'true',
        isLoading: false
      });

      // Refresh user data from API if token exists
      if (token) {
        try {
          const response = await authService.getCurrentUser();
          set({ user: response.data });
        } catch (error) {
          console.log('Could not refresh user data:', error);
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ 
        error: error?.error || 'Failed to initialize',
        isLoading: false 
      });
    }
  },

  /**
   * Sign in user
   * @param {string} email
   * @param {string} password
   */
  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(email, password);
      
      set({
        isAuthenticated: true,
        user: response.user,
        isLoading: false,
        error: null
      });

      return { success: true, user: response.user };
    } catch (error) {
      console.error('Sign in error:', error);
      const errorMessage = error?.error || 'Login failed. Please try again.';
      
      set({ 
        error: errorMessage,
        isLoading: false 
      });

      return { success: false, error: errorMessage };
    }
  },

  /**
   * Sign up new user
   * @param {Object} userData
   */
  signUp: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(userData);
      
      set({
        isAuthenticated: true,
        user: response.user,
        isLoading: false,
        error: null
      });

      return { success: true, user: response.user };
    } catch (error) {
      console.error('Sign up error:', error);
      const errorMessage = error?.error || 'Registration failed. Please try again.';
      
      set({ 
        error: errorMessage,
        isLoading: false 
      });

      return { success: false, error: errorMessage };
    }
  },

  /**
   * Sign out user
   */
  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.logout();
      
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error signing out:', error);
      set({ 
        error: error?.error || 'Failed to sign out',
        isLoading: false 
      });
    }
  },

  /**
   * Refresh current user data
   */
  refreshUser: async () => {
    try {
      const response = await authService.getCurrentUser();
      
      set({ user: response.data });
      
      return response.data;
    } catch (error) {
      console.error('Error refreshing user:', error);
      return null;
    }
  },

  /**
   * Update user profile
   * @param {Object} profileData
   */
  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.updateProfile(profileData);
      
      set({
        user: response.data,
        isLoading: false,
        error: null
      });

      return { success: true, user: response.data };
    } catch (error) {
      console.error('Update profile error:', error);
      const errorMessage = error?.error || 'Failed to update profile';
      
      set({ 
        error: errorMessage,
        isLoading: false 
      });

      return { success: false, error: errorMessage };
    }
  },

  /**
   * Mark onboarding as completed
   */
  completeOnboarding: async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      set({ hasSeenOnboarding: true });
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  },

  /**
   * Check if user has specific role
   * @param {string} role - 'employee', 'team_lead', 'hr_manager'
   */
  hasRole: (role) => {
    const user = get().user;
    return user?.role === role;
  },

  /**
   * Check if user can create/assign tasks (Team Lead or HR Manager)
   */
  canManageTasks: () => {
    const user = get().user;
    return user?.role === 'team_lead' || user?.role === 'hr_manager';
  },

  /**
   * Check if user can approve leaves (Team Lead or HR Manager)
   */
  canApproveLeaves: () => {
    const user = get().user;
    return user?.role === 'team_lead' || user?.role === 'hr_manager';
  },

  /**
   * Check if user is HR Manager
   */
  isHRManager: () => {
    const user = get().user;
    return user?.role === 'hr_manager';
  },

  /**
   * Check if user is Team Lead
   */
  isTeamLead: () => {
    const user = get().user;
    return user?.role === 'team_lead';
  },

  /**
   * Check if user is Employee
   */
  isEmployee: () => {
    const user = get().user;
    return user?.role === 'employee';
  },

  /**
   * Get user's team ID
   */
  getTeamId: () => {
    const user = get().user;
    return user?.teamId;
  },

  /**
   * Clear error
   */
  clearError: () => {
    set({ error: null });
  },

  /**
   * Reset store
   */
  reset: () => {
    set({
      isAuthenticated: false,
      user: null,
      hasSeenOnboarding: false,
      isLoading: false,
      error: null
    });
  }
}));

export default useAuthStore;