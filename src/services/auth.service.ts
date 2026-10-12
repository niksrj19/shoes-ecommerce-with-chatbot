import { apiClient } from "@/lib/api-client";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  role: string;
}

export const AuthService = {
  /**
   * Generates the backend Google OAuth entry URL.
   */
  getGoogleAuthUrl(returnTo?: string): string {
    const targetUrl = new URL(`${BACKEND_URL}/auth/google`);
    if (returnTo) {
      targetUrl.searchParams.set("returnTo", returnTo);
    }
    return targetUrl.toString();
  },

  /**
   * Triggers the OAuth flow by delegating browser navigation.
   */
  initiateGoogleLogin(returnTo?: string): void {
    if (typeof window !== "undefined") {
      window.location.href = this.getGoogleAuthUrl(returnTo);
    }
  },

  /**
   * Refreshes the active session tokens via HTTP-only cookies.
   */
  async refreshToken(): Promise<void> {
    await apiClient.post("/auth/refresh");
  },

  /**
   * Retrieves the current authenticated user profile.
   */
  async getCurrentUser(): Promise<UserProfile> {
    // debugger
    const response = await apiClient.get<UserProfile>("/auth/me");
    console.log("response =", JSON.stringify(response.data))
    return response.data;
  },

  /**
   * Logs out the user and revokes the refresh session.
   */
  async logout(): Promise<void> {
    // debugger
    await apiClient.post("/auth/logout");
  },
};