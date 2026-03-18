import { api } from "./api";

export const getCourses = async (page = 1) => {
  try {
    const res = await api.get(`/public/randomproducts?page=${page}&limit=10`);
    return res?.data;
  } catch (error) {
    return null;
  }
};

export const getInstructors = async () => {
  try {
    const res = await api.get("/public/randomusers");
    return res?.data || [];
  } catch (error) {
    return [];
  }
};
