import api from "./Api"

export const getTeam = async () => {
    try {
        const res = await api.get("/team-section")
        return await res?.data
    } catch (error) {
        throw error        
    }
}

export const createTeam = async (formData) => {
    try {
        const res = await api.post("/team-section", formData)
        return await res?.data
    } catch (error) {
        throw error        
    }
}

export const updateTeam = async (id, formData) => {
    try {
        const res = await api.patch(`/team-section/${id}`, formData)
        return await res?.data
    } catch (error) {
        throw error        
    }
}

export const deleteTeam = async (id) => {
    try {
        const res = await api.delete(`/team-section/${id}`)
        return await res?.data
    } catch (error) {
        throw error        
    }
}