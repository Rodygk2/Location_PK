import { useState, useEffect } from 'react'
import { annonceService } from '../../services/annonceService'
import CarteAnnonce from '../../components/CarteAnnonce'

const TYPES = [
    { label: 'Tout', value: '' },
    { label: 'Chambre simple', value: 'chambre_simple' },
    { label: 'Studio', value: 'studio' },
    { label: 'Appartement', value: 'appartement' },
]

function Annonces() {
    const [annonces, setAnnonces] = useState([])
    const [loading, setLoading] = useState(true)
    const [filtres, setFiltres] = useState({
        quartier: '', prix_max: '', type_chambre: '', meublee: '',
    })

    useEffect(() => {
        const charger = async () => {
            setLoading(true)
            try {
                const params = Object.fromEntries(
                    Object.entries(filtres).filter(([, v]) => v !== '')
                )
                const res = await annonceService.getAll(params)
                const liste = Array.isArray(res) ? res
                    : Array.isArray(res.data) ? res.data
                        : Array.isArray(res.data?.data) ? res.data.data
                            : []
                setAnnonces(liste)
            } catch {
                setAnnonces([])
            } finally {
                setLoading(false)
            }
        }
        charger()
    }, [filtres])

    return (
        <div>
            {/* Hero */}
            <div
                className="relative py-12 sm:py-16 px-4 text-center"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-3">
                    Trouvez votre chambre à Parakou
                </h1>
                <p className="text-white/80 mb-6 text-sm sm:text-lg">
                    Des annonces vérifiées, sans intermédiaire
                </p>
                <div className="max-w-xl mx-auto bg-white rounded-xl shadow-xl flex overflow-hidden">
                    <input
                        type="text"
                        placeholder="Rechercher par quartier..."
                        value={filtres.quartier}
                        onChange={e => setFiltres(prev => ({ ...prev, quartier: e.target.value }))}
                        className="flex-1 px-4 py-3 text-sm focus:outline-none min-w-0"
                    />
                    <div className="bg-primary px-4 sm:px-5 flex items-center text-white text-sm font-medium whitespace-nowrap">
                        Chercher
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">

                {/* Filtres — scroll horizontal sur mobile */}
                <div className="flex gap-2 sm:gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    {TYPES.map(t => (
                        <button
                            key={t.value}
                            onClick={() => setFiltres(prev => ({ ...prev, type_chambre: t.value }))}
                            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm border transition whitespace-nowrap flex-shrink-0 ${filtres.type_chambre === t.value
                                    ? 'bg-primary text-white border-primary'
                                    : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                    <button
                        onClick={() => setFiltres(prev => ({ ...prev, meublee: prev.meublee === '1' ? '' : '1' }))}
                        className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm border transition whitespace-nowrap flex-shrink-0 ${filtres.meublee === '1'
                                ? 'bg-primary text-white border-primary'
                                : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                            }`}
                    >
                        Meublé
                    </button>
                    <select
                        value={filtres.prix_max}
                        onChange={e => setFiltres(prev => ({ ...prev, prix_max: e.target.value }))}
                        className="border border-gray-200 rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-gray-600 focus:outline-none focus:border-primary flex-shrink-0"
                    >
                        <option value="">Prix max</option>
                        <option value="20000">20 000 FCFA</option>
                        <option value="30000">30 000 FCFA</option>
                        <option value="50000">50 000 FCFA</option>
                        <option value="100000">100 000 FCFA</option>
                    </select>
                </div>

                {/* Résultats */}
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Chargement...</div>
                ) : annonces.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">Aucune annonce trouvée.</p>
                        <p className="text-gray-300 text-sm mt-1">Essaie de modifier les filtres</p>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-500 text-sm mb-4">
                            {annonces.length} annonce{annonces.length > 1 ? 's' : ''} trouvée{annonces.length > 1 ? 's' : ''}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {annonces.map(a => <CarteAnnonce key={a.id} annonce={a} />)}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Annonces