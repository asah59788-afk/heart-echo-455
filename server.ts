import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory + file-backed card storage
const CARDS_FILE = path.join(process.cwd(), 'cards_data.json');
let cardsStore: Record<string, any> = {};

try {
  if (fs.existsSync(CARDS_FILE)) {
    const raw = fs.readFileSync(CARDS_FILE, 'utf-8');
    cardsStore = JSON.parse(raw);
  }
} catch (err) {
  console.warn('Could not read cards_data.json, starting fresh', err);
  cardsStore = {};
}

function persistCards() {
  try {
    fs.writeFileSync(CARDS_FILE, JSON.stringify(cardsStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving cards_data.json', err);
  }
}

// Seed initial demo cards for immediate testing
if (Object.keys(cardsStore).length === 0) {
  cardsStore['demo-proposal'] = {
    id: 'demo-proposal',
    templateId: 'unrejectable-proposal',
    category: 'proposal',
    recipientName: 'Sophia',
    senderName: 'Alex',
    headline: 'I have a very important question...',
    proposalQuestion: 'Will you be my Valentine & go on a date with me?',
    message: 'From the moment we met, every ordinary day has felt like an extraordinary adventure. You make me laugh, dream bigger, and smile brighter.',
    interactiveType: 'unrejectable_proposal',
    photoUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
    themeColor: '#e11d48',
    bgGradient: 'from-rose-50 via-pink-50 to-red-50',
    bgMusicEnabled: true,
    musicTrack: 'romantic_melody',
    companionConfig: {
      enabled: true,
      type: 'bunny',
      name: 'Mochi',
      accessory: 'heart_glasses',
      furColor: '#fdf4f0',
      dialogueBubbleEnabled: true,
      startAction: 'cheer',
    },
    createdAt: new Date().toISOString(),
    viewsCount: 12,
  };

  cardsStore['demo-birthday'] = {
    id: 'demo-birthday',
    templateId: 'birthday-candles',
    category: 'birthday',
    recipientName: 'Lucas',
    senderName: 'Maya',
    headline: 'Happy Birthday to the Best Person Ever! 🎂',
    message: 'Blow out the candles and make the biggest wish possible! Wishing you another year of crazy fun, huge wins, and lots of cake.',
    interactiveType: 'candle_cake',
    photoUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
    themeColor: '#f59e0b',
    bgGradient: 'from-amber-50 via-rose-50 to-orange-50',
    bgMusicEnabled: true,
    musicTrack: 'birthday_waltz',
    companionConfig: {
      enabled: true,
      type: 'teddy',
      name: 'Barnaby',
      accessory: 'party_hat',
      furColor: '#d49b6a',
      dialogueBubbleEnabled: true,
      startAction: 'wave',
    },
    createdAt: new Date().toISOString(),
    viewsCount: 8,
  };

  cardsStore['demo-puzzle'] = {
    id: 'demo-puzzle',
    templateId: 'memory-puzzle',
    category: 'anniversary',
    recipientName: 'Emma',
    senderName: 'Noah',
    headline: 'Happy 3-Year Anniversary ❤️',
    message: 'Every puzzle piece of our story fits together into something so beautiful. Thank you for being my constant warmth and best friend.',
    interactiveType: 'photo_puzzle',
    photoUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
    themeColor: '#8b5cf6',
    bgGradient: 'from-purple-50 via-indigo-50 to-violet-50',
    bgMusicEnabled: true,
    musicTrack: 'gentle_chime',
    companionConfig: {
      enabled: true,
      type: 'kitty',
      name: 'Mimi',
      accessory: 'flower',
      furColor: '#fecdd3',
      dialogueBubbleEnabled: true,
      startAction: 'wave',
    },
    createdAt: new Date().toISOString(),
    viewsCount: 5,
  };
  persistCards();
}

// Ensure all stored cards have companionConfig
for (const card of Object.values(cardsStore)) {
  if (!card.companionConfig) {
    if (card.category === 'proposal') {
      card.companionConfig = {
        enabled: true,
        type: 'bunny',
        name: 'Mochi',
        accessory: 'heart_glasses',
        furColor: '#fdf4f0',
        dialogueBubbleEnabled: true,
        startAction: 'cheer',
      };
    } else if (card.category === 'birthday') {
      card.companionConfig = {
        enabled: true,
        type: 'teddy',
        name: 'Barnaby',
        accessory: 'party_hat',
        furColor: '#d49b6a',
        dialogueBubbleEnabled: true,
        startAction: 'wave',
      };
    } else {
      card.companionConfig = {
        enabled: true,
        type: 'kitty',
        name: 'Mimi',
        accessory: 'flower',
        furColor: '#fecdd3',
        dialogueBubbleEnabled: true,
        startAction: 'wave',
      };
    }
  }
}
persistCards();

// Lazy Gemini API client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    try {
      geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn('Gemini client init skipped or failed', e);
    }
  }
  return geminiClient;
}

// --- API ROUTES ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', cardsCount: Object.keys(cardsStore).length });
});

// Fetch all cards for creator history
app.get('/api/cards', (req, res) => {
  const cards = Object.values(cardsStore).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  res.json(cards);
});

