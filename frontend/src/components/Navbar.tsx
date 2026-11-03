
import { useEffect, useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom';
import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const topLink =
  'rounded-lg border border-[#285673] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#174965]';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const dashboardPath =
    user?.role === 'SUPER_ADMIN'
      ? '/admin/dashboard'
      : user?.role === 'COMPANY_ADMIN'
        ? '/company/dashboard'
        : '/dashboard';

  const links = [
    ...(user
      ? [{
          label: 'Dashboard',
          path: dashboardPath,
          icon: LayoutDashboard
        }]
      : []),
    { label: 'Home', path: '/' },
    { label: 'Brands', path: '/brands' },
    { label: 'Vehicles', path: '/vehicles' },
    { label: 'Dealers', path: '/dealers' },
    { label: 'About', path: '/contact' }
  ];

  function isActive(path: string): boolean {
    if (path === '/') {
      return location.pathname === '/';
    }

    if (path === dashboardPath && user) {
      return (
        location.pathname.startsWith('/dashboard') ||
        location.pathname.startsWith('/company/') ||
        location.pathname.startsWith('/admin/')
      );
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  }

  function signOut() {
    logout();
    setMobileOpen(false);
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#09243b] text-white shadow-lg shadow-black/20 ">
      <div className="border-b border-[#285673]">
        <div className="mx-auto flex min-h-[72px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 xl:px-12">
          <Link
            to="/"
            aria-label="Trial Your Dream Home"
            className="inline-flex shrink-0 items-center   py-5"
          >
            <img
              src="/images/trial-your-dream-logo.svg"
              alt="Trial Your Dream"
              className="h-auto w-[125px] object-contain sm:w-[250px]"
            />
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <button
                type="button"
                onClick={signOut}
                className={`${topLink} inline-flex items-center gap-2`}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            ) : (
              <>
                <Link to="/signin" className={topLink}>
                  Sign In
                </Link>

                <Link
                  to="/signup"
                  className="rounded-lg bg-[#07549a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0875ac]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label={
              mobileOpen ? 'Close navigation' : 'Open navigation'
            }
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg border border-[#285673] p-2 text-white md:hidden"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <div className="border-b border-[#285673] bg-[#10324e]">
        <nav className="mx-auto hidden max-w-[1600px] items-center justify-between px-4 py-4 sm:px-6 md:flex lg:px-8 xl:px-12">
          <div className="flex flex-wrap items-center gap-2">
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                aria-current={
                  isActive(link.path) ? 'page' : undefined
                }
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  isActive(link.path)
                    ? 'bg-[#07549a] text-xl white'
                    : 'text-[#d6e4ea] hover:bg-[#174965] hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link
            to="/booking"
            className="inline-flex items-center gap-2 rounded-lg border border-[#16a7b7] px-4 py-2 text-sm font-semibold text-[#67d7df] transition hover:bg-[#07549a] hover:text-white"
          >
            <CalendarDays className="h-4 w-4" />
            Book a Trial
          </Link>
        </nav>

        {mobileOpen && (
          <nav className="mx-auto flex max-w-[1600px] flex-col gap-2 px-4 py-4 md:hidden">
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`rounded-lg px-4 py-3 text-sm font-semibold ${
                  isActive(link.path)
                    ? 'bg-[#07549a] text-white'
                    : 'text-[#d6e4ea] hover:bg-[#174965]'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Link
              to="/booking"
              className="flex items-center gap-2 rounded-lg border border-[#16a7b7] px-4 py-3 text-sm font-semibold text-[#67d7df]"
            >
              <CalendarDays className="h-4 w-4" />
              Book a Trial
            </Link>

            <div className="mt-2 border-t border-[#285673] pt-3">
              {user ? (
                <button
                  type="button"
                  onClick={signOut}
                  className="flex w-full items-center gap-2 rounded-lg bg-[#103a58] px-4 py-3 text-left text-sm font-semibold"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              ) : (
                <div className="flex gap-3">
                  <Link
                    to="/signin"
                    className={`${topLink} flex-1 text-center`}
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/signup"
                    className="flex-1 rounded-lg bg-[#07549a] px-4 py-3 text-center text-sm font-semibold"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
