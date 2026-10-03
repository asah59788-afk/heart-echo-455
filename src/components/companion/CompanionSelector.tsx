import React, { useState } from 'react';
import {
  CompanionConfig,
  CompanionType,
  CompanionAccessory,
  CompanionEmotion,
} from '../../types';
import { CompanionSprite } from './CompanionSprites';
import { Sparkles, Heart, Smile, Check, Wand2 } from 'lucide-react';

interface CompanionSelectorProps {
  config: CompanionConfig;
  onChange: (config: CompanionConfig) => void;
  recipientName?: string;
}

const COMPANION_PRESETS: {
  type: CompanionType;
  defaultName: string;
  label: string;
  tagline: string;
  defaultColor: string;
  icon: string;
}[] = [
  {
    type: 'teddy',
    defaultName: 'Barnaby',
    label: 'Fluffy Teddy',
    tagline: 'Warm, huggable, and comforting',
    defaultColor: '#d49b6a',
    icon: '🧸',
  },
  {
    type: 'bunny',
    defaultName: 'Mochi',
    label: 'Hop Bunny',
    tagline: 'Playful, sweet, and bouncy',
    defaultColor: '#fdf4f0',
    icon: '🐰',
  },
  {
    type: 'kitty',
    defaultName: 'Mimi',
    label: 'Calm Kitty',
    tagline: 'Gentle, curious, and cuddly',
    defaultColor: '#fecdd3',
    icon: '🐱',
  },
  {
    type: 'puppy',
    defaultName: 'Boba',
    label: 'Joyful Puppy',
    tagline: 'Excited, loyal, and loving',
    defaultColor: '#f59e0b',
    icon: '🐶',
  },
];

const ACCESSORY_OPTIONS: { id: CompanionAccessory; label: string; icon: string }[] = [
  { id: 'ribbon', label: 'Bow Ribbon', icon: '🎀' },
  { id: 'party_hat', label: 'Party Hat', icon: '🎉' },
  { id: 'flower', label: 'Sweet Flower', icon: '🌸' },
  { id: 'crown', label: 'Gold Crown', icon: '👑' },
  { id: 'heart_glasses', label: 'Heart Shades', icon: '🕶️' },
  { id: 'none', label: 'Natural', icon: '✨' },
];

const COLOR_PALETTES = [
  { name: 'Warm Honey', color: '#d49b6a' },
  { name: 'Soft Cream', color: '#fdf4f0' },
  { name: 'Sweet Blush', color: '#fecdd3' },
  { name: 'Golden Caramel', color: '#f59e0b' },
  { name: 'Cloud Lavender', color: '#e9d5ff' },
];

export const CompanionSelector: React.FC<CompanionSelectorProps> = ({
  config,
  onChange,
  recipientName = 'Alex',
}) => {
  const [testEmotion, setTestEmotion] = useState<CompanionEmotion>('greeting');

  const handleToggle = (enabled: boolean) => {
    onChange({ ...config, enabled });
  };

  const handleSelectType = (preset: (typeof COMPANION_PRESETS)[0]) => {
    onChange({
      ...config,
      type: preset.type,
      name: preset.defaultName,
      furColor: preset.defaultColor,
    });
  };

  return (
    <div className="bg-stone-50/90 rounded-2xl p-4 sm:p-5 border border-stone-200 space-y-4">
      {/* Header toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 text-sm">
            ✨
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 font-serif-display">
              Little Friend (Virtual Companion)
            </h3>
            <p className="text-[11px] text-stone-500 -mt-0.5">
              A cute animated guide who cheers and reacts to your recipient
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => handleToggle(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600" />
        </label>
      </div>

      {config.enabled && (
        <div className="pt-3 border-t border-stone-200 space-y-4 animate-in fade-in duration-200">
          {/* Character selection cards */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-2">
              1. Choose Character
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {COMPANION_PRESETS.map((preset) => {
                const isSelected = config.type === preset.type;
                return (
                  <button
                    key={preset.type}
                    type="button"
                    onClick={() => handleSelectType(preset)}
                    className={`flex flex-col items-center text-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50/80 border-rose-400 text-rose-900 shadow-xs'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-2xl mb-1">{preset.icon}</span>
                    <span className="text-xs font-bold leading-tight">
                      {preset.label}
                    </span>
                    <span className="text-[10px] text-stone-400 mt-0.5">
                      &ldquo;{preset.defaultName}&rdquo;
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Character Name & Customization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                2. Companion Name
              </label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => onChange({ ...config, name: e.target.value })}
                placeholder="e.g. Mochi"
                className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                3. Accessory
              </label>
              <select
                value={config.accessory}
                onChange={(e) =>
                  onChange({
                    ...config,
                    accessory: e.target.value as CompanionAccessory,
                  })
                }
                className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-400 cursor-pointer"
              >
                {ACCESSORY_OPTIONS.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.icon} {acc.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fur Color Tint Palette */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              4. Fur Tone & Color Palette
            </label>
            <div className="flex items-center gap-2">
              {COLOR_PALETTES.map((pal) => (
                <button
                  key={pal.name}
                  type="button"
                  onClick={() => onChange({ ...config, furColor: pal.color })}
                  className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
                    config.furColor === pal.color
                      ? 'border-stone-900 scale-110 shadow-xs'
                      : 'border-white hover:scale-105'
                  }`}
                  style={{ backgroundColor: pal.color }}
                  title={pal.name}
                >
                  {config.furColor === pal.color && (
                    <Check className="w-3.5 h-3.5 text-stone-900 drop-shadow-xs" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Emotion Tester */}
          <div className="p-3 bg-white rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center justify-center p-1 bg-stone-50 rounded-2xl border border-stone-100">
              <CompanionSprite
                type={config.type}
                emotion={testEmotion}
                accessory={config.accessory}
                furColor={config.furColor}
                size={80}
              />
            </div>

            <div className="flex-1 w-full text-center sm:text-left">
              <div className="text-[11px] font-bold text-stone-700 mb-1 flex items-center justify-center sm:justify-start gap-1">
                <Smile className="w-3.5 h-3.5 text-rose-500" />
                <span>Test Companion Expressions:</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
                {(
                  [
                    'greeting',
                    'cheering',
                    'loving',
                    'surprised',
                    'curious',
                    'giggle',
                  ] as CompanionEmotion[]
                ).map((emo) => (
                  <button
                    key={emo}
                    type="button"
                    onClick={() => setTestEmotion(emo)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-semibold capitalize transition-all cursor-pointer ${
                      testEmotion === emo
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {emo}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
