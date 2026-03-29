import api from './api'

export const paiementService = {

    // Créer une demande de location
    async creerDemande(data) {
        const res = await api.post('/locataire/demandes', data)
        return res.data
    },

    // Mes demandes (locataire)
    async mesDemandes() {
        const res = await api.get('/locataire/demandes')
        return res.data
    },

    // Historique paiements
    async historique() {
        const res = await api.get('/locataire/paiements')
        return res.data
    },

    // Annuler une demande
    async annulerDemande(id) {
        const res = await api.put(`/locataire/demandes/${id}/annuler`)
        return res.data
    },
}