document.addEventListener('DOMContentLoaded',()=>{
  const evoke=document.getElementById('evoke-button');
  const retry=document.getElementById('retry-button');
  const generate=document.getElementById('generate-button');
  const theme=document.getElementById('theme-display');
  const outTitle=document.getElementById('output-title');
  const outDesc=document.getElementById('output-description');
  const statusDot=document.getElementById('status-indicator');
  const rateMsg=document.getElementById('rate-limit-msg');
  const mockToggle=document.getElementById('mock-toggle');
  const lightToggle=document.getElementById('light-toggle');
  let lastSeed=1337;

  const setStatus=(mode)=>{statusDot.className='status-dot';if(mode==='proxy')statusDot.classList.add('green');else if(mode==='rate')statusDot.classList.add('yellow');else statusDot.classList.add('red');};

  function mockOracle(){return 'Mocked Name '+Math.floor(Math.random()*1000);}

  async function evokeName(){
    evoke.disabled=true;theme.textContent='The Oracle is speaking...';
    if(mockToggle.checked){theme.textContent=mockOracle();setStatus('mock');evoke.disabled=false;generate.disabled=false;return;}
    try{
      const r=await fetch('/api/oracle',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({arcLabel:'ASCEND',energyLabel:'BALANCED'})});
      if(r.status===429){setStatus('rate');showRateLimit();return;}
      if(!r.ok)throw new Error('fail');
      const {name}=await r.json();theme.textContent=name||'The Void Gazes Back';setStatus('proxy');generate.disabled=false;
    }catch(e){theme.textContent=mockOracle();setStatus('mock');retry.classList.remove('hidden');}
    finally{evoke.disabled=false;}
  }

  function showRateLimit(){let remain=10;rateMsg.classList.remove('hidden');rateMsg.textContent='Rate limited. Wait '+remain+'s';const t=setInterval(()=>{remain--;rateMsg.textContent='Rate limited. Wait '+remain+'s';if(remain<=0){clearInterval(t);rateMsg.classList.add('hidden');}},1000);}

  function generatePersona(){const text='AI-like glowing description.';outTitle.textContent=theme.textContent;outDesc.textContent='';outDesc.classList.add('typing');let i=0;const interval=setInterval(()=>{outDesc.textContent=text.slice(0,i);i++;if(i>text.length){clearInterval(interval);outDesc.classList.remove('typing');document.querySelector('.output-card').classList.add('glow');}},50);}

  evoke.addEventListener('click',evokeName);retry.addEventListener('click',evokeName);generate.addEventListener('click',generatePersona);lightToggle.addEventListener('change',()=>{document.body.classList.toggle('light',lightToggle.checked)});
});