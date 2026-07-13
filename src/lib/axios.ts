import axios from "axios";
import { authClient } from "./auth-client";

axios.defaults.withCredentials = true;
console.log("AUTH_STATE_DEBUG: [axios] axios.defaults.withCredentials:", axios.defaults.withCredentials);

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

console.log("AUTH_STATE_DEBUG: [axios] api instance baseURL:", process.env.NEXT_PUBLIC_API_URL, "withCredentials:", api.defaults.withCredentials);

let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        console.log("AUTH_STATE_DEBUG: [axios interceptor] 401 received, calling authClient.getSession() to refresh…");
        try {
          const { data: refreshedSession } = await authClient.getSession();
          console.log("AUTH_STATE_DEBUG: [axios interceptor] session refresh →", refreshedSession?.user ? "user found" : "no user");
          isRefreshing = false;
          return api(originalRequest);
        } catch (refreshErr) {
          console.error("AUTH_STATE_DEBUG: [axios interceptor] session refresh failed:", refreshErr);
          isRefreshing = false;
          window.location.href = "/login";
          return Promise.reject(error);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
