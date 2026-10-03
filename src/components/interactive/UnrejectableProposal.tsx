import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';
import { Heart, Sparkles, Check, Flame } from 'lucide-react';
import { CompanionEmotion } from '../../types';

interface UnrejectableProposalProps {
  onComplete: () => void;
  recipientName: string;
  question?: string;
  photoUrl?: string;
  onCompanionCue?: (emotion: CompanionEmotion, text: string) => void;
}

const DODGE_RESPONSES = [
  'No',
  'Wait, really? 🥺',
  'Are you sure? 🤔',
  'Think again! ✨',
  'Wrong button! 😂',
  'You missed! 😉',
  'Resistance is futile! ❤️',
  'Nice try, keep trying 🏃',
  'Error 404: "No" not found 🤖',
  'Just click Yes already! 💍',
];

export const UnrejectableProposal: React.FC<UnrejectableProposalProps> = ({
  onComplete,
  recipientName,
  question,
  photoUrl,
  onCompanionCue,
}) => {
  const [dodgeCount, setDodgeCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [accepted, setAccepted] = useState(false);
  const arenaRef = useRef<HTMLDivElement>(null);

  const displayQuestion =
    question || `Will you be my Valentine & go on a date with me?`;

  // Scale of YES button grows with every dodge attempt!
  const yesScale = Math.min(1 + dodgeCount * 0.15, 2.2);

  // Dodge movement handler
  const handleDodge = (e?: React.MouseEvent | React.TouchEvent) => {
    if (accepted) return;
    sounds.playDodge();

    const arena = arenaRef.current;
    if (arena) {
      const rect = arena.getBoundingClientRect();
      const maxX = rect.width / 2 - 45;
      const maxY = rect.height / 2 - 25;

      // Generate random offset within boundaries
      const newX = (Math.random() * 2 - 1) * maxX;
      const newY = (Math.random() * 2 - 1) * maxY;

      setNoPosition({ x: newX, y: newY });
    } else {
      setNoPosition({
        x: (Math.random() - 0.5) * 160,
        y: (Math.random() - 0.5) * 120,
      });
    }

    const nextCount = dodgeCount + 1;
    setDodgeCount(nextCount);

    if (nextCount % 2 === 1) {
      onCompanionCue?.('surprised', "Whoa! The 'No' button jumped away! You can't catch it! 😂");
    } else {
      onCompanionCue?.('giggle', "Hehe! There's only one true answer! Tap Yes! ✨");
    }
  };

  const handleAccept = () => {
    if (accepted) return;
    setAccepted(true);
    sounds.playFanfare();
    onCompanionCue?.('loving', "THEY SAID YES!! 💍💖 Best day ever!!");

    // Heart and gold confetti explosion
    const count = 200;
    const defaults = {
      origin: { y: 0.6 },
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#e11d48', '#fda4af', '#f43f5e'],
    });
    fire(0.2, {
      spread: 60,
      colors: ['#fbbf24', '#f59e0b', '#d97706'],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      colors: ['#ff69b4', '#ff1493', '#e11d48'],
    });

    setTimeout(() => {
      onComplete();
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full text-center">
      {/* Category Pill */}
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 mb-3 shadow-xs">
        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> A Momentous Question
      </span>

      {/* Hero photo if provided */}
      {photoUrl && (
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-3">
          <img
            src={photoUrl}
            alt={recipientName}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-rose-900/20 to-transparent" />
        </div>
      )}

      {/* Main question */}
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 font-serif-display max-w-md leading-snug mb-1">
        Dearest {recipientName},
      </h3>
      <p className="text-base sm:text-lg text-rose-900/80 font-serif-display italic max-w-sm mb-4">
        &ldquo;{displayQuestion}&rdquo;
      </p>

      {/* Dodge counter banner if user tried clicking No */}
      {dodgeCount > 0 && !accepted && (
        <div className="flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          <Flame className="w-3.5 h-3.5 text-rose-500" />
          <span>No-button evasion level: {dodgeCount}! The universe says YES!</span>
        </div>
      )}

      {/* Interactive Choice Arena */}
      <div
        ref={arenaRef}
        className="relative w-full max-w-sm h-48 sm:h-52 my-3 rounded-2xl bg-white/60 border border-rose-100 flex items-center justify-center overflow-hidden select-none p-4"
      >
        <AnimatePresence>
          {!accepted ? (
            <div className="relative flex items-center justify-center gap-6 w-full">
              {/* YES BUTTON (Grows larger with every dodge!) */}
              <motion.button
                id="proposal-yes-btn"
                onClick={handleAccept}
                animate={{
                  scale: yesScale,
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                whileHover={{ scale: yesScale * 1.06 }}
                whileTap={{ scale: yesScale * 0.94 }}
                className="z-20 px-6 py-3 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold shadow-lg hover:shadow-rose-300/50 hover:from-rose-500 hover:to-pink-500 flex items-center gap-2 cursor-pointer transition-all duration-150"
              >
                <Heart className="w-4 h-4 fill-white animate-pulse" />
                <span>YES! ❤️</span>
              </motion.button>

              {/* NO BUTTON (Dodges cursor/touch!) */}
              <motion.button
                id="proposal-no-btn"
                onMouseEnter={() => handleDodge()}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleDodge(e);
                }}
                onClick={() => handleDodge()}
                animate={{
                  x: noPosition.x,
                  y: noPosition.y,
                }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                className="z-10 px-4 py-2 rounded-full bg-stone-100 border border-stone-300 text-stone-600 font-medium text-xs hover:bg-stone-200 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
              >
                {DODGE_RESPONSES[dodgeCount % DODGE_RESPONSES.length]}
              </motion.button>
            </div>
          ) : (
            /* Celebration Card */
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="flex flex-col items-center justify-center text-center p-4 bg-white/90 rounded-xl shadow-md border border-rose-200"
            >
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-2">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h4 className="text-lg font-bold text-rose-600 font-serif-display">
                SHE / HE SAID YES! 🎉
              </h4>
              <p className="text-xs text-gray-600 mt-1">
                A new beautiful chapter begins today!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-xs text-stone-400 mt-1">
        {!accepted ? 'Tip: Try clicking "No" if you dare 😉' : 'Scroll down to read the full love letter'}
      </p>
    </div>
  );
};
