import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';
import { Sparkles, Eraser, CheckCircle2 } from 'lucide-react';
import { CompanionEmotion } from '../../types';

interface ScratchCardGameProps {
  onComplete: () => void;
  secretMessage: string;
  recipientName: string;
  onCompanionCue?: (emotion: CompanionEmotion, text: string) => void;
}

export const ScratchCardGame: React.FC<ScratchCardGameProps> = ({
  onComplete,
  secretMessage,
  recipientName,
  onCompanionCue,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchedPercent, setScratchedPercent] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Render golden foil coating
    canvas.width = 320;
    canvas.height = 180;

    const grad = ctx.createLinearGradient(0, 0, 320, 180);
    grad.addColorStop(0, '#d97706');
    grad.addColorStop(0.3, '#f59e0b');
    grad.addColorStop(0.6, '#fbbf24');
    grad.addColorStop(1, '#b45309');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 320, 180);

    // Decorative texture & text on foil
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * 320;
      const y = Math.random() * 180;
      const r = Math.random() * 2 + 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#78350f';
    ctx.textAlign = 'center';
    ctx.fillText('✨ SCRATCH HERE TO REVEAL ✨', 160, 95);
    ctx.font = '11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#92400e';
    ctx.fillText('Rub with your finger or mouse', 160, 115);
  }, []);

  const scratch = (clientX: number, clientY: number) => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    // Sample percentage every few strokes
    if (Math.random() > 0.6) {
      calculateProgress();
    }
  };

  const calculateProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparentCount = 0;
    const totalPixels = pixels.length / 4;

    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }

    const sampledRatio = (transparentCount / (totalPixels / 4)) * 100;
    setScratchedPercent(Math.min(100, Math.round(sampledRatio)));

    if (sampledRatio > 40 && !isRevealed) {
      setIsRevealed(true);
      sounds.playFanfare();
      onCompanionCue?.('cheering', `A secret message revealed just for you! ✨`);
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
      });
      setTimeout(onComplete, 700);
    }
  };

  const handleRevealAll = () => {
    setIsRevealed(true);
    sounds.playFanfare();
    onCompanionCue?.('loving', `A secret message revealed just for you! ✨`);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });
    setTimeout(onComplete, 700);
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 w-full max-w-sm mx-auto select-none">
      <div className="text-center mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Secret Scratch Card
        </span>
        <h3 className="text-xl font-bold text-gray-800 font-serif-display">
          Scratch to Reveal, {recipientName}!
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {isRevealed
            ? 'Secret revealed!'
            : `Rub the golden card to reveal the hidden words (${scratchedPercent}% revealed)`}
        </p>
      </div>

      {/* The Scratch Card Box */}
      <div className="relative w-80 h-44 rounded-2xl overflow-hidden shadow-xl border-4 border-amber-300/80 bg-white">
        {/* Hidden Content underneath */}
        <div className="absolute inset-0 p-5 bg-gradient-to-br from-amber-50 to-rose-50 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">
            SECRET HEARTFELT MESSAGE
          </span>
          <p className="text-sm font-semibold text-gray-800 font-serif-display leading-relaxed">
            &ldquo;{secretMessage || 'You mean more to me than words can say.'}&rdquo;
          </p>
          <span className="text-xs text-rose-600 font-handwriting text-lg mt-1">
            Forever & Always ❤️
          </span>
        </div>

        {/* Scratchable Canvas Layer */}
        {!isRevealed && (
          <canvas
            ref={canvasRef}
            onMouseDown={() => setIsScratching(true)}
            onMouseUp={() => setIsScratching(false)}
            onMouseLeave={() => setIsScratching(false)}
            onMouseMove={(e) => {
              if (isScratching) scratch(e.clientX, e.clientY);
            }}
            onTouchStart={() => setIsScratching(true)}
            onTouchEnd={() => setIsScratching(false)}
            onTouchMove={(e) => {
              if (e.touches[0]) {
                scratch(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
            className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
          />
        )}
      </div>

      <div className="flex items-center gap-3 mt-3">
        {!isRevealed && (
          <button
            id="instant-scratch-btn"
            type="button"
            onClick={handleRevealAll}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-amber-100 border border-amber-200 text-amber-800 font-medium hover:bg-amber-200"
          >
            <Eraser className="w-3.5 h-3.5" />
            Quick Scratch All
          </button>
        )}
        {isRevealed && (
          <span className="flex items-center gap-1 text-xs text-emerald-700 font-semibold">
            <CheckCircle2 className="w-4 h-4" /> Secret Unlocked!
          </span>
        )}
      </div>
    </div>
  );
};
