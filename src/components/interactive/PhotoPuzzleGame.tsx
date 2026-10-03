import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';
import { Sparkles, RefreshCw, Eye, CheckCircle, Wand2 } from 'lucide-react';
import { CompanionEmotion } from '../../types';

interface PhotoPuzzleGameProps {
  onComplete: () => void;
  photoUrl?: string;
  recipientName: string;
  onCompanionCue?: (emotion: CompanionEmotion, text: string) => void;
}

const DEFAULT_PHOTO =
  'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80';

// 3x3 grid: 0 is empty
const SOLVED_TILES = [1, 2, 3, 4, 5, 6, 7, 8, 0];

export const PhotoPuzzleGame: React.FC<PhotoPuzzleGameProps> = ({
  onComplete,
  photoUrl = DEFAULT_PHOTO,
  recipientName,
  onCompanionCue,
}) => {
  const [tiles, setTiles] = useState<number[]>(SOLVED_TILES);
  const [moves, setMoves] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const imgSource = photoUrl || DEFAULT_PHOTO;

  // Shuffle board by performing 25 valid random moves from solved state to guarantee solvability
  const shuffleBoard = useCallback(() => {
    let current = [...SOLVED_TILES];
    let emptyIdx = 8;
    let previousIdx = -1;

    for (let step = 0; step < 24; step++) {
      const row = Math.floor(emptyIdx / 3);
      const col = emptyIdx % 3;
      const validNeighbors: number[] = [];

      if (row > 0) validNeighbors.push(emptyIdx - 3); // Up
      if (row < 2) validNeighbors.push(emptyIdx + 3); // Down
      if (col > 0) validNeighbors.push(emptyIdx - 1); // Left
      if (col < 2) validNeighbors.push(emptyIdx + 1); // Right

      // Exclude previous index to prevent immediate undo
      const candidates = validNeighbors.filter((idx) => idx !== previousIdx);
      const pick = candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : validNeighbors[0];

      // Swap emptyIdx and pick
      [current[emptyIdx], current[pick]] = [current[pick], current[emptyIdx]];
      previousIdx = emptyIdx;
      emptyIdx = pick;
    }

    setTiles(current);
    setMoves(0);
    setIsSolved(false);
  }, []);

  useEffect(() => {
    shuffleBoard();
  }, [shuffleBoard]);

  // Check if tile can slide into empty spot
  const handleTileClick = (index: number) => {
    if (isSolved) return;

    const emptyIndex = tiles.indexOf(0);
    const row = Math.floor(index / 3);
    const col = index % 3;
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;

    // Must be orthogonally adjacent
    const isAdjacent =
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      sounds.playSlide();
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves((m) => m + 1);

      // Check win condition
      const checkWin = newTiles.every((val, idx) => val === SOLVED_TILES[idx]);
      if (checkWin) {
        setIsSolved(true);
        sounds.playFanfare();
        onCompanionCue?.('cheering', `You solved it! What a gorgeous memory! ✨`);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
        setTimeout(onComplete, 800);
      } else if (moves > 0 && moves % 5 === 0) {
        onCompanionCue?.('curious', `Good move! Piece by piece, uncovering the memory! 🧩`);
      }
    }
  };

  // Auto-solve helper for effortless enjoyment
  const handleInstantSolve = () => {
    setTiles(SOLVED_TILES);
    setIsSolved(true);
    sounds.playFanfare();
    onCompanionCue?.('loving', `A magical memory revealed! ✨`);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    setTimeout(onComplete, 800);
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 w-full max-w-md mx-auto select-none">
      {/* Header */}
      <div className="text-center mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Photo Memory Puzzle
        </span>
        <h3 className="text-xl font-bold text-gray-800 font-serif-display">
          Piece Together The Memory, {recipientName}!
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Slide tiles into the open space to assemble the picture. Moves: {moves}
        </p>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 mb-3">
        <button
          id="peek-photo-btn"
          type="button"
          onClick={() => setShowOriginal(!showOriginal)}
          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 shadow-xs hover:bg-stone-50"
        >
          <Eye className="w-3.5 h-3.5" />
          {showOriginal ? 'Show Puzzle' : 'Peek Original'}
        </button>

        <button
          id="reshuffle-puzzle-btn"
          type="button"
          onClick={shuffleBoard}
          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 shadow-xs hover:bg-stone-50"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Shuffle
        </button>

        <button
          id="solve-puzzle-btn"
          type="button"
          onClick={handleInstantSolve}
          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 shadow-xs hover:bg-purple-100"
        >
          <Wand2 className="w-3.5 h-3.5" />
          Auto-Solve
        </button>
      </div>

      {/* Puzzle Arena */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 p-1.5 bg-stone-800 rounded-2xl shadow-xl overflow-hidden border-4 border-stone-900">
        {showOriginal ? (
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            <img
              src={imgSource}
              alt="Original"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-semibold">
              Original Reference
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 grid-rows-3 gap-1 w-full h-full">
            {tiles.map((val, idx) => {
              if (val === 0) {
                return (
                  <div
                    key="empty"
                    className="w-full h-full bg-stone-900/60 rounded-lg flex items-center justify-center border border-dashed border-stone-700"
                  >
                    {isSolved && (
                      <CheckCircle className="w-6 h-6 text-emerald-400 animate-bounce" />
                    )}
                  </div>
                );
              }

              // Calculate sliced background offset for 3x3
              const originalIndex = val - 1;
              const origRow = Math.floor(originalIndex / 3);
              const origCol = originalIndex % 3;
              const bgPosX = (origCol / 2) * 100;
              const bgPosY = (origRow / 2) * 100;

              return (
                <motion.button
                  key={val}
                  layout
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  onClick={() => handleTileClick(idx)}
                  className="relative w-full h-full rounded-lg overflow-hidden cursor-pointer shadow-md focus:outline-none group active:scale-95 transition-transform"
                  style={{
                    backgroundImage: `url(${imgSource})`,
                    backgroundSize: '300% 300%',
                    backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                  }}
                >
                  <span className="absolute top-1 left-1 bg-black/50 backdrop-blur-xs text-white text-[10px] px-1 rounded-sm font-mono opacity-60 group-hover:opacity-100">
                    {val}
                  </span>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {isSolved && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-center text-emerald-700 font-semibold text-xs flex items-center gap-1"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Memory Reassembled! Unlocking your greeting below...</span>
        </motion.div>
      )}
    </div>
  );
};
