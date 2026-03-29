import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { annonceService } from '../../services/annonceService'


function ModifierAnnonce() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [errors, setErrors] = useState({})
    const [form, setForm] = useState({
        titre: '',
        description: '',
        type_chambre: '',
        prix: '',
        meublee: false,
        eau_incluse: false,
        electricite_incluse: false,
        periodicite: 'mensuel',
        nombre_pieces: '1',
        quartier: '',
        ville: 'Parakou',
        adresse_complete: '',
    })

    // Charger les données existantes de l'annonce
    useEffect(() => {
        const charger = async () => {
            try {
                const res = await annonceService.getMesOne(id)  // ← changement ici
                const annonce = res.data || res
                setForm({
                    titre: annonce.titre || '',
                    description: annonce.description || '',
                    type_chambre: annonce.type_chambre || '',
                    prix: annonce.prix || '',
                    meublee: annonce.meublee || false,
                    eau_incluse: annonce.eau_incluse || false,
                    electricite_incluse: annonce.electricite_incluse || false,
                    periodicite: annonce.periodicite || 'mensuel',
                    nombre_pieces: String(annonce.nombre_pieces || '1'),
                    quartier: annonce.quartier || annonce.localisation?.quartier || '',
                    ville: annonce.ville || 'Parakou',
                    adresse_complete: annonce.localisation?.adresse_complete || '',
                })
            } catch {
                navigate('/mes-annonces')
            } finally {
                setLoadingData(false)
            }
        }
        charger()
    }, [id])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrors({})
        try {
            await annonceService.update(id, {
                ...form,
                meublee: form.meublee ? 1 : 0,
                eau_incluse: form.eau_incluse ? 1 : 0,
                electricite_incluse: form.electricite_incluse ? 1 : 0,
            })
            navigate('/mes-annonces')
        } catch (err) {
            setErrors(err.response?.data?.errors || {})
            if (err.response?.data?.message) {
                alert(err.response.data.message)
            }
        } finally {
            setLoading(false)
        }
    }

    if (loadingData) return (
        <div className="text-center py-32 text-gray-400">Chargement...</div>
    )

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">

            <button
                onClick={() => navigate('/mes-annonces')}
                className="text-gray-500 hover:text-primary mb-6 flex items-center gap-2 transition"
            >
                ← Retour
            </button>

            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Modifier l'annonce
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Informations générales */}
                <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
                    <h2 className="font-semibold text-gray-700">Informations générales</h2>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Titre</label>
                        <input
                            name="titre"
                            value={form.titre}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
                        />
                        {errors.titre && <p className="text-red-500 text-xs mt-1">{errors.titre[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Type de chambre</label>
                            <select
                                name="type_chambre"
                                value={form.type_chambre}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
                            >
                                <option value="">Choisir...</option>
                                <option value="chambre_simple">Chambre simple</option>
                                <option value="studio">Studio</option>
                                <option value="appartement">Appartement</option>
                                <option value="chambre_salon">Chambre salon</option>
                            </select>
                            {errors.type_chambre && <p className="text-red-500 text-xs mt-1">{errors.type_chambre[0]}</p>}
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Prix mensuel (FCFA)</label>
                            <input
                                type="number"
                                name="prix"
                                value={form.prix}
                                onChange={handleChange}
                                required
                                min="1000"
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
                            />
                            {errors.prix && <p className="text-red-500 text-xs mt-1">{errors.prix[0]}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Périodicité</label>
                            <select
                                name="periodicite"
                                value={form.periodicite}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
                            >
                                <option value="mensuel">Mensuel</option>
                                <option value="trimestriel">Trimestriel</option>
                                <option value="annuel">Annuel</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Nombre de pièces</label>
                            <select
                                name="nombre_pieces"
                                value={form.nombre_pieces}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
                            >
                                <option value="1">1 pièce</option>
                                <option value="2">2 pièces</option>
                                <option value="3">3 pièces</option>
                                <option value="4">4 pièces et plus</option>
                            </select>
                        </div>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            name="meublee"
                            checked={form.meublee}
                            onChange={handleChange}
                            className="w-4 h-4 accent-primary"
                        />
                        <span className="text-sm text-gray-700">Chambre meublée</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            name="eau_incluse"
                            checked={form.eau_incluse}
                            onChange={handleChange}
                            className="w-4 h-4 accent-primary"
                        />
                        <span className="text-sm text-gray-700">Eau incluse</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            name="electricite_incluse"
                            checked={form.electricite_incluse}
                            onChange={handleChange}
                            className="w-4 h-4 accent-primary"
                        />
                        <span className="text-sm text-gray-700">Electricité incluse</span>
                    </label>

                </div>

                {/* Localisation */}
                <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
                    <h2 className="font-semibold text-gray-700">Localisation</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Quartier</label>
                            <input
                                name="quartier"
                                value={form.quartier}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
                            />
                            {errors.quartier && <p className="text-red-500 text-xs mt-1">{errors.quartier[0]}</p>}
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Ville</label>
                            <input
                                name="ville"
                                value={form.ville}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Adresse complète</label>
                        <input
                            name="adresse_complete"
                            value={form.adresse_complete}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                    {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>

            </form>
        </div>
    )
}

export default ModifierAnnonce