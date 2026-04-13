import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { annonceService } from '../../services/annonceService'
import BoutonsContact from '../../components/BoutonsContact'
import FaireDemande from '../locataire/FaireDemande'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

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

    if (loading) return <div className="text-center py-32 text-gray-400">Chargement...</div>
    if (!annonce) return null

    const photos = annonce.photos || []
    const quartier = annonce.localisation?.quartier || annonce.quartier || ''

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">

            <button onClick={() => navigate('/annonces')}
                className="flex items-center gap-2 text-gray-500 hover:text-primary mb-4 sm:mb-6 transition text-sm">
                ← Retour aux annonces
            </button>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

                {/* Photos */}
                <div className="relative h-56 sm:h-72 bg-indigo-100 flex items-center justify-center">
                    {photos.length > 0 ? (
                        <>
                            <img
                                src={`${BACKEND_URL}/storage/${photos[photoActive]?.url}`}
                                alt={annonce.titre}
                                className="w-full h-full object-cover"
                            />
                            {photos.length > 1 && (
                                <div className="absolute bottom-3 flex gap-2">
                                    {photos.map((_, i) => (
                                        <button key={i} onClick={() => setPhotoActive(i)}
                                            className={`w-2.5 h-2.5 rounded-full transition ${i === photoActive ? 'bg-white' : 'bg-white/50'}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <span className="text-7xl">🏠</span>
                    )}
                </div>

                <div className="p-4 sm:p-6">

                    {/* Titre */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">{annonce.titre}</h1>
                            <p className="text-gray-400 text-sm">📍 {quartier}, Parakou</p>
                        </div>
                        <span className="bg-green-50 text-green-600 text-sm px-3 py-1 rounded-full self-start">
                            Disponible
                        </span>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-5">
                        <span className="bg-indigo-50 text-primary text-sm px-4 py-1.5 rounded-full">
                            {annonce.type_chambre?.replace('_', ' ')}
                        </span>
                        {annonce.meublee && <span className="bg-green-50 text-green-600 text-sm px-4 py-1.5 rounded-full">✓ Meublée</span>}
                        {annonce.eau_incluse && <span className="bg-blue-50 text-blue-600 text-sm px-4 py-1.5 rounded-full">💧 Eau incluse</span>}
                        {annonce.electricite_incluse && <span className="bg-yellow-50 text-yellow-600 text-sm px-4 py-1.5 rounded-full">⚡ Électricité incluse</span>}
                    </div>

                    {/* Prix */}
                    <div className="bg-indigo-50 rounded-xl p-4 sm:p-5 mb-5">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Loyer mensuel</p>
                                <p className="text-2xl sm:text-3xl font-bold text-primary">
                                    {Number(annonce.prix).toLocaleString('fr-FR')}
                                    <span className="text-base font-normal text-gray-400"> FCFA</span>
                                </p>
                            </div>
                            <div className="sm:text-right">
                                <p className="text-gray-500 text-sm mb-1">Caution légale (3 mois)</p>
                                <p className="text-xl font-bold text-gray-700">
                                    {Number(annonce.caution).toLocaleString('fr-FR')}
                                    <span className="text-sm font-normal text-gray-400"> FCFA</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-5">
                        <h2 className="font-semibold text-gray-800 mb-2">Description</h2>
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{annonce.description}</p>
                    </div>

                    {/* Propriétaire */}
                    {annonce.proprietaire && (
                        <div className="border border-gray-100 rounded-xl p-4 mb-5">
                            <h2 className="font-semibold text-gray-800 mb-3">Propriétaire</h2>
                            <p className="text-gray-600 mb-1">{annonce.proprietaire.prenom} {annonce.proprietaire.nom}</p>
                            <BoutonsContact
                                nom={annonce.proprietaire.nom}
                                prenom={annonce.proprietaire.prenom}
                                telephone={annonce.proprietaire.telephone}
                                message={`Bonjour, je suis intéressé(e) par votre annonce "${annonce.titre}" sur ChambreParakou.`}
                            />
                        </div>
                    )}

                    {/* Formulaire demande */}
                    <FaireDemande annonce={annonce} />

                </div>
            </div>
        </div>
    )
}

export default DetailAnnonce