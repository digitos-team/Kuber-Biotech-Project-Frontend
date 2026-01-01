import axiosInstance from "../utils/axiosInstance";

const API_URL = import.meta.env.VITE_API_URL;

export const uploadBrochure = (formData) => {
    return axiosInstance.post(`${API_URL}/api/broucher/add-broucher`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getAllBrochures = () => {
    return axiosInstance.get(`${API_URL}/api/broucher/getall-broucher`);
};

export const deleteBrochure = (brochureId) => {
    return axiosInstance.delete(`${API_URL}/api/broucher/delete-broucher/${brochureId}`);
};

export const downloadBrochure = (brochureId) => {
    return axiosInstance.get(`${API_URL}/api/broucher/download-broucher/${brochureId}`, {
        responseType: 'blob',
    });
};
