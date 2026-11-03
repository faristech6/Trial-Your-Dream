
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  CarFront,
  CheckCircle2,
  Clock3,
  Building2,
  Users,
  ArrowRight,
  Loader2,
  AlertCircle,
  MessageSquare
} from 'lucide-react';

import { apiFetch } from '../../lib/api';
import { getDatabaseVehicles } from '../../services/bookingApi';
import { useAuth } from '../../context/AuthContext';

interface Booking {
  id: string;
  userId: string;
  bookingCode: string;
  companyId: string;
  customerName: string;
  vehicleName: string;
  showroom: string;
  date: string;
  time: string;
  status: string;
  createdAt: string;
}

interface Showroom {
  id: string;
  companyId: string;
  active: boolean;
}

interface Vehicle {
  id: string;
  companyId: string;
}

interface Message {
  id: string;
  status?: string;
}

interface Stat {
  title: string;
  value: number;
  icon: typeof CalendarDays;
  link: string;
}

const panel =
  'rounded-2xl border border-[#285673]/70 bg-[#103a58]';

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata'
  });
}

function statusClass(status: string) {
  switch (status) {
    case 'Approved':
      return 'border-blue-400/40 bg-blue-500/10 text-blue-200';
    case 'Completed':
      return 'border-green-400/40 bg-green-500/10 text-green-200';
    case 'Rejected':
    case 'Cancelled':
      return 'border-red-400/40 bg-red-500/10 text-red-200';
    default:
      return 'border-amber-400/40 bg-amber-500/10 text-amber-200';
  }
}

