import React, { useState } from 'react';
import { CardTemplate, TemplateCategory } from '../types';
import { CARD_TEMPLATES } from '../data/templates';
import {
  Cake,
  Heart,
  Puzzle,
  Sparkles,
  Gift,
  Mail,
  ArrowRight,
  Eye,
  CheckCircle2,
  Flame,
  Wand2,
} from 'lucide-react';

interface TemplateGalleryProps {
  onSelectTemplate: (template: CardTemplate) => void;
  onPreviewTemplate: (template: CardTemplate) => void;
  onOpenCreateBlank: () => void;
  onOpenArchitecture: () => void;
}

const CATEGORIES: { key: 'all' | TemplateCategory; label: string; icon: string }[] = [
  { key: 'all', label: 'All Templates', icon: '✨' },
  { key: 'birthday', label: 'Birthday', icon: '🎂' },
  { key: 'proposal', label: 'Proposal & Romance', icon: '💍' },
  { key: 'anniversary', label: 'Anniversary', icon: '🥂' },
  { key: 'friendship', label: 'Friendship', icon: '🎉' },
  { key: 'apology', label: 'Apology', icon: '🕊️' },
];

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  onSelectTemplate,
  onPreviewTemplate,
  onOpenCreateBlank,
  onOpenArchitecture,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | TemplateCategory>('all');

  const filteredTemplates =
    selectedCategory === 'all'
      ? CARD_TEMPLATES
      : CARD_TEMPLATES.filter((t) => t.category === selectedCategory);

  const getCategoryBadgeColor = (category: TemplateCategory) => {
    switch (category) {
      case 'birthday':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'proposal':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'anniversary':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'friendship':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'apology':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  const getInteractiveTag = (type: string) => {
    switch (type) {
      case 'unrejectable_proposal':
        return { label: 'Dodge / Evasion Logic', icon: Flame, color: 'text-rose-600 bg-rose-50' };
      case 'candle_cake':
        return { label: 'Mic / Tap Candle + Slice', icon: Cake, color: 'text-amber-600 bg-amber-50' };
      case 'photo_puzzle':
        return { label: 'Slide-to-Solve Puzzle', icon: Puzzle, color: 'text-purple-600 bg-purple-50' };
      case 'balloon_pop':
        return { label: 'Floating Balloon Pop', icon: Sparkles, color: 'text-cyan-600 bg-cyan-50' };
      case 'scratch_card':
        return { label: 'Canvas Scratch Foil', icon: Gift, color: 'text-emerald-600 bg-emerald-50' };
      case 'envelope_seal':
        return { label: '3D Wax Seal Letter', icon: Mail, color: 'text-stone-600 bg-stone-100' };
      default:
        return { label: 'Interactive Game', icon: Sparkles, color: 'text-rose-600 bg-rose-50' };
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Editorial Intro Banner */}
      <section className="mb-10 text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100/70 text-rose-800 mb-3 border border-rose-200">
          <Sparkles className="w-3.5 h-3.5 text-rose-600" />
          Zero app download • Instant personalized link
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 font-serif-display tracking-tight leading-tight">
          Create Moments They Will Never Forget
        </h1>
        <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
          Craft gamified digital experiences with clickable balloon popping, interactive candle blowing via microphone, slide-to-solve memory puzzles, and unrejectable proposal questions.
        </p>

        {/* Quick Launch Buttons */}
        <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
          <button
            id="gallery-create-custom-btn"
            onClick={onOpenCreateBlank}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-md shadow-rose-200 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Design from Scratch</span>
          </button>

          <button
            id="gallery-view-arch-btn"
            onClick={onOpenArchitecture}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-sm shadow-xs transition-all cursor-pointer"
          >
            <Wand2 className="w-4 h-4 text-purple-600" />
            <span>Architecture & Roadmap</span>
          </button>
        </div>
      </section>

      {/* Category Filter Pills */}
      <nav className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            id={`category-filter-${cat.key}`}
            onClick={() => setSelectedCategory(cat.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border ${
              selectedCategory === cat.key
                ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:text-stone-900'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
            {cat.key !== 'all' && (
              <span className="text-[10px] opacity-70">
                ({CARD_TEMPLATES.filter((t) => t.category === cat.key).length})
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const interactiveInfo = getInteractiveTag(template.interactiveType);
          const InteractiveIcon = interactiveInfo.icon;

          return (
            <article
              key={template.id}
              className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Card Media Preview Header */}
              <div className="relative h-52 overflow-hidden bg-stone-100">
                <img
                  src={template.defaultPhotoUrl}
                  alt={template.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Category badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider backdrop-blur-xs ${getCategoryBadgeColor(
                      template.category
                    )}`}
                  >
                    {template.categoryLabel}
                  </span>
                </div>

                {/* Interactive game tag */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md shadow-xs ${interactiveInfo.color}`}
                  >
                    <InteractiveIcon className="w-3.5 h-3.5" />
                    <span>{interactiveInfo.label}</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 font-serif-display group-hover:text-rose-600 transition-colors">
                    {template.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                    {template.description}
                  </p>

                  <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs text-stone-600 italic line-clamp-2">
                    &ldquo;{template.defaultHeadline}&rdquo;
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 mt-5 pt-3 border-t border-stone-100">
                  <button
                    id={`preview-template-${template.id}`}
                    onClick={() => onPreviewTemplate(template)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Try Game</span>
                  </button>

                  <button
                    id={`select-template-${template.id}`}
                    onClick={() => onSelectTemplate(template)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Customize</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
