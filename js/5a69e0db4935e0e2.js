(()=>{const SRC='/deco/boule-disco.webp';let tampon='',busy=false,P=null,taps=[];
const pre=()=>{if(!P){P=new Image();P.src=SRC}return P};
const RM=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const mot=()=>{const m=document.createElement('div');m.id='disco-mot';m.setAttribute('role','status');m.innerHTML='<em aria-hidden="true">🪩</em> <a href="https://djcyberbob.com/es/s/disco-funk.html">A la pista de baile</a>';
 const a=m.querySelector('a'),t=a.textContent;a.setAttribute('aria-label',t);a.innerHTML=[...t].map((c,i)=>'<span aria-hidden="true" style="--i:'+i+'">'+(c===' '?'&nbsp;':c)+'</span>').join('');
 document.body.appendChild(m);return m};
/* 12 nov 2026 (audit 4, constat 4 ; WCAG 2.2.1) : le lien était retiré au bout de 8,7 s même si on le visait au clavier ou à la souris.
   Tant qu'il a le focus ou qu'il est survolé, il reste ; il part ensuite. */
const tenu=m=>m.matches(':focus-within')||m.matches(':hover');
const retirer=m=>{if(!tenu(m)){m.remove();busy=false;return}m.classList.remove('part');const f=()=>{if(tenu(m))return;m.removeEventListener('focusout',f);m.removeEventListener('mouseleave',f);
 setTimeout(()=>{if(tenu(m)){m.addEventListener('focusout',f);m.addEventListener('mouseleave',f);return}m.remove();busy=false},600)};m.addEventListener('focusout',f);m.addEventListener('mouseleave',f)};
const lancer=async()=>{if(busy)return;busy=true;const mm=mot();
 if(RM()){mm.classList.add('calme');setTimeout(()=>retirer(mm),7000);return}
 const im=pre();try{await Promise.race([im.decode(),new Promise(ok=>setTimeout(ok,1500))])}catch(_){}      /* 11/11 : decode() peut ne jamais répondre (onglet sans focus) ; la boule part au plus 1,5 s après */
 const v=document.createElement('div');v.id='disco-voile';document.body.appendChild(v);requestAnimationFrame(()=>v.classList.add('on'));
 const b=document.createElement('div');b.id='disco';b.setAttribute('aria-hidden','true');const g=document.createElement('img');g.src=SRC;g.alt='';b.appendChild(g);document.body.appendChild(b);
 const C=['#ff3df2','#7cf6ff','#8a5cff','#ffffff','#ff7ad9'],T=[];
 for(let i=0;i<16;i++){const t=document.createElement('div');t.className='disco-tache';const s=40+Math.random()*80;
  t.style.cssText='width:'+s+'px;height:'+s+'px;left:'+(Math.random()*96)+'vw;top:'+(Math.random()*90)+'vh;--c:'+C[i%C.length]+';--d:'+(1.4+Math.random()*1.6).toFixed(2)+'s;--r:-'+(Math.random()*2).toFixed(2)+'s;--dx:'+((Math.random()-.5)*160|0)+'px;--dy:'+((Math.random()-.5)*160|0)+'px';
  document.body.appendChild(t);T.push(t)}
 setTimeout(()=>{b.classList.add('part');if(!tenu(mm))mm.classList.add('part');v.classList.remove('on')},7300);
 setTimeout(()=>{b.remove();v.remove();T.forEach(t=>t.remove());retirer(mm)},8700)};
document.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey||!e.key||e.key.length!==1)return;const t=e.target,n=((t&&t.tagName)||'').toLowerCase();
 if(n==='input'||n==='textarea'||n==='select'||(t&&t.isContentEditable))return;tampon=(tampon+e.key.toLowerCase()).slice(-5);if(e.key.toLowerCase()==='d')pre();if(tampon==='disco'){tampon='';lancer()}});
/* 11/11 (audit du site) : le script est dans l'en-tête, le pied de page n'existe pas encore à ce moment : l'écouteur se pose sur document et cherche la ligne « © » au toucher */
document.addEventListener('click',e=>{const x=e.target&&e.target.closest&&e.target.closest('footer span,footer p,footer small');if(!x||x.querySelector('a')||!/^\s*©/.test(x.textContent))return;
 pre();const n=Date.now();taps=taps.filter(t=>n-t<3000);taps.push(n);if(taps.length>=5){taps=[];lancer()}});})()