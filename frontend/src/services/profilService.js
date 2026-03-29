import api from './api'

export const profilService = {

    async getProfil() {
        const res = await api.get('/proprietaire/profil')
        return res.data
    },

    async uploadCni(file) {
        const formData = new FormData()
        formData.append('cni', file)
        const res = await api.post('/proprietaire/profil/cni', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        return res.data
    },

    async updateProfil(data) {
        const res = await api.put('/proprietaire/profil', data)
        return res.data
    },
}