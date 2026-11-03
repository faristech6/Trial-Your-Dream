
import { useEffect, useMemo, useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Bike,
  Building2,
  CarFront,
  CalendarDays,
  CheckCircle2,
  Heart,
  Loader2,
  Search,
  ShieldCheck,
  SlidersHorizontal
} from 'lucide-react';

import { apiFetch, assetSrc } from '../lib/api';
import VehicleImage from '../components/VehicleImage';

interface ImageAttribution {
  title?: string;
  credit?: string;
  license?: string;
  licenseUrl?: string;
  sourceUrl?: string;
}

interface Vehicle {
  id: string;
  companyId: string;
  name: string;
  brandId: string;
  brandName: string;
  logo?: string;
  category: 'car' | 'bike';
  type: string;
  price: string;
  image: string;
  imageAttribution?: ImageAttribution;
  description?: string;
  engine?: string;
  mileage?: string;
  fuelType?: string;
  transmission?: string;
  seatingCapacity?: number;
  availableForTrial: boolean;
}

interface Company {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  status?: string;
}

interface FavoriteStatus {
  isFavorite?: boolean;
  favorite?: boolean;
}

const shell =
  'mx-auto w-full max-w-[1450px] px-4 sm:px-6 lg:px-10';

const panel =
  'rounded-2xl border border-[#285673]/70 bg-[#103a58]';

