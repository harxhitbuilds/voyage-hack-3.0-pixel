import axios from "axios";

import { auth } from "@/configurations/firebase.config";

const isProduction = process.env.NEXT_PUBLIC_ENV === "production";
const productionURL =
  process.env.NEXT_PUBLIC_PROD_API_URL || process.env.NEXT_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL: isProduction
    ? productionURL
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

apiClient.interceptors.request.use(
  async (config) => {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
