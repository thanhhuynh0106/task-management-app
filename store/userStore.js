import { create } from "zustand";
import userService from "../src/services/userService";

/**
 * User Store
 * Manages user data and operations
 */
const useUserStore = create((set, get) => ({
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },

  /**
   * Fetch all users
   * @param {Object} params - {page, limit, search, role, department}
   */
  fetchUsers: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.getAllUsers(params);

      set({
        users: response.data || [],
        pagination: response.pagination || get().pagination,
        isLoading: false,
      });

      return response;
    } catch (error) {
      set({
        error: error?.error || "Failed to fetch users",
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Get user by ID
   * @param {string} id
   */
  fetchUserById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.getUserById(id);

      set({
        currentUser: response.data,
        isLoading: false,
      });

      return response;
    } catch (error) {
      set({
        error: error?.error || "Failed to fetch user",
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Update user
   * @param {string} id
   * @param {Object} data
   */
  updateUser: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.updateUser(id, data);
      const updatedUser = response.data;

      set((state) => ({
        users: state.users.map((user) =>
          user._id === id ? updatedUser : user
        ),
        currentUser:
          state.currentUser?._id === id ? updatedUser : state.currentUser,
        isLoading: false,
      }));

      return response;
    } catch (error) {
      set({
        error: error?.error || "Failed to update user",
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Delete user
   * @param {string} id
   */
  deleteUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await userService.deleteUser(id);

      set((state) => ({
        users: state.users.filter((user) => user._id !== id),
        currentUser: state.currentUser?._id === id ? null : state.currentUser,
        isLoading: false,
      }));

      return true;
    } catch (error) {
      set({
        error: error?.error || "Failed to delete user",
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Get users by team
   * @param {string} teamId
   */
  fetchUsersByTeam: async (teamId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.getUsersByTeam(teamId);
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({
        error: error?.error || "Failed to fetch team users",
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Search users
   * @param {string} searchTerm
   */
  searchUsers: async (searchTerm) => {
    return await get().fetchUsers({ search: searchTerm });
  },

  /**
   * Filter users by role
   * @param {string} role
   */
  filterByRole: async (role) => {
    return await get().fetchUsers({ role });
  },

  /**
   * Filter users by department
   * @param {string} department
   */
  filterByDepartment: async (department) => {
    return await get().fetchUsers({ department });
  },

  /**
   * Set current user
   */
  setCurrentUser: (user) => set({ currentUser: user }),

  /**
   * Clear current user
   */
  clearCurrentUser: () => set({ currentUser: null }),

  /**
   * Clear error
   */
  clearError: () => set({ error: null }),

  /**
   * Reset store
   */
  reset: () =>
    set({
      users: [],
      currentUser: null,
      isLoading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      },
    }),
}));

export default useUserStore;
