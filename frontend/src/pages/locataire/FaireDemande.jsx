import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { paiementService } from '../../services/paiementService'
import { useAuthStore } from '../../store/authStore'

function FaireDemande({ annonce }) {
    const navigate = useNavigate()
    const { isAuthenticated, isLocataire } = useAuthStore()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [form, setForm] = useState({
        annonce_id: annonce?.id,
        moyen_paiement: 'especes',
        date_entree_souhaitee: '',
        message: '',
    })

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const res = await paiementService.creerDemande(form)

            // Si FedaPay → rediriger vers la page de paiement
            if (form.moyen_paiement === 'fedapay' && res.data?.payment_url) {
                window.location.href = res.data.payment_url
                return
            }

            // Si espèces → rediriger vers mes demandes
            navigate('/mes-demandes')
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la demande')
        } finally {
            setLoading(false)
        }
    }

    // Si pas connecté ou pas locataire
    if (!isAuthenticated()) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
                <p className="text-gray-500 text-sm text-center mb-4">
                    Connectez-vous pour faire une demande
                </p>
                <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-primary text-white py-2 rounded-xl font-medium hover:bg-indigo-700 transition"
                >
                    Se connecter
                </button>
            </div>
        )
    }

    if (!isLocataire()) {
        return null
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
            <h2 className="font-semibold text-gray-800 mb-4 text-lg">
                Faire une demande de location
            </h2>

            {error && (
                <div className="bg-red-50 text-red-500 text-sm px-4 py-2 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Moyen de paiement */}
                <div>
                    <label className="block text-sm text-gray-700 mb-2">
                        Moyen de paiement de la caution
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setForm(p => ({ ...p, moyen_paiement: 'especes' }))}
                            className={`border rounded-xl py-3 text-sm font-medium transition ${form.moyen_paiement === 'especes'
                                    ? 'border-primary bg-indigo-50 text-primary'
                                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                }`}
                        >
                             Espèces
                        </button>
                        <button
                            type="button"
                            onClick={() => setForm(p => ({ ...p, moyen_paiement: 'fedapay' }))}
                            className={`border rounded-xl py-3 text-sm font-medium transition ${form.moyen_paiement === 'fedapay'
                                    ? 'border-primary bg-indigo-50 text-primary'
                                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                }`}
                        >
                             Mobile Money
                        </button>
                    </div>
                </div>

                {/* Date d'entrée souhaitée */}
                <div>
                    <label className="block text-sm text-gray-700 mb-1">
                        Date d'entrée souhaitée
                    </label>
                    <input
                        type="date"
                        name="date_entree_souhaitee"
                        value={form.date_entree_souhaitee}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
                    />
                </div>

                {/* Message */}
                <div>
                    <label className="block text-sm text-gray-700 mb-1">
                        Message au propriétaire (optionnel)
                    </label>
                    <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Présentez-vous et précisez vos besoins..."
                        rows={3}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                    />
                </div>

                {/* Résumé caution */}
                <div className="bg-indigo-50 rounded-xl p-4 text-sm">
                    <div className="flex justify-between mb-1">
                        <span className="text-gray-500">Loyer mensuel</span>
                        <span className="font-medium">
                            {Number(annonce?.prix).toLocaleString('fr-FR')} FCFA
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Caution (3 mois)</span>
                        <span className="font-bold text-primary">
                            {Number(annonce?.caution).toLocaleString('fr-FR')} FCFA
                        </span>
                    </div>
                    {form.moyen_paiement === 'fedapay' && (
                        <p className="text-xs text-gray-400 mt-2">
                            Vous serez redirigé vers FedaPay pour payer la caution
                        </p>
                    )}
                    {form.moyen_paiement === 'especes' && (
                        <p className="text-xs text-gray-400 mt-2">
                            Le propriétaire vous contactera pour organiser le paiement
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                >
                    {loading ? 'Envoi en cours...' : 'Envoyer la demande'}
                </button>

            </form>
        </div>
    )
}

export default FaireDemande