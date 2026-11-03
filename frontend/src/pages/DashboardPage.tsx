
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarDays,
  CarFront,
  CheckCircle2,
  Clock3,
  ClipboardList,
  Heart,
  LayoutDashboard,
  Loader2,
  MapPin,
  MessageSquare,
  Settings,
  ShieldCheck,
  Store,
  Trash2,
  Users,
  XCircle
} from 'lucide-react';

import { useAuth, type User } from '../context/AuthContext';
import { apiFetch, assetSrc } from '../lib/api';

import CompanyVehicles from '../components/dashboard/CompanyVehicles';
import AdminCompanies from '../components/dashboard/AdminCompanies';
import AdminAnalytics from '../components/dashboard/AdminAnalytics';
import AdminVehicles from '../components/dashboard/AdminVehicles';
import CompanyShowrooms from '../components/dashboard/CompanyShowrooms';
import CompanyCustomers from '../components/dashboard/CompanyCustomers';
import CompanySettings from '../components/dashboard/CompanySettings';
import CompanyOverview from '../components/dashboard/CompanyOverview';
type Role = User['role'];

interface BookingRecord {
  id: string;
  bookingCode?: string;
  vehicleId: string;
  vehicleName: string;
  companyName?: string;
  showroom: string;
  date: string;
  time: string;
  status: string;
  bookingFee?: number;
  paymentStatus?: string;
  name?: string;
  phone?: string;
}

interface FavoriteRecord {
  id: string;
  vehicleId: string;
  name: string;
  brandName: string;
  price: string;
  category: string;
  image: string;
  availableForTrial: boolean;
}

interface CompanyRecord {
  id: string;
  name: string;
  status: string;
}

interface VehicleRecord {
  id: string;
  companyId: string;
  name: string;
  availableForTrial: boolean;
}

interface AnalyticsRecord {
  totals?: {
    users?: number;
    customers?: number;
    companies?: number;
    vehicles?: number;
    trialVehicles?: number;
  };
}

const panel =
  'rounded-2xl border border-[#285673]/70 bg-[#103a58]';

const subtle =
  'text-[#a9c3d0]';

const button =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[#07549a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0875ac]';

function navigation(role: Role) {
  if (role === 'SUPER_ADMIN') {
    return [
      { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Companies', path: '/admin/companies', icon: Store },
      { label: 'Vehicles', path: '/admin/vehicles', icon: CarFront },
      { label: 'Bookings', path: '/admin/bookings', icon: ClipboardList },
      { label: 'Messages', path: '/admin/messages', icon: MessageSquare },
      { label: 'Analytics', path: '/admin/reports', icon: BarChart3 },
    ];
  }

  if (role === 'COMPANY_ADMIN') {
    return [
      { label: 'Overview', path: '/company/dashboard', icon: LayoutDashboard },
      { label: 'Vehicles', path: '/company/vehicles', icon: CarFront },
      { label: 'Showrooms', path: '/company/showrooms', icon: MapPin },
      { label: 'Trial Bookings', path: '/company/bookings', icon: ClipboardList },
      { label: 'Customers', path: '/company/customers', icon: Users },
      { label: 'Messages', path: '/company/messages', icon: MessageSquare },
      { label: 'Settings', path: '/company/settings', icon: Settings }
    ];
  }

  return [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Bookings', path: '/dashboard/bookings', icon: ClipboardList },
    { label: 'Favorites', path: '/dashboard/favourites', icon: Heart },
    { label: 'Messages', path: '/dashboard/messages', icon: MessageSquare },
    { label: 'Profile', path: '/dashboard/profile', icon: Settings }
  ];
}

function listFromResponse<T>(
  response: T[] | { bookings?: T[]; data?: T[] }
): T[] {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.bookings)) return response.bookings;
  if (Array.isArray(response.data)) return response.data;
  return [];
}

