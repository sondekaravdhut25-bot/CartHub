import api from "./api";

export const register = async (name, email, password) => {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data;
};

export const login = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

export const getProfile = async () => {
  const { data } = await api.get("/auth/profile");
  return data;
};

export const updateProfile = async (updates) => {
  const { data } = await api.put("/auth/profile", updates);
  return data;
};
