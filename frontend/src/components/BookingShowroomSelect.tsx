
import { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Loader2,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Clock3
} from 'lucide-react';

import { apiFetch } from '../lib/api';

interface Showroom {
  id: string;
  companyId: string;
  companyName: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  openingHours: string;
  active: boolean;
}

interface BookingShowroomSelectProps {
  companyId: string;
  value: string;
  onChange: (showroomId: string) => void;
  disabled?: boolean;
}

export default function BookingShowroomSelect({
  companyId,
  value,
  onChange,
  disabled = false
}: BookingShowroomSelectProps) {
  const [showrooms, setShowrooms] = useState<Showroom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    if (!companyId) {
      setShowrooms([]);
      setLoading(false);
      setError('');
      return;
    }

    async function loadShowrooms() {
      setLoading(true);
      setError('');
      setShowrooms([]);

      try {
        const result = await apiFetch<Showroom[]>(
          '/api/showrooms/public'
        );

        if (!active) return;

        setShowrooms(
          Array.isArray(result)
            ? result.filter(
                showroom =>
                  showroom.companyId === companyId &&
                  showroom.active
              )
            : []
        );
      } catch (reason) {
        if (!active) return;

        setError(
          reason instanceof Error
            ? reason.message
            : 'Unable to load company showrooms.'
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadShowrooms();

    return () => {
      active = false;
    };
  }, [companyId]);

  const selectedShowroom = useMemo(
    () => showrooms.find(showroom => showroom.id === value),
    [showrooms, value]
  );

  useEffect(() => {
    if (!loading && value && !selectedShowroom) {
      onChange('');
    }
  }, [loading, value, selectedShowroom, onChange]);

  if (!companyId) {
    return (
      <div className="rounded-xl border border-[#285673] bg-[#103a58] p-5 text-sm text-[#a9c3d0]">
        Select a vehicle to see available showrooms.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-[#285673] bg-[#103a58] p-5 text-sm text-[#a9c3d0]">
        <Loader2 className="h-5 w-5 animate-spin text-[#67d7df]" />
        Loading company showrooms...
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="flex items-start gap-3 rounded-xl border border-red-400/30 bg-red-500/10 p-5 text-sm text-red-200"
      >
        <AlertCircle className="h-5 w-5 shrink-0" />
        {error}
      </div>
    );
  }

  if (showrooms.length === 0) {
    return (
      <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-6">
        <div className="flex items-start gap-3">
          <Building2 className="h-6 w-6 shrink-0 text-amber-300" />

          <div>
            <h3 className="font-semibold text-white">
              No Active Showrooms Available
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#d6e4ea]">
              This company has not published an active
              showroom yet. Please choose another vehicle
              or check again after the company adds a location.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="booking-showroom"
          className="mb-3 block text-sm font-semibold text-white"
        >
          Select Company Showroom *
        </label>

        <select
          id="booking-showroom"
          value={value}
          disabled={disabled}
          onChange={event =>
            onChange(event.target.value)
          }
          required
          className="w-full rounded-xl border border-[#285673] bg-[#09243b] px-4 py-3 text-sm text-white outline-none focus:border-[#16a7b7] disabled:opacity-50"
        >
          <option value="">
            Choose a showroom
          </option>

          {showrooms.map(showroom => (
            <option
              key={showroom.id}
              value={showroom.id}
            >
              {showroom.name} — {showroom.city}
            </option>
          ))}
        </select>
      </div>

      {selectedShowroom && (
        <div className="rounded-xl border border-[#16a7b7]/40 bg-[#103a58] p-5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[#67d7df]" />

            <h3 className="font-semibold text-white">
              {selectedShowroom.name}
            </h3>
          </div>

          <p className="mt-2 text-xs font-semibold text-[#67d7df]">
            {selectedShowroom.companyName}
          </p>

          <div className="mt-4 flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#67d7df]" />

            <p className="text-sm leading-6 text-[#d6e4ea]">
              {selectedShowroom.address},{' '}
              {selectedShowroom.city},{' '}
              {selectedShowroom.state}
              {selectedShowroom.pincode
                ? ` - ${selectedShowroom.pincode}`
                : ''}
            </p>
          </div>

          {selectedShowroom.openingHours && (
            <div className="mt-3 flex items-start gap-3">
              <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#67d7df]" />

              <p className="text-sm text-[#d6e4ea]">
                {selectedShowroom.openingHours}
              </p>
            </div>
          )}

          <p className="mt-4 text-xs text-[#8db3c5]">
            Selecting this showroom does not confirm a
            booking or guarantee slot availability.
          </p>
        </div>
      )}
    </div>
  );
}
