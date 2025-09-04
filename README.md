# Element AK-47 — Aries–Gemini Project (Cloudflare Demo)

`Element AK-47` is not merely a demo; it is an **artifact**. A digital relic forged in the crucible of modern web technology, yet echoing with ancient whispers. This educational project dares to meld the arcane with the algorithmic, presenting a gothic-themed journey into the heart of serverless architecture and generative AI.

![Digital Relic Artifact](/images/unnamed.png)

---

## ⚔️ The Lore: Forging Destiny in the Digital Aether ⚔️

In an age where data flows like starlight and intelligence is spun from silicon, we seek the **Element AK-47**. Not a weapon of mundane steel, but a fundamental building block of digital identity, an entity capable of shaping mythic names from the cosmic winds of AI.

![Gothic Scholar at Terminal](/images/unnamed%20(4).png)

---

## 📈 Prophecy: Charting the Cosmos 📈

Peer into the future with our interactive "Prophecy" timeline. Here, market growth isn't just numbers; it's the ebb and flow of cosmic tides, visualized with a Chart.js bar chart. Witness the unfolding destiny of the digital realms.

![Cosmic Prophecy Chart](/images/unnamed%20(2).png)

---

## 🔮 The Forge: Invoking the Oracle 🔮

Step into "The Forge," where the mundane transforms into the mythical. This interactive demo harnesses the raw power of the Gemini API (or an offline mock when the stars are misaligned) to evoke powerful, mythic names. Each invocation is a spark, a creation.

![The Forge Interface](/images/unnamed%20(3).png)

**Observe the Ritual:**
- **Status Indicator:** Know if the Oracle is speaking directly (proxy), or if ancient scrolls (mock) are being consulted.
- **Retry on Failure + Mock Fallback:** Should the cosmic connection waver, the Forge endures, drawing upon fallback lore.
- **Rate-Limit Countdown:** Respect the Oracle's patience; a clear countdown guides your invocations.
- **Light/Classroom Mode Toggle:** Adapt the Forge's ambiance to your surroundings—from deep arcane chambers to illuminated study halls.
- **Typing Animation + Glowing Persona Output:** Witness the Oracle's thoughts taking form, its words imbued with a faint, ethereal glow.

---

## 🚀 Deployment: Anchoring the Arcane in the Cloud 🚀

Forged for the Cloudflare ecosystem, Element AK-47 leverages the speed and power of Cloudflare Pages and Functions. It's a testament to how modern serverless platforms can host even the most arcane of applications.

### Cloudflare Pages Settings:
- **Framework preset:** `None`
- **Build command:** (leave empty)
- **Output directory:** `public`
- **Functions directory:** `functions`

### Environment Variables (Secrets of the Forge):
- `GEMINI_API_KEY` — The sacred key to unlock the Gemini Oracle.
- `GEMINI_MODEL` — (default: `gemini-2.5-flash-preview-05-20`) Specify the particular aspect of the Oracle to consult.

### Rate Limiting (Guarding the Gateway):
To prevent the overwhelming of the Oracle, configure Cloudflare WAF → Rate limiting rules:
- **Path:** `/api/*`
- **Threshold:** `15 requests/min/IP`
- **Action:** `Block (429)`

---

## ⚒️ Local Dev: Awakening the Spark ⚒️

To awaken Element AK-47 on your local machine:

```bash
# Install the Cloudflare Workers CLI
npm i -g wrangler

# Invoke the local server
wrangler pages dev public --compatibility-date=2024-09-01
