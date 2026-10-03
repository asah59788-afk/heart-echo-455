import React, { useState } from 'react';
import { CardData } from '../types';
import {
  X,
  Copy,
  Check,
  Share2,
  QrCode,
  MessageCircle,
  ExternalLink,
  Sparkles,
  Smartphone,
} from 'lucide-react';

interface ShareModalProps {
  card: CardData;
  isOpen: boolean;
  onClose: () => void;
  onViewRecipient: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  card,
  isOpen,
  onClose,
  onViewRecipient,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${origin}/?card=${card.id}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Hey ${card.recipientName}! I made a special interactive surprise for you on LoveCraft 🎁 Open it here: ${shareUrl}`
  )}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `A Surprise for ${card.recipientName}! 🎁`,
          text: `${card.senderName} sent you a personalized interactive gift experience!`,
          url: shareUrl,
        });
      } catch {
        // User canceled or failed
      }
    } else {
      handleCopy();
    }
  };

  // Generate SVG QR Code matrix for direct scanning
  // Using an encoded QR SVG via Google Chart API fallback or simple SVG blocks
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    shareUrl
  )}&bgcolor=ffffff&color=1f2937&margin=1`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-100 p-6 overflow-hidden">
        {/* Close Button */}
        <button
          id="close-share-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 mb-1">
          <Sparkles className="w-4 h-4" />
          <span>EXPERIENCE PUBLISHED</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 font-serif-display">
          Your Gift is Ready to Share!
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 mt-1 mb-5">
          Send this private link to <strong className="text-gray-800">{card.recipientName}</strong>. No app download or account required!
        </p>

        {/* Link Copy Box */}
        <div className="flex items-center gap-2 p-2 bg-stone-50 border border-stone-200 rounded-2xl mb-4">
          <input
            id="share-link-input"
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent px-3 text-xs sm:text-sm text-stone-700 font-mono focus:outline-none overflow-x-auto select-all"
          />
          <button
            id="copy-share-link-btn"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold shadow-xs cursor-pointer transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>

        {/* Action Buttons: WhatsApp, QR, Native Share, Open */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          <a
            id="whatsapp-share-btn"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-medium transition-colors"
          >
            <MessageCircle className="w-4 h-4 mb-1 text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          <button
            id="toggle-qr-code-btn"
            onClick={() => setShowQr(!showQr)}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 text-xs font-medium transition-colors cursor-pointer"
          >
            <QrCode className="w-4 h-4 mb-1 text-purple-600" />
            <span>{showQr ? 'Hide QR' : 'Show QR'}</span>
          </button>

          <button
            id="native-share-btn"
            onClick={handleNativeShare}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-medium transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4 mb-1 text-sky-600" />
            <span>Share Sheet</span>
          </button>

          <button
            id="open-recipient-live-btn"
            onClick={() => {
              onClose();
              onViewRecipient();
            }}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-medium transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 mb-1 text-rose-600" />
            <span>Test Card</span>
          </button>
        </div>

        {/* QR Code display */}
        {showQr && (
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col items-center justify-center mb-5 animate-in fade-in duration-200">
            <img
              src={qrImageUrl}
              alt="Gift QR Code"
              className="w-36 h-36 rounded-lg shadow-sm border border-stone-300"
            />
            <p className="text-[11px] text-stone-500 mt-2">
              Scan with phone camera to open instantly
            </p>
          </div>
        )}

        {/* Open Graph Rich Social Preview Card */}
        <div className="border-t border-stone-100 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
              Social Media Preview (WhatsApp / iMessage)
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Open Graph Active
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 bg-stone-100 rounded-xl border border-stone-200">
            <div className="w-16 h-16 rounded-lg bg-stone-200 overflow-hidden shrink-0">
              <img
                src={card.photoUrl || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=200&q=80'}
                alt="OG Preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">
                A Surprise for {card.recipientName}! 🎁
              </p>
              <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">
                {card.senderName} sent you a personalized interactive digital card on LoveCraft. Click to open!
              </p>
              <p className="text-[10px] text-stone-400 font-mono mt-1">
                lovecraft.gift/c/{card.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
