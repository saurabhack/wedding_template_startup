'use client';

import React from 'react';

export default function SwingingBells() {
  return (
    <div className="absolute top-0 left-0 right-0 flex justify-between px-6 sm:px-12 pointer-events-none z-20">
      <style jsx>{`
        @keyframes swingLeft {
          0%, 100% {
            transform: rotate(-14deg);
          }
          50% {
            transform: rotate(14deg);
          }
        }
        @keyframes swingRight {
          0%, 100% {
            transform: rotate(14deg);
          }
          50% {
            transform: rotate(-14deg);
          }
        }
      `}</style>

      {/* Left Bell */}
      <div
        className="flex flex-col items-center"
        style={{
          transformOrigin: 'top center',
          animation: 'swingLeft 3.5s ease-in-out infinite',
        }}
      >
        <div className="w-0.5 h-8 bg-gradient-to-b from-[#94762E] to-[#C9A44C]" />
        <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
          <path
            d="M14 2C9 2 7 9 6 18C4 21 3 24 1 26H27C25 24 24 21 22 18C21 9 19 2 14 2Z"
            fill="url(#bell-gold)"
            stroke="#94762E"
            strokeWidth="1"
          />
          <circle cx="14" cy="29" r="3" fill="#D4AF37" stroke="#785E1E" />
          <defs>
            <linearGradient id="bell-gold" x1="0" y1="0" x2="28" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFF2B2" />
              <stop offset="0.5" stopColor="#D4AF37" />
              <stop offset="1" stopColor="#8A6C1E" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Right Bell */}
      <div
        className="flex flex-col items-center"
        style={{
          transformOrigin: 'top center',
          animation: 'swingRight 3.5s ease-in-out infinite',
          animationDelay: '0.4s',
        }}
      >
        <div className="w-0.5 h-8 bg-gradient-to-b from-[#94762E] to-[#C9A44C]" />
        <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
          <path
            d="M14 2C9 2 7 9 6 18C4 21 3 24 1 26H27C25 24 24 21 22 18C21 9 19 2 14 2Z"
            fill="url(#bell-gold-right)"
            stroke="#94762E"
            strokeWidth="1"
          />
          <circle cx="14" cy="29" r="3" fill="#D4AF37" stroke="#785E1E" />
          <defs>
            <linearGradient id="bell-gold-right" x1="0" y1="0" x2="28" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFF2B2" />
              <stop offset="0.5" stopColor="#D4AF37" />
              <stop offset="1" stopColor="#8A6C1E" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
