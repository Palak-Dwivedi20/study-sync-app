// src/routes/PublicRoute.jsx
import { Navigate, Outlet } from 'react-router'
import { useSelector } from 'react-redux'
import { Loader } from '../components/ComponentImport'

const PublicRoute = () => {
    const { isVerified, isLoading } = useSelector(state => state.auth)

    if (isLoading) return <Loader />

    return isVerified ? <Navigate to="/dashboard" replace /> : <Outlet />
}

export default PublicRoute
