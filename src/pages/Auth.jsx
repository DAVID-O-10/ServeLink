import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title={mode === 'login' ? 'Sign in' : 'Create account'} />
      <section className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 pt-28 pb-16">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-[32px] p-8 shadow-xl border border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-black text-gray-800 dark:text-white">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Manage your listings and track quote requests.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {mode === 'register' && (
              <input
                required
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full h-14 px-5 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-900 outline-none focus:border-emerald-500"
              />
            )}
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full h-14 px-5 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-900 outline-none focus:border-emerald-500"
            />
            <input
              required
              type="password"
              placeholder="Password"
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full h-14 px-5 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-900 outline-none focus:border-emerald-500"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-semibold disabled:opacity-70"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {mode === 'login' ? "Don't have an account? " : 'Already registered? '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-emerald-600 font-semibold"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
          <Link to="/" className="block text-center mt-4 text-sm text-gray-400 hover:text-emerald-600">
            Back to home
          </Link>
        </div>
      </section>
    </>
  );
}
