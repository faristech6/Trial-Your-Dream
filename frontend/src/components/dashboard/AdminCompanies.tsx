
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  Building2,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  UserPlus,
  X
} from 'lucide-react';

import { apiFetch, assetSrc } from '../../lib/api';
import ImageField from './ImageField';

interface AdminCompany {
  id: string;
  name: string;
  logo: string;
  description: string;
  location: string;
  status: 'ACTIVE' | 'INACTIVE';
  vehicleCount: number;
  adminEmails: string | null;
}

interface Draft {
  id?: string;
  name: string;
  logo: string;
  location: string;
  description: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
}

const emptyDraft: Draft = {
  name: '',
  logo: '',
  location: '',
  description: '',
  adminName: '',
  adminEmail: '',
  adminPassword: ''
};

const field =
  'mt-2 w-full rounded-xl border border-[#285673] bg-[#09243b] px-3 py-2.5 text-sm font-normal text-white placeholder-[#7695a5] outline-none transition focus:border-[#16a7b7]';

const actionButton =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[#07549a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0875ac] disabled:cursor-not-allowed disabled:opacity-50';

const outlineButton =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-[#285673] bg-[#09243b] px-3 py-2.5 text-xs font-semibold text-[#d6e4ea] transition hover:border-[#16a7b7] hover:bg-[#174965] disabled:opacity-50';

function CompanyLogo({
  logo,
  name
}: {
  logo: string;
  name: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [logo]);

  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#09243b] p-2">
      {logo && !failed ? (
        <img
          src={assetSrc(logo)}
          alt={name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="max-h-full max-w-full object-contain"
        />
      ) : (
        <Building2 className="h-8 w-8 text-[#67d7df]" />
      )}
    </div>
  );
}

export default function AdminCompanies() {
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [draft, setDraft] = useState<Draft | null>(null);
  const [adminFor, setAdminFor] = useState<AdminCompany | null>(null);

  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setError('');

      const result = await apiFetch<AdminCompany[]>(
        '/api/admin/companies'
      );

      setCompanies(result);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to load companies.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function run(
    action: () => Promise<unknown>,
    fallback: string
  ) {
    setSaving(true);
    setError('');

    try {
      await action();
      setDraft(null);
      setAdminFor(null);
      await load();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : fallback
      );
    } finally {
      setSaving(false);
    }
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft || saving) return;

    const {
      id,
      adminName,
      adminEmail,
      adminPassword,
      ...brand
    } = draft;

    void run(
      () =>
        id
          ? apiFetch(`/api/admin/companies/${id}`, {
              method: 'PUT',
              body: JSON.stringify(brand)
            })
          : apiFetch('/api/admin/companies', {
              method: 'POST',
              body: JSON.stringify(
                adminEmail || adminName || adminPassword
                  ? {
                      ...brand,
                      adminName,
                      adminEmail,
                      adminPassword
                    }
                  : brand
              )
            }),
      'Unable to save the company.'
    );
  }

  function saveAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adminFor || !draft || saving) return;

    void run(
      () =>
        apiFetch(`/api/admin/companies/${adminFor.id}/admin`, {
          method: 'POST',
          body: JSON.stringify({
            adminName: draft.adminName,
            adminEmail: draft.adminEmail,
            adminPassword: draft.adminPassword
          })
        }),
      'Unable to create the company administrator.'
    );
  }

  function setStatus(company: AdminCompany) {
    if (saving) return;

    void run(
      () =>
        apiFetch(`/api/admin/companies/${company.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            status:
              company.status === 'ACTIVE'
                ? 'INACTIVE'
                : 'ACTIVE'
          })
        }),
      'Unable to update the company status.'
    );
  }

  function remove(company: AdminCompany) {
    if (saving) return;

    if (
      !window.confirm(
        `Delete ${company.name} and its admin accounts? This cannot be undone.`
      )
    ) {
      return;
    }

    void run(
      () =>
        apiFetch(`/api/admin/companies/${company.id}`, {
          method: 'DELETE'
        }),
      'Unable to delete the company.'
    );
  }

  function set<K extends keyof Draft>(
    key: K,
    value: Draft[K]
  ) {
    setDraft(current =>
      current
        ? { ...current, [key]: value }
        : current
    );
  }

  function closeModal() {
    if (saving) return;

    setDraft(null);
    setAdminFor(null);
    setError('');
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[#285673]/70 bg-[#103a58] text-white">

      {/* HEADER */}

      <div className="flex flex-col gap-4 border-b border-[#285673] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">
            Brands &amp; Companies
          </h2>

          <p className="mt-2 text-sm text-[#a9c3d0]">
            Manage manufacturers, their listings, and
            company administrator accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setError('');
            setAdminFor(null);
            setDraft({ ...emptyDraft });
          }}
          className={actionButton}
        >
          <Plus className="h-4 w-4" />
          Add Brand
        </button>
      </div>

      {/* ERROR */}

      {error && !draft && (
        <p
          role="alert"
          className="m-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {error}
        </p>
      )}

      {/* COMPANY LIST */}

      {loading ? (
        <div className="flex items-center justify-center gap-3 p-12 text-[#a9c3d0]">
          <Loader2 className="h-5 w-5 animate-spin text-[#67d7df]" />
          Loading companies...
        </div>
      ) : companies.length === 0 && !error ? (
        <div className="p-12 text-center">
          <Building2 className="mx-auto h-12 w-12 text-[#67d7df]" />

          <h3 className="mt-4 text-lg font-bold">
            No Companies Yet
          </h3>

          <p className="mt-2 text-sm text-[#a9c3d0]">
            Add a brand to start managing its vehicles
            and company administrators.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#285673]/60">
          {companies.map(company => (
            <article
              key={company.id}
              className="flex flex-col gap-4 p-5 transition hover:bg-[#174965]/30 lg:flex-row lg:items-center"
            >
              <CompanyLogo
                logo={company.logo}
                name={company.name}
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-semibold text-white">
                    {company.name}
                  </h3>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold ${
                      company.status === 'ACTIVE'
                        ? 'border-green-400/30 bg-green-500/10 text-green-200'
                        : 'border-slate-400/30 bg-slate-500/10 text-slate-300'
                    }`}
                  >
                    {company.status}
                  </span>
                </div>

                <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#a9c3d0]">
                  <MapPin className="h-4 w-4 text-[#67d7df]" />

                  {company.location || 'No location set'}

                  <span className="text-[#67d7df]">·</span>

                  {company.vehicleCount}{' '}
                  {company.vehicleCount === 1
                    ? 'vehicle'
                    : 'vehicles'}
                </p>

                <p className="mt-2 break-all text-xs text-[#8db3c5]">
                  Company Admin:{' '}
                  {company.adminEmails || 'Not assigned'}
                </p>

                {company.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-[#a9c3d0]">
                    {company.description}
                  </p>
                )}
              </div>

              {/* COMPANY ACTIONS */}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setError('');
                    setAdminFor(company);
                    setDraft({
                      ...emptyDraft,
                      id: company.id,
                      name: company.name
                    });
                  }}
                  className={outlineButton}
                >
                  <UserPlus className="h-4 w-4" />
                  Add Admin
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setStatus(company)}
                  className={outlineButton}
                >
                  {company.status === 'ACTIVE'
                    ? 'Deactivate'
                    : 'Activate'}
                </button>

                <button
                  type="button"
                  disabled={saving}
                  aria-label={`Edit ${company.name}`}
                  onClick={() => {
                    setError('');
                    setAdminFor(null);
                    setDraft({
                      ...emptyDraft,
                      id: company.id,
                      name: company.name,
                      logo: company.logo,
                      location: company.location,
                      description: company.description
                    });
                  }}
                  className={outlineButton}
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  disabled={saving}
                  aria-label={`Delete ${company.name}`}
                  onClick={() => remove(company)}
                  className="inline-flex items-center justify-center rounded-xl border border-red-400/30 bg-red-500/10 p-2.5 text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ADD / EDIT / ADMIN MODAL */}

      {draft && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="company-form-title"
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/75 p-4 pt-16 sm:pt-24"
        >
          <form
            onSubmit={adminFor ? saveAdmin : save}
            className="w-full max-w-xl rounded-2xl border border-[#285673] bg-[#10324e] p-6 text-white shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <h3
                id="company-form-title"
                className="text-xl font-bold"
              >
                {adminFor
                  ? `Add Admin for ${adminFor.name}`
                  : draft.id
                    ? 'Edit Brand'
                    : 'Add Brand'}
              </h3>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close"
                className="rounded-xl border border-[#285673] p-2 text-[#a9c3d0] transition hover:bg-[#174965] hover:text-white disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5">
              {!adminFor && (
                <>
                  <label className="block text-sm font-semibold">
                    Brand Name *
                    <input
                      required
                      value={draft.name}
                      onChange={event =>
                        set('name', event.target.value)
                      }
                      className={field}
                    />
                  </label>

                  <ImageField
                    label="Brand Logo"
                    value={draft.logo}
                    onChange={value =>
                      set('logo', value)
                    }
                    maxSize={400}
                  />

                  <label className="block text-sm font-semibold">
                    Location
                    <input
                      value={draft.location}
                      onChange={event =>
                        set('location', event.target.value)
                      }
                      placeholder="City or business location"
                      className={field}
                    />
                  </label>

                  <label className="block text-sm font-semibold">
                    Description
                    <textarea
                      rows={3}
                      value={draft.description}
                      onChange={event =>
                        set('description', event.target.value)
                      }
                      className={`${field} resize-y`}
                    />
                  </label>
                </>
              )}

              {(adminFor || !draft.id) && (
                <div className="space-y-5 rounded-xl border border-[#285673] bg-[#09243b] p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#67d7df]">
                    {adminFor
                      ? 'Create Company Admin Login'
                      : 'Company Admin Login (Optional)'}
                  </p>

                  <label className="block text-sm font-semibold">
                    Admin Name
                    <input
                      required={Boolean(adminFor)}
                      value={draft.adminName}
                      onChange={event =>
                        set('adminName', event.target.value)
                      }
                      className={field}
                    />
                  </label>

                  <label className="block text-sm font-semibold">
                    Admin Email
                    <input
                      required={Boolean(adminFor)}
                      type="email"
                      value={draft.adminEmail}
                      onChange={event =>
                        set('adminEmail', event.target.value)
                      }
                      className={field}
                    />
                  </label>

                  <label className="block text-sm font-semibold">
                    Temporary Password (Minimum 8 Characters)
                    <input
                      required={Boolean(adminFor)}
                      type="password"
                      minLength={8}
                      autoComplete="new-password"
                      value={draft.adminPassword}
                      onChange={event =>
                        set('adminPassword', event.target.value)
                      }
                      className={field}
                    />
                  </label>
                </div>
              )}
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
                onClick={closeModal}
                disabled={saving}
                className="rounded-xl border border-[#285673] px-5 py-3 text-sm font-semibold transition hover:bg-[#174965] disabled:opacity-50"
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
                  : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
