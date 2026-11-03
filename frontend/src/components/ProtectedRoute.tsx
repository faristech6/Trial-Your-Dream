import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, type User } from '../context/AuthContext';

const roleHome: Record<User['role'], string> = {
  SUPER_ADMIN: '/admin/dashboard',
  COMPANY_ADMIN: '/company/dashboard',
  CUSTOMER: '/dashboard',
};

export default function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles: User['role'][] }) {
  const { user, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) return null;
  if (!user) return <Navigate to={`/signin?next=${encodeURIComponent(location.pathname)}`} replace />;
  if (!roles.includes(user.role)) return <Navigate to={roleHome[user.role]} replace />;
  return <>{children}</>;
}