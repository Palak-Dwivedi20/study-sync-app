// src/routes/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router'
import { useSelector } from 'react-redux'
import { Loader } from '../components/ComponentImport'

const PrivateRoute = () => {
  const { isAuthenticated, isAuthChecked } = useSelector(state => state.auth)

  if (!isAuthChecked) return <Loader /> // or loader/spinner

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoute
