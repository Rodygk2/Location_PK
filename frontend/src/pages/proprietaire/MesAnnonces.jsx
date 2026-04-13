import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { annonceService } from '../../services/annonceService'
import Alert from '../../components/Alert'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const STATUT_STYLE = {
    publiee: 'bg-green-50 text-green-600',
    en_attente: 'bg-yellow-50 text-yellow-600',
    louee: 'bg-blue-50 text-blue-600',
    suspendue: 'bg-red-50 text-red-500',
}

function MesAnnonces() {
    const [annonces, setAnnonces] = useState([])
    const [loading, setLoading] = useState(true)
    const [alert, setAlert] = useState(null)

    const charger = async () => {
        setLoading(true)
        try {
            const res = await annonceService.getMes()
            const liste = Array.isArray(res.data?.data) ? res.data.data
                : Array.isArray(res.data) ? res.data : []
            setAnnonces(liste)
        } catch {
            setAnnonces([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { charger() }, [])

    const handleSupprimer = async (id) => {
        if (!confirm('Supprimer cette annonce ?')) return
        try {
            await annonceService.delete(id)
            setAlert({ type: 'success', message: 'Annonce supprimée avec succès.' })
            charger()
        } catch {
            setAlert({ type: 'error', message: 'Erreur lors de la suppression.' })
        }
    }

    if (loading) return <div className="text-center py-32 text-gray-400">Chargement...</div>

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">

            <div className="flex items-center justify-between mb-5 sm:mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Mes annonces</h1>
                    <p className="text-gray-400 text-sm mt-1">{annonces.length} annonce{annonces.length > 1 ? 's' : ''}</p>
                </div>
                <Link to="/annonces/creer"
                    className="bg-primary text-white px-3 sm:px-5 py-2 rounded-xl font-medium hover:bg-indigo-700 transition text-sm">
                    + Nouvelle
                </Link>
            </div>

            {alert && (
                <div className="mb-4">
                    <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
                </div>
            )}

            {annonces.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-400 text-lg mb-4">Vous n'avez pas encore d'annonce</p>
                    <Link to="/annonces/creer"
                        className="bg-primary text-white px-6 py-2 rounded-xl font-medium hover:bg-indigo-700 transition">
                        Créer ma première annonce
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {annonces.map(annonce => {
                        const photo = annonce.photos?.find(p => p.est_principale)?.url
                        const quartier = annonce.localisation?.quartier || annonce.quartier || ''
                        return (
                            <div key={annonce.id} className="bg-white rounded-2xl shadow-xl p-4 flex gap-3 sm:gap-4 items-center">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-indigo-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {photo ? (
                                        <img src={`${BACKEND_URL}/storage/${photo}`} alt={annonce.titre} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl sm:text-3xl">🏠</span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="font-semibold text-gray-800 truncate text-sm sm:text-base">{annonce.titre}</h2>
                                    <p className="text-gray-400 text-xs sm:text-sm">📍 {quartier} · {Number(annonce.prix).toLocaleString('fr-FR')} FCFA/mois</p>
                                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${STATUT_STYLE[annonce.statut] || 'bg-gray-50 text-gray-500'}`}>
                                        {annonce.statut?.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                                    <Link to={`/annonces/${annonce.id}`}
                                        className="border border-gray-200 text-gray-500 hover:text-primary hover:border-primary px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm transition text-center">
                                        👁
                                    </Link>
                                    <Link to={`/mes-annonces/modifier/${annonce.id}`}
                                        className="border border-gray-200 text-gray-500 hover:text-primary hover:border-primary px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm transition text-center">
                                        ✏
                                    </Link>
                                    <button onClick={() => handleSupprimer(annonce.id)}
                                        className="border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-300 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm transition">
                                        🗑
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default MesAnnonces