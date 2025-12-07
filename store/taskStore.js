import { create } from 'zustand';
import taskService from '../src/services/taskService';

const useTaskStore = create((set, get) => ({
  // States
  tasks: [],
  myTasks: [],
  teamTasks: [],
  selectedTask: null,
  taskStats: null,
  isLoading: false,
  error: null,
  
  // Filters
  filters: {
    status: null,
    priority: null,
    teamId: null,
    search: '',
    page: 1,
  },

  /**
   * Fetch all tasks with filters (UNLIMITED)
   * @param {Object} params - Optional filter parameters
   */
  fetchTasks: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const filters = { ...get().filters, ...params };
      const response = await taskService.getAllTasks({ 
        ...filters, 
        limit: 999999 
      });
      
      set({ 
        tasks: response.data || [],
        isLoading: false 
      });
      
      return response;
    } catch (error) {
      set({ 
        error: error?.error || 'Failed to fetch tasks',
        isLoading: false 
      });
      throw error;
    }
  },

  /**
   * Fetch tasks assigned to current user (UNLIMITED)
   * @param {Object} params - Optional filter parameters
   */
  fetchMyTasks: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.getMyTasks({ 
        ...params, 
        limit: 999999 
      });
      
      set({ 
        myTasks: response.data || [],
        isLoading: false 
      });
      
      return response;
    } catch (error) {
      set({ 
        error: error?.error || 'Failed to fetch my tasks',
        isLoading: false 
      });
      throw error;
    }
  },

  /**
   * Fetch team tasks (UNLIMITED)
   * @param {string} teamId
   * @param {Object} params - Optional filter parameters
   */
  fetchTeamTasks: async (teamId, params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.getTeamTasks(teamId, { 
        ...params, 
        limit: 999999 
      });
      
      set({ 
        teamTasks: response.data || [],
        isLoading: false 
      });
      
      return response;
    } catch (error) {
      set({ 
        error: error?.error || 'Failed to fetch team tasks',
        isLoading: false 
      });
      throw error;
    }
  },

  /**
   * Get task by ID
   * @param {string} id
   */
  fetchTaskById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.getTaskById(id);
      
      set({ 
        selectedTask: response.data,
        isLoading: false 
      });
      
      return response;
    } catch (error) {
      set({ 
        error: error?.error || 'Failed to fetch task details',
        isLoading: false 
      });
      throw error;
    }
  },

  /**
   * Create a new task
   * @param {Object} taskData - Task creation data
   */
  createTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.createTask(taskData);
      const newTask = response.data;
      
      set(state => ({
        tasks: [newTask, ...state.tasks],
        isLoading: false
      }));

      // Refresh my tasks since user might be assigned
      get().fetchMyTasks();
      
      return response;
    } catch (error) {
      set({ 
        error: error?.error || 'Failed to create task',
        isLoading: false 
      });
      throw error;
    }
  },

  /**
   * Update task
   * @param {string} id
   * @param {Object} updateData - Task update data
   */
  updateTask: async (id, updateData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.updateTask(id, updateData);
      const updatedTask = response.data;
      
      set(state => ({
        tasks: state.tasks.map(task => 
          task._id === id ? updatedTask : task
        ),
        myTasks: state.myTasks.map(task => 
          task._id === id ? updatedTask : task
        ),
        teamTasks: state.teamTasks.map(task => 
          task._id === id ? updatedTask : task
        ),
        selectedTask: state.selectedTask?._id === id 
          ? updatedTask 
          : state.selectedTask,
        isLoading: false
      }));
      
      return response;
    } catch (error) {
      set({ 
        error: error?.error || 'Failed to update task',
        isLoading: false 
      });
      throw error;
    }
  },

  /**
   * Delete task (HARD DELETE)
   * @param {string} id
   */
  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.deleteTask(id);
      
      set(state => ({
        tasks: state.tasks.filter(task => task._id !== id),
        myTasks: state.myTasks.filter(task => task._id !== id),
        teamTasks: state.teamTasks.filter(task => task._id !== id),
        selectedTask: state.selectedTask?._id === id 
          ? null 
          : state.selectedTask,
        isLoading: false
      }));
      
      return response;
    } catch (error) {
      set({ 
        error: error?.error || 'Failed to delete task',
        isLoading: false 
      });
      throw error;
    }
  },

  /**
   * Update task status
   * @param {string} id
   * @param {string} status - 'todo', 'in_progress', 'done'
   */
  updateTaskStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.updateTaskStatus(id, status);
      const updatedTask = response.data;
      
      set(state => ({
        tasks: state.tasks.map(task => 
          task._id === id ? updatedTask : task
        ),
        myTasks: state.myTasks.map(task => 
          task._id === id ? updatedTask : task
        ),
        teamTasks: state.teamTasks.map(task => 
          task._id === id ? updatedTask : task
        ),
        selectedTask: state.selectedTask?._id === id 
          ? updatedTask 
          : state.selectedTask,
        isLoading: false
      }));
      
      return response;
    } catch (error) {
      set({ 
        error: error?.error || 'Failed to update task status',
        isLoading: false 
      });
      throw error;
    }
  },

  /**
   * Update task progress
   * @param {string} id
   * @param {number} progress - 0-100
   */
  updateTaskProgress: async (id, progress) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.updateTaskProgress(id, progress);
      const updatedTask = response.data;
      
      set(state => ({
        tasks: state.tasks.map(task => 
          task._id === id ? updatedTask : task
        ),
        myTasks: state.myTasks.map(task => 
          task._id === id ? updatedTask : task
        ),
        teamTasks: state.teamTasks.map(task => 
          task._id === id ? updatedTask : task
        ),
        selectedTask: state.selectedTask?._id === id 
          ? updatedTask 
          : state.selectedTask,
        isLoading: false
      }));
      
      return response;
    } catch (error) {
      set({ 
        error: error?.error || 'Failed to update task progress',
        isLoading: false 
      });
      throw error;
    }
  },

  /**
   * Assign task to users
   * @param {string} id
   * @param {Array} assignedTo - Array of user IDs
   */
  assignTask: async (id, assignedTo) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.assignTask(id, assignedTo);
      const updatedTask = response.data;
      
      set(state => ({
        tasks: state.tasks.map(task => 
          task._id === id ? updatedTask : task
        ),
        isLoading: false
      }));
      
      await get().fetchMyTasks();
      
      return response;
    } catch (error) {
      set({ 
        error: error?.error || 'Failed to assign task',
        isLoading: false 
      });
      throw error;
    }
  },

  /**
   * Add comment to task
   * @param {string} id
   * @param {string} text
   * @param {Object} user - The user object containing user details
   */
  addComment: async (id, text, user) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.addComment(id, text);
      await get().fetchTaskById(id);
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ 
        error: error?.error || 'Failed to add comment',
        isLoading: false 
      });
      throw error;
    }
  },

  /**
   * Add attachment to task
   * @param {string} id
   * @param {FormData} formData
   */
  addAttachment: async (id, formData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.addAttachment(id, formData);
      
      if (get().selectedTask?._id === id) {
        await get().fetchTaskById(id);
      }
      
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ 
        error: error?.error || 'Failed to add attachment',
        isLoading: false 
      });
      throw error;
    }
  },

  /**
   * Add multiple attachments to task
   * @param {string} id
   * @param {FormData} formData
   */
  addAttachmentsBulk: async (id, formData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.addAttachmentsBulk(id, formData);
      
      if (get().selectedTask?._id === id) {
        await get().fetchTaskById(id);
      }
      
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ 
        error: error?.error || 'Failed to add attachments',
        isLoading: false 
      });
      throw error;
    }
  },

  /**
   * Delete attachment from task
   * @param {string} taskId
   * @param {string} attachmentId
   */
  deleteAttachment: async (taskId, attachmentId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.deleteAttachment(taskId, attachmentId);
      
      // Cập nhật selectedTask nếu đang xem task đó
      if (get().selectedTask?._id === taskId) {
        await get().fetchTaskById(taskId);
      }
      
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ 
        error: error?.error || 'Failed to delete attachment',
        isLoading: false 
      });
      throw error;
    }
  },

  /**
   * Fetch overdue tasks (UNLIMITED)
   * @param {Object} params - Optional parameters
   */
  fetchOverdueTasks: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.getOverdueTasks({ 
        ...params, 
        limit: 999999 
      });
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ 
        error: error?.error || 'Failed to fetch overdue tasks',
        isLoading: false 
      });
      throw error;
    }
  },

  /**
   * Fetch task statistics
   */
  fetchTaskStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.getTaskStats();
      
      set({ 
        taskStats: response.data,
        isLoading: false 
      });
      
      return response;
    } catch (error) {
      set({ 
        error: error?.error || 'Failed to fetch task statistics',
        isLoading: false 
      });
      throw error;
    }
  },

  /**
   * Set filters
   * @param {Object} newFilters
   */
  setFilters: (newFilters) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters }
    }));
  },

  /**
   * Reset filters
   */
  resetFilters: () => {
    set({
      filters: {
        status: null,
        priority: null,
        teamId: null,
        search: '',
        page: 1,
      }
    });
  },

  /**
   * Set selected task
   * @param {Object} task
   */
  setSelectedTask: (task) => {
    set({ selectedTask: task });
  },

  /**
   * Clear selected task
   */
  clearSelectedTask: () => {
    set({ selectedTask: null });
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
      tasks: [],
      myTasks: [],
      teamTasks: [],
      selectedTask: null,
      taskStats: null,
      isLoading: false,
      error: null,
      filters: {
        status: null,
        priority: null,
        teamId: null,
        search: '',
        page: 1,
      }
    });
  },

  // Local filter functions
  /**
   * Filter tasks by status
   * @param {Array} tasks
   * @param {string} status
   */
  filterByStatus: (tasks, status) => {
    if (!status) return tasks;
    return tasks.filter(task => task.status === status);
  },

  /**
   * Filter tasks by priority
   * @param {Array} tasks
   * @param {string} priority
   */
  filterByPriority: (tasks, priority) => {
    if (!priority) return tasks;
    return tasks.filter(task => task.priority === priority);
  },

  /**
   * Search tasks by title or description
   * @param {Array} tasks
   * @param {string} searchTerm
   */
  searchTasks: (tasks, searchTerm) => {
    if (!searchTerm) return tasks;
    const term = searchTerm.toLowerCase();
    return tasks.filter(task => 
      task.title?.toLowerCase().includes(term) ||
      task.description?.toLowerCase().includes(term)
    );
  },

  /**
   * Get filtered tasks based on current filters
   */
  getFilteredTasks: () => {
    const { tasks, filters, filterByStatus, filterByPriority, searchTasks } = get();
    
    let filtered = [...tasks];
    
    if (filters.status) {
      filtered = filterByStatus(filtered, filters.status);
    }
    
    if (filters.priority) {
      filtered = filterByPriority(filtered, filters.priority);
    }
    
    if (filters.search) {
      filtered = searchTasks(filtered, filters.search);
    }
    
    return filtered;
  }
}));

export default useTaskStore;