import React from 'react';
import Link from 'next/link';
import { Heart, Sparkles, MapPin, Phone, Mail, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1A0F12] text-[#FFF9F0] border-t-2 border-[#C9A44C] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#C9A44C]/20">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-royal-maroon flex items-center justify-center text-[#E8D390] border border-[#C9A44C]">
                <span className="text-lg">🪔</span>
              </div>
              <span className="text-2xl font-serif font-bold tracking-wide text-[#E8D390]">
                Shubh<span className="text-white">Vivah</span>
              </span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed font-light">
              Crafting culturally authentic, interactive Indian wedding invitations that celebrate sacred traditions, connect families, and simplify modern wedding logistics.
            </p>
            <div className="text-xs text-[#C9A44C] font-serif italic pt-2">
              ॥ यदेतद्धृदयं तव तदस्तु हृदयं मम ॥
              <div className="text-[10px] text-neutral-400 not-italic font-sans">
                "May your heart be my heart, and my heart be yours."
              </div>
            </div>
          </div>

          {/* Wedding Traditions */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider text-[#E8D390] uppercase mb-4 flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Wedding Traditions</span>
            </h4>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>
                <Link href="/templates?category=royal-rajasthani" className="hover:text-[#E8D390] transition-colors">
                  Royal Rajasthani & Marwari
                </Link>
              </li>
              <li>
                <Link href="/templates?category=traditional-hindu" className="hover:text-[#E8D390] transition-colors">
                  Traditional Vedic Hindu
                </Link>
              </li>
              <li>
                <Link href="/templates?category=south-indian" className="hover:text-[#E8D390] transition-colors">
                  South Indian Thirumangalyam
                </Link>
              </li>
              <li>
                <Link href="/templates?category=punjabi" className="hover:text-[#E8D390] transition-colors">
                  Punjabi Anand Karaj
                </Link>
              </li>
              <li>
                <Link href="/templates?category=muslim-nikah" className="hover:text-[#E8D390] transition-colors">
                  Muslim Nikah Mubarak
                </Link>
              </li>
              <li>
                <Link href="/templates?category=bengali" className="hover:text-[#E8D390] transition-colors">
                  Bengali Shubho Drishti
                </Link>
              </li>
              <li>
                <Link href="/templates?category=marathi" className="hover:text-[#E8D390] transition-colors">
                  Maharashtrian Peshwai Vivah
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Features */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider text-[#E8D390] uppercase mb-4">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>
                <Link href="/templates" className="hover:text-[#E8D390] transition-colors">
                  15 Cultural Template Marketplace
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#E8D390] transition-colors">
                  Interactive Live Studio Editor
                </Link>
              </li>
              <li>
                <Link href="/dashboard/guests" className="hover:text-[#E8D390] transition-colors">
                  Guest CRM & 1-Tap RSVP Tracking
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-[#E8D390] transition-colors">
                  Personalized WhatsApp Link Blaster
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-[#E8D390] transition-colors">
                  300 DPI Print PDF Generation
                </Link>
              </li>
              <li>
                <Link href="/invitation/rohan-weds-priya" className="hover:text-[#E8D390] transition-colors">
                  Interactive Background Music
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider text-[#E8D390] uppercase mb-4">
              Concierge & Planners
            </h4>
            <div className="space-y-3 text-xs text-neutral-300">
              <p className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#C9A44C]" />
                <span>support@shubhvivah.com</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#C9A44C]" />
                <span>+91 98765 43210 (Mon-Sat 10am-7pm)</span>
              </p>
              <p className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#C9A44C]" />
                <span>Wedding Tech Hub, Bengaluru & Mumbai, India</span>
              </p>
              <div className="pt-2">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-[#C9A44C]/30 text-[11px] text-[#E8D390]">
                  <Shield className="w-3.5 h-3.5" />
                  <span>100% Private & Bank-Grade Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-neutral-400 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} ShubhVivah SaaS Platform. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="/templates" className="hover:text-[#E8D390] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/templates" className="hover:text-[#E8D390] transition-colors">
              Terms of Service
            </Link>
            <Link href="/templates" className="hover:text-[#E8D390] transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
