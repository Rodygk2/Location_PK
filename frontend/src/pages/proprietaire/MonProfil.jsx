import { useState, useEffect } from 'react'
import { profilService } from '../../services/profilService'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function MonProfil() {
    const [profil, setProfil] = useState(null)
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState(null)
    const [preview, setPreview] = useState(null)
    const [fichierCni, setFichierCni] = useState(null)
    const [editMode, setEditMode] = useState(false)
    const [formProfil, setFormProfil] = useState({
        nom: '', prenom: '', telephone: ''
    })
    const [savingProfil, setSavingProfil] = useState(false)

    const charger = async () => {
        try {
            const res = await profilService.getProfil()
            const data = res.data || res
            setProfil(data)
            setFormProfil({
                nom: data.nom || '',
                prenom: data.prenom || '',
                telephone: data.telephone || '',
            })
        } catch {
            console.error('Erreur chargement profil')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { charger() }, [])

    // Sélectionner le fichier sans uploader immédiatement
    const handleSelectCni = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setFichierCni(file)
        setPreview(URL.createObjectURL(file))
        setMessage(null)
    }

    // Confirmer et envoyer la CNI
    const handleConfirmerCni = async () => {
        if (!fichierCni) return
        setUploading(true)
        setMessage(null)
        try {
            await profilService.uploadCni(fichierCni)
            setMessage({ type: 'success', text: 'CNI soumise avec succès ! En attente de validation.' })
            setFichierCni(null)
            charger()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de l\'upload' })
        } finally {
            setUploading(false)
        }
    }

    // Annuler la sélection CNI
    const handleAnnulerCni = () => {
        setFichierCni(null)
        setPreview(null)
        setMessage(null)
    }

    // Modifier les infos personnelles
    const handleSaveProfil = async () => {
        setSavingProfil(true)
        try {
            await profilService.updateProfil(formProfil)
            setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' })
            setEditMode(false)
            charger()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la mise à jour' })
        } finally {
            setSavingProfil(false)
        }
    }

    if (loading) return (
        <div className="text-center py-32 text-gray-400">Chargement...</div>
    )

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Mon profil</h1>

            {/* Message global */}
            {message && (
                <div className={`rounded-xl px-4 py-3 mb-5 text-sm font-medium ${message.type === 'success'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-red-50 text-red-500'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Infos personnelles */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-700">Informations personnelles</h2>
                    {!editMode && (
                        <button
                            onClick={() => setEditMode(true)}
                            className="text-primary text-sm hover:underline"
                        >
                            ✏ Modifier
                        </button>
                    )}
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-xl">
                            {profil?.prenom?.[0]}{profil?.nom?.[0]}
                        </span>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 text-lg">
                            {profil?.prenom} {profil?.nom}
                        </p>
                        <p className="text-gray-400 text-sm">{profil?.email}</p>
                    </div>
                </div>

                {/* Mode lecture */}
                {!editMode ? (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-gray-400 mb-1">Nom</p>
                            <p className="font-medium text-gray-700">{profil?.nom}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-gray-400 mb-1">Prénom</p>
                            <p className="font-medium text-gray-700">{profil?.prenom}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-gray-400 mb-1">Téléphone</p>
                            <p className="font-medium text-gray-700">📞 {profil?.telephone}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-gray-400 mb-1">Statut</p>
                            <p className={`font-medium ${profil?.statut === 'actif' ? 'text-green-600' : 'text-red-500'
                                }`}>
                                {profil?.statut === 'actif' ? ' Actif' : ' Suspendu'}
                            </p>
                        </div>
                    </div>
                ) : (
                    /* Mode édition */
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Nom</label>
                                <input
                                    value={formProfil.nom}
                                    onChange={e => setFormProfil(p => ({ ...p, nom: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Prénom</label>
                                <input
                                    value={formProfil.prenom}
                                    onChange={e => setFormProfil(p => ({ ...p, prenom: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Téléphone</label>
                            <input
                                value={formProfil.telephone}
                                onChange={e => setFormProfil(p => ({ ...p, telephone: e.target.value }))}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleSaveProfil}
                                disabled={savingProfil}
                                className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                {savingProfil ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                            <button
                                onClick={() => setEditMode(false)}
                                className="border border-gray-200 text-gray-500 px-5 py-2 rounded-lg text-sm hover:border-gray-300 transition"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Section CNI */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="font-semibold text-gray-700 mb-2">
                    Carte Nationale d'Identité
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                    Votre CNI doit être validée par l'admin avant de pouvoir publier des annonces.
                </p>

                {/* Statut CNI */}
                <div className={`rounded-xl px-4 py-3 mb-5 text-sm font-medium ${profil?.cni_verifie
                        ? 'bg-green-50 text-green-600'
                        : profil?.cni_path
                            ? 'bg-yellow-50 text-yellow-600'
                            : 'bg-red-50 text-red-500'
                    }`}>
                    {profil?.cni_verifie
                        ? ' CNI vérifiée — vous pouvez publier des annonces'
                        : profil?.cni_path
                            ? ' CNI soumise — en attente de validation'
                            : ' Aucune CNI soumise — veuillez uploader votre CNI'}
                </div>

                {/* Aperçu CNI existante */}
                {profil?.cni_path && !preview && (
                    <div className="mb-5">
                        <p className="text-sm text-gray-500 mb-2">CNI actuelle :</p>
                        <img
                            src={`${BACKEND_URL}/storage/${profil.cni_path}`}
                            alt="CNI actuelle"
                            className="w-full max-w-sm rounded-xl border border-gray-200"
                        />
                    </div>
                )}

                {/* Prévisualisation nouvelle CNI sélectionnée */}
                {preview && !profil?.cni_verifie &&(
                    <div className="mb-5">
                        <p className="text-sm text-gray-500 mb-2">Nouvelle CNI sélectionnée :</p>
                        <img
                            src={preview}
                            alt="Aperçu CNI"
                            className="w-full max-w-sm rounded-xl border border-gray-200 mb-3"
                        />
                        {/* Boutons confirmer / annuler */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleConfirmerCni}
                                disabled={uploading}
                                className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                {uploading ? 'Envoi en cours...' : '✓ Confirmer l\'envoi'}
                            </button>
                            <button
                                onClick={handleAnnulerCni}
                                className="border border-gray-200 text-gray-500 px-5 py-2 rounded-lg text-sm hover:border-gray-300 transition"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                )}

                {/* Zone upload — visible seulement si pas de preview en cours */}
                {!preview && (
                    <label className="block border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-primary transition">
                        <span className="text-3xl block mb-2">🪪</span>
                        <span className="text-sm text-gray-500 block">
                            {profil?.cni_path
                                ? 'Cliquer pour changer la CNI'
                                : 'Cliquer pour uploader votre CNI'}
                        </span>
                        <span className="text-xs text-gray-400 block mt-1">
                            JPG, PNG — max 2 Mo
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleSelectCni}
                            className="hidden"
                        />
                    </label>
                )}
            </div>
        </div>
    )
}

export default MonProfil