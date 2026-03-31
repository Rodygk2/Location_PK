import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { contratService } from '../../services/contratService'
import { useAuthStore } from '../../store/authStore'
import SignatureCanvas from 'react-signature-canvas'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function DetailContrat() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const [contrat, setContrat] = useState(null)
    const [loading, setLoading] = useState(true)
    const [signing, setSigning] = useState(false)
    const [showCanvas, setShowCanvas] = useState(false)
    const sigCanvas = useRef(null)

    const charger = async () => {
        try {
            const res = await contratService.getOne(id)
            setContrat(res.data || res)
        } catch {
            navigate('/mes-contrats')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { charger() }, [id])

    const peutSigner = () => {
        if (!contrat || !user) return false

        const userId = user.id || user?.id

        // Locataire peut signer en premier
        if (userId === contrat.locataire_id && !contrat.signature_locataire) {
            return true
        }

        // Propriétaire peut signer après le locataire
        if (userId === contrat.proprietaire_id && contrat.signature_locataire && !contrat.signature_proprietaire) {
            return true
        }

        return false
    }

    const handleSigner = async () => {
        if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
            alert('Veuillez signer dans le cadre avant de valider.')
            return
        }
        setSigning(true)
        try {
            const signature = sigCanvas.current.toDataURL('image/png')
            await contratService.signer(id, signature)
            setShowCanvas(false)
            charger()
        } catch {
            alert('Erreur lors de la signature')
        } finally {
            setSigning(false)
        }
    }

    const handleTelecharger = async () => {
        try {
            await contratService.telecharger(id)
        } catch {
            alert('Erreur lors du téléchargement')
        }
    }

    if (loading) return (
        <div className="text-center py-32 text-gray-400">Chargement...</div>
    )

    if (!contrat) return null

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">

            <button
                onClick={() => navigate('/mes-contrats')}
                className="text-gray-500 hover:text-primary mb-6 flex items-center gap-2 transition"
            >
                ← Retour aux contrats
            </button>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

                {/* En-tête */}
                <div className="bg-primary px-6 py-5 text-white">
                    <h1 className="text-xl font-bold">Contrat de location</h1>
                    <p className="text-white/70 text-sm mt-1">
                        N° {String(contrat.id).padStart(6, '0')}
                    </p>
                </div>

                <div className="p-6 space-y-6">

                    {/* Parties */}
                    <div>
                        <h2 className="font-semibold text-gray-700 mb-3">Parties</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs text-gray-400 mb-1">Propriétaire</p>
                                <p className="font-medium">{contrat.proprietaire?.prenom} {contrat.proprietaire?.nom}</p>
                                <p className="text-xs text-gray-400">{contrat.proprietaire?.telephone}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs text-gray-400 mb-1">Locataire</p>
                                <p className="font-medium">{contrat.locataire?.prenom} {contrat.locataire?.nom}</p>
                                <p className="text-xs text-gray-400">{contrat.locataire?.telephone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bien loué */}
                    <div>
                        <h2 className="font-semibold text-gray-700 mb-3">Bien loué</h2>
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="font-medium">{contrat.annonce?.titre}</p>
                            <p className="text-gray-400 text-sm"> {contrat.annonce?.quartier}, Parakou</p>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                <span className="bg-indigo-50 text-primary text-xs px-2 py-1 rounded-full">
                                    {contrat.annonce?.type_chambre?.replace('_', ' ')}
                                </span>
                                {contrat.annonce?.meublee && (
                                    <span className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full">Meublée</span>
                                )}
                                {contrat.annonce?.eau_incluse && (
                                    <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full"> Eau incluse</span>
                                )}
                                {contrat.annonce?.electricite_incluse && (
                                    <span className="bg-yellow-50 text-yellow-600 text-xs px-2 py-1 rounded-full"> Électricité incluse</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Conditions financières */}
                    <div>
                        <h2 className="font-semibold text-gray-700 mb-3">Conditions financières</h2>
                        <div className="bg-indigo-50 rounded-xl p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Loyer mensuel</span>
                                <span className="font-bold text-primary">{Number(contrat.loyer).toLocaleString('fr-FR')} FCFA</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Caution (3 mois)</span>
                                <span className="font-medium">{Number(contrat.caution).toLocaleString('fr-FR')} FCFA</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Durée</span>
                                <span className="font-medium">{contrat.duree}</span>
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
                    </div>

                    {/* Signatures */}
                    <div>
                        <h2 className="font-semibold text-gray-700 mb-3">Signatures</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="border border-gray-100 rounded-xl p-4 text-center">
                                <p className="text-sm font-medium text-gray-700 mb-2">Locataire</p>
                                {contrat.signature_locataire ? (
                                    <>
                                        <img src={contrat.signature_locataire} alt="Signature" className="max-h-16 mx-auto" />
                                        <p className="text-xs text-green-600 mt-2">
                                             Signé le {new Date(contrat.signe_locataire_le).toLocaleDateString('fr-FR')}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-xs text-gray-400"> En attente</p>
                                )}
                            </div>
                            <div className="border border-gray-100 rounded-xl p-4 text-center">
                                <p className="text-sm font-medium text-gray-700 mb-2">Propriétaire</p>
                                {contrat.signature_proprietaire ? (
                                    <>
                                        <img src={contrat.signature_proprietaire} alt="Signature" className="max-h-16 mx-auto" />
                                        <p className="text-xs text-green-600 mt-2">
                                             Signé le {new Date(contrat.signe_proprietaire_le).toLocaleDateString('fr-FR')}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-xs text-gray-400"> En attente</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Zone de signature */}
                    {peutSigner() && (
                        <div>
                            <h2 className="font-semibold text-gray-700 mb-3">Votre signature</h2>
                            {!showCanvas ? (
                                <button
                                    onClick={() => setShowCanvas(true)}
                                    className="w-full border-2 border-dashed border-primary text-primary py-4 rounded-xl hover:bg-indigo-50 transition text-sm font-medium"
                                >
                                     Cliquer pour signer le contrat
                                </button>
                            ) : (
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">
                                        Signez dans le cadre ci-dessous :
                                    </p>
                                    <div className="border-2 border-primary rounded-xl overflow-hidden">
                                        <SignatureCanvas
                                            ref={sigCanvas}
                                            penColor="#4F46E5"
                                            canvasProps={{
                                                width: 600,
                                                height: 150,
                                                className: 'w-full bg-white'
                                            }}
                                        />
                                    </div>
                                    <div className="flex gap-3 mt-3">
                                        <button
                                            onClick={handleSigner}
                                            disabled={signing}
                                            className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                                        >
                                            {signing ? 'Signature en cours...' : 'Valider ma signature'}
                                        </button>
                                        <button
                                            onClick={() => sigCanvas.current?.clear()}
                                            className="border border-gray-200 text-gray-500 px-4 py-2 rounded-lg text-sm hover:border-gray-300 transition"
                                        >
                                            Effacer
                                        </button>
                                        <button
                                            onClick={() => setShowCanvas(false)}
                                            className="border border-gray-200 text-gray-500 px-4 py-2 rounded-lg text-sm hover:border-gray-300 transition"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Télécharger PDF */}
                    {contrat.statut === 'signe' && (
                        <button
                            onClick={handleTelecharger}
                            className="w-full bg-green-50 text-green-600 hover:bg-green-100 py-3 rounded-xl font-medium transition"
                        >
                             Télécharger le contrat signé (PDF)
                        </button>
                    )}

                </div>
            </div>
        </div>
    )
}

export default DetailContrat