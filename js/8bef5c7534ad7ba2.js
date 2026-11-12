(()=>{const f=document.getElementById('dm-cadre');if(!f)return;let c='';try{c=new URLSearchParams(location.search).get('c')||''}catch(_){}
f.src=f.dataset.src+(c?'&contexte='+encodeURIComponent(c.slice(0,120)):'');
addEventListener('message',e=>{if(e.origin!=='https://tally.so')return;let d=e.data;try{if(typeof d==='string')d=JSON.parse(d)}catch(_){return}
const h=d&&(d.height||(d.payload&&d.payload.height));if(h>200&&h<4000)f.style.height=Math.ceil(h)+'px'})})()