import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

function Register() {
    const [form, setForm] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        password: '',
        password_confirmation: '',
        role: 'locataire',
    })
    const [errors, setErrors] = useState({})
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const { register, isLoading } = useAuthStore()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await register(form)
            navigate('/login')
        } catch (err) {
            setErrors(err.response?.data?.errors || {})
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-8">

                <h1 className="text-2xl font-bold text-primary text-center mb-1">
                    ChambreParakou
                </h1>
                <p className="text-gray-500 text-sm text-center mb-6">
                    Créez votre compte gratuitement
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="block text-sm text-gray-700 mb-1">Nom</label>
                            <input
                                name="nom"
                                value={form.nom}
                                onChange={handleChange}
                                placeholder="Kéita"
                                required
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            />
                            {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom[0]}</p>}
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm text-gray-700 mb-1">Prénom</label>
                            <input
                                name="prenom"
                                value={form.prenom}
                                onChange={handleChange}
                                placeholder="Adama"
                                required
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            />
                            {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom[0]}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="email@exemple.com"
                            required
                            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Téléphone</label>
                        <input
                            type="tel"
                            name="telephone"
                            value={form.telephone}
                            onChange={handleChange}
                            placeholder="97 00 00 00"
                            required
                            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
                        />
                        {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone[0]}</p>}
                    </div>

                    {/* Mot de passe */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Mot de passe</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
                    </div>

                    {/* Confirmation mot de passe */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">
                            Confirmer le mot de passe
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                name="password_confirmation"
                                value={form.password_confirmation}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirm ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    {/* Choix du rôle */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-2">Je suis :</label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setForm(prev => ({ ...prev, role: 'locataire' }))}
                                className={`flex-1 border rounded-xl py-3 text-sm font-medium transition
                  ${form.role === 'locataire'
                                        ? 'border-primary bg-indigo-50 text-primary'
                                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                    }`}
                            >
                                🔑 Locataire
                            </button>
                            <button
                                type="button"
                                onClick={() => setForm(prev => ({ ...prev, role: 'proprietaire' }))}
                                className={`flex-1 border rounded-xl py-3 text-sm font-medium transition
                  ${form.role === 'proprietaire'
                                        ? 'border-primary bg-indigo-50 text-primary'
                                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                    }`}
                            >
                                🏠 Propriétaire
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {isLoading ? 'Création...' : 'Créer mon compte'}
                    </button>

                </form>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Déjà un compte ?{' '}
                    <Link to="/login" className="text-primary font-medium">
                        Se connecter
                    </Link>
                </p>

            </div>
        </div>
    )
}

export default Register