import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Phone,
  ArrowRight,
  Car,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
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
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (!formData.agreeTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await signup(formData.name, formData.email, formData.phone, formData.password);
      if (result.success) {
        navigate('/login?registered=1');
      } else {
        setError(result.message);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (password: string): { strength: number; text: string; color: string } => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { text: 'Very Weak', color: 'bg-red-500' },
      { text: 'Weak', color: 'bg-orange-500' },
      { text: 'Fair', color: 'bg-yellow-500' },
      { text: 'Good', color: 'bg-blue-500' },
      { text: 'Strong', color: 'bg-green-500' },
    ];

    return { strength, text: levels[strength]?.text || 'Very Weak', color: levels[strength]?.color || 'bg-red-500' };
  };

  const strength = passwordStrength(formData.password);

  return (
    <div className="min-h-screen bg-[#09243b] pt-20 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  Join <span className="text-[#07549a]">Trial</span> Today
                </h3>

                <p className="text-[#a9c3d0] mb-8">
                  Create your free account and start booking test rides with official dealers across Chennai.
                </p>

                <div className="space-y-4">
                  {[
                    'Free account creation',
                    'Book unlimited test rides',
                    'Get priority slot confirmation',
                    'Exclusive deals and offers',
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
                <h1 className="text-2xl font-bold text-[#f8fafc] mb-2">Create Account</h1>
                <p className="text-[#a9c3d0]">
                  Already have an account?{' '}
                  <Link to="/signin" className="text-[#07549a] hover:underline font-medium">
                    Sign In
                  </Link>
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-[#a9c3d0] mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7695a5]" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#09243b] border border-[#285673] text-[#f8fafc] placeholder-[#7695a5] focus:outline-none focus:border-[#07549a] transition-colors"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

                  <div>
                    <label className="block text-sm font-medium text-[#a9c3d0] mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7695a5]" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="+91 98765 43210"
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#09243b] border border-[#285673] text-[#f8fafc] placeholder-[#7695a5] focus:outline-none focus:border-[#07549a] transition-colors"
                      />
                    </div>
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
                      placeholder="Create a password"
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
                  
                  {/* Password Strength */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-1.5 bg-[#285673] rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${strength.color} transition-all duration-300`}
                            style={{ width: `${(strength.strength + 1) * 20}%` }}
                          />
                        </div>
                        <span className="text-xs text-[#7695a5]">{strength.text}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-[#a9c3d0] mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7695a5]" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      placeholder="Confirm your password"
                      className="w-full pl-12 pr-12 py-4 rounded-xl bg-[#09243b] border border-[#285673] text-[#f8fafc] placeholder-[#7695a5] focus:outline-none focus:border-[#07549a] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7695a5] hover:text-[#a9c3d0] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      className="w-5 h-5 mt-0.5 rounded border-[#285673] bg-[#09243b] text-[#07549a] focus:ring-[#07549a]"
                    />
                    <span className="text-sm text-[#a9c3d0]">
                      I agree to the{' '}
                      <Link to="/contact" className="text-[#07549a] hover:underline">Terms of Service</Link>
                      {' '}and{' '}
                      <Link to="/contact" className="text-[#07549a] hover:underline">Privacy Policy</Link>
                    </span>
                  </label>
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
                      Create Account
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

export default SignUpPage;
