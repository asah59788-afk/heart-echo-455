import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CardData } from '../types';
import { BalloonPopGame } from './interactive/BalloonPopGame';
import { CandleCakeGame } from './interactive/CandleCakeGame';
import { UnrejectableProposal } from './interactive/UnrejectableProposal';
import { PhotoPuzzleGame } from './interactive/PhotoPuzzleGame';
import { ScratchCardGame } from './interactive/ScratchCardGame';
import { WaxSealEnvelope } from './interactive/WaxSealEnvelope';
import { VirtualCompanion } from './companion/VirtualCompanion';
import { CompanionEmotion } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Heart,
  Share2,
  Gift,
  ArrowRight,
  Eye,
  CheckCircle,
  PartyPopper,
} from 'lucide-react';

interface RecipientViewProps {
  card: CardData;
  isPreview?: boolean;
  onExitPreview?: () => void;
  onOpenShare?: () => void;
  onCreateNew?: () => void;
}

const REACTION_EMOJIS = ['❤️', '🥺', '🎉', '🥰', '✨', '🎂'];

export const RecipientView: React.FC<RecipientViewProps> = ({
  card,
  isPreview = false,
  onExitPreview,
  onOpenShare,
  onCreateNew,
}) => {
  const [gameCompleted, setGameCompleted] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [reactionSent, setReactionSent] = useState<string | null>(null);

  // Companion Configuration
  const companionConfig = card.companionConfig || {
    enabled: true,
    type: 'teddy',
    name: 'Barnaby',
    accessory: 'ribbon',
    dialogueBubbleEnabled: true,
    startAction: 'wave',
  };

  const getDefaultCompanionText = () => {
    switch (card.interactiveType) {
      case 'balloon_pop':
        return `Hi ${card.recipientName}! Tap the balloons to pop them! ✨`;
      case 'candle_cake':
        return `Hi ${card.recipientName}! Make a wish & blow out the candle! 🎂`;
      case 'unrejectable_proposal':
        return `Hi ${card.recipientName}! A special question is waiting for you! 💕`;
      case 'photo_puzzle':
        return `Hi ${card.recipientName}! Can you slide the photo into place? 🧩`;
      case 'scratch_card':
        return `Hi ${card.recipientName}! Scratch the golden foil to see your secret! 🌟`;
      case 'envelope_seal':
        return `Hi ${card.recipientName}! Tap the wax seal to open your letter! 💌`;
      default:
        return `Hi ${card.recipientName}! I'm ${companionConfig.name}, here to celebrate with you! ✨`;
    }
  };

  const [companionEmotion, setCompanionEmotion] = useState<CompanionEmotion>('greeting');
  const [companionDialogue, setCompanionDialogue] = useState<string>(getDefaultCompanionText);

  // Reset dialogue on interactive type or recipient update
  useEffect(() => {
    if (!gameCompleted) {
      setCompanionEmotion('greeting');
      setCompanionDialogue(getDefaultCompanionText());
    } else {
      setCompanionEmotion('loving');
      setCompanionDialogue(`Yay ${card.recipientName}! Your heartfelt letter is unlocked! 💖`);
    }
  }, [card.interactiveType, card.recipientName, gameCompleted]);

  const handleCompanionCue = (emotion: CompanionEmotion, text: string) => {
    setCompanionEmotion(emotion);
    setCompanionDialogue(text);
  };

  // Auto-trigger music if enabled in card config
  useEffect(() => {
    if (card.bgMusicEnabled) {
      // Browsers often require a user gesture, so we keep a prominent sound toggle
      sounds.toggleMusic(false);
    }
    return () => {
      sounds.stopAll();
    };
  }, [card]);

  const handleToggleMusic = () => {
    const next = !musicPlaying;
    setMusicPlaying(next);
    sounds.toggleMusic(next, card.musicTrack);
  };

  const handleGameComplete = () => {
    setGameCompleted(true);
    setCompanionEmotion('loving');
    setCompanionDialogue(`Yay ${card.recipientName}! You did it! Read your letter below! 💖`);
  };

  const handleResetGame = () => {
    setGameCompleted(false);
    setReactionSent(null);
    setCompanionEmotion('greeting');
    setCompanionDialogue(getDefaultCompanionText());
  };

  const handleSendReaction = (emoji: string) => {
    setReactionSent(emoji);
    sounds.playSparkle();
    setCompanionEmotion('loving');
    setCompanionDialogue(`Aww, sent ${emoji} to ${card.senderName}! So sweet! 🥰`);
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.8 },
    });
    setTimeout(() => setReactionSent(null), 3500);
  };

  const renderGame = () => {
    switch (card.interactiveType) {
      case 'balloon_pop':
        return (
          <BalloonPopGame
            onComplete={handleGameComplete}
            recipientName={card.recipientName}
            onCompanionCue={handleCompanionCue}
          />
        );
      case 'candle_cake':
        return (
          <CandleCakeGame
            onComplete={handleGameComplete}
            recipientName={card.recipientName}
            onCompanionCue={handleCompanionCue}
          />
        );
      case 'unrejectable_proposal':
        return (
          <UnrejectableProposal
            onComplete={handleGameComplete}
            recipientName={card.recipientName}
            question={card.proposalQuestion}
            photoUrl={card.photoUrl}
            onCompanionCue={handleCompanionCue}
          />
        );
      case 'photo_puzzle':
        return (
          <PhotoPuzzleGame
            onComplete={handleGameComplete}
            photoUrl={card.photoUrl}
            recipientName={card.recipientName}
            onCompanionCue={handleCompanionCue}
          />
        );
      case 'scratch_card':
        return (
          <ScratchCardGame
            onComplete={handleGameComplete}
            secretMessage={card.secretClue || card.message}
            recipientName={card.recipientName}
            onCompanionCue={handleCompanionCue}
          />
        );
      case 'envelope_seal':
        return (
          <WaxSealEnvelope
            onComplete={handleGameComplete}
            senderName={card.senderName}
            recipientName={card.recipientName}
            onCompanionCue={handleCompanionCue}
          />
        );
      default:
        return (
          <BalloonPopGame
            onComplete={handleGameComplete}
            recipientName={card.recipientName}
            onCompanionCue={handleCompanionCue}
          />
        );
    }
  };

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-br ${card.bgGradient} flex flex-col items-center justify-between relative overflow-x-hidden p-4 md:p-8 font-sans selection:bg-rose-200`}
    >
      {/* Top Bar for Preview Navigation & Audio */}
      <header className="w-full max-w-2xl flex items-center justify-between mb-4 z-20">
        {isPreview ? (
          <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">Live Interactive Preview</span>
            {onExitPreview && (
              <button
                id="exit-preview-btn"
                onClick={onExitPreview}
                className="ml-2 text-xs text-rose-300 hover:text-white underline cursor-pointer"
              >
                Back to Editor
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-stone-500 font-semibold tracking-wide">
            <Gift className="w-4 h-4 text-rose-500" />
            <span>LOVECRAFT GIFT EXPERIENCE</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Music Toggle */}
          <button
            id="toggle-audio-btn"
            onClick={handleToggleMusic}
            title={musicPlaying ? 'Mute background sound' : 'Play ambient music'}
            className={`p-2 rounded-full border shadow-xs transition-all cursor-pointer ${
              musicPlaying
                ? 'bg-rose-500 text-white border-rose-600 shadow-rose-200'
                : 'bg-white/80 backdrop-blur-xs text-gray-700 border-stone-200 hover:bg-white'
            }`}
          >
            {musicPlaying ? (
              <Volume2 className="w-4 h-4 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Share Action */}
          {onOpenShare && (
            <button
              id="recipient-share-btn"
              onClick={onOpenShare}
              className="p-2 rounded-full bg-white/80 backdrop-blur-xs text-gray-700 border border-stone-200 shadow-xs hover:bg-white cursor-pointer"
              title="Share this card"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Main Experience Container */}
      <main className="w-full max-w-xl my-auto z-10 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {/* Interactive Game Stage */}
          {!gameCompleted ? (
            <motion.div
              key="interactive-stage"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full bg-white/85 backdrop-blur-md rounded-3xl p-5 sm:p-7 shadow-xl border border-white/60"
            >
              {renderGame()}

              {/* Skip / Direct Reveal link for convenience */}
              <div className="mt-4 pt-3 border-t border-stone-100 text-center">
                <button
                  id="skip-game-btn"
                  onClick={handleGameComplete}
                  className="text-xs text-stone-400 hover:text-stone-700 transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
                >
                  <span>Skip straight to the message</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ) : (
            /* Unlocked Celebration Card */
            <motion.article
              key="unlocked-letter"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 25 }}
              className="w-full bg-white rounded-3xl p-6 sm:p-9 shadow-2xl border border-stone-100 relative overflow-hidden"
            >
              {/* Decorative Corner Accents */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-rose-100/60 to-transparent rounded-bl-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tr from-amber-100/60 to-transparent rounded-tr-full pointer-events-none" />

              {/* Status pill */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle className="w-3.5 h-3.5" /> Gift Unlocked
                </span>

                <button
                  id="replay-game-btn"
                  onClick={handleResetGame}
                  className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 bg-stone-50 px-2.5 py-1 rounded-full border border-stone-200 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Play again</span>
                </button>
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif-display leading-tight mb-2">
                {card.headline}
              </h2>

              <p className="text-xs text-rose-600 font-semibold tracking-wide uppercase mb-5">
                Specially crafted for {card.recipientName}
              </p>

              {/* Featured photo if provided */}
              {card.photoUrl && (
                <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden shadow-inner my-4 border border-stone-100">
                  <img
                    src={card.photoUrl}
                    alt="Memory"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
              )}

              {/* Heartfelt Message Body */}
              <div className="my-6 p-5 rounded-2xl bg-amber-50/50 border border-amber-100/80">
                <p className="text-base sm:text-lg text-gray-800 font-serif-display leading-relaxed whitespace-pre-line italic">
                  &ldquo;{card.message}&rdquo;
                </p>
              </div>

              {/* Handwritten Sender Signoff */}
              <div className="text-right mt-6 border-t border-stone-100 pt-4">
                <p className="text-xs text-stone-400">With all my love,</p>
                <p className="text-2xl sm:text-3xl text-rose-700 font-handwriting font-bold mt-1">
                  {card.senderName}
                </p>
              </div>

              {/* Interactive Emoji Reaction Bar */}
              <div className="mt-8 pt-4 border-t border-stone-100">
                <p className="text-xs text-stone-500 font-medium text-center mb-2">
                  Send a quick reaction to {card.senderName}:
                </p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {REACTION_EMOJIS.map((emoji) => (
                    <motion.button
                      key={emoji}
                      whileHover={{ scale: 1.25 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleSendReaction(emoji)}
                      className="w-10 h-10 rounded-full bg-stone-50 hover:bg-rose-50 border border-stone-200 hover:border-rose-300 flex items-center justify-center text-lg shadow-xs cursor-pointer transition-colors"
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence>
                  {reactionSent && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-2 text-center text-xs font-semibold text-rose-600 flex items-center justify-center gap-1"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-500" />
                      <span>Reaction {reactionSent} sent! LoveCraft love shared.</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Create Your Own Card CTA */}
              {onCreateNew && (
                <div className="mt-6 pt-4 border-t border-stone-100 text-center">
                  <button
                    id="create-reciprocal-card-btn"
                    onClick={onCreateNew}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-stone-900 to-stone-800 text-white text-xs font-semibold hover:from-black hover:to-stone-900 shadow-md transition-all cursor-pointer"
                  >
                    <Gift className="w-4 h-4 text-rose-400" />
                    <span>Create a Card for Someone You Love</span>
                  </button>
                </div>
              )}
            </motion.article>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-md text-center text-xs text-stone-400 mt-6 z-10 pb-2">
        <span>Made with LoveCraft • Digital Gifting & Celebrations</span>
      </footer>

      {/* State-Driven Little Friend Virtual Companion */}
      {companionConfig.enabled && (
        <VirtualCompanion
          config={companionConfig}
          emotion={companionEmotion}
          dialogueText={companionDialogue}
          recipientName={card.recipientName}
          isContained={isPreview}
        />
      )}
    </div>
  );
};
