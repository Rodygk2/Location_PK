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
    // Demandes reçues (propriétaire)
    async demandesRecues() {
        const res = await api.get('/proprietaire/demandes')
        return res.data
    },

    // Accepter une demande
    async accepterDemande(id) {
        const res = await api.put(`/proprietaire/demandes/${id}/accepter`)
        return res.data
    },

    // Refuser une demande
    async refuserDemande(id) {
        const res = await api.put(`/proprietaire/demandes/${id}/refuser`)
        return res.data
    },

}