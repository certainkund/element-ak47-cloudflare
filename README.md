# Element AK‑47 — Aries–Gemini Project (Cloudflare Demo)


![banner](public/assets/forge-demo.png) <!-- optional screenshot -->


**Element AK‑47** is an educational, gothic‑themed demo that showcases:
- ⚔️ **Discovery** — the lore and concept behind Element AK‑47
- 📈 **Prophecy** — market growth visualized with a Chart.js bar chart
- 🔮 **Forge** — interactive demo that evokes mythic names via Gemini API (or offline mock)


---


## Features
- Gothic UI (Cinzel + Roboto fonts, blood‑moon palette)
- Interactive prophecy timeline + chart
- Forge demo with:
- Status indicator (proxy / mock / rate‑limit)
- Retry on failure + mock fallback
- Rate‑limit countdown feedback
- Light/Classroom mode toggle
- Typing animation + glowing persona output


---


## Deployment
This repo is wired for **Cloudflare Pages + Functions**.


### Cloudflare Pages settings
- Framework preset: **None**
- Build command: *(leave empty)*
- Output directory: `public`
- Functions directory: `functions`


### Environment variables
- `GEMINI_API_KEY` — your Gemini/Google API key
- `GEMINI_MODEL` — (default: `gemini-2.5-flash-preview-05-20`)


### Rate limiting
In Cloudflare WAF → **Rate limiting rules**:
- Path: `/api/*`
- Threshold: 15 requests/min/IP
- Action: Block (429)


---


## Local Dev
```bash
npm i -g wrangler
wrangler pages dev public --compatibility-date=2024-09-01
