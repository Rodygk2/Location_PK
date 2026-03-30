import api from './api'

export const contratService = {

    async mesContrats() {
        const res = await api.get('/contrats')
        return res.data
    },

    async getOne(id) {
        const res = await api.get(`/contrats/${id}`)
        return res.data
    },

    async generer(demandeId) {
        const res = await api.post(`/contrats/generer/${demandeId}`)
        return res.data
    },

    async signer(id, signature) {
        const res = await api.post(`/contrats/${id}/signer`, { signature })
        return res.data
    },

    async telecharger(id) {
        const res = await api.get(`/contrats/${id}/pdf`, {
            responseType: 'blob'
        })
        // Créer un lien de téléchargement
        const url = URL.createObjectURL(res.data)
        const a = document.createElement('a')
        a.href = url
        a.download = `contrat_${id}.pdf`
        a.click()
        URL.revokeObjectURL(url)
    },
}