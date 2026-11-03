import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { gsap } from 'gsap';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Car,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignInPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate(result.user.role === 'SUPER_ADMIN'
          ? '/admin/dashboard'
          : result.user.role === 'COMPANY_ADMIN'
            ? '/company/dashboard'
            : '/dashboard', { replace: true });
      } else {
        setError(result.reason === 'PROFILE_UNAVAILABLE'
          ? 'Your account is missing its platform profile. Please contact an administrator.'
          : 'Invalid email or password');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09243b] pt-20 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Info */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#07549a]/20 to-[#16a7b7]/20 rounded-3xl blur-2xl" />
              <div className="relative p-8 rounded-3xl bg-[#103a58]/50 border border-[#285673]/50">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#07549a] to-[#16a7b7] flex items-center justify-center">
                    <Car className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <img src="/images/trial-your-dream-logo.svg" alt="Trial Your Dream" className="h-14 w-auto" />
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-[#f8fafc] mb-6">
                  Welcome Back to <span className="text-[#07549a]">Trial</span>
                </h3>

                <p className="text-[#a9c3d0] mb-8">
                  Sign in to access your bookings, manage test rides, and explore the latest vehicles from top brands.
                </p>

                <div className="space-y-4">
                  {[
                    'Book test rides with official dealers',
                    'Track your booking status',
                    'Get exclusive offers and updates',
                    'Manage your vehicle preferences',
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#22c55e] flex-shrink-0" />
                      <span className="text-[#d6e4ea]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="relative">
            <div className="p-8 rounded-3xl bg-[#103a58] border border-[#285673]/50">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-[#f8fafc] mb-2">Sign In</h1>
                <p className="text-[#a9c3d0]">
                  Don&apos;t have an account?{' '}
                  <Link to="/signup" className="text-[#07549a] hover:underline font-medium">
                    Sign Up
                  </Link>
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-[#a9c3d0] mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7695a5]" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your@email.com"
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#09243b] border border-[#285673] text-[#f8fafc] placeholder-[#7695a5] focus:outline-none focus:border-[#07549a] transition-colors"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-[#a9c3d0] mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7695a5]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your password"
                      className="w-full pl-12 pr-12 py-4 rounded-xl bg-[#09243b] border border-[#285673] text-[#f8fafc] placeholder-[#7695a5] focus:outline-none focus:border-[#07549a] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7695a5] hover:text-[#a9c3d0] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-[#285673] bg-[#09243b] text-[#07549a] focus:ring-[#07549a]"
                    />
                    <span className="text-sm text-[#a9c3d0]">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-[#07549a] hover:underline">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#07549a] to-[#06457c] rounded-xl text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
