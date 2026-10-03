import React, { useState } from 'react';
import { X, Database, Layers, Code, CheckCircle, Copy, Cpu } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'schema' | 'components' | 'logic' | 'roadmap'>('schema');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sqlSchema = `-- PostgreSQL / Supabase Schema for LoveCraft

-- 1. Card Templates Table
CREATE TABLE card_templates (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(128) NOT NULL,
  category VARCHAR(32) NOT NULL CHECK (category IN ('birthday', 'proposal', 'anniversary', 'apology', 'friendship')),
  interactive_type VARCHAR(32) NOT NULL CHECK (interactive_type IN ('balloon_pop', 'candle_cake', 'unrejectable_proposal', 'photo_puzzle', 'scratch_card', 'envelope_seal')),
  theme_color VARCHAR(16) NOT NULL DEFAULT '#e11d48',
  bg_gradient VARCHAR(64) NOT NULL,
  default_headline VARCHAR(255) NOT NULL,
  default_message TEXT NOT NULL,
  default_photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User Generated Cards Instances Table
CREATE TABLE user_cards (
  id VARCHAR(64) PRIMARY KEY, -- Non-guessable NanoID / UUID
  template_id VARCHAR(64) REFERENCES card_templates(id),
  category VARCHAR(32) NOT NULL,
  recipient_name VARCHAR(64) NOT NULL,
  sender_name VARCHAR(64) NOT NULL,
  headline VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  interactive_type VARCHAR(32) NOT NULL,
  photo_url TEXT,
  theme_color VARCHAR(16) DEFAULT '#e11d48',
  bg_gradient VARCHAR(64) DEFAULT 'from-rose-50 via-pink-50 to-red-50',
  proposal_question VARCHAR(255),
  secret_clue TEXT,
  bg_music_enabled BOOLEAN DEFAULT TRUE,
  music_track VARCHAR(32) DEFAULT 'romantic_melody',
  views_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by public share ID
CREATE INDEX idx_user_cards_id ON user_cards(id);
CREATE INDEX idx_user_cards_category ON user_cards(category);`;

  const jsonSchema = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "LoveCraftCardConfiguration",
  "type": "object",
  "required": [
    "id",
    "recipientName",
    "senderName",
    "headline",
    "message",
    "interactiveType"
  ],
  "properties": {
    "id": { "type": "string", "description": "Unique non-guessable slug (e.g. sophia-7k9a2)" },
    "templateId": { "type": "string" },
    "category": { "enum": ["birthday", "proposal", "anniversary", "apology", "friendship"] },
    "recipientName": { "type": "string", "maxLength": 60 },
    "senderName": { "type": "string", "maxLength": 60 },
    "headline": { "type": "string", "maxLength": 160 },
    "message": { "type": "string" },
    "interactiveType": {
      "enum": [
        "balloon_pop",
        "candle_cake",
        "unrejectable_proposal",
        "photo_puzzle",
        "scratch_card",
        "envelope_seal"
      ]
    },
    "photoUrl": { "type": "string", "format": "uri" },
    "proposalQuestion": { "type": "string" },
    "secretClue": { "type": "string" },
    "bgMusicEnabled": { "type": "boolean" },
    "musicTrack": { "type": "string" },
    "viewsCount": { "type": "integer", "default": 0 },
    "createdAt": { "type": "string", "format": "date-time" }
  }
}`;

  const dodgeSnippet = `// 1. Unrejectable "No" Button Evasion & Spring Dynamics
const handleDodge = (e) => {
  sounds.playDodge(); // Web Audio cartoon spring sound
  const arena = arenaRef.current.getBoundingClientRect();
  
  // Constrain random translation coordinates inside parent arena
  const maxX = arena.width / 2 - 50;
  const maxY = arena.height / 2 - 30;
  const newX = (Math.random() * 2 - 1) * maxX;
  const newY = (Math.random() * 2 - 1) * maxY;

  setNoPosition({ x: newX, y: newY });
  setDodgeCount((prev) => prev + 1);
};

