'use client';

import React from 'react';

interface RotatingMandalaProps {
  color?: string;
  opacity?: number;
}

export default function RotatingMandala({
  color = '#C9A44C',
  opacity = 0.12,
}: RotatingMandalaProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center z-0">
      <style jsx>{`
        @keyframes rotateClockwise {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes rotateCounterClockwise {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
      `}</style>

      {/* Outer Mandala Ring */}
      <div
        className="absolute w-[580px] h-[580px] max-w-none"
        style={{
          animation: 'rotateClockwise 90s linear infinite',
          opacity,
        }}
      >
        <svg viewBox="0 0 500 500" fill="none" className="w-full h-full">
          <circle cx="250" cy="250" r="230" stroke={color} strokeWidth="2" strokeDasharray="6 6" />
          <circle cx="250" cy="250" r="200" stroke={color} strokeWidth="1.5" />
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 360) / 24;
            return (
              <g key={i} transform={`rotate(${angle} 250 250)`}>
                <path
                  d="M250 50 C260 90 270 110 250 140 C230 110 240 90 250 50"
                  stroke={color}
                  strokeWidth="1.5"
                  fill="none"
                />
                <circle cx="250" cy="45" r="3" fill={color} />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Inner Mandala Ring */}
      <div
        className="absolute w-[380px] h-[380px] max-w-none"
        style={{
          animation: 'rotateCounterClockwise 60s linear infinite',
          opacity: opacity * 1.3,
        }}
      >
        <svg viewBox="0 0 400 400" fill="none" className="w-full h-full">
          <circle cx="200" cy="200" r="160" stroke={color} strokeWidth="2" />
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 360) / 16;
            return (
              <g key={i} transform={`rotate(${angle} 200 200)`}>
                <polygon
                  points="200,60 215,100 200,120 185,100"
                  stroke={color}
                  strokeWidth="1.2"
                  fill="none"
                />
                <circle cx="200" cy="55" r="2.5" fill={color} />
              </g>
            );
          })}
          <circle cx="200" cy="200" r="90" stroke={color} strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      </div>
    </div>
  );
}
