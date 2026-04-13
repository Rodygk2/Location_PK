import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { annonceService } from '../../services/annonceService'
import Alert from '../../components/Alert'

function CreerAnnonce() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [alert, setAlert] = useState(null)
    const [previews, setPreviews] = useState([])
    const [form, setForm] = useState({
        titre: '', description: '', type_chambre: '', prix: '',
        meublee: false, eau_incluse: false, electricite_incluse: false,
        periodicite: 'mensuel', nombre_pieces: '1',
        quartier: '', ville: 'Parakou', adresse_complete: '',
        latitude: '9.3370', longitude: '2.6280', photos: [],
    })

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
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
        setAlert(null)
        try {
            await annonceService.create(form)
            setAlert({ type: 'success', message: 'Annonce créée avec succès ! En attente de validation.' })
            setTimeout(() => navigate('/mes-annonces'), 2000)
        } catch (err) {
            setErrors(err.response?.data?.errors || {})
            setAlert({ type: 'error', message: err.response?.data?.message || 'Erreur lors de la création.' })
        } finally {
            setLoading(false)
        }
    }

    const inputClass = (field) =>
        `w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary ${errors[field] ? 'border-red-400' : 'border-gray-200'}`

    return (
        <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
            <button onClick={() => navigate('/mes-annonces')}
                className="text-gray-500 hover:text-primary mb-5 flex items-center gap-2 transition text-sm">
                ← Retour
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-5">Créer une annonce</h1>

            {alert && (
                <div className="mb-5">
                    <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)}
                        autoClose={alert.type === 'success'} />
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

                {/* Infos générales */}
                <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 space-y-4">
                    <h2 className="font-semibold text-gray-700">Informations générales</h2>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Titre</label>
                        <input name="titre" value={form.titre} onChange={handleChange}
                            placeholder="Ex: Chambre meublée climatisée Banikanni" required
                            className={inputClass('titre')} />
                        {errors.titre && <p className="text-red-500 text-xs mt-1">{errors.titre[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange}
                            placeholder="Décrivez la chambre, les équipements..." required rows={4}
                            className={`${inputClass('description')} resize-none`} />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Type de chambre</label>
                            <select name="type_chambre" value={form.type_chambre} onChange={handleChange} required
                                className={inputClass('type_chambre')}>
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
                            <input type="number" name="prix" value={form.prix} onChange={handleChange}
                                placeholder="25000" required min="1000" className={inputClass('prix')} />
                            {errors.prix && <p className="text-red-500 text-xs mt-1">{errors.prix[0]}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Périodicité</label>
                            <select name="periodicite" value={form.periodicite} onChange={handleChange}
                                className={inputClass('periodicite')}>
                                <option value="mensuel">Mensuel</option>
                                <option value="trimestriel">Trimestriel</option>
                                <option value="annuel">Annuel</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Nombre de pièces</label>
                            <select name="nombre_pieces" value={form.nombre_pieces} onChange={handleChange}
                                className={inputClass('nombre_pieces')}>
                                <option value="1">1 pièce</option>
                                <option value="2">2 pièces</option>
                                <option value="3">3 pièces</option>
                                <option value="4">4 pièces et plus</option>
                            </select>
                        </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                            { name: 'meublee', label: '🛋 Meublée' },
                            { name: 'eau_incluse', label: '💧 Eau incluse' },
                            { name: 'electricite_incluse', label: '⚡ Électricité incluse' },
                        ].map(c => (
                            <label key={c.name} className="flex items-center gap-2 cursor-pointer p-3 border border-gray-100 rounded-xl hover:bg-gray-50">
                                <input type="checkbox" name={c.name} checked={form[c.name]} onChange={handleChange}
                                    className="w-4 h-4 accent-primary" />
                                <span className="text-sm text-gray-700">{c.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Localisation */}
                <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 space-y-4">
                    <h2 className="font-semibold text-gray-700">Localisation</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Quartier</label>
                            <input name="quartier" value={form.quartier} onChange={handleChange}
                                placeholder="Banikanni" required className={inputClass('quartier')} />
                            {errors.quartier && <p className="text-red-500 text-xs mt-1">{errors.quartier[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Ville</label>
                            <input name="ville" value={form.ville} onChange={handleChange}
                                className={inputClass('ville')} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Adresse complète</label>
                        <input name="adresse_complete" value={form.adresse_complete} onChange={handleChange}
                            placeholder="Ex: Rue de l'église, Banikanni" className={inputClass('adresse_complete')} />
                    </div>
                </div>

                {/* Photos */}
                <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 space-y-4">
                    <h2 className="font-semibold text-gray-700">Photos</h2>
                    <label className="block border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-primary transition">
                        <span className="text-3xl block mb-2">📷</span>
                        <span className="text-sm text-gray-500 block">Cliquez pour ajouter des photos</span>
                        <span className="text-xs text-gray-400 block mt-1">JPG, PNG — max 5 photos</span>
                        <input type="file" multiple accept="image/*" onChange={handlePhotos} className="hidden" />
                    </label>
                    {previews.length > 0 && (
                        <div className="flex gap-3 flex-wrap">
                            {previews.map((url, i) => (
                                <div key={i} className="relative">
                                    <img src={url} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl" />
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

                <button type="submit" disabled={loading}
                    className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-base sm:text-lg hover:bg-indigo-700 transition disabled:opacity-50">
                    {loading ? 'Publication...' : "Publier l'annonce"}
                </button>
            </form>
        </div>
    )
}

export default CreerAnnonce