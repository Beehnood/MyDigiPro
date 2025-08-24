import { api } from "./Http-service";


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

