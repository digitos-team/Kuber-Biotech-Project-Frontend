import axiosInstance from "../utils/axiosInstance";

export const uploadBrochure = (formData) => {
    return axiosInstance.post("broucher/add-broucher", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getAllBrochures = () => {
    return axiosInstance.get("broucher/getall-broucher");
};

export const deleteBrochure = (brochureId) => {
    return axiosInstance.delete(`broucher/delete-broucher/${brochureId}`);
};

export const downloadBrochure = (brochureId) => {
    return axiosInstance.get(`broucher/download-broucher/${brochureId}`, {
        responseType: 'blob',
    });
};
