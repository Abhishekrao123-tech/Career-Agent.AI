import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Compass, UserPlus, ArrowRight } from 'lucide-react';

export const RegisterPage = ({ onSwitchToLogin, onSuccess }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 border border-gray-800 space-y-6 shadow-glow-indigo">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 p-0.5 shadow-glow-indigo mx-auto flex items-center justify-center">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Create Student Account</h2>
          <p className="text-xs text-gray-400">Join AI Career Roadmap Agent to accelerate your career</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Johnson"
              className="w-full px-4 py-3 rounded-xl bg-dark-bg border border-gray-700 text-sm text-white focus:border-brand-500 focus:outline-none placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@university.edu"
              className="w-full px-4 py-3 rounded-xl bg-dark-bg border border-gray-700 text-sm text-white focus:border-brand-500 focus:outline-none placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-dark-bg border border-gray-700 text-sm text-white focus:border-brand-500 focus:outline-none placeholder-gray-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-glow-indigo transition-all flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Creating Account...' : 'Register & Start'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-gray-400">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-brand-accent font-semibold hover:underline"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
