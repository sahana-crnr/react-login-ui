import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useUsersStore from './useUsersStore';

const useAuthStore = create(
    persist(
        (set, get) => ({
            currentUser: null,
            isLoggedIn: false,

            registerUser: (email, password) => {
                const users = useUsersStore.getState().users;
                if (users.some(u => u.email === email)) {
                    return { success: false, message: "Email is already registered." };
                }
                const newUser = { email, password, cart: [], wishlist: [] };
                useUsersStore.getState().addUser(newUser);
                return { success: true, message: "Account created successfully!" };
            },

            loginUser: (email, password) => {
                const users = useUsersStore.getState().users;
                const user = users.find(u => u.email === email);
                if (!user) {
                    return { success: false, message: "Email not registered. Please sign up.", field: "email" };
                }
                if (user.password !== password) {
                    return { success: false, message: "Incorrect password.", field: "password" };
                }
                set({ currentUser: user, isLoggedIn: true });
                return { success: true, message: "You are logged in successfully!", user };
            },

            logoutUser: () => {
                set({ currentUser: null, isLoggedIn: false });
            },

            checkEmailExists: (email) => {
                const users = useUsersStore.getState().users;
                return users.some(u => u.email === email);
            },

            updateUserData: (email, cart, wishlist) => {
                useUsersStore.getState().updateUser(email, { cart, wishlist });
            }
        }),
        {
            name: 'auth-storage', // The key used in localStorage
        }
    )
);

export default useAuthStore;