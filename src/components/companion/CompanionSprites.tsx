import React from 'react';
import { CompanionType, CompanionEmotion, CompanionAccessory } from '../../types';
import { motion } from 'motion/react';

interface CompanionSpriteProps {
  type: CompanionType;
  emotion: CompanionEmotion;
  accessory?: CompanionAccessory;
  furColor?: string;
  size?: number;
}

export const CompanionSprite: React.FC<CompanionSpriteProps> = ({
  type,
  emotion,
  accessory = 'ribbon',
  furColor,
  size = 120,
}) => {
  // Default fur colors per companion type if not custom
  const baseColor =
    furColor ||
    (type === 'teddy'
      ? '#d49b6a'
      : type === 'bunny'
      ? '#fdf4f0'
      : type === 'kitty'
      ? '#fecdd3'
      : '#f59e0b');

  const secondaryColor =
    type === 'teddy'
      ? '#b87d4d'
      : type === 'bunny'
      ? '#fbcfe8'
      : type === 'kitty'
      ? '#fda4af'
      : '#d97706';

  const snoutColor = '#fff5ea';
  const innerEarColor = '#fca5a5';

  // Render accessories
  const renderAccessory = () => {
    switch (accessory) {
      case 'party_hat':
        return (
          <g className="companion-party-hat" transform="translate(48, 8)">
            <polygon points="12,0 0,34 24,34" fill="#f43f5e" />
            <polygon points="12,0 6,34 18,34" fill="#fbbf24" opacity="0.8" />
            <circle cx="12" cy="0" r="4.5" fill="#fbbf24" />
            <ellipse cx="12" cy="34" rx="13" ry="3" fill="#f43f5e" />
          </g>
        );
      case 'crown':
        return (
          <g className="companion-crown" transform="translate(45, 12)">
            <polygon points="0,18 6,2 15,12 24,2 30,18" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
            <circle cx="6" cy="2" r="2.5" fill="#ec4899" />
            <circle cx="15" cy="12" r="2.5" fill="#3b82f6" />
            <circle cx="24" cy="2" r="2.5" fill="#10b981" />
          </g>
        );
      case 'flower':
        return (
          <g className="companion-flower" transform="translate(24, 20)">
            <circle cx="6" cy="2" r="4.5" fill="#f472b6" />
            <circle cx="10" cy="6" r="4.5" fill="#f472b6" />
            <circle cx="6" cy="10" r="4.5" fill="#f472b6" />
            <circle cx="2" cy="6" r="4.5" fill="#f472b6" />
            <circle cx="6" cy="6" r="3.5" fill="#fef08a" />
          </g>
        );
      case 'heart_glasses':
        return (
          <g className="companion-glasses" transform="translate(34, 52)">
            <path
              d="M0,8 C0,3 5,0 10,4 C15,0 20,3 20,8 C20,14 10,20 10,20 C10,20 0,14 0,8 Z"
              fill="#e11d48"
              opacity="0.9"
            />
            <path
              d="M32,8 C32,3 37,0 42,4 C47,0 52,3 52,8 C52,14 42,20 42,20 C42,20 32,14 32,8 Z"
              fill="#e11d48"
              opacity="0.9"
            />
            <line x1="20" y1="8" x2="32" y2="8" stroke="#be123c" strokeWidth="2.5" />
          </g>
        );
      case 'ribbon':
      default:
        if (accessory === 'none') return null;
        return (
          <g className="companion-ribbon" transform="translate(48, 86)">
            {/* Satin Bow */}
            <path d="M12,8 L0,0 C0,16 12,10 12,8 Z" fill="#e11d48" />
            <path d="M12,8 L24,0 C24,16 12,10 12,8 Z" fill="#e11d48" />
            <circle cx="12" cy="8" r="4" fill="#be123c" />
            {/* Ribbons hanging */}
            <path d="M9,10 L4,20" stroke="#be123c" strokeWidth="2" strokeLinecap="round" />
            <path d="M15,10 L20,20" stroke="#be123c" strokeWidth="2" strokeLinecap="round" />
          </g>
        );
    }
  };

  // Facial features based on emotion
  const renderFace = () => {
    switch (emotion) {
      case 'loving':
        return (
          <g id="companion-face-loving">
            {/* Heart Eyes */}
            <g transform="translate(40, 50)">
              <path
                d="M0,5 C0,1 4,-1 8,2 C12,-1 16,1 16,5 C16,9 8,14 8,14 C8,14 0,9 0,5 Z"
                fill="#e11d48"
              />
            </g>
            <g transform="translate(64, 50)">
              <path
                d="M0,5 C0,1 4,-1 8,2 C12,-1 16,1 16,5 C16,9 8,14 8,14 C8,14 0,9 0,5 Z"
                fill="#e11d48"
              />
            </g>
            {/* Rosy Blushing Cheeks */}
            <ellipse cx="36" cy="65" rx="7" ry="4" fill="#f43f5e" opacity="0.5" />
            <ellipse cx="84" cy="65" rx="7" ry="4" fill="#f43f5e" opacity="0.5" />
            {/* Kiss mouth */}
            <circle cx="60" cy="72" r="3.5" fill="#be123c" />
          </g>
        );

      case 'cheering':
        return (
          <g id="companion-face-cheering">
            {/* Joy Crescent Eyes (closed laughing) */}
            <path
              d="M40,54 Q48,46 56,54"
              stroke="#4a2810"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M64,54 Q72,46 80,54"
              stroke="#4a2810"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Big smiling mouth */}
            <path
              d="M50,68 Q60,82 70,68 Z"
              fill="#e11d48"
              stroke="#881337"
              strokeWidth="1.5"
            />
            <ellipse cx="60" cy="74" rx="4" ry="2.5" fill="#fda4af" />
            {/* Cheeks */}
            <ellipse cx="36" cy="63" rx="6" ry="3.5" fill="#fb7185" opacity="0.6" />
            <ellipse cx="84" cy="63" rx="6" ry="3.5" fill="#fb7185" opacity="0.6" />
          </g>
        );

      case 'surprised':
        return (
          <g id="companion-face-surprised">
            {/* Wide Round Eyes */}
            <circle cx="46" cy="52" r="6" fill="#4a2810" />
            <circle cx="44" cy="50" r="2" fill="#ffffff" />
            <circle cx="74" cy="52" r="6" fill="#4a2810" />
            <circle cx="72" cy="50" r="2" fill="#ffffff" />
            {/* Little 'o' mouth */}
            <ellipse cx="60" cy="71" rx="4.5" ry="6" fill="#881337" />
            {/* Raised Eyebrows */}
            <path d="M40,43 Q46,39 52,43" stroke="#4a2810" strokeWidth="2.5" fill="none" />
            <path d="M68,43 Q74,39 80,43" stroke="#4a2810" strokeWidth="2.5" fill="none" />
            {/* Cheeks */}
            <circle cx="36" cy="64" r="5" fill="#f43f5e" opacity="0.4" />
            <circle cx="84" cy="64" r="5" fill="#f43f5e" opacity="0.4" />
          </g>
        );

      case 'curious':
        return (
          <g id="companion-face-curious">
            {/* Thoughtful Eyes */}
            <circle cx="48" cy="52" r="5" fill="#4a2810" />
            <circle cx="46" cy="50" r="1.8" fill="#ffffff" />
            <circle cx="74" cy="52" r="5" fill="#4a2810" />
            <circle cx="72" cy="50" r="1.8" fill="#ffffff" />
            {/* One raised eyebrow, one flat */}
            <path d="M41,41 Q47,36 53,42" stroke="#4a2810" strokeWidth="2.5" fill="none" />
            <path d="M69,45 Q74,44 79,45" stroke="#4a2810" strokeWidth="2.5" fill="none" />
            {/* Thoughtful wry smirk */}
            <path
              d="M55,70 Q62,74 68,69"
              stroke="#4a2810"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Cheeks */}
            <ellipse cx="37" cy="64" rx="5" ry="3" fill="#fb7185" opacity="0.4" />
            <ellipse cx="83" cy="64" rx="5" ry="3" fill="#fb7185" opacity="0.4" />
          </g>
        );

      case 'giggle':
        return (
          <g id="companion-face-giggle">
            {/* Squeezed laughing eyes: > < */}
            <path d="M41,49 L49,53 L41,57" stroke="#4a2810" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M79,49 L71,53 L79,57" stroke="#4a2810" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Open giggle mouth */}
            <path d="M52,68 Q60,78 68,68 Z" fill="#e11d48" />
            {/* Blushing cheek accents */}
            <ellipse cx="35" cy="63" rx="7" ry="4" fill="#f43f5e" opacity="0.6" />
            <ellipse cx="85" cy="63" rx="7" ry="4" fill="#f43f5e" opacity="0.6" />
          </g>
        );

      case 'greeting':
      case 'idle':
      default:
        return (
          <g id="companion-face-default">
            {/* Sweet Round Sparkling Eyes */}
            <circle cx="47" cy="52" r="5" fill="#4a2810" />
            <circle cx="45" cy="50" r="1.8" fill="#ffffff" />
            <circle cx="73" cy="52" r="5" fill="#4a2810" />
            <circle cx="71" cy="50" r="1.8" fill="#ffffff" />
            {/* Cute smile */}
            <path
              d="M53,68 Q60,74 67,68"
              stroke="#4a2810"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Rosy cheeks */}
            <ellipse cx="36" cy="63" rx="6" ry="3.5" fill="#fb7185" opacity="0.5" />
            <ellipse cx="84" cy="63" rx="6" ry="3.5" fill="#fb7185" opacity="0.5" />
          </g>
        );
    }
  };

  // Specific body & ears for Teddy
  const renderTeddy = () => (
    <g id="companion-teddy">
      {/* Round Teddy Ears */}
      <circle cx="28" cy="32" r="15" fill={baseColor} />
      <circle cx="28" cy="32" r="9" fill={innerEarColor} opacity="0.6" />
      <circle cx="92" cy="32" r="15" fill={baseColor} />
      <circle cx="92" cy="32" r="9" fill={innerEarColor} opacity="0.6" />

      {/* Body */}
      <ellipse cx="60" cy="98" rx="30" ry="24" fill={baseColor} />
      {/* Tummy patch */}
      <ellipse cx="60" cy="100" rx="19" ry="15" fill={snoutColor} />

      {/* Head */}
      <circle cx="60" cy="58" r="32" fill={baseColor} />

      {/* Snout */}
      <ellipse cx="60" cy="65" rx="14" ry="10" fill={snoutColor} />
      {/* Nose */}
      <ellipse cx="60" cy="61" rx="5" ry="3.5" fill="#4a2810" />

      {/* Little Feet */}
      <circle cx="42" cy="116" r="8" fill={secondaryColor} />
      <circle cx="78" cy="116" r="8" fill={secondaryColor} />
    </g>
  );

  // Specific body & ears for Bunny
  const renderBunny = () => (
    <g id="companion-bunny">
      {/* Long Floppy Bunny Ears */}
      <motion.g
        animate={
          emotion === 'cheering'
            ? { rotate: [-5, 5, -5] }
            : { rotate: [0, 2, 0] }
        }
        transition={{ repeat: Infinity, duration: 2 }}
        style={{ transformOrigin: '32px 36px' }}
      >
        <ellipse cx="34" cy="18" rx="8" ry="22" fill={baseColor} transform="rotate(-10 34 18)" />
        <ellipse cx="34" cy="18" rx="4.5" ry="17" fill={innerEarColor} opacity="0.7" transform="rotate(-10 34 18)" />
      </motion.g>

      <motion.g
        animate={
          emotion === 'cheering'
            ? { rotate: [5, -5, 5] }
            : { rotate: [0, -2, 0] }
        }
        transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
        style={{ transformOrigin: '88px 36px' }}
      >
        <ellipse cx="86" cy="18" rx="8" ry="22" fill={baseColor} transform="rotate(10 86 18)" />
        <ellipse cx="86" cy="18" rx="4.5" ry="17" fill={innerEarColor} opacity="0.7" transform="rotate(10 86 18)" />
      </motion.g>

      {/* Body */}
      <ellipse cx="60" cy="98" rx="28" ry="22" fill={baseColor} />
      <ellipse cx="60" cy="100" rx="17" ry="14" fill="#ffffff" />

      {/* Head */}
      <circle cx="60" cy="60" r="30" fill={baseColor} />

      {/* Snout */}
      <ellipse cx="60" cy="66" rx="11" ry="8" fill="#ffffff" />
      {/* Pink nose */}
      <polygon points="60,65 57,61 63,61" fill="#f43f5e" />

      {/* Bunny Paws / Feet */}
      <ellipse cx="40" cy="116" rx="9" ry="6" fill={baseColor} />
      <ellipse cx="80" cy="116" rx="9" ry="6" fill={baseColor} />
    </g>
  );

  // Specific body & ears for Kitty
  const renderKitty = () => (
    <g id="companion-kitty">
      {/* Pointy Cat Ears */}
      <polygon points="26,45 36,18 52,38" fill={baseColor} />
      <polygon points="30,42 36,24 48,38" fill={innerEarColor} opacity="0.7" />
      <polygon points="94,45 84,18 68,38" fill={baseColor} />
      <polygon points="90,42 84,24 72,38" fill={innerEarColor} opacity="0.7" />

      {/* Body */}
      <ellipse cx="60" cy="98" rx="28" ry="22" fill={baseColor} />
      <ellipse cx="60" cy="100" rx="17" ry="13" fill="#fff5ea" />

      {/* Curled Tail */}
      <path
        d="M86,104 Q104,96 100,82 Q96,76 90,82"
        stroke={baseColor}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />

      {/* Head */}
      <circle cx="60" cy="58" r="30" fill={baseColor} />

      {/* Whiskers */}
      <line x1="28" y1="62" x2="14" y2="60" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="28" y1="66" x2="16" y2="69" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="92" y1="62" x2="106" y2="60" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="92" y1="66" x2="104" y2="69" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />

      {/* Snout & Nose */}
      <ellipse cx="60" cy="65" rx="9" ry="6" fill="#fff5ea" />
      <polygon points="60,64 57,61 63,61" fill="#f43f5e" />

      {/* Paws */}
      <circle cx="44" cy="116" r="7" fill={secondaryColor} />
      <circle cx="76" cy="116" r="7" fill={secondaryColor} />
    </g>
  );

  // Specific body & ears for Puppy
  const renderPuppy = () => (
    <g id="companion-puppy">
      {/* Floppy Puppy Ears */}
      <ellipse cx="26" cy="48" rx="9" ry="19" fill={secondaryColor} transform="rotate(20 26 48)" />
      <ellipse cx="94" cy="48" rx="9" ry="19" fill={secondaryColor} transform="rotate(-20 94 48)" />

      {/* Body */}
      <ellipse cx="60" cy="98" rx="29" ry="23" fill={baseColor} />
      <ellipse cx="60" cy="100" rx="17" ry="14" fill="#ffffff" />

      {/* Wagging Tail */}
      <motion.path
        animate={{ rotate: [-10, 10, -10] }}
        transition={{ repeat: Infinity, duration: 0.6 }}
        style={{ transformOrigin: '88px 104px' }}
        d="M88,104 Q106,94 104,80"
        stroke={secondaryColor}
        strokeWidth="6.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Head */}
      <circle cx="60" cy="58" r="31" fill={baseColor} />

      {/* Snout */}
      <ellipse cx="60" cy="66" rx="14" ry="9.5" fill="#ffffff" />
      <ellipse cx="60" cy="61" rx="5.5" ry="3.5" fill="#4a2810" />

      {/* Paws */}
      <circle cx="42" cy="116" r="7.5" fill={secondaryColor} />
      <circle cx="78" cy="116" r="7.5" fill={secondaryColor} />
    </g>
  );

  // Dynamic Paws / Arms for Waving, Clapping or Holding
  const renderArms = () => {
    if (emotion === 'greeting') {
      return (
        <g id="companion-arms-greeting">
          {/* Left resting paw */}
          <circle cx="34" cy="92" r="7" fill={secondaryColor} />
          {/* Right waving arm & paw with motion loop */}
          <motion.g
            animate={{ rotate: [0, -25, 0, -25, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            style={{ transformOrigin: '84px 88px' }}
          >
            <ellipse cx="88" cy="74" rx="7" ry="11" fill={baseColor} transform="rotate(-30 88 74)" />
            <circle cx="94" cy="66" r="7" fill={secondaryColor} />
          </motion.g>
        </g>
      );
    }

    if (emotion === 'cheering') {
      return (
        <g id="companion-arms-cheering">
          {/* Both arms raised up celebrating */}
          <motion.g
            animate={{ y: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          >
            <ellipse cx="32" cy="74" rx="7" ry="11" fill={baseColor} transform="rotate(35 32 74)" />
            <circle cx="26" cy="66" r="7" fill={secondaryColor} />
            <ellipse cx="88" cy="74" rx="7" ry="11" fill={baseColor} transform="rotate(-35 88 74)" />
            <circle cx="94" cy="66" r="7" fill={secondaryColor} />
          </motion.g>
        </g>
      );
    }

    if (emotion === 'curious') {
      return (
        <g id="companion-arms-curious">
          <circle cx="34" cy="92" r="7" fill={secondaryColor} />
          {/* Right paw to chin thinking */}
          <ellipse cx="76" cy="78" rx="7" ry="10" fill={baseColor} transform="rotate(-40 76 78)" />
          <circle cx="72" cy="72" r="7" fill={secondaryColor} />
        </g>
      );
    }

    if (emotion === 'surprised') {
      return (
        <g id="companion-arms-surprised">
          {/* Both paws on cheeks */}
          <circle cx="34" cy="72" r="7" fill={secondaryColor} />
          <circle cx="86" cy="72" r="7" fill={secondaryColor} />
        </g>
      );
    }

    // Default resting paws
    return (
      <g id="companion-arms-default">
        <circle cx="34" cy="92" r="7" fill={secondaryColor} />
        <circle cx="86" cy="92" r="7" fill={secondaryColor} />
      </g>
    );
  };

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      <motion.svg
        viewBox="0 0 120 126"
        className="w-full h-full drop-shadow-md overflow-visible"
        animate={
          emotion === 'cheering'
            ? { y: [0, -7, 0] }
            : emotion === 'giggle'
            ? { rotate: [-4, 4, -4] }
            : emotion === 'loving'
            ? { scale: [1, 1.05, 1] }
            : { y: [0, -2, 0] }
        }
        transition={{
          repeat: Infinity,
          duration: emotion === 'cheering' ? 0.6 : emotion === 'giggle' ? 0.35 : 2.5,
          ease: 'easeInOut',
        }}
      >
        {/* Character Base */}
        {type === 'teddy' && renderTeddy()}
        {type === 'bunny' && renderBunny()}
        {type === 'kitty' && renderKitty()}
        {type === 'puppy' && renderPuppy()}

        {/* Dynamic Emotional Face */}
        {renderFace()}

        {/* Dynamic Animated Arms */}
        {renderArms()}

        {/* Dynamic Accessory */}
        {renderAccessory()}

        {/* Celebratory Floating Sparkles / Hearts on Cheering & Loving */}
        {emotion === 'loving' && (
          <g className="companion-loving-particles">
            <motion.text
              x="20"
              y="30"
              fontSize="12"
              animate={{ y: [30, 15], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
            >
              💖
            </motion.text>
            <motion.text
              x="90"
              y="32"
              fontSize="10"
              animate={{ y: [32, 18], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }}
            >
              💕
            </motion.text>
          </g>
        )}

        {emotion === 'cheering' && (
          <g className="companion-cheering-particles">
            <motion.text
              x="16"
              y="26"
              fontSize="12"
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              ✨
            </motion.text>
            <motion.text
              x="92"
              y="26"
              fontSize="12"
              animate={{ scale: [1.2, 0.8, 1.2], opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              🌟
            </motion.text>
          </g>
        )}
      </motion.svg>
    </div>
  );
};
