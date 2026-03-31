import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { annonceService } from '../../services/annonceService'

const BACKEND_URL = 'http://localhost:8000'

const STATUT_STYLE = {
    publiee: 'bg-green-50 text-green-600',
    en_attente: 'bg-yellow-50 text-yellow-600',
    louee: 'bg-blue-50 text-blue-600',
    suspendue: 'bg-red-50 text-red-600',
}

function MesAnnonces() {
    const [annonces, setAnnonces] = useState([])
    const [loading, setLoading] = useState(true)

    const charger = async () => {
        setLoading(true)
        try {
            const res = await annonceService.getMes()
            const liste = Array.isArray(res.data?.data) ? res.data.data
                : Array.isArray(res.data) ? res.data
                    : []
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
            charger() // recharger la liste
        } catch {
            alert('Erreur lors de la suppression')
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">

            {/* En-tête */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Mes annonces</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {annonces.length} annonce{annonces.length > 1 ? 's' : ''}
                    </p>
                </div>
                <Link
                    to="/annonces/creer"
                    className="bg-primary text-white px-5 py-2 rounded-xl font-medium hover:bg-indigo-700 transition"
                >
                    + Nouvelle annonce
                </Link>
            </div>

            {/* Liste */}
            {loading ? (
                <div className="text-center py-20 text-gray-400">Chargement...</div>
            ) : annonces.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-400 text-lg mb-4">
                        Vous n'avez pas encore d'annonce
                    </p>
                    <Link
                        to="/annonces/creer"
                        className="bg-primary text-white px-6 py-2 rounded-xl font-medium hover:bg-indigo-700 transition"
                    >
                        Créer ma première annonce
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {annonces.map(annonce => {
                        const photo = annonce.photos?.find(p => p.est_principale)?.url
                        const quartier = annonce.localisation?.quartier || annonce.quartier || ''

                        return (
                            <div
                                key={annonce.id}
                                className="bg-white rounded-2xl shadow-xl p-4 flex gap-4 items-center"
                            >
                                {/* Miniature */}
                                <div className="w-20 h-20 rounded-xl bg-indigo-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {photo ? (
                                        <img
                                            src={`${BACKEND_URL}/storage/${photo}`}
                                            alt={annonce.titre}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-3xl"></span>
                                    )}
                                </div>

                                {/* Infos */}
                                <div className="flex-1 min-w-0">
                                    <h2 className="font-semibold text-gray-800 truncate">
                                        {annonce.titre}
                                    </h2>
                                    <p className="text-gray-400 text-sm">
                                         {quartier} · {Number(annonce.prix).toLocaleString('fr-FR')} FCFA/mois
                                    </p>
                                    <span className={`inline-block mt-1 text-xs px-3 py-0.5 rounded-full ${STATUT_STYLE[annonce.statut] || 'bg-gray-50 text-gray-500'}`}>
                                        {annonce.statut?.replace('_', ' ')}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 flex-shrink-0">
                                    <Link
                                        to={`/annonces/${annonce.id}`}
                                        className="border border-gray-200 text-gray-500 hover:text-primary hover:border-primary px-3 py-1.5 rounded-lg text-sm transition"
                                    >
                                        👁 Voir
                                    </Link>
                                    <Link
                                        to={`/mes-annonces/modifier/${annonce.id}`}
                                        className="border border-gray-200 text-gray-500 hover:text-primary hover:border-primary px-3 py-1.5 rounded-lg text-sm transition"
                                    >
                                        ✏ Modifier
                                    </Link>
                                    <button
                                        onClick={() => handleSupprimer(annonce.id)}
                                        className="border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-300 px-3 py-1.5 rounded-lg text-sm transition"
                                    >
                                        🗑 Supprimer
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