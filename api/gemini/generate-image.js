import { GoogleGenAI } from '@google/genai';

function fallbackSVG(promptStr) {
  const safe = String(promptStr)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const label = safe.length > 60 ? safe.substring(0, 57) + '...' : safe;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0B0F19"/><stop offset="50%" stop-color="#1A0D18"/><stop offset="100%" stop-color="#080808"/>
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F59E0B"/><stop offset="50%" stop-color="#E2725B"/><stop offset="100%" stop-color="#C5A059"/>
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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const { prompt, size = '1K', aspectRatio = '1:1' } = req.body ?? {};
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'prompt string is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.json({
      imageUrl: fallbackSVG(prompt),
      mimeType: 'image/svg+xml',
      prompt, size, aspectRatio,
      note: 'SVG fallback: GEMINI_API_KEY not configured.'
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
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
}
