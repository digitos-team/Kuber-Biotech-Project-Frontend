import axiosInstance from "../utils/axiosInstance";

export const createContact = (contactData) => {
    return axiosInstance.post("contacts/create-contact", contactData);
};

export const getAllContacts = () => {
    return axiosInstance.get("contacts/getall-contact");
};

export const deleteContact = (contactId) => {
    return axiosInstance.delete(`contacts/delete-contact/${contactId}`);
};
