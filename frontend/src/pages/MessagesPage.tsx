
import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock3,
  Inbox,
  Loader2,
  MessageCircle,
  MessageSquare,
  Send,
  UserRound
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';

type MessageStatus = 'OPEN' | 'REPLIED' | 'CLOSED';

interface DealerMessage {
  id: string;
  customerId: string;
  companyId: string;
  dealerId: string;
  dealerName: string;
  companyName: string;
  customerName?: string;
  customerEmail?: string;
  channel?: 'PLATFORM';
  subject: string;
  message: string;
  reply: string;
  status: MessageStatus;
  createdAt: string;
  updatedAt: string;
  repliedAt: string | null;
}

const panel =
  'rounded-2xl border border-[#285673] bg-[#103a58]';

const button =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[#07549a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0875ac] disabled:cursor-not-allowed disabled:opacity-50';

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

function StatusLabel({ status }: { status: MessageStatus }) {
  const colors = {
    OPEN: 'border-amber-400/30 bg-amber-500/10 text-amber-200',
    REPLIED: 'border-green-400/30 bg-green-500/10 text-green-200',
    CLOSED: 'border-slate-400/30 bg-slate-500/10 text-slate-300'
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold ${colors[status]}`}
    >
      {status === 'OPEN'
        ? 'Awaiting Reply'
        : status === 'REPLIED'
          ? 'Replied'
          : 'Closed'}
    </span>
  );
}

export default function MessagesPage() {
  const { user, authLoading } = useAuth();

  const [messages, setMessages] = useState<DealerMessage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const [filter, setFilter] = useState<'ALL' | MessageStatus>('ALL');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const role = user?.role;

  const isCompany = role === 'COMPANY_ADMIN';
  const isCustomer = role === 'CUSTOMER';
  const isAdmin = role === 'SUPER_ADMIN';

  const dashboardPath = isCompany
    ? '/company/dashboard'
    : isAdmin
      ? '/admin/dashboard'
      : '/dashboard';

  const apiPath = isCompany
    ? '/api/messages/company'
    : isAdmin
      ? '/api/messages/platform/admin'
      : '/api/messages/mine';

  const selectedMessage = messages.find(
    item => item.id === selectedId
  );

  const filtered = messages.filter(
    item => filter === 'ALL' || item.status === filter
  );

  const openCount = messages.filter(
    item => item.status === 'OPEN'
  ).length;

  const repliedCount = messages.filter(
    item => item.status === 'REPLIED'
  ).length;

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setLoading(false);
      return;
    }

    let active = true;

    async function loadMessages() {
      setLoading(true);
      setError('');

      try {
        const result = await apiFetch<DealerMessage[]>(apiPath);
        const platformMine = isCustomer
          ? await apiFetch<DealerMessage[]>('/api/messages/platform/mine')
          : [];
        if (!active) return;
        const combined = [...result, ...platformMine].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setMessages(combined);
        setSelectedId(current =>
          current && combined.some(item => item.id === current)
            ? current
            : combined[0]?.id ?? null
        );
      } catch (err) {
        if (!active) return;

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load messages.'
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadMessages();

    return () => {
      active = false;
    };
  }, [apiPath, authLoading, user, isCustomer]);

  useEffect(() => {
    setReply(selectedMessage?.reply || '');
    setNotice('');
  }, [selectedId, selectedMessage?.reply]);

  async function submitReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !(isCompany || isAdmin) ||
      !selectedMessage ||
      reply.trim().length < 2 ||
      saving
    ) {
      return;
    }

    setSaving(true);
    setError('');
    setNotice('');

    try {
      const updated = await apiFetch<DealerMessage>(
        isAdmin
          ? `/api/messages/platform/admin/${selectedMessage.id}/reply`
          : `/api/messages/company/${selectedMessage.id}/reply`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            reply: reply.trim()
          })
        }
      );

      setMessages(current =>
        current.map(item =>
          item.id === updated.id ? updated : item
        )
      );

      setNotice('Reply saved. Signed-in customers can view replies in their Messages.');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save the reply.'
      );
    } finally {
      setSaving(false);
    }
  }

  async function closeInquiry() {
    if (!(isCompany || isAdmin) || !selectedMessage || saving) return;

    setSaving(true);
    setError('');
    setNotice('');

    try {
      const updated = await apiFetch<DealerMessage>(
        isAdmin
          ? `/api/messages/platform/admin/${selectedMessage.id}/close`
          : `/api/messages/company/${selectedMessage.id}/close`,
        { method: 'PATCH' }
      );

      setMessages(current =>
        current.map(item =>
          item.id === updated.id ? updated : item
        )
      );

      setNotice('Inquiry marked as closed.');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to close the inquiry.'
      );
    } finally {
      setSaving(false);
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09243b] text-[#a9c3d0]">
        <Loader2 className="mr-3 h-6 w-6 animate-spin" />
        Checking your account...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#09243b] px-4 py-20 text-center text-white">
        <h1 className="text-2xl font-bold">
          Sign in to view messages
        </h1>

        <Link to="/signin" className={`${button} mt-6`}>
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09243b] text-white">
      <section className="border-b border-[#285673] bg-[#0b2d47] py-10">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <Link
            to={dashboardPath}
            className="mb-6 inline-flex items-center gap-2 rounded-xl border border-[#285673] bg-[#103a58] px-4 py-2.5 text-sm font-semibold hover:border-[#16a7b7]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-[#07549a]/30 p-4">
              <MessageSquare className="h-8 w-8 text-[#67d7df]" />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#67d7df]">
                Trial Your Dream
              </p>

              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                {isCompany
                  ? 'Customer Inquiries'
                  : isAdmin
                    ? 'Platform Messages'
                    : 'My Messages'}
              </h1>

              <p className="mt-3 text-[#a9c3d0]">
                {isCompany
                  ? 'Review inquiries addressed to your company and reply to customers.'
                  : isAdmin
                    ? 'Review messages sent through the About / Contact page. Company showroom conversations are private.'
                    : 'See the inquiries you sent and replies received from company administrators.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: 'Total Inquiries',
              value: messages.length,
              icon: Inbox
            },
            {
              label: 'Awaiting Reply',
              value: openCount,
              icon: Clock3
            },
            {
              label: 'Replied',
              value: repliedCount,
              icon: CheckCircle2
            }
          ].map(item => {
            const Icon = item.icon;

            return (
              <div key={item.label} className={`${panel} p-5`}>
                <Icon className="mb-4 h-7 w-7 text-[#67d7df]" />

                <p className="text-3xl font-bold">
                  {item.value}
                </p>

                <p className="mt-2 text-sm text-[#a9c3d0]">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200"
          >
            {error}
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="mb-6 rounded-xl border border-green-400/30 bg-green-500/10 p-4 text-sm text-green-200"
          >
            {notice}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-24 text-[#a9c3d0]">
            <Loader2 className="h-6 w-6 animate-spin" />
            Loading inquiries...
          </div>
        ) : messages.length === 0 ? (
          <div className={`${panel} p-12 text-center`}>
            <Inbox className="mx-auto h-12 w-12 text-[#67d7df]" />

            <h2 className="mt-5 text-xl font-bold">
              No Inquiries Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#a9c3d0]">
              {isCustomer
                ? 'You have not sent any inquiries yet.'
                : isAdmin ? 'Platform support messages will appear here.' : 'Messages addressed to your company will appear here.'}
            </p>

            {isCustomer && (
              <Link to="/dealers" className={`${button} mt-6`}>
                Browse Dealers
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[350px_minmax(0,1fr)]">
            <section className={`${panel} overflow-hidden`}>
              <div className="border-b border-[#285673] p-4">
                <h2 className="font-bold">
                  Inbox
                </h2>

                <select
                  value={filter}
                  onChange={event =>
                    setFilter(event.target.value as typeof filter)
                  }
                  aria-label="Filter messages"
                  className="mt-3 w-full rounded-xl border border-[#285673] bg-[#09243b] px-3 py-2.5 text-sm text-white outline-none focus:border-[#16a7b7]"
                >
                  <option value="ALL">All Messages</option>
                  <option value="OPEN">Awaiting Reply</option>
                  <option value="REPLIED">Replied</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <div className="max-h-[700px] overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="p-6 text-center text-sm text-[#a9c3d0]">
                    No messages match this filter.
                  </p>
                ) : (
                  filtered.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedId(item.id);
                        setNotice('');
                        setError('');
                      }}
                      className={`block w-full border-b border-[#285673]/60 p-5 text-left transition ${
                        selectedId === item.id
                          ? 'bg-[#07549a]/30'
                          : 'hover:bg-[#174965]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-bold">
                          {item.subject}
                        </p>

                        <MessageCircle className="h-4 w-4 shrink-0 text-[#67d7df]" />
                      </div>

                      <p className="mt-2 text-sm text-[#a9c3d0]">
                        {item.companyName}
                      </p>

                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#8db3c5]">
                        {item.message}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                        <StatusLabel status={item.status} />

                        <span className="text-xs text-[#8db3c5]">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </section>

            <section className={`${panel} min-h-[450px] p-6 sm:p-8`}>
              {!selectedMessage ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-[#a9c3d0]">
                  <MessageSquare className="h-12 w-12 text-[#67d7df]" />
                  <p className="mt-4">
                    Select an inquiry to view its details.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#285673] pb-6">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {selectedMessage.subject}
                      </h2>

                      <p className="mt-3 flex items-center gap-2 text-sm text-[#a9c3d0]">
                        <Building2 className="h-4 w-4 text-[#67d7df]" />
                        {selectedMessage.companyName}
                      </p>

                      <p className="mt-2 text-sm text-[#a9c3d0]">
                        {selectedMessage.channel === 'PLATFORM'
                          ? `From: ${selectedMessage.customerName || 'Visitor'} (${selectedMessage.customerEmail || 'No email'})`
                          : `Showroom: ${selectedMessage.dealerName}`}
                      </p>
                    </div>

                    <StatusLabel status={selectedMessage.status} />
                  </div>

                  <div className="mt-7 space-y-6">
                    <div>
                      <div className="mb-3 flex items-center gap-2 text-sm text-[#8db3c5]">
                        <UserRound className="h-4 w-4" />
                        Customer Message
                        <span className="ml-auto">
                          {formatDate(selectedMessage.createdAt)}
                        </span>
                      </div>

                      <div className="whitespace-pre-wrap break-words rounded-2xl border border-[#285673] bg-[#09243b] p-5 text-sm leading-7 text-[#e0edf2]">
                        {selectedMessage.message}
                      </div>
                    </div>

                    {selectedMessage.reply && (
                      <div>
                        <div className="mb-3 flex items-center gap-2 text-sm text-[#8db3c5]">
                          <MessageSquare className="h-4 w-4" />
                          {selectedMessage.channel === 'PLATFORM' ? 'Platform Support Reply' : 'Company Reply'}

                          {selectedMessage.repliedAt && (
                            <span className="ml-auto">
                              {formatDate(selectedMessage.repliedAt)}
                            </span>
                          )}
                        </div>

                        <div className="whitespace-pre-wrap break-words rounded-2xl border border-[#16a7b7]/40 bg-[#07549a]/20 p-5 text-sm leading-7 text-white">
                          {selectedMessage.reply}
                        </div>
                      </div>
                    )}

                    {(isCompany || isAdmin) &&
                      selectedMessage.status !== 'CLOSED' && (
                        <form
                          onSubmit={submitReply}
                          className="border-t border-[#285673] pt-6"
                        >
                          <label
                            htmlFor="company-reply"
                            className="mb-3 block font-semibold"
                          >
                            Reply to {isAdmin ? 'Visitor / Customer' : 'Customer'}
                          </label>

                          <textarea
                            id="company-reply"
                            value={reply}
                            onChange={event =>
                              setReply(event.target.value)
                            }
                            maxLength={2000}
                            rows={5}
                            placeholder="Write your reply..."
                            className="w-full resize-y rounded-xl border border-[#285673] bg-[#09243b] p-4 text-white placeholder-[#7695a5] outline-none focus:border-[#16a7b7]"
                          />

                          <p className="mt-2 text-right text-xs text-[#8db3c5]">
                            {reply.length}/2000
                          </p>

                          <div className="mt-4 flex flex-wrap gap-3">
                            <button
                              type="submit"
                              disabled={
                                saving || reply.trim().length < 2
                              }
                              className={button}
                            >
                              {saving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Send className="h-4 w-4" />
                              )}

                              Save Reply
                            </button>

                            <button
                              type="button"
                              onClick={() => void closeInquiry()}
                              disabled={saving}
                              className="rounded-xl border border-[#285673] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#174965] disabled:opacity-50"
                            >
                              Close Inquiry
                            </button>
                          </div>
                        </form>
                      )}

                    {selectedMessage.status === 'CLOSED' && (
                      <div className="rounded-xl border border-[#285673] bg-[#09243b] p-4 text-sm text-[#a9c3d0]">
                        This inquiry has been closed.
                      </div>
                    )}
                  </div>
                </>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
