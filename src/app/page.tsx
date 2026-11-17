import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TemplateCard from '@/components/TemplateCard';
import { prisma } from '@/lib/prisma';
import {
  Sparkles,
  Heart,
  Calendar,
  Share2,
  Download,
  Users,
  Shield,
  MapPin,
  Check,
  ChevronRight,
  ArrowRight,
  Search,
  Music,
  QrCode,
  Smartphone,
  Star,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const revalidate = 60; // ISR cache

const DEFAULT_CATEGORIES = [
  { id: 'c1', name: 'Traditional Hindu', slug: 'traditional-hindu', categoryImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&auto=format&fit=crop&q=80' },
  { id: 'c2', name: 'Royal Indian', slug: 'royal-indian', categoryImage: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=600&auto=format&fit=crop&q=80' },
  { id: 'c3', name: 'Muslim Nikah', slug: 'muslim-wedding', categoryImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80' },
  { id: 'c4', name: 'South Indian', slug: 'south-indian', categoryImage: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80' },
  { id: 'c5', name: 'Punjabi Anand Karaj', slug: 'punjabi-wedding', categoryImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80' },
  { id: 'c6', name: 'Marathi Lagna', slug: 'marathi-wedding', categoryImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80' },
  { id: 'c7', name: 'Bengali Bibaha', slug: 'bengali-wedding', categoryImage: 'https://images.unsplash.com/photo-1519225438158-f5e921d227b6?w=600&auto=format&fit=crop&q=80' },
  { id: 'c8', name: 'Modern Luxury', slug: 'modern-luxury', categoryImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80' },
];

const DEFAULT_TEMPLATES = [
  {
    id: 't1',
    name: 'Vedic Shloka Vivaha',
    slug: 'vedic-shloka-vivaha',
    previewImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80',
    price: 0,
    isPremium: false,
    category: { name: 'Traditional Hindu', slug: 'traditional-hindu' },
    designConfiguration: { animationType: 'doors' },
  },
  {
    id: 't2',
    name: 'Rajwada Palace Gold',
    slug: 'rajwada-palace-gold',
    previewImage: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800&auto=format&fit=crop&q=80',
    price: 999,
    isPremium: true,
    category: { name: 'Royal Indian', slug: 'royal-indian' },
    designConfiguration: { animationType: 'mandala' },
  },
  {
    id: 't3',
    name: 'Noor-e-Nikah Mubarak',
    slug: 'noor-e-nikah-mubarak',
    previewImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    price: 799,
    isPremium: true,
    category: { name: 'Muslim Nikah', slug: 'muslim-wedding' },
    designConfiguration: { animationType: 'sparkles' },
  },
  {
    id: 't4',
    name: 'Thirumangalyam Gopuram',
    slug: 'thirumangalyam-gopuram',
    previewImage: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80',
    price: 899,
    isPremium: true,
    category: { name: 'South Indian', slug: 'south-indian' },
    designConfiguration: { animationType: 'bells' },
  },
  {
    id: 't5',
    name: 'Anand Karaj Heritage',
    slug: 'anand-karaj-heritage',
    previewImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
    price: 0,
    isPremium: false,
    category: { name: 'Punjabi Wedding', slug: 'punjabi-wedding' },
    designConfiguration: { animationType: 'petals' },
  },
  {
    id: 't6',
    name: 'Shubh Lagna Peshwai',
    slug: 'shubh-lagna-peshwai',
    previewImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80',
    price: 699,
    isPremium: true,
    category: { name: 'Marathi Lagna', slug: 'marathi-wedding' },
    designConfiguration: { animationType: 'diyas' },
  },
];

export default async function LandingPage() {
  let categories: any[] = DEFAULT_CATEGORIES;
  let trendingTemplates: any[] = DEFAULT_TEMPLATES;
  let totalTemplatesCount = 15;

  try {
    const [dbCategories, dbTemplates, count] = await Promise.all([
      prisma.templateCategory.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
        take: 8,
      }),
      prisma.template.findMany({
        where: { isActive: true },
        include: {
          category: { select: { name: true, slug: true } },
        },
        orderBy: { createdAt: 'asc' },
        take: 6,
      }),
      prisma.template.count({ where: { isActive: true } }),
    ]);

    if (dbCategories && dbCategories.length > 0) categories = dbCategories;
    if (dbTemplates && dbTemplates.length > 0) trendingTemplates = dbTemplates;
    if (count > 0) totalTemplatesCount = count;
  } catch (error) {
    // Database connection may not be available during static build on Vercel
    console.warn('Prisma DB query skipped during static page collection, using static defaults.');
  }

  const pricingPlans = [
    {
      name: 'Shubh Starter',
      price: 0,
      description: 'Ideal for small intimate pre-wedding functions or digital saves-the-date.',
      features: [
        '1 Digital Invitation Web Page',
        'Up to 100 Guest RSVPs',
        'Standard Cultural Templates',
        'Direct WhatsApp Share Link',
        'Mobile & Desktop Responsive',
      ],
      popular: false,
      cta: 'Start Free',
      ctaLink: '/templates',
    },
    {
      name: 'Vivah Premium',
      price: 1499,
      description: 'The complete Indian wedding experience with multi-event scheduling and guest segmentation.',
      features: [
        'Unlimited Digital Invitations',
        'Unlimited Guest Tokens & RSVPs',
        'All 15 Cultural Design Themes',
        'Multi-Event Itinerary with Google Maps',
        'Guest Personalization & Dietary Tracking',
        'Background Shehnai & Sitar Audio',
        '300 DPI Print-Ready PDF & Story Image',
        'Dynamic QR Code for Physical Cards',
      ],
      popular: true,
      cta: 'Get Premium Access',
      ctaLink: '/templates',
    },
    {
      name: 'Royal Wedding Planner',
      price: 4999,
      description: 'Built for event planners and multi-day destination weddings managing dozens of clients.',
      features: [
        'Everything in Vivah Premium',
        'Multi-Project Switchboard',
        'Bulk CSV Guest Import & Export',
        'Dynamic OpenGraph Social Cards',
        'White-label (No ShubhVivah watermark)',
        'Priority Phone & WhatsApp Support',
        'Custom Typography & CSS Themes',
      ],
      popular: false,
      cta: 'Join as Planner',
      ctaLink: '/templates',
    },
  ];

  const faqs = [
    {
      q: 'How do guests open and respond to the invitation?',
      a: 'Guests receive a personalized link via WhatsApp, SMS, or email. When they open it, their name is displayed automatically on the invitation. They can view the event dates, tap for Google Maps directions, listen to traditional music, and confirm their RSVP with 1 tap.',
    },
    {
      q: 'Can I invite different guests to different wedding functions?',
      a: 'Yes! ShubhVivah natively supports guest segmentation. You can invite close family to the Haldi, Mehendi, and Wedding, while inviting colleagues or extended acquaintances only to the Grand Reception dinner.',
    },
    {
      q: 'Can I download a printable high-resolution PDF for physical printing?',
      a: 'Absolutely. Every design can be exported as a 300 DPI print-ready PDF with bleed lines and vector typography, ideal for local printing presses or luxury wedding stationery printers.',
    },
    {
      q: 'Does it support regional Indian languages and Sanskrit mantras?',
      a: 'Yes! ShubhVivah provides built-in support for Devanagari (Hindi, Marathi), Gurmukhi (Punjabi), Gujarati, Bengali, Tamil, Telugu, and English, along with traditional religious invocations and Vedic shlokas.',
    },
    {
      q: 'Can we collect digital Shagun or gift blessings via UPI?',
      a: 'Yes. You can add your personal UPI ID and QR code to the invitation so out-of-town guests or well-wishers can send their traditional blessings seamlessly.',
    },
  ];

  const testimonials = [
    {
      quote:
        'ShubhVivah saved us so much time and money! Our relatives in the US and UK loved the live Shehnai music and 1-tap Google Maps link. The RSVP tracker helped us plan our catering with zero food waste!',
      name: 'Priya & Rohan Singhania',
      location: 'Bengaluru / Udaipur',
      culture: 'Royal Rajasthani Wedding',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    },
    {
      quote:
        'Being a traditional South Indian family, we wanted authentic temple gopuram motifs and Tamil shlokas. ShubhVivah had the exact design we wanted. Generating personalized WhatsApp links took just 5 minutes!',
      name: 'Karthik & Meenakshi',
      location: 'Chennai',
      culture: 'Thirumangalyam Vivaham',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    },
    {
      quote:
        'As an event planner managing 15 weddings a year, the bulk CSV guest importer and selective function permissions are game changers. My clients are thrilled with the digital luxury feel.',
      name: 'Aarav Mehta',
      location: 'Mumbai',
      culture: 'Mehta Luxury Weddings & Events',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F0]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[#C9A44C]/30 bg-gradient-to-b from-[#FFFDF9] via-[#FFF9F0] to-[#FDF5E6]">
        {/* Subtle decorative background watermarks */}
        <div className="absolute top-10 left-5 text-7xl opacity-5 pointer-events-none select-none">🪔</div>
        <div className="absolute top-20 right-10 text-8xl opacity-5 pointer-events-none select-none">⚜</div>
        <div className="absolute bottom-5 left-1/3 text-9xl opacity-5 pointer-events-none select-none">🪷</div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              {/* Auspicious Badge */}
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/90 border border-[#C9A44C] shadow-sm">
                <span className="text-amber-700">🪔</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-royal-maroon">
                  India’s #1 Cultural Wedding Invitation Platform
                </span>
                <Sparkles className="w-3.5 h-3.5 text-[#C9A44C]" />
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-royal-maroon leading-[1.15]">
                Your Love Story Deserves a{' '}
                <span className="text-gold-gradient underline decoration-[#C9A44C]/40">
                  Beautiful Invitation.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-neutral-700 max-w-2xl leading-relaxed font-light">
                Create stunning personalized Indian wedding invitations in minutes. Choose your
                favourite design, add your memories and share your special day with everyone.
              </p>

              {/* Call to Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/templates"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-royal-maroon text-[#FFF9F0] hover:bg-royal-burgundy font-semibold text-base shadow-royal hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 border-2 border-[#C9A44C]"
                >
                  <Sparkles className="w-5 h-5 text-[#E8D390]" />
                  <span>Create Your Invitation</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  href="/templates"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-royal-maroon hover:bg-royal-champagne/40 font-semibold text-base border-2 border-[#C9A44C]/60 shadow-sm transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Explore 15+ Traditions</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-[#C9A44C]/20 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-neutral-600 font-medium">
                <div className="flex items-center space-x-1.5">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>100% Mobile Responsive</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>1-Tap WhatsApp Sharing</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>Live RSVP Tracking</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>300 DPI Print PDF</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Mockup Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-sm">
                {/* Floating Auspicious Badge */}
                <div className="absolute -top-4 -left-4 z-20 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-[#C9A44C] flex items-center space-x-2 animate-bounce">
                  <span className="text-xl">🪷</span>
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase font-bold">
                      Auspicious Mahurat
                    </span>
                    <span className="text-xs font-serif font-bold text-royal-maroon">
                      18 February 2027
                    </span>
                  </div>
                </div>

                {/* Floating WhatsApp Card */}
                <div className="absolute -bottom-5 -right-5 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-emerald-400 flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase font-bold">
                      WhatsApp Invite Ready
                    </span>
                    <span className="text-xs font-bold text-emerald-800">
                      1-Tap Personal Links
                    </span>
                  </div>
                </div>

                {/* Card Container */}
                <div className="rounded-3xl p-3 bg-gradient-to-b from-[#C9A44C] via-[#E8D390] to-[#94762E] shadow-2xl">
                  <div className="rounded-[22px] overflow-hidden bg-[#FFF9F0] border-2 border-white shadow-inner">
                    <div className="aspect-[9/14] relative overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80"
                        alt="Royal Wedding Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#800020] via-black/30 to-black/40 flex flex-col justify-between p-6 text-center text-white">
                        <div className="pt-2">
                          <span className="text-xs tracking-widest uppercase font-serif text-[#E8D390] block">
                            ॥ श्री गणेशाय नमः ॥
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-light text-amber-200">
                            Together With Our Families
                          </span>
                          <h3 className="font-serif font-bold text-3xl text-[#FFF9F0]">
                            Priya & Rohan
                          </h3>
                          <div className="w-12 h-0.5 bg-[#C9A44C] mx-auto my-1" />
                          <p className="text-xs text-neutral-200">
                            The Marwar Palace, Jodhpur
                          </p>
                          <Link
                            href="/invitation/rohan-weds-priya"
                            className="inline-flex items-center space-x-1 mt-3 px-4 py-2 rounded-full bg-[#E8D390] text-royal-maroon text-xs font-bold shadow-lg hover:bg-white transition-all"
                          >
                            <span>Open Live Invitation Demo</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="max-w-4xl mx-auto w-full px-4 -mt-7 relative z-20">
        <form
          action="/templates"
          method="GET"
          className="bg-white p-3 sm:p-4 rounded-2xl shadow-xl border-2 border-[#C9A44C] flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="flex-1 flex items-center space-x-3 px-3 w-full">
            <Search className="w-5 h-5 text-neutral-400 shrink-0" />
            <input
              type="text"
              name="search"
              placeholder="Search by culture, tradition, colour or style (e.g. Rajasthani, Maroon, South Indian)..."
              className="w-full text-sm outline-none text-neutral-800 placeholder-neutral-400 bg-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-royal-maroon text-[#FFF9F0] hover:bg-royal-burgundy font-semibold text-sm transition-all shadow-md shrink-0"
          >
            Find Templates
          </button>
        </form>
      </section>

      {/* Popular Invitation Categories */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A44C] block mb-1">
            Browse By Cultural Heritage
          </span>
          <h2 className="text-3xl font-serif font-bold text-royal-maroon">
            Popular Invitation Categories
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2 font-light">
            Every tradition has its sacred soul. Explore invitations crafted specifically for each region and community.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/templates?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] shadow-sm hover:shadow-xl transition-all duration-300 border border-[#C9A44C]/30"
            >
              <img
                src={cat.categoryImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#FFF9F0] group-hover:text-[#E8D390] transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-neutral-300 font-light flex items-center space-x-1 mt-0.5">
                  <span>Explore Designs</span>
                  <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Wedding Templates */}
      <section className="py-16 bg-[#FFFDF9] border-y border-[#C9A44C]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A44C] block mb-1">
                Hand-Crafted Artistry
              </span>
              <h2 className="text-3xl font-serif font-bold text-royal-maroon">
                Trending Wedding Templates
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 font-light">
                Discover our most loved authentic Indian wedding templates.
              </p>
            </div>
            <Link
              href="/templates"
              className="mt-4 md:mt-0 inline-flex items-center space-x-1 text-sm font-semibold text-royal-maroon hover:text-royal-burgundy group"
            >
              <span>View All {totalTemplatesCount} Templates</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingTemplates.map((template) => (
              <TemplateCard key={template.id} template={template as any} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A44C] block mb-1">
            Frictionless Creation
          </span>
          <h2 className="text-3xl font-serif font-bold text-royal-maroon">
            How ShubhVivah Works
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-2 font-light">
            Create and send your dream wedding invitation in 4 simple steps without any design skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-white border border-[#C9A44C]/30 shadow-sm text-center relative group hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-royal-maroon text-[#E8D390] flex items-center justify-center text-xl font-bold mx-auto mb-4 border border-[#C9A44C] shadow-royal">
              1
            </div>
            <h3 className="font-serif font-bold text-lg text-royal-maroon mb-2">
              Choose Cultural Design
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              Select from 15 authentic Indian traditions—from royal Rajasthani palace motifs to South Indian temple gopurams.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-white border border-[#C9A44C]/30 shadow-sm text-center relative group hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-royal-maroon text-[#E8D390] flex items-center justify-center text-xl font-bold mx-auto mb-4 border border-[#C9A44C] shadow-royal">
              2
            </div>
            <h3 className="font-serif font-bold text-lg text-royal-maroon mb-2">
              Customize Itinerary & Details
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              Add couple profiles, elders' blessings, Haldi/Mehendi/Sangeet functions, dress codes, and Google Maps venues.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-white border border-[#C9A44C]/30 shadow-sm text-center relative group hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-royal-maroon text-[#E8D390] flex items-center justify-center text-xl font-bold mx-auto mb-4 border border-[#C9A44C] shadow-royal">
              3
            </div>
            <h3 className="font-serif font-bold text-lg text-royal-maroon mb-2">
              Live Preview & Personalize
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              Preview real-time changes on mobile and desktop. Personalize individual links with guest family names and selective event passes.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-2xl bg-white border border-[#C9A44C]/30 shadow-sm text-center relative group hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-royal-maroon text-[#E8D390] flex items-center justify-center text-xl font-bold mx-auto mb-4 border border-[#C9A44C] shadow-royal">
              4
            </div>
            <h3 className="font-serif font-bold text-lg text-royal-maroon mb-2">
              Share & Track RSVPs
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              Send personalized WhatsApp links with 1-tap. Download 300 DPI PDFs for printing and track real-time meal preferences and RSVPs.
            </p>
          </div>
        </div>
      </section>

      {/* Features & Benefits Matrix */}
      <section className="py-20 bg-royal-maroon text-[#FFF9F0] border-y-2 border-[#C9A44C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#E8D390] block mb-1">
              Engineered For Modern Indian Weddings
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Features You Won’t Find In Western Tools
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2 font-light">
              Built ground-up for the scale, traditions, and excitement of Indian families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-black/20 border border-[#C9A44C]/30 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#C9A44C] text-royal-maroon flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#E8D390]">
                Multi-Day Event Scheduling
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed font-light">
                Haldi, Mehendi, Sangeet, Vivah, Reception—manage distinct venues, dates, timings, dress codes, and Google Maps navigation per event.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-black/20 border border-[#C9A44C]/30 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#C9A44C] text-royal-maroon flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#E8D390]">
                Selective Guest Ticketing
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed font-light">
                Invite 1,000 guests to the Reception while keeping intimate pre-wedding ceremonies visible only to close family members.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-black/20 border border-[#C9A44C]/30 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#C9A44C] text-royal-maroon flex items-center justify-center">
                <Music className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#E8D390]">
                Interactive Shehnai Audio
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed font-light">
                Immerse guests with sacred Shehnai, Sitar raagas, or festive flute music with an elegant browser-compliant audio player.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-black/20 border border-[#C9A44C]/30 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#C9A44C] text-royal-maroon flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#E8D390]">
                WhatsApp Pre-filled Blaster
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed font-light">
                Generate pre-written Sanskrit/cultural greetings addressed personally to each family for instant WhatsApp sharing.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-black/20 border border-[#C9A44C]/30 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#C9A44C] text-royal-maroon flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#E8D390]">
                300 DPI Print-Ready PDF
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed font-light">
                Need physical cards for elders? Download high-definition vector PDFs with crop marks ready for luxury offset printing.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-black/20 border border-[#C9A44C]/30 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#C9A44C] text-royal-maroon flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#E8D390]">
                Digital Shagun & UPI Registry
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed font-light">
                Enable out-of-town guests to bless the couple with traditional Shagun via secure, direct UPI QR code integration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A44C] block mb-1">
            Loved By Couples & Families
          </span>
          <h2 className="text-3xl font-serif font-bold text-royal-maroon">
            Real Stories, Real Celebrations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-[#C9A44C]/30 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed italic font-light">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center space-x-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#C9A44C]"
                />
                <div>
                  <h4 className="font-serif font-bold text-sm text-royal-maroon">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    {t.culture} • {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Plans */}
      <section id="pricing" className="py-20 bg-[#FFFDF9] border-t border-[#C9A44C]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A44C] block mb-1">
              Transparent & Affordable
            </span>
            <h2 className="text-3xl font-serif font-bold text-royal-maroon">
              Simple, Honest Pricing
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 font-light">
              No hidden agency fees. Pay once per wedding and keep your invitation live forever.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-3xl transition-all duration-300 relative flex flex-col justify-between ${
                  plan.popular
                    ? 'bg-royal-maroon text-[#FFF9F0] shadow-2xl border-2 border-[#C9A44C] md:-translate-y-3'
                    : 'bg-white text-neutral-800 border border-[#C9A44C]/40 shadow-md'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#E8D390] to-[#C9A44C] text-[#2A1810] text-[11px] font-bold uppercase tracking-wider shadow-sm border border-amber-300">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  <h3
                    className={`font-serif font-bold text-xl ${
                      plan.popular ? 'text-[#E8D390]' : 'text-royal-maroon'
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`text-xs mt-1 font-light ${
                      plan.popular ? 'text-neutral-300' : 'text-neutral-500'
                    }`}
                  >
                    {plan.description}
                  </p>

                  <div className="my-6">
                    <span className="text-4xl font-serif font-bold">
                      {plan.price === 0 ? 'Free' : formatCurrency(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span
                        className={`text-xs font-normal ml-1 ${
                          plan.popular ? 'text-neutral-300' : 'text-neutral-500'
                        }`}
                      >
                        / wedding
                      </span>
                    )}
                  </div>

                  <ul className="space-y-3 text-xs">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <Check
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            plan.popular ? 'text-[#E8D390]' : 'text-emerald-700'
                          }`}
                        />
                        <span className={plan.popular ? 'text-neutral-200' : 'text-neutral-700'}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <Link
                    href={plan.ctaLink}
                    className={`w-full py-3 rounded-full font-semibold text-sm transition-all flex items-center justify-center space-x-2 shadow-sm ${
                      plan.popular
                        ? 'bg-gradient-to-r from-[#E8D390] to-[#C9A44C] text-[#2A1810] hover:scale-105 shadow-gold'
                        : 'bg-royal-maroon text-[#FFF9F0] hover:bg-royal-burgundy'
                    }`}
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A44C] block mb-1">
            Questions & Answers
          </span>
          <h2 className="text-3xl font-serif font-bold text-royal-maroon">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-[#C9A44C]/30 shadow-xs"
            >
              <h3 className="font-serif font-bold text-base text-royal-maroon mb-2 flex items-center space-x-2">
                <span className="text-[#C9A44C]">Q.</span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-light pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-gradient-to-r from-[#800020] via-[#5A1024] to-[#800020] text-center text-[#FFF9F0] border-t-2 border-[#C9A44C]">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <span className="text-3xl">🪔</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Start Crafting Your Dream Wedding Invitation Today
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto font-light leading-relaxed">
            Join thousands of couples creating unforgettable, culturally rich Indian wedding invitations.
          </p>
          <div className="pt-2">
            <Link
              href="/templates"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#E8D390] to-[#C9A44C] text-[#2A1810] font-bold text-sm shadow-xl hover:scale-105 transition-all border border-amber-300"
            >
              <Sparkles className="w-4 h-4" />
              <span>Choose Your Free Template Now</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