// Get a specific card by ID
app.get('/api/cards/:id', (req, res) => {
  const card = cardsStore[req.params.id];
  if (!card) {
    return res.status(404).json({ error: 'Card not found' });
  }
  // Increment view counter
  card.viewsCount = (card.viewsCount || 0) + 1;
  persistCards();
  res.json(card);
});

// Create/save a customized card
app.post('/api/cards', (req, res) => {
  const {
    templateId,
    category,
    recipientName,
    senderName,
    headline,
    message,
    interactiveType,
    photoUrl,
    themeColor,
    bgGradient,
    proposalQuestion,
    secretClue,
    bgMusicEnabled,
    musicTrack,
    companionConfig,
  } = req.body;

  if (!recipientName || !message) {
    return res.status(400).json({ error: 'Recipient name and message are required' });
  }

  // Generate unique unguessable ID
  const randomSuffix = Math.random().toString(36).substring(2, 9);
  const safeName = recipientName.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10) || 'card';
  const id = `${safeName}-${randomSuffix}`;

  const newCard = {
    id,
    templateId: templateId || 'custom',
    category: category || 'birthday',
    recipientName: recipientName.trim(),
    senderName: (senderName || 'A special friend').trim(),
    headline: headline?.trim() || `A gift for ${recipientName.trim()}!`,
    message: message.trim(),
    interactiveType: interactiveType || 'balloon_pop',
    photoUrl: photoUrl || '',
    themeColor: themeColor || '#e11d48',
    bgGradient: bgGradient || 'from-rose-50 via-pink-50 to-red-50',
    proposalQuestion: proposalQuestion?.trim() || '',
    secretClue: secretClue?.trim() || '',
    bgMusicEnabled: !!bgMusicEnabled,
    musicTrack: musicTrack || 'romantic_melody',
    companionConfig: companionConfig || {
      enabled: true,
      type: 'teddy',
      name: 'Barnaby',
      accessory: 'ribbon',
      dialogueBubbleEnabled: true,
      startAction: 'wave',
    },
    createdAt: new Date().toISOString(),
    viewsCount: 0,
  };

  cardsStore[id] = newCard;
  persistCards();

  res.status(201).json({
    success: true,
    card: newCard,
    shareUrl: `/c/${id}`,
  });
});

// AI Inspiration message writer helper
app.post('/api/generate-message', async (req, res) => {
  const { category, recipientName, tone, keywords, senderName } = req.body;

  const ai = getGeminiClient();
  if (ai) {
    try {
      const prompt = `Write a short, heartfelt digital gift card message (2-3 sentences max) for a ${category || 'gift'} card.
Recipient: ${recipientName || 'friend'}
Sender: ${senderName || 'friend'}
Tone: ${tone || 'warm, loving, slightly playful'}
Key memories/themes: ${keywords || 'celebrating happiness and friendship'}
Keep it conversational, natural, emotionally touching, and suitable for a digital card like MyHeartCraft. Do not include markdown formatting or quotes.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text?.trim();
      if (text) {
        return res.json({ message: text });
      }
    } catch (err) {
      console.warn('Gemini generation failed, falling back to smart presets', err);
    }
  }

  // High quality fallback presets when AI key is absent
  const fallbacks: Record<string, string[]> = {
    birthday: [
      `Happy Birthday ${recipientName}! May this next year bring you endless reasons to smile, wild adventures, and all the sweet moments you deserve.`,
      `Cheers to you, ${recipientName}! The world is so much brighter and funnier with you in it. Blow out the candles and make your biggest wish!`,
    ],
    proposal: [
      `${recipientName}, every moment spent by your side feels like the easiest, happiest chapter of my life. I cannot imagine my future without you.`,
      `From our first laughs to our quietest late night talks, you have stolen my heart completely. Here is to making memories together forever.`,
    ],
    anniversary: [
      `Happy Anniversary, ${recipientName}! Time flies when you are with the one person who makes every day feel like home.`,
      `Looking back on our journey together, every memory with you is my absolute favorite. I love you more each passing day.`,
    ],
    apology: [
      `Dear ${recipientName}, I truly regret hurting you and am so sorry. You mean far too much to me, and I promise to listen, learn, and do better.`,
    ],
    friendship: [
      `To the greatest friend anyone could ask for, thank you for always being in my corner. Life is a million times better with you!`,
    ],
  };

  const list = fallbacks[category] || fallbacks.friendship;
  const picked = list[Math.floor(Math.random() * list.length)];
  res.json({ message: picked });
});

// Dynamic Open Graph preview for shared card URLs (/c/:id)
app.get('/c/:id', (req, res, next) => {
  const card = cardsStore[req.params.id];
  if (!card) {
    return next(); // pass to spa
  }

  const title = `A Surprise for ${card.recipientName}! 🎁`;
  const desc = `${card.senderName} sent you a personalized interactive digital card on LoveCraft. Click to open your surprise!`;
  const image = card.photoUrl || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&h=630&q=80';

  // Read index.html and inject dynamic metadata
  const indexPath = path.join(process.cwd(), 'index.html');
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf-8');
    html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
    html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`);
    html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${desc}" />`);
    html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${desc}" />`);
    // Inject og:image if not present
    if (!html.includes('og:image')) {
      html = html.replace('</head>', `  <meta property="og:image" content="${image}" />\n  </head>`);
    }
    return res.send(html);
  }
  next();
});

async function startServer() {
  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LoveCraft Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
