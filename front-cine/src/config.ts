const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL = (
  configuredApiBaseUrl || "http://localhost:8000/api"
).replace(/\/$/, "");

export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, "");
