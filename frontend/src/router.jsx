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
import MonProfil from './pages/proprietaire/MonProfil'
import MesDemandes from './pages/locataire/MesDemandes'
import DemandesRecues from './pages/proprietaire/DemandesRecues'
import MesContrats from './pages/contrats/MesContrats'
import DetailContrat from './pages/contrats/DetailContrat'




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

    {
        path: '/mon-profil',
        element: (
            <PrivateRoute roles={['proprietaire']}>
                <Layout><MonProfil /></Layout>
            </PrivateRoute>
        )
    },

    {
        path: '/mes-demandes',
        element: (
            <PrivateRoute roles={['locataire']}>
                <Layout><MesDemandes /></Layout>
            </PrivateRoute>
        )
    },

    // Locataire
    {
        path: '/mes-demandes',
        element: (
            <PrivateRoute roles={['locataire']}>
                <Layout><MesDemandes /></Layout>
            </PrivateRoute>
        )
    },

    // Propriétaire
    {
        path: '/demandes-recues',
        element: (
            <PrivateRoute roles={['proprietaire']}>
                <Layout><DemandesRecues /></Layout>
            </PrivateRoute>
        )
    },

    {
        path: '/mes-contrats',
        element: (
            <PrivateRoute roles={['locataire', 'proprietaire']}>
                <Layout><MesContrats /></Layout>
            </PrivateRoute>
        )
    },

    {
        path: '/contrats/:id',
        element: (
            <PrivateRoute roles={['locataire', 'proprietaire']}>
                <Layout><DetailContrat /></Layout>
            </PrivateRoute>
        )
    },

])

export default router