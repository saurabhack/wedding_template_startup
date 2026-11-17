'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Volume2,
  VolumeX,
  Share2,
  Download,
  Sparkles,
  QrCode,
  CheckCircle,
  ExternalLink,
  RotateCcw,
  Eye,
  Sliders,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import FallingPetals, { PetalType } from '@/components/animations/FallingPetals';
import RotatingMandala from '@/components/animations/RotatingMandala';
import SwingingBells from '@/components/animations/SwingingBells';
import StarrySparkles from '@/components/animations/StarrySparkles';
import FloatingDiyas from '@/components/animations/FloatingDiyas';
import PalaceDoorsOverlay from '@/components/animations/PalaceDoorsOverlay';

export interface LiveTemplateRendererProps {
  invitationData: any;
  designConfiguration: any;
  events?: any[];
  familyMembers?: any[];
  guestInfo?: {
    fullName: string;
    familyName?: string | null;
    personalizedMessage?: string | null;
    token?: string;
    allowedEventIds?: string[] | null;
  } | null;
  isPreview?: boolean;
  onRsvpClick?: () => void;
  onPdfDownload?: () => void;
  onWhatsAppShare?: () => void;
}

export default function LiveTemplateRenderer({
  invitationData,
  designConfiguration = {},
  events = [],
  familyMembers = [],
  guestInfo,
  isPreview = false,
  onRsvpClick,
  onPdfDownload,
  onWhatsAppShare,
}: LiveTemplateRendererProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationsActive, setAnimationsActive] = useState(true);
  const [doorsOpenKey, setDoorsOpenKey] = useState(0); // Trigger to replay doors
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Extract design tokens with safe defaults
  const theme = designConfiguration.themeId || 'royal-rajasthani';
  const animationType = designConfiguration.animationType || 'palace-doors';

  const colors = {
    primary: invitationData?.customStyling?.primaryColor || designConfiguration?.colors?.primary || '#800020',
    secondary: invitationData?.customStyling?.secondaryColor || designConfiguration?.colors?.secondary || '#C9A44C',
    background: invitationData?.customStyling?.backgroundColor || designConfiguration?.colors?.background || '#FFF9F0',
    surface: designConfiguration?.colors?.surface || '#FDF5E6',
    text: designConfiguration?.colors?.text || '#2A1810',
    goldText: designConfiguration?.colors?.goldText || '#C9A44C',
  };

  const couple = invitationData?.couple || {
    bride: { name: 'Priya Sharma', parents: 'Smt. Sunita & Shri Ramesh Sharma' },
    groom: { name: 'Rohan Singhania', parents: 'Smt. Rekha & Shri Vikram Singhania' },
    hashtag: '#PriyaFoundHerRohan',
  };

  const mantra = invitationData?.mantra || designConfiguration?.defaultMantra || '॥ श्री गणेशाय नमः ॥';
  const welcomeNote = invitationData?.welcomeNote || 'Together with our families, we invite you to celebrate our wedding.';
  const story = invitationData?.story;
  const audio = invitationData?.audio;
  const shagun = invitationData?.shagunRegistry;

  // Filter events based on guest allowedEventIds if present
  const displayEvents = events.filter((ev) => {
    if (!guestInfo?.allowedEventIds || guestInfo.allowedEventIds.length === 0) return true;
    return guestInfo.allowedEventIds.includes(ev.id);
  });

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // Cultural Motif SVG Icons
  const renderCulturalMotif = () => {
    if (theme === 'muslim-nikah') {
      return (
        <div className="flex flex-col items-center justify-center space-y-1 py-3 text-emerald-800">
          <span className="text-3xl animate-pulse">🌙</span>
          <span className="text-xs tracking-widest uppercase font-serif font-bold text-amber-600">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </span>
        </div>
      );
    }
    if (theme === 'punjabi') {
      return (
        <div className="flex flex-col items-center justify-center space-y-1 py-3">
          <span className="text-3xl text-amber-700 font-bold hover:scale-110 transition-transform">ੴ</span>
          <span className="text-xs tracking-widest uppercase font-serif font-bold text-amber-800">
            Anand Karaj
          </span>
        </div>
      );
    }
    if (theme === 'christian') {
      return (
        <div className="flex flex-col items-center justify-center space-y-1 py-3">
          <span className="text-3xl text-slate-700">✝</span>
          <span className="text-xs tracking-widest uppercase font-serif text-slate-600">
            Holy Matrimony
          </span>
        </div>
      );
    }
    if (theme === 'south-indian') {
      return (
        <div className="flex flex-col items-center justify-center space-y-1 py-3">
          <div className="w-14 h-14 rounded-full border-2 border-amber-600 flex items-center justify-center text-2xl bg-amber-50 shadow-md">
            🛕
          </div>
          <span className="text-xs tracking-widest uppercase font-serif font-bold text-red-900 mt-1">
            ॥ சுப முகூர்த்தம் ॥
          </span>
        </div>
      );
    }
    // Default Traditional Hindu & Rajasthani
    return (
      <div className="flex flex-col items-center justify-center space-y-1 py-3">
        <div className="w-14 h-14 rounded-full border-2 border-[#C9A44C] flex items-center justify-center text-2xl bg-amber-50 shadow-md hover:rotate-12 transition-transform">
          🪔
        </div>
        <div className="text-sm font-devanagari font-bold text-red-900 tracking-wider">
          {mantra.split('॥')[1] ? `॥ ${mantra.split('॥')[1]} ॥` : '॥ श्री गणेशाय नमः ॥'}
        </div>
      </div>
    );
  };

  return (
    <div
      id="invitation-render-container"
      className="relative w-full max-w-2xl mx-auto rounded-3xl shadow-2xl overflow-hidden border-4 transition-all duration-300"
      style={{
        backgroundColor: colors.background,
        borderColor: colors.secondary,
        color: colors.text,
      }}
    >
      {/* 3D Palace Doors Entrance Animation if enabled */}
      {animationsActive && animationType === 'palace-doors' && (
        <PalaceDoorsOverlay
          key={doorsOpenKey}
          brideName={couple.bride?.name || 'Bride'}
          groomName={couple.groom?.name || 'Groom'}
        />
      )}

      {/* Background Animated Atmosphere Layers */}
      {animationsActive && (
        <>
          {/* Rotating Mandala Background */}
          {(animationType === 'rotating-mandala' ||
            animationType === 'gold-dust' ||
            animationType === 'floating-diyas' ||
            animationType === 'temple-bells') && (
            <RotatingMandala color={colors.secondary} opacity={0.15} />
          )}

          {/* Falling Flower Petals */}
          {animationType === 'falling-petals' && <FallingPetals type="rose" count={22} />}
          {animationType === 'palace-doors' && <FallingPetals type="rose" count={16} />}
          {animationType === 'marigold-shower' && <FallingPetals type="marigold" count={25} />}
          {animationType === 'temple-bells' && <FallingPetals type="jasmine" count={22} />}
          {animationType === 'gold-dust' && <FallingPetals type="gold-leaf" count={24} />}

          {/* Swinging Brass Temple Bells */}
          {animationType === 'temple-bells' && <SwingingBells />}

          {/* Starry Twinkling Sparkles */}
          {animationType === 'starry-sparkles' && <StarrySparkles />}

          {/* Floating Glowing Diyas */}
          {(animationType === 'floating-diyas' || animationType === 'rotating-mandala') && (
            <FloatingDiyas />
          )}
        </>
      )}

      {/* Audio Element */}
      {audio?.enabled && audio?.trackUrl && (
        <audio ref={audioRef} src={audio.trackUrl} loop />
      )}

      {/* Floating Toolbar & Animation Control Strip */}
      <div className="sticky top-3 z-40 px-3 sm:px-4 flex justify-between items-center pointer-events-none">
        {/* Left Guest Badge or Animated Badge */}
        <div className="pointer-events-auto flex items-center space-x-1.5">
          {guestInfo ? (
            <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-400 shadow-md flex items-center space-x-1.5 text-xs font-semibold text-royal-maroon">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
              <span>Honoring: {guestInfo.fullName}</span>
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#C9A44C]/40 shadow-xs flex items-center space-x-1 text-[11px] font-bold text-royal-maroon">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Animated Experience</span>
            </div>
          )}
        </div>

        {/* Right Floating Actions */}
        <div className="pointer-events-auto flex items-center space-x-1.5">
          {/* Replay Animation Trigger */}
          {animationType === 'palace-doors' && (
            <button
              onClick={() => setDoorsOpenKey((prev) => prev + 1)}
              className="p-2 rounded-full bg-white/90 text-neutral-800 hover:text-royal-maroon shadow-md border border-neutral-300 transition-all"
              title="Replay Royal Gate Opening"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Toggle Animation On/Off */}
          <button
            onClick={() => setAnimationsActive(!animationsActive)}
            className={`p-2 rounded-full shadow-md border transition-all text-xs font-bold ${
              animationsActive
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-white/90 text-neutral-400 border-neutral-200'
            }`}
            title={animationsActive ? 'Pause Visual Animations' : 'Enable Visual Animations'}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          {audio?.enabled && audio?.trackUrl && (
            <button
              onClick={toggleAudio}
              className={`p-2 rounded-full backdrop-blur-md shadow-md border transition-all ${
                isPlaying
                  ? 'bg-amber-600 text-white border-amber-400 animate-pulse'
                  : 'bg-white/90 text-neutral-800 border-neutral-300'
              }`}
              title={isPlaying ? 'Mute Music' : 'Play Auspicious Music'}
            >
              {isPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          )}

          {onPdfDownload && (
            <button
              onClick={onPdfDownload}
              className="p-2 rounded-full bg-white/90 backdrop-blur-md text-neutral-800 hover:text-royal-maroon border border-neutral-300 shadow-md transition-all"
              title="Download Printable PDF"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}

          {onWhatsAppShare && (
            <button
              onClick={onWhatsAppShare}
              className="p-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 shadow-md transition-all"
              title="Share via WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Ornate Corner Elements */}
      <div className="absolute top-2 left-2 text-[#C9A44C] opacity-70 pointer-events-none text-2xl">
        ⚜
      </div>
      <div className="absolute top-2 right-2 text-[#C9A44C] opacity-70 pointer-events-none text-2xl">
        ⚜
      </div>
      <div className="absolute bottom-2 left-2 text-[#C9A44C] opacity-70 pointer-events-none text-2xl">
        ⚜
      </div>
      <div className="absolute bottom-2 right-2 text-[#C9A44C] opacity-70 pointer-events-none text-2xl">
        ⚜
      </div>

      {/* Hero Invitation Section */}
      <div className="px-6 sm:px-10 pt-10 pb-12 text-center relative border-b border-dashed border-[#C9A44C]/40 z-10">
        {renderCulturalMotif()}

        <p className="text-xs sm:text-sm font-devanagari italic text-neutral-700 max-w-lg mx-auto mt-2 leading-relaxed">
          {mantra}
        </p>

        {/* Personalized Guest Welcome Banner */}
        {guestInfo && (
          <div className="my-6 p-4 rounded-2xl bg-amber-100/70 border border-amber-300 max-w-md mx-auto shadow-sm animate-in fade-in">
            <span className="text-[10px] uppercase tracking-widest text-amber-900 font-bold block mb-1">
              Personal Invitation For
            </span>
            <h4 className="text-lg font-serif font-bold text-royal-maroon">
              {guestInfo.fullName}
              {guestInfo.familyName ? ` & ${guestInfo.familyName}` : ''}
            </h4>
            {guestInfo.personalizedMessage && (
              <p className="text-xs text-neutral-700 mt-1 italic font-light">
                "{guestInfo.personalizedMessage}"
              </p>
            )}
          </div>
        )}

        <div className="my-6">
          <span className="text-[11px] font-semibold tracking-widest uppercase text-[#C9A44C] block mb-2">
            Warmly Request The Honour Of Your Gracious Presence
          </span>
          <p className="text-xs sm:text-sm text-neutral-700 max-w-md mx-auto leading-relaxed">
            {welcomeNote}
          </p>
        </div>

        {/* The Couple Portraits & Names */}
        <div className="my-8 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
          {/* Bride */}
          <div className="flex flex-col items-center max-w-[200px]">
            {couple.bride?.photo ? (
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#C9A44C] shadow-lg mb-3 hover:scale-105 transition-transform duration-300">
                <img
                  src={couple.bride.photo}
                  alt={couple.bride.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-amber-100 border-2 border-[#C9A44C] flex items-center justify-center text-3xl mb-3 shadow-sm">
                👰‍♀️
              </div>
            )}
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-royal-maroon">
              {couple.bride?.name || 'Bride Name'}
            </h3>
            <p className="text-[11px] text-neutral-600 mt-1 font-light">
              {couple.bride?.parents || 'Daughter of Beloved Parents'}
            </p>
          </div>

          {/* Golden Union Sign */}
          <div className="flex flex-col items-center">
            <span className="text-2xl font-serif text-[#C9A44C] italic font-bold">
              weds
            </span>
            <div className="w-8 h-0.5 bg-[#C9A44C] my-1" />
            <Heart className="w-5 h-5 fill-red-800 text-red-800 animate-pulse" />
          </div>

          {/* Groom */}
          <div className="flex flex-col items-center max-w-[200px]">
            {couple.groom?.photo ? (
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#C9A44C] shadow-lg mb-3 hover:scale-105 transition-transform duration-300">
                <img
                  src={couple.groom.photo}
                  alt={couple.groom.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-amber-100 border-2 border-[#C9A44C] flex items-center justify-center text-3xl mb-3 shadow-sm">
                🤵‍♂️
              </div>
            )}
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-royal-maroon">
              {couple.groom?.name || 'Groom Name'}
            </h3>
            <p className="text-[11px] text-neutral-600 mt-1 font-light">
              {couple.groom?.parents || 'Son of Beloved Parents'}
            </p>
          </div>
        </div>

        {/* Wedding Hashtag */}
        {couple.hashtag && (
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/80 border border-[#C9A44C]/40 text-xs font-semibold text-royal-burgundy shadow-sm hover:scale-105 transition-transform">
            {couple.hashtag}
          </div>
        )}
      </div>

      {/* Family Blessings Section */}
      {familyMembers.length > 0 && (
        <div className="px-6 sm:px-10 py-10 bg-black/5 border-b border-[#C9A44C]/30 text-center relative z-10">
          <span className="text-[10px] uppercase tracking-widest text-[#C9A44C] font-bold block mb-1">
            Divine Ancestral Blessings
          </span>
          <h4 className="font-serif font-bold text-lg text-royal-maroon mb-6">
            With Blessings of Family & Elders
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left">
            {familyMembers.map((fm, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white/80 backdrop-blur-xs border border-[#C9A44C]/30 shadow-xs flex items-center space-x-3 hover:bg-white transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-amber-100 border border-[#C9A44C] flex items-center justify-center text-xs text-amber-800 font-bold shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <h5 className="font-bold text-xs text-neutral-800">{fm.fullName}</h5>
                  <p className="text-[10px] text-neutral-500 font-medium">{fm.relationship}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wedding Functions Itinerary */}
      <div className="px-6 sm:px-10 py-12 relative z-10">
        <div className="text-center mb-8">
          <span className="text-[11px] uppercase tracking-widest text-[#C9A44C] font-bold block mb-1">
            Auspicious Ceremonies
          </span>
          <h3 className="font-serif font-bold text-2xl text-royal-maroon">
            Wedding Itinerary & Functions
          </h3>
          <div className="w-16 h-0.5 bg-[#C9A44C] mx-auto mt-2" />
        </div>

        <div className="space-y-6">
          {displayEvents.map((ev, index) => (
            <div
              key={index}
              className="p-5 sm:p-6 rounded-2xl bg-white/90 backdrop-blur-xs border border-[#C9A44C]/40 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#C9A44C]/10 rounded-bl-full flex items-start justify-end p-2 text-xs font-bold text-[#C9A44C]">
                #{index + 1}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <h4 className="font-serif font-bold text-lg text-royal-maroon">
                    {ev.eventName}
                  </h4>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-600 font-medium">
                    {ev.eventDate && (
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-[#C9A44C]" />
                        <span>{formatDate(ev.eventDate)}</span>
                      </span>
                    )}
                    {ev.startTime && (
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-[#C9A44C]" />
                        <span>
                          {ev.startTime} {ev.endTime ? `– ${ev.endTime}` : ''}
                        </span>
                      </span>
                    )}
                  </div>

                  {ev.description && (
                    <p className="text-xs text-neutral-600 leading-relaxed font-light">
                      {ev.description}
                    </p>
                  )}

                  {ev.dressCode && (
                    <div className="text-[11px] text-amber-900 font-medium bg-amber-50 inline-block px-2.5 py-1 rounded-md border border-amber-200">
                      Dress Code: {ev.dressCode}
                    </div>
                  )}

                  <div className="pt-2 text-xs text-neutral-700">
                    <p className="font-bold flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-red-700 shrink-0" />
                      <span>{ev.venue}</span>
                    </p>
                    {ev.address && (
                      <p className="text-[11px] text-neutral-500 pl-4 mt-0.5">{ev.address}</p>
                    )}
                  </div>
                </div>

                {/* Google Maps Button */}
                {ev.mapUrl && (
                  <div className="sm:self-center">
                    <a
                      href={ev.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-800 border border-neutral-300 transition-colors shadow-xs"
                    >
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      <span>Google Maps</span>
                      <ExternalLink className="w-3 h-3 text-neutral-400" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Love Story Section if present */}
      {story?.headline && (
        <div className="px-6 sm:px-10 py-10 bg-amber-50/60 border-t border-[#C9A44C]/30 text-center relative z-10">
          <Heart className="w-6 h-6 text-royal-maroon mx-auto mb-2 fill-royal-maroon/20" />
          <h4 className="font-serif font-bold text-xl text-royal-maroon mb-2">
            {story.headline}
          </h4>
          <p className="text-xs text-neutral-700 max-w-lg mx-auto leading-relaxed font-light italic">
            "{story.description}"
          </p>

          {/* Photo memories if provided */}
          {Array.isArray(story.gallery) && story.gallery.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 max-w-md mx-auto">
              {story.gallery.map((imgUrl: string, idx: number) => (
                <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-[#C9A44C]/40 shadow-xs hover:scale-105 transition-transform duration-300">
                  <img src={imgUrl} alt="Memory" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Shagun Registry (Lifafa) if configured */}
      {shagun?.enabled && (
        <div className="px-6 sm:px-10 py-10 border-t border-[#C9A44C]/30 bg-white/95 text-center relative z-10">
          <div className="w-10 h-10 rounded-full bg-amber-100 border border-[#C9A44C] flex items-center justify-center text-lg mx-auto mb-2">
            🧧
          </div>
          <h4 className="font-serif font-bold text-lg text-royal-maroon">
            Digital Shagun & Blessings
          </h4>
          <p className="text-xs text-neutral-600 max-w-md mx-auto mt-1 mb-4">
            {shagun.note || 'Your presence and prayers are our greatest gift.'}
          </p>

          {shagun.upiId && (
            <div className="inline-flex flex-col items-center p-4 rounded-2xl bg-neutral-50 border border-neutral-200 shadow-xs">
              {shagun.qrCodeUrl ? (
                <img
                  src={shagun.qrCodeUrl}
                  alt="UPI QR Code"
                  className="w-36 h-36 object-contain mb-2 rounded-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-neutral-200 rounded-lg flex items-center justify-center mb-2">
                  <QrCode className="w-8 h-8 text-neutral-500" />
                </div>
              )}
              <span className="text-xs font-mono font-bold text-neutral-800 bg-white px-3 py-1 rounded-full border">
                UPI ID: {shagun.upiId}
              </span>
            </div>
          )}
        </div>
      )}

      {/* RSVP Action Footer */}
      <div className="px-6 sm:px-10 py-10 bg-royal-maroon text-[#FFF9F0] text-center border-t-2 border-[#C9A44C] relative z-10">
        <h4 className="font-serif font-bold text-xl text-[#E8D390]">
          Kindly Grace Us With Your Response
        </h4>
        <p className="text-xs text-neutral-300 max-w-md mx-auto mt-1 mb-6 font-light">
          Please confirm your attendance so we can make personalized arrangements for you and your family.
        </p>

        {onRsvpClick ? (
          <button
            onClick={onRsvpClick}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#E8D390] to-[#C9A44C] text-[#2A1810] font-bold text-sm shadow-xl hover:scale-105 transition-all border border-amber-300"
          >
            Confirm Your RSVP
          </button>
        ) : (
          <div className="inline-block px-6 py-2.5 rounded-full bg-white/10 text-xs font-medium text-amber-200 border border-amber-300/30">
            RSVP Link Available on Live Guest Invitation
          </div>
        )}

        <div className="mt-8 text-[11px] text-[#E8D390]/80 font-serif">
          ॥ शुभं करोति कल्याणम् आरोग्यम् धनसंपदा ॥
        </div>
      </div>
    </div>
  );
}
