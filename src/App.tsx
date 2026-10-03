/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CardData, CardTemplate } from './types';
import { CARD_TEMPLATES } from './data/templates';
import { Header } from './components/Header';
import { TemplateGallery } from './components/TemplateGallery';
import { CardBuilder } from './components/CardBuilder';
import { RecipientView } from './components/RecipientView';
import { ShareModal } from './components/ShareModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'gallery' | 'builder' | 'recipient'>('gallery');
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate | null>(null);
  const [activeCard, setActiveCard] = useState<CardData | null>(null);
  const [shareModalCard, setShareModalCard] = useState<CardData | null>(null);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isLoadingCard, setIsLoadingCard] = useState(false);

  // Check URL query params for ?card=:id on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cardId = params.get('card');

    // Also check pathname like /c/:id
    const pathMatch = window.location.pathname.match(/^\/c\/([a-zA-Z0-9_-]+)/);
    const targetId = cardId || (pathMatch ? pathMatch[1] : null);

    if (targetId) {
      loadCardById(targetId);
    }
  }, []);

  const loadCardById = async (id: string) => {
    setIsLoadingCard(true);
    try {
      const res = await fetch(`/api/cards/${id}`);
      if (res.ok) {
        const data: CardData = await res.json();
        setActiveCard(data);
        setCurrentView('recipient');
      } else {
        console.warn(`Card with id ${id} not found on server, checking template fallbacks`);
        // Fallback to demo template
        const fallback = CARD_TEMPLATES.find((t) => t.id === id);
        if (fallback) {
          handleSelectTemplate(fallback);
        }
      }
    } catch (err) {
      console.error('Failed to fetch card:', err);
    } finally {
      setIsLoadingCard(false);
    }
  };

  const handleSelectTemplate = (template: CardTemplate) => {
    setSelectedTemplate(template);
    setCurrentView('builder');
  };

  const handlePreviewTemplate = (template: CardTemplate) => {
    const tempCard: CardData = {
      id: template.id,
      templateId: template.id,
      category: template.category,
      recipientName: template.category === 'proposal' ? 'Sophia' : 'Alex',
      senderName: 'With Love',
      headline: template.defaultHeadline,
      message: template.defaultMessage,
      interactiveType: template.interactiveType,
      photoUrl: template.defaultPhotoUrl,
      themeColor: template.themeColor,
      bgGradient: template.bgGradient,
      proposalQuestion: template.defaultProposalQuestion,
      bgMusicEnabled: true,
      musicTrack: 'romantic_melody',
      createdAt: new Date().toISOString(),
    };
    setActiveCard(tempCard);
    setCurrentView('recipient');
  };

  const handleSelectDemoCard = async (demoId: string) => {
    loadCardById(demoId);
  };

  const handleSaveAndShare = async (cardData: CardData) => {
    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardData),
      });
      if (res.ok) {
        const json = await res.json();
        const savedCard: CardData = json.card;
        setActiveCard(savedCard);
        setShareModalCard(savedCard);
      } else {
        // Fallback local save
        setActiveCard(cardData);
        setShareModalCard(cardData);
      }
    } catch {
      setActiveCard(cardData);
      setShareModalCard(cardData);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-stone-800 flex flex-col selection:bg-rose-200">
      {/* Persistent Navigation Header (hidden when recipient views card in clean immersive mode) */}
      {currentView !== 'recipient' && (
        <Header
          currentView={currentView}
          onNavigate={(view) => {
            if (view === 'builder') {
              setSelectedTemplate(CARD_TEMPLATES[0]);
            }
            setCurrentView(view);
          }}
          onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
          onSelectDemoCard={handleSelectDemoCard}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {isLoadingCard ? (
          <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
            <div className="w-12 h-12 rounded-full border-3 border-rose-500 border-t-transparent animate-spin mb-4" />
            <h3 className="text-lg font-bold font-serif-display text-gray-800">
              Unwrapping your gift experience...
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Preparing animations, sound effects, and surprises
            </p>
          </div>
        ) : currentView === 'recipient' && activeCard ? (
          <RecipientView
            card={activeCard}
            isPreview={false}
            onExitPreview={() => setCurrentView('gallery')}
            onOpenShare={() => setShareModalCard(activeCard)}
            onCreateNew={() => {
              setSelectedTemplate(null);
              setCurrentView('builder');
            }}
          />
        ) : currentView === 'builder' ? (
          <CardBuilder
            initialTemplate={selectedTemplate}
            onSaveAndShare={handleSaveAndShare}
            onCancel={() => setCurrentView('gallery')}
          />
        ) : (
          <TemplateGallery
            onSelectTemplate={handleSelectTemplate}
            onPreviewTemplate={handlePreviewTemplate}
            onOpenCreateBlank={() => {
              setSelectedTemplate(null);
              setCurrentView('builder');
            }}
            onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
          />
        )}
      </main>

      {/* Global Footer for Creator Views */}
      {currentView !== 'recipient' && (
        <footer className="w-full border-t border-stone-200 bg-white py-6 mt-12 text-xs text-stone-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>GDPR, CCPA &amp; DPDP Compliant • Encrypted Gifting Platform</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                id="footer-privacy-btn"
                onClick={() => setIsPrivacyModalOpen(true)}
                className="text-stone-600 hover:text-stone-900 underline font-medium cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                id="footer-arch-btn"
                onClick={() => setIsArchitectureModalOpen(true)}
                className="text-stone-600 hover:text-stone-900 underline font-medium cursor-pointer"
              >
                Architecture &amp; Schema
              </button>
              <span>© 2026 LoveCraft</span>
            </div>
          </div>
        </footer>
      )}

      {/* Share and Publish Modal */}
      {shareModalCard && (
        <ShareModal
          card={shareModalCard}
          isOpen={!!shareModalCard}
          onClose={() => setShareModalCard(null)}
          onViewRecipient={() => {
            setActiveCard(shareModalCard);
            setCurrentView('recipient');
          }}
        />
      )}

      {/* Technical Architecture & Database Specs Modal */}
      <ArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />

      {/* Privacy Policy & Global Compliance Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
}
