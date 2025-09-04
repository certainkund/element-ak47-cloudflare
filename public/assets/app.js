document.addEventListener('DOMContentLoaded', function () {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  mobileMenuButton?.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

  const navLinks = document.querySelectorAll('.nav-link, #mobile-menu a');
  const sections = document.querySelectorAll('section');
  navLinks.forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); document.querySelector(link.getAttribute('href')).scrollIntoView({ behavior: 'smooth' }); if (!mobileMenu.classList.contains('hidden')) mobileMenu.classList.add('hidden'); }));
  const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`)); } }); }, { rootMargin: '-50% 0px -50% 0px' });
  sections.forEach(section => observer.observe(section));

  const chartEl = document.getElementById('marketChart');
  if (chartEl && window.Chart) {
    const ctx = chartEl.getContext('2d');
    new Chart(ctx, { type: 'bar', data: { labels: ['2023','2025','2030','2032'], datasets: [{ label: 'Power Vacuum', data: [3.7,9.8,50.31,103.6], backgroundColor: 'rgba(185,28,28,.7)', borderColor: 'rgba(239,68,68,1)', borderWidth: 1, borderRadius: 2 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#111', titleColor: '#ef4444', bodyColor: '#e5e7eb', callbacks: { label: (c) => `${c.dataset.label}: ${c.parsed.y} units` } } }, scales: { y: { beginAtZero: true, title: { display: true, text: 'Power Units', color: '#e5e7eb' }, grid: { color: 'rgba(239,68,68,.2)' }, ticks: { color: '#9ca3af' } }, x: { title: { display: true, text: 'Year', color: '#e5e7eb' }, grid: { display: false }, ticks: { color: '#9ca3af' } } } } });
  }

  const dom = {
    arc: document.getElementById('arc-slider'),
    energy: document.getElementById('energy-slider'),
    evoke: document.getElementById('evoke-button'),
    generate: document.getElementById('generate-button'),
    theme: document.getElementById('theme-display'),
    outTitle: document.getElementById('output-title'),
    outDesc: document.getElementById('output-description'),
    outHist: document.getElementById('output-history'),
    mockToggle: document.getElementById('mock-toggle'),
    seedToggle: document.getElementById('seed-toggle'),
    reducedMotion: document.getElementById('reduced-motion'),
    auditMode: document.getElementById('audit-mode'),
    auditModel: document.getElementById('audit-model'),
    auditLatency: document.getElementById('audit-latency'),
    auditArc: document.getElementById('audit-arc'),
    auditEnergy: document.getElementById('audit-energy'),
  };

  const state = { history: [], lastSeed: 1337 };

  const getArcLabel = (v) => (v < 25 ? 'SHADOW' : v < 50 ? 'DUALITY' : v < 75 ? 'ASCEND' : 'OMEGA');
  const getEnergyLabel = (f) => (f < 0.25 ? 'STILLNESS' : f < 0.75 ? 'BALANCED' : 'KINETIC FURY');

  function seededRand(seed) { let t = seed >>> 0; return function () { t += 0x6D2B79F5; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }
  function mockOracle(arcLabel, energyLabel, seed) {
    const rng = seededRand(seed);
    const a = ['Vigil','Thorn','Omen','Echo','Crown','Ash','Vesper','Rune','Warden'];
    const b = ['of the','and the','against the','within the','beyond the'];
    const c = ['Red Moon','Silent Choir','Falling Star','Last Dawn','Black Sun','Forgotten Gate'];
    const arcTag = arcLabel === 'OMEGA' ? 'Omega' : arcLabel === 'ASCEND' ? 'Ascendant' : arcLabel === 'DUALITY' ? 'Dual' : 'Shadow';
    const energyTag = energyLabel === 'KINETIC FURY' ? 'Fury' : energyLabel === 'STILLNESS' ? 'Still' : 'Balance';
    const pick = (arr) => arr[Math.floor(rng() * arr.length)];
    const maybe = (s) => (rng() < 0.5 ? s + ' ' : '');
    return `${maybe(arcTag)}${maybe(energyTag)}${pick(a)} ${pick(b)} ${pick(c)}`.replace(/\s+/g, ' ').trim();
  }

  dom.reducedMotion?.addEventListener('change', () => {
    document.documentElement.style.setProperty('scroll-behavior', dom.reducedMotion.checked ? 'auto' : 'smooth');
  });

  async function evokeName() {
    if (!dom.arc || !dom.energy) return;
    dom.evoke.disabled = true; dom.evoke.textContent = 'Evoking...';
    dom.generate.disabled = true; dom.theme.textContent = 'The Oracle is speaking...';
    const arcLabel = getArcLabel(parseInt(dom.arc.value, 10));
    const energyLabel = getEnergyLabel(parseInt(dom.energy.value, 10) / 100);
    dom.auditArc.textContent = arcLabel; dom.auditEnergy.textContent = energyLabel;

    const useMock = dom.mockToggle?.checked;
    const seed = dom.seedToggle?.checked ? state.lastSeed : Math.floor(Math.random() * 1e9);
    state.lastSeed = seed;

    const t0 = performance.now();
    if (useMock) {
      applyName(mockOracle(arcLabel, energyLabel, seed));
      setAudit('mock', '—', `${Math.round(performance.now() - t0)} ms`);
      return finalizeEvoke();
    }
    try {
      const r = await fetch('/api/oracle', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ arcLabel, energyLabel }) });
      const latency = `${Math.round(performance.now() - t0)} ms`;
      if (r.status === 429) { dom.theme.textContent = 'Rate limit reached. Please wait a moment.'; setAudit('proxy (429)', '—', latency); }
      else if (r.status === 503) { applyName(mockOracle(arcLabel, energyLabel, seed)); setAudit('mock (server educational mode)', '—', latency); }
      else if (!r.ok) { applyName(mockOracle(arcLabel, energyLabel, seed)); setAudit('mock (proxy error)', '—', latency); }
      else { const { name, model, latencyMs } = await r.json(); applyName(name || 'The Void Gazes Back'); setAudit('proxy', model || '—', `${latencyMs ?? Math.round(performance.now() - t0)} ms`); }
    } catch (e) {
      applyName(mockOracle(arcLabel, energyLabel, seed)); setAudit('mock (network)', '—', `${Math.round(performance.now() - t0)} ms`);
    } finally { finalizeEvoke(); }
  }

  function setAudit(mode, model, latency) { dom.auditMode.textContent = mode; dom.auditModel.textContent = model; dom.auditLatency.textContent = latency; }
  function applyName(name) { dom.theme.textContent = String(name).trim(); dom.theme.classList.remove('italic','text-gray-400'); dom.theme.classList.add('text-white','font-bold','font-cinzel'); dom.generate.disabled = false; }
  function finalizeEvoke() { dom.evoke.disabled = false; dom.evoke.textContent = 'Evoke Name'; }

  function describe(arcLabel, energy) {
    const L = String(arcLabel).toUpperCase();
    if (/ASCEND|OMEGA/.test(L)) return 'A curse of brilliant triumph and cold, quiet resolve.';
    if (/SHADOW|DUALITY/.test(L)) return 'An echo of tender suffering and the ghost of loss.';
    if (energy > 0.65) return 'A torrent of kinetic fury and blinding, wrathful clarity.';
    return 'A pact of unnerving stillness and the warmth of a dying star.';
  }

  function generatePersona() {
    const theme = dom.theme.textContent.trim();
    if (!theme || theme.includes('...')) { dom.outDesc.textContent = 'A creation must have a true name. Evoke one first.'; return; }
    const arcLabel = getArcLabel(parseInt(dom.arc.value, 10));
    const energyValue = parseInt(dom.energy.value, 10) / 100;
    const desc = describe(arcLabel, energyValue);
    dom.outTitle.textContent = theme;
    dom.outDesc.textContent = desc;
    state.history.unshift(`FORGED: "${theme}" → ${arcLabel} / E:${energyValue.toFixed(2)}`);
    if (state.history.length > 5) state.history.pop();
    dom.outHist.innerHTML = state.history.map(h => `<p>${h}</p>`).join('');
  }

  document.getElementById('evoke-button')?.addEventListener('click', evokeName);
  document.getElementById('generate-button')?.addEventListener('click', generatePersona);
  const genBtn = document.getElementById('generate-button'); if (genBtn) genBtn.disabled = true;
});