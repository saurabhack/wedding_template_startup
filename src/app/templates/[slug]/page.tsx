import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LiveTemplateRenderer from '@/components/LiveTemplateRenderer';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  Check,
  Calendar,
  Share2,
  Music,
  MapPin,
  QrCode,
  Shield,
  ArrowRight,
  Eye,
  ChevronRight,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Props {
  params: { slug: string };
}

export default async function TemplateDetailsPage({ params }: Props) {
  const template = await prisma.template.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      versions: {
        where: { isPublished: true },
        orderBy: { versionNumber: 'desc' },
        take: 1,
      },
    },
  });

  if (!template) {
    notFound();
  }

  const config = (template.designConfiguration as any) || {};
  const isFree = Number(template.price) === 0;

  const mockEvents = [
    {
      id: 'e1',
      eventName: 'Mehendi & Sangeet Celebration',
      eventDate: new Date('2027-02-17T17:00:00Z'),
      startTime: '05:00 PM',
      endTime: '11:00 PM',
      venue: 'The Palace Gardens',
      address: 'Heritage Circuit, Royal City',
      dressCode: 'Glamorous Festive Wear',
      description: 'An evening of henna, music, and family dance performances.',
    },
    {
      id: 'e2',
      eventName: 'Shubh Vivah (Wedding Ceremony)',
      eventDate: new Date('2027-02-18T10:00:00Z'),
      startTime: '10:00 AM',
      endTime: '02:30 PM',
      venue: 'The Sacred Mandap',
      address: 'Heritage Circuit, Royal City',
      dressCode: 'Traditional Indian Elegance',
      description: 'Vedic wedding rituals, hastamelap, and sacred seven pheras.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F0]">
      <Navbar />

      {/* Breadcrumb Header */}
      <div className="bg-[#FFFDF9] border-b border-[#C9A44C]/30 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 text-xs text-neutral-500 font-medium">
          <Link href="/" className="hover:text-royal-maroon">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <Link href="/templates" className="hover:text-royal-maroon">
            Templates
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <Link
            href={`/templates?category=${template.category.slug}`}
            className="hover:text-royal-maroon"
          >
            {template.category.name}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-royal-maroon font-bold">{template.name}</span>
        </div>
      </div>

      {/* Main Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Live Interactive Card View */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C9A44C]">
                Interactive Live Preview
              </span>
              <span className="text-xs text-neutral-500">
                Shows exact mobile experience
              </span>
            </div>

            <div className="p-3 sm:p-6 rounded-3xl bg-neutral-900/5 border border-[#C9A44C]/30 shadow-inner">
              <LiveTemplateRenderer
                invitationData={{
                  mantra:
                    config.defaultMantra ||
                    '॥ श्री गणेशाय नमः ॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
                  welcomeNote:
                    'Together with our families, we invite you to celebrate our wedding ceremonies.',
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
                    title: 'Auspicious Wedding Raag',
                  },
                }}
                designConfiguration={config}
                events={mockEvents}
                isPreview={true}
              />
            </div>
          </div>

          {/* Right Column: Template Info & Customize CTA */}
          <div className="lg:col-span-5 space-y-8 sticky top-24">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-royal-champagne text-royal-maroon border border-[#C9A44C]">
                  {template.category.name}
                </span>
                {template.isPremium ? (
                  <span className="flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-600 text-white">
                    <Sparkles className="w-3 h-3" />
                    <span>Premium Design</span>
                  </span>
                ) : (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-700 text-white">
                    Free Included
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-royal-maroon">
                {template.name}
              </h1>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
                {template.description}
              </p>

              <div className="pt-2">
                <span className="text-xs uppercase text-neutral-400 font-bold block">
                  One-Time License Fee
                </span>
                <span className="text-3xl font-serif font-bold text-royal-burgundy">
                  {isFree ? 'Free Forever' : formatCurrency(template.price)}
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="space-y-3">
              <Link
                href={`/dashboard?createFrom=${template.id}`}
                className="w-full py-4 rounded-2xl bg-royal-maroon text-[#FFF9F0] hover:bg-royal-burgundy font-bold text-base shadow-royal hover:shadow-2xl transition-all flex items-center justify-center space-x-2 border-2 border-[#C9A44C]"
              >
                <Sparkles className="w-5 h-5 text-[#E8D390]" />
                <span>Customize This Template</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <p className="text-[11px] text-center text-neutral-500">
                Instant setup • Replace photos, change fonts, add wedding events in 5 minutes
              </p>
            </div>

            {/* Cultural Palette & Design Breakdown */}
            <div className="p-5 rounded-2xl bg-white border border-[#C9A44C]/30 shadow-xs space-y-4">
              <h4 className="font-serif font-bold text-sm text-royal-maroon">
                Design Science & Color Tokens
              </h4>

              <div className="flex items-center space-x-3">
                <div className="space-y-1 text-center">
                  <div
                    className="w-9 h-9 rounded-full border border-black/10 shadow-xs mx-auto"
                    style={{ backgroundColor: config.colors?.primary || '#800020' }}
                  />
                  <span className="text-[10px] text-neutral-500">Primary</span>
                </div>
                <div className="space-y-1 text-center">
                  <div
                    className="w-9 h-9 rounded-full border border-black/10 shadow-xs mx-auto"
                    style={{ backgroundColor: config.colors?.secondary || '#C9A44C' }}
                  />
                  <span className="text-[10px] text-neutral-500">Secondary</span>
                </div>
                <div className="space-y-1 text-center">
                  <div
                    className="w-9 h-9 rounded-full border border-black/10 shadow-xs mx-auto"
                    style={{ backgroundColor: config.colors?.background || '#FFF9F0' }}
                  />
                  <span className="text-[10px] text-neutral-500">Canvas</span>
                </div>
                <div className="space-y-1 text-center">
                  <div
                    className="w-9 h-9 rounded-full border border-black/10 shadow-xs mx-auto"
                    style={{ backgroundColor: config.colors?.accent || '#5A1024' }}
                  />
                  <span className="text-[10px] text-neutral-500">Accent</span>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 text-xs space-y-1.5">
                <div className="flex justify-between text-neutral-600">
                  <span className="font-medium">Visual Animation:</span>
                  <span className="font-bold text-amber-800 capitalize flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-1" />
                    <span>{config.animationType?.replace(/-/g, ' ') || '3D Royal Entrance'}</span>
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span className="font-medium">Typography:</span>
                  <span className="font-bold text-neutral-800">
                    {config.typography?.heading || 'Playfair Display & Plus Jakarta'}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span className="font-medium">Cultural Motif:</span>
                  <span className="font-bold text-neutral-800 capitalize">
                    {config.culturalMotif?.replace(/-/g, ' ') || 'Royal Invocations'}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span className="font-medium">Aspect Ratio:</span>
                  <span className="font-bold text-neutral-800">9:16 Vertical Mobile First</span>
                </div>
              </div>
            </div>

            {/* Everything Included Checklist */}
            <div className="space-y-2.5 text-xs text-neutral-700">
              <h4 className="font-bold uppercase tracking-wider text-[11px] text-[#C9A44C]">
                Features Included With This Template:
              </h4>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Unlimited personalized guest links with custom name greetings</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Interactive multi-event itinerary with direct Google Maps navigation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>One-tap WhatsApp share button with pre-filled cultural message</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Live attendee RSVP tracker & dietary preference counter</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Instant 300 DPI high-definition PDF download for print presses</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
