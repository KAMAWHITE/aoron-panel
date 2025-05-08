import api from "./Api";

export const getNews = async () => {
    try {
        const res = await api.get("/news");
        return res;
    } catch (error) {
        throw error;
    }
};

export const createNews = async (data) => {
    try {
        const res = await api.post("/news", data);
        return res;
    } catch (error) {
        throw error;
    }
};

export const editNews = async (id, data) => {
    try {
        const res = await api.patch(`/news/${id}`, data);
        return res;
    } catch (error) {
        throw error;
    }
};

export const deleteNews = async (id) => {
    try {
        const res = await api.delete(`/news/${id}`);
        return res;
    } catch (error) {
        throw error;
    }
};