import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUsersStore = create(
    persist(
        (set, get) => ({
            users: [],

            // Add a new user to the store
            addUser: (user) => {
                const { users } = get();
                set({ users: [...users, user] });
            },

            // Update an existing user's data (like their cart or wishlist)
            updateUser: (email, updatedData) => {
                const { users } = get();
                const updatedUsers = users.map(u => 
                    u.email === email ? { ...u, ...updatedData } : u
                );
                set({ users: updatedUsers });
            }
        }),
        {
            name: 'users-storage', // The key used in localStorage
        }
    )
);

export default useUsersStore;