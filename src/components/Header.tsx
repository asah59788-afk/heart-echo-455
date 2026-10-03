import React from 'react';
import { Heart, Sparkles, Layers, Plus, Code, Gift } from 'lucide-react';

interface HeaderProps {
  currentView: 'gallery' | 'builder' | 'recipient';
  onNavigate: (view: 'gallery' | 'builder') => void;
  onOpenArchitecture: () => void;
  onSelectDemoCard: (demoId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenArchitecture,
  onSelectDemoCard,
}) => {
  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          id="brand-logo-btn"
          onClick={() => onNavigate('gallery')}
          className="flex items-center gap-2 text-left cursor-pointer group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-sm shadow-rose-200 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif-display font-bold text-lg sm:text-xl text-gray-900 tracking-tight">
                LoveCraft
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-700">
                Gifting
              </span>
            </div>
            <p className="text-[11px] text-stone-500 -mt-0.5 hidden sm:block">
              Gamified & interactive digital cards
            </p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Demo Experiences Picker */}
          <div className="relative hidden md:block">
            <select
              id="demo-card-select"
              onChange={(e) => {
                if (e.target.value) {
                  onSelectDemoCard(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="text-xs bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-xl px-3 py-2 pr-7 font-medium cursor-pointer focus:outline-none"
            >
              <option value="" disabled>
                ⚡ Quick Demo Experience...
              </option>
              <option value="demo-proposal">💍 Unrejectable Proposal</option>
              <option value="demo-birthday">🎂 Birthday Candle & Cake</option>
              <option value="demo-puzzle">🧩 Memory Slide Puzzle</option>
            </select>
          </div>

          {/* Architecture & Specs Button */}
          <button
            id="open-architecture-btn"
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            title="View technical documentation, data models, and roadmap"
          >
            <Code className="w-4 h-4 text-purple-600" />
            <span className="hidden sm:inline">Architecture & Roadmap</span>
          </button>

          {/* Templates Gallery Button */}
          <button
            id="nav-templates-btn"
            onClick={() => onNavigate('gallery')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              currentView === 'gallery'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Templates</span>
          </button>

          {/* Create New Card Button */}
          <button
            id="nav-create-btn"
            onClick={() => onNavigate('builder')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-sm shadow-rose-200 hover:shadow-rose-300 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Card</span>
          </button>
        </div>
      </div>
    </header>
  );
};
