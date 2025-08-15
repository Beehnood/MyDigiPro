import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`; // ← backticks corrigés
  }
  return config;
});

export const BlogService = {
  async getAll() {
    const response = await api.get("/blogs");
    return response.data;
  },

  async create(blogData: FormData) {
    // Laisse Axios gérer le boundary automatiquement
    const response = await api.post("/blogs", blogData);
    return response.data;
  },

  async getById(id: number) {
    const response = await api.get(`/blogs/${id}`); // ← quotes + template
    return response.data;
  },
};
