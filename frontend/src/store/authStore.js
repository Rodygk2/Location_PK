import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '../services/authService'

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isLoading: false,
            error: null,

            // Connexion
            login: async (email, password) => {
                set({ isLoading: true, error: null })
                try {
                    const data = await authService.login(email, password)
                    // Sauvegarder le token pour Axios
                    localStorage.setItem('token', data.token)
                    set({ user: data.user, token: data.token, isLoading: false })
                } catch (err) {
                    set({ error: 'Email ou mot de passe incorrect', isLoading: false })
                    throw err
                }
            },

            // Inscription
            register: async (formData) => {
                set({ isLoading: true, error: null })
                try {
                    const data = await authService.register(formData)
                    set({ isLoading: false })
                    return data
                } catch (err) {
                    set({ error: 'Erreur lors de l\'inscription', isLoading: false })
                    throw err
                }
            },

            // Déconnexion
            logout: async () => {
                try {
                    await authService.logout()
                } finally {
                    set({ user: null, token: null })
                }
            },

            // Vérificateurs de rôle
            isAuthenticated: () => !!get().user,

            isLocataire: () => {
                const user = get().user
                return user?.roles?.includes('locataire') || user?.role === 'locataire'
            },
            isProprietaire: () => {
                const user = get().user
                return user?.roles?.includes('proprietaire') || user?.role === 'proprietaire'
            },
            isAdmin: () => {
                const user = get().user
                return user?.roles?.includes('admin') || user?.role === 'admin'
            },
        }),
        {
            name: 'auth-storage', // clé dans localStorage
        }
    )
)