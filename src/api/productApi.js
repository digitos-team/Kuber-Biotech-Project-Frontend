import axiosInstance from "../utils/axiosInstance";

const API_URL = import.meta.env.VITE_API_URL;

export const addProduct = (formData) => {
    return axiosInstance.post(`${API_URL}/api/products/add-product`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getAllProducts = (
    page = 1,
    limit = 10,
    lang = "en",
    token = null
) => {
    let url = `${API_URL}/api/products/get?page=${page}&limit=${limit}&lang=${lang}`;

    if (token) {
        url += `&t=${token}`;
    }

    return axiosInstance.get(url);
};


export const deleteProduct = (productId) => {
    return axiosInstance.delete(`${API_URL}/api/products/delete-product/${productId}`);
};

export const updateProduct = (productId, data) => {
    // If data is already JSON object, send as JSON
    // If data is FormData, send as multipart (though edit doesn't support this currently)
    const isFormData = data instanceof FormData;

    return axiosInstance.patch(`${API_URL}/api/products/edit-product/${productId}`, data, {
        headers: isFormData ? {
            "Content-Type": "multipart/form-data",
        } : {
            "Content-Type": "application/json",
        },
    });
};
