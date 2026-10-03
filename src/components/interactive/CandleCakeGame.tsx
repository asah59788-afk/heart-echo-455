import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';
import { Mic, MicOff, Wind, Utensils, CheckCircle2 } from 'lucide-react';
import { CompanionEmotion } from '../../types';

interface CandleCakeGameProps {
  onComplete: () => void;
  recipientName: string;
  onCompanionCue?: (emotion: CompanionEmotion, text: string) => void;
}

export const CandleCakeGame: React.FC<CandleCakeGameProps> = ({
  onComplete,
  recipientName,
  onCompanionCue,
}) => {
  const [flameLit, setFlameLit] = useState(true);
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [cakeCut, setCakeCut] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Handle candle blow out
  const extinguishCandle = () => {
    if (!flameLit) return;
    setFlameLit(false);
    sounds.playBlow();
    stopMic();

    onCompanionCue?.('cheering', `Yay! You blew out the candle! 🎂 Now slice the cake!`);

    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#fbbf24', '#f59e0b', '#d97706'],
    });
  };

  // Start microphone listening for breath / blow
  const toggleMic = async () => {
    if (micActive) {
      stopMic();
      return;
    }

    try {
      setMicError(null);
      onCompanionCue?.('curious', `Take a deep breath and blow gently into your mic! 🌬️`);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      source.connect(analyser);

      setMicActive(true);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkAudio = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));

        // Threshold for blowing into mic
        if (avg > 38 && flameLit) {
          extinguishCandle();
          return;
        }

        animFrameRef.current = requestAnimationFrame(checkAudio);
      };

      checkAudio();
    } catch (err: unknown) {
      const e = err as { name?: string; message?: string };
      setMicActive(false);
      setMicError(
        e.name === 'NotAllowedError'
          ? 'Microphone permission denied. Tap the candle instead!'
          : 'Could not access mic. You can tap the candle directly.'
      );
    }
  };

  const stopMic = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setMicActive(false);
    setAudioLevel(0);
  };

  useEffect(() => {
    return () => {
      stopMic();
    };
  }, []);

  // Handle cutting the cake
  const handleCutCake = () => {
    if (cakeCut) return;
    setCakeCut(true);
    sounds.playSlide();
    onCompanionCue?.('loving', `Mmm, delicious cake! Here comes your birthday letter! 💖`);

    setTimeout(() => {
      sounds.playFanfare();
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.55 },
      });
      onComplete();
    }, 600);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      {/* Instructions header */}
      <div className="text-center mb-4 max-w-sm">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 mb-2">
          🎂 Birthday Tradition
        </span>
        <h3 className="text-xl font-bold text-gray-800 font-serif-display">
          {flameLit
            ? `Make a wish, ${recipientName}!`
            : !cakeCut
            ? 'Now slice the birthday cake! 🍰'
            : 'Happy Birthday! 🎉'}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {flameLit
            ? 'Blow into your mic or tap the candle flame to blow it out.'
            : !cakeCut
            ? 'Tap the cake slice to cut and reveal your special letter.'
            : 'Your birthday wish is sent to the stars!'}
        </p>
      </div>

      {/* The Cake & Candle Arena */}
      <div className="relative w-full max-w-xs h-72 my-2 flex flex-col items-center justify-end pb-6 select-none">
        {/* Candle & Flame */}
        <div className="relative z-10 flex flex-col items-center mb-1">
          {/* Flame */}
          {flameLit ? (
            <motion.button
              id="candle-flame-btn"
              onClick={extinguishCandle}
              title="Click or blow to extinguish"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="group relative cursor-pointer focus:outline-none"
            >
              <div className="w-5 h-8 bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 rounded-[50%_50%_40%_40%_/_70%_70%_30%_30%] animate-flame shadow-[0_0_16px_rgba(251,191,36,0.9)]" />
              <div className="absolute inset-0 bg-yellow-200/50 rounded-full blur-md animate-pulse" />
              <span className="sr-only">Blow out candle</span>
            </motion.button>
          ) : (
            /* Smoke puff after blown */
            <motion.div
              initial={{ opacity: 0.9, y: 0, scale: 0.6 }}
              animate={{ opacity: 0, y: -28, scale: 1.5 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="text-gray-400 text-sm font-medium tracking-wide flex flex-col items-center"
            >
              <Wind className="w-5 h-5 text-gray-400 animate-pulse" />
              <span className="text-[10px] text-gray-400">wish made ✨</span>
            </motion.div>
          )}

          {/* Wick */}
          <div className="w-0.5 h-3 bg-stone-700 mt-0.5" />

          {/* Candle stick */}
          <div className="w-3.5 h-12 bg-gradient-to-r from-pink-300 via-rose-200 to-pink-300 rounded-t-sm shadow-sm border border-rose-300/40 relative overflow-hidden">
            {/* Candle stripes */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,255,255,0.6)_4px,rgba(255,255,255,0.6)_8px)]" />
          </div>
        </div>

        {/* 2-Tier Cake */}
        <div className="relative w-56 flex flex-col items-center">
          {/* Top Tier */}
          <div className="w-36 h-14 bg-gradient-to-b from-amber-100 to-amber-200 rounded-t-2xl shadow-inner relative flex items-center justify-center border-t-2 border-white">
            {/* Frosting drips */}
            <div className="absolute top-0 inset-x-0 flex justify-between px-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-white rounded-full -translate-y-1 shadow-sm" />
              ))}
            </div>
            {/* Berries on top */}
            <div className="flex gap-2.5 z-10 -translate-y-1">
              <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-purple-600 shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm" />
            </div>
          </div>

          {/* Bottom Tier & Cake Cutting interactive slice */}
          <div className="relative w-52 h-20 bg-gradient-to-b from-rose-200 via-rose-100 to-amber-100 rounded-2xl shadow-md border-b-4 border-amber-300/60 overflow-hidden">
            {/* Cream ribbon layer */}
            <div className="absolute top-2 inset-x-0 h-2 bg-white/70" />
            <div className="absolute bottom-4 inset-x-0 h-2 bg-white/70" />

            {/* Cake Slice Cutout animation */}
            {!flameLit && (
              <motion.button
                id="slice-cake-btn"
                onClick={handleCutCake}
                whileHover={{ scale: 1.05 }}
                className={`absolute inset-y-0 right-8 w-16 bg-white/90 border-2 ${
                  cakeCut ? 'border-amber-400 translate-x-3 rotate-6 opacity-70' : 'border-dashed border-rose-400'
                } rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all shadow-md group`}
              >
                {!cakeCut ? (
                  <div className="flex flex-col items-center text-rose-500 animate-pulse">
                    <Utensils className="w-4 h-4" />
                    <span className="text-[9px] font-bold mt-0.5">TAP TO CUT</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-[9px] font-bold">SLICED!</span>
                  </div>
                )}
              </motion.button>
            )}
          </div>

          {/* Cake Stand plate */}
          <div className="w-64 h-3 bg-gradient-to-r from-stone-200 via-white to-stone-200 rounded-full shadow-md mt-1 border border-stone-300" />
          <div className="w-24 h-2 bg-stone-300 rounded-b-md mx-auto" />
        </div>
      </div>

      {/* Microphone blow control & feedback */}
      {flameLit && (
        <div className="flex flex-col items-center gap-2 mt-2">
          <button
            id="mic-blow-toggle"
            type="button"
            onClick={toggleMic}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              micActive
                ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-sm'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 shadow-sm'
            }`}
          >
            {micActive ? (
              <>
                <Mic className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                <span>Listening for blow... (Blow now!)</span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              </>
            ) : (
              <>
                <MicOff className="w-3.5 h-3.5 text-gray-500" />
                <span>Enable Mic to blow candle</span>
              </>
            )}
          </button>

          {micActive && (
            <div className="w-48 bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-75"
                style={{ width: `${audioLevel}%` }}
              />
            </div>
          )}

          {micError && (
            <p className="text-xs text-amber-700 bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
              {micError}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
