(()=>{const f=document.querySelector('form.annee-aller');if(!f)return;const B=new URL(f.getAttribute('action'),location.href).pathname;const a=new URLSearchParams(location.search).get('a');
const ok=new Set([...document.querySelectorAll('.annees-grille a.chip')].map(x=>(x.getAttribute('href').match(/(\d{4})\.html/)||[])[1]));
const aller=v=>{if(ok.has(v)){location.href=B+v+'.html';return true}const c=[...ok].map(Number).sort((x,y)=>Math.abs(x-v)-Math.abs(y-v))[0];
 if(c)location.href=B+c+'.html';return !!c};if(a&&/^\d{4}$/.test(a))aller(a);
f.addEventListener('submit',e=>{e.preventDefault();const v=(f.querySelector('input').value||'').trim();if(/^\d{4}$/.test(v))aller(v);});})()