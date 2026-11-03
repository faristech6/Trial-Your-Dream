
import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  CarFront,
  Loader2,
  Mail,
  Phone,
  Search,
  Users
} from 'lucide-react';

import { apiFetch } from '../../lib/api';

interface Booking {
  id: string;
  userId: string;
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleName: string;
  showroom: string;
  date: string;
  time: string;
  status: string;
  createdAt: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  bookings: Booking[];
  latestBooking: Booking;
}

const panel =
  'rounded-2xl border border-[#285673]/70 bg-[#103a58]';

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export default function CompanyCustomers() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadCustomers() {
      try {
        const result = await apiFetch<Booking[]>(
          '/api/bookings/company'
        );

        if (!active) return;

        setBookings(Array.isArray(result) ? result : []);
        setError('');
      } catch (reason) {
        if (!active) return;

        setError(
          reason instanceof Error
            ? reason.message
            : 'Unable to load customer records.'
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadCustomers();

    return () => {
      active = false;
    };
  }, []);

  const customers = useMemo<Customer[]>(() => {
    const result = new Map<string, Customer>();

    const sorted = [...bookings].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );

    for (const booking of sorted) {
      const key =
        booking.userId ||
        booking.customerEmail.toLowerCase();

      const existing = result.get(key);

      if (existing) {
        existing.bookings.push(booking);
      } else {
        result.set(key, {
          id: key,
          name: booking.customerName,
          email: booking.customerEmail,
          phone: booking.customerPhone,
          bookings: [booking],
          latestBooking: booking
        });
      }
    }

    return Array.from(result.values());
  }, [bookings]);

  const filteredCustomers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return customers.filter(customer =>
      [
        customer.name,
        customer.email,
        customer.phone
      ]
        .join(' ')
        .toLowerCase()
        .includes(keyword)
    );
  }, [customers, search]);

  return (
    <div className="space-y-6 text-white">
      <section className={`${panel} p-6`}>
        <div className="flex items-center gap-3">
          <Users className="h-7 w-7 text-[#67d7df]" />

          <div>
            <h2 className="text-2xl font-bold">
              Company Customers
            </h2>

            <p className="mt-2 text-sm text-[#a9c3d0]">
              Customers who have booked trials with your company.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[#285673] bg-[#09243b] p-5">
            <p className="text-sm text-[#a9c3d0]">
              Total Customers
            </p>

            <p className="mt-2 text-3xl font-bold">
              {customers.length}
            </p>
          </div>

          <div className="rounded-xl border border-[#285673] bg-[#09243b] p-5">
            <p className="text-sm text-[#a9c3d0]">
              Total Trial Bookings
            </p>

            <p className="mt-2 text-3xl font-bold">
              {bookings.length}
            </p>
          </div>
        </div>
      </section>

      <div className={`${panel} p-5`}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8db3c5]" />

          <input
            type="search"
            value={search}
            onChange={event =>
              setSearch(event.target.value)
            }
            placeholder="Search customer name, email or phone..."
            aria-label="Search company customers"
            className="w-full rounded-xl border border-[#285673] bg-[#09243b] py-3 pl-12 pr-4 text-white outline-none focus:border-[#16a7b7]"
          />
        </div>
      </div>

      {loading ? (
        <div className={`${panel} flex items-center justify-center gap-3 p-16`}>
          <Loader2 className="h-6 w-6 animate-spin text-[#67d7df]" />
          Loading customers...
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-400/30 bg-red-500/10 p-5 text-red-200"
        >
          {error}
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className={`${panel} p-12 text-center`}>
          <Users className="mx-auto h-12 w-12 text-[#67d7df]" />

          <h3 className="mt-4 text-xl font-bold">
            No Customers Found
          </h3>

          <p className="mt-3 text-sm text-[#a9c3d0]">
            {customers.length === 0
              ? 'Customers will appear here after they submit trial bookings.'
              : 'No customers match your search.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {filteredCustomers.map(customer => (
            <article
              key={customer.id}
              className={`${panel} p-6`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#07549a] text-lg font-bold">
                  {customer.name.charAt(0).toUpperCase() || 'C'}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-lg font-bold">
                    {customer.name}
                  </h3>

                  <p className="mt-1 text-xs text-[#8db3c5]">
                    {customer.bookings.length}{' '}
                    {customer.bookings.length === 1
                      ? 'booking'
                      : 'bookings'}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-[#c8dce6]">
                {customer.email && (
                  <p className="flex items-center gap-3 break-all">
                    <Mail className="h-4 w-4 shrink-0 text-[#67d7df]" />
                    {customer.email}
                  </p>
                )}

                {customer.phone && (
                  <p className="flex items-center gap-3">
                    <Phone className="h-4 w-4 shrink-0 text-[#67d7df]" />
                    {customer.phone}
                  </p>
                )}
              </div>

              <div className="mt-6 rounded-xl border border-[#285673] bg-[#09243b] p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8db3c5]">
                  Latest Booking
                </p>

                <p className="mt-3 flex items-center gap-2 font-semibold">
                  <CarFront className="h-4 w-4 text-[#67d7df]" />
                  {customer.latestBooking.vehicleName}
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm text-[#a9c3d0]">
                  <CalendarDays className="h-4 w-4 text-[#67d7df]" />
                  {formatDate(customer.latestBooking.date)}
                  {' · '}
                  {customer.latestBooking.time}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-xs text-[#8db3c5]">
                    {customer.latestBooking.bookingCode}
                  </span>

                  <span className="rounded-full border border-[#285673] bg-[#103a58] px-3 py-1 text-xs font-semibold text-[#67d7df]">
                    {customer.latestBooking.status}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
