'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: demoPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Demo login failed');
      router.push(data.user.role === 'ADMIN' ? '/admin' : '/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center space-x-2">
          <div className="w-12 h-12 rounded-full bg-royal-maroon flex items-center justify-center text-[#E8D390] text-2xl border border-[#C9A44C] shadow-royal">
            🪔
          </div>
          <span className="text-3xl font-serif font-bold text-royal-maroon">
            Shubh<span className="text-[#C9A44C]">Vivah</span>
          </span>
        </Link>
        <h2 className="text-2xl font-serif font-bold text-royal-maroon">
          Welcome to Your Wedding Portal
        </h2>
        <p className="text-xs text-neutral-600 font-light">
          Sign in to access your invitations, guests, and wedding functions
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-xl border border-[#C9A44C]/30 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rohan@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-royal-maroon outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-neutral-700">
                  Password
                </label>
                <span className="text-[11px] text-royal-maroon hover:underline cursor-pointer">
                  Forgot Password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-royal-maroon outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-royal-maroon text-[#FFF9F0] hover:bg-royal-burgundy font-bold text-sm shadow-royal transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Pills */}
          <div className="pt-4 border-t border-neutral-100">
            <span className="text-[11px] font-semibold text-neutral-400 block mb-2 uppercase text-center">
              1-Click Instant Demo Credentials
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('rohan@example.com', 'Password@123')}
                className="py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold text-center transition-all"
              >
                🤵 Host: Rohan
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin@shubhvivah.com', 'Admin@12345')}
                className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold text-center transition-all"
              >
                🛡 Admin Panel
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-neutral-600">
            Don't have an account yet?{' '}
            <Link
              href="/register"
              className="font-bold text-royal-maroon hover:underline"
            >
              Register Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
