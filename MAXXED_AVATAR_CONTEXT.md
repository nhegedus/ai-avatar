# Maxxed Casino — AI Avatar Generator POC

## Project Overview
A proof-of-concept for an AI-powered avatar generation feature on the **Maxxed Casino** crypto platform. Users take a selfie and receive a stylized 3D avatar that matches the Maxxed brand aesthetic.

## Brand Aesthetic
- **Style**: 3D cartoon render, glossy/inflated shapes, bold colors
- **Reference character**: `caracter.png` — 3D head with colorful hair (pink/green gradient), X-shaped eyes, gold hoop earrings, grimacing expression, black background
- **Mood**: Edgy, playful, crypto-native, maximalist
- **Colors**: Lime green `#c8ff00`, hot pink `#ff3c6e`, cyan `#00d4ff`, dark background `#080a0e`

## Tech Stack
- **Frontend**: Vanilla HTML/CSS/JS (single file POC) — to be migrated to Next.js or React
- **AI API**: [fal.ai](https://fal.ai)
- **Primary model**: `fal-ai/instant-id` — face-preserving stylization with style reference image
- **Fallback model**: `fal-ai/face-to-sticker` — faster, no style ref, more cartoonish

## Generation Pipeline

```
selfie (user camera/upload)
        +
caracter.png (brand style reference)
        +
text prompt
        ↓
POST fal.run/fal-ai/instant-id
        ↓
avatar image URL
```

## fal.ai API Reference

### Upload images (required before generation)
```js
POST https://fal.run/fal-ai/upload
Headers: { Authorization: "Key <FAL_API_KEY>" }
Body: FormData with file blob
Returns: { url: "https://storage.fal.ai/..." }
```

### Generate avatar — InstantID
```js
POST https://fal.run/fal-ai/instant-id
Headers: {
  Authorization: "Key <FAL_API_KEY>",
  Content-Type: "application/json"
}
Body: {
  face_image_url: string,       // uploaded selfie URL
  image_url: string,            // uploaded style reference URL
  prompt: string,               // style description
  negative_prompt: string,
  num_inference_steps: 30,
  guidance_scale: 5,
  ip_adapter_scale: 0.8,
  controlnet_conditioning_scale: 0.8,
  num_images: 1
}
Returns: { images: [{ url: string }] }
```

### Default prompt
```
3D cartoon avatar in Maxxed casino brand style, colorful hair, X eyes,
bold expressive face, glossy 3D render, black background, high quality
```

## File Structure (current POC)
```
/
├── maxxed-avatar-poc.html   # single-file POC (all HTML/CSS/JS inline)
├── caracter.png             # Maxxed brand character reference image
└── MAXXED_AVATAR_CONTEXT.md # this file
```

## Key Decisions & Constraints

| Decision | Rationale |
|---|---|
| fal.ai over Replicate/HuggingFace | Browser-native fetch, fast CDN, no server needed for POC |
| InstantID over IP-Adapter | Better face identity preservation, accepts style ref image |
| Single HTML file for POC | Fast to iterate, easy to share |
| API key in browser (POC only) | **Must move to server-side for production** |

## TODO / Next Steps
- [ ] Move API calls to server-side route (Next.js API route or Express) to protect `FAL_API_KEY`
- [ ] Add `FAL_API_KEY` to `.env` — never commit to git
- [ ] Add loading skeleton / progress polling for long generations
- [ ] Store generated avatars (Supabase Storage or S3)
- [ ] Link avatar to user wallet/account
- [ ] Add avatar selection UI (generate 3 variants, user picks one)
- [ ] Explore `fal-ai/pulid` as an alternative for stronger face consistency
- [ ] Add style variant selector (e.g. "Cyberpunk", "Gold VIP", "Neon")

## Environment Variables (production)
```env
FAL_API_KEY=fal_key_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Important Notes for AI Assistants
- The brand character image is `caracter.png` — always use it as the `image_url` (style reference) in API calls
- Do NOT expose the fal.ai API key on the client side in production
- The model endpoint is `fal-ai/instant-id` — not `instant-id` alone
- Image upload to `fal.run/fal-ai/upload` must happen before the generation call — the API requires hosted URLs, not base64
- Generation takes ~10–20 seconds — always show a loading state
