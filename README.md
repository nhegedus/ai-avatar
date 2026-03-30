# AI Avatar Generation

A web app that generates branded 3D cartoon avatars from selfies using AI. Built for the Maxxed casino brand style.

## How It Works

1. **Snap a selfie** — use your device camera or upload a photo
2. **Customize the prompt** (optional) — tweak the style description
3. **Generate** — the app creates a 3D cartoon avatar preserving your facial features

## Tech Stack

- **Next.js 16** with Turbopack
- **React 19** + TypeScript
- **Tailwind CSS 4**
- **fal.ai** — nano-banana-2 model for image generation

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Add your FAL_KEY to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable  | Description          |
| --------- | -------------------- |
| `FAL_KEY` | fal.ai API key       |
