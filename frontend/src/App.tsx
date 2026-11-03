
import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import DealersPage from './pages/DealersPage';
import BookingPage from './pages/BookingPage';
import ContactPage from './pages/ContactPage';

import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

import DashboardPage from './pages/DashboardPage';
import MessagesPage from './pages/MessagesPage';

import {
  VehiclesPage,
  BrandsPage,
  BrandDetailsPage,
  VehicleDetailsPage
} from './pages/MarketplacePage';

gsap.registerPlugin(ScrollTrigger);

function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, [location.pathname]);

  return null;
}

function GuestOnly({
  children
}: {
  children: React.ReactNode;
}) {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return null;
  }

  if (user) {
    const destination =
      user.role === 'SUPER_ADMIN'
        ? '/admin/dashboard'
        : user.role === 'COMPANY_ADMIN'
          ? '/company/dashboard'
          : '/dashboard';

    return <Navigate to={destination} replace />;
  }

  return <>{children}</>;
}

function AppLayout() {
  const location = useLocation();

  const showFooter =
    location.pathname === '/' ||
    location.pathname === '/contact';

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';

    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#09243b] text-[#f8fafc]">
      <ScrollManager />

      <Navbar />

      <main className="min-h-[70vh]">
        <Routes>

          {/* PUBLIC PAGES */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/brands"
            element={<BrandsPage />}
          />

          <Route
            path="/brands/:brandId"
            element={<BrandDetailsPage />}
          />

          <Route
            path="/vehicles"
            element={<VehiclesPage />}
          />

          <Route
            path="/vehicles/:id"
            element={<VehicleDetailsPage />}
          />

          <Route
            path="/dealers"
            element={<DealersPage />}
          />

          <Route
            path="/contact"
            element={<ContactPage />}
          />

          <Route
            path="/booking"
            element={<BookingPage />}
          />

          {/* AUTHENTICATION */}

          <Route
            path="/signin"
            element={
              <GuestOnly>
                <SignInPage />
              </GuestOnly>
            }
          />

          <Route
            path="/signup"
            element={
              <GuestOnly>
                <SignUpPage />
              </GuestOnly>
            }
          />

          <Route
            path="/login"
            element={
              <GuestOnly>
                <SignInPage />
              </GuestOnly>
            }
          />

          <Route
            path="/company/login"
            element={
              <GuestOnly>
                <SignInPage />
              </GuestOnly>
            }
          />

          <Route
            path="/admin/login"
            element={
              <GuestOnly>
                <SignInPage />
              </GuestOnly>
            }
          />

          {/* CUSTOMER DASHBOARD */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={['CUSTOMER']}>
                <DashboardPage role="CUSTOMER" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/bookings"
            element={
              <ProtectedRoute roles={['CUSTOMER']}>
                <DashboardPage role="CUSTOMER" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/favourites"
            element={
              <ProtectedRoute roles={['CUSTOMER']}>
                <DashboardPage role="CUSTOMER" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute roles={['CUSTOMER']}>
                <DashboardPage role="CUSTOMER" />
              </ProtectedRoute>
            }
          />

          {/* CUSTOMER MESSAGES */}

          <Route
            path="/dashboard/messages"
            element={
              <ProtectedRoute roles={['CUSTOMER']}>
                <MessagesPage />
              </ProtectedRoute>
            }
          />

          {/* COMPANY ADMIN DASHBOARD */}

          <Route
            path="/company/dashboard"
            element={
              <ProtectedRoute roles={['COMPANY_ADMIN']}>
                <DashboardPage role="COMPANY_ADMIN" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/vehicles"
            element={
              <ProtectedRoute roles={['COMPANY_ADMIN']}>
                <DashboardPage role="COMPANY_ADMIN" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/vehicles/new"
            element={
              <ProtectedRoute roles={['COMPANY_ADMIN']}>
                <DashboardPage role="COMPANY_ADMIN" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/availability"
            element={<Navigate to="/company/vehicles" replace />}
          />

          <Route
            path="/company/showrooms"
            element={
              <ProtectedRoute roles={['COMPANY_ADMIN']}>
                <DashboardPage role="COMPANY_ADMIN" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/bookings"
            element={
              <ProtectedRoute roles={['COMPANY_ADMIN']}>
                <DashboardPage role="COMPANY_ADMIN" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/customers"
            element={
              <ProtectedRoute roles={['COMPANY_ADMIN']}>
                <DashboardPage role="COMPANY_ADMIN" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/settings"
            element={
              <ProtectedRoute roles={['COMPANY_ADMIN']}>
                <DashboardPage role="COMPANY_ADMIN" />
              </ProtectedRoute>
            }
          />

          {/* COMPANY ADMIN MESSAGES */}

          <Route
            path="/company/messages"
            element={
              <ProtectedRoute roles={['COMPANY_ADMIN']}>
                <MessagesPage />
              </ProtectedRoute>
            }
          />

          {/* SUPER ADMIN DASHBOARD */}

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={['SUPER_ADMIN']}>
                <DashboardPage role="SUPER_ADMIN" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/companies"
            element={
              <ProtectedRoute roles={['SUPER_ADMIN']}>
                <DashboardPage role="SUPER_ADMIN" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/vehicles"
            element={
              <ProtectedRoute roles={['SUPER_ADMIN']}>
                <DashboardPage role="SUPER_ADMIN" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute roles={['SUPER_ADMIN']}>
                <DashboardPage role="SUPER_ADMIN" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute roles={['SUPER_ADMIN']}>
                <DashboardPage role="SUPER_ADMIN" />
              </ProtectedRoute>
            }
          />



          {/* SUPER ADMIN MESSAGES */}

          <Route
            path="/admin/messages"
            element={
              <ProtectedRoute roles={['SUPER_ADMIN']}>
                <MessagesPage />
              </ProtectedRoute>
            }
          />

          {/* Legacy URLs redirect to the current MongoDB-backed marketplace. */}

          <Route
            path="/brand/:brandId"
            element={<Navigate to="/brands" replace />}
          />

          <Route
            path="/brand/:brandId/vehicle/:vehicleId"
            element={<Navigate to="/vehicles" replace />}
          />

          {/* UNKNOWN ROUTES */}

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>
      </main>

      {showFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}
