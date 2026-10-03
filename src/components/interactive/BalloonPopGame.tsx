import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';
import { Sparkles, Trophy } from 'lucide-react';
import { CompanionEmotion } from '../../types';

interface BalloonPopGameProps {
  onComplete: () => void;
  recipientName: string;
  onCompanionCue?: (emotion: CompanionEmotion, text: string) => void;
}

interface BalloonItem {
  id: number;
  letter: string;
  compliment: string;
  color: string;
  popped: boolean;
  xOffset: number;
  yOffset: number;
  delay: number;
}

const BALLOON_COLORS = [
  'bg-rose-400 border-rose-300 shadow-rose-200',
  'bg-amber-400 border-amber-300 shadow-amber-200',
  'bg-emerald-400 border-emerald-300 shadow-emerald-200',
  'bg-sky-400 border-sky-300 shadow-sky-200',
  'bg-purple-400 border-purple-300 shadow-purple-200',
  'bg-pink-400 border-pink-300 shadow-pink-200',
];

export const BalloonPopGame: React.FC<BalloonPopGameProps> = ({
  onComplete,
  recipientName,
  onCompanionCue,
}) => {
  const [balloons, setBalloons] = useState<BalloonItem[]>([
    { id: 1, letter: '✨', compliment: 'Pure Sunshine', color: BALLOON_COLORS[0], popped: false, xOffset: -24, yOffset: 10, delay: 0 },
    { id: 2, letter: '❤️', compliment: 'Infinite Warmth', color: BALLOON_COLORS[1], popped: false, xOffset: 28, yOffset: -12, delay: 0.2 },
    { id: 3, letter: '🎉', compliment: 'Unstoppable Joy', color: BALLOON_COLORS[2], popped: false, xOffset: -15, yOffset: -25, delay: 0.4 },
    { id: 4, letter: '🌟', compliment: 'True Inspiration', color: BALLOON_COLORS[3], popped: false, xOffset: 20, yOffset: 20, delay: 0.1 },
    { id: 5, letter: '💫', compliment: 'Kindest Soul', color: BALLOON_COLORS[4], popped: false, xOffset: 0, yOffset: -5, delay: 0.3 },
  ]);

  const [activeCompliment, setActiveCompliment] = useState<string | null>(null);

  const poppedCount = balloons.filter((b) => b.popped).length;
  const isFinished = poppedCount === balloons.length;

  const handlePop = (id: number, event: React.MouseEvent | React.TouchEvent) => {
    const target = balloons.find((b) => b.id === id);
    if (!target || target.popped) return;

    sounds.playPop();

    // Trigger localized confetti burst from click origin
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 28,
      spread: 60,
      origin: { x, y },
      colors: ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'],
    });

    setActiveCompliment(target.compliment);

    const updated = balloons.map((b) => (b.id === id ? { ...b, popped: true } : b));
    setBalloons(updated);

    if (updated.every((b) => b.popped)) {
      onCompanionCue?.('loving', `All balloons popped! You're spectacular! 🌟`);
      setTimeout(() => {
        sounds.playFanfare();
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
        onComplete();
      }, 700);
    } else {
      onCompanionCue?.('cheering', `Pop! "${target.compliment}"! Keep popping! 🎈`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      <div className="text-center mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Interactive Surprise
        </span>
        <h3 className="text-xl font-bold text-gray-800 font-serif-display">
          Pop all balloons to reveal your surprise, {recipientName}!
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {isFinished ? 'All balloons popped!' : `Tap each balloon to pop it (${poppedCount}/${balloons.length})`}
        </p>
      </div>

      {/* Floating Compliment Toast */}
      <div className="h-8 mb-2 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {activeCompliment && (
            <motion.div
              key={activeCompliment}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-4 py-1.5 rounded-full bg-white shadow-sm border border-rose-200 text-xs font-medium text-rose-700"
            >
              Unlocked: <span className="font-bold">{activeCompliment}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Balloon Floating Arena */}
      <div className="relative w-full max-w-sm h-64 sm:h-72 my-2 bg-gradient-to-b from-sky-50/50 to-white/70 rounded-3xl border border-dashed border-sky-200 flex items-center justify-center overflow-hidden">
        {/* Floating clouds decoration */}
        <div className="absolute top-4 left-6 w-14 h-6 bg-white/70 rounded-full blur-[1px]" />
        <div className="absolute top-10 right-8 w-20 h-7 bg-white/60 rounded-full blur-[1px]" />

        <div className="relative flex flex-wrap items-center justify-center gap-4 sm:gap-6 p-4">
          {balloons.map((b) => (
            <div key={b.id} className="relative select-none">
              {!b.popped ? (
                <motion.button
                  id={`balloon-btn-${b.id}`}
                  onClick={(e) => handlePop(b.id, e)}
                  animate={{
                    y: [0, -12, 0],
                    rotate: [-3, 3, -3],
                  }}
                  transition={{
                    duration: 3 + b.id * 0.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: b.delay,
                  }}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.85 }}
                  className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-[50%_50%_50%_50%_/_40%_40%_60%_60%] ${b.color} text-white font-bold flex flex-col items-center justify-center shadow-lg cursor-pointer transition-transform`}
                >
                  {/* Balloon reflection shine */}
                  <div className="absolute top-2 left-3 w-4 h-6 bg-white/35 rounded-full rotate-[-20deg]" />
                  <span className="text-xl sm:text-2xl drop-shadow-sm">{b.letter}</span>

                  {/* Knot and string */}
                  <div className="absolute -bottom-1.5 w-2.5 h-2 bg-inherit rounded-sm" />
                  <svg className="absolute -bottom-8 w-4 h-8 overflow-visible stroke-gray-400" fill="none">
                    <path d="M 8 0 Q 12 12, 6 24" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </motion.button>
              ) : (
                <motion.div
                  initial={{ scale: 1.3, opacity: 1 }}
                  animate={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-16 h-20 sm:w-20 sm:h-24 flex items-center justify-center"
                >
                  <span className="text-2xl">💥</span>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {isFinished && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 flex items-center gap-2 text-rose-600 font-semibold text-sm"
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Card Unlocked! Scroll down to read your message</span>
        </motion.div>
      )}
    </div>
  );
};
