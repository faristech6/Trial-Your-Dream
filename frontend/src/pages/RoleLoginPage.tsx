import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, CarFront, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import { useAuth, type User } from '../context/AuthContext';

const config: Record<User['role'], { title: string; eyebrow: string; hint: string; icon: typeof CarFront; email: string }> = {
  CUSTOMER: { title: 'Your next drive starts here.', eyebrow: 'Customer access', hint: 'Browse inventory, reserve a slot, and keep every trial in one place.', icon: UserRound, email: 'you@example.com' },
  COMPANY_ADMIN: { title: 'Run your showroom network.', eyebrow: 'Company workspace', hint: 'Use the organization credentials issued by the platform administrator.', icon: Building2, email: 'admin@company.com' },
  SUPER_ADMIN: { title: 'See the whole platform.', eyebrow: 'Platform control', hint: 'Monitor companies, inventory, bookings, and marketplace health.', icon: ShieldCheck, email: 'superadmin@trial.com' },
};

export default function RoleLoginPage({ role }: { role: User['role'] }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const content = config[role];
  const Icon = content.icon;
  const registered = new URLSearchParams(location.search).get('registered') === '1';

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setLoading(true); setError('');
    const result = await login(email, password, role);
    if (!result.success) {
      setError(result.reason === 'WRONG_ROLE'
        ? `This account is not configured for ${content.eyebrow.toLowerCase()}.`
        : result.reason === 'PROFILE_UNAVAILABLE'
          ? 'Your account is missing its platform profile. Please contact an administrator.'
          : 'We could not verify those details.');
    }
    else navigate(result.user.role === 'SUPER_ADMIN' ? '/admin/dashboard' : result.user.role === 'COMPANY_ADMIN' ? '/company/dashboard' : '/dashboard', { replace: true });
    setLoading(false);
  };

  return <div className="grid min-h-screen bg-[#12324d] pt-20 text-white lg:grid-cols-[1.05fr_.95fr]"><div className="relative hidden overflow-hidden p-12 lg:flex lg:flex-col lg:justify-between"><div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(135deg, rgba(210,106,50,.35), transparent 55%), url(/images/hero-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} /><div className="relative"><Link to="/" className="flex items-center gap-2 text-lg font-bold"><CarFront className="h-7 w-7 text-[#e69260]" /> TRIAL<span className="text-[#e69260]">.</span></Link></div><div className="relative max-w-lg"><p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#e69260]">{content.eyebrow}</p><h1 className="text-5xl font-semibold leading-tight">{content.title}</h1><p className="mt-5 text-lg leading-8 text-[#b9c2ca]">{content.hint}</p></div><p className="relative text-sm text-[#83909c]">One platform. Every showroom experience.</p></div><div className="flex items-center justify-center bg-[#f6f7f9] px-4 py-12 text-[#12324d]"><div className="w-full max-w-md"><div className="mb-8 lg:hidden"><Link to="/" className="flex items-center gap-2 text-lg font-bold"><CarFront className="h-7 w-7 text-[#07549a]" /> TRIAL<span className="text-[#07549a]">.</span></Link></div><div className="rounded-2xl border border-[#e1e5e9] bg-white p-7 shadow-sm sm:p-9"><div className="mb-8"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff1eb] text-[#07549a]"><Icon className="h-6 w-6" /></div><h2 className="text-2xl font-semibold">Sign in to continue</h2><p className="mt-2 text-sm text-[#66717f]">{content.eyebrow}</p></div>{registered && <p className="mb-4 rounded-lg bg-[#eaf5f1] px-4 py-3 text-sm text-[#236752]">Account created. Check your email to confirm it, then sign in.</p>}{error && <p className="mb-4 rounded-lg bg-[#fff1eb] px-4 py-3 text-sm text-[#06457c]">{error}</p>}<form onSubmit={submit} className="space-y-5"><label className="block text-sm font-semibold">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={content.email} className="mt-2 w-full rounded-xl border border-[#dfe3e7] px-4 py-3.5 font-normal outline-none focus:border-[#07549a]" /></label><label className="block text-sm font-semibold">Password<div className="relative mt-2"><LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#87919c]" /><input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" className="w-full rounded-xl border border-[#dfe3e7] py-3.5 pl-11 pr-4 font-normal outline-none focus:border-[#07549a]" /></div></label><button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#07549a] px-5 py-3.5 font-bold text-white transition hover:bg-[#06457c] disabled:opacity-60">{loading ? 'Signing in...' : 'Sign in'} {!loading && <ArrowRight className="h-4 w-4" />}</button></form><div className="mt-6 border-t border-[#edf0f2] pt-5 text-center text-sm text-[#66717f]">{role === 'CUSTOMER' ? <>New here? <Link to="/signup" className="font-bold text-[#07549a]">Create an account</Link></> : role === 'COMPANY_ADMIN' ? 'Company accounts are issued by the platform administrator.' : 'Platform access is restricted to the developer administrator.'}</div></div></div></div></div>;
}