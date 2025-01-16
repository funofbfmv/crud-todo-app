import { create } from 'zustand';

export const useStore = create((set) => ({
  user: null,
  token: null,
  tasks: [],

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setTasks: (tasks) => set({ tasks }),

  clearState: () =>
    set({
      user: null,
      token: null,
      tasks: [],
    }), // Удобный метод для сброса состояния
}));
