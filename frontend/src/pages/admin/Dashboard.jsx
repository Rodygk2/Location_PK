import { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Dashboard() {
    const [stats, setStats] = useState(null)
    const [annonces, setAnnonces] = useState([])
    const [proprietaires, setProprietaires] = useState([])
    const [utilisateurs, setUtilisateurs] = useState([])
    const [loading, setLoading] = useState(true)
    const [onglet, setOnglet] = useState('annonces')

    const charger = async () => {
        setLoading(true)
        try {
            const [annoncesRes, propriosRes, usersRes] = await Promise.all([
                adminService.getAnnoncesEnAttente(),
                adminService.getProprietairesNonVerifies(),
                adminService.getUtilisateurs(),
            ])

            try {
                const statsRes = await adminService.getStats()
                setStats(statsRes.data || statsRes)
            } catch {
                setStats(null)
            }

            setAnnonces(Array.isArray(annoncesRes.data) ? annoncesRes.data
                : Array.isArray(annoncesRes.data?.data) ? annoncesRes.data.data : [])
            setProprietaires(Array.isArray(propriosRes.data) ? propriosRes.data
                : Array.isArray(propriosRes.data?.data) ? propriosRes.data.data : [])
            setUtilisateurs(Array.isArray(usersRes.data) ? usersRes.data
                : Array.isArray(usersRes.data?.data) ? usersRes.data.data : [])
        } catch (err) {
            console.error('Erreur dashboard:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { charger() }, [])

    const handleValiderAnnonce = async (id) => {
        try {
            await adminService.validerAnnonce(id)
            charger()
        } catch {
            alert('Erreur lors de la validation')
        }
    }

    const handleRefuserAnnonce = async (id) => {
        if (!confirm('Refuser cette annonce ?')) return
        try {
            await adminService.refuserAnnonce(id)
            charger()
        } catch {
            alert('Erreur lors du refus')
        }
    }

    const handleValiderCni = async (id) => {
        try {
            await adminService.validerCni(id)
            charger()
        } catch {
            alert('Erreur lors de la validation CNI')
        }
    }

    const handleChangerStatut = async (id, statut) => {
        const action = statut === 'actif' ? 'suspendre' : 'reactiver'
        try {
            await adminService.changerStatut(id, action)
            charger()
        } catch {
            alert('Erreur lors du changement de statut')
        }
    }

    if (loading) return (
        <div className="text-center py-32 text-gray-400">Chargement...</div>
    )

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">

            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Dashboard Admin
            </h1>

            {/* Statistiques */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-2xl shadow-xl p-5 text-center">
                        <p className="text-3xl font-bold text-primary">{stats.total_annonces ?? 0}</p>
                        <p className="text-gray-400 text-sm mt-1">Annonces publiées</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-5 text-center">
                        <p className="text-3xl font-bold text-yellow-500">{stats.annonces_en_attente ?? 0}</p>
                        <p className="text-gray-400 text-sm mt-1">En attente</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-5 text-center">
                        <p className="text-3xl font-bold text-green-500">{stats.total_users ?? 0}</p>
                        <p className="text-gray-400 text-sm mt-1">Utilisateurs</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-5 text-center">
                        <p className="text-3xl font-bold text-red-500">{stats.cni_non_verifies ?? 0}</p>
                        <p className="text-gray-400 text-sm mt-1">CNI à vérifier</p>
                    </div>
                </div>
            )}

            {/* Onglets */}
            <div className="flex gap-3 mb-6 flex-wrap">
                <button
                    onClick={() => setOnglet('annonces')}
                    className={`px-5 py-2 rounded-xl text-sm font-medium transition ${onglet === 'annonces'
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-500 shadow-xl hover:text-primary'
                        }`}
                >
                    Annonces en attente
                    {annonces.length > 0 && (
                        <span className="ml-2 bg-yellow-400 text-white text-xs px-2 py-0.5 rounded-full">
                            {annonces.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setOnglet('cni')}
                    className={`px-5 py-2 rounded-xl text-sm font-medium transition ${onglet === 'cni'
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-500 shadow-xl hover:text-primary'
                        }`}
                >
                    CNI à valider
                    {proprietaires.length > 0 && (
                        <span className="ml-2 bg-red-400 text-white text-xs px-2 py-0.5 rounded-full">
                            {proprietaires.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setOnglet('utilisateurs')}
                    className={`px-5 py-2 rounded-xl text-sm font-medium transition ${onglet === 'utilisateurs'
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-500 shadow-xl hover:text-primary'
                        }`}
                >
                    Utilisateurs
                    <span className="ml-2 bg-gray-400 text-white text-xs px-2 py-0.5 rounded-full">
                        {utilisateurs.length}
                    </span>
                </button>
            </div>

            {/* Annonces en attente */}
            {onglet === 'annonces' && (
                <div className="space-y-4">
                    {annonces.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                             Aucune annonce en attente
                        </div>
                    ) : (
                        annonces.map(annonce => {
                            const photo = annonce.photos?.find(p => p.est_principale)?.url
                            const quartier = annonce.quartier || annonce.localisation?.quartier || ''
                            return (
                                <div key={annonce.id} className="bg-white rounded-2xl shadow-xl p-4 flex gap-4 items-center">
                                    <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {photo ? (
                                            <img src={`${BACKEND_URL}/storage/${photo}`} alt={annonce.titre} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-2xl"></span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-800 truncate">{annonce.titre}</h3>
                                        <p className="text-gray-400 text-sm"> {quartier} · {Number(annonce.prix).toLocaleString('fr-FR')} FCFA/mois</p>
                                        <p className="text-gray-400 text-xs mt-0.5">Par {annonce.proprietaire?.prenom} {annonce.proprietaire?.nom}</p>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button onClick={() => handleValiderAnnonce(annonce.id)} className="bg-green-50 text-green-600 hover:bg-green-100 px-4 py-1.5 rounded-lg text-sm font-medium transition">
                                            ✓ Valider
                                        </button>
                                        <button onClick={() => handleRefuserAnnonce(annonce.id)} className="bg-red-50 text-red-500 hover:bg-red-100 px-4 py-1.5 rounded-lg text-sm font-medium transition">
                                            ✗ Refuser
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            )}

            {/* CNI à valider */}
            {onglet === 'cni' && (
                <div className="space-y-4">
                    {proprietaires.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                             Aucune CNI en attente
                        </div>
                    ) : (
                        proprietaires.map(proprio => (
                            <div key={proprio.id} className="bg-white rounded-2xl shadow-xl p-4 flex gap-4 items-center">
                                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                    <span className="text-primary font-bold text-lg">
                                        {proprio.prenom?.[0]}{proprio.nom?.[0]}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-800">{proprio.prenom} {proprio.nom}</h3>
                                    <p className="text-gray-400 text-sm">{proprio.email}</p>
                                    <p className="text-gray-400 text-sm">📞 {proprio.telephone}</p>
                                </div>
                                {proprio.cni_path && (

                                   <a href = {`${BACKEND_URL}/api/admin/proprietaires/${proprio.id}/cni`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary text-sm underline flex-shrink-0"
                                onClick={e => {
                                    e.preventDefault()
                                    fetch(`${BACKEND_URL}/api/admin/proprietaires/${proprio.id}/cni`, {
                                        headers: {
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then(res => res.blob())
                                        .then(blob => {
                                            const url = URL.createObjectURL(blob)
                                            window.open(url, '_blank')
                                        })
                                }}>
                                Voir CNI
                            </a>
                        )}
                                <button onClick={() => handleValiderCni(proprio.id)} className="bg-green-50 text-green-600 hover:bg-green-100 px-4 py-1.5 rounded-lg text-sm font-medium transition flex-shrink-0">
                                     Valider CNI
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Utilisateurs */}
            {onglet === 'utilisateurs' && (
                <div className="space-y-3">
                    {utilisateurs.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                            Aucun utilisateur trouvé
                        </div>
                    ) : (
                        utilisateurs.map(user => (
                            <div key={user.id} className="bg-white rounded-2xl shadow-xl p-4 flex gap-4 items-center">

                                {/* Avatar */}
                                <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                    <span className="text-primary font-bold">
                                        {user.prenom?.[0]}{user.nom?.[0]}
                                    </span>
                                </div>

                                {/* Infos */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-semibold text-gray-800">
                                            {user.prenom} {user.nom}
                                        </h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.role === 'admin'
                                                ? 'bg-purple-50 text-purple-600'
                                                : user.role === 'proprietaire'
                                                    ? 'bg-indigo-50 text-primary'
                                                    : 'bg-gray-50 text-gray-500'
                                            }`}>
                                            {user.role}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${user.statut === 'actif'
                                                ? 'bg-green-50 text-green-600'
                                                : 'bg-red-50 text-red-500'
                                            }`}>
                                            {user.statut}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm">{user.email}</p>
                                    <p className="text-gray-400 text-xs">
                                        📞 {user.telephone} · Inscrit le {user.created_at}
                                    </p>
                                </div>

                                {/* Bouton suspendre/activer — pas pour l'admin */}
                                {user.role !== 'admin' && (
                                    <button
                                        onClick={() => handleChangerStatut(user.id, user.statut)}
                                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition flex-shrink-0 ${user.statut === 'actif'
                                                ? 'bg-red-50 text-red-500 hover:bg-red-100'
                                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                                            }`}
                                    >
                                        {user.statut === 'actif' ? ' Suspendre' : ' Activer'}
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

        </div>
    )
}

export default Dashboard