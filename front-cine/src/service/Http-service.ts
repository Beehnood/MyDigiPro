import axios from "axios";
import { toast } from "react-toastify";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`; // ← backticks corrigés
  }
  return config;
});

api.interceptors.response.use((Response) => Response, error => {
  if (error.response?.status === 403) {
       toast.error("Limite atteinte ou points insuffisants.");
      } else {
       toast.error("Erreur pendant le tirage.");
      }
});

