# Freda Creations — Personal Portfolio Website

Lightweight React + TypeScript portfolio with an admin console and optional AI image/chat endpoints.

Repository layout

- `server.ts` — Express server with Vite middleware and AI endpoints (`/api/gemini/chat`, `/api/gemini/generate-image`).
- `package.json`, `package-lock.json` — project manifest and scripts.
- `.env.example` — example environment variables the server reads.
- `firebase-applet-config.json` — Firebase web app config consumed by `src/lib/firebase.ts` (project-local JSON).
- `firestore.rules`, `firebase-blueprint.json` — Firebase-related rules and blueprint.
- `index.html`, `vite.config.ts`, `tsconfig.json` — build tooling and entry.
- `src/` — frontend TypeScript React app
  - `App.tsx`, `main.tsx`, `index.css`, `types.ts`
  - `components/` — UI components (Hero, Projects, Admin panel, Gemini integrations, etc.)
    - `Admin/` — `AdminLogin.tsx`, `AdminPanel.tsx`, `FileUploader.tsx`
- `lib/` — helper libraries: `firebase.ts`, `seedData.ts`
- `scripts/` — developer scripts (e.g., `test-endpoints.js`)
- `.github/workflows/` — CI workflows (smoke-test)
- `assets/`, `public/` — static assets

Quick start

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and set values (or set env vars in your shell). Important variables:

- `PORT` (optional, default 3000)
- `GEMINI_API_KEY` (optional — enables real Gemini responses; otherwise server uses offline fallbacks)
- Firebase fields used by `src/lib/firebase.ts` (or keep `firebase-applet-config.json` in place)
- `CLOUDINARY_CLOUD_NAME` and `CLOUDINARY_UPLOAD_PRESET` (optional, used by admin file uploader)

3. Start dev server:

```bash
npm run dev
```

Available npm scripts (from `package.json`)

- `dev` — run `tsx server.ts` (dev server with Vite middleware)
- `build` — build frontend with Vite and bundle server with esbuild
- `start` — run the built server from `dist/`
- `preview` — Vite preview of production build
- `lint` — TypeScript type check (`tsc --noEmit`)

Testing endpoints locally

There is a small test runner at `scripts/test-endpoints.js` that queries `/` and `/api/gemini/generate-image`.

Run it with:

```bash
node scripts/test-endpoints.js
```

You can also call the endpoints directly with curl. Examples (PowerShell):

```powershell
curl.exe -I http://localhost:3000/
curl.exe -s -X POST http://localhost:3000/api/gemini/generate-image -H "Content-Type: application/json" -d '{"prompt":"Afrofuturist portrait of a woman","size":"1024x1024"}' -o response.json
Get-Content response.json -TotalCount 20
```

Behavior notes

- If `GEMINI_API_KEY` is not set the image endpoint returns a stylized Afrofuturist SVG (data URL) as a fallback and the chat endpoint returns a concise offline fallback message instead of failing.
- `firebase-applet-config.json` is read by `src/lib/firebase.ts` for initializing Firebase. If you prefer env-based config, update the file or modify `src/lib/firebase.ts`.
- Admin file uploads use Cloudinary unsigned presets by default; update `FileUploader.tsx` or set `CLOUDINARY_*` env vars.

Admin panel

- Accessible via the app navigation (`/admin`) or the Admin link.
- First-time setup supports creating an admin account using Firebase Email/Password in the UI.
- Seeding initial content can be triggered from the Admin panel (seed data is in `lib/seedData.ts`).

CI

- A smoke-test workflow exists at `.github/workflows/smoke-test.yml` which installs dependencies, starts the dev server, runs `scripts/test-endpoints.js`, and exits.

License & credits

This repository contains assets and code authored by the project owner. Replace placeholder keys and test data before publishing.

If you want, I can:

- Initialize the git repo and commit staged changes (you can commit files one-by-one as you requested).
- Push a branch to a remote (provide the remote URL or add it locally and I will push).
- Add more developer docs or a CONTRIBUTING guide.

---
Updated to match repository structure.
