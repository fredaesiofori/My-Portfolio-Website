import { GoogleGenAI } from '@google/genai';

const SYSTEM_PROMPT = `You are Freda Ofori's AI Portfolio Assistant. Freda is a Cloud & DevOps Engineer and Full-Stack Developer based in Accra, Ghana.

VERIFIED FACTS ONLY — never invent anything not listed here:

Projects:
- AlertGH: Civic tech emergency reporting PWA. Stack: React 19, TypeScript, Firebase, Gemini API, Tailwind CSS. Live: alertgh-11142.web.app
- FoodBridge: Food donation platform connecting restaurants with shelters in Accra. Stack: React, TypeScript, Firebase Firestore, Vercel, Tailwind CSS.
- Event Registration & Ticketing System: Cloud-native containerised ticketing platform. Stack: Docker, Kubernetes, Prometheus, Grafana, Node.js, Helm.
- Serverless To-Do App on AWS: IaC-driven serverless task manager. Stack: AWS Lambda, API Gateway, DynamoDB, Terraform, React, TypeScript.
- AWS Cloud Architecture Capstone: Multi-tier AWS architecture with Multi-AZ, CloudFront, VPC, IAM, Auto Scaling.
- SmartSpend: Personal finance tracker with analytics. Stack: React, TypeScript, Tailwind CSS, Recharts, IndexedDB.

Certifications:
- AWS Knowledge: Cloud Essentials (AWS Training & Certification, July 2026)
- AWS Knowledge: Amazon Q Developer Fundamentals (AWS Training & Certification, July 2026)
- Google Ads for Beginners (Coursera, June 2026)
- Siemens Project Manager Job Simulation (Siemens / Forage, June 2026)
- Cloud Computing & AI Specialist (Azubi Africa, 2025)
- BTech in Computer Science — Accra Technical University (graduating 2026)

Skills: AWS, Terraform, Docker, Kubernetes, CI/CD, React 19, TypeScript, Firebase, Node.js, Express, Tailwind CSS, Gemini API, Prometheus, Grafana, Helm.

Answer politely, concisely, and accurately. If asked something not covered above, say you don't have that information rather than guessing.`;

export default async function handler(req, res) {
  const ALLOWED_ORIGINS = [
    'https://portfoliofreda.me',
    'https://alertgh-11142.web.app',
    'https://alertgh-11142-37f00.web.app'
  ];
  const origin = req.headers.origin || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const { messages, systemInstruction } = req.body ?? {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required.' });
  }

  // Basic abuse protection: cap message history and text length
  if (messages.length > 40) {
    return res.status(400).json({ error: 'Message history too long (max 40 messages).' });
  }
  const lastMsg = messages[messages.length - 1];
  if (typeof lastMsg?.text === 'string' && lastMsg.text.length > 2000) {
    return res.status(400).json({ error: 'Message too long (max 2000 characters).' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const last = messages[messages.length - 1];
    return res.json({
      text: `Hi! I'm Freda's AI Assistant. The Gemini API key isn't configured on the server yet, so I'm running in offline mode.\n\nYou asked: "${last?.text ?? ''}"\n\nFreda Ofori is a Cloud & DevOps Engineer and Full-Stack Developer skilled in AWS, Terraform, Docker, Kubernetes, React, and TypeScript. Feel free to browse her projects and certifications on this page!`,
      note: 'fallback-offline'
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const contents = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents,
      config: { systemInstruction: systemInstruction || SYSTEM_PROMPT }
    });

    return res.json({ text: response.text || 'No response generated.' });
  } catch (err) {
    console.error('Gemini chat error:', err);
    return res.status(500).json({ error: err?.message || 'Chat request failed.' });
  }
}
