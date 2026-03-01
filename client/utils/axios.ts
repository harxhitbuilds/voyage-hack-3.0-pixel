import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";

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

/**
 * Waits for Firebase to finish restoring the auth session, then returns the
 * current user (or null). This prevents race conditions on page refresh where
 * auth.currentUser is null until Firebase finishes initializing.
 */
const getFirebaseUser = () =>
  new Promise<import("firebase/auth").User | null>((resolve) => {
    // If Firebase has already resolved the auth state, use it immediately
    if (auth.currentUser !== undefined) {
      resolve(auth.currentUser);
      return;
    }
    // Otherwise wait for the first auth state change event
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });

apiClient.interceptors.request.use(
  async (config) => {
    const user = await getFirebaseUser();
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
