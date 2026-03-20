import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { annonceService } from '../../services/annonceService'

const BACKEND_URL = 'http://localhost:8000'

function DetailAnnonce() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [annonce, setAnnonce] = useState(null)
    const [loading, setLoading] = useState(true)
    const [photoActive, setPhotoActive] = useState(0)

    useEffect(() => {
        const charger = async () => {
            try {
                const res = await annonceService.getOne(id)
                setAnnonce(res.data || res)
            } catch {
                navigate('/annonces')
            } finally {
                setLoading(false)
            }
        }
        charger()
    }, [id])

    if (loading) return (
        <div className="text-center py-32 text-gray-400">Chargement...</div>
    )

    if (!annonce) return null

    const photos = annonce.photos || []
    const quartier = annonce.localisation?.quartier || annonce.quartier || ''

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">

            {/* Bouton retour */}
            <button
                onClick={() => navigate('/annonces')}
                className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition"
            >
                ← Retour aux annonces
            </button>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

                {/* Photos */}
                <div className="relative h-72 bg-indigo-100 flex items-center justify-center">
                    {photos.length > 0 ? (
                        <>
                            <img
                                src={`${BACKEND_URL}/storage/${photos[photoActive]?.url}`}
                                alt={annonce.titre}
                                className="w-full h-full object-cover"
                            />
                            {/* Miniatures */}
                            {photos.length > 1 && (
                                <div className="absolute bottom-3 flex gap-2">
                                    {photos.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPhotoActive(i)}
                                            className={`w-2.5 h-2.5 rounded-full transition ${i === photoActive ? 'bg-white' : 'bg-white/50'
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <span className="text-7xl">🏠</span>
                    )}
                </div>

                <div className="p-6">

                    {/* Titre + localisation */}
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-1">
                                {annonce.titre}
                            </h1>
                            <p className="text-gray-400">
                                📍 {quartier}, Parakou
                            </p>
                        </div>
                        {/* Badge statut */}
                        <span className="bg-green-50 text-green-600 text-sm px-3 py-1 rounded-full">
                            Disponible
                        </span>
                    </div>

                    {/* Badges caractéristiques */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className="bg-indigo-50 text-primary text-sm px-4 py-1.5 rounded-full">
                            {annonce.type_chambre?.replace('_', ' ')}
                        </span>
                        {annonce.meublee && (
                            <span className="bg-green-50 text-green-600 text-sm px-4 py-1.5 rounded-full">
                                ✓ Meublée
                            </span>
                        )}
                    </div>

                    {/* Prix + Caution */}
                    <div className="bg-indigo-50 rounded-xl p-5 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Loyer mensuel</p>
                                <p className="text-3xl font-bold text-primary">
                                    {Number(annonce.prix).toLocaleString('fr-FR')}
                                    <span className="text-lg font-normal text-gray-400"> FCFA</span>
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-500 text-sm mb-1">Caution légale (3 mois)</p>
                                <p className="text-xl font-bold text-gray-700">
                                    {Number(annonce.caution).toLocaleString('fr-FR')}
                                    <span className="text-sm font-normal text-gray-400"> FCFA</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h2 className="font-semibold text-gray-800 mb-2">Description</h2>
                        <p className="text-gray-600 leading-relaxed">
                            {annonce.description}
                        </p>
                    </div>

                    {/* Propriétaire */}
                    {annonce.proprietaire && (
                        <div className="border border-gray-100 rounded-xl p-4 mb-6">
                            <h2 className="font-semibold text-gray-800 mb-2">Propriétaire</h2>
                            <p className="text-gray-600">
                                {annonce.proprietaire.prenom} {annonce.proprietaire.nom}
                            </p>
                            <p className="text-gray-400 text-sm">
                                📞 {annonce.proprietaire.telephone}
                            </p>
                        </div>
                    )}

                    {/* Bouton contact */}
                    <button className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition">
                        Contacter le propriétaire
                    </button>

                </div>
            </div>
        </div>
    )
}

export default DetailAnnonce