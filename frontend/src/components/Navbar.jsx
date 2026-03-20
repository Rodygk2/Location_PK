import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

function Navbar() {
    const { user, logout, isAuthenticated, isProprietaire, isAdmin } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <nav className="bg-primary shadow-lg sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="text-white font-bold text-lg">
                    🏠 ChambreParakou
                </Link>

                {/* Liens navigation */}
                <div className="flex items-center gap-4">
                    <Link
                        to="/annonces"
                        className="text-white/80 hover:text-white text-sm transition"
                    >
                        Annonces
                    </Link>

                    {/* Liens propriétaire */}
                    {isAuthenticated() && isProprietaire() && (
                        <Link
                            to="/mes-annonces"
                            className="text-white/80 hover:text-white text-sm transition"
                        >
                            Mes annonces
                        </Link>
                    )}

                    {/* Lien admin */}
                    {isAuthenticated() && isAdmin() && (
                        <Link
                            to="/admin"
                            className="text-white/80 hover:text-white text-sm transition"
                        >
                            Dashboard
                        </Link>
                    )}
                </div>

                {/* Partie droite : connecté ou non */}
                <div className="flex items-center gap-3">
                    {isAuthenticated() ? (
                        <>
                            {/* Nom de l'utilisateur */}
                            <span className="text-white/80 text-sm hidden md:block">
                                Bonjour, {user?.prenom}
                            </span>

                            {/* Bouton déconnexion */}
                            <button
                                onClick={handleLogout}
                                className="bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-1.5 rounded-lg transition"
                            >
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-white/80 hover:text-white text-sm transition"
                            >
                                Connexion
                            </Link>
                            <Link
                                to="/register"
                                className="bg-white text-primary text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-indigo-50 transition"
                            >
                                S'inscrire
                            </Link>
                        </>
                    )}
                </div>

            </div>
        </nav>
    )
}

export default Navbar