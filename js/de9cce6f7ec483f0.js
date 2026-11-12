(()=>{const b=document.getElementById('tout-b'),z=document.getElementById('tout-lecteur'),s=document.getElementById('tout-suiv'),e=document.getElementById('tout-titre');
if(!b||!z)return;let Q=[];try{Q=JSON.parse(b.dataset.passages)}catch(_){}if(Q.length<2)return;let P=null,i=0,c1=0,c3=0,ch=0,fin=0;
/* 11/11/2026 (audit) : « ch » — le lecteur ne se crée qu'UNE fois (deux clics rapprochés en créaient deux : un titre sur deux sauté) ;
   « fin » — arrivé au bout, l'affichage revient au premier titre et « Titre suivant » relance bien le premier, pas le deuxième. */
const cpt=n=>{try{if(window.goatcounter&&goatcounter.count)goatcounter.count({path:n,title:n,event:true})}catch(_){}};
const S=b.closest('.tout'),g=document.getElementById('tout-vig'),k=document.getElementById('tout-n');
const dire=()=>{if(k)k.textContent=(i+1)+' / '+Q.length;if(e)e.textContent=Q[i][3];if(g){g.src='https://i.ytimg.com/vi/'+Q[i][0]+'/mqdefault.jpg';g.hidden=false}};
const jouer=()=>{const q=Q[i];dire();if(i===2&&!c3){c3=1;cpt('ecouter-tout-3e');document.dispatchEvent(new CustomEvent('cb-tout-3e'))}const o={videoId:q[0],startSeconds:q[1]};if(q[2])o.endSeconds=q[2];P.loadVideoById(o)};
const suite=()=>{if(fin){fin=0;i=0;jouer();return}i++;if(i<Q.length)jouer();else{i=0;fin=1;dire()}};
const pret=()=>{const q=Q[0],v={autoplay:1,playsinline:1,rel:0,start:q[1],origin:location.origin};if(q[2])v.end=q[2];
 P=new YT.Player('tout-yt',{videoId:q[0],host:'https://www.youtube-nocookie.com',playerVars:v,events:{onReady:dire,onStateChange:x=>{if(S)S.classList.toggle('joue',x.data===1);if(x.data===0)suite()},onError:suite}})};
b.addEventListener('click',()=>{if(!c1){c1=1;cpt('ecouter-tout-clic')}z.hidden=false;if(s)s.hidden=false;b.textContent=b.dataset.relancer;z.scrollIntoView({behavior:'smooth',block:'center'});
 if(P&&P.loadVideoById){i=0;fin=0;jouer();return}if(ch)return;ch=1;if(!document.getElementById('tout-yt')){const d=document.createElement('div');d.id='tout-yt';z.appendChild(d)}
 if(window.YT&&YT.Player)pret();else{const a=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{if(a)a();pret()};
  const c=document.createElement('script');c.src='https://www.youtube.com/iframe_api';document.head.appendChild(c)}});
if(s)s.addEventListener('click',()=>{if(P&&P.loadVideoById)suite()});
const L=document.getElementById('tout-lettre'),lx=document.getElementById('tout-lettre-x');
if(L){document.addEventListener('cb-tout-3e',()=>{let v=0;try{v=+localStorage.getItem('cb-lettre')||0}catch(_){}if(v>Date.now())return;
 try{localStorage.setItem('cb-lettre',String(Date.now()+30*864e5))}catch(_){}L.hidden=false;cpt('ecouter-tout-lettre')});
 if(lx)lx.addEventListener('click',()=>{L.hidden=true;try{(s&&!s.hidden?s:b).focus()}catch(_){}})}})()