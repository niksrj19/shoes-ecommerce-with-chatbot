import { AuthService } from "@/services/auth.service";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

// Inside src/lib/apiClient.ts request interceptor
import { getOrCreateSessionId } from "./session";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://api.basesole.online";

export const apiClient: AxiosInstance = axios.create({
  baseURL: BACKEND_BASE_URL,
  withCredentials: true, // Guarantees browser attaches & receives HTTP-only cookies
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const sessionId = getOrCreateSessionId();
    if (sessionId) {
      config.headers["x-session-id"] = sessionId;
    }
  }
  return config;
});

// Guard flags and request queue to handle concurrent 401s smoothly
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};

// Response Interceptor: Catches 401 and manages silent refresh
// Response Interceptor: Catches 401 and manages silent refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const requestUrl = originalRequest?.url || "";

    // DO NOT attempt refresh if the 401 came from auth routes (/auth/me, /auth/refresh, /auth/logout)
    if (
      requestUrl.includes("/auth/me") ||
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/logout")
    ) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await AuthService.refreshToken();
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);

        // Clear local storage persist state before redirecting
        if (typeof window !== "undefined") {
          localStorage.removeItem("solevault-auth-storage");
          window.location.href = `/login?session_expired=true&redirect=${encodeURIComponent(
            window.location.pathname
          )}`;
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;