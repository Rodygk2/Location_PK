import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import Alert from '../../components/Alert'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [alert, setAlert] = useState(null)
    const { login, isLoading } = useAuthStore()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setAlert(null)
        try {
            await login(email, password)
            setAlert({ type: 'success', message: 'Connexion réussie ! Redirection...' })
            setTimeout(() => navigate('/annonces'), 1000)
        } catch {
            setAlert({ type: 'error', message: 'Email ou mot de passe incorrect. Veuillez réessayer.' })
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 sm:p-8">

                <h1 className="text-2xl font-bold text-primary text-center mb-1">
                    ChambreParakou
                </h1>
                <p className="text-gray-500 text-sm text-center mb-5">
                    Bon retour sur la plateforme
                </p>

                {alert && (
                    <div className="mb-4">
                        <Alert
                            type={alert.type}
                            message={alert.message}
                            onClose={() => setAlert(null)}
                            autoClose={alert.type === 'success'}
                        />
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Email</label>
                        <input
                            type="email" value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="email@exemple.com" required
                            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Mot de passe</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••" required
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary pr-10"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading}
                        className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
                        {isLoading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Pas de compte ?{' '}
                    <Link to="/register" className="text-primary font-medium">S'inscrire</Link>
                </p>
            </div>
        </div>
    )
}

export default Login