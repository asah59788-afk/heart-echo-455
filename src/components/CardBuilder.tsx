import React, { useState } from 'react';
import { CardData, CardTemplate, InteractiveType, TemplateCategory, CompanionConfig } from '../types';
import { RecipientView } from './RecipientView';
import { CompanionSelector } from './companion/CompanionSelector';
import {
  Sparkles,
  Smartphone,
  Monitor,
  Heart,
  Upload,
  Music,
  Share2,
  Wand2,
  CheckCircle,
  HelpCircle,
  Cake,
  Puzzle,
  Gift,
  Mail,
  Flame,
  ArrowLeft,
} from 'lucide-react';

interface CardBuilderProps {
  initialTemplate?: CardTemplate | null;
  onSaveAndShare: (card: CardData) => void;
  onCancel: () => void;
}

const GRADIENT_PRESETS = [
  { name: 'Warm Rose', class: 'from-rose-50 via-pink-50 to-red-50', color: '#e11d48' },
  { name: 'Golden Sun', class: 'from-amber-50 via-rose-50 to-orange-50', color: '#f59e0b' },
  { name: 'Twilight Purple', class: 'from-purple-50 via-indigo-50 to-violet-50', color: '#8b5cf6' },
  { name: 'Emerald Peace', class: 'from-emerald-50 via-teal-50 to-cyan-50', color: '#10b981' },
  { name: 'Ocean Sky', class: 'from-cyan-50 via-sky-50 to-teal-50', color: '#06b6d4' },
];

