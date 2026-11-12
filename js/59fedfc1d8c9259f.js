(()=>{const M=window.cbMem;const e=document.getElementById('nouv-txt');if(!M||!e)return;const T=JSON.parse(e.textContent);
const now=Date.now(),H=6*36e5;let v=M.lire('cb-visite');
if(!v||!v.der){M.ecrire('cb-visite',{ref:null,der:now});return;}
if(now-v.der>H)v={ref:v.der,der:now};else v.der=now;M.ecrire('cb-visite',v);const NV=navigator,bad=n=>{try{n?NV.setAppBadge&&NV.setAppBadge(n):NV.clearAppBadge&&NV.clearAppBadge()}catch(_){}};try{caches.open('cb-badge').then(c=>c.put('/__badge',new Response(JSON.stringify({depuis:v.ref||now,vus:Object.keys(M.ecoutes())}))))}catch(_){}if(!v.ref){bad(0);return;}
const ref=new Date(v.ref);ref.setHours(0,0,0,0);const L=document.documentElement.lang.slice(0,2),pre=L==='fr'?'':'/'+L;
fetch('/nouveautes.json').then(r=>r.json()).then(d=>{const E=M.ecoutes();
 const N=Object.entries(d.mix||{}).filter(([id,j])=>new Date(j+'T12:00:00')>=ref&&!E[id]).map(([id])=>id);bad(N.length);if(!N.length)return;const S=new Set(N);
 document.querySelectorAll('a.card[href]').forEach(a=>{const m=a.getAttribute('href').match(/\/m\/([\w-]{11})\.html/);if(!m||!S.has(m[1])||a.querySelector('.r-nouveau'))return;
  const z=a.querySelector('.vign'),s=document.createElement('span');s.className='r-nouveau'+(z?'':' inline');s.textContent=T.badge;(z||a.querySelector('.b')||a).appendChild(s);});
 const main=document.getElementById('contenu');if(!main)return;const p=document.createElement('p');p.className='r-depuis';p.setAttribute('role','status');
 p.textContent=(N.length===1?T.un:T.n.replace('{n}',N.length))+' ';const a=document.createElement('a');a.href=pre+'/de/mix/';a.textContent=T.voir;p.appendChild(a);main.prepend(p);}).catch(()=>{});})();