import { api } from "./api";

export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/users/login", {
    email,
    password,
  });
  return res?.data;
};

export const registerUser = async (
  username: string,
  email: string,
  password: string,
) => {
  const payload = {
    username,
    email,
    password,
    role: "USER",
  };
  console.log("REGISTER PAYLOAD:", payload);
  const res = await api.post("/users/register", payload);
  return res?.data;
};

export const getProfile = async () => {
  const res = await api.get("/users/current-user");
  console.log("PROFILE API RESPONSE:", res?.data);
  return res?.data || null;
};