export const CardBuilder: React.FC<CardBuilderProps> = ({
  initialTemplate,
  onSaveAndShare,
  onCancel,
}) => {
  const [recipientName, setRecipientName] = useState(
    initialTemplate?.category === 'proposal' ? 'Sophia' : 'Alex'
  );
  const [senderName, setSenderName] = useState('With Love');
  const [category, setCategory] = useState<TemplateCategory>(
    initialTemplate?.category || 'birthday'
  );
  const [interactiveType, setInteractiveType] = useState<InteractiveType>(
    initialTemplate?.interactiveType || 'candle_cake'
  );
  const [headline, setHeadline] = useState(
    initialTemplate?.defaultHeadline || 'Happy Birthday, Superstar! 🎂'
  );
  const [message, setMessage] = useState(
    initialTemplate?.defaultMessage ||
      'May your day be filled with warm laughter, sweet surprises, and every dream you whisper coming true.'
  );
  const [photoUrl, setPhotoUrl] = useState(
    initialTemplate?.defaultPhotoUrl ||
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80'
  );
  const [proposalQuestion, setProposalQuestion] = useState(
    initialTemplate?.defaultProposalQuestion ||
      'Will you be my Valentine & go on a date with me?'
  );
  const [secretClue, setSecretClue] = useState(
    'I will love you today, tomorrow, and every day after.'
  );
  const [bgMusicEnabled, setBgMusicEnabled] = useState(true);
  const [musicTrack, setMusicTrack] = useState<'romantic_melody' | 'birthday_waltz' | 'gentle_chime' | 'none'>('romantic_melody');
  const [selectedGradient, setSelectedGradient] = useState(
    initialTemplate?.bgGradient || GRADIENT_PRESETS[0].class
  );
  const [themeColor, setThemeColor] = useState(
    initialTemplate?.themeColor || '#e11d48'
  );
  const [companionConfig, setCompanionConfig] = useState<CompanionConfig>(
    initialTemplate?.defaultCompanion || {
      enabled: true,
      type: 'teddy',
      name: 'Barnaby',
      accessory: 'ribbon',
      furColor: '#d49b6a',
      dialogueBubbleEnabled: true,
      startAction: 'wave',
    }
  );

  // Preview viewport mode: 'mobile' or 'desktop'
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Construct active card object for live preview
  const liveCardData: CardData = {
    id: 'preview-draft',
    templateId: initialTemplate?.id || 'custom',
    category,
    recipientName: recipientName || 'Recipient',
    senderName: senderName || 'Your Name',
    headline: headline || 'A Special Surprise!',
    message: message || 'Your personalized message appears here.',
    interactiveType,
    photoUrl,
    themeColor,
    bgGradient: selectedGradient,
    proposalQuestion,
    secretClue,
    bgMusicEnabled,
    musicTrack,
    companionConfig,
    createdAt: new Date().toISOString(),
  };

  // AI Message Generator helper
  const handleGenerateAiMessage = async () => {
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/generate-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          recipientName,
          senderName,
          tone: 'sweet, heartfelt, authentic, touching',
        }),
      });
      const data = await res.json();
      if (data.message) {
        setMessage(data.message);
      }
    } catch {
      // Fallback
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Handle local photo upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setPhotoUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setIsSaving(true);
    onSaveAndShare(liveCardData);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Top action header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200">
        <button
          id="builder-back-btn"
          onClick={onCancel}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Templates</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Viewport switch */}
          <div className="hidden sm:flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                previewDevice === 'mobile'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Phone</span>
            </button>
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                previewDevice === 'desktop'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Full View</span>
            </button>
          </div>

          {/* Publish / Share Button */}
          <button
            id="builder-save-btn"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-rose-200 hover:shadow-rose-300 transition-all cursor-pointer disabled:opacity-50"
          >
            <Share2 className="w-4 h-4" />
            <span>{isSaving ? 'Publishing...' : 'Save & Share Link'}</span>
          </button>
        </div>
      </div>

      {/* Split Builder Screen: Form on Left, Interactive Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Customization Controls (lg:col-span-5) */}
        <section className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 font-serif-display">
              Card Customizer
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Changes reflect instantaneously in the live interactive player on the right.
            </p>
          </div>

          {/* Recipient & Sender Names */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Recipient Name *
              </label>
              <input
                id="input-recipient-name"
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Sophia"
                className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Your Name / Signoff *
              </label>
              <input
                id="input-sender-name"
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
          </div>

          {/* Interactive Game Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-2">
              Interactive Recipient Game
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'candle_cake', label: 'Blow Candle & Cake', icon: Cake },
                { id: 'unrejectable_proposal', label: 'Dodge Proposal', icon: Flame },
                { id: 'photo_puzzle', label: 'Slide Puzzle', icon: Puzzle },
                { id: 'balloon_pop', label: 'Balloon Pop', icon: Sparkles },
                { id: 'scratch_card', label: 'Scratch Card', icon: Gift },
                { id: 'envelope_seal', label: 'Wax Seal', icon: Mail },
              ].map((item) => {
                const Icon = item.icon;
                const active = interactiveType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setInteractiveType(item.id as InteractiveType)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                      active
                        ? 'bg-rose-50 border-rose-400 text-rose-800 shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1 ${active ? 'text-rose-600' : 'text-stone-400'}`} />
                    <span className="text-[11px] leading-tight">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contextual Input: Proposal Question if proposal */}
          {interactiveType === 'unrejectable_proposal' && (
            <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-200">
              <label className="block text-xs font-bold text-rose-900 mb-1">
                Proposal Question
              </label>
              <input
                id="input-proposal-question"
                type="text"
                value={proposalQuestion}
                onChange={(e) => setProposalQuestion(e.target.value)}
                placeholder="Will you be my Valentine & go on a date with me?"
                className="w-full text-xs sm:text-sm bg-white border border-rose-200 rounded-xl px-3 py-2 text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
              <p className="text-[11px] text-rose-700 mt-1">
                The &ldquo;No&rdquo; button will mischievously escape when they try to tap it!
              </p>
            </div>
          )}

          {/* Headline */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Main Headline
            </label>
            <input
              id="input-headline"
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Happy Birthday to the Best Person Ever!"
              className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* The Heartfelt Message & AI Inspiration */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-stone-700">
                Heartfelt Message
              </label>
              <button
                id="ai-inspiration-btn"
                type="button"
                onClick={handleGenerateAiMessage}
                disabled={isAiGenerating}
                className="flex items-center gap-1 text-[11px] font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 transition-colors cursor-pointer"
              >
                <Wand2 className="w-3 h-3 text-purple-600" />
                <span>{isAiGenerating ? 'Thinking...' : 'AI Message Helper'}</span>
              </button>
            </div>
            <textarea
              id="input-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your heartfelt message here..."
              className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 leading-relaxed resize-none"
            />
          </div>

          {/* Photo upload / URL */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Photo / Memory Image
            </label>
            <div className="flex gap-2">
              <input
                id="input-photo-url"
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://... photo URL"
                className="flex-1 text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none"
              />
              <label
                htmlFor="photo-upload-input"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-200 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
                <input
                  id="photo-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            {photoUrl && (
              <div className="mt-2 flex items-center gap-2">
                <img
                  src={photoUrl}
                  alt="Thumbnail"
                  className="w-9 h-9 rounded-lg object-cover border border-stone-200"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[11px] text-stone-500">Image attached</span>
              </div>
            )}
          </div>

          {/* Virtual Companion ('Little Friend') Customization Section */}
          <div className="pt-2 border-t border-stone-100">
            <CompanionSelector
              config={companionConfig}
              onChange={setCompanionConfig}
              recipientName={recipientName}
            />
          </div>

          {/* Ambient Music & Theme Gradient */}
          <div className="pt-2 border-t border-stone-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-stone-500" />
                <span className="text-xs font-bold text-stone-700">Ambient Background Music</span>
              </div>
              <input
                id="bg-music-toggle"
                type="checkbox"
                checked={bgMusicEnabled}
                onChange={(e) => setBgMusicEnabled(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded-md focus:ring-rose-500 cursor-pointer"
              />
            </div>

            {/* Gradient Presets */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Background Theme Color
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {GRADIENT_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setSelectedGradient(preset.class);
                      setThemeColor(preset.color);
                    }}
                    className={`w-7 h-7 rounded-full bg-gradient-to-br ${
                      preset.class
                    } border-2 transition-transform cursor-pointer ${
                      selectedGradient === preset.class
                        ? 'border-stone-900 scale-110 shadow-sm'
                        : 'border-transparent hover:scale-105'
                    }`}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Real-Time Interactive Preview (lg:col-span-7) */}
        <section className="lg:col-span-7 flex flex-col items-center sticky top-20">
          <div className="w-full flex items-center justify-between mb-3 px-2">
            <span className="text-xs font-bold text-stone-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Interactive Recipient Preview
            </span>
            <span className="text-[11px] text-stone-400">
              Try playing the game directly in this preview!
            </span>
          </div>

          {/* Preview Viewport Container */}
          {previewDevice === 'mobile' ? (
            /* Realistic Phone Frame */
            <div className="w-[340px] sm:w-[380px] h-[680px] sm:h-[720px] bg-stone-900 rounded-[48px] p-3.5 shadow-2xl border-4 border-stone-800 relative flex flex-col">
              {/* Phone Speaker Notch */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-stone-950 rounded-full z-30 flex items-center justify-center">
                <div className="w-8 h-1 bg-stone-800 rounded-full" />
                <div className="w-2 h-2 rounded-full bg-stone-900 ml-2" />
              </div>

              {/* Inside Screen */}
              <div className="w-full h-full rounded-[38px] overflow-y-auto overflow-x-hidden relative bg-white flex flex-col scrollbar-thin">
                <RecipientView card={liveCardData} isPreview={true} />
              </div>
            </div>
          ) : (
            /* Desktop / Wide Frame */
            <div className="w-full h-[680px] rounded-3xl overflow-y-auto overflow-x-hidden border border-stone-300 shadow-2xl bg-white scrollbar-thin">
              <RecipientView card={liveCardData} isPreview={true} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
