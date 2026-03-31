import { Link } from 'react-router-dom'

const BACKEND_URL = 'http://localhost:8000'

function CarteAnnonce({ annonce }) {
    const photo = annonce.photos?.find(p => p.est_principale)?.url
    const imageUrl = photo ? `${BACKEND_URL}/storage/${photo}` : null

    // Quartier depuis localisation OU directement depuis l'annonce
    const quartier = annonce.localisation?.quartier
        || annonce.quartier
        || ''

    return (
        <Link
            to={`/annonces/${annonce.id}`}
            className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-200"
        >
            {/* Photo */}
            <div className="h-48 bg-indigo-100 flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                    <img
                        src={`${BACKEND_URL}/storage/${photos[photoActive]?.url}`}
                        alt={annonce.titre}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-5xl"></span>
                )}
            </div>

            {/* Infos */}
            <div className="p-4">
                <h2 className="font-semibold text-gray-800 truncate mb-1">
                    {annonce.titre}
                </h2>
                <p className="text-gray-400 text-sm mb-3">
                     {quartier}, Parakou
                </p>

                <div className="flex items-center justify-between">
                    <span className="text-primary font-bold text-lg">
                        {Number(annonce.prix).toLocaleString('fr-FR')} FCFA
                        <span className="text-gray-400 font-normal text-sm">/mois</span>
                    </span>
                    <span className="bg-indigo-50 text-primary text-xs px-3 py-1 rounded-full">
                        {annonce.type_chambre?.replace('_', ' ')}
                    </span>
                </div>

                {annonce.meublee && (
                    <span className="inline-block mt-2 bg-green-50 text-green-600 text-xs px-3 py-1 rounded-full">
                        ✓ Meublée
                    </span>
                )}

                {annonce.eau_incluse && (
                    <span className="inline-block mt-2 bg-green-50 text-green-600 text-xs px-3 py-1 rounded-full">
                        ✓ Eau incluse
                    </span>
                )}

                {annonce.electricite_incluse && (
                    <span className="inline-block mt-2 bg-green-50 text-green-600 text-xs px-3 py-1 rounded-full">
                        ✓ Electricité incluse
                    </span>
                )}
            </div>
        </Link>
    )
}

export default CarteAnnonce