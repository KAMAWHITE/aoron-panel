import axios from "axios";

const api = axios.create({
    baseURL: "https://back.ifly.com.uz/api"
});

export const imageUrl = "https://back.ifly.com.uz";

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (config.data instanceof FormData) {
            config.headers["Content-Type"] = "multipart/form-data";
        } else {
            config.headers["Content-Type"] = "application/json";
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log(error);
        return Promise.reject(error);
    }
);

export default api;