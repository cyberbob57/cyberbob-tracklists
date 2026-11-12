(()=>{if(!window.cbMem)return;const M=cbMem,T=M.T,v=document.getElementById('lecteur');if(!v)return;
const id=v.dataset.id,titre=v.dataset.titre,url=location.pathname;let f=null,dur=0,fini=false;
window.cbCmd=(func,args)=>{try{if(P&&ok&&P[func])P[func].apply(P,args||[]);}catch(_){}};window.cbPret=()=>!!(P&&ok);
const noter=(tt,fin)=>{const E=M.ecoutes();E[id]=Object.assign(E[id]||{},{t:Math.floor(tt),d:dur||((E[id]||{}).d)||0,at:Date.now(),titre,url});
 if(fin)E[id].fin=true;const cles=Object.keys(E);if(cles.length>200)cles.sort((a,b)=>E[a].at-E[b].at).slice(0,cles.length-200).forEach(k=>delete E[k]);M.ecrire('cb-ecoute',E);};
/* 25/10, iPhone (« la reprise, pas sûr » ; « pas de mix suivant ») : les messages bruts du lecteur n'arrivaient pas sur le téléphone ;
   on passe par la bibliothèque officielle de YouTube (comme la radio, qui marche) et on lit la minute toutes les 4 s. */
let P=null,ok=false,k=null,ecoute=0,prec=null;
const finir=()=>{if(fini)return;fini=true;noter(dur||0,true);if(ecoute>=120)M.inviter();suivant();};
const relever=()=>{if(!P||!ok)return;try{const tt=P.getCurrentTime(),dd=P.getDuration();if(dd>0)dur=dd;if(typeof tt!=='number')return;
 if(prec!==null&&tt>prec&&tt-prec<15)ecoute+=tt-prec;prec=tt;if(ecoute>=600)M.inviter();
 if(tt>0)noter(tt,dur&&tt>=dur-90);if(dur>0&&tt>=dur-1.5)finir();}catch(_){}};
window.cbBranche=fr=>{f=fr;ok=false;P=null;const brancher=()=>{P=new YT.Player(f,{events:{onReady:()=>{ok=true;},
  onStateChange:e=>{if(e.data===0){relever();finir();}else if(e.data===2)relever();}}});clearInterval(k);k=setInterval(relever,4000);};
 if(window.YT&&YT.Player)brancher();else{const avant=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{avant&&avant();brancher();};
  if(!document.querySelector('script[src*="iframe_api"]')){const s=document.createElement('script');s.src='https://www.youtube.com/iframe_api';document.head.appendChild(s);}}};
window.cbLecteur={temps:()=>{try{return P&&ok?P.getCurrentTime():null}catch(_){return null}},etat:()=>{try{return P&&ok?P.getPlayerState():-1}catch(_){return -1}},volume:()=>{try{return P&&ok?P.getVolume():null}catch(_){return null}}};   /* 08/11 : pour la platine à scratcher */
addEventListener('pagehide',relever);document.addEventListener('visibilitychange',()=>{if(document.hidden)relever();});
/* 26/10/2026 (piste 5) : pendant l'écoute, le titre en cours s'allume tout seul dans la liste. */
setInterval(()=>{if(!P||!ok)return;try{const tt=P.getCurrentTime();if(typeof tt!=='number'||tt<=0)return;const L=[...document.querySelectorAll('.tracks ol.tl li')];let c=null;
 for(const li of L){const a=li.querySelector('a.t');if(a&&+a.dataset.s<=tt+1)c=li;}if(c&&!c.classList.contains('on')){L.forEach(x=>x.classList.remove('on'));c.classList.add('on');}}catch(_){}},1000);
/* (1) partager un passage : 26/10/2026 (CyberBob, idées 4 et 6 « formulées différemment ») — une fenêtre avec le texte prêt,
   le lien qui démarre pile au titre, WhatsApp / SMS / Facebook / copier / partage du téléphone, et une carte musicale
   (titre, artiste, mix, minute, QR code vers le passage) à télécharger ou envoyer. Rien ne quitte l'appareil. */
const pp=(li,s)=>{const b=li.querySelector('.quoi b'),a=li.querySelector('.quoi span');const titre=b?(b.childNodes[0]||{}).textContent||b.textContent:'';
 const art=a?a.textContent:'';const u=location.origin+location.pathname+'#t='+s;const tm=M.mmss(+s);
 const txt=T.pp_texte.replace('{mix}',titre0).replace('{t}',tm).replace('{titre}',titre.trim()).replace('{artiste}',art?' — '+art:'');
 let d=document.getElementById('pp');if(d)d.remove();d=document.createElement('dialog');d.id='pp';
 d.innerHTML='<form method="dialog"><h3></h3><p class="pp-t"></p><p class="pp-u"></p><div class="pp-b"></div><div class="pp-c" hidden><img alt=""><p><a class="btn" download="carte-cyberbob.png"></a></p></div><p><button class="btn ghost" value="x"></button></p></form>';
 d.querySelector('h3').textContent=T.pp_titre;d.querySelector('.pp-t').textContent=txt;d.querySelector('.pp-u').textContent=u;
 d.querySelector('button[value=x]').textContent=T.pp_fermer;const zb=d.querySelector('.pp-b');
 const bouton=(lib,fn)=>{const x=document.createElement('button');x.type='button';x.className='btn';x.textContent=lib;x.addEventListener('click',fn);zb.appendChild(x);return x;};
 const plein=txt+' '+u;
 if(navigator.share)bouton(T.pp_tel,async()=>{try{await navigator.share({title:document.title,text:txt,url:u});}catch(_){}});
 bouton('WhatsApp',()=>open('https://wa.me/?text='+encodeURIComponent(plein),'_blank','noopener'));
 bouton('SMS',()=>{location.href='sms:?&body='+encodeURIComponent(plein);});
 bouton('Facebook',()=>open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(u),'_blank','noopener'));
 const bc=bouton(T.pp_copier,async()=>{try{await navigator.clipboard.writeText(plein);bc.textContent=T.pp_copie;setTimeout(()=>bc.textContent=T.pp_copier,1800);}catch(_){}});
 bouton(T.pp_carte,()=>carte(d,{titre:titre.trim(),art,tm,u}));
 /* ✏️ 09/11/2026 (idée 48, « 48 ») : signaler une erreur dans ce titre — un mail déjà rempli (mix, minute, titre, lien). Né de
    « Il jouait du piano debout » (P0200), repéré par un abonné en commentaire. Rien ne part sans le visiteur : son appli de mail s'ouvre.
    L'adresse est DEMANDE_MAIL, écrite en clair (le script est défini avant elle). */
 bouton(T.pp_erreur,()=>{location.href='mailto:contact@djcyberbob.com?subject='+encodeURIComponent(T.err_objet+' — '+titre0)+'&body='+encodeURIComponent(T.err_corps.replace('{mix}',titre0).replace('{t}',tm).replace('{titre}',titre.trim()).replace('{artiste}',art?' — '+art:'').replace('{u}',u));});
 document.body.appendChild(d);d.showModal();};
const titre0=v.dataset.titre||document.title;
const qrLib=()=>new Promise((ok,ko)=>{if(window.qrcode)return ok();const x=document.createElement('script');x.src='https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js';x.integrity='sha384-mZT2gIty7ZDdOGkxfP6joZcYdMW1Jvj9dRlfpTmaJAKKXTqzygtB22k7FLe+KZC1';x.crossOrigin='anonymous';x.onload=ok;x.onerror=ko;document.head.appendChild(x);});
const lignes=(c,txt,max)=>{const w=txt.split(/\s+/),L=[];let l='';w.forEach(m=>{const t=l?l+' '+m:m;if(c.measureText(t).width>max&&l){L.push(l);l=m;}else l=t;});if(l)L.push(l);return L;};
async function carte(d,x){const z=d.querySelector('.pp-c');const W=1080,H=1350,cv=document.createElement('canvas');cv.width=W;cv.height=H;const c=cv.getContext('2d');
 const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0b0716');g.addColorStop(.55,'#2a0d4a');g.addColorStop(1,'#0b0716');c.fillStyle=g;c.fillRect(0,0,W,H);
 c.strokeStyle='#ff5ef7';c.lineWidth=6;c.strokeRect(40,40,W-80,H-80);
 try{const im=new Image();im.crossOrigin='anonymous';await new Promise((ok,ko)=>{im.onload=ok;im.onerror=ko;im.src='https://i.ytimg.com/vi/'+v.dataset.id+'/hqdefault.jpg';});
  c.drawImage(im,0,45,480,270,90,90,W-180,(W-180)*270/480);}catch(_){}
 let y=90+(W-180)*270/480+80;c.fillStyle='#fff';c.textAlign='center';
 c.font='bold 64px system-ui,sans-serif';lignes(c,x.titre,W-180).slice(0,3).forEach(l=>{c.fillText(l,W/2,y);y+=74;});
 if(x.art){c.font='44px system-ui,sans-serif';c.fillStyle='#cfc6ff';lignes(c,x.art,W-180).slice(0,2).forEach(l=>{c.fillText(l,W/2,y);y+=54;});}
 c.font='36px system-ui,sans-serif';c.fillStyle='#ff9ef7';y+=10;lignes(c,T.pp_dans+' « '+titre0+' » '+T.pp_a+' '+x.tm,W-180).slice(0,2).forEach(l=>{c.fillText(l,W/2,y);y+=46;});
 try{await qrLib();const q=qrcode(0,'M');q.addData(x.u);q.make();const n=q.getModuleCount(),cote=300,px=cote/n,x0=W/2-cote/2,y0=H-cote-170;
  c.fillStyle='#fff';c.fillRect(x0-20,y0-20,cote+40,cote+40);c.fillStyle='#000';
  for(let r=0;r<n;r++)for(let k=0;k<n;k++)if(q.isDark(r,k))c.fillRect(x0+k*px,y0+r*px,Math.ceil(px),Math.ceil(px));
  c.fillStyle='#fff';c.font='30px system-ui,sans-serif';c.fillText(T.pp_scan,W/2,y0+cote+60);}catch(_){}
 c.font='bold 34px system-ui,sans-serif';c.fillStyle='#2ea8ff';c.fillText('djcyberbob.com',W/2,H-70);
 let url='';try{url=cv.toDataURL('image/png');}catch(_){return;}
 z.querySelector('img').src=url;const a=z.querySelector('a');a.href=url;a.textContent=T.pp_tele;z.hidden=false;
 if(navigator.canShare){try{const bl=await new Promise(r=>cv.toBlob(r,'image/png'));if(!bl)throw 0;const f=new File([bl],'carte-cyberbob.png',{type:'image/png'});   /* 11/11 (audit) : fetch(image en data:) était refusé par la CSP du site (connect-src) : le bouton « Partager » ne s'affichait jamais */
  if(navigator.canShare({files:[f]})&&!z.querySelector('.pp-f')){const s=document.createElement('button');s.type='button';s.className='btn pp-f';s.textContent=T.pp_tel;
   s.addEventListener('click',async()=>{try{await navigator.share({files:[f],text:x.titre+' — '+x.u});}catch(_){}});a.after(' ',s);}}catch(_){}}
 z.scrollIntoView({behavior:'smooth',block:'nearest'});}
document.querySelectorAll('ol.tl button.pt').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();pp(b.closest('li'),b.dataset.s);}));
/* (2) reprise et favori */
const act=document.querySelector('.album-info .actions');const e0=M.ecoutes()[id];const q=new URLSearchParams(location.search);const tq=q.get('t')||((location.hash.match(/^#t=(\\d+)$/)||[])[1]);
if(act&&e0&&!e0.fin&&e0.t>=60&&!tq){const b=document.createElement('button');b.type='button';b.className='btn reprise';
 b.textContent=T.reprendre+' '+M.mmss(e0.t);b.addEventListener('click',()=>{jouer(e0.t);b.remove();});act.prepend(b);}
const fb=document.querySelector('.album-info button.fav');if(fb){const est=()=>M.favoris().some(x=>x.id===id);const peindre=()=>{fb.textContent=est()?T.fav_on:T.fav;fb.setAttribute('aria-pressed',est())};peindre();
 fb.addEventListener('click',()=>{let L=M.favoris();L=est()?L.filter(x=>x.id!==id):[{id,titre,url}].concat(L);M.ecrire('cb-fav',L.slice(0,100));peindre();});}
/* (3) le mix suivant */
const prochain=()=>{let S=[];try{S=JSON.parse(v.dataset.suivants||'[]')}catch(_){}const E=M.ecoutes();return S.find(x=>x[0]!==id&&!(E[x[0]]||{}).fin)||S[0];};
const bs=document.querySelector('.album-info button.suiv');if(bs){if(prochain())bs.addEventListener('click',()=>{const s=prochain();location.href=s[1]+'?auto=1';});else bs.remove();}
function suivant(){if(document.querySelector('.suite'))return;let S=[];try{S=JSON.parse(v.dataset.suivants||'[]')}catch(_){}if(!S.length)return;const E=M.ecoutes();
 const s=S.find(x=>!(E[x[0]]||{}).fin)||S[0];const box=document.createElement('div');box.className='suite';let n=10;
 box.innerHTML='<img alt="" width="320" height="180" src="https://i.ytimg.com/vi/'+s[0]+'/mqdefault.jpg"><div><span class="c"></span><b></b><p><a class="btn"></a> <button class="btn ghost" type="button"></button></p></div>';
 box.querySelector('b').textContent=s[2];const a=box.querySelector('a.btn');a.href=s[1]+'?auto=1';a.textContent=T.lancer;
 const r=box.querySelector('button');r.textContent=T.rester;const c=box.querySelector('.c');const tic=()=>{c.textContent=T.suivant+' '+n+' s';};tic();
 const k=setInterval(()=>{if(--n<=0){clearInterval(k);location.href=a.href;}else tic();},1000);r.addEventListener('click',()=>{clearInterval(k);box.remove();});
 v.after(box);box.scrollIntoView({behavior:'smooth',block:'center'});}
if(q.get('auto')==='1'&&!tq)jouer(0);
const f0=v.querySelector('iframe');if(f0)cbBranche(f0);})();