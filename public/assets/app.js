(() => {
  // Light/Classroom mode
  const toggle = document.querySelector('#light-toggle');
  if (toggle) {
    toggle.addEventListener('change', () => {
      document.body.classList.toggle('classroom', toggle.checked);
    });
  }

  // Status indicator: green for online (proxy), amber when mock
  const statusDot = document.querySelector('#status-indicator');
  const mockToggle = document.querySelector('#mock-toggle');
  const setStatus = () => {
    if (!statusDot) return;
    const mock = mockToggle?.checked;
    statusDot.style.background = mock ? '#f59e0b' : '#22c55e';
    statusDot.style.boxShadow = mock
      ? '0 0 18px rgba(245,158,11,.55)'
      : '0 0 18px rgba(34,197,94,.55)';
  };
  mockToggle?.addEventListener('change', setStatus);
  setStatus();

  // Chart.js: simple “Prophecy” bars
  const ctx = document.getElementById('marketChart');
  if (ctx && window.Chart) {
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Now', '+3m', '+6m', '+12m', '+24m'],
        datasets: [{
          label: 'Mythic Momentum',
          data: [2, 5, 9, 15, 28],
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#cbd5e1' } } },
        scales: {
          x: { ticks: { color: '#a1a1aa' }, grid: { color: 'rgba(148,163,184,.15)' } },
          y: { ticks: { color: '#a1a1aa' }, grid: { color: 'rgba(148,163,184,.15)' } }
        }
      }
    });
  }

  // “Forge” demo interactions
  const titleEl = document.getElementById('output-title');
  const descEl  = document.getElementById('output-description');
  const rateMsg = document.getElementById('rate-limit-msg');
  const evoke   = document.getElementById('evoke-button');
  const retry   = document.getElementById('retry-button');
  const generate= document.getElementById('generate-button');

  const mockNames = [
    ['ORUS, Cipher of Dawn', 'A mythic persona woven from static and sunrise.'],
    ['PUCK, Lantern of Neon Rain', 'A trickster spirit guiding arcane networks.'],
    ['CHARON, Keeper of the Black River', 'Ferrying queries across the void.']
  ];

  function randomChoice(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

  let cooling = false;
  function startCooldown(sec=10){
    if (cooling) return;
    cooling = true;
    let t = sec;
    rateMsg.classList.remove('hidden');
    const iv = setInterval(()=>{
      rateMsg.textContent = `⏳ Rate limit — wait ${t}s`;
      if(--t <= 0){ clearInterval(iv); rateMsg.classList.add('hidden'); cooling=false; }
    },1000);
  }

  async function invokeOracle(){
    const useMock = mockToggle?.checked ?? true;
    try{
      evoke.disabled = true; retry.classList.add('hidden'); generate.disabled = true;
      if(useMock){
        const [t,d] = randomChoice(mockNames);
        await new Promise(r=>setTimeout(r,400));
        titleEl.textContent = t;
        descEl.textContent  = d;
        setStatus();
        generate.disabled = false;
      }else{
        // Hook your real proxy here
        throw new Error('No proxy configured');
      }
    }catch(e){
      titleEl.textContent = '⚠️ Oracle unreachable';
      descEl.textContent  = 'Falling back to mock mode.';
      retry.classList.remove('hidden');
    }finally{
      evoke.disabled = false;
      startCooldown(8);
    }
  }

  evoke?.addEventListener('click', invokeOracle);
  retry?.addEventListener('click', invokeOracle);

  generate?.addEventListener('click', ()=>{
    const t = titleEl.textContent || 'Unnamed Relic';
    descEl.textContent = `${t} — initialized. Persona glow bound to sigils.`;
  });
})();

/* === Infernal Blade Background (original) === */
(() => {
  // Create background layer + canvas without editing HTML
  const layer = document.createElement("div");
  layer.className = "daemon-bk";
  document.body.appendChild(layer);

  const canvas = document.createElement("canvas");
  canvas.id = "embers-canvas";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let w, h, dpr = window.devicePixelRatio || 1;
  function resize(){
    w = canvas.width  = Math.floor(innerWidth  * dpr);
    h = canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
  }
  resize(); addEventListener("resize", resize);

  const N = 120;
  function rnd(a,b){ return a + Math.random()*(b-a); }
  function spawn(){
    return {
      x: rnd(0,w), y: rnd(h*0.5,h),
      r: rnd(0.6,2.2)*dpr, a: rnd(.35,.9),
      vx: rnd(-0.2,0.2)*dpr, vy: rnd(-0.35,-1.2)*dpr,
      hue: Math.random()<.5 ? 0 : 330 // red / magenta
    };
  }
  const parts = Array.from({length:N}, spawn);

  let paused = false;
  function draw(){
    if (paused) return;
    ctx.clearRect(0,0,w,h);
    for (const p of parts){
      p.x += p.vx; p.y += p.vy; p.a -= 0.0015; p.r += 0.003*dpr;
      if (p.a <= 0 || p.y < -20*dpr) Object.assign(p, spawn());
      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue}, 90%, 60%, ${Math.max(p.a,0)})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();

  // Respect classroom/light toggle if present
  const toggle = document.querySelector("#light-toggle");
  function update(){
    const classroom = document.body.classList.contains("classroom") || (toggle && toggle.checked);
    paused = classroom;
    canvas.style.display = classroom ? "none" : "block";
    layer.style.display  = classroom ? "none" : "block";
    if (!paused) draw();
  }
  toggle && toggle.addEventListener("change", update);
  update();
})();
