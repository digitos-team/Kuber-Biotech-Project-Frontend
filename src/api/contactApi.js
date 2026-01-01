import axiosInstance from "../utils/axiosInstance";

const API_URL = import.meta.env.VITE_API_URL;

export const createContact = (contactData) => {
    return axiosInstance.post(`${API_URL}/api/contacts/create-contact`, contactData);
};

export const getAllContacts = () => {
    return axiosInstance.get(`${API_URL}/api/contacts/getall-contact`);
};

export const deleteContact = (contactId) => {
    return axiosInstance.delete(`${API_URL}/api/contacts/delete-contact/${contactId}`);
};
