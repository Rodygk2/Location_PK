import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

function PrivateRoute({ children, roles = [] }) {
    const { isAuthenticated, user } = useAuthStore()

    if (!isAuthenticated()) return <Navigate to="/login" />

    if (roles.length > 0) {
        // Gérer "role" (string) ET "roles" (tableau)
        const userRoles = Array.isArray(user?.roles)
            ? user.roles
            : user?.role
                ? [user.role]
                : []

        const aAcces = roles.some(r => userRoles.includes(r))
        if (!aAcces) return <Navigate to="/" />
    }

    return children
}

export default PrivateRoute