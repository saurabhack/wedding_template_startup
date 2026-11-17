'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Sparkles, User, LayoutDashboard, ShieldCheck, LogOut, Heart } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) setCurrentUser(data.user);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#FFF9F0]/90 backdrop-blur-md border-b border-[#C9A44C]/30 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-full bg-royal-maroon flex items-center justify-center text-[#E8D390] shadow-royal transition-transform group-hover:scale-105 border border-[#C9A44C]">
              <span className="text-xl">🪔</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-bold text-royal-maroon tracking-wide">
                Shubh<span className="text-[#C9A44C]">Vivah</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase text-royal-burgundy/70 font-semibold">
                शुभविवाह • Indian Wedding Tech
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-royal-burgundy">
            <Link
              href="/templates"
              className="hover:text-royal-maroon transition-colors py-1 relative group"
            >
              Templates Gallery
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C9A44C] transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/#how-it-works"
              className="hover:text-royal-maroon transition-colors py-1 relative group"
            >
              How It Works
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C9A44C] transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/#pricing"
              className="hover:text-royal-maroon transition-colors py-1 relative group"
            >
              Pricing Plans
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C9A44C] transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/invitation/rohan-weds-priya"
              className="flex items-center space-x-1.5 text-royal-maroon font-semibold bg-royal-champagne/40 px-3 py-1.5 rounded-full border border-[#C9A44C]/40 hover:bg-royal-champagne transition-all"
            >
              <Heart className="w-3.5 h-3.5 fill-royal-maroon text-royal-maroon" />
              <span>Live Sample Demo</span>
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="w-24 h-9 bg-royal-champagne/30 rounded-full animate-pulse" />
            ) : currentUser ? (
              <div className="flex items-center space-x-3">
                {currentUser.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-royal-emerald text-white hover:bg-royal-emerald/90 transition-colors shadow-sm"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 text-sm font-semibold px-4 py-2 rounded-full bg-royal-maroon text-white hover:bg-royal-burgundy transition-all shadow-royal border border-[#C9A44C]/50"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#E8D390]" />
                  <span>My Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-2 rounded-full hover:bg-royal-champagne/50 text-royal-burgundy transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-royal-maroon hover:text-royal-burgundy px-3 py-2 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/templates"
                  className="flex items-center space-x-2 text-sm font-semibold px-5 py-2.5 rounded-full bg-royal-maroon text-[#FFF9F0] hover:bg-royal-burgundy transition-all shadow-royal border border-[#C9A44C]"
                >
                  <Sparkles className="w-4 h-4 text-[#E8D390]" />
                  <span>Create Your Invitation</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-royal-maroon hover:bg-royal-champagne/40 transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#FFF9F0] border-b border-[#C9A44C]/40 px-4 pt-2 pb-6 space-y-4 shadow-xl">
          <Link
            href="/templates"
            onClick={() => setIsOpen(false)}
            className="block text-base font-medium text-royal-burgundy hover:text-royal-maroon py-2"
          >
            Templates Gallery
          </Link>
          <Link
            href="/#how-it-works"
            onClick={() => setIsOpen(false)}
            className="block text-base font-medium text-royal-burgundy hover:text-royal-maroon py-2"
          >
            How It Works
          </Link>
          <Link
            href="/#pricing"
            onClick={() => setIsOpen(false)}
            className="block text-base font-medium text-royal-burgundy hover:text-royal-maroon py-2"
          >
            Pricing Plans
          </Link>
          <Link
            href="/invitation/rohan-weds-priya"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-2 text-base font-semibold text-royal-maroon py-2"
          >
            <Heart className="w-4 h-4 fill-royal-maroon text-royal-maroon" />
            <span>Live Sample Demo</span>
          </Link>

          <div className="pt-4 border-t border-[#C9A44C]/30 flex flex-col space-y-3">
            {currentUser ? (
              <>
                <div className="text-xs text-neutral-500">Signed in as {currentUser.fullName}</div>
                {currentUser.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg bg-royal-emerald text-white text-sm font-semibold"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg bg-royal-maroon text-white text-sm font-semibold"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#E8D390]" />
                  <span>Host Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 w-full py-2 rounded-lg text-sm text-red-700 bg-red-50 hover:bg-red-100 font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg border border-royal-maroon text-royal-maroon font-semibold text-sm"
                >
                  Log In
                </Link>
                <Link
                  href="/templates"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-royal-maroon text-[#FFF9F0] font-semibold text-sm shadow-royal"
                >
                  Create Your Invitation
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
