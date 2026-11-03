
import {
  useEffect,
  useState,
  type FormEvent
} from 'react';

import {
  Building2,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import { apiFetch } from '../../lib/api';
import CompanyAccountTools from './CompanyAccountTools';

interface CompanySettingsData {
  id: string;
  name: string;
  status: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  address: string;
  city: string;
  state: string;
}

const emptyCompany: CompanySettingsData = {
  id: '',
  name: '',
  status: '',
  description: '',
  contactEmail: '',
  contactPhone: '',
  website: '',
  address: '',
  city: '',
  state: ''
};

const inputClass =
  'w-full rounded-xl border border-[#285673] bg-[#09243b] px-4 py-3 text-white placeholder-[#7695a5] outline-none focus:border-[#16a7b7]';

export default function CompanySettings() {
  const [company, setCompany] =
    useState<CompanySettingsData>(emptyCompany);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;

    async function loadCompany() {
      try {
        const result =
          await apiFetch<CompanySettingsData>(
            '/api/company-settings'
          );

        if (active) {
          setCompany(result);
        }
      } catch (reason) {
        if (active) {
          setError(
            reason instanceof Error
              ? reason.message
              : 'Unable to load company settings.'
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadCompany();

    return () => {
      active = false;
    };
  }, []);

  function update(
    field: keyof CompanySettingsData,
    value: string
  ) {
    setCompany(previous => ({
      ...previous,
      [field]: value
    }));

    setError('');
    setSuccess('');
  }

  async function saveSettings(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiFetch<{
        message: string;
        company: CompanySettingsData;
      }>('/api/company-settings', {
        method: 'PATCH',
        body: JSON.stringify({
          name: company.name,
          description: company.description,
          contactEmail: company.contactEmail,
          contactPhone: company.contactPhone,
          website: company.website,
          address: company.address,
          city: company.city,
          state: company.state
        })
      });

      setCompany(response.company);
      setSuccess(response.message);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to save company settings.'
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 rounded-2xl border border-[#285673] bg-[#103a58] p-16 text-[#a9c3d0]">
        <Loader2 className="h-6 w-6 animate-spin" />
        Loading settings...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white">
      <section className="rounded-2xl border border-[#285673] bg-[#103a58] p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-[#07549a]/30 p-4">
            <Building2 className="h-7 w-7 text-[#67d7df]" />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              Company Settings
            </h2>

            <p className="mt-2 text-sm text-[#a9c3d0]">
              Update your company profile and contact information.
            </p>
          </div>
        </div>

        {company.id && (
          <div className="mt-6 rounded-xl border border-[#285673] bg-[#09243b] p-4 text-sm">
            <span className="text-[#a9c3d0]">
              Account Status:
            </span>{' '}
            <span className="font-semibold text-[#67d7df]">
              {company.status || 'Unknown'}
            </span>
          </div>
        )}
      </section>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-red-200"
        >
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-green-400/30 bg-green-500/10 p-4 text-green-200"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          {success}
        </div>
      )}

      <form
        onSubmit={saveSettings}
        className="space-y-6 rounded-2xl border border-[#285673] bg-[#103a58] p-6"
      >
        <h3 className="text-lg font-bold">
          Company Information
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="block text-sm font-semibold">
            Company Name *
            <input
              required
              maxLength={120}
              value={company.name}
              onChange={event =>
                update('name', event.target.value)
              }
              className={`${inputClass} mt-2`}
            />
          </label>

          <label className="block text-sm font-semibold">
            Contact Email
            <input
              type="email"
              maxLength={160}
              value={company.contactEmail}
              onChange={event =>
                update('contactEmail', event.target.value)
              }
              className={`${inputClass} mt-2`}
            />
          </label>

          <label className="block text-sm font-semibold">
            Contact Phone
            <input
              type="tel"
              maxLength={30}
              value={company.contactPhone}
              onChange={event =>
                update('contactPhone', event.target.value)
              }
              className={`${inputClass} mt-2`}
            />
          </label>

          <label className="block text-sm font-semibold">
            Website
            <input
              type="url"
              maxLength={300}
              value={company.website}
              onChange={event =>
                update('website', event.target.value)
              }
              placeholder="https://example.com"
              className={`${inputClass} mt-2`}
            />
          </label>

          <label className="block text-sm font-semibold md:col-span-2">
            Company Description
            <textarea
              rows={5}
              maxLength={2000}
              value={company.description}
              onChange={event =>
                update('description', event.target.value)
              }
              placeholder="Describe your company..."
              className={`${inputClass} mt-2 resize-y`}
            />
          </label>
        </div>

        <div className="border-t border-[#285673] pt-6">
          <h3 className="mb-5 text-lg font-bold">
            Company Address
          </h3>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block text-sm font-semibold md:col-span-2">
              Address
              <input
                maxLength={300}
                value={company.address}
                onChange={event =>
                  update('address', event.target.value)
                }
                className={`${inputClass} mt-2`}
              />
            </label>

            <label className="block text-sm font-semibold">
              City
              <input
                maxLength={100}
                value={company.city}
                onChange={event =>
                  update('city', event.target.value)
                }
                className={`${inputClass} mt-2`}
              />
            </label>

            <label className="block text-sm font-semibold">
              State
              <input
                maxLength={100}
                value={company.state}
                onChange={event =>
                  update('state', event.target.value)
                }
                className={`${inputClass} mt-2`}
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end border-t border-[#285673] pt-6">
          <button
            type="submit"
            disabled={saving || !company.name.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#07549a] px-6 py-3 font-semibold text-white hover:bg-[#0875ac] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}

            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
      <CompanyAccountTools />
    </div>
  );
}
