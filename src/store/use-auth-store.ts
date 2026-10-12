import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { apiClient } from "@/lib/api-client";
import { useCartStore } from "@/store/use-cart-store";

export interface User {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  emailVerified?: boolean;
  role : string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  mergedCartUserIds: string[];
  setUser: (user: User) => void;
  clearUser: () => void;
  initializeAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

let authInitializationPromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        mergedCartUserIds: [],

        setUser: (user: User) =>
          set({ user, isAuthenticated: true, isLoading: false }),

        clearUser: () =>
          set({ user: null, isAuthenticated: false, isLoading: false }),

        initializeAuth: () => {
          if (authInitializationPromise) return authInitializationPromise;

          authInitializationPromise = (async () => {
            try {
              set({ isLoading: true });
              const response = await apiClient.get<{ user?: User }>("/auth/me");
              const user = response.data?.user;

              if (user) {
                set({ user, isAuthenticated: true, isLoading: false });

                if (!get().mergedCartUserIds.includes(user.userId)) {
                  try {
                    await useCartStore.getState().mergeCartOnLogin();
                    set((state) => ({
                      mergedCartUserIds: [...state.mergedCartUserIds, user.userId],
                    }));
                  } catch (error) {
                    // Keep the user unmarked so a later auth initialization can retry the merge.
                    console.error("Failed to merge guest cart for authenticated user:", error);
                  }
                }
              } else {
                set({ user: null, isAuthenticated: false, isLoading: false });
              }
            } catch {
              set({ user: null, isAuthenticated: false, isLoading: false });
            } finally {
              useCartStore.getState().setAuthReady();
              await useCartStore.getState().fetchCart();
              authInitializationPromise = null;
            }
          })();

          return authInitializationPromise;
        },

        logout: async () => {
         // debugger
          const currentUser = get().user;
          console.log("currentUser=",currentUser)
          //debugger
          try {
            if (currentUser?.userId) {
          //    debugger
              await apiClient.post("/auth/logout", { userId: currentUser.userId });
            }
          } catch (error) {
            console.error("Backend logout failed:", error);
          } finally {
            // Expire client-accessible cookies
            document.cookie = "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            document.cookie = "refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";

            // Reset state
            get().clearUser();

            // Redirect and hard reset window state
            if (typeof window !== "undefined") {
              window.location.href = "/";
            }
          }
        },
      }),
      {
        name: "solevault-auth-storage",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          mergedCartUserIds: state.mergedCartUserIds,
        }),
      }
    )
  )
);