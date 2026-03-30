import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useUsersStore from './useUsersStore';

import useShopStore from './useShopStore';

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
                useShopStore.getState().setShop(user.cart || [], user.wishlist || []);
                return { success: true, message: "You are logged in successfully!", user };
            },

            logoutUser: () => {
                const { currentUser } = get();
                if (currentUser) {
                    const { cart, wishlist } = useShopStore.getState();
                    useUsersStore.getState().updateUser(currentUser.email, { cart, wishlist });
                }
                set({ currentUser: null, isLoggedIn: false });
                useShopStore.getState().clearShop();
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
            version: undefined,
        }
    )
);

export default useAuthStore;