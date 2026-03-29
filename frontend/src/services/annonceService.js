import api from './api'

export const annonceService = {

    async getAll(filtres = {}) {
        const res = await api.get('/annonces', { params: filtres })
        return res.data
    },

    async getOne(id) {
        const res = await api.get(`/annonces/${id}`)
        return res.data
    },

    async create(data) {
        const formData = new FormData()
        Object.entries(data).forEach(([key, val]) => {
            if (key === 'photos') {
                val.forEach(file => formData.append('photos[]', file))
            } else if (['meublee', 'eau_incluse', 'electricite_incluse'].includes(key)) {
                formData.append(key, val ? '1' : '0')
            } else {
                formData.append(key, val)
            }
        })
        const res = await api.post('/proprietaire/annonces', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        return res.data
    },

    async update(id, data) {
        const res = await api.put(`/proprietaire/annonces/${id}`, data)
        return res.data
    },

    async delete(id) {
        await api.delete(`/proprietaire/annonces/${id}`)
    },

    async getMes() {
        const res = await api.get('/proprietaire/annonces')
        return res.data
    },

    async getMesOne(id) {
        const res = await api.get(`/proprietaire/annonces/${id}`)
        return res.data
    },
}