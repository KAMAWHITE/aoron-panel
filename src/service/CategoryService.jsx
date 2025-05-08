import api from "./Api";

export const getCategory = async () => {
    try {
        const res = await api.get("/category");
        return res; // To'liq javobni qaytaramiz
    } catch (error) {
        throw error;
    }
};

export const createCategory = async (data) => {
    try {
        const res = await api.post("/category", data); // Ma'lumotlarni yuboramiz
        return res;
    } catch (error) {
        throw error;
    }
};

export const editCategory = async (id, data) => {
    try {
        const res = await api.patch(`/category/${id}`, data); // Yangilangan ma'lumotlarni yuboramiz
        return res;
    } catch (error) {
        throw error;
    }
};

export const deleteCategory = async (id) => {
    try {
        const res = await api.delete(`/category/${id}`);
        return res;
    } catch (error) {
        throw error;
    }
};