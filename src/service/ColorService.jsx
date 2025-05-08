import api from "./Api";

export const getColors = async () => {
    try {
        const res = await api.get("/colors");
        return res.data; // Faqat data qaytariladi
    } catch (error) {
        console.error('Ranglarni olishda xato:', error);
        throw error;
    }
};

export const createColor = async (data) => {
    try {
        const res = await api.post("/colors", data);
        return res.data;
    } catch (error) {
        console.error('Rang qo‘shishda xato:', error);
        throw error;
    }
};

export const editColor = async (id, data) => {
    try {
        const res = await api.patch(`/colors/${id}`, data);
        return res.data;
    } catch (error) {
        console.error('Rangni tahrirlashda xato:', error);
        throw error;
    }
};

export const deleteColor = async (id) => {
    try {
        const res = await api.delete(`/colors/${id}`);
        return res.data;
    } catch (error) {
        console.error('Rangni o‘chirishda xato:', error);
        throw error;
    }
};