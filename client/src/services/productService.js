import api from "./api";

export const getProducts = async (params = {}) => {
  const { data } = await api.get("/products", { params });
  return data; // { products, page, pages, total }
};

export const getFeaturedProducts = async () => {
  const { data } = await api.get("/products/featured");
  return data;
};

export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const createProduct = async (product) => {
  const { data } = await api.post("/products", product);
  return data;
};

export const updateProduct = async (id, updates) => {
  const { data } = await api.put(`/products/${id}`, updates);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

export const addProductReview = async (id, review) => {
  const { data } = await api.post(`/products/${id}/reviews`, review);
  return data;
};
