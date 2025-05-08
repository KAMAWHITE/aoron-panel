import api from "./Api";

export const getSizes = async () => {
    try {
        const res = await api.get("/sizes");
        return res.data; // Faqat data qaytariladi
    } catch (error) {
        console.error('O‘lchamlarni olishda xato:', error);
        throw error;
    }
};

export const createSize = async (data) => {
    try {
        const res = await api.post("/sizes", data);
        return res.data;
    } catch (error) {
        console.error('O‘lcham qo‘shishda xato:', error);
        throw error;
    }
};

export const editSize = async (id, data) => {
    try {
        const res = await api.patch(`/sizes/${id}`, data);
        return res.data;
    } catch (error) {
        console.error('O‘lchamni tahrirlashda xato:', error);
        throw error;
    }
};

export const deleteSize = async (id) => {
    try {
        const res = await api.delete(`/sizes/${id}`);
        return res.data;
    } catch (error) {
        console.error('O‘lchamni o‘chirishda xato:', error);
        throw error;
    }
};