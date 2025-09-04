export const onRequestPost = async (context) => {
  const { env, request } = context;
  const VALID_ARC = new Set(["SHADOW","DUALITY","ASCEND","OMEGA"]);
  const VALID_ENERGY = new Set(["STILLNESS","BALANCED","KINETIC FURY"]);

  let body;
  try { body = await request.json(); } catch { 
    return new Response(JSON.stringify({ error: "Bad JSON" }), { status: 400, headers: { "content-type": "application/json" } }); 
  }
  const { arcLabel, energyLabel } = body || {};
  if (!VALID_ARC.has(arcLabel) || !VALID_ENERGY.has(energyLabel)) {
    return new Response(JSON.stringify({ error: "Invalid parameters" }), { status: 400, headers: { "content-type": "application/json" } });
  }

  const model = env.GEMINI_MODEL || "gemini-2.5-flash-preview-05-20";
  const key = env.GEMINI_API_KEY;
  const systemPrompt = "You are a master myth-maker and loremaster, an Oracle of forgotten names. Forge ONE name (2-4 words), ancient and powerful. No explanations.";
  const userQuery = `Forge a name for a creation with an emotional spectrum of ${arcLabel} and an energy level of ${energyLabel}. The name must feel mythic (Tarot / epic fantasy / legendary).`;

  if (!key) {
    return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY" }), { status: 503, headers: { "content-type": "application/json" } });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  const t0 = Date.now();
  const r = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    })
  });
  const latencyMs = Date.now() - t0;

  if (!r.ok) {
    return new Response(JSON.stringify({ error: "Upstream error", status: r.status }), { status: 502, headers: { "content-type": "application/json" } });
  }

  const json = await r.json();
  const candidate = json?.candidates?.[0];
  let name = "The Void Gazes Back";
  if (candidate?.content?.parts?.[0]?.text) {
    name = String(candidate.content.parts[0].text).trim().replace(/["']/g, "");
  }
  return new Response(JSON.stringify({ name, model, latencyMs }), { headers: { "content-type": "application/json" } });
};