function StatusBadge({ status }: { status: string }) {
  const value = status.toLowerCase();

  const className =
    value.includes('cancel') ||
    value.includes('reject')
      ? 'border-red-400/30 bg-red-500/10 text-red-200'
      : value.includes('complet') ||
          value.includes('confirm') ||
          value.includes('approv')
        ? 'border-green-400/30 bg-green-500/10 text-green-200'
        : 'border-amber-400/30 bg-amber-500/10 text-amber-200';

  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${className}`}
    >
      {status}
    </span>
  );
}

function VehiclePhoto({
  src,
  name
}: {
  src: string;
  name: string;
}) {
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
  }, [src]);

  return (
    <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-[#09243b]">
      {!src || broken ? (
        <div className="flex flex-col items-center gap-2 text-[#8db3c5]">
          <CarFront className="h-10 w-10" />
          <span className="text-xs">Image unavailable</span>
        </div>
      ) : (
        <img
          src={assetSrc(src)}
          alt={name}
          loading="lazy"
          onError={() => setBroken(true)}
          className="h-full w-full object-contain"
        />
      )}
    </div>
  );
}

function canCompleteBooking(booking: BookingRecord): boolean {
  if (booking.status.toLowerCase() !== 'approved') {
    return false;
  }

  if (booking.paymentStatus === 'Pending') {
    return false;
  }

  const appointment = new Date(
    `${booking.date}T${booking.time}:00+05:30`
  );

  return (
    !Number.isNaN(appointment.getTime()) &&
    appointment.getTime() <= Date.now()
  );
}

function formatBookingDate(value: string): string {
  if (!value) return 'Date unavailable';

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export default function DashboardPage({
  role
}: {
  role: Role;
}) {
  const { user } = useAuth();
  const location = useLocation();

  const path = location.pathname;
  const menu = navigation(role);

  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [favorites, setFavorites] = useState<FavoriteRecord[]>([]);
  const [companies, setCompanies] = useState<CompanyRecord[]>([]);
  const [vehicles, setVehicles] = useState<VehicleRecord[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsRecord | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const isCustomer = role === 'CUSTOMER';
  const isCompany = role === 'COMPANY_ADMIN';
  const isAdmin = role === 'SUPER_ADMIN';

  const isFavoritesPage = path === '/dashboard/favourites';
  const isBookingsPage =
    path === '/dashboard/bookings' ||
    path === '/company/bookings' ||
    path === '/admin/bookings';

  const isProfilePage = path === '/dashboard/profile';

  const isShowroomsPage =
  isCompany && path === '/company/showrooms';

  const isCustomersPage =
  isCompany && path === '/company/customers';

  const isEmbeddedPage =
    (isCompany &&
      path.startsWith('/company/vehicles')) ||
    (isAdmin &&
      (path === '/admin/companies' ||
        path === '/admin/reports'));

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError('');

      try {
        if (isCustomer) {
          const [bookingResponse, favoriteResponse] =
            await Promise.all([
              apiFetch<BookingRecord[] | { bookings: BookingRecord[] }>(
                '/api/bookings/my'
              ),
              apiFetch<FavoriteRecord[]>('/api/favorites')
            ]);

          if (!active) return;

          setBookings(listFromResponse(bookingResponse));
          setFavorites(
            Array.isArray(favoriteResponse) ? favoriteResponse : []
          );
        }

        if (isCompany) {
          const [bookingResponse, vehicleResponse] =
            await Promise.all([
              apiFetch<BookingRecord[] | { bookings: BookingRecord[] }>(
                '/api/bookings/company'
              ),
              apiFetch<VehicleRecord[]>('/api/company/vehicles')
            ]);

          if (!active) return;

          setBookings(listFromResponse(bookingResponse));
          setVehicles(
            Array.isArray(vehicleResponse) ? vehicleResponse : []
          );
        }

        if (isAdmin) {
          const [
            bookingResponse,
            companyResponse,
            analyticsResponse
          ] = await Promise.all([
            apiFetch<BookingRecord[] | { bookings: BookingRecord[] }>(
              '/api/bookings/all'
            ),
            apiFetch<CompanyRecord[]>('/api/admin/companies'),
            apiFetch<AnalyticsRecord>('/api/admin/analytics')
          ]);

          if (!active) return;

          setBookings(listFromResponse(bookingResponse));
          setCompanies(
            Array.isArray(companyResponse) ? companyResponse : []
          );
          setAnalytics(analyticsResponse);
        }
      } catch (err) {
        if (!active) return;

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load dashboard data.'
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadDashboard();

    return () => {
      active = false;
    };
  }, [role, path, isCustomer, isCompany, isAdmin]);

  const activeBookings = useMemo(
    () =>
      bookings.filter(booking =>
        ['pending', 'approved'].includes(
          booking.status.toLowerCase()
        )
      ),
    [bookings]
  );

  const completedBookings = useMemo(
    () =>
      bookings.filter(
        booking =>
          booking.status.toLowerCase() === 'completed'
      ),
    [bookings]
  );

  const stats = isCustomer
    ? [
        {
          label: 'Upcoming Trials',
          value: activeBookings.length,
          icon: CalendarDays
        },
        {
          label: 'Total Bookings',
          value: bookings.length,
          icon: ClipboardList
        },
        {
          label: 'Completed Trials',
          value: completedBookings.length,
          icon: CheckCircle2
        },
        {
          label: 'Saved Vehicles',
          value: favorites.length,
          icon: Heart
        }
      ]
    : isCompany
      ? [
          {
            label: 'Company Vehicles',
            value: vehicles.length,
            icon: CarFront
          },
          {
            label: 'Trial Available',
            value: vehicles.filter(v => v.availableForTrial).length,
            icon: CheckCircle2
          },
          {
            label: 'Total Bookings',
            value: bookings.length,
            icon: ClipboardList
          },
          {
            label: 'Pending Bookings',
            value: bookings.filter(
              b => b.status.toLowerCase() === 'pending'
            ).length,
            icon: Clock3
          }
        ]
      : [
          {
            label: 'Customers',
            value: analytics?.totals?.customers ?? 0,
            icon: Users
          },
          {
            label: 'Companies',
            value: analytics?.totals?.companies ?? companies.length,
            icon: Building2
          },
          {
            label: 'Vehicles',
            value: analytics?.totals?.vehicles ?? 0,
            icon: CarFront
          },
          {
            label: 'Bookings',
            value: bookings.length,
            icon: ClipboardList
          }
        ];

  async function removeFavorite(vehicleId: string) {
    if (busyId) return;

    setBusyId(vehicleId);
    setError('');
    setNotice('');

    try {
      await apiFetch(`/api/favorites/${vehicleId}`, {
        method: 'DELETE'
      });

      setFavorites(previous =>
        previous.filter(f => f.vehicleId !== vehicleId)
      );

      setNotice('Vehicle removed from your favorites.');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to remove favorite.'
      );
    } finally {
      setBusyId(null);
    }
  }

  async function updateBooking(
    bookingId: string,
    action: 'approve' | 'reject' | 'complete' | 'cancel'
  ) {
    if (busyId) return;

    setBusyId(bookingId);
    setError('');
    setNotice('');

    try {
      if (action === 'cancel') {
        await apiFetch(`/api/bookings/${bookingId}/cancel`, {
          method: 'PATCH'
        });
      } else {
        const status =
          action === 'approve'
            ? 'Approved'
            : action === 'reject'
              ? 'Rejected'
              : 'Completed';

        await apiFetch(`/api/bookings/${bookingId}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status })
        });
      }

      setBookings(previous =>
        previous.map(booking =>
          booking.id === bookingId
            ? {
                ...booking,
                status:
                  action === 'cancel'
                    ? 'Cancelled'
                    : action === 'approve'
                      ? 'Approved'
                      : action === 'reject'
                        ? 'Rejected'
                        : 'Completed'
              }
            : booking
        )
      );

      setNotice('Booking status updated.');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update booking.'
      );
    } finally {
      setBusyId(null);
    }
  }

  function bookingList(items: BookingRecord[]) {
    if (items.length === 0) {
      return (
        <div className="p-10 text-center">
          <CalendarDays className="mx-auto h-10 w-10 text-[#67d7df]" />

          <h3 className="mt-4 font-semibold text-white">
            No bookings yet
          </h3>

          <p className="mt-2 text-sm text-[#a9c3d0]">
            Booking requests saved in MongoDB will appear here.
          </p>

          {isCustomer && (
            <Link to="/vehicles" className={`${button} mt-5`}>
              Explore Vehicles
            </Link>
          )}
        </div>
      );
    }

    return (
      <div className="divide-y divide-[#285673]/60">
        {items.map(booking => {
          const status = booking.status.toLowerCase();

          return (
            <article
              key={booking.id}
              className="flex flex-col gap-4 p-5 xl:flex-row xl:items-center xl:justify-between"
            >
              <div className="min-w-0">
                <h3 className="font-semibold text-white">
                  {booking.vehicleName}
                </h3>

                {booking.companyName && (
                  <p className="mt-1 text-xs text-[#67d7df]">
                    {booking.companyName}
                  </p>
                )}

                <p className="mt-2 text-sm text-[#a9c3d0]">
                  {booking.showroom}
                </p>

                <p className="mt-1 text-xs text-[#8db3c5]">
                  {formatBookingDate(booking.date)} at {booking.time}
                </p>

                {booking.bookingCode && (
                  <p className="mt-1 text-xs text-[#8db3c5]">
                    Booking: {booking.bookingCode}
                  </p>
                )}

                {typeof booking.bookingFee === 'number' && (
  <p className="mt-2 text-xs text-[#a9c3d0]">
    Booking Fee:{' '}
    <span className="font-semibold text-white">
      ₹{booking.bookingFee.toLocaleString('en-IN')}
    </span>
  </p>
)}

{booking.paymentStatus && (
  <p className="mt-1 text-xs text-[#a9c3d0]">
    Payment Status:{' '}
    <span className="font-semibold text-[#67d7df]">
      {booking.paymentStatus}
    </span>
  </p>
)}

{isCompany && booking.name && (
  <p className="mt-2 text-xs text-[#a9c3d0]">
    Customer: {booking.name}
  </p>
)}

{isCompany && booking.phone && (
  <p className="mt-1 text-xs text-[#a9c3d0]">
    Phone: {booking.phone}
  </p>
)}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={booking.status} />

                {isCustomer &&
  ['pending', 'approved'].includes(status) && (
                    <button
                      type="button"
                      disabled={busyId !== null}
                      onClick={() =>
                        void updateBooking(booking.id, 'cancel')
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-red-400/30 px-3 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/10 disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" />
                      Cancel
                    </button>
                  )}

                {isCompany && status === 'pending' && (
                  <>
                    <button
                      type="button"
                      disabled={busyId !== null}
                      onClick={() =>
                        void updateBooking(booking.id, 'approve')
                      }
                      className="rounded-lg bg-green-700 px-3 py-2 text-xs font-semibold text-white hover:bg-green-600 disabled:opacity-50"
                    >
                      Approve
                    </button>

                    <button
                      type="button"
                      disabled={busyId !== null}
                      onClick={() =>
                        void updateBooking(booking.id, 'reject')
                      }
                      className="rounded-lg border border-red-400/30 px-3 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/10 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </>
                )}

                {isCompany && status === 'approved' && (
  <div className="flex flex-col gap-2">
    <button
      type="button"
      disabled={
        busyId !== null ||
        !canCompleteBooking(booking)
      }
      onClick={() =>
        void updateBooking(booking.id, 'complete')
      }
      className={`${button} disabled:cursor-not-allowed disabled:opacity-50`}
    >
      Complete Trial
    </button>

    {!canCompleteBooking(booking) && (
      <p className="max-w-48 text-xs text-amber-300">
        {booking.paymentStatus === 'Pending'
          ? 'Payment is pending.'
          : 'Trial completion is available after the appointment.'}
      </p>
    )}
  </div>
)}
              </div>
            </article>
          );
        })}
      </div>
    );
  }

  const title = isCustomer
    ? 'Your Dashboard'
    : isCompany
      ? 'Company Dashboard'
      : 'Platform Dashboard';

  const contentTitle =
    isFavoritesPage
      ? 'My Favorites'
      : isBookingsPage
        ? isCustomer
          ? 'My Bookings'
          : 'Trial Bookings'
        : isProfilePage
          ? 'My Profile'
          : title;

  return (
    <div className="min-h-screen bg-[#09243b] text-white">
      <div className="mx-auto flex max-w-[1600px] flex-col lg:flex-row">

        {/* SIDEBAR */}

        <aside className="w-full shrink-0 border-b border-[#285673] bg-[#0b2d47] lg:min-h-[calc(100vh-120px)] lg:w-64 lg:border-b-0 lg:border-r">
          <div className="p-5">
            <p className="mb-5 px-3 text-xs font-bold uppercase tracking-[0.18em] text-[#8db3c5]">
              Workspace
            </p>

            <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
              {menu.map(item => {
                const Icon = item.icon;

                const active =
                  path === item.path ||
                  (item.path === '/company/vehicles' &&
                    path === '/company/vehicles/new');

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                      active
                        ? 'bg-[#07549a] text-white'
                        : 'text-[#b9d0da] hover:bg-[#174965] hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-[#285673] px-5 py-5">
            <div className="flex items-center gap-3 rounded-xl bg-[#103a58] p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#07549a] font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {user?.name}
                </p>

                <p className="truncate text-xs text-[#8db3c5]">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-9">
          <div className="mx-auto max-w-7xl">
            <header className="mb-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#67d7df]">
                Trial Your Dream Workspace
              </p>

              <h1 className="text-3xl font-bold sm:text-4xl">
                {contentTitle}
              </h1>

              <p className={`mt-3 text-sm ${subtle}`}>
                {isCustomer
                  ? `Welcome, ${user?.name || 'Customer'}. Manage your trial experience.`
                  : isCompany
                    ? 'Manage vehicles, bookings, and customer inquiries.'
                    : 'Manage companies, vehicles, and platform activity.'}
              </p>
            </header>

            {error && (
              <div
                role="alert"
                className="mb-6 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200"
              >
                {error}
              </div>
            )}

            {notice && (
              <div
                role="status"
                className="mb-6 rounded-xl border border-green-400/30 bg-green-500/10 p-4 text-sm text-green-200"
              >
                {notice}
              </div>
            )}

            {/* PRESERVED ADMIN COMPONENTS */}

            {isAdmin && path === '/admin/vehicles' ? (
              <AdminVehicles />
            ) : isEmbeddedPage ? (
              <div className="space-y-6">
                {isCompany ? (
                  <CompanyVehicles
                    key={path}
                    openNew={path.endsWith('/new')}
                  />
                ) : path === '/admin/companies' ? (
                  <AdminCompanies />
                ) : (
                  <AdminAnalytics />
                )}
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center gap-3 py-24 text-[#a9c3d0]">
                <Loader2 className="h-6 w-6 animate-spin text-[#67d7df]" />
                Loading dashboard...
              </div>
            ) : isFavoritesPage ? (

              /* CUSTOMER FAVORITES */

              favorites.length === 0 ? (
                <div className={`${panel} p-12 text-center`}>
                  <Heart className="mx-auto h-12 w-12 text-[#67d7df]" />

                  <h2 className="mt-5 text-xl font-bold">
                    No Saved Vehicles
                  </h2>

                  <p className="mt-3 text-sm text-[#a9c3d0]">
                    Open any vehicle and select Add to Favorites
                    to save it here.
                  </p>

                  <Link to="/vehicles" className={`${button} mt-6`}>
                    Explore Vehicles
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {favorites.map(favorite => (
                    <article
                      key={favorite.id}
                      className={`${panel} overflow-hidden p-4`}
                    >
                      <VehiclePhoto
                        src={favorite.image}
                        name={favorite.name}
                      />

                      <div className="px-1 pb-1 pt-5">
                        <p className="text-xs font-semibold text-[#67d7df]">
                          {favorite.brandName}
                        </p>

                        <h2 className="mt-2 text-xl font-bold">
                          {favorite.name}
                        </h2>

                        <p className="mt-3 font-semibold text-[#67d7df]">
                          {favorite.price}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2">
                          <Link
                            to={`/vehicles/${favorite.vehicleId}`}
                            state={{ from: '/dashboard/favourites' }}
                            className="rounded-lg border border-[#285673] px-3 py-2 text-xs font-semibold hover:border-[#16a7b7]"
                          >
                            View Details
                          </Link>

                          {favorite.availableForTrial && (
                            <Link
                              to={`/booking?vehicle=${encodeURIComponent(
                                favorite.vehicleId
                              )}`}
                              state={{
                                from: `/vehicles/${favorite.vehicleId}`
                              }}
                              className="rounded-lg bg-[#07549a] px-3 py-2 text-xs font-semibold hover:bg-[#0875ac]"
                            >
                              Book Trial
                            </Link>
                          )}

                          <button
                            type="button"
                            disabled={busyId !== null}
                            onClick={() =>
                              void removeFavorite(favorite.vehicleId)
                            }
                            className="inline-flex items-center gap-1 rounded-lg border border-red-400/30 px-3 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/10 disabled:opacity-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )
            ) : isBookingsPage ? (

              /* ROLE-SPECIFIC BOOKINGS */

              <section className={panel}>
                <div className="border-b border-[#285673] p-5">
                  <h2 className="text-lg font-bold">
                    Booking Requests
                  </h2>

                  <p className="mt-2 text-sm text-[#a9c3d0]">
                    {bookings.length} booking records
                  </p>
                </div>

                {bookingList(bookings)}
              </section>
              ) : isCompany && path === '/company/dashboard' ? (
  <CompanyOverview />
              ) : isShowroomsPage ? (
  <CompanyShowrooms />
  ) : isCustomersPage ? (
  <CompanyCustomers />
  ) : isCompany && path === '/company/settings' ? (
  <CompanySettings />
            ) : isProfilePage ? (

              /* CUSTOMER PROFILE */

              <section className={`${panel} max-w-2xl p-6`}>
                <h2 className="mb-6 text-xl font-bold">
                  Account Information
                </h2>

                {[
                  ['Full Name', user?.name],
                  ['Email Address', user?.email],
                  ['Phone Number', user?.phone || 'Not provided'],
                  ['Account Type', 'Customer']
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="border-b border-[#285673]/70 py-4 last:border-b-0"
                  >
                    <p className="text-xs uppercase tracking-wider text-[#8db3c5]">
                      {label}
                    </p>

                    <p className="mt-2 font-semibold">
                      {value}
                    </p>
                  </div>
                ))}
              </section>
            ) : (

              /* OVERVIEW AND OTHER ROLE PAGES */

              <>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {stats.map(stat => {
                    const Icon = stat.icon;

                    return (
                      <div key={stat.label} className={`${panel} p-5`}>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#07549a]/30">
                          <Icon className="h-5 w-5 text-[#67d7df]" />
                        </div>

                        <p className="mt-6 text-3xl font-bold">
                          {stat.value}
                        </p>

                        <p className="mt-2 text-sm text-[#a9c3d0]">
                          {stat.label}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-7 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
                  <section className={panel}>
                    <div className="flex items-center justify-between gap-3 border-b border-[#285673] p-5">
                      <div>
                        <h2 className="text-lg font-bold">
                          {isCustomer
                            ? 'Your Recent Bookings'
                            : isCompany
                              ? 'Recent Trial Requests'
                              : 'Recent Platform Bookings'}
                        </h2>

                        <p className="mt-1 text-xs text-[#8db3c5]">
                          Records from MongoDB
                        </p>
                      </div>

                      <Link
                        to={
                          isCustomer
                            ? '/dashboard/bookings'
                            : isCompany
                              ? '/company/bookings'
                              : '/admin/bookings'
                        }
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#67d7df] hover:text-white"
                      >
                        View All
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>

                    {bookingList(bookings.slice(0, 4))}
                  </section>

                  <section className={`${panel} p-6`}>
                    <ShieldCheck className="h-8 w-8 text-[#67d7df]" />

                    <h2 className="mt-4 text-xl font-bold">
                      Manage Your Experience
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-[#a9c3d0]">
                      {isCustomer
                        ? 'Track bookings, save vehicles, and read company replies in your dashboard.'
                        : isCompany
                          ? 'Review bookings, manage listed vehicles, and respond to customer messages.'
                          : 'Monitor platform records, companies, and customer inquiries.'}
                    </p>

                    <Link
                      to={
                        isCustomer
                          ? '/dashboard/messages'
                          : isCompany
                            ? '/company/messages'
                            : '/admin/messages'
                      }
                      className={`${button} mt-6`}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Open Messages
                    </Link>
                  </section>
                </div>

                <section className={`${panel} mt-7 p-6`}>
                  <h2 className="text-lg font-bold">
                    Quick Actions
                  </h2>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {(
                      isCustomer
                        ? [
                            {
                              label: 'Explore Vehicles',
                              path: '/vehicles',
                              icon: CarFront
                            },
                            {
                              label: 'My Favorites',
                              path: '/dashboard/favourites',
                              icon: Heart
                            },
                            {
                              label: 'My Messages',
                              path: '/dashboard/messages',
                              icon: MessageSquare
                            }
                          ]
                        : isCompany
                          ? [
                              {
                                label: 'Manage Vehicles',
                                path: '/company/vehicles',
                                icon: CarFront
                              },
                              {
                                label: 'Trial Bookings',
                                path: '/company/bookings',
                                icon: CalendarDays
                              },
                              {
                                label: 'Customer Messages',
                                path: '/company/messages',
                                icon: MessageSquare
                              }
                            ]
                          : [
                              {
                                label: 'Manage Companies',
                                path: '/admin/companies',
                                icon: Store
                              },
                              {
                                label: 'Bookings',
                                path: '/admin/bookings',
                                icon: ClipboardList
                              },
                              {
                                label: 'Platform Messages',
                                path: '/admin/messages',
                                icon: MessageSquare
                              }
                            ]
                    ).map(action => {
                      const Icon = action.icon;

                      return (
                        <Link
                          key={action.path}
                          to={action.path}
                          className="flex items-center justify-between gap-3 rounded-xl border border-[#285673] bg-[#09243b] p-4 text-sm font-semibold transition hover:border-[#16a7b7] hover:bg-[#174965]"
                        >
                          <span className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-[#67d7df]" />
                            {action.label}
                          </span>

                          <ArrowRight className="h-4 w-4 text-[#8db3c5]" />
                        </Link>
                      );
                    })}
                  </div>
                </section>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
