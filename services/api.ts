import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.freeapi.app",
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API Error:", error);
    return Promise.reject(error);
  },
);
