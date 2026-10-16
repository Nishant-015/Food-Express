import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { UtensilsCrossed, Lock, Mail, ArrowRight, Sparkles, User, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const from = location.state?.from?.pathname || '/restaurants';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setFormError('Please enter both email and password');
      return;
    }

    try {
      setSubmitting(true);
      setFormError('');
      const res = await login(formData);
      success('Logged in successfully!');

      const userRole = res.data?.user?.role;
      if (userRole === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (userRole === 'restaurant_owner') {
        navigate('/owner/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setFormError(err.formattedMessage || 'Invalid email or password');
      error(err.formattedMessage || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Demo auto-fill helper
  const fillDemoAccount = (role) => {
    if (role === 'admin') {
      setFormData({ email: 'admin@example.com', password: 'AdminPass123!' });
    } else if (role === 'owner') {
      setFormData({ email: 'owner@example.com', password: 'Password123!' });
    } else {
      setFormData({ email: 'customer@example.com', password: 'Password123!' });
    }
    setFormError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-primary-500/20">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Enter your credentials to access your FoodieExpress account
          </p>
        </div>

        {/* Demo Fast Login Pills */}
        <div className="bg-orange-50/70 border border-orange-200/60 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary-800">
            <Sparkles className="w-3.5 h-3.5 text-primary-600" />
            <span>Instant Demo Logins:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('customer')}
              className="py-1.5 px-2 bg-white rounded-xl text-[11px] font-bold text-gray-700 hover:text-primary-600 hover:border-primary-300 border border-gray-200 shadow-xs transition"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('owner')}
              className="py-1.5 px-2 bg-white rounded-xl text-[11px] font-bold text-gray-700 hover:text-primary-600 hover:border-primary-300 border border-gray-200 shadow-xs transition"
            >
              Owner
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin')}
              className="py-1.5 px-2 bg-white rounded-xl text-[11px] font-bold text-gray-700 hover:text-primary-600 hover:border-primary-300 border border-gray-200 shadow-xs transition"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Form Error Banner */}
        {formError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {formError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-primary-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
