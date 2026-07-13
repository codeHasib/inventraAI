import axios from "axios";
import { authClient } from "./auth-client";

axios.defaults.withCredentials = true;
console.log(
  "AUTH_STATE_DEBUG: [axios] axios.defaults.withCredentials:",
  axios.defaults.withCredentials,
);

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data: refreshedSession } = await authClient.getSession();
          isRefreshing = false;
          return api(originalRequest);
        } catch (refreshErr) {
          isRefreshing = false;
          window.location.href = "/login";
          return Promise.reject(error);
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
