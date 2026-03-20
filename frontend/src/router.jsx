import { createBrowserRouter } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import Layout from './components/Layout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Annonces from './pages/annonces/Annonces'
import DetailAnnonce from './pages/annonces/DetailAnnonce'
import MesAnnonces from './pages/proprietaire/MesAnnonces'
import CreerAnnonce from './pages/proprietaire/CreerAnnonce'
import ModifierAnnonce from './pages/proprietaire/ModifierAnnonce'
import Dashboard from './pages/admin/Dashboard'



const router = createBrowserRouter([

    // Pages SANS navbar (auth)
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },

    // Pages AVEC navbar
    {
        path: '/',
        element: <Layout><Annonces /></Layout>
    },
    {
        path: '/annonces',
        element: <Layout><Annonces /></Layout>
    },
    {
        path: '/annonces/:id',
        element: <Layout><DetailAnnonce /></Layout>
    },

    {
        path: '/mes-annonces',
        element: (
            <PrivateRoute roles={['proprietaire']}>
                <Layout><MesAnnonces /></Layout>
            </PrivateRoute>
        )
    },

    {
        path: '/annonces/creer',
        element: (
            <PrivateRoute roles={['proprietaire']}>
                <Layout><CreerAnnonce /></Layout>
            </PrivateRoute>
        )
    },

    {
        path: '/mes-annonces/modifier/:id',
        element: (
            <PrivateRoute roles={['proprietaire']}>
                <Layout><ModifierAnnonce /></Layout>
            </PrivateRoute>
        )
    },

    {
        path: '/admin',
        element: (
            <PrivateRoute roles={['admin']}>
                <Layout><Dashboard /></Layout></PrivateRoute>
        )
    },
])

export default router