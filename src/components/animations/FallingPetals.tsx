'use client';

import React, { useMemo } from 'react';

export type PetalType = 'rose' | 'marigold' | 'jasmine' | 'lotus' | 'gold-leaf';

interface FallingPetalsProps {
  type?: PetalType;
  count?: number;
}

export default function FallingPetals({ type = 'rose', count = 20 }: FallingPetalsProps) {
  // Generate random trajectories for natural organic falling
  const petals = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const left = Math.random() * 100; // 0 to 100%
      const duration = 5 + Math.random() * 6; // 5 to 11s
      const delay = Math.random() * 7; // 0 to 7s
      const size = 16 + Math.random() * 14; // 16 to 30px
      const rotateSpeed = 3 + Math.random() * 4; // 3 to 7s

      return { id: i, left, duration, delay, size, rotateSpeed };
    });
  }, [count, type]);

  // Petal SVG and Colors
  const renderPetalShape = (petalSize: number) => {
    if (type === 'marigold') {
      return (
        <svg width={petalSize} height={petalSize} viewBox="0 0 30 30" fill="none">
          <path
            d="M15 0C18 7 24 10 30 15C24 20 18 23 15 30C12 23 6 20 0 15C6 10 12 7 15 0Z"
            fill="url(#marigold-grad)"
          />
          <defs>
            <linearGradient id="marigold-grad" x1="0" y1="0" x2="30" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFA000" />
              <stop offset="0.6" stopColor="#FF6F00" />
              <stop offset="1" stopColor="#E65100" />
            </linearGradient>
          </defs>
        </svg>
      );
    }

    if (type === 'jasmine') {
      return (
        <svg width={petalSize * 0.9} height={petalSize * 0.9} viewBox="0 0 24 24" fill="none">
          <ellipse cx="12" cy="12" rx="5" ry="11" fill="#FFFFFF" />
          <ellipse cx="12" cy="12" rx="3" ry="9" fill="#FFFDE7" />
          <circle cx="12" cy="12" r="2.5" fill="#FFF59D" />
        </svg>
      );
    }

    if (type === 'gold-leaf') {
      return (
        <svg width={petalSize * 0.8} height={petalSize * 0.8} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z"
            fill="url(#gold-leaf-grad)"
          />
          <defs>
            <linearGradient id="gold-leaf-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFF2B2" />
              <stop offset="0.5" stopColor="#D4AF37" />
              <stop offset="1" stopColor="#997A15" />
            </linearGradient>
          </defs>
        </svg>
      );
    }

    // Default: Rose Petal
    return (
      <svg width={petalSize} height={petalSize * 1.2} viewBox="0 0 24 30" fill="none">
        <path
          d="M12 0C17 5 24 12 23 20C22 26 18 30 12 30C6 30 2 26 1 20C0 12 7 5 12 0Z"
          fill="url(#rose-grad)"
          opacity="0.85"
        />
        <defs>
          <linearGradient id="rose-grad" x1="0" y1="0" x2="24" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E91E63" />
            <stop offset="0.4" stopColor="#C2185B" />
            <stop offset="1" stopColor="#880E4F" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      <style jsx>{`
        @keyframes fallAndSway {
          0% {
            transform: translate3d(0, -50px, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.9;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translate3d(60px, 110vh, 0) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>

      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: '-40px',
            animation: `fallAndSway ${p.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite`,
            animationDelay: `${p.delay}s`,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
          }}
        >
          <div
            style={{
              animation: `spin ${p.rotateSpeed}s linear infinite`,
            }}
          >
            {renderPetalShape(p.size)}
          </div>
        </div>
      ))}
    </div>
  );
}
