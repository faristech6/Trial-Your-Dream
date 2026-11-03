
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Pencil, Plus, Trash2, X, CarFront, Loader2 } from 'lucide-react';
import { apiFetch, assetSrc } from '../../lib/api';
import ImageField from './ImageField';

interface CompanyVehicle {
  id: string;
  name: string;
  category: 'car' | 'bike';
  type: string;
  price: string;
  engine: string;
  mileage: string;
  transmission: string;
  fuelType: string;
  seatingCapacity: number;
  image: string;
  description: string;
  availableForTrial: boolean;
}

type Draft = Omit<CompanyVehicle, 'id'> & {
  id?: string;
};

const emptyDraft: Draft = {
  name: '',
  category: 'car',
  type: '',
  price: '',
  engine: '',
  mileage: '',
  transmission: '',
  fuelType: '',
  seatingCapacity: 5,
  image: '',
  description: '',
  availableForTrial: true
};

const field =
  'mt-2 w-full rounded-xl border border-[#285673] bg-[#09243b] px-3 py-2.5 text-sm font-normal text-white placeholder-[#7695a5] outline-none transition focus:border-[#16a7b7]';

const actionButton =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[#07549a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0875ac] disabled:cursor-not-allowed disabled:opacity-50';

function VehicleImage({
  src,
  name
}: {
  src: string;
  name: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#09243b]">
      {src && !failed ? (
        <img
          src={assetSrc(src)}
          alt={name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain"
        />
      ) : (
        <div className="flex flex-col items-center gap-1 text-[#8db3c5]">
          <CarFront className="h-7 w-7" />
          <span className="text-xs">No image</span>
        </div>
      )}
    </div>
  );
}

export default function CompanyVehicles({
  openNew = false
}: {
  openNew?: boolean;
}) {
  const [vehicles, setVehicles] = useState<CompanyVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState<Draft | null>(
    openNew ? { ...emptyDraft } : null
  );
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError('');

      const result = await apiFetch<CompanyVehicle[]>(
        '/api/company/vehicles'
      );

      setVehicles(result);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Could not load vehicles.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!draft || saving) return;

    setSaving(true);
    setError('');

    try {
      const { id, ...body } = draft;

      await apiFetch(
        id
          ? `/api/company/vehicles/${id}`
          : '/api/company/vehicles',
        {
          method: id ? 'PUT' : 'POST',
          body: JSON.stringify(body)
        }
      );

      setDraft(null);
      await load();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Could not save the vehicle.'
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleTrial = async (vehicle: CompanyVehicle) => {
    if (busyId) return;

    setBusyId(vehicle.id);
    setError('');

    setVehicles(current =>
      current.map(item =>
        item.id === vehicle.id
          ? {
              ...item,
              availableForTrial: !item.availableForTrial
            }
          : item
      )
    );

    try {
      await apiFetch(
        `/api/company/vehicles/${vehicle.id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            availableForTrial: !vehicle.availableForTrial
          })
        }
      );
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Could not update trial availability.'
      );
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (vehicle: CompanyVehicle) => {
    if (busyId) return;

    if (
      !window.confirm(
        `Remove ${vehicle.name} from your list? This cannot be undone.`
      )
    ) {
      return;
    }

    setBusyId(vehicle.id);
    setError('');

    try {
      await apiFetch(
        `/api/company/vehicles/${vehicle.id}`,
        {
          method: 'DELETE'
        }
      );

      setVehicles(current =>
        current.filter(item => item.id !== vehicle.id)
      );
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Could not remove the vehicle.'
      );
    } finally {
      setBusyId(null);
    }
  };

  const set = <K extends keyof Draft>(
    key: K,
    value: Draft[K]
  ) => {
    setDraft(current =>
      current
        ? { ...current, [key]: value }
        : current
    );
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-[#285673]/70 bg-[#103a58] text-white">

      {/* HEADER */}

      <div className="flex flex-col gap-3 border-b border-[#285673] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">
            Your Vehicles
          </h2>

          <p className="mt-2 text-sm text-[#a9c3d0]">
            Add, edit, or remove models and manage
            test-drive availability.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setError('');
            setDraft({ ...emptyDraft });
          }}
          className={actionButton}
        >
          <Plus className="h-4 w-4" />
          Add Vehicle
        </button>
      </div>

      {/* ERRORS */}

      {error && (
        <p
          role="alert"
          className="m-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {error}
        </p>
      )}

      {/* VEHICLE LIST */}

      {loading ? (
        <div className="flex items-center justify-center gap-3 p-12 text-[#a9c3d0]">
          <Loader2 className="h-5 w-5 animate-spin text-[#67d7df]" />
          Loading vehicles...
        </div>
      ) : vehicles.length === 0 && !error ? (
        <div className="p-12 text-center">
          <CarFront className="mx-auto h-12 w-12 text-[#67d7df]" />

          <h3 className="mt-4 text-lg font-semibold text-white">
            No Vehicles Yet
          </h3>

          <p className="mt-2 text-sm text-[#a9c3d0]">
            Add your first vehicle to make it available
            for trials.
          </p>

          <button
            type="button"
            onClick={() => setDraft({ ...emptyDraft })}
            className={`${actionButton} mt-6`}
          >
            <Plus className="h-4 w-4" />
            Add Vehicle
          </button>
        </div>
      ) : (
        <div className="divide-y divide-[#285673]/60">
          {vehicles.map(vehicle => (
            <div
              key={vehicle.id}
              className="flex flex-col gap-4 p-5 transition hover:bg-[#174965]/30 sm:flex-row sm:items-center"
            >
              <VehicleImage
                src={vehicle.image}
                name={vehicle.name}
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-white">
                  {vehicle.name}
                </p>

                <p className="mt-2 text-sm text-[#a9c3d0]">
                  {vehicle.category === 'car'
                    ? 'Car'
                    : 'Motorcycle'}
                  {' · '}
                  {vehicle.type}
                </p>

                <p className="mt-2 text-sm font-semibold text-[#67d7df]">
                  {vehicle.price}
                </p>
              </div>

              <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-[#d6e4ea]">
                <input
                  type="checkbox"
                  checked={vehicle.availableForTrial}
                  disabled={busyId !== null}
                  onChange={() =>
                    void toggleTrial(vehicle)
                  }
                  className="h-4 w-4 accent-[#16a7b7]"
                />

                <span>
                  {vehicle.availableForTrial
                    ? 'Available for Trial'
                    : 'Trial Unavailable'}
                </span>
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setDraft({ ...vehicle });
                  }}
                  disabled={busyId !== null}
                  aria-label={`Edit ${vehicle.name}`}
                  className="rounded-xl border border-[#285673] bg-[#09243b] p-3 text-[#67d7df] transition hover:border-[#16a7b7] disabled:opacity-50"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    void remove(vehicle)
                  }
                  disabled={busyId !== null}
                  aria-label={`Remove ${vehicle.name}`}
                  className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                >
                  {busyId === vehicle.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT VEHICLE MODAL */}

      {draft && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/75 p-4 pt-16 sm:pt-24"
          role="dialog"
          aria-modal="true"
          aria-labelledby="vehicle-form-title"
        >
          <form
            onSubmit={save}
            className="w-full max-w-2xl rounded-2xl border border-[#285673] bg-[#10324e] p-6 text-white shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <h3
                id="vehicle-form-title"
                className="text-xl font-bold text-white"
              >
                {draft.id
                  ? 'Edit Vehicle'
                  : 'Add Vehicle'}
              </h3>

              <button
                type="button"
                onClick={() => setDraft(null)}
                aria-label="Close"
                disabled={saving}
                className="rounded-xl border border-[#285673] p-2 text-[#a9c3d0] transition hover:bg-[#174965] hover:text-white disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              <label className="block text-sm font-semibold">
                Name *
                <input
                  required
                  value={draft.name}
                  onChange={event =>
                    set('name', event.target.value)
                  }
                  className={field}
                />
              </label>

              <label className="block text-sm font-semibold">
                Category *
                <select
                  value={draft.category}
                  onChange={event =>
                    set(
                      'category',
                      event.target.value as 'car' | 'bike'
                    )
                  }
                  className={field}
                >
                  <option value="car">Car</option>
                  <option value="bike">Motorcycle</option>
                </select>
              </label>

              <label className="block text-sm font-semibold">
                Vehicle Type *
                <input
                  required
                  value={draft.type}
                  onChange={event =>
                    set('type', event.target.value)
                  }
                  placeholder="SUV, Sedan, Naked..."
                  className={field}
                />
              </label>

              <label className="block text-sm font-semibold">
                Price *
                <input
                  required
                  value={draft.price}
                  onChange={event =>
                    set('price', event.target.value)
                  }
                  placeholder="₹12-18 Lakh"
                  className={field}
                />
              </label>

              <label className="block text-sm font-semibold">
                Engine
                <input
                  value={draft.engine}
                  onChange={event =>
                    set('engine', event.target.value)
                  }
                  className={field}
                />
              </label>

              <label className="block text-sm font-semibold">
                Mileage
                <input
                  value={draft.mileage}
                  onChange={event =>
                    set('mileage', event.target.value)
                  }
                  className={field}
                />
              </label>

              <label className="block text-sm font-semibold">
                Transmission
                <input
                  value={draft.transmission}
                  onChange={event =>
                    set('transmission', event.target.value)
                  }
                  className={field}
                />
              </label>

              <label className="block text-sm font-semibold">
                Fuel Type
                <input
                  value={draft.fuelType}
                  onChange={event =>
                    set('fuelType', event.target.value)
                  }
                  className={field}
                />
              </label>

              <label className="block text-sm font-semibold">
                Seating Capacity
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={draft.seatingCapacity}
                  onChange={event =>
                    set(
                      'seatingCapacity',
                      Number(event.target.value)
                    )
                  }
                  className={field}
                />
              </label>

              <label className="flex items-end gap-3 pb-3 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={draft.availableForTrial}
                  onChange={event =>
                    set(
                      'availableForTrial',
                      event.target.checked
                    )
                  }
                  className="h-4 w-4 accent-[#16a7b7]"
                />

                Available for Trial
              </label>

              <div className="sm:col-span-2">
                <ImageField
                  label="Vehicle Photo"
                  value={draft.image}
                  onChange={value =>
                    set('image', value)
                  }
                  maxSize={1000}
                />
              </div>

              <label className="block text-sm font-semibold sm:col-span-2">
                Description
                <textarea
                  rows={4}
                  value={draft.description}
                  onChange={event =>
                    set('description', event.target.value)
                  }
                  className={`${field} resize-y`}
                />
              </label>
            </div>

            {error && (
              <p
                role="alert"
                className="mt-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
              >
                {error}
              </p>
            )}

            <div className="mt-7 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setDraft(null)}
                disabled={saving}
                className="rounded-xl border border-[#285673] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#174965] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className={actionButton}
              >
                {saving && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {saving
                  ? 'Saving...'
                  : 'Save Vehicle'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
