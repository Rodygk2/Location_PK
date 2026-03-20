import api from './api'

export const adminService = {

    async getStats() {
        const res = await api.get('/admin/stats')
        return res.data
    },

    async getAnnoncesEnAttente() {
        const res = await api.get('/admin/annonces/en-attente')
        return res.data
    },

    async validerAnnonce(id) {
        const res = await api.put(`/admin/annonces/${id}/publier`)
        return res.data
    },

    async refuserAnnonce(id) {
        const res = await api.put(`/admin/annonces/${id}/suspendre`)
        return res.data
    },

    async getProprietairesNonVerifies() {
        const res = await api.get('/admin/proprietaires/non-verifies')
        return res.data
    },

    async validerCni(id) {
        const res = await api.put(`/admin/proprietaires/${id}/valider-cni`)
        return res.data
    },

    async getUtilisateurs() {
        const res = await api.get('/admin/users')
        return res.data
    },

    async changerStatut(id, action) {
        // action = 'suspendre' ou 'reactiver'
        const res = await api.put(`/admin/users/${id}/${action}`)
        return res.data
    },
}