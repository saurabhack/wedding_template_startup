'use client';

import React, { useMemo } from 'react';

export default function StarrySparkles() {
  const stars = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 3 + Math.random() * 4,
      duration: 1.5 + Math.random() * 3,
      delay: Math.random() * 3,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(0.7);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }
      `}</style>

      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-amber-200"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            boxShadow: '0 0 6px 2px rgba(255, 235, 150, 0.7)',
            animation: `twinkle ${s.duration}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
