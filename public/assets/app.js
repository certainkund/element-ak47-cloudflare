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
