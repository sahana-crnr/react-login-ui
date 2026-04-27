import { create } from "zustand";
import { persist } from "zustand/middleware";
import useShopStore from "./useShopStore";
import useUsersStore from "./useUsersStore";
import {
  clearAuthTokens,
  loginUserApi,
  registerUserApi,
  setAuthTokens,
} from "../api/auth";
import {
  AuthActionResult,
  AuthStoreState,
  UserProfile,
} from "../types/shop";

const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      currentUser: null,
      isLoggedIn: false,
      accessToken: null,
      refreshToken: null,

      registerUser: async (
        email,
        password,
        phone,
        name,
        confirmPassword,
      ): Promise<AuthActionResult> => {
        try {
          const response = await registerUserApi({
            name,
            email,
            phone,
            password,
            confirmPassword,
          });

          setAuthTokens(response.access, response.refresh);
          set({
            currentUser: {
              id: response.user.id,
              name: response.user.name,
              email: response.user.email,
              phone: response.user.phone ?? phone,
              password: "",
              cart: [],
              wishlist: [],
            } as UserProfile,
            isLoggedIn: true,
            accessToken: response.access,
            refreshToken: response.refresh,
          });

          useUsersStore.getState().addUser({
            name,
            email,
            phone,
            password,
            cart: [],
            wishlist: [],
          });
          useShopStore.getState().setShop([], []);

          return {
            success: true,
            message: response.message,
            user: {
              name: response.user.name,
              email: response.user.email,
              phone: response.user.phone ?? phone,
              password: "",
              cart: [],
              wishlist: [],
            },
          };
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Failed to register.";
          if (message.toLowerCase().includes("password")) {
            return { success: false, message, field: "confirmPassword" };
          }

          if (message.toLowerCase().includes("phone")) {
            return { success: false, message, field: "phone" };
          }

          return { success: false, message, field: "email" };
        }
      },

      loginUser: async (email, password): Promise<AuthActionResult> => {
        try {
          const response = await loginUserApi({ email, password });
          const localUser = useUsersStore
            .getState()
            .users.find((entry) => entry.email === email);
          const cart = localUser?.cart || [];
          const wishlist = localUser?.wishlist || [];

          setAuthTokens(response.access, response.refresh);
          const loggedInUser: UserProfile = {
            name: response.user.name,
            email: response.user.email,
            phone: response.user.phone ?? "",
            password: "",
            cart,
            wishlist,
          };

          set({
            currentUser: loggedInUser,
            isLoggedIn: true,
            accessToken: response.access,
            refreshToken: response.refresh,
          });
          useShopStore.getState().setShop(cart, wishlist);

          return {
            success: true,
            message: response.message,
            user: loggedInUser,
          };
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Failed to login.";

          if (message.toLowerCase().includes("password")) {
            return { success: false, message, field: "password" };
          }

          return { success: false, message, field: "email" };
        }
      },

      logoutUser: () => {
        clearAuthTokens();
        set({
          currentUser: null,
          isLoggedIn: false,
          accessToken: null,
          refreshToken: null,
        });
        useShopStore.getState().clearShop();
      },

      checkEmailExists: (email) => {
        const users = useUsersStore.getState().users;
        return users.some((user) => user.email === email);
      },

      updateUserData: (email, cart, wishlist) => {
        useUsersStore.getState().updateUser(email, { cart, wishlist });
      },
    }),
    {
      name: "auth-storage",
      version: undefined,
    },
  ),
);

export default useAuthStore;
