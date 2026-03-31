import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { paiementService } from '../../services/paiementService'

const BACKEND_URL = 'http://localhost:8000'

const STATUT_STYLE = {
    en_attente: 'bg-yellow-50 text-yellow-600',
    acceptee: 'bg-green-50 text-green-600',
    refusee: 'bg-red-50 text-red-500',
}

const STATUT_LABEL = {
    en_attente: ' En attente',
    acceptee: ' Acceptée',
    refusee: ' Refusée',
}

function MesDemandes() {
    const [demandes, setDemandes] = useState([])
    const [loading, setLoading] = useState(true)

    const charger = async () => {
        setLoading(true)
        try {
            const res = await paiementService.mesDemandes()
            const toutes = Array.isArray(res.data) ? res.data : []
            setDemandes(toutes.filter(d => d.statut !== 'annulee'))
        } catch {
            setDemandes([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { charger() }, [])

    const handleAnnuler = async (id) => {
        if (!confirm('Annuler cette demande ?')) return
        try {
            await paiementService.annulerDemande(id)
            charger()
        } catch {
            alert('Erreur lors de l\'annulation')
        }
    }

    if (loading) return (
        <div className="text-center py-32 text-gray-400">Chargement...</div>
    )

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Mes demandes</h1>

            {demandes.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-400 text-lg mb-4">
                        Vous n'avez pas encore de demande
                    </p>
                    <Link
                        to="/annonces"
                        className="bg-primary text-white px-6 py-2 rounded-xl font-medium hover:bg-indigo-700 transition"
                    >
                        Parcourir les annonces
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {demandes.map(demande => {
                        const annonce = demande.annonce
                        const photo = annonce?.photos?.find(p => p.est_principale)?.url
                        const paiement = demande.paiements?.[0]

                        return (
                            <div key={demande.id} className="bg-white rounded-2xl shadow-xl p-5">
                                <div className="flex gap-4 items-start">

                                    {/* Photo annonce */}
                                    <div className="w-20 h-20 rounded-xl bg-indigo-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {photo ? (
                                            <img
                                                src={`${BACKEND_URL}/storage/${photo}`}
                                                alt={annonce?.titre}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-3xl"> </span>
                                        )}
                                    </div>

                                    {/* Infos */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 flex-wrap">
                                            <h2 className="font-semibold text-gray-800 truncate">
                                                {annonce?.titre}
                                            </h2>
                                            <span className={`text-xs px-3 py-1 rounded-full font-medium flex-shrink-0 ${STATUT_STYLE[demande.statut]}`}>
                                                {STATUT_LABEL[demande.statut]}
                                            </span>
                                        </div>

                                        <p className="text-gray-400 text-sm mt-1">
                                             {annonce?.quartier}, Parakou
                                        </p>

                                        <div className="flex flex-wrap gap-4 mt-2 text-sm">
                                            <span className="text-gray-500">
                                                 Caution : <span className="font-medium text-primary">
                                                    {Number(annonce?.caution).toLocaleString('fr-FR')} FCFA
                                                </span>
                                            </span>
                                            <span className="text-gray-500">
                                                 Paiement : <span className="font-medium">
                                                    {demande.moyen_paiement === 'fedapay' ? '📱 Mobile Money' : '💵 Espèces'}
                                                </span>
                                            </span>
                                            {demande.date_entree_souhaitee && (
                                                <span className="text-gray-500">
                                                     Entrée souhaitée : <span className="font-medium">
                                                        {new Date(demande.date_entree_souhaitee).toLocaleDateString('fr-FR')}
                                                    </span>
                                                </span>
                                            )}
                                        </div>
                                        import BoutonsContact from '../../components/BoutonsContact'

                                        {/* Ajoute après la date d'entrée souhaitée */}
                                        {demande.statut === 'acceptee' && annonce?.proprietaire && (
                                            <div className="mt-3">
                                                <p className="text-xs text-gray-400 mb-1">Contacter le propriétaire :</p>
                                                <BoutonsContact
                                                    nom={annonce.proprietaire?.nom}
                                                    prenom={annonce.proprietaire?.prenom}
                                                    telephone={annonce.proprietaire?.telephone}
                                                    message={`Bonjour, je suis votre locataire pour "${annonce?.titre}" sur ChambreParakou.`}
                                                />
                                            </div>
                                        )}

                                        {/* Statut paiement */}
                                        {paiement && (
                                            <div className={`mt-3 inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full ${paiement.statut === 'complete'
                                                    ? 'bg-green-50 text-green-600'
                                                    : paiement.statut === 'echoue'
                                                        ? 'bg-red-50 text-red-500'
                                                        : 'bg-yellow-50 text-yellow-600'
                                                }`}>
                                                {paiement.statut === 'complete' && ' Caution payée'}
                                                {paiement.statut === 'echoue' && ' Paiement échoué'}
                                                {paiement.statut === 'en_attente' && ' Paiement en attente'}
                                            </div>
                                        )}

                                        {demande.message && (
                                            <p className="text-gray-400 text-xs mt-2 italic">
                                                "{demande.message}"
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                {demande.statut === 'en_attente' && (
                                    <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => handleAnnuler(demande.id)}
                                            className="border border-red-200 text-red-500 hover:bg-red-50 px-4 py-1.5 rounded-lg text-sm transition"
                                        >
                                            Annuler la demande
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

export default MesDemandes