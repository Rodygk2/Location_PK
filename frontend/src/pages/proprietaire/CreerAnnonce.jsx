import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { annonceService } from '../../services/annonceService'

function CreerAnnonce() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [previews, setPreviews] = useState([])
    const [form, setForm] = useState({
        titre: '',
        description: '',
        type_chambre: '',
        prix: '',
        meublee: false,
        periodicite: 'mensuel',   // ← nouveau
        nombre_pieces: '1',        // ← nouveau
        quartier: '',
        ville: 'Parakou',
        adresse_complete: '',
        latitude: '9.3370',        // ← nouveau (coordonnées Parakou)
        longitude: '2.6280',       // ← nouveau
        photos: [],
    })
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handlePhotos = (e) => {
        const files = Array.from(e.target.files)
        setForm(prev => ({ ...prev, photos: files }))
        setPreviews(files.map(f => URL.createObjectURL(f)))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrors({})
        try {
            await annonceService.create(form)
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

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">

            {/* En-tête */}
            <button
                onClick={() => navigate('/mes-annonces')}
                className="text-gray-500 hover:text-primary mb-6 flex items-center gap-2 transition"
            >
                ← Retour
            </button>

            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Créer une annonce
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Titre */}
                <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
                    <h2 className="font-semibold text-gray-700">Informations générales</h2>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">
                            Titre de l'annonce
                        </label>
                        <input
                            name="titre"
                            value={form.titre}
                            onChange={handleChange}
                            placeholder="Ex: Chambre meublée climatisée Banikanni"
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
                            placeholder="Décrivez la chambre, les équipements, l'environnement..."
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

                        {/* Periodicite + Nombre de pièces */}
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

                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Prix mensuel (FCFA)</label>
                            <input
                                type="number"
                                name="prix"
                                value={form.prix}
                                onChange={handleChange}
                                placeholder="25000"
                                required
                                min="1000"
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
                            />
                            {errors.prix && <p className="text-red-500 text-xs mt-1">{errors.prix[0]}</p>}
                        </div>
                    </div>

                    {/* Meublée */}
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
                                placeholder="Banikanni"
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
                                placeholder="Parakou"
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
                            placeholder="Ex: Rue de l'église, Banikanni"
                            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
                        />
                    </div>
                </div>

                {/* Photos */}
                <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
                    <h2 className="font-semibold text-gray-700">Photos</h2>

                    <label className="block border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-primary transition">
                        <span className="text-3xl block mb-2">📷</span>
                        <span className="text-sm text-gray-500">
                            Cliquez pour ajouter des photos
                        </span>
                        <span className="text-xs text-gray-400 block mt-1">
                            JPG, PNG — max 5 photos
                        </span>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handlePhotos}
                            className="hidden"
                        />
                    </label>

                    {/* Prévisualisations */}
                    {previews.length > 0 && (
                        <div className="flex gap-3 flex-wrap">
                            {previews.map((url, i) => (
                                <div key={i} className="relative">
                                    <img
                                        src={url}
                                        className="w-20 h-20 object-cover rounded-xl"
                                        alt={`Photo ${i + 1}`}
                                    />
                                    {i === 0 && (
                                        <span className="absolute bottom-0 left-0 right-0 bg-primary text-white text-xs text-center rounded-b-xl py-0.5">
                                            Principale
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bouton soumettre */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                    {loading ? 'Publication en cours...' : 'Publier l\'annonce'}
                </button>

            </form>
        </div>
    )
}

export default CreerAnnonce