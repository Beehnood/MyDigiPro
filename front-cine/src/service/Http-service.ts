import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";

export const api = axios.create({
  baseURL: API_BASE_URL,
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
  const message =
    !error.response
      ? "Serveur API inaccessible. Vérifiez que le backend est lancé ou que l’URL de production est configurée."
      : error.response?.data?.error ||
        error.response?.data?.message ||
        "Erreur pendant la requête.";

  toast.error(message);
  return Promise.reject(error);
});
