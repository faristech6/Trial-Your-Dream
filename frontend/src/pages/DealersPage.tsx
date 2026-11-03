
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock3,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  Send,
  X
} from 'lucide-react';

import { apiFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface PublicShowroom {
  id: string;
  companyId: string;
  companyName: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactEmail: string;
  contactPhone: string;
  openingHours: string;
  active: boolean;
}

const container =
  'mx-auto w-full max-w-[1450px] px-4 sm:px-6 lg:px-10';

const primaryButton =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[#07549a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0875ac] disabled:cursor-not-allowed disabled:opacity-50';

const inputClass =
  'w-full rounded-xl border border-[#285673] bg-[#09243b] px-4 py-3 text-sm text-white placeholder-[#8db3c5] outline-none transition focus:border-[#16a7b7]';

export default function DealersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showrooms, setShowrooms] = useState<PublicShowroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');

  const [selectedShowroom, setSelectedShowroom] =
    useState<PublicShowroom | null>(null);

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;

    async function loadShowrooms() {
      setLoading(true);

      try {
        const response = await apiFetch<PublicShowroom[]>(
          '/api/showrooms/public'
        );

        if (!active) return;

        setShowrooms(
          Array.isArray(response) ? response : []
        );
        setError('');
      } catch (reason) {
        if (!active) return;

        setError(
          reason instanceof Error
            ? reason.message
            : 'Unable to load showroom directory.'
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadShowrooms();

    return () => {
      active = false;
    };
  }, []);

  const brands = useMemo(() => {
    return Array.from(
      new Set(
        showrooms.map(showroom => showroom.companyName)
      )
    )
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }, [showrooms]);

  const filteredShowrooms = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return showrooms.filter(showroom => {
      const matchesBrand =
        selectedBrand === 'all' ||
        showroom.companyName === selectedBrand;

      const content = [
        showroom.name,
        showroom.companyName,
        showroom.address,
        showroom.city,
        showroom.state,
        showroom.pincode
      ]
        .join(' ')
        .toLowerCase();

      return matchesBrand && content.includes(keyword);
    });
  }, [showrooms, search, selectedBrand]);

  function closeModal() {
    if (sending) return;

    setSelectedShowroom(null);
    setSubject('');
    setMessage('');
    setMessageError('');
  }

  function openContact(showroom: PublicShowroom) {
    setSuccess('');
    setMessageError('');

    if (!user) {
      navigate(
        `/signin?returnTo=${encodeURIComponent('/dealers')}`
      );
      return;
    }

    if (user.role !== 'CUSTOMER') {
      setMessageError(
        'Only customer accounts can send showroom inquiries.'
      );
      return;
    }

    setSelectedShowroom(showroom);
    setSubject(`Inquiry about ${showroom.name}`);
    setMessage('');
  }

  async function sendInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedShowroom || sending) return;

    setSending(true);
    setMessageError('');
    setSuccess('');

    try {
      await apiFetch('/api/messages', {
        method: 'POST',
        body: JSON.stringify({
          companyId: selectedShowroom.companyId,
          dealerId: selectedShowroom.id,
          dealerName: selectedShowroom.name,
          subject: subject.trim(),
          message: message.trim()
        })
      });

      setSuccess(
        `Your inquiry to ${selectedShowroom.name} was saved successfully. You can view replies in your Messages dashboard.`
      );

      setSelectedShowroom(null);
      setSubject('');
      setMessage('');
    } catch (reason) {
      setMessageError(
        reason instanceof Error
          ? reason.message
          : 'Unable to send inquiry.'
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#09243b] pb-20 text-white">

      {/* PAGE HEADER */}

      <section className="border-b border-[#285673] bg-[#0b2d47] py-12">
        <div className={container}>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#67d7df] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <p className="mt-8 text-xs font-bold uppercase tracking-widest text-[#67d7df]">
            Showroom Directory
          </p>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Find a Showroom
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-[#a9c3d0]">
            Explore showroom locations provided by registered
            company accounts and send inquiries through
            Trial Your Dream.
          </p>
        </div>
      </section>

      <div className={`${container} pt-9`}>

        {/* SEARCH AND FILTERS */}

        <div className="grid gap-4 rounded-2xl border border-[#285673] bg-[#103a58] p-5 md:grid-cols-[1fr_240px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8db3c5]" />

            <input
              type="search"
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search showrooms, cities, or locations..."
              className={`${inputClass} pl-12`}
              aria-label="Search showrooms"
            />
          </div>

          <select
            value={selectedBrand}
            onChange={event =>
              setSelectedBrand(event.target.value)
            }
            className={inputClass}
            aria-label="Filter by brand"
          >
            <option value="all">All Brands</option>

            {brands.map(brand => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* FEEDBACK */}

        {success && (
          <div
            role="status"
            className="mt-6 rounded-xl border border-green-400/30 bg-green-500/10 p-5 text-sm text-green-200"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0" />

              <div>
                <p>{success}</p>

                <Link
                  to="/dashboard/messages"
                  className="mt-3 inline-block font-semibold underline"
                >
                  View My Messages
                </Link>
              </div>
            </div>
          </div>
        )}

        {messageError && !selectedShowroom && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200"
          >
            {messageError}
          </div>
        )}

        <div className="mb-7 mt-8 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold">
            Available Showroom Listings
          </h2>

          {!loading && (
            <span className="text-sm text-[#a9c3d0]">
              {filteredShowrooms.length}{' '}
              {filteredShowrooms.length === 1
                ? 'showroom'
                : 'showrooms'}
            </span>
          )}
        </div>

        {/* SHOWROOM CARDS */}

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-24 text-[#a9c3d0]">
            <Loader2 className="h-6 w-6 animate-spin text-[#67d7df]" />
            Loading showrooms...
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-400/30 bg-red-500/10 p-8 text-center text-red-200"
          >
            {error}
          </div>
        ) : filteredShowrooms.length === 0 ? (
          <div className="rounded-2xl border border-[#285673] bg-[#103a58] p-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-[#67d7df]" />

            <h3 className="mt-5 text-xl font-bold">
              No Showrooms Found
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#a9c3d0]">
              {showrooms.length === 0
                ? 'No company has published an active showroom yet. Company Admins can add showrooms from their dashboards.'
                : 'No showrooms match your search. Try another city or brand.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredShowrooms.map(showroom => (
              <article
                key={showroom.id}
                className="flex flex-col rounded-2xl border border-[#285673]/70 bg-[#103a58] p-6 transition hover:border-[#16a7b7]/70"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#07549a]/30">
                    <Building2 className="h-7 w-7 text-[#67d7df]" />
                  </div>

                  <span className="rounded-full border border-[#16a7b7]/40 bg-[#16a7b7]/10 px-3 py-1 text-xs font-semibold text-[#67d7df]">
                    Active Listing
                  </span>
                </div>

                <p className="mt-6 text-sm font-semibold text-[#67d7df]">
                  {showroom.companyName}
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  {showroom.name}
                </h3>

                <div className="mt-5 space-y-4 text-sm text-[#c8dce6]">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#67d7df]" />

                    <p className="leading-6">
                      {showroom.address}, {showroom.city},{' '}
                      {showroom.state}
                      {showroom.pincode
                        ? ` - ${showroom.pincode}`
                        : ''}
                    </p>
                  </div>

                  {showroom.openingHours && (
                    <div className="flex items-start gap-3">
                      <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#67d7df]" />

                      <p>{showroom.openingHours}</p>
                    </div>
                  )}

                  {showroom.contactEmail && (
                    <div className="flex items-start gap-3">
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#67d7df]" />

                      <p className="break-all">
                        {showroom.contactEmail}
                      </p>
                    </div>
                  )}

                  {showroom.contactPhone && (
                    <div className="flex items-start gap-3">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#67d7df]" />

                      <p>{showroom.contactPhone}</p>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-7">
                  <button
                    type="button"
                    onClick={() => openContact(showroom)}
                    className={`${primaryButton} w-full`}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Contact Showroom
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* INFORMATION */}

        <div className="mt-10 rounded-xl border border-[#285673] bg-[#0b2d47] p-5 text-sm leading-7 text-[#a9c3d0]">
          Showroom information is entered by company
          administrators and has not been independently verified.
          Inquiries are delivered to company accounts within
          Trial Your Dream, not automatically sent as emails
          or SMS messages.
        </div>
      </div>

      {/* CONTACT MODAL */}

      {selectedShowroom && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-showroom-heading"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/75 p-4"
        >
          <form
            onSubmit={event => void sendInquiry(event)}
            className="w-full max-w-xl rounded-2xl border border-[#285673] bg-[#10324e] p-6 text-white shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#67d7df]">
                  Contact Company
                </p>

                <h2
                  id="contact-showroom-heading"
                  className="mt-2 text-2xl font-bold"
                >
                  {selectedShowroom.name}
                </h2>

                <p className="mt-2 text-sm text-[#a9c3d0]">
                  {selectedShowroom.companyName}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={sending}
                aria-label="Close contact form"
                className="rounded-lg border border-[#285673] p-2 hover:bg-[#174965] disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-7 space-y-5">
              <label className="block text-sm font-semibold">
                Subject
                <input
                  required
                  maxLength={150}
                  value={subject}
                  onChange={event =>
                    setSubject(event.target.value)
                  }
                  className={`${inputClass} mt-2`}
                />
              </label>

              <label className="block text-sm font-semibold">
                Your Message
                <textarea
                  required
                  rows={5}
                  maxLength={3000}
                  value={message}
                  onChange={event =>
                    setMessage(event.target.value)
                  }
                  placeholder="Write your question about this showroom..."
                  className={`${inputClass} mt-2 resize-y`}
                />
              </label>
            </div>

            {messageError && (
              <div
                role="alert"
                className="mt-5 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200"
              >
                {messageError}
              </div>
            )}

            <div className="mt-7 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                disabled={sending}
                onClick={closeModal}
                className="rounded-xl border border-[#285673] px-5 py-3 text-sm font-semibold hover:bg-[#174965] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  sending ||
                  !subject.trim() ||
                  !message.trim()
                }
                className={primaryButton}
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}

                {sending ? 'Sending...' : 'Send Inquiry'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
