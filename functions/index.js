/* eslint-disable */
const { onRequest } = require('firebase-functions/v2/https');
const { GoogleGenAI } = require('@google/genai');
const express = require('express');

const app = express();
app.use(express.json({ limit: '10mb' }));

// CORS — allow only the production domain and localhost dev
app.use((req, res, next) => {
  const allowed = ['https://portfoliofreda.me', 'http://localhost:3000', 'http://localhost:5173'];
  const origin = req.headers.origin;
  if (origin && allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

function getAI() {
  // GEMINI_API_KEY is set via: firebase functions:secrets:set GEMINI_API_KEY
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
}

function fallbackSVG(promptStr) {
  const safe = String(promptStr)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const label = safe.length > 60 ? safe.substring(0, 57) + '...' : safe;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0B0F19"/>
        <stop offset="50%" stop-color="#1A0D18"/>
        <stop offset="100%" stop-color="#080808"/>
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F59E0B"/>
        <stop offset="50%" stop-color="#E2725B"/>
        <stop offset="100%" stop-color="#C5A059"/>
      </linearGradient>
    </defs>
    <rect width="800" height="800" fill="url(#bg)"/>
    <circle cx="400" cy="360" r="280" fill="none" stroke="url(#gold)" stroke-width="2" opacity="0.3" stroke-dasharray="12 6"/>
    <circle cx="400" cy="360" r="210" fill="none" stroke="#E2725B" stroke-width="1.5" opacity="0.4"/>
    <g transform="translate(400,360)">
      <polygon points="0,-120 104,-60 104,60 0,120 -104,60 -104,-60" fill="none" stroke="url(#gold)" stroke-width="3"/>
      <circle cx="0" cy="0" r="45" fill="#E2725B" opacity="0.2"/>
      <path d="M-30,0 L30,0 M0,-30 L0,30" stroke="#F59E0B" stroke-width="3"/>
    </g>
    <text x="400" y="660" font-family="system-ui,sans-serif" font-weight="800" font-size="20" fill="#F59E0B" text-anchor="middle" letter-spacing="2">AFROFUTURIST VISUAL CONCEPT</text>
    <text x="400" y="695" font-family="system-ui,sans-serif" font-size="13" fill="#D1D5DB" text-anchor="middle" opacity="0.9">"${label}"</text>
    <text x="400" y="730" font-family="monospace" font-size="11" fill="#E2725B" text-anchor="middle" opacity="0.8">FREDA OFORI AI STUDIO</text>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// ── Chat endpoint ──────────────────────────────────────────────────────────────
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { messages, systemInstruction } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required.' });
    }

    const ai = getAI();
    if (!ai) {
      const last = messages[messages.length - 1];
      return res.json({
        text: `Offline mode — GEMINI_API_KEY not configured on the server.\n\nYou asked: "${last?.text || ''}"\n\nFreda Ofori is a Cloud & DevOps Engineer and Full-Stack Developer skilled in AWS, Terraform, Docker, Kubernetes, CI/CD, React, and TypeScript.`,
        note: 'fallback-offline'
      });
    }

    const defaultSystem = `You are Freda Ofori's AI Portfolio Assistant. Freda is a Cloud & DevOps Engineer and Full-Stack Developer based in Accra, Ghana. She has expertise in AWS (Cloud Essentials, Amazon Q Developer certifications), Terraform, Docker, Kubernetes, CI/CD pipelines, React 19, TypeScript, and Firebase. Her notable projects include AlertGH (civic tech PWA), FoodBridge (food donation platform), an Event Registration & Ticketing System (Kubernetes), a Serverless To-Do App on AWS, and SmartSpend (finance tracker). She completed a Siemens Project Manager Job Simulation via Forage and a Google Ads for Beginners course via Coursera. She is pursuing a BTech in Computer Science at Accra Technical University (graduating 2026). Answer questions politely, concisely, and accurately. Never invent qualifications, projects, or experience not listed here.`;

    const contents = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents,
      config: { systemInstruction: systemInstruction || defaultSystem }
    });

    return res.json({ text: response.text || 'No response generated.' });
  } catch (err) {
    console.error('Chat error:', err);
    return res.status(500).json({ error: err.message || 'Chat request failed.' });
  }
});

// ── Image generation endpoint ──────────────────────────────────────────────────
app.post('/api/gemini/generate-image', async (req, res) => {
  const { prompt, size = '1K', aspectRatio = '1:1' } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'prompt string is required.' });
  }

  const ai = getAI();
  if (!ai) {
    return res.json({
      imageUrl: fallbackSVG(prompt),
      mimeType: 'image/svg+xml',
      prompt, size, aspectRatio,
      note: 'SVG fallback: GEMINI_API_KEY not configured.'
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-preview-image-generation',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseModalities: ['TEXT', 'IMAGE'] }
    });

    let imageUrl = null;
    let mimeType = 'image/png';

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        mimeType = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      imageUrl = fallbackSVG(prompt);
      mimeType = 'image/svg+xml';
    }

    return res.json({ imageUrl, mimeType, prompt, size, aspectRatio });
  } catch (err) {
    console.warn('Image gen error (SVG fallback):', err?.message);
    return res.json({
      imageUrl: fallbackSVG(prompt),
      mimeType: 'image/svg+xml',
      prompt, size, aspectRatio,
      note: 'SVG fallback: ' + (err?.message || 'generation failed')
    });
  }
});

// Export as a single Firebase Function named "api"
exports.api = onRequest(
  {
    region: 'us-central1',
    memory: '256MiB',
    timeoutSeconds: 60,
    secrets: ['GEMINI_API_KEY']
  },
  app
);
