
import { useState } from 'react';
import {
  Download,
  Loader2,
  Mail,
  ShieldCheck,
  UserRound
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../lib/api';

interface CompanyBooking {
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleName: string;
  showroom: string;
  date: string;
  time: string;
  bookingFee: number;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

const panelClass =
  'rounded-2xl border border-[#285673] bg-[#103a58] p-6';

function csvCell(value: unknown): string {
  let text = String(value ?? '');

  // Prevent spreadsheet programs from interpreting
  // user-provided data as formulas.
  if (/^[\s]*[=+\-@\t\r]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

export default function CompanyAccountTools() {
  const { user } = useAuth();

  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function exportBookings() {
    if (exporting) return;

    setExporting(true);
    setError('');
    setSuccess('');

    try {
      const bookings = await apiFetch<CompanyBooking[]>(
        '/api/bookings/company'
      );

      if (!Array.isArray(bookings)) {
        throw new Error('Unexpected booking response.');
      }

      const headers = [
        'Booking ID',
        'Customer Name',
        'Customer Email',
        'Customer Phone',
        'Vehicle',
        'Showroom',
        'Appointment Date',
        'Appointment Time',
        'Booking Fee',
        'Payment Status',
        'Booking Status',
        'Created At'
      ];

      const rows = bookings.map(booking => [
        booking.bookingCode,
        booking.customerName,
        booking.customerEmail,
        booking.customerPhone,
        booking.vehicleName,
        booking.showroom,
        booking.date,
        booking.time,
        booking.bookingFee,
        booking.paymentStatus,
        booking.status,
        booking.createdAt
      ]);

      const csv = [
        headers.map(csvCell).join(','),
        ...rows.map(row => row.map(csvCell).join(','))
      ].join('\r\n');

      const blob = new Blob(
        ['\uFEFF', csv],
        { type: 'text/csv;charset=utf-8;' }
      );

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');

      anchor.href = url;
      anchor.download = `company-bookings-${
        new Date().toISOString().slice(0, 10)
      }.csv`;

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(url);

      setSuccess(
        `Exported ${bookings.length} booking record${
          bookings.length === 1 ? '' : 's'
        }.`
      );
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to export booking records.'
      );
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6 text-white">

      <section className={panelClass}>
        <div className="mb-6 flex items-center gap-3">
          <UserRound className="h-6 w-6 text-[#67d7df]" />

          <h2 className="text-xl font-bold">
            Administrator Account
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-[#285673] bg-[#09243b] p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#8db3c5]">
              Account Name
            </p>

            <p className="mt-2 font-semibold">
              {user?.name || 'Not available'}
            </p>
          </div>

          <div className="rounded-xl border border-[#285673] bg-[#09243b] p-5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#8db3c5]">
              <Mail className="h-4 w-4" />
              Account Email
            </p>

            <p className="mt-2 break-all font-semibold">
              {user?.email || 'Not available'}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#285673] bg-[#09243b] p-4">
          <ShieldCheck className="h-5 w-5 shrink-0 text-[#67d7df]" />

          <div>
            <p className="font-semibold">
              Company Administrator
            </p>

            <p className="mt-1 text-sm leading-6 text-[#a9c3d0]">
              Your company account controls which
              booking records and company settings
              you can access.
            </p>
          </div>
        </div>
      </section>

      <section className={panelClass}>
        <div className="flex items-start gap-3">
          <Download className="h-6 w-6 shrink-0 text-[#67d7df]" />

          <div>
            <h2 className="text-xl font-bold">
              Export Booking Data
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#a9c3d0]">
              Download booking records belonging
              to your company as a CSV file.
              You can open it in Excel.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void exportBookings()}
          disabled={exporting}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#07549a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0875ac] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {exporting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Download className="h-5 w-5" />
          )}

          {exporting
            ? 'Preparing Export...'
            : 'Download Bookings CSV'}
        </button>

        <p className="mt-4 text-xs leading-5 text-[#8db3c5]">
          Exported files contain customer contact
          information. Store and share them securely.
        </p>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200"
          >
            {error}
          </p>
        )}

        {success && (
          <p
            role="status"
            className="mt-4 rounded-xl border border-green-400/30 bg-green-500/10 p-4 text-sm text-green-200"
          >
            {success}
          </p>
        )}
      </section>
    </div>
  );
}
