
import {
  useCallback,
  useEffect,
  useState,
  type FormEvent
} from 'react';

import {
  Building2,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Trash2,
  X
} from 'lucide-react';

import { apiFetch } from '../../lib/api';

interface Showroom {
  id: string;
  companyId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactEmail: string;
  contactPhone: string;
  openingHours: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

type ShowroomDraft = Omit<
  Showroom,
  'id' | 'companyId' | 'createdAt' | 'updatedAt'
> & {
  id?: string;
};

interface ShowroomResponse {
  message: string;
  showroom: Showroom;
}

const emptyDraft: ShowroomDraft = {
  name: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  contactEmail: '',
  contactPhone: '',
  openingHours: '',
  active: true
};

const fieldClass =
  'mt-2 w-full rounded-xl border border-[#285673] bg-[#09243b] px-4 py-3 text-sm text-white placeholder-[#7899aa] outline-none focus:border-[#16a7b7]';

const primaryButton =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[#07549a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0875ac] disabled:cursor-not-allowed disabled:opacity-50';

const secondaryButton =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-[#285673] bg-[#09243b] px-4 py-2.5 text-sm font-semibold text-white transition hover:border-[#16a7b7] hover:bg-[#174965] disabled:opacity-50';

export default function CompanyShowrooms() {
  const [showrooms, setShowrooms] = useState<Showroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [draft, setDraft] = useState<ShowroomDraft | null>(null);

  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadShowrooms = useCallback(async () => {
    setLoading(true);

    try {
      const result = await apiFetch<Showroom[]>(
        '/api/showrooms/company'
      );

      setShowrooms(Array.isArray(result) ? result : []);
      setError('');
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to load showrooms.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadShowrooms();
  }, [loadShowrooms]);

  function openAdd() {
    setDraft({ ...emptyDraft });
    setNotice('');
    setError('');
  }

  function openEdit(showroom: Showroom) {
    setDraft({
      id: showroom.id,
      name: showroom.name,
      address: showroom.address,
      city: showroom.city,
      state: showroom.state,
      pincode: showroom.pincode,
      contactEmail: showroom.contactEmail,
      contactPhone: showroom.contactPhone,
      openingHours: showroom.openingHours,
      active: showroom.active
    });

    setError('');
    setNotice('');
  }

  function updateDraft<K extends keyof ShowroomDraft>(
    key: K,
    value: ShowroomDraft[K]
  ) {
    setDraft(current =>
      current
        ? { ...current, [key]: value }
        : current
    );
  }

  async function saveShowroom(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!draft || saving) return;

    setSaving(true);
    setError('');
    setNotice('');

    try {
      const { id, ...payload } = draft;

      const response = await apiFetch<ShowroomResponse>(
        id
          ? `/api/showrooms/company/${id}`
          : '/api/showrooms/company',
        {
          method: id ? 'PUT' : 'POST',
          body: JSON.stringify(payload)
        }
      );

      setShowrooms(current => {
        if (id) {
          return current.map(showroom =>
            showroom.id === id
              ? response.showroom
              : showroom
          );
        }

        return [response.showroom, ...current];
      });

      setDraft(null);
      setNotice(
        id
          ? 'Showroom updated successfully.'
          : 'Showroom added successfully.'
      );
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to save showroom.'
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteShowroom(showroom: Showroom) {
    if (busyId || saving) return;

    const confirmed = window.confirm(
      `Delete "${showroom.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setBusyId(showroom.id);
    setError('');
    setNotice('');

    try {
      await apiFetch(
        `/api/showrooms/company/${showroom.id}`,
        { method: 'DELETE' }
      );

      setShowrooms(current =>
        current.filter(item => item.id !== showroom.id)
      );

      setNotice('Showroom deleted successfully.');
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to delete showroom.'
      );
    } finally {
      setBusyId(null);
    }
  }

  async function toggleActive(showroom: Showroom) {
    if (busyId || saving) return;

    setBusyId(showroom.id);
    setError('');
    setNotice('');

    try {
      const response = await apiFetch<ShowroomResponse>(
        `/api/showrooms/company/${showroom.id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            active: !showroom.active
          })
        }
      );

      setShowrooms(current =>
        current.map(item =>
          item.id === showroom.id
            ? response.showroom
            : item
        )
      );

      setNotice(
        response.showroom.active
          ? 'Showroom activated.'
          : 'Showroom deactivated.'
      );
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to update showroom availability.'
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6 text-white">
      {/* HEADER */}

      <section className="rounded-2xl border border-[#285673] bg-[#103a58] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#67d7df]">
              <Building2 className="h-6 w-6" />

              <span className="text-xs font-bold uppercase tracking-widest">
                Company Management
              </span>
            </div>

            <h2 className="mt-3 text-2xl font-bold">
              My Showrooms
            </h2>

            <p className="mt-3 text-sm text-[#a9c3d0]">
              Manage your company's showroom locations
              and contact information.
            </p>
          </div>

          <button
            type="button"
            onClick={openAdd}
            className={primaryButton}
          >
            <Plus className="h-4 w-4" />
            Add Showroom
          </button>
        </div>
      </section>

      {/* STATUS MESSAGES */}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200"
        >
          {error}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="rounded-xl border border-green-400/30 bg-green-500/10 p-4 text-sm text-green-200"
        >
          {notice}
        </div>
      )}

      {/* SHOWROOM LIST */}

      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-[#285673] bg-[#103a58] p-16 text-[#a9c3d0]">
          <Loader2 className="h-6 w-6 animate-spin text-[#67d7df]" />
          Loading showrooms...
        </div>
      ) : showrooms.length === 0 ? (
        <div className="rounded-2xl border border-[#285673] bg-[#103a58] p-12 text-center">
          <MapPin className="mx-auto h-12 w-12 text-[#67d7df]" />

          <h3 className="mt-5 text-xl font-bold">
            No Showrooms Yet
          </h3>

          <p className="mt-3 text-sm text-[#a9c3d0]">
            Add your company's first showroom.
          </p>

          <button
            type="button"
            onClick={openAdd}
            className={`${primaryButton} mt-6`}
          >
            <Plus className="h-4 w-4" />
            Add Showroom
          </button>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {showrooms.map(showroom => (
            <article
              key={showroom.id}
              className="rounded-2xl border border-[#285673]/70 bg-[#103a58] p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#07549a]/30">
                  <Building2 className="h-6 w-6 text-[#67d7df]" />
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    showroom.active
                      ? 'border-green-400/30 bg-green-500/10 text-green-200'
                      : 'border-slate-400/30 bg-slate-500/10 text-slate-300'
                  }`}
                >
                  {showroom.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <h3 className="mt-5 text-xl font-bold">
                {showroom.name}
              </h3>

              <div className="mt-5 space-y-3 text-sm text-[#a9c3d0]">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#67d7df]" />

                  <span>
                    {showroom.address}
                    {', '}
                    {showroom.city}
                    {', '}
                    {showroom.state}
                    {showroom.pincode
                      ? ` - ${showroom.pincode}`
                      : ''}
                  </span>
                </div>

                {showroom.contactEmail && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 shrink-0 text-[#67d7df]" />
                    <span className="break-all">
                      {showroom.contactEmail}
                    </span>
                  </div>
                )}

                {showroom.contactPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 shrink-0 text-[#67d7df]" />
                    <span>{showroom.contactPhone}</span>
                  </div>
                )}

                {showroom.openingHours && (
                  <p>
                    Opening Hours: {showroom.openingHours}
                  </p>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-[#285673] pt-5">
                <button
                  type="button"
                  onClick={() => openEdit(showroom)}
                  disabled={busyId !== null}
                  className={secondaryButton}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    void toggleActive(showroom)
                  }
                  disabled={busyId !== null}
                  className={secondaryButton}
                >
                  {busyId === showroom.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}

                  {showroom.active
                    ? 'Deactivate'
                    : 'Activate'}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    void deleteShowroom(showroom)
                  }
                  disabled={busyId !== null}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-200 transition hover:bg-red-500/20 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ADD / EDIT SHOWROOM MODAL */}

      {draft && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="showroom-modal-title"
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/75 p-4 py-12"
        >
          <form
            onSubmit={event => void saveShowroom(event)}
            className="my-auto w-full max-w-2xl rounded-2xl border border-[#285673] bg-[#10324e] p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between gap-3">
              <h3
                id="showroom-modal-title"
                className="text-2xl font-bold"
              >
                {draft.id ? 'Edit Showroom' : 'Add Showroom'}
              </h3>

              <button
                type="button"
                onClick={() => {
                  setDraft(null);
                  setError('');
                }}
                disabled={saving}
                aria-label="Close showroom form"
                className="rounded-xl border border-[#285673] p-2 hover:bg-[#174965] disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-semibold sm:col-span-2">
                Showroom Name *
                <input
                  required
                  maxLength={120}
                  value={draft.name}
                  onChange={event =>
                    updateDraft('name', event.target.value)
                  }
                  placeholder="Example: Main City Showroom"
                  className={fieldClass}
                />
              </label>

              <label className="block text-sm font-semibold sm:col-span-2">
                Address *
                <input
                  required
                  maxLength={300}
                  value={draft.address}
                  onChange={event =>
                    updateDraft('address', event.target.value)
                  }
                  placeholder="Street and area"
                  className={fieldClass}
                />
              </label>

              <label className="block text-sm font-semibold">
                City *
                <input
                  required
                  maxLength={100}
                  value={draft.city}
                  onChange={event =>
                    updateDraft('city', event.target.value)
                  }
                  className={fieldClass}
                />
              </label>

              <label className="block text-sm font-semibold">
                State *
                <input
                  required
                  maxLength={100}
                  value={draft.state}
                  onChange={event =>
                    updateDraft('state', event.target.value)
                  }
                  className={fieldClass}
                />
              </label>

              <label className="block text-sm font-semibold">
                Pincode
                <input
                  maxLength={12}
                  value={draft.pincode}
                  onChange={event =>
                    updateDraft('pincode', event.target.value)
                  }
                  className={fieldClass}
                />
              </label>

              <label className="block text-sm font-semibold">
                Contact Phone
                <input
                  type="tel"
                  maxLength={25}
                  value={draft.contactPhone}
                  onChange={event =>
                    updateDraft('contactPhone', event.target.value)
                  }
                  className={fieldClass}
                />
              </label>

              <label className="block text-sm font-semibold">
                Contact Email
                <input
                  type="email"
                  maxLength={150}
                  value={draft.contactEmail}
                  onChange={event =>
                    updateDraft('contactEmail', event.target.value)
                  }
                  className={fieldClass}
                />
              </label>

              <label className="block text-sm font-semibold">
                Opening Hours
                <input
                  maxLength={150}
                  value={draft.openingHours}
                  onChange={event =>
                    updateDraft('openingHours', event.target.value)
                  }
                  placeholder="Example: Mon-Sat 9 AM-6 PM"
                  className={fieldClass}
                />
              </label>

              <label className="flex items-center gap-3 text-sm font-semibold sm:col-span-2">
                <input
                  type="checkbox"
                  checked={draft.active}
                  onChange={event =>
                    updateDraft('active', event.target.checked)
                  }
                  className="h-4 w-4 accent-[#16a7b7]"
                />
                Showroom Active
              </label>
            </div>

            {error && (
              <p
                role="alert"
                className="mt-5 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200"
              >
                {error}
              </p>
            )}

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDraft(null)}
                disabled={saving}
                className={secondaryButton}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className={primaryButton}
              >
                {saving && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {saving
                  ? 'Saving...'
                  : draft.id
                    ? 'Save Changes'
                    : 'Add Showroom'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
