'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TemplateCard from '@/components/TemplateCard';
import LiveTemplateRenderer from '@/components/LiveTemplateRenderer';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  Sparkles,
  X,
  SlidersHorizontal,
  ChevronDown,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

function TemplatesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [templates, setTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'all'
  );
  const [selectedAnimation, setSelectedAnimation] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get('search') || ''
  );
  const [premiumFilter, setPremiumFilter] = useState<string>('all'); // all, free, premium
  const [sortBy, setSortBy] = useState<string>('popular'); // popular, price_asc, price_desc

  // Quick View Modal
  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);

  // Fetch templates when filters change
  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (searchQuery) params.set('search', searchQuery);
    if (premiumFilter === 'free') params.set('premium', 'false');
    if (premiumFilter === 'premium') params.set('premium', 'true');
    params.set('sort', sortBy);

    fetch(`/api/templates?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data.templates || []);
        if (data.categories) setCategories(data.categories);
      })
      .catch((err) => console.error('Error fetching templates:', err))
      .finally(() => setIsLoading(false));
  }, [selectedCategory, searchQuery, premiumFilter, sortBy]);

  const displayedTemplates = templates.filter((t) => {
    if (selectedAnimation !== 'all') {
      const anim = t.designConfiguration?.animationType;
      if (anim !== selectedAnimation) return false;
    }
    return true;
  });

  const handleCustomize = (template: any) => {
    router.push(`/dashboard?createFrom=${template.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F0]">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-gradient-to-b from-[#FFFDF9] via-[#FFF9F0] to-[#FBF4E6] border-b border-[#C9A44C]/30 pt-12 pb-14 text-center px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/90 border border-[#C9A44C] text-[11px] font-bold uppercase tracking-wider text-royal-maroon shadow-xs">
            <span>🪔</span>
            <span>15 Authentic Indian Wedding Traditions</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-royal-maroon">
            Cultural Wedding Invitation Gallery
          </h1>

          <p className="text-sm text-neutral-600 max-w-xl mx-auto leading-relaxed font-light">
            Every tradition has its own auspicious language. Choose an authentic design tailored
            for your heritage, customize every detail, and preview live on mobile devices.
          </p>
        </div>
      </div>

      {/* Main Gallery Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#C9A44C]/30 shadow-md mb-8 space-y-5">
          {/* Top Search & Sorters */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search templates by tradition, style or color (e.g., Nikah, South Indian, Velvet)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-royal-maroon outline-none bg-neutral-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Premium vs Free Pills */}
            <div className="flex items-center space-x-2 shrink-0 w-full md:w-auto">
              <button
                onClick={() => setPremiumFilter('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  premiumFilter === 'all'
                    ? 'bg-royal-maroon text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                All Designs
              </button>
              <button
                onClick={() => setPremiumFilter('free')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  premiumFilter === 'free'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Free Only
              </button>
              <button
                onClick={() => setPremiumFilter('premium')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  premiumFilter === 'premium'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Premium Only
              </button>
            </div>

            {/* Sorter */}
            <div className="shrink-0 w-full md:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full md:w-auto px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold bg-white text-neutral-700 outline-none cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Cultural Category Pills */}
          <div className="pt-3 border-t border-neutral-100 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-neutral-400 font-bold uppercase mr-1">
              Traditions:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-royal-maroon text-[#FFF9F0] shadow-sm'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              All Traditions ({templates.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-royal-maroon text-[#FFF9F0] shadow-sm'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Animation Filter Pills */}
          <div className="pt-2 border-t border-neutral-100 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-amber-800 font-bold uppercase mr-1 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Animations:</span>
            </span>
            <button
              onClick={() => setSelectedAnimation('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedAnimation === 'all'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              All ({displayedTemplates.length})
            </button>
            <button
              onClick={() => setSelectedAnimation('palace-doors')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedAnimation === 'palace-doors'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              🚪 3D Palace Gates
            </button>
            <button
              onClick={() => setSelectedAnimation('falling-petals')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedAnimation === 'falling-petals'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              🌸 Rose Petals
            </button>
            <button
              onClick={() => setSelectedAnimation('marigold-shower')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedAnimation === 'marigold-shower'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              🌼 Marigold Cascade
            </button>
            <button
              onClick={() => setSelectedAnimation('temple-bells')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedAnimation === 'temple-bells'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              🔔 Temple Bells & Jasmine
            </button>
            <button
              onClick={() => setSelectedAnimation('rotating-mandala')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedAnimation === 'rotating-mandala'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              ☸ Sacred Mandala
            </button>
            <button
              onClick={() => setSelectedAnimation('starry-sparkles')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedAnimation === 'starry-sparkles'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              ✨ Starry Sparkles
            </button>
            <button
              onClick={() => setSelectedAnimation('floating-diyas')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedAnimation === 'floating-diyas'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              🪔 Floating Diyas
            </button>
            <button
              onClick={() => setSelectedAnimation('gold-dust')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedAnimation === 'gold-dust'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              ⚜ Gold Leaf Drift
            </button>
          </div>
        </div>

        {/* Template Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] rounded-2xl bg-neutral-200/60 animate-pulse border border-neutral-200"
              />
            ))}
          </div>
        ) : displayedTemplates.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-[#C9A44C]/30 p-8">
            <span className="text-4xl block mb-3">🔍</span>
            <h3 className="font-serif font-bold text-xl text-royal-maroon">
              No matching animated templates found
            </h3>
            <p className="text-xs text-neutral-500 mt-1 mb-6">
              Try adjusting your search query, tradition, or animation filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedAnimation('all');
                setSearchQuery('');
                setPremiumFilter('all');
              }}
              className="px-5 py-2.5 rounded-full bg-royal-maroon text-white text-xs font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onPreviewClick={(t) => setPreviewTemplate(t)}
                onCustomizeClick={(t) => handleCustomize(t)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Live Interactive Quick View Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-[#FFF9F0] rounded-3xl border-2 border-[#C9A44C] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-royal-maroon text-[#FFF9F0] flex justify-between items-center border-b border-[#C9A44C]">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-amber-200 block font-semibold">
                  {previewTemplate.category?.name}
                </span>
                <h3 className="font-serif font-bold text-lg text-white">
                  {previewTemplate.name}
                </h3>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-8 overflow-y-auto flex-1">
              <LiveTemplateRenderer
                invitationData={{
                  mantra:
                    previewTemplate.designConfiguration?.defaultMantra ||
                    '॥ श्री गणेशाय नमः ॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
                  welcomeNote:
                    'Together with our families, we warmly invite you to share our joy as we begin our new journey together.',
                  couple: {
                    bride: {
                      name: 'Priya Sharma',
                      parents: 'Smt. Sunita & Shri Ramesh Sharma',
                      photo:
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
                    },
                    groom: {
                      name: 'Rohan Singhania',
                      parents: 'Smt. Rekha & Shri Vikram Singhania',
                      photo:
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
                    },
                    hashtag: '#PriyaFoundHerRohan',
                  },
                  audio: {
                    enabled: true,
                    trackUrl:
                      'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
                    title: 'Auspicious Shehnai Melody',
                  },
                }}
                designConfiguration={previewTemplate.designConfiguration || {}}
                events={[
                  {
                    id: 'sample-1',
                    eventName: 'Mehendi & Haldi Ceremony',
                    eventDate: new Date('2027-02-17T11:00:00Z'),
                    startTime: '11:00 AM',
                    endTime: '03:30 PM',
                    venue: 'The Palace Gardens',
                    address: 'Circuit House Road, Jodhpur, Rajasthan',
                    dressCode: 'Bright Yellows & Floral Prints',
                    description: 'Turmeric blessings and henna celebrations.',
                  },
                  {
                    id: 'sample-2',
                    eventName: 'Shubh Vivah (Wedding Ceremony)',
                    eventDate: new Date('2027-02-18T10:00:00Z'),
                    startTime: '10:00 AM',
                    endTime: '03:00 PM',
                    venue: 'The Royal Mandap',
                    address: 'The Grand Heritage Palace, Jodhpur',
                    dressCode: 'Royal Traditional Indian Attire',
                    description: 'Sacred wedding vows and Vedic pheras.',
                  },
                ]}
                isPreview={true}
              />
            </div>

            {/* Modal Bottom CTA Bar */}
            <div className="p-4 bg-white border-t border-[#C9A44C]/30 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-xs text-neutral-600">
                <span className="font-bold text-neutral-800">
                  {Number(previewTemplate.price) === 0
                    ? 'Free Included'
                    : formatCurrency(previewTemplate.price)}
                </span>
                <span className="ml-1 text-neutral-500">
                  • Fully customizable with your photos, timings & venues
                </span>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Close
                </button>
                <button
                  onClick={() => handleCustomize(previewTemplate)}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-royal-maroon text-[#FFF9F0] hover:bg-royal-burgundy text-xs font-bold shadow-royal flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E8D390]" />
                  <span>Customize This Template</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function TemplatesGalleryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF9F0] flex items-center justify-center font-serif text-royal-maroon font-bold">Loading Gallery...</div>}>
      <TemplatesContent />
    </Suspense>
  );
}
