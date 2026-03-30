import { useState, useEffect } from 'react'
import { paiementService } from '../../services/paiementService'

const BACKEND_URL = 'http://localhost:8000'

const STATUT_STYLE = {
    en_attente: 'bg-yellow-50 text-yellow-600',
    acceptee: 'bg-green-50 text-green-600',
    refusee: 'bg-red-50 text-red-500',
}

const STATUT_LABEL = {
    en_attente: '⏳ En attente',
    acceptee: '✅ Acceptée',
    refusee: '❌ Refusée',
}

function DemandesRecues() {
    const [demandes, setDemandes] = useState([])
    const [loading, setLoading] = useState(true)

    const charger = async () => {
        setLoading(true)
        try {
            const res = await paiementService.demandesRecues()
            console.log('RES COMPLET:', res)
            console.log('RES.DATA:', res.data)
            console.log('RES.DATA.DATA:', res.data?.data)
            console.log('RES.DATA.DATA.DATA:', res.data?.data?.data)
            const liste = Array.isArray(res.data) ? res.data
                : Array.isArray(res.data?.data) ? res.data.data
                    : Array.isArray(res.data?.data?.data) ? res.data.data.data
                        : []
            console.log('LISTE FINALE:', liste)
            setDemandes(liste)
        } catch (err) {
            console.error('Erreur:', err)
            setDemandes([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { charger() }, [])

    const handleAccepter = async (id) => {
        try {
            await paiementService.accepterDemande(id)
            charger()
        } catch {
            alert('Erreur lors de l\'acceptation')
        }
    }

    const handleRefuser = async (id) => {
        if (!confirm('Refuser cette demande ?')) return
        try {
            await paiementService.refuserDemande(id)
            charger()
        } catch {
            alert('Erreur lors du refus')
        }
    }

    if (loading) return (
        <div className="text-center py-32 text-gray-400">Chargement...</div>
    )

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Demandes reçues</h1>
            <p className="text-gray-400 text-sm mb-6">
                {demandes.length} demande{demandes.length > 1 ? 's' : ''}
            </p>

            {demandes.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    Aucune demande reçue pour le moment
                </div>
            ) : (
                <div className="space-y-4">
                    {demandes.map(demande => {
                        const locataire = demande.locataire
                        const annonce = demande.annonce
                        const paiement = demande.paiements?.[0]

                        return (
                            <div key={demande.id} className="bg-white rounded-2xl shadow-xl p-5">

                                {/* En-tête */}
                                <div className="flex items-start justify-between gap-2 flex-wrap mb-4">
                                    <div className="flex items-center gap-3">
                                        {/* Avatar locataire */}
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                            <span className="text-primary font-bold text-sm">
                                                {locataire?.prenom?.[0]}{locataire?.nom?.[0]}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {locataire?.prenom} {locataire?.nom}
                                            </p>
                                            <p className="text-gray-400 text-xs">
                                                📞 {locataire?.telephone} · {locataire?.email}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUT_STYLE[demande.statut]}`}>
                                        {STATUT_LABEL[demande.statut]}
                                    </span>
                                </div>

                                {/* Annonce concernée */}
                                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                                    <p className="text-sm font-medium text-gray-700">
                                        🏠 {annonce?.titre}
                                    </p>
                                    <p className="text-gray-400 text-xs mt-1">
                                        📍 {annonce?.quartier} ·
                                        💰 {Number(annonce?.prix).toLocaleString('fr-FR')} FCFA/mois
                                    </p>
                                </div>

                                {/* Détails demande */}
                                <div className="flex flex-wrap gap-4 text-sm mb-3">
                                    <span className="text-gray-500">
                                        💳 <span className="font-medium">
                                            {demande.moyen_paiement === 'fedapay' ? '📱 Mobile Money' : '💵 Espèces'}
                                        </span>
                                    </span>
                                    {demande.date_entree_souhaitee && (
                                        <span className="text-gray-500">
                                            📅 Entrée souhaitée : <span className="font-medium">
                                                {new Date(demande.date_entree_souhaitee).toLocaleDateString('fr-FR')}
                                            </span>
                                        </span>
                                    )}
                                </div>

                                {/* Statut paiement */}
                                {paiement && (
                                    <div className={`inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full mb-3 ${paiement.statut === 'complete'
                                            ? 'bg-green-50 text-green-600'
                                            : paiement.statut === 'echoue'
                                                ? 'bg-red-50 text-red-500'
                                                : 'bg-yellow-50 text-yellow-600'
                                        }`}>
                                        {paiement.statut === 'complete' && '✅ Caution payée via Mobile Money'}
                                        {paiement.statut === 'echoue' && '❌ Paiement Mobile Money échoué'}
                                        {paiement.statut === 'en_attente' && '⏳ Paiement en attente'}
                                    </div>
                                )}

                                {/* Message locataire */}
                                {demande.message && (
                                    <div className="bg-indigo-50 rounded-xl p-3 mb-4 text-sm text-gray-600 italic">
                                        "{demande.message}"
                                    </div>
                                )}

                                {/* Actions — seulement si en attente */}
                                {demande.statut === 'en_attente' && (
                                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => handleAccepter(demande.id)}
                                            className="bg-green-50 text-green-600 hover:bg-green-100 px-5 py-2 rounded-lg text-sm font-medium transition"
                                        >
                                            ✓ Accepter
                                        </button>
                                        <button
                                            onClick={() => handleRefuser(demande.id)}
                                            className="bg-red-50 text-red-500 hover:bg-red-100 px-5 py-2 rounded-lg text-sm font-medium transition"
                                        >
                                            ✗ Refuser
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default DemandesRecues