// src/api/authApi.js
import axiosInstance from "../utils/axiosInstance";

export const loginApi = (data) => {
  return axiosInstance.post("users/login", data);
};
