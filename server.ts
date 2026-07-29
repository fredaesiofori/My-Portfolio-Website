import 'dotenv/config';
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

  app.use(express.json({ limit: "10mb" }));

  function getGeminiAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // 1. Multi-turn Chat Endpoint
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { messages, systemInstruction } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required." });
      }
      const ai = getGeminiAI();

      const contents = messages.map((m: { role: string; text: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

      const defaultSystemInstruction =
        "You are Freda Ofori's AI Assistant on her personal portfolio. Freda is a Cloud & DevOps Engineer and Full-Stack Developer with expertise in AWS, Terraform, Docker, Kubernetes, CI/CD, React, TypeScript, and Afrofuturist digital craftsmanship. Answer questions politely, concisely, and accurately regarding her certifications, job simulations, cloud projects, technical skills, and background.";

      if (!ai) {
        // Graceful offline fallback when GEMINI_API_KEY is not set
        const lastUser = messages[messages.length - 1];
        const fallbackText = `Offline mode: no Gemini API key configured. You asked: "${
          lastUser?.text || ''
        }"\n\nBasic info about Freda: Cloud & DevOps Engineer, Full-Stack Developer, experienced with AWS, Terraform, Docker, Kubernetes, CI/CD, React, and TypeScript.`;
        return res.json({ text: fallbackText, note: 'fallback-offline' });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents,
        config: {
          systemInstruction: systemInstruction || defaultSystemInstruction,
        },
      });

      return res.json({ text: response.text || "No text generated." });
    } catch (err: any) {
      console.error("Gemini Chat Error:", err);
      return res.status(500).json({
        error: err?.message || "Failed to process chat request.",
      });
    }
  });

  // Helper to create an Afrofuturist SVG visual fallback when paid API key is absent
  function generateFallbackSVG(promptStr: string) {
    const escapedPrompt = promptStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0B0F19" />
          <stop offset="50%" stop-color="#1A0D18" />
          <stop offset="100%" stop-color="#080808" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F59E0B" />
          <stop offset="50%" stop-color="#E2725B" />
          <stop offset="100%" stop-color="#C5A059" />
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill="url(#bgGrad)" />
      <circle cx="400" cy="360" r="280" fill="none" stroke="url(#goldGrad)" stroke-width="2" opacity="0.3" stroke-dasharray="12 6" />
      <circle cx="400" cy="360" r="210" fill="none" stroke="#E2725B" stroke-width="1.5" opacity="0.4" />
      <g transform="translate(400, 360)">
        <polygon points="0,-120 104,-60 104,60 0,120 -104,60 -104,-60" fill="none" stroke="url(#goldGrad)" stroke-width="3" />
        <circle cx="0" cy="0" r="45" fill="#E2725B" opacity="0.2" />
        <path d="M-30,0 L30,0 M0,-30 L0,30" stroke="#F59E0B" stroke-width="3" />
      </g>
      <text x="400" y="660" font-family="system-ui, sans-serif" font-weight="800" font-size="20" fill="#F59E0B" text-anchor="middle" letter-spacing="2">AFROFUTURIST VISUAL CONCEPT</text>
      <text x="400" y="695" font-family="system-ui, sans-serif" font-size="13" fill="#D1D5DB" text-anchor="middle" opacity="0.9">"${escapedPrompt.length > 60 ? escapedPrompt.substring(0, 57) + '...' : escapedPrompt}"</text>
      <text x="400" y="730" font-family="monospace" font-size="11" fill="#E2725B" text-anchor="middle" opacity="0.8">FREDA OFORI AI STUDIO • FREE TIER COMPATIBLE</text>
    </svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  }

  // 2. High-Quality Image Generation Endpoint
  app.post("/api/gemini/generate-image", async (req, res) => {
    const { prompt, size = "1K", aspectRatio = "1:1" } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt string is required." });
    }

    try {
      const ai = getGeminiAI();

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-image",
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
            imageSize: size as any,
          },
        },
      });

      let imageUrl: string | null = null;
      let mimeType = "image/png";

      const candidate = response.candidates?.[0];
      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData?.data) {
            mimeType = part.inlineData.mimeType || "image/png";
            imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (!imageUrl) {
        imageUrl = generateFallbackSVG(prompt);
      }

      return res.json({ imageUrl, mimeType, prompt, size, aspectRatio });
    } catch (err: any) {
      console.warn("Gemini Image Gen Notice (using free tier fallback):", err?.message);
      // Fallback gracefully so free tier API keys work seamlessly
      const fallbackUrl = generateFallbackSVG(prompt);
      return res.json({
        imageUrl: fallbackUrl,
        mimeType: "image/svg+xml",
        prompt,
        size,
        aspectRatio,
        note: "Created via Afrofuturist SVG Studio engine (free tier active)."
      });
    }
  });

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
