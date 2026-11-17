'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, KeyRound } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PalaceDoorsOverlayProps {
  brideName: string;
  groomName: string;
  onOpen?: () => void;
}

export default function PalaceDoorsOverlay({
  brideName,
  groomName,
  onOpen,
}: PalaceDoorsOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenDoors = () => {
    setIsOpen(true);
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.5 },
      colors: ['#D4AF37', '#800020', '#E8D390', '#FFD700'],
    });
    if (onOpen) onOpen();
  };

  return (
    <div className="relative w-full overflow-hidden">
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, delay: 0.5 } }}
            className="absolute inset-0 z-40 flex items-center justify-center [perspective:1400px] bg-black/60 backdrop-blur-xs"
          >
            {/* Left Palace Door */}
            <motion.div
              initial={{ rotateY: 0 }}
              animate={isOpen ? { rotateY: -115, x: '-20%' } : { rotateY: 0 }}
              transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
              style={{ transformOrigin: 'left center' }}
              className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-[#4A0815] via-[#680C1F] to-[#800020] border-r-2 border-[#C9A44C] shadow-2xl flex flex-col items-end justify-center pr-4 overflow-hidden"
            >
              {/* Ornate Gold Filigree & Arch Pattern */}
              <div className="absolute inset-2 border border-[#C9A44C]/40 rounded-l-2xl pointer-events-none" />
              <div className="absolute top-8 left-4 text-3xl text-[#C9A44C] opacity-40">⚜</div>
              <div className="absolute bottom-8 left-4 text-3xl text-[#C9A44C] opacity-40">⚜</div>

              {/* Decorative Door Knocker */}
              <div className="relative z-10 w-16 h-16 rounded-full border-4 border-[#C9A44C] bg-gradient-to-b from-[#E8D390] to-[#94762E] shadow-xl flex items-center justify-center text-xl text-[#3B0713]">
                🪔
              </div>
            </motion.div>

            {/* Right Palace Door */}
            <motion.div
              initial={{ rotateY: 0 }}
              animate={isOpen ? { rotateY: 115, x: '20%' } : { rotateY: 0 }}
              transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
              style={{ transformOrigin: 'right center' }}
              className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#4A0815] via-[#680C1F] to-[#800020] border-l-2 border-[#C9A44C] shadow-2xl flex flex-col items-start justify-center pl-4 overflow-hidden"
            >
              {/* Ornate Gold Filigree & Arch Pattern */}
              <div className="absolute inset-2 border border-[#C9A44C]/40 rounded-r-2xl pointer-events-none" />
              <div className="absolute top-8 right-4 text-3xl text-[#C9A44C] opacity-40">⚜</div>
              <div className="absolute bottom-8 right-4 text-3xl text-[#C9A44C] opacity-40">⚜</div>

              {/* Decorative Door Knocker */}
              <div className="relative z-10 w-16 h-16 rounded-full border-4 border-[#C9A44C] bg-gradient-to-b from-[#E8D390] to-[#94762E] shadow-xl flex items-center justify-center text-xl text-[#3B0713]">
                🪔
              </div>
            </motion.div>

            {/* Center Royal Seal Emblem & Click Trigger */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenDoors}
              className="relative z-50 flex flex-col items-center cursor-pointer p-6 rounded-3xl bg-neutral-900/90 border-2 border-[#C9A44C] shadow-2xl max-w-xs text-center backdrop-blur-md"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#E8D390] to-[#C9A44C] flex items-center justify-center text-3xl shadow-royal mb-2 border border-white">
                👑
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E8D390]">
                Shubh Vivah Invocations
              </span>
              <h3 className="font-serif font-bold text-lg text-white my-1">
                {brideName} & {groomName}
              </h3>
              <p className="text-[11px] text-neutral-300 font-light mb-3">
                Tap to swing open the royal palace gates
              </p>
              <div className="px-5 py-2 rounded-full bg-gradient-to-r from-[#E8D390] to-[#C9A44C] text-[#2A1810] text-xs font-bold uppercase tracking-wider shadow-md flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open Royal Gates</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
