import api from "./Api";

export const getDiscount = async () => {
    try {
        const res = await api.get("/discount");
        return res;
    } catch (error) {
        throw error;
    }
};

export const createDiscount = async (data) => {
    try {
        const res = await api.post("/discount", data);
        return res;
    } catch (error) {
        throw error;
    }
};

export const editDiscount = async (id, data) => {
    try {
        const res = await api.patch(`/discount/${id}`, data);
        return res;
    } catch (error) {
        throw error;
    }
};

export const deleteDiscount = async (id) => {
    try {
        const res = await api.delete(`/discount/${id}`);
        return res;
    } catch (error) {
        throw error;
    }
};