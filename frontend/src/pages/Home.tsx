
import { useEffect, useMemo, useState } from 'react';
import {
  CarFront,
  Bike,
  Building2,
  CalendarDays,
  Clock3,
  MapPin,
  ShieldCheck,
  Search,
  AlertCircle,
  Loader2
} from 'lucide-react';

import { apiFetch, assetSrc } from '../lib/api';

interface HomeVehicle {
  id: string;
  companyId: string;
  name: string;
  category: 'car' | 'bike';
  type: string;
  price: string;
  image: string;
  brandId: string;
  brandName: string;
  logo: string;
  availableForTrial: boolean;
}

interface HomeBrand {
  id: string;
  name: string;
  logo: string;
  vehicleCount: number;
}

const container =
  'mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8 xl:px-12';

const sectionTitle =
  'text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl font-[Exo_2]';

function getImage(path: string | undefined) {
  if (!path) return '/images/hero-bg.jpg';
  return assetSrc(path);
}

export default function Home() {
  const [vehicles, setVehicles] = useState<HomeVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadCatalog() {
      try {
        const result = await apiFetch<HomeVehicle[]>('/api/vehicles');

        if (!active) return;

        setVehicles(result);
        setError('');
      } catch (err) {
        if (!active) return;

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load vehicle catalog.'
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadCatalog();

    return () => {
      active = false;
    };
  }, []);

  const brands = useMemo<HomeBrand[]>(() => {
    const results = new Map<string, HomeBrand>();

    vehicles.forEach(vehicle => {
      const existing = results.get(vehicle.brandId);

      if (existing) {
        existing.vehicleCount += 1;
      } else {
        results.set(vehicle.brandId, {
          id: vehicle.brandId,
          name: vehicle.brandName,
          logo: vehicle.logo,
          vehicleCount: 1
        });
      }
    });

    return Array.from(results.values()).sort(
      (a, b) => a.name.localeCompare(b.name)
    );
  }, [vehicles]);

  const carCount = vehicles.filter(
    vehicle => vehicle.category === 'car'
  ).length;

  const bikeCount = vehicles.filter(
    vehicle => vehicle.category === 'bike'
  ).length;

  const steps = [
    {
      number: '01',
      title: 'Explore Vehicles',
      description:
        'Browse brands and compare cars or motorcycles without creating an account.',
      icon: Search
    },
    {
      number: '02',
      title: 'Choose a Trial Slot',
      description:
        'Open your preferred vehicle, select a showroom, and choose an available date and time.',
      icon: CalendarDays
    },
    {
      number: '03',
      title: 'Manage Your Booking',
      description:
        'Sign in to submit your request, then follow its status from your personal dashboard.',
      icon: ShieldCheck
    }
  ];

  return (
    <div className="min-h-screen bg-[#09243b] text-white">

      {/* HERO */}

      <section className="relative flex min-h-[650px] items-center overflow-hidden py-24">
        <div className="absolute inset-0">
          <img
            src="/images/hero-bg.jpg"
            alt=""
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#09243b]/95 via-[#09243b]/85 to-[#09243b]/55" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#09243b] via-transparent to-[#09243b]/40" />
        </div>

        <div className={`relative z-10 ${container}`}>
          <div className="max-w-3xl">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#16a7b7]/40 bg-[#16a7b7]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#67d7df]">
              <CarFront className="h-4 w-4" />
              Smart Multi-Platform Trial Booking
            </span>

            <h1 className="font-[Exo_2] text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-7xl">
              Your Dream Ride
              <span className="mt-2 block bg-gradient-to-r from-[#67d7df] to-[#16a7b7] bg-clip-text text-transparent">
                Starts Here.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-[#d6e4ea] sm:text-lg">
              Discover cars and motorcycles, explore their features,
              compare different brands, and request a test drive or
              test ride through one convenient platform.
            </p>
          </div>
        </div>
      </section>

      {/* REAL CATALOG COUNTS */}

      <section className="border-y border-[#285673]/50 bg-[#0b2d47] py-12">
        <div className={container}>
          <div className="mb-7 text-center">
            <h2 className="text-xl font-bold text-white">
              Explore Our Vehicle Collection
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 py-8 text-[#a9c3d0]">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading catalog information...
            </div>
          ) : error ? (
            <p className="text-center text-sm text-amber-300">
              Catalog statistics are temporarily unavailable.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                { label: 'Brands', value: brands.length, icon: Building2 },
                { label: 'Vehicles', value: vehicles.length, icon: CarFront },
                { label: 'Cars', value: carCount, icon: CarFront },
                { label: 'Motorcycles', value: bikeCount, icon: Bike }
              ].map(item => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-[#285673]/60 bg-[#103a58] p-5 text-center sm:p-7"
                  >
                    <Icon className="mx-auto mb-4 h-8 w-8 text-[#67d7df]" />

                    <p className="text-3xl font-bold text-white sm:text-4xl">
                      {item.value}
                    </p>

                    <p className="mt-2 text-sm text-[#a9c3d0]">
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ALL BRAND CARDS — NO LINKS */}

      <section className="bg-[#09243b] py-20">
        <div className={container}>
          <div className="mb-10 text-center">
            <span className="mb-4 inline-block rounded-full bg-[#16a7b7]/10 px-4 py-2 text-sm font-semibold text-[#67d7df]">
              Our Brands
            </span>

            <h2 className={sectionTitle}>
              Explore Leading Manufacturers
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-14">
              <Loader2 className="h-8 w-8 animate-spin text-[#67d7df]" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 p-5 text-amber-200">
              <AlertCircle className="h-5 w-5" />
              Unable to load brands.
            </div>
          ) : brands.length === 0 ? (
            <div className="rounded-xl border border-[#285673] bg-[#103a58] p-10 text-center text-[#a9c3d0]">
              No brands are currently available.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {brands.map(brand => (
                <article
                  key={brand.id}
                  className="rounded-2xl border border-[#285673]/60 bg-[#103a58] p-5 text-center"
                >
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 p-3">
                    {brand.logo ? (
                      <img
                        src={getImage(brand.logo)}
                        alt={brand.name}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <Building2 className="h-9 w-9 text-[#67d7df]" />
                    )}
                  </div>

                  <h3 className="font-semibold text-white">
                    {brand.name}
                  </h3>

                  <p className="mt-2 text-xs text-[#a9c3d0]">
                    {brand.vehicleCount}{' '}
                    {brand.vehicleCount === 1 ? 'vehicle' : 'vehicles'}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}

      <section className="bg-[#09243b] py-20">
        <div className={container}>
          <div className="mb-14 text-center">
            <span className="mb-4 inline-block rounded-full bg-[#16a7b7]/10 px-4 py-2 text-sm font-semibold text-[#67d7df]">
              How It Works
            </span>

            <h2 className={sectionTitle}>
              Your Trial in 3 Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map(step => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="relative rounded-2xl border border-[#285673]/60 bg-[#103a58] p-8"
                >
                  <span className="absolute right-7 top-6 text-4xl font-bold text-[#285673]">
                    {step.number}
                  </span>

                  <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#07549a]/30">
                    <Icon className="h-7 w-7 text-[#67d7df]" />
                  </div>

                  <h3 className="mb-4 text-xl font-bold text-white">
                    {step.title}
                  </h3>

                  <p className="leading-7 text-[#a9c3d0]">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* PLATFORM BENEFITS */}

      <section className="border-t border-[#285673]/50 bg-[#0b2d47] py-16">
        <div className={container}>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: Search,
                title: 'Easy Vehicle Discovery',
                description:
                  'Search and explore vehicles from multiple brands in one place.'
              },
              {
                icon: CalendarDays,
                title: 'Convenient Trial Requests',
                description:
                  'Choose an available date and time before submitting your request.'
              },
              {
                icon: Clock3,
                title: 'Track Your Bookings',
                description:
                  'View your requests and their status from your customer dashboard.'
              }
            ].map(item => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#103a58]">
                    <Icon className="h-7 w-7 text-[#67d7df]" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#a9c3d0]">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL INFORMATION SECTION */}

      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0">
          <img
            src="/images/cta-bg.jpg"
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-[#09243b]/90" />
        </div>

        <div className={`relative z-10 ${container}`}>
          <div className="mx-auto max-w-3xl text-center">
            <MapPin className="mx-auto mb-6 h-9 w-9 text-[#67d7df]" />

            <h2 className={sectionTitle}>
              Find the Right Vehicle.
              <span className="mt-2 block text-[#67d7df]">
                Experience It Before You Decide.
              </span>
            </h2>
          </div>
        </div>
      </section>
    </div>
  );
}
