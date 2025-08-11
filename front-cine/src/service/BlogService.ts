import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Retirez '/blogs' ici
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; 
  }
  return config;
});

export const BlogService = {
  async getAll() {
    const response = await api.get('/blogs');
    return response.data; // plus hydra:member
  },

  async create(blogData: { title: string; content: string }) {
    const response = await api.post('/blogs', blogData);
    return response.data;
  },

  async getById(id: number) {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },
};