import { Navigate } from 'react-router-dom'

type Props = {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: Props) => {
  const token = localStorage.getItem('accessToken')
  return !token ? <>{children}</> : <Navigate to="/login" />
}

export default ProtectedRoute
