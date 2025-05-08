import api from "./Api"

export const login = async (login, password) => {
    try{
        const response = await api.post("/auth/login", {login, password})
        return response?.data
    }
    catch(error) {
        throw error
    }
}