const primaryButton =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[#07549a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0875ac]';

const outlineButton =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-[#285673] bg-[#103a58] px-5 py-3 text-sm font-semibold text-white transition hover:border-[#16a7b7] hover:bg-[#174965]';

function getBackPath(
  locationState: unknown,
  fallback: string
): string {
  if (
    typeof locationState === 'object' &&
    locationState !== null &&
    'from' in locationState &&
    typeof locationState.from === 'string' &&
    locationState.from.startsWith('/') &&
    !locationState.from.startsWith('//')
  ) {
    return locationState.from;
  }

  return fallback;
}

function useCatalog() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);

      try {
        const vehicleResult = await apiFetch<Vehicle[]>(
          '/api/vehicles'
        );

        if (!active) return;

        setVehicles(
          Array.isArray(vehicleResult) ? vehicleResult : []
        );

        try {
          const companyResult = await apiFetch<Company[]>(
            '/api/companies'
          );

          if (active) {
            setCompanies(
              Array.isArray(companyResult)
                ? companyResult
                : []
            );
          }
        } catch {
          // Vehicle catalog remains usable without companies.
        }

        if (active) setError('');
      } catch (reason) {
        if (!active) return;

        setError(
          reason instanceof Error
            ? reason.message
            : 'Unable to load vehicles.'
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  return {
    vehicles,
    companies,
    loading,
    error
  };
}

function BackButton({
  to,
  label = 'Back'
}: {
  to: string;
  label?: string;
}) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 text-sm font-semibold text-[#67d7df] transition hover:text-white"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  );
}

function LoadingContent() {
  return (
    <div className="flex justify-center gap-3 py-24 text-[#a9c3d0]">
      <Loader2 className="h-6 w-6 animate-spin text-[#67d7df]" />
      Loading vehicles...
    </div>
  );
}

function EmptyContent({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className={`${panel} px-6 py-16 text-center`}>
      <CarFront className="mx-auto h-11 w-11 text-[#67d7df]" />
      <h2 className="mt-5 text-xl font-bold text-white">
        {title}
      </h2>
      <p className="mt-3 text-sm text-[#a9c3d0]">
        {description}
      </p>
    </div>
  );
}

function BrandLogo({
  src,
  name
}: {
  src?: string;
  name: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-white/10 p-3">
      {src && !failed ? (
        <img
          src={assetSrc(src)}
          alt={`${name} logo`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="max-h-full max-w-full object-contain"
        />
      ) : (
        <Building2 className="h-9 w-9 text-[#67d7df]" />
      )}
    </div>
  );
}

function VehicleCard({
  vehicle,
  from
}: {
  vehicle: Vehicle;
  from: string;
}) {
  return (
    <article className={`${panel} group overflow-hidden transition hover:border-[#16a7b7]`}>
      <Link
        to={`/vehicles/${vehicle.id}`}
        state={{ from }}
        className="block"
      >
        <div className="relative bg-[#0b2d47]">
          <VehicleImage
            src={vehicle.image}
            name={vehicle.name}
            attribution={vehicle.imageAttribution}
            showCredits={false}
            className="aspect-[4/3] w-full"
            imageClassName="transition-transform duration-300 group-hover:scale-105"
          />

          <span className="absolute left-3 top-3 rounded-full bg-[#09243b]/90 px-3 py-1 text-xs font-semibold text-white">
            {vehicle.brandName}
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-[#a9c3d0]">
              {vehicle.type} ·{' '}
              {vehicle.category === 'bike'
                ? 'Motorcycle'
                : 'Car'}
            </p>

            {vehicle.category === 'bike' ? (
              <Bike className="h-5 w-5 text-[#67d7df]" />
            ) : (
              <CarFront className="h-5 w-5 text-[#67d7df]" />
            )}
          </div>

          <h3 className="mt-3 text-lg font-bold text-white">
            {vehicle.name}
          </h3>

          <p className="mt-3 font-semibold text-[#67d7df]">
            {vehicle.price || 'Price unavailable'}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#285673] pt-4">
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold ${
                vehicle.availableForTrial
                  ? 'text-green-300'
                  : 'text-amber-300'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              {vehicle.availableForTrial
                ? 'Trial Available'
                : 'Currently Unavailable'}
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#67d7df]">
              View Details
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function VehiclesPage() {
  const { vehicles, loading, error } = useCatalog();

  const [query, setQuery] = useState('');
  const [brand, setBrand] = useState('all');
  const [category, setCategory] = useState('all');
  const [trialOnly, setTrialOnly] = useState(false);

  const brands = useMemo(() => {
    const result = new Map<string, string>();

    vehicles.forEach(vehicle => {
      if (vehicle.brandId && vehicle.brandName) {
        result.set(vehicle.brandId, vehicle.brandName);
      }
    });

    return Array.from(result.entries()).sort(
      (a, b) => a[1].localeCompare(b[1])
    );
  }, [vehicles]);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();

    return vehicles.filter(vehicle => {
      const matchesSearch =
        `${vehicle.name} ${vehicle.brandName} ${vehicle.type}`
          .toLowerCase()
          .includes(text);

      const matchesBrand =
        brand === 'all' || vehicle.brandId === brand;

      const matchesCategory =
        category === 'all' ||
        vehicle.category === category;

      const matchesTrial =
        !trialOnly || vehicle.availableForTrial;

      return (
        matchesSearch &&
        matchesBrand &&
        matchesCategory &&
        matchesTrial
      );
    });
  }, [vehicles, query, brand, category, trialOnly]);

  return (
    <div className="min-h-screen bg-[#09243b] pb-20 text-white">
      <section className="border-b border-[#285673] bg-[#0b2d47] py-12">
        <div className={shell}>
          <BackButton to="/" label="Back to Home" />

          <p className="mt-8 text-xs font-bold uppercase tracking-widest text-[#67d7df]">
            Vehicle Collection
          </p>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Explore Vehicles
          </h1>

          <p className="mt-4 max-w-2xl text-[#a9c3d0]">
            Explore our car and motorcycle catalog and find a
            model for your next trial.
          </p>
        </div>
      </section>

      <section className={`${shell} py-9`}>
        <div className={`${panel} grid gap-4 p-5 lg:grid-cols-[1fr_auto_auto_auto]`}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8db3c5]" />

            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search vehicles or brands..."
              className="w-full rounded-xl border border-[#285673] bg-[#09243b] py-3 pl-12 pr-4 text-white outline-none focus:border-[#16a7b7]"
            />
          </div>

          <select
            value={brand}
            onChange={event => setBrand(event.target.value)}
            aria-label="Filter by brand"
            className="rounded-xl border border-[#285673] bg-[#09243b] px-4 py-3 text-white"
          >
            <option value="all">All Brands</option>
            {brands.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={category}
            onChange={event => setCategory(event.target.value)}
            aria-label="Filter by vehicle type"
            className="rounded-xl border border-[#285673] bg-[#09243b] px-4 py-3 text-white"
          >
            <option value="all">All Vehicles</option>
            <option value="car">Cars</option>
            <option value="bike">Motorcycles</option>
          </select>

          <button
            type="button"
            aria-pressed={trialOnly}
            onClick={() => setTrialOnly(current => !current)}
            className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${
              trialOnly
                ? 'border-[#67d7df] bg-[#07549a] text-white'
                : 'border-[#285673] bg-[#09243b] text-[#d6e4ea]'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Trial Available
          </button>
        </div>

        <p className="my-7 text-sm text-[#a9c3d0]">
          Showing {filtered.length} vehicles
        </p>

        {loading ? (
          <LoadingContent />
        ) : error ? (
          <EmptyContent
            title="Unable to load vehicles"
            description={error}
          />
        ) : filtered.length === 0 ? (
          <EmptyContent
            title="No matching vehicles"
            description="Try a different search or filter."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map(vehicle => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                from="/vehicles"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}


export function BrandsPage() {
  const { vehicles, companies, loading, error } = useCatalog();

  const brands = useMemo(() => {
    const results = new Map<
      string,
      {
        id: string;
        name: string;
        logo: string;
        description: string;
        count: number;
      }
    >();

    vehicles.forEach(vehicle => {
      const key = vehicle.brandName.trim().toLowerCase();

      if (!key) return;

      const existing = results.get(key);

      if (existing) {
        existing.count += 1;

        if (!existing.logo && vehicle.logo) {
          existing.logo = vehicle.logo;
        }
      } else {
        const company = companies.find(
          item =>
            item.name.trim().toLowerCase() === key
        );

        results.set(key, {
          id: vehicle.brandId,
          name: vehicle.brandName,
          logo: vehicle.logo || company?.logo || '',
          description: company?.description || '',
          count: 1
        });
      }
    });

    return Array.from(results.values()).sort(
      (a, b) => a.name.localeCompare(b.name)
    );
  }, [vehicles, companies]);

  return (
    <div className="min-h-screen bg-[#09243b] pb-20 text-white">
      <section className="bg-[#0b2d47] py-12">
        <div className={shell}>
          <BackButton
            to="/"
            label="Back to Home"
          />

          <h1 className="mt-8 text-4xl font-bold sm:text-5xl">
            Explore Brands
          </h1>

          <p className="mt-4 text-[#a9c3d0]">
            Discover vehicles from different manufacturers.
          </p>
        </div>
      </section>

      <section className={`${shell} py-10`}>
        {loading ? (
          <LoadingContent />
        ) : error ? (
          <EmptyContent
            title="Unable to load brands"
            description={error}
          />
        ) : brands.length === 0 ? (
          <EmptyContent
            title="No brands available"
            description="Brand information is not currently available."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {brands.map(brand => (
              <Link
                key={brand.id}
                to={`/brands/${brand.id}`}
                className={`${panel} group p-6 transition hover:border-[#16a7b7]`}
              >
                <BrandLogo
                  src={brand.logo}
                  name={brand.name}
                />

                <h2 className="mt-5 text-xl font-bold">
                  {brand.name}
                </h2>

                {brand.description && (
                  <p className="mt-3 line-clamp-2 text-sm text-[#a9c3d0]">
                    {brand.description}
                  </p>
                )}

                <div className="mt-6 flex items-center justify-between text-sm text-[#a9c3d0]">
                  <span>
                    {brand.count}{' '}
                    {brand.count === 1
                      ? 'vehicle'
                      : 'vehicles'}
                  </span>

                  <ArrowRight className="h-5 w-5 text-[#67d7df] transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function BrandDetailsPage() {
  const { brandId } = useParams<{ brandId: string }>();
  const { vehicles, companies, loading, error } = useCatalog();

  const brandVehicles = useMemo(() => {
  const selectedVehicle = vehicles.find(
    vehicle => vehicle.brandId === brandId
  );

  const selectedCompany = companies.find(
    company => company.id === brandId
  );

  const selectedBrandName =
    selectedVehicle?.brandName ||
    selectedCompany?.name ||
    '';

  if (!selectedBrandName) return [];

  return vehicles.filter(
    vehicle =>
      vehicle.brandName.trim().toLowerCase() ===
      selectedBrandName.trim().toLowerCase()
  );
}, [vehicles, companies, brandId]);

  const company = companies.find(
    item => item.id === brandId
  );

  const name =
    company?.name ||
    brandVehicles[0]?.brandName ||
    'Brand';

  const logo =
    company?.logo || brandVehicles[0]?.logo;

  return (
    <div className="min-h-screen bg-[#09243b] pb-20 text-white">
      <section className="bg-[#0b2d47] py-12">
        <div className={shell}>
          <BackButton
            to="/brands"
            label="Back to Brands"
          />

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <BrandLogo
              src={logo}
              name={name}
            />

            <div>
              <h1 className="text-4xl font-bold">
                {name}
              </h1>

              <p className="mt-3 text-[#a9c3d0]">
                {company?.description ||
                  'Explore the vehicle collection.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${shell} py-10`}>
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">
            {name} Vehicles
          </h2>

          <span className="text-sm text-[#a9c3d0]">
            {brandVehicles.length} models
          </span>
        </div>

        {loading ? (
          <LoadingContent />
        ) : error ? (
          <EmptyContent
            title="Unable to load vehicles"
            description={error}
          />
        ) : brandVehicles.length === 0 ? (
          <EmptyContent
            title="No vehicles available"
            description="There are no available listings for this brand."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {brandVehicles.map(vehicle => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                from={`/brands/${brandId}`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function VehicleDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const { vehicles, loading, error } = useCatalog();

  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [favoriteError, setFavoriteError] = useState('');

  const vehicle = vehicles.find(item => item.id === id);

  const backPath = getBackPath(
    location.state,
    '/vehicles'
  );

  useEffect(() => {
    if (!id) return;

    let active = true;

    async function checkFavorite() {
      try {
        const result = await apiFetch<FavoriteStatus>(
          `/api/favorites/check/${id}`
        );

        if (active) {
          setIsFavorite(
            Boolean(result.isFavorite ?? result.favorite)
          );
        }
      } catch {
        if (active) setIsFavorite(false);
      }
    }

    void checkFavorite();

    return () => {
      active = false;
    };
  }, [id]);

  async function toggleFavorite() {
    if (!vehicle || favoriteLoading) return;

    setFavoriteLoading(true);
    setFavoriteError('');

    try {
      if (isFavorite) {
        await apiFetch(
          `/api/favorites/${vehicle.id}`,
          { method: 'DELETE' }
        );

        setIsFavorite(false);
      } else {
        await apiFetch('/api/favorites', {
          method: 'POST',
          body: JSON.stringify({
            vehicleId: vehicle.id
          })
        });

        setIsFavorite(true);
      }
    } catch (reason) {
      const message =
        reason instanceof Error
          ? reason.message
          : 'Unable to update favorites.';

      if (
        /401|unauthorized|authentication|sign.in|log.in/i.test(
          message
        )
      ) {
        navigate(
          `/signin?returnTo=${encodeURIComponent(
            `/vehicles/${vehicle.id}`
          )}`
        );
      } else {
        setFavoriteError(message);
      }
    } finally {
      setFavoriteLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09243b]">
        <LoadingContent />
      </div>
    );
  }

  if (!vehicle || error) {
    return (
      <div className="min-h-screen bg-[#09243b] px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <BackButton to="/vehicles" />
          <div className="mt-8">
            <EmptyContent
              title="Vehicle unavailable"
              description={error || 'This vehicle could not be found.'}
            />
          </div>
        </div>
      </div>
    );
  }

  const specifications = [
    ['Brand', vehicle.brandName],
    ['Category', vehicle.category === 'bike' ? 'Motorcycle' : 'Car'],
    ['Type', vehicle.type],
    ['Engine', vehicle.engine],
    ['Mileage', vehicle.mileage],
    ['Fuel Type', vehicle.fuelType],
    ['Transmission', vehicle.transmission],
    [
      'Seating Capacity',
      vehicle.seatingCapacity
        ? String(vehicle.seatingCapacity)
        : ''
    ]
  ].filter((entry): entry is string[] => Boolean(entry[1]));

  return (
    <div className="min-h-screen bg-[#09243b] pb-20 text-white">
      <div className={`${shell} pt-9`}>
        <BackButton
          to={backPath}
          label={
            backPath.startsWith('/brands/')
              ? 'Back to Brand'
              : backPath.startsWith('/dashboard/')
                ? 'Back to Favorites'
                : 'Back to Vehicles'
          }
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <VehicleImage
              src={vehicle.image}
              name={vehicle.name}
              attribution={vehicle.imageAttribution}
              className="w-full"
              imageClassName="aspect-[4/3]"
              showCredits
            />
          </div>

          <div className={`${panel} p-6 sm:p-8`}>
            <Link
              to={`/brands/${vehicle.brandId}`}
              className="text-sm font-semibold text-[#67d7df] hover:text-white"
            >
              {vehicle.brandName}
            </Link>

            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
              {vehicle.name}
            </h1>

            <p className="mt-5 text-2xl font-bold text-[#67d7df]">
              {vehicle.price || 'Price unavailable'}
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm">
              <ShieldCheck className="h-5 w-5 text-[#67d7df]" />

              <span className="text-[#d6e4ea]">
                {vehicle.availableForTrial
                  ? 'Trial requests available'
                  : 'Trial currently unavailable'}
              </span>
            </div>

            {vehicle.description && (
              <p className="mt-6 leading-7 text-[#a9c3d0]">
                {vehicle.description}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {vehicle.availableForTrial ? (
                <Link
                  to={`/booking?vehicle=${encodeURIComponent(
                    vehicle.id
                  )}`}
                  state={{ from: `/vehicles/${vehicle.id}` }}
                  className={primaryButton}
                >
                  <CalendarDays className="h-4 w-4" />
                  Book a Trial
                </Link>
              ) : (
                <span className="inline-flex items-center rounded-xl border border-[#285673] bg-[#174965] px-5 py-3 text-sm text-[#a9c3d0]">
                  Trial Unavailable
                </span>
              )}

              <button
                type="button"
                disabled={favoriteLoading}
                onClick={() => void toggleFavorite()}
                className={outlineButton}
              >
                {favoriteLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Heart
                    className={`h-4 w-4 ${
                      isFavorite
                        ? 'fill-red-400 text-red-400'
                        : ''
                    }`}
                  />
                )}

                {isFavorite
                  ? 'Remove Favorite'
                  : 'Add to Favorites'}
              </button>
            </div>

            {favoriteError && (
              <p
                role="alert"
                className="mt-4 text-sm text-red-300"
              >
                {favoriteError}
              </p>
            )}

            <Link
              to="/dealers"
              state={{ from: `/vehicles/${vehicle.id}` }}
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#67d7df] hover:text-white"
            >
              Explore Showrooms
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-bold">
            Vehicle Specifications
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {specifications.map(([label, value]) => (
              <div
                key={label}
                className={`${panel} p-5`}
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8db3c5]">
                  {label}
                </p>

                <p className="mt-3 font-semibold text-white">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className={`${panel} mt-10 p-6`}>
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <ShieldCheck className="h-5 w-5 text-[#67d7df]" />
            Booking Information
          </h2>

          <p className="mt-3 leading-7 text-[#a9c3d0]">
            Submitting a trial request saves your booking
            within the platform. Confirmation depends on
            the company account reviewing the request.
          </p>
        </section>
      </div>
    </div>
  );
}
