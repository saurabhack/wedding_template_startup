'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Eye, ArrowRight, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    previewImage: string;
    price: number | string;
    isPremium: boolean;
    orientation?: string;
    category: {
      name: string;
      slug: string;
    };
    designConfiguration?: any;
  };
  onPreviewClick?: (template: any) => void;
  onCustomizeClick?: (template: any) => void;
}

export default function TemplateCard({
  template,
  onPreviewClick,
  onCustomizeClick,
}: TemplateCardProps) {
  const isFree = Number(template.price) === 0;
  const animationType = template.designConfiguration?.animationType;

  const getAnimationLabel = (type?: string) => {
    switch (type) {
      case 'palace-doors':
        return '🚪 3D Palace Gates';
      case 'falling-petals':
        return '🌸 Rose Petal Drift';
      case 'marigold-shower':
        return '🌼 Marigold Shower';
      case 'temple-bells':
        return '🔔 Temple Bells & Jasmine';
      case 'rotating-mandala':
        return '☸ Sacred Mandala Glow';
      case 'starry-sparkles':
        return '✨ Starry Sparkles';
      case 'floating-diyas':
        return '🪔 Floating Glowing Diyas';
      case 'gold-dust':
        return '⚜ Gold Leaf Drift';
      default:
        return '✨ Animated Experience';
    }
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#C9A44C]/30 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col hover:-translate-y-1">
      {/* Thumbnail Area */}
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
        <img
          src={template.previewImage}
          alt={template.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
          <div className="flex space-x-2">
            {onPreviewClick ? (
              <button
                onClick={() => onPreviewClick(template)}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-white/90 text-royal-maroon hover:bg-white text-xs font-semibold backdrop-blur-sm transition-all shadow-md"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Quick View</span>
              </button>
            ) : (
              <Link
                href={`/templates/${template.slug}`}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-white/90 text-royal-maroon hover:bg-white text-xs font-semibold backdrop-blur-sm transition-all shadow-md"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Details</span>
              </Link>
            )}

            {onCustomizeClick ? (
              <button
                onClick={() => onCustomizeClick(template)}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-royal-maroon text-[#FFF9F0] hover:bg-royal-burgundy text-xs font-semibold transition-all shadow-royal border border-[#C9A44C]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E8D390]" />
                <span>Customize</span>
              </button>
            ) : (
              <Link
                href={`/dashboard?createFrom=${template.id}`}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-royal-maroon text-[#FFF9F0] hover:bg-royal-burgundy text-xs font-semibold transition-all shadow-royal border border-[#C9A44C]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E8D390]" />
                <span>Customize</span>
              </Link>
            )}
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center pointer-events-none">
          <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-royal-maroon shadow-sm border border-[#C9A44C]/30">
            {template.category.name}
          </span>

          {template.isPremium ? (
            <span className="flex items-center space-x-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 text-white shadow-sm border border-amber-300">
              <Sparkles className="w-3 h-3 text-amber-100" />
              <span>Premium</span>
            </span>
          ) : (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-700 text-white shadow-sm">
              Free
            </span>
          )}
        </div>

        {/* Animation Pill Badge */}
        <div className="absolute bottom-3 left-3 pointer-events-none">
          <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md text-[#E8D390] border border-[#C9A44C]/60 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-0.5" />
            <span>{getAnimationLabel(animationType)}</span>
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif font-bold text-lg text-royal-maroon group-hover:text-royal-burgundy transition-colors line-clamp-1">
            {template.name}
          </h3>
          <p className="text-xs text-neutral-600 line-clamp-2 mt-1 leading-relaxed">
            {template.description || 'Authentic traditional Indian invitation design with multi-event schedule and audio support.'}
          </p>
        </div>

        <div className="pt-4 mt-3 border-t border-[#C9A44C]/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase text-neutral-400 block font-semibold">
              License
            </span>
            <span className="text-sm font-bold text-royal-burgundy">
              {isFree ? 'Free Included' : formatCurrency(template.price)}
            </span>
          </div>

          <Link
            href={`/templates/${template.slug}`}
            className="text-xs font-semibold text-royal-maroon hover:text-royal-burgundy flex items-center space-x-1 group/btn"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
