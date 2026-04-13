import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import Alert from '../../components/Alert'

function Register() {
    const [form, setForm] = useState({
        nom: '', prenom: '', email: '', telephone: '',
        password: '', password_confirmation: '', role: 'locataire',
    })
    const [errors, setErrors] = useState({})
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [alert, setAlert] = useState(null)
    const { register, isLoading } = useAuthStore()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
        // Effacer l'erreur du champ modifié
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: null }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setAlert(null)
        try {
            await register(form)
            setAlert({ type: 'success', message: 'Compte créé avec succès ! Vous allez être redirigé vers la connexion...' })
            setTimeout(() => navigate('/login'), 2000)
        } catch (err) {
            const errs = err.response?.data?.errors || {}
            setErrors(errs)
            const msg = err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.'
            setAlert({ type: 'error', message: msg })
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 sm:p-8">

                <h1 className="text-2xl font-bold text-primary text-center mb-1">
                    ChambreParakou
                </h1>
                <p className="text-gray-500 text-sm text-center mb-5">
                    Créez votre compte gratuitement
                </p>

                {/* Alerte */}
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

                    {/* Nom & Prénom */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Nom</label>
                            <input
                                name="nom" value={form.nom} onChange={handleChange}
                                placeholder="Kéita" required
                                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary ${errors.nom ? 'border-red-400' : 'border-gray-200'}`}
                            />
                            {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom[0]}</p>}
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Prénom</label>
                            <input
                                name="prenom" value={form.prenom} onChange={handleChange}
                                placeholder="Adama" required
                                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary ${errors.prenom ? 'border-red-400' : 'border-gray-200'}`}
                            />
                            {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom[0]}</p>}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Email</label>
                        <input
                            type="email" name="email" value={form.email} onChange={handleChange}
                            placeholder="email@exemple.com" required
                            className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
                    </div>

                    {/* Téléphone */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Téléphone</label>
                        <input
                            type="tel" name="telephone" value={form.telephone} onChange={handleChange}
                            placeholder="97 00 00 00" required
                            className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary ${errors.telephone ? 'border-red-400' : 'border-gray-200'}`}
                        />
                        {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone[0]}</p>}
                    </div>

                    {/* Mot de passe */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Mot de passe</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password" value={form.password} onChange={handleChange}
                                placeholder="••••••••" required
                                className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary pr-10 ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
                    </div>

                    {/* Confirmation */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Confirmer le mot de passe</label>
                        <div className="relative">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                name="password_confirmation" value={form.password_confirmation} onChange={handleChange}
                                placeholder="••••••••" required
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary pr-10"
                            />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showConfirm ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    {/* Rôle */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-2">Je suis :</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { value: 'locataire', label: '🔑 Locataire' },
                                { value: 'proprietaire', label: '🏠 Propriétaire' }
                            ].map(r => (
                                <button key={r.value} type="button"
                                    onClick={() => setForm(prev => ({ ...prev, role: r.value }))}
                                    className={`border rounded-xl py-3 text-sm font-medium transition ${form.role === r.value
                                            ? 'border-primary bg-indigo-50 text-primary'
                                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                        }`}>
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading}
                        className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
                        {isLoading ? 'Création...' : 'Créer mon compte'}
                    </button>

                </form>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Déjà un compte ?{' '}
                    <Link to="/login" className="text-primary font-medium">Se connecter</Link>
                </p>
            </div>
        </div>
    )
}

export default Register