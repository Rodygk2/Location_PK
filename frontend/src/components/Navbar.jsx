import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

function Navbar() {
    const { user, logout, isAuthenticated, isLocataire, isProprietaire, isAdmin } = useAuthStore()
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = async () => {
        await logout()
        setMenuOpen(false)
        navigate('/login')
    }

    const closeMenu = () => setMenuOpen(false)

    const links = [
        { to: '/annonces', label: 'Annonces', show: true },
        { to: '/mes-annonces', label: 'Mes annonces', show: isAuthenticated() && isProprietaire() },
        { to: '/demandes-recues', label: 'Demandes reçues', show: isAuthenticated() && isProprietaire() },
        { to: '/mon-profil', label: 'Mon profil', show: isAuthenticated() && isProprietaire() },
        { to: '/mes-demandes', label: 'Mes demandes', show: isAuthenticated() && isLocataire() },
        { to: '/mes-contrats', label: 'Mes contrats', show: isAuthenticated() && (isLocataire() || isProprietaire()) },
        { to: '/admin', label: 'Dashboard', show: isAuthenticated() && isAdmin() },
    ].filter(l => l.show)

    return (
        <nav className="bg-primary shadow-lg sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="text-white font-bold text-lg flex-shrink-0">
                    🏠 ChambreParakou
                </Link>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-4">
                    {links.map(l => (
                        <Link key={l.to} to={l.to}
                            className="text-white/80 hover:text-white text-sm transition">
                            {l.label}
                        </Link>
                    ))}
                </div>

                {/* Desktop auth */}
                <div className="hidden md:flex items-center gap-3">
                    {isAuthenticated() ? (
                        <>
                            <span className="text-white/80 text-sm">Bonjour, {user?.prenom}</span>
                            <button onClick={handleLogout}
                                className="bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-1.5 rounded-lg transition">
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-white/80 hover:text-white text-sm transition">
                                Connexion
                            </Link>
                            <Link to="/register"
                                className="bg-white text-primary text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-indigo-50 transition">
                                S'inscrire
                            </Link>
                        </>
                    )}
                </div>

                {/* Hamburger mobile */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition"
                >
                    {menuOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Menu mobile */}
            {menuOpen && (
                <div className="md:hidden bg-indigo-700 px-4 py-3 space-y-2">
                    {links.map(l => (
                        <Link key={l.to} to={l.to} onClick={closeMenu}
                            className="block text-white/90 hover:text-white py-2 text-sm border-b border-white/10">
                            {l.label}
                        </Link>
                    ))}
                    <div className="pt-2">
                        {isAuthenticated() ? (
                            <>
                                <p className="text-white/60 text-xs mb-2">Connecté en tant que {user?.prenom}</p>
                                <button onClick={handleLogout}
                                    className="w-full bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-2 rounded-lg transition text-left">
                                    Déconnexion
                                </button>
                            </>
                        ) : (
                            <div className="flex gap-2">
                                <Link to="/login" onClick={closeMenu}
                                    className="flex-1 text-center bg-white/10 text-white text-sm py-2 rounded-lg">
                                    Connexion
                                </Link>
                                <Link to="/register" onClick={closeMenu}
                                    className="flex-1 text-center bg-white text-primary text-sm font-semibold py-2 rounded-lg">
                                    S'inscrire
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar