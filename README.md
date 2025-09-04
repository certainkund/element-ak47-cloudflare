# Element AK‑47 — Cloudflare Pages + Functions

Deploy a static UI on **Cloudflare Pages** with a secure **Pages Function** proxy at `/api/oracle`. No client-side API keys.

## Deploy (quick)
1) Push this repo to GitHub and connect it in Cloudflare Pages.
2) Pages settings:
   - Framework: None
   - Build command: (leave empty)
   - Build output directory: `public`
   - Functions directory: `functions`
3) Add environment variables (Production & Preview):
   - `GEMINI_API_KEY` = your key
   - `GEMINI_MODEL`   = gemini-2.5-flash-preview-05-20
4) In Cloudflare **Rules → Rate limiting**, add a rule for `/api/*` (e.g., 15 req/min per IP).

## Local dev
```bash
npm i -g wrangler
wrangler pages dev public --compatibility-date=2024-09-01
```
Create a `.dev.vars` file for local secrets:
```
GEMINI_API_KEY=your-key
GEMINI_MODEL=gemini-2.5-flash-preview-05-20
```
Wrangler will inject them into `env` for the function while running locally.

## Notes
- No inline scripts/styles; CSP is strict without `unsafe-inline`.
- The client only posts `{ arcLabel, energyLabel }`; the server composes the prompt.
- For classroom use only; not production-hardened auth or logging.
