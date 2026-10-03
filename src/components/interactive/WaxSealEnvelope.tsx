import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';
import { Mail, Sparkles, Heart } from 'lucide-react';
import { CompanionEmotion } from '../../types';

interface WaxSealEnvelopeProps {
  onComplete: () => void;
  senderName: string;
  recipientName: string;
  onCompanionCue?: (emotion: CompanionEmotion, text: string) => void;
}

export const WaxSealEnvelope: React.FC<WaxSealEnvelopeProps> = ({
  onComplete,
  senderName,
  recipientName,
  onCompanionCue,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    sounds.playSparkle();
    onCompanionCue?.('cheering', `The seal is broken! Let's read your letter! 💌`);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#b91c1c', '#f59e0b', '#fbbf24'],
    });

    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 w-full max-w-sm mx-auto select-none">
      <div className="text-center mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Wax-Sealed Letter
        </span>
        <h3 className="text-xl font-bold text-gray-800 font-serif-display">
          A Letter For {recipientName}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {isOpen ? 'Seal broken! Reading letter...' : 'Tap the wax seal to break the seal and open'}
        </p>
      </div>

      {/* Envelope Container */}
      <div className="relative w-72 h-48 sm:w-80 sm:h-52 bg-gradient-to-b from-stone-100 to-amber-50 rounded-xl shadow-2xl border border-amber-200 overflow-hidden flex flex-col justify-end p-4">
        {/* Envelope Flap */}
        <motion.div
          animate={isOpen ? { rotateX: 180, y: -20, opacity: 0.4 } : { rotateX: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{ transformOrigin: 'top center' }}
          className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-amber-100 to-amber-200 clip-path-polygon shadow-md border-b border-amber-300/40 z-20 flex items-center justify-center"
        >
          {/* Inner triangle simulation */}
          <div className="w-0 h-0 border-l-[140px] border-l-transparent border-r-[140px] border-r-transparent border-t-[100px] border-t-amber-100 absolute top-0" />
        </motion.div>

        {/* Letter paper sliding out */}
        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={isOpen ? { y: -45, opacity: 1 } : { y: 0, opacity: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="z-10 bg-white p-4 rounded-lg shadow-lg border border-amber-100 w-11/12 mx-auto"
        >
          <div className="flex items-center justify-between border-b border-rose-100 pb-1 mb-2">
            <span className="text-[10px] text-gray-400 font-mono">STRICTLY CONFIDENTIAL</span>
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          </div>
          <p className="text-xs font-handwriting text-rose-900 text-lg">
            Dearest {recipientName}, this message was sealed with love by {senderName}...
          </p>
        </motion.div>

        {/* Wax Seal Button in Center */}
        {!isOpen && (
          <motion.button
            id="wax-seal-btn"
            onClick={handleOpen}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-30 w-14 h-14 rounded-full bg-gradient-to-br from-red-700 via-rose-800 to-red-900 shadow-xl flex items-center justify-center cursor-pointer border-2 border-red-500/60 group"
          >
            {/* Wax seal ring impression */}
            <div className="w-10 h-10 rounded-full border border-red-400/50 flex items-center justify-center shadow-inner">
              <span className="font-serif-display text-amber-200 text-lg font-bold group-hover:rotate-12 transition-transform">
                H
              </span>
            </div>
            {/* Wax drip details */}
            <div className="absolute -bottom-1 left-2 w-3 h-3 bg-red-900 rounded-full blur-[0.5px]" />
            <div className="absolute -top-1 right-3 w-2.5 h-2.5 bg-red-800 rounded-full blur-[0.5px]" />
          </motion.button>
        )}
      </div>

      {!isOpen && (
        <span className="text-xs text-stone-500 mt-3 flex items-center gap-1">
          <Mail className="w-3.5 h-3.5" /> Tap the seal above
        </span>
      )}
    </div>
  );
};
