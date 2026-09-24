import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token automatically to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

export const getDevices = () => API.get("/devices");
export const addDevice = (data) => API.post("/devices", data);
export const toggleDevice = (id) => API.post(`/devices/${id}/toggle`);
export const deleteDevice = (id) => API.delete(`/devices/${id}`);

export default API;