// 2. Exponential "Yes" button expansion
const yesScale = Math.min(1 + dodgeCount * 0.15, 2.2);`;

  const puzzleSnippet = `// 8-Puzzle Inversion-Parity & Solvability Logic
// An 8-puzzle on a 3x3 grid is solvable if and only if
// the permutation parity (count of inversions) is even.
export const generateSolvableShuffle = (solved = [1,2,3,4,5,6,7,8,0]) => {
  let tiles = [...solved];
  let emptyIdx = 8;
  let prevIdx = -1;

  // Apply 25 random valid orthogonal moves from solved state
  // Guarantees zero un-solvable permutations!
  for (let i = 0; i < 25; i++) {
    const row = Math.floor(emptyIdx / 3);
    const col = emptyIdx % 3;
    const neighbors = [];
    if (row > 0) neighbors.push(emptyIdx - 3); // Up
    if (row < 2) neighbors.push(emptyIdx + 3); // Down
    if (col > 0) neighbors.push(emptyIdx - 1); // Left
    if (col < 2) neighbors.push(emptyIdx + 1); // Right
    
    const candidates = neighbors.filter(idx => idx !== prevIdx);
    const nextIdx = candidates[Math.floor(Math.random() * candidates.length)];
    [tiles[emptyIdx], tiles[nextIdx]] = [tiles[nextIdx], tiles[emptyIdx]];
    prevIdx = emptyIdx;
    emptyIdx = nextIdx;
  }
  return tiles;
};`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-stone-900 text-stone-100 rounded-3xl shadow-2xl border border-stone-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                LoveCraft Technical Architecture & Data Model
              </h3>
              <p className="text-xs text-stone-400">
                Full-stack blueprints, database schema, and interactive logic
              </p>
            </div>
          </div>

          <button
            id="close-arch-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-800 px-5 gap-4 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('schema')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'schema'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database Schema (SQL & JSON)</span>
          </button>

          <button
            onClick={() => setActiveTab('components')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'components'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Component Hierarchy</span>
          </button>

          <button
            onClick={() => setActiveTab('logic')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'logic'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Interactive Logic Snippets</span>
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'roadmap'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Step-by-Step Roadmap</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 text-xs text-stone-300 space-y-4">
          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-rose-300">
                  PostgreSQL / Supabase Relational DDL
                </span>
                <button
                  onClick={() => copyToClipboard(sqlSchema, 'sql')}
                  className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-white"
                >
                  {copiedKey === 'sql' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'sql' ? 'Copied' : 'Copy SQL'}</span>
                </button>
              </div>
              <pre className="p-3.5 bg-black/60 rounded-xl font-mono text-[11px] overflow-x-auto text-amber-200/90 border border-stone-800 leading-relaxed">
                {sqlSchema}
              </pre>

              <div className="flex items-center justify-between pt-2">
                <span className="font-semibold text-rose-300">
                  JSON Card Instance Schema
                </span>
                <button
                  onClick={() => copyToClipboard(jsonSchema, 'json')}
                  className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-white"
                >
                  {copiedKey === 'json' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'json' ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="p-3.5 bg-black/60 rounded-xl font-mono text-[11px] overflow-x-auto text-sky-200/90 border border-stone-800 leading-relaxed">
                {jsonSchema}
              </pre>
            </div>
          )}

          {activeTab === 'components' && (
            <div className="space-y-4">
              <div className="p-4 bg-stone-800/60 rounded-2xl border border-stone-700">
                <h4 className="text-sm font-bold text-white mb-2">Frontend Component Tree</h4>
                <ul className="space-y-2 text-stone-300">
                  <li>
                    <strong className="text-rose-400">App.tsx</strong>: Root controller handling URL routing (e.g. <code className="text-amber-300">?card=:id</code>), template picker, active editor state, and share modal orchestration.
                  </li>
                  <li>
                    <strong className="text-rose-400">CardBuilder.tsx</strong>: 4-step mobile-first customization studio with realtime side-by-side or responsive device frame preview.
                  </li>
                  <li>
                    <strong className="text-rose-400">RecipientView.tsx</strong>: Zero-registration, recipient-only immersive player with audio ambient control, interactive stage, and celebration card reveal.
                  </li>
                  <li>
                    <strong className="text-rose-400">interactive/UnrejectableProposal.tsx</strong>: Dynamic dodging &apos;No&apos; button with touch evasion and expanding &apos;Yes&apos; spring action.
                  </li>
                  <li>
                    <strong className="text-rose-400">interactive/CandleCakeGame.tsx</strong>: Web Audio analyser microphone breath detection + tap candle extinguish + cake cutting slice interaction.
                  </li>
                  <li>
                    <strong className="text-rose-400">interactive/PhotoPuzzleGame.tsx</strong>: Solvable 8-puzzle slide-to-solve memory assembler with background position tile rendering.
                  </li>
                  <li>
                    <strong className="text-rose-400">interactive/ScratchCardGame.tsx</strong>: HTML5 canvas destination-out scratch foil eraser with percentage reveal thresholds.
                  </li>
                  <li>
                    <strong className="text-rose-400">ShareModal.tsx</strong>: Direct link generation, QR Code SVG rendering, WhatsApp direct share, and Open Graph social card inspector.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'logic' && (
            <div className="space-y-4">
              <div>
                <span className="font-semibold text-rose-300 block mb-1">
                  1. Unrejectable Proposal Escape/Dodge Engine
                </span>
                <pre className="p-3.5 bg-black/60 rounded-xl font-mono text-[11px] overflow-x-auto text-emerald-200/90 border border-stone-800 leading-relaxed">
                  {dodgeSnippet}
                </pre>
              </div>

              <div>
                <span className="font-semibold text-rose-300 block mb-1">
                  2. 8-Puzzle Solvable Permutation Shuffle
                </span>
                <pre className="p-3.5 bg-black/60 rounded-xl font-mono text-[11px] overflow-x-auto text-purple-200/90 border border-stone-800 leading-relaxed">
                  {puzzleSnippet}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="space-y-3">
              <div className="p-3 bg-stone-800/50 rounded-xl border border-stone-700">
                <span className="text-rose-400 font-bold">Phase 1: Architecture & Server Foundation</span>
                <p className="text-stone-400 mt-1">
                  Configured Express backend with Vite integration, in-memory + JSON persistence, REST endpoints (<code className="text-amber-300">/api/cards</code>, <code className="text-amber-300">/api/generate-message</code>), and dynamic Open Graph tag injection for social links.
                </p>
              </div>

              <div className="p-3 bg-stone-800/50 rounded-xl border border-stone-700">
                <span className="text-rose-400 font-bold">Phase 2: Interactive Gamified Components</span>
                <p className="text-stone-400 mt-1">
                  Implemented zero-latency Web Audio sound synthesizer, Canvas Confetti particle engines, microphone breath detection for candles, solvable 8-puzzle slide game, and unrejectable dynamic button evasion.
                </p>
              </div>

              <div className="p-3 bg-stone-800/50 rounded-xl border border-stone-700">
                <span className="text-rose-400 font-bold">Phase 3: Creator Studio & Live Preview</span>
                <p className="text-stone-400 mt-1">
                  Designed real-time responsive CardBuilder with AI assistance, photo uploads, theme presets, and instant device preview.
                </p>
              </div>

              <div className="p-3 bg-stone-800/50 rounded-xl border border-stone-700">
                <span className="text-rose-400 font-bold">Phase 4: Instant Sharing & Recipient Flow</span>
                <p className="text-stone-400 mt-1">
                  Equipped recipient player with zero-app-install access, QR Code generation, WhatsApp 1-tap sharing, and reaction emojis.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold cursor-pointer"
          >
            Close Architecture Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
