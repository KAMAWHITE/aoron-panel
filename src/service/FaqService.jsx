import api from "./Api";

export const getFaqs = async () => {
    try {
        const res = await api.get("/faq");
        return res;
    } catch (error) {
        throw error;
    }
};

export const createFaq = async (data) => {
    try {
        const res = await api.post("/faq", data);
        return res;
    } catch (error) {
        throw error;
    }
};

export const editFaq = async (id, data) => {
    try {
        const res = await api.patch(`/faq/${id}`, data);
        return res;
    } catch (error) {
        throw error;
    }
};

export const deleteFaq = async (id) => {
    try {
        const res = await api.delete(`/faq/${id}`);
        return res;
    } catch (error) {
        throw error;
    }
};