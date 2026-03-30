import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { contratService } from '../../services/contratService'

const STATUT_STYLE = {
    en_attente_locataire: 'bg-yellow-50 text-yellow-600',
    en_attente_proprietaire: 'bg-blue-50 text-blue-600',
    signe: 'bg-green-50 text-green-600',
    annule: 'bg-red-50 text-red-500',
}

const STATUT_LABEL = {
    en_attente_locataire: '⏳ En attente de votre signature',
    en_attente_proprietaire: '⏳ En attente du propriétaire',
    signe: '✅ Contrat signé',
    annule: '❌ Annulé',
}

function MesContrats() {
    const [contrats, setContrats] = useState([])
    const [loading, setLoading] = useState(true)
    const [downloading, setDownloading] = useState(null)

    useEffect(() => {
        const charger = async () => {
            try {
                const res = await contratService.mesContrats()
                setContrats(Array.isArray(res.data) ? res.data : [])
            } catch {
                setContrats([])
            } finally {
                setLoading(false)
            }
        }
        charger()
    }, [])

    const handleTelecharger = async (id) => {
        setDownloading(id)
        try {
            await contratService.telecharger(id)
        } catch {
            alert('Erreur lors du téléchargement')
        } finally {
            setDownloading(null)
        }
    }

    if (loading) return (
        <div className="text-center py-32 text-gray-400">Chargement...</div>
    )

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Mes contrats</h1>

            {contrats.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    Aucun contrat pour le moment
                </div>
            ) : (
                <div className="space-y-4">
                    {contrats.map(contrat => (
                        <div key={contrat.id} className="bg-white rounded-2xl shadow-xl p-5">

                            {/* En-tête */}
                            <div className="flex items-start justify-between gap-2 flex-wrap mb-4">
                                <div>
                                    <h2 className="font-semibold text-gray-800">
                                         {contrat.annonce?.titre}
                                    </h2>
                                    <p className="text-gray-400 text-sm mt-1">
                                         {contrat.annonce?.quartier}, Parakou
                                    </p>
                                    <p className="text-gray-400 text-xs mt-1">
                                        Contrat N° {String(contrat.id).padStart(6, '0')}
                                    </p>
                                </div>
                                <span className={`text-xs px-3 py-1 rounded-full font-medium flex-shrink-0 ${STATUT_STYLE[contrat.statut]}`}>
                                    {STATUT_LABEL[contrat.statut]}
                                </span>
                            </div>

                            {/* Détails financiers */}
                            <div className="bg-indigo-50 rounded-xl p-4 mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500">Loyer mensuel</span>
                                    <span className="font-medium text-primary">
                                        {Number(contrat.loyer).toLocaleString('fr-FR')} FCFA
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500">Caution</span>
                                    <span className="font-medium">
                                        {Number(contrat.caution).toLocaleString('fr-FR')} FCFA
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Date de début</span>
                                    <span className="font-medium">
                                        {contrat.date_debut
                                            ? new Date(contrat.date_debut).toLocaleDateString('fr-FR')
                                            : '—'}
                                    </span>
                                </div>
                            </div>

                            {/* Statut signatures */}
                            <div className="flex gap-3 mb-4 flex-wrap">
                                <div className={`text-xs px-3 py-1 rounded-full ${contrat.signature_locataire
                                        ? 'bg-green-50 text-green-600'
                                        : 'bg-gray-50 text-gray-400'
                                    }`}>
                                    {contrat.signature_locataire ? '✅' : '⏳'} Locataire
                                </div>
                                <div className={`text-xs px-3 py-1 rounded-full ${contrat.signature_proprietaire
                                        ? 'bg-green-50 text-green-600'
                                        : 'bg-gray-50 text-gray-400'
                                    }`}>
                                    {contrat.signature_proprietaire ? '✅' : '⏳'} Propriétaire
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 flex-wrap pt-4 border-t border-gray-100">
                                <Link
                                    to={`/contrats/${contrat.id}`}
                                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                                >
                                     Voir et signer
                                </Link>
                                {contrat.statut === 'signe' && (
                                    <button
                                        onClick={() => handleTelecharger(contrat.id)}
                                        disabled={downloading === contrat.id}
                                        className="bg-green-50 text-green-600 hover:bg-green-100 px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
                                    >
                                        {downloading === contrat.id ? 'Téléchargement...' : ' Télécharger PDF'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MesContrats