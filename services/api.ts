import axios from "axios";
import { getToken } from "../utils/storage"; // ✅ IMPORTANT

export const api = axios.create({
  baseURL: "https://api.freeapi.app/api/v1/",
});

// ✅ REQUEST INTERCEPTOR
api.interceptors.request.use(
  async (config: any) => {
    try {
      const token = await getToken(); // ✅ CROSS-PLATFORM TOKEN

      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    } catch (e) {
      console.log("API TOKEN ERROR:", e);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
