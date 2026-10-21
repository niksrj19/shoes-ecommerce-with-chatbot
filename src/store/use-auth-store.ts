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
  setUser: (user: User) => void;
  clearUser: () => void;
  initializeAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthMeUser {
  userId?: string;
  id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  avatarUrl?: string;
  emailVerified?: boolean;
  role?: string;
}

type AuthMeResponse = AuthMeUser | { user?: AuthMeUser };

function isAuthMeEnvelope(
  response: AuthMeResponse
): response is { user?: AuthMeUser } {
  return Object.prototype.hasOwnProperty.call(response, "user");
}

let authInitializationPromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: true,

        setUser: (user: User) =>
          set({ user, isAuthenticated: true, isLoading: false }),

        clearUser: () =>
          set({ user: null, isAuthenticated: false, isLoading: false }),

        initializeAuth: () => {
          if (authInitializationPromise) return authInitializationPromise;

          authInitializationPromise = (async () => {
            try {
              set({ isLoading: true });
              const response = await apiClient.get<AuthMeResponse>("/auth/me");
              const authUser = isAuthMeEnvelope(response.data)
                ? response.data.user
                : response.data;
              const userId = authUser?.userId || authUser?.id;

              if (authUser && userId && authUser.email && authUser.role) {
                const user: User = {
                  userId,
                  name: authUser.name || "",
                  email: authUser.email,
                  avatar: authUser.avatar || authUser.avatarUrl,
                  emailVerified: authUser.emailVerified,
                  role: authUser.role,
                };
                set({ user, isAuthenticated: true, isLoading: false });

                try {
                  await useCartStore.getState().mergeCartOnLogin();
                } catch (error) {
                  console.error("Failed to merge guest cart for authenticated user:", error);
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
        }),
      }
    )
  )
);