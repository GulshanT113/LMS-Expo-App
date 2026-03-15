import { api } from "./api";

export const registerUser = async (
  username: string,
  email: string,
  password: string,
) => {
  const res = await api.post("/api/v1/users/register", {
    username,
    email,
    password,
  });

  return res.data;
};

export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/api/v1/users/login", {
    email,
    password,
  });

  return res.data;
};
