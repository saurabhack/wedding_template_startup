'use client';

import React, { useMemo } from 'react';

export default function FloatingDiyas() {
  const diyas = useMemo(() => {
    return [
      { id: 1, left: 12, size: 28, delay: 0 },
      { id: 2, left: 35, size: 24, delay: 2.5 },
      { id: 3, left: 65, size: 26, delay: 1.2 },
      { id: 4, left: 88, size: 30, delay: 3.8 },
    ];
  }, []);

  return (
    <div className="absolute inset-x-0 bottom-0 h-48 overflow-hidden pointer-events-none z-20">
      <style jsx>{`
        @keyframes floatDiya {
          0% {
            transform: translate3d(0, 40px, 0);
            opacity: 0;
          }
          20% {
            opacity: 0.95;
          }
          80% {
            opacity: 0.9;
          }
          100% {
            transform: translate3d(15px, -180px, 0);
            opacity: 0;
          }
        }
        @keyframes flameFlicker {
          0%, 100% {
            transform: scale(1) rotate(-1deg);
          }
          50% {
            transform: scale(1.15) rotate(2deg);
          }
        }
      `}</style>

      {diyas.map((d) => (
        <div
          key={d.id}
          className="absolute"
          style={{
            left: `${d.left}%`,
            bottom: '0px',
            animation: `floatDiya 8s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite`,
            animationDelay: `${d.delay}s`,
          }}
        >
          <div className="relative flex flex-col items-center">
            {/* Flame */}
            <div
              className="w-3.5 h-6 rounded-full bg-gradient-to-t from-amber-600 via-yellow-400 to-white shadow-[0_0_12px_4px_rgba(255,193,7,0.8)]"
              style={{
                animation: 'flameFlicker 0.6s ease-in-out infinite alternate',
                transformOrigin: 'bottom center',
              }}
            />
            {/* Diya Clay Base */}
            <div className="w-8 h-4 rounded-b-full bg-gradient-to-b from-[#A0522D] to-[#8B4513] border-t border-amber-500 shadow-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
