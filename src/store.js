import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      // You can define your state variables and actions here
      // For example:
      isLoggedIn: false,
      userProfile: null,
      login: (profile) => set({ isLoggedIn: true, userProfile: profile }),
      logout: () => set({ isLoggedIn: false, userProfile: null }),
    }),
    {
      name: 'app-storage', // This is the key that will appear in your browser's Local Storage
      version: undefined,
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          return {
            state: JSON.parse(str),
          };
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value.state));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);

export default useStore;
