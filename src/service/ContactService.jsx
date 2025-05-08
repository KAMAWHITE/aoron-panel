import api from "./Api";

export const getContacts = async () => {
    try {
        const res = await api.get("/contact");
        return res;
    } catch (error) {
        throw error;
    }
};

export const createContact = async (data) => {
    try {
        const res = await api.post("/contact", data);
        return res;
    } catch (error) {
        throw error;
    }
};

export const editContact = async (id, data) => {
    try {
        const res = await api.patch(`/contact/${id}`, data);
        return res;
    } catch (error) {
        throw error;
    }
};

export const deleteContact = async (id) => {
    try {
        const res = await api.delete(`/contact/${id}`);
        return res;
    } catch (error) {
        throw error;
    }
};