// src/api/authApi.js
import axiosInstance from "../utils/axiosInstance";

const API_URL = import.meta.env.VITE_API_URL;

export const loginApi = (data) => {
  return axiosInstance.post(`${API_URL}/api/users/login`, data);
};
