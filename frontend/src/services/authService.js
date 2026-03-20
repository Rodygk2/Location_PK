import api from './api'

export const authService = {

    async register(data) {
        const res = await api.post('/auth/register', data)
        return res.data
    },

    async login(email, password) {
        const res = await api.post('/auth/login', { email, password })
        return res.data.data  // retourne { user, token }
    },

    async logout() {
        try {
            await api.post('/auth/logout')
        } finally {
            localStorage.removeItem('token')
        }
    },

    async me() {
        const res = await api.get('/auth/me')
        return res.data
    },
}