export default function CompanyOverview() {
  const { user } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showrooms, setShowrooms] = useState<Showroom[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const [loading, setLoading] = useState(true);
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);

      const results = await Promise.allSettled([
        apiFetch<Booking[]>('/api/bookings/company'),
        apiFetch<Showroom[]>('/api/showrooms/company'),
        getDatabaseVehicles(),
        apiFetch<Message[]>('/api/messages/company')
      ]);

      if (!active) return;

      const issues: string[] = [];

      const [bookingResult, showroomResult, vehicleResult, messageResult] =
        results;

      if (bookingResult.status === 'fulfilled') {
        setBookings(
          Array.isArray(bookingResult.value)
            ? bookingResult.value
            : []
        );
      } else {
        issues.push('Booking statistics could not be loaded.');
      }

      if (showroomResult.status === 'fulfilled') {
        setShowrooms(
          Array.isArray(showroomResult.value)
            ? showroomResult.value
            : []
        );
      } else {
        issues.push('Showroom statistics could not be loaded.');
      }

      if (vehicleResult.status === 'fulfilled') {
        setVehicles(
          Array.isArray(vehicleResult.value)
            ? vehicleResult.value
            : []
        );
      } else {
        issues.push('Vehicle statistics could not be loaded.');
      }

      if (messageResult.status === 'fulfilled') {
        setMessages(
          Array.isArray(messageResult.value)
            ? messageResult.value
            : []
        );
      } else {
        issues.push('Message statistics could not be loaded.');
      }

      setWarnings(issues);
      setLoading(false);
    }

    void loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const companyId = useMemo(() => {
    const account = user as (
      { companyId?: string | null } | null
    );

    if (account?.companyId) {
      return String(account.companyId);
    }

    return (
      bookings[0]?.companyId ||
      showrooms[0]?.companyId ||
      ''
    );
  }, [user, bookings, showrooms]);

  const companyVehicles = useMemo(
    () =>
      companyId
        ? vehicles.filter(
            vehicle => vehicle.companyId === companyId
          )
        : [],
    [vehicles, companyId]
  );

  const uniqueCustomers = useMemo(
    () =>
      new Set(
        bookings.map(
          booking => booking.userId
        ).filter(Boolean)
      ).size,
    [bookings]
  );

  const recentBookings = useMemo(
    () =>
      [...bookings]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
        .slice(0, 6),
    [bookings]
  );

  const stats: Stat[] = [
    {
      title: 'My Vehicles',
      value: companyVehicles.length,
      icon: CarFront,
      link: '/company/vehicles'
    },
    {
      title: 'Trial Bookings',
      value: bookings.length,
      icon: CalendarDays,
      link: '/company/bookings'
    },
    {
      title: 'Customers',
      value: uniqueCustomers,
      icon: Users,
      link: '/company/customers'
    },
    {
      title: 'Pending Bookings',
      value: bookings.filter(
        booking => booking.status === 'Pending'
      ).length,
      icon: Clock3,
      link: '/company/bookings'
    },
    {
      title: 'Active Showrooms',
      value: showrooms.filter(
        showroom => showroom.active
      ).length,
      icon: Building2,
      link: '/company/showrooms'
    },
    {
      title: 'Messages',
      value: messages.length,
      icon: MessageSquare,
      link: '/company/messages'
    }
  ];

  if (loading) {
    return (
      <div
        className={`${panel} flex items-center justify-center gap-3 p-16 text-[#a9c3d0]`}
      >
        <Loader2 className="h-6 w-6 animate-spin text-[#67d7df]" />
        Loading company dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-7 text-white">
      <section className={`${panel} p-6`}>
        <p className="text-sm font-semibold text-[#67d7df]">
          Company Dashboard
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          Company Overview
        </h2>

        <p className="mt-3 text-sm text-[#a9c3d0]">
          Your company activity, vehicles, bookings
          and showrooms from MongoDB.
        </p>
      </section>

      <section className={`${panel} p-6`}>
        <h3 className="text-xl font-bold">Quick Access</h3>
        <p className="mt-2 text-sm text-[#a9c3d0]">
          Open the company tools you use most often.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Manage Vehicles', to: '/company/vehicles', icon: CarFront },
            { label: 'Trial Bookings', to: '/company/bookings', icon: CalendarDays },
            { label: 'Showrooms', to: '/company/showrooms', icon: Building2 },
            { label: 'Customer Messages', to: '/company/messages', icon: MessageSquare }
          ].map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 rounded-xl border border-[#285673] bg-[#09243b] p-4 text-sm font-semibold text-white transition hover:border-[#16a7b7]"
              >
                <Icon className="h-5 w-5 shrink-0 text-[#67d7df]" />
                <span className="flex-1">{item.label}</span>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#8db3c5]" />
              </Link>
            );
          })}
        </div>
      </section>

      {warnings.length > 0 && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-amber-400/30 bg-amber-500/10 p-5 text-sm text-amber-200"
        >
          <AlertCircle className="h-5 w-5 shrink-0" />

          <div>
            {warnings.map(message => (
              <p key={message}>{message}</p>
            ))}
          </div>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map(stat => {
          const Icon = stat.icon;

          return (
            <Link
              key={stat.title}
              to={stat.link}
              className={`${panel} block p-5 transition hover:border-[#16a7b7]`}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-xl bg-[#07549a]/30 p-3">
                  <Icon className="h-6 w-6 text-[#67d7df]" />
                </span>

                <ArrowRight className="h-5 w-5 text-[#8db3c5]" />
              </div>

              <p className="mt-5 text-sm text-[#a9c3d0]">
                {stat.title}
              </p>

              <p className="mt-2 text-3xl font-bold">
                {stat.value}
              </p>
            </Link>
          );
        })}
      </section>

      <section className={`${panel} p-6`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">
              Recent Trial Bookings
            </h3>

            <p className="mt-2 text-sm text-[#a9c3d0]">
              Latest customer booking requests.
            </p>
          </div>

          <Link
            to="/company/bookings"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#67d7df] hover:text-white"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="mt-6 rounded-xl border border-[#285673] bg-[#09243b] p-10 text-center">
            <CalendarDays className="mx-auto h-10 w-10 text-[#67d7df]" />

            <p className="mt-4 text-[#a9c3d0]">
              No customer trial bookings yet.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {recentBookings.map(booking => (
              <div
                key={booking.id}
                className="rounded-xl border border-[#285673] bg-[#09243b] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {booking.vehicleName}
                    </p>

                    <p className="mt-1 text-sm text-[#a9c3d0]">
                      {booking.customerName}
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#a9c3d0]">
                  <span className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-[#67d7df]" />
                    {formatDate(booking.date)}
                  </span>

                  <span className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-[#67d7df]" />
                    {booking.time}
                  </span>

                  <span className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#67d7df]" />
                    {booking.showroom}
                  </span>
                </div>

                <p className="mt-3 text-xs text-[#8db3c5]">
                  {booking.bookingCode}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={`${panel} p-6`}>
        <h3 className="text-xl font-bold">
          Booking Progress
        </h3>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#285673] bg-[#09243b] p-5">
            <Clock3 className="h-6 w-6 text-amber-300" />

            <p className="mt-3 text-sm text-[#a9c3d0]">
              Pending
            </p>

            <p className="mt-2 text-2xl font-bold">
              {bookings.filter(
                booking => booking.status === 'Pending'
              ).length}
            </p>
          </div>

          <div className="rounded-xl border border-[#285673] bg-[#09243b] p-5">
            <CalendarDays className="h-6 w-6 text-blue-300" />

            <p className="mt-3 text-sm text-[#a9c3d0]">
              Approved
            </p>

            <p className="mt-2 text-2xl font-bold">
              {bookings.filter(
                booking => booking.status === 'Approved'
              ).length}
            </p>
          </div>

          <div className="rounded-xl border border-[#285673] bg-[#09243b] p-5">
            <CheckCircle2 className="h-6 w-6 text-green-300" />

            <p className="mt-3 text-sm text-[#a9c3d0]">
              Completed
            </p>

            <p className="mt-2 text-2xl font-bold">
              {bookings.filter(
                booking => booking.status === 'Completed'
              ).length}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
