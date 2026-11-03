
import { useEffect, useState } from 'react';
import {
  Activity,
  BarChart3,
  Building2,
  CarFront,
  CheckCircle2,
  Loader2,
  TrendingUp,
  UserPlus,
  Users
} from 'lucide-react';

import { apiFetch } from '../../lib/api';

interface Analytics {
  totals: {
    users: number;
    customers: number;
    companyAdmins: number;
    newCustomers7d: number;
    companies: number;
    activeCompanies: number;
    vehicles: number;
    trialVehicles: number;
  };
  signupsByDay: {
    date: string;
    count: number;
  }[];
  vehiclesByCompany: {
    name: string;
    count: number;
  }[];
  recentUsers: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }[];
}

const roleLabel: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  COMPANY_ADMIN: 'Company Admin',
  CUSTOMER: 'Customer'
};

const panel =
  'rounded-2xl border border-[#285673]/70 bg-[#103a58] text-white';

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

export default function AdminAnalytics() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadAnalytics() {
      try {
        const result = await apiFetch<Analytics>(
          '/api/admin/analytics'
        );

        if (!active) return;

        setData(result);
        setError('');
      } catch (reason) {
        if (!active) return;

        setError(
          reason instanceof Error
            ? reason.message
            : 'Unable to load analytics.'
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadAnalytics();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 rounded-2xl border border-[#285673] bg-[#103a58] p-16 text-[#a9c3d0]">
        <Loader2 className="h-6 w-6 animate-spin text-[#67d7df]" />
        Loading platform analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-red-400/30 bg-red-500/10 px-6 py-5 text-sm text-red-200"
      >
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`${panel} p-10 text-center text-[#a9c3d0]`}>
        Analytics are currently unavailable.
      </div>
    );
  }

  const { totals } = data;

  const cards = [
    {
      label: 'Total Users',
      value: totals.users,
      icon: Users
    },
    {
      label: 'Customers',
      value: totals.customers,
      icon: Users
    },
    {
      label: 'New Customers (7 Days)',
      value: totals.newCustomers7d,
      icon: UserPlus
    },
    {
      label: 'Company Admins',
      value: totals.companyAdmins,
      icon: Building2
    },
    {
      label: 'Total Brands',
      value: totals.companies,
      icon: Building2
    },
    {
      label: 'Active Brands',
      value: totals.activeCompanies,
      icon: CheckCircle2
    },
    {
      label: 'Total Vehicles',
      value: totals.vehicles,
      icon: CarFront
    },
    {
      label: 'Available for Trial',
      value: totals.trialVehicles,
      icon: Activity
    }
  ];

  const signupDays = data.signupsByDay;

  const peak = Math.max(
    1,
    ...signupDays.map(day => day.count)
  );

  const maxVehicles = Math.max(
    1,
    ...data.vehiclesByCompany.map(item => item.count)
  );

  const totalSignups30Days = signupDays.reduce(
    (sum, day) => sum + day.count,
    0
  );

  return (
    <div className="space-y-8 text-white">

      {/* ANALYTICS HEADER */}

      <div className={`${panel} p-6 sm:p-8`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#67d7df]">
              <BarChart3 className="h-5 w-5" />
              Platform Overview
            </div>

            <h2 className="text-2xl font-bold sm:text-3xl">
              Platform Analytics
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#a9c3d0]">
              Monitor registered users, brands, vehicles, and
              customer activity using records stored in MongoDB.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[#285673] bg-[#09243b] px-5 py-4">
            <TrendingUp className="h-7 w-7 text-[#67d7df]" />

            <div>
              <p className="text-2xl font-bold">
                {totalSignups30Days}
              </p>

              <p className="text-xs text-[#a9c3d0]">
                Customer Sign-ups (30 Days)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* STATISTICS CARDS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(card => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className={`${panel} p-6 transition hover:border-[#16a7b7]/60`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#07549a]/30">
                <Icon className="h-6 w-6 text-[#67d7df]" />
              </div>

              <p className="mt-6 text-3xl font-bold text-white">
                {card.value.toLocaleString('en-IN')}
              </p>

              <p className="mt-2 text-sm text-[#a9c3d0]">
                {card.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* CUSTOMER SIGN-UP CHART */}

      <section className={`${panel} p-6`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">
              Customer Sign-ups
            </h2>

            <p className="mt-2 text-sm text-[#a9c3d0]">
              New customer accounts registered over the last 30 days.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-[#09243b] px-4 py-2 text-sm text-[#67d7df]">
            <BarChart3 className="h-4 w-4" />
            Last 30 Days
          </div>
        </div>

        {signupDays.length === 0 ? (
          <div className="mt-8 rounded-xl border border-[#285673] bg-[#09243b] p-10 text-center text-[#a9c3d0]">
            No sign-up history is available.
          </div>
        ) : (
          <>
            <div
              className="mt-8 flex h-52 items-end gap-1 rounded-xl border border-[#285673]/60 bg-[#09243b] px-4 pt-6"
              role="img"
              aria-label="Daily customer sign-ups for the last 30 days"
            >
              {signupDays.map(day => (
                <div
                  key={day.date}
                  title={`${day.date}: ${day.count} customer sign-ups`}
                  className="group relative flex h-full flex-1 items-end"
                >
                  <div
                    className={`w-full rounded-t-md transition ${
                      day.count > 0
                        ? 'bg-[#16a7b7] hover:bg-[#67d7df]'
                        : 'bg-[#285673]'
                    }`}
                    style={{
                      height: `${
                        day.count > 0
                          ? Math.max(
                              6,
                              (day.count / peak) * 100
                            )
                          : 2
                      }%`
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap justify-between gap-3 text-xs text-[#8db3c5]">
              <span>
                {formatDate(signupDays[0].date)}
              </span>

              <span>
                Peak: {peak} sign-ups/day
              </span>

              <span>
                {formatDate(signupDays[signupDays.length - 1].date)}
              </span>
            </div>
          </>
        )}
      </section>

      {/* VEHICLES PER BRAND AND RECENT USERS */}

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">

        {/* VEHICLES BY BRAND */}

        <section className={`${panel} p-6`}>
          <div className="mb-6">
            <h2 className="text-xl font-bold">
              Vehicles per Brand
            </h2>

            <p className="mt-2 text-sm text-[#a9c3d0]">
              Number of vehicles registered under each manufacturer.
            </p>
          </div>

          {data.vehiclesByCompany.length === 0 ? (
            <p className="rounded-xl bg-[#09243b] p-6 text-center text-sm text-[#a9c3d0]">
              No brand vehicle statistics available.
            </p>
          ) : (
            <div className="max-h-[570px] space-y-5 overflow-y-auto pr-2">
              {data.vehiclesByCompany.map(item => (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-semibold text-[#d6e4ea]">
                      {item.name}
                    </span>

                    <span className="shrink-0 rounded-md bg-[#07549a]/20 px-2 py-1 text-xs font-bold text-[#67d7df]">
                      {item.count}
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-[#09243b]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#07549a] to-[#16a7b7]"
                      style={{
                        width: `${Math.max(
                          0,
                          (item.count / maxVehicles) * 100
                        )}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* NEWEST USERS */}

        <section className={`${panel} overflow-hidden`}>
          <div className="border-b border-[#285673] p-6">
            <h2 className="text-xl font-bold">
              Newest Users
            </h2>

            <p className="mt-2 text-sm text-[#a9c3d0]">
              Recently registered accounts on the platform.
            </p>
          </div>

          {data.recentUsers.length === 0 ? (
            <div className="p-10 text-center text-sm text-[#a9c3d0]">
              No user records available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="border-b border-[#285673] bg-[#09243b] text-xs uppercase tracking-wider text-[#8db3c5]">
                  <tr>
                    <th className="px-5 py-4 font-semibold">
                      Name
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Email
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Role
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Joined
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#285673]/60">
                  {data.recentUsers.map(person => (
                    <tr
                      key={person.id}
                      className="transition hover:bg-[#174965]/40"
                    >
                      <td className="px-5 py-4 font-semibold text-white">
                        {person.name}
                      </td>

                      <td className="break-all px-5 py-4 text-[#b9d0da]">
                        {person.email}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                            person.role === 'SUPER_ADMIN'
                              ? 'border-purple-400/30 bg-purple-500/10 text-purple-200'
                              : person.role === 'COMPANY_ADMIN'
                                ? 'border-cyan-400/30 bg-cyan-500/10 text-cyan-200'
                                : 'border-green-400/30 bg-green-500/10 text-green-200'
                          }`}
                        >
                          {roleLabel[person.role] ?? person.role}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-[#8db3c5]">
                        {formatDate(person.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
