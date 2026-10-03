import React from 'react';
import { X, ShieldCheck, Lock, Eye, Trash2, Mail } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white text-stone-800 rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 font-serif-display">
                Privacy Policy & Data Protection
              </h2>
              <p className="text-xs text-stone-500">
                Effective Date: September 6, 2026 • Compliant with GDPR, CCPA &amp; DPDP
              </p>
            </div>
          </div>

          <button
            id="close-privacy-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Policy Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 text-sm text-stone-700 space-y-6 leading-relaxed">
          {/* 1. Introduction */}
          <section>
            <h3 className="text-base font-bold text-gray-900 font-serif-display mb-2 flex items-center gap-2">
              <span className="text-rose-600">1.</span> Introduction &amp; Core Definitions
            </h3>
            <p className="mb-2">
              Welcome to <strong>LoveCraft</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;, or the &ldquo;Platform&rdquo;). We are committed to protecting your privacy and treating personal data with transparency, integrity, and strict adherence to global privacy regulations, including the <strong>General Data Protection Regulation (GDPR)</strong> (EU/UK), the <strong>California Consumer Privacy Act (CCPA/CPRA)</strong> (US), and the <strong>Digital Personal Data Protection Act (DPDP)</strong> (India).
            </p>
            <p className="mb-2">For clarity in this Privacy Policy:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li>
                <strong>&ldquo;Creator&rdquo; or &ldquo;Sender&rdquo;:</strong> Any individual who initiates, designs, personalizes, or pays for a digital card or interactive experience on LoveCraft.
              </li>
              <li>
                <strong>&ldquo;Recipient&rdquo; or &ldquo;Receiver&rdquo;:</strong> The intended viewer who receives and accesses a generated gift link without requiring account creation or software installation.
              </li>
              <li>
                <strong>&ldquo;User&rdquo;:</strong> Collectively refers to both Creators and Recipients.
              </li>
              <li>
                <strong>&ldquo;User-Generated Content (UGC)&rdquo;:</strong> Photographs, memory images, custom greetings, audio recordings, or question prompts uploaded or typed into a card.
              </li>
              <li>
                <strong>&ldquo;Personal Data&rdquo;:</strong> Any information that identifies, relates to, or could reasonably be linked with an identified or identifiable natural person.
              </li>
            </ul>
          </section>

          {/* 2. Information We Collect */}
          <section>
            <h3 className="text-base font-bold text-gray-900 font-serif-display mb-2 flex items-center gap-2">
              <span className="text-rose-600">2.</span> Information We Collect
            </h3>
            <div className="space-y-3">
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider mb-1.5">
                  A. Information Provided Directly by Creators
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-xs text-stone-600">
                  <li>
                    <strong>Identity &amp; Contact Data:</strong> Sender name or pseudonym, and email address (if account registration or transactional receipts are requested).
                  </li>
                  <li>
                    <strong>Recipient Identifiers:</strong> Recipient first name, nickname, or relationship title entered into the card customizer.
                  </li>
                  <li>
                    <strong>User-Generated Media &amp; Text:</strong> Uploaded photographs, voice notes, heartfelt messages, secret clues, and custom quiz/proposal questions.
                  </li>
                  <li>
                    <strong>Billing Data:</strong> For premium templates or upgrades, payment card data is processed directly via PCI-DSS compliant gateways (e.g., Stripe). We never store complete credit card numbers on our servers.
                  </li>
                </ul>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider mb-1.5">
                  B. Information Collected Automatically (Creators &amp; Recipients)
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-xs text-stone-600">
                  <li>
                    <strong>Device &amp; Telemetry Data:</strong> Browser user-agent, operating system, screen dimensions, language preferences, and IP address (anonymized for analytics where mandated).
                  </li>
                  <li>
                    <strong>Interaction Metrics:</strong> Time of card opening, page view counts, and gamified interaction timestamps (e.g., balloon pops, candle extinguishes, proposal button evasion counts, or puzzle completions).
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. Public/Shareable Nature of Digital Cards */}
          <section className="p-4 bg-rose-50/80 rounded-2xl border border-rose-200">
            <h3 className="text-base font-bold text-rose-900 font-serif-display mb-1.5 flex items-center gap-2">
              <Eye className="w-4 h-4 text-rose-600" />
              <span>3. Public &amp; Shareable Nature of Digital Cards (Crucial Notice)</span>
            </h3>
            <p className="text-xs text-rose-950 leading-relaxed mb-2">
              <strong>Please read carefully before uploading private media:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-rose-900">
              <li>
                Each digital card created on LoveCraft is linked to a <strong>unique, unguessable URL slug or UUID</strong>. Because recipients are not forced to register or download an app, <strong>anyone who possesses or is forwarded this link will be able to view the contents of the card</strong>, including uploaded photos and written messages.
              </li>
              <li>
                <strong>Third-Party Consent Obligation:</strong> As a Creator, you warrant that you have obtained the explicit consent of any third party (such as a friend, partner, or family member) before uploading their photographs, name, or likeness to our Platform.
              </li>
              <li>
                Do not include sensitive confidential information such as passwords, financial records, government ID numbers, or intimate media.
              </li>
            </ul>
          </section>

          {/* 4. How We Use Information */}
          <section>
            <h3 className="text-base font-bold text-gray-900 font-serif-display mb-2 flex items-center gap-2">
              <span className="text-rose-600">4.</span> How We Use Your Information
            </h3>
            <p className="mb-2 text-stone-600">We process Personal Data strictly for legitimate, contractual, and operational purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li>To dynamically render and deliver interactive digital cards upon recipient link access.</li>
              <li>To synthesize real-time animations, Open Graph social share previews, and Web Audio effects.</li>
              <li>To provide optional AI message suggestions (powered by server-side APIs) without retaining your private prompts for third-party model training.</li>
              <li>To detect and prevent malicious abuse, automated scraping, DDoS attacks, or unlawful content.</li>
            </ul>
          </section>

          {/* 5. Data Storage, Retention & Deletion */}
          <section>
            <h3 className="text-base font-bold text-gray-900 font-serif-display mb-2 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>5. Data Storage, Retention, and Early Deletion</span>
            </h3>
            <p className="mb-2 text-stone-600">
              User-uploaded media and generated card configurations are securely stored using cloud storage and database infrastructure (e.g., AWS S3, Cloudinary, and encrypted PostgreSQL/Supabase).
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li>
                <strong>Standard Retention Window:</strong> Generated cards and associated media are maintained for <strong>twelve (12) months</strong> from creation to allow creators and recipients to revisit their celebration, after which cards may be archived or permanently purged.
              </li>
              <li>
                <strong>Immediate Early Deletion Mechanism:</strong> Any Creator or Recipient whose likeness or message appears on a card may request its immediate destruction. You can trigger deletion by contacting our privacy desk at <strong className="text-stone-900">privacy@lovecraft.gift</strong> with the card link. Deletion takes effect across live servers within <strong>48 business hours</strong>.
              </li>
            </ul>
          </section>

          {/* 6. Data Sharing & Third-Party Services */}
          <section>
            <h3 className="text-base font-bold text-gray-900 font-serif-display mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-600" />
              <span>6. Data Sharing &amp; No Sale of Personal Data</span>
            </h3>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-medium mb-3">
              🛡️ <strong>We Never Sell Your Data:</strong> LoveCraft does not sell, rent, monetize, or trade your personal photos, messages, or identifiers to data brokers, advertising networks, or third-party marketing entities.
            </div>
            <p className="text-xs text-stone-600 mb-2">We share information only with vetted infrastructure sub-processors:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-stone-600">
              <li><strong>Cloud Hosting &amp; Compute:</strong> Google Cloud Platform (Cloud Run), AWS, or Vercel for scalable application hosting.</li>
              <li><strong>Media Storage &amp; CDN:</strong> Amazon S3 or Cloudinary for fast, optimized image loading.</li>
              <li><strong>Payment Processing:</strong> Stripe Inc. for encrypted billing.</li>
            </ul>
          </section>

          {/* 7. Cookies & Tracking */}
          <section>
            <h3 className="text-base font-bold text-gray-900 font-serif-display mb-2">
              <span className="text-rose-600">7.</span> Cookies &amp; Tracking Technologies
            </h3>
            <p className="text-xs text-stone-600">
              LoveCraft employs minimal, privacy-preserving session cookies strictly necessary to maintain active card drafts, save audio volume preferences, and prevent fraudulent card generation. We do not use cross-site behavioral tracking cookies.
            </p>
          </section>

          {/* 8. Children's Privacy */}
          <section>
            <h3 className="text-base font-bold text-gray-900 font-serif-display mb-2">
              <span className="text-rose-600">8.</span> Children&apos;s Online Privacy Protection
            </h3>
            <p className="text-xs text-stone-600">
              LoveCraft is intended for general audiences aged 13 and above (or 16 in the European Economic Area). We do not knowingly collect personal information directly from children under 13 in compliance with COPPA. If you believe a child has provided personal details without verified parental consent, please contact us for immediate removal.
            </p>
          </section>

          {/* 9. Global Privacy Rights */}
          <section className="space-y-3">
            <h3 className="text-base font-bold text-gray-900 font-serif-display mb-1">
              <span className="text-rose-600">9.</span> Your Rights under GDPR, CCPA, and India DPDP
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <strong className="text-stone-900 block mb-1">🇪🇺 GDPR (EU &amp; UK)</strong>
                <p className="text-stone-600 text-[11px]">
                  Right to access, correct, delete (&ldquo;Right to be Forgotten&rdquo;), restrict processing, data portability, and lodge a complaint with your supervisory authority.
                </p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <strong className="text-stone-900 block mb-1">🇺🇸 CCPA / CPRA (California)</strong>
                <p className="text-stone-600 text-[11px]">
                  Right to know categories of collected personal data, right to delete, right to non-discrimination, and right to opt-out of any data sharing.
                </p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <strong className="text-stone-900 block mb-1">🇮🇳 DPDP Act (India)</strong>
                <p className="text-stone-600 text-[11px]">
                  Right to summary of personal data processed, right to correction and erasure, right to grievance redressal, and right to nominate.
                </p>
              </div>
            </div>
          </section>

          {/* 10. Contact & Grievance Officer */}
          <section className="p-4 bg-stone-100 rounded-2xl border border-stone-200">
            <h3 className="text-base font-bold text-gray-900 font-serif-display mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-stone-700" />
              <span>10. Contact Us &amp; Grievance Redressal</span>
            </h3>
            <p className="text-xs text-stone-600 mb-2">
              For any privacy inquiries, data subject access requests (DSAR), or immediate card takedown requests, please reach out to our designated Privacy Office:
            </p>
            <div className="text-xs text-stone-700 space-y-1 font-mono">
              <p>• <strong>Support Desk:</strong> privacy@lovecraft.gift</p>
              <p>• <strong>Data Protection / Grievance Officer:</strong> grievance-officer@lovecraft.gift</p>
              <p>• <strong>Company:</strong> LoveCraft Digital Gifting Technologies Inc.</p>
              <p>• <strong>Address:</strong> 100 Innovation Way, Suite 400, San Francisco, CA 94105</p>
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            LoveCraft • Private &amp; Compliant Digital Experiences
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
