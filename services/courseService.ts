import { api } from "./api";

// export const getCourses = async () => {
//   try {
//     const res = await api.get("/public/randomproducts");
//     console.log("COURSE API:", res?.data);
//     return res?.data; // return the full object
//   } catch (error) {
//     console.log("COURSE ERROR:", error);
//     return null;
//   }
// };

export const getCourses = async (page = 1) => {
  try {
    const res = await api.get(`/public/randomproducts?page=${page}&limit=10`);
    return res?.data;
  } catch (error) {
    console.log("COURSE ERROR:", error);
    return null;
  }
};

export const getInstructors = async () => {
  try {
    const res = await api.get("/public/randomusers");
    console.log("INSTRUCTOR API:", res?.data);
    return res?.data || [];
  } catch (error) {
    console.log("INSTRUCTOR ERROR:", error);
    return [];
  }
};
