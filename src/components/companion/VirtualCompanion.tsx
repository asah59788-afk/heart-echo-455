import React, { useState, useEffect } from 'react';
import { CompanionConfig, CompanionEmotion } from '../../types';
import { CompanionSprite } from './CompanionSprites';
import { sounds } from '../../utils/audio';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Heart, Sparkles, X, Volume2, VolumeX } from 'lucide-react';

interface VirtualCompanionProps {
  config: CompanionConfig;
  emotion?: CompanionEmotion;
  dialogueText?: string;
  mode?: 'floating' | 'docked' | 'preview';
  recipientName?: string;
  isContained?: boolean;
  onTapCompanion?: () => void;
  className?: string;
}

export const VirtualCompanion: React.FC<VirtualCompanionProps> = ({
  config,
  emotion: externalEmotion,
  dialogueText,
  mode = 'floating',
  recipientName,
  isContained = false,
  onTapCompanion,
  className = '',
}) => {
  // Local state for emotion to allow touch-triggered giggles
  const [internalEmotion, setInternalEmotion] = useState<CompanionEmotion>(
    externalEmotion || 'greeting'
  );
  const [isGiggling, setIsGiggling] = useState(false);
  const [isSpeechBubbleVisible, setIsSpeechBubbleVisible] = useState(
    config.dialogueBubbleEnabled
  );
  const [tapCount, setTapCount] = useState(0);
  const [soundMuted, setSoundMuted] = useState(false);

  // Sync external emotion updates
  useEffect(() => {
    if (externalEmotion && !isGiggling) {
      setInternalEmotion(externalEmotion);
    }
  }, [externalEmotion, isGiggling]);

  // Touch micro-interaction handler
  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setTapCount((prev) => prev + 1);
    setIsGiggling(true);
    setInternalEmotion('giggle');

    if (!soundMuted) {
      sounds.playCompanionGiggle();
    }

    if (onTapCompanion) {
      onTapCompanion();
    }

    // Return to active emotion after giggle animation
    setTimeout(() => {
      setIsGiggling(false);
      setInternalEmotion(externalEmotion || 'idle');
    }, 1400);
  };

  const activeEmotion = isGiggling ? 'giggle' : internalEmotion;

  // Render for preview inside the Creator Customizer
  if (mode === 'preview') {
    return (
      <div className={`flex flex-col items-center select-none ${className}`}>
        {/* Preview Dialogue Bubble */}
        {config.dialogueBubbleEnabled && (
          <div className="relative mb-2 max-w-[220px] bg-white text-stone-800 text-xs px-3.5 py-2 rounded-2xl shadow-sm border border-stone-200 text-center font-medium leading-relaxed">
            <span>
              {dialogueText ||
                `Hi ${recipientName || 'there'}! I'm ${config.name}! ✨`}
            </span>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-stone-200 rotate-45" />
          </div>
        )}

        <button
          type="button"
          onClick={handleTap}
          title="Click to test interaction!"
          className="group relative cursor-pointer focus:outline-none transition-transform active:scale-95"
        >
          <CompanionSprite
            type={config.type}
            emotion={activeEmotion}
            accessory={config.accessory}
            furColor={config.furColor}
            size={110}
          />
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-stone-900 text-white px-2 py-0.5 rounded-full whitespace-nowrap shadow-xs pointer-events-none">
            Tap me! 💕
          </span>
        </button>
      </div>
    );
  }

  // Floating / Docked recipient mode
  const positionClass = isContained
    ? 'absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-30'
    : 'fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40';

  return (
    <div
      className={`${positionClass} flex flex-col items-end select-none pointer-events-auto ${className}`}
    >
      {/* Dynamic Animated Dialogue Bubble */}
      <AnimatePresence>
        {isSpeechBubbleVisible && dialogueText && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative mb-2.5 max-w-[240px] sm:max-w-[270px] bg-white/95 backdrop-blur-md text-stone-800 text-xs sm:text-[13px] px-4 py-2.5 rounded-2xl shadow-lg border border-stone-200/90 font-medium leading-snug"
          >
            {/* Header with companion name & close pill */}
            <div className="flex items-center justify-between gap-1 mb-1 pb-1 border-b border-stone-100">
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                {config.name}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSoundMuted(!soundMuted)}
                  className="text-stone-400 hover:text-stone-600 p-0.5 cursor-pointer"
                  title={soundMuted ? 'Unmute companion' : 'Mute companion'}
                >
                  {soundMuted ? (
                    <VolumeX className="w-2.5 h-2.5" />
                  ) : (
                    <Volume2 className="w-2.5 h-2.5 text-stone-500" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsSpeechBubbleVisible(false)}
                  className="text-stone-400 hover:text-stone-600 p-0.5 cursor-pointer"
                  title="Dismiss message"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Bubble Dialogue Content */}
            <p className="text-stone-700">{dialogueText}</p>

            {/* Pointer notch positioned pointing to companion sprite */}
            <div className="absolute -bottom-1.5 right-8 w-3 h-3 bg-white border-b border-r border-stone-200 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Companion Avatar Button */}
      <div className="relative flex items-center">
        {/* Toggle speech bubble pill if collapsed */}
        {!isSpeechBubbleVisible && dialogueText && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => setIsSpeechBubbleVisible(true)}
            className="mr-2 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full border border-stone-200 shadow-sm text-[11px] font-semibold text-stone-700 hover:bg-stone-50 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <MessageCircle className="w-3 h-3 text-rose-500" />
            <span>Hint</span>
          </motion.button>
        )}

        {/* The Clickable Little Friend */}
        <motion.button
          id="virtual-companion-btn"
          type="button"
          onClick={handleTap}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          title={`Tap ${config.name} for a giggle!`}
          className="relative focus:outline-none cursor-pointer rounded-full p-1 bg-white/60 backdrop-blur-xs hover:bg-white/90 border border-white/80 shadow-md hover:shadow-xl transition-all"
        >
          <CompanionSprite
            type={config.type}
            emotion={activeEmotion}
            accessory={config.accessory}
            furColor={config.furColor}
            size={mode === 'docked' ? 90 : 105}
          />

          {/* Floating heart burst on tap */}
          <AnimatePresence>
            {isGiggling && (
              <motion.div
                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                animate={{ opacity: 1, y: -28, scale: 1.2 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.7 }}
                className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-1 text-rose-500 text-xs font-bold"
              >
                <Heart className="w-4 h-4 fill-rose-500" />
                <span>Hehe!</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Name Tag Pill beneath avatar */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-stone-900/80 text-white text-[9px] font-bold tracking-wider backdrop-blur-xs shadow-xs uppercase">
            {config.name}
          </div>
        </motion.button>
      </div>
    </div>
  );
};
