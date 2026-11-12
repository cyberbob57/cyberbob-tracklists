(()=>{const i=document.getElementById('rech'),z=document.getElementById('sugg');if(!i)return;let D=null,sel=-1;
const sa=t=>(t||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();const esc=t=>(t||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const P=({en:'/en',es:'/es',de:'/de',it:'/it'})[document.documentElement.lang.slice(0,2)]||'';
/* 11.11.2026 (audit 4) : les titres proposés pour une année sont des adresses ABSOLUES du site français : sans ceci un visiteur anglais atterrissait sur la page française du mix */
const O=location.origin,L=u=>P&&u.indexOf(O+'/')===0?O+P+u.slice(O.length):u;
const charger=async()=>{if(D)return D;const PL=({en:'/en',es:'/es',de:'/de',it:'/it'})[document.documentElement.lang.slice(0,2)]||P;try{D=await(await fetch(PL+'/recherche.json')).json()}catch(_){try{D=await(await fetch('/recherche.json')).json()}catch(__){D={}}}return D};   /* 12/11 (audit 4, 2) : l'index de la langue */
/* 📅 10.11.2026 (CyberBob : « un autre moyen de rechercher les titres d'une année sans surcharger le site ») : un clic dans la barre encore
   vide propose les décennies, puis les années de la décennie choisie (avec leur nombre de titres) → /annees/<année>.html. Rien d'ajouté
   aux pages, rien de plus à charger : d.y est déjà dans recherche.json. */
const PH='Titel, Künstler oder Jahr…';i.placeholder=PH;
const parAn=async dec=>{const d=await charger(),A=Object.keys(d.y||{}).map(Number).sort((a,b)=>a-b);if(i.value.trim().length>=2)return;if(!A.length){z.hidden=true;return}
 let h='<h4>📅 Die Titel eines Jahres</h4><div class="ans">'+[...new Set(A.map(a=>a-a%10))].map(x=>'<button type="button" data-dec="'+x+'" aria-pressed="'+(x===dec)+'">'+(x<2000?String(x).slice(2)+'er':x+'er')+'</button>').join('')+'</div>';
 h+=dec==null?'<p class="vide">Wähle ein Jahrzehnt oder tippe ein Jahr (1984, 1979…): Du bekommst seine Titel, keine Mixe.</p>':'<div class="ans">'+A.filter(a=>a-a%10===dec).map(a=>'<a href="/de/annees/'+a+'.html">'+a+' <span>'+d.y[a].n+'</span></a>').join('')+'</div>';
 h+='<a class="tout" href="'+P+'/'+'temps/">Die Mixe einer Epoche? ⏳ Zurück in der Zeit →</a>';   /* 11/11 (audit) : l'adresse est écrite en deux morceaux, sinon localiser() ajoute la langue une seconde fois, en plus de P */
 z.innerHTML=h;z.hidden=false;sel=-1;const sn=document.getElementById('sugg-n');if(sn)sn.textContent=dec==null?'Suche nach Jahr: Wähle ein Jahrzehnt':dec+'er: '+z.querySelectorAll('a').length+' Jahre'};
z.addEventListener('click',e=>{const b=e.target.closest('button[data-dec]');if(b){e.preventDefault();e.stopPropagation();parAn(Number(b.dataset.dec))}});
const montrer=async()=>{const q=sa(i.value.trim());if(q.length<2){parAn();return}const d=await charger();let h='';
 /* 07/11 : styles et pages par synonymes ; une année (« 1985 », « année 85 ») mène à Remonter le temps */
 const S=(d.s||[]).filter(x=>sa(x[0]+' '+(x[2]||'')).includes(q)).slice(0,4);
 const an=(q.match(/\b(19[5-9]\d|20[0-2]\d)\b/)||[])[1]||((m=>m?(Number(m[1])>=50?'19':'20')+m[1]:null)(q.match(/(?:^|annee|annees|an)\s*(\d\d)\b/)));
 /* 09.11.2026 : une année tapée → ses titres, rubrique à part. 10.11.2026 (CyberBob : « une distinction entre Remonter le temps et la
    recherche par année, qui elle ne liste que les titres, pas les mix d'une période ») : les TITRES de l'année d'abord et seuls ; les MIX
    de l'époque (le style de la décennie, Remonter le temps qui part de l'année de naissance) viennent après, sous leur propre titre.
    Une année tapée seule ne cherche plus dans les styles ni dans les mix. */
 const seule=an&&/^(?:annees?|an)?\s*\d{2,4}$/.test(q),Y=an&&d.y&&d.y[an];
 if(Y)h+='<h4>📅 Titel aus dem Jahr '+an+'</h4>'+Y.t.map(x=>'<a href="'+esc(L(x[1]))+'">'+esc(x[0])+'</a>').join('')+'<a href="/de/annees/'+an+'.html">Alle '+Y.n+' Titel aus '+an+' →</a>';
 else if(seule)h+='<h4>📅 Titel aus dem Jahr '+an+'</h4><p class="vide">Kein Titel aus '+an+' in den Mixen.</p>';
 if(!seule){if(S.length)h+='<h4>Stile</h4>'+S.map(x=>'<a href="'+esc(P+x[1])+'">'+esc(x[0])+'</a>').join('');
 for(const[k,lib]of[['a','Künstler'],['t','Titel'],['r','Remixer'],['m','Mixe']]){const L=(d[k]||[]).filter(x=>sa(x[0]).includes(q)).slice(0,k==='m'?5:4);
  if(L.length)h+='<h4>'+lib+'</h4>'+L.map(x=>'<a href="'+esc(P+x[1])+'">'+esc(x[0])+'</a>').join('')}}
 if(an){const e=an<2010&&(d.s||[]).find(x=>x[1]==='/'+'s/annees-'+(an<2000?String(an).slice(2,3)+'0':'2000')+'.html');
  h+='<h4>🎧 Die Mixe der Epoche</h4>'+(e?'<a href="'+esc(P+e[1])+'">Alle mix '+esc(e[0].toLowerCase())+'</a>':'')+'<a href="'+esc(P+'/'+'temps/?n='+an)+'">⏳ '+an+' geboren? Zurück in der Zeit: die Mixe deiner Zwanziger</a>'}
 const n=(h.match(/<a /g)||[]).length;if(!n)h='<p class="vide">Nichts bei Künstlern, Titeln oder Mixen gefunden. Eingabe durchsucht alle Tracklisten.</p>';
 h+='<a class="tout" href="/de/?q='+encodeURIComponent(i.value.trim())+'#mix">Alle Ergebnisse für „'+esc(i.value.trim())+' “ ↵</a>';z.innerHTML=h;z.hidden=false;sel=-1;
 const sn=document.getElementById('sugg-n');if(sn)sn.textContent=n?n+(n>1?' Vorschläge':' Vorschlag'):'Keine Vorschläge'};
i.addEventListener('focus',()=>{if(i.value.trim().length<2)parAn();else charger()});i.addEventListener('input',montrer);
i.addEventListener('keydown',e=>{const A=[...z.querySelectorAll('a')];if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(!A.length)return;
 sel=(sel+(e.key==='ArrowDown'?1:-1)+A.length)%A.length;A.forEach((a,n)=>a.classList.toggle('actif',n===sel));return}
 if(e.key==='Enter'){e.preventDefault();location.href=sel>=0&&A[sel]?A[sel].href:'/de/?q='+encodeURIComponent(i.value.trim())+'#mix'}if(e.key==='Escape'){z.hidden=true;i.blur()}});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!/input|textarea|select/i.test((e.target.tagName||''))){e.preventDefault();i.focus()}});
document.addEventListener('click',e=>{if(!e.target.closest('.zone-rech'))z.hidden=true});
const n=document.getElementById('nb-fav');try{const f=JSON.parse(localStorage.getItem('cb-fav'))||[];if(n&&f.length){n.textContent=f.length;n.hidden=false}}catch(_){}
const mt=document.getElementById('menu-tel');const mtFermer=()=>{if(!mt||mt.hidden)return false;mt.hidden=true;document.body.classList.remove('menu-tel-ouvert');
 const b=document.querySelector('[data-ouvre-mega]');if(b){b.setAttribute('aria-expanded','false');b.focus();}return true;};
if(mt)mt.addEventListener('click',e=>{if(e.target===mt||e.target.closest('.menu-tel-fermer'))mtFermer();});
document.querySelectorAll('[data-ouvre-mega]').forEach(b=>b.addEventListener('click',()=>{
 if(mt&&matchMedia('(max-width:640px)').matches){if(!mt.hidden){mtFermer();return;}mt.hidden=false;document.body.classList.add('menu-tel-ouvert');b.setAttribute('aria-expanded','true');const f=mt.querySelector('a');if(f)f.focus();return;}
 const m=document.querySelector('details.mega');document.body.classList.add('menu-ouvert');const z=document.querySelector('.r-burger');if(z)z.setAttribute('aria-expanded','true');if(m){m.open=true;scrollTo(0,0)}}));const bu=document.querySelector('.r-burger');if(bu)bu.addEventListener('click',()=>{const o=document.body.classList.toggle('menu-ouvert');bu.setAttribute('aria-expanded',o);});
document.addEventListener('click',e=>{const m=document.querySelector('details.mega[open]');if(m&&!e.target.closest('details.mega')&&!e.target.closest('[data-ouvre-mega]'))m.open=false});
/* 29.10.2026 (audit) : Échap ferme le grand menu ou le menu du téléphone et rend le focus au bouton qui l'a ouvert */
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(mtFermer())return;const m=document.querySelector('details.mega[open]'),b=document.querySelector('.r-burger'),
 tel=document.body.classList.contains('menu-ouvert');if(!m&&!tel)return;if(m)m.open=false;
 if(tel){document.body.classList.remove('menu-ouvert');if(b){b.setAttribute('aria-expanded','false');b.focus();}}else{const s=m.querySelector('summary');if(s)s.focus();}});

/* 08.11.2026 : 🎤 la recherche à la voix (reconnaissance du navigateur, rien n'est envoyé au site). Le premier résultat s'ouvre seul. */
const mb=document.getElementById('rech-micro'),SR=window.SpeechRecognition||window.webkitSpeechRecognition;
if(mb&&SR){mb.hidden=false;let rc=null;mb.addEventListener('click',e=>{e.preventDefault();if(rc){rc.stop();return}rc=new SR();rc.lang=({en:'en-GB',es:'es-ES',de:'de-DE',it:'it-IT'})[document.documentElement.lang.slice(0,2)]||'de-DE';rc.interimResults=false;rc.maxAlternatives=1;
 mb.classList.add('ecoute');mb.setAttribute('aria-pressed','true');i.value='';i.placeholder='Ich höre zu…';
 /* 08/11 (« 25 ») : d'abord une commande (pause, lecture, suivant, plus fort, radio, « mets du disco »), sinon la recherche */
 const cmd=t=>{const q=sa(t),L=window.cbLecteur;const a=(...w)=>w.some(x=>q.includes(x));
  if(a('pause','stop','arrete','silence','chut')){if(window.cbCmd)cbCmd('pauseVideo');return true}
  if(a('suivant','next','passe au')){const b=document.querySelector('#suivant,.album-info button.suiv');if(b){b.click();return true}}
  if(a('plus fort','monte le son','louder')){if(L&&L.volume()!=null)cbCmd('setVolume',[Math.min(100,L.volume()+20)]);return true}
  if(a('moins fort','baisse le son','quieter')){if(L&&L.volume()!=null)cbCmd('setVolume',[Math.max(0,L.volume()-20)]);return true}
  if(a('accueil','home')){location.href=P+'/';return true}
  const m=q.match(/^(?:mets|met|passe|joue)\s+(?:moi\s+)?(?:du |de la |des |de l'|le |la |les |un |une )?(.+)$/);
  if(m){const d0=D||{};const st=(d0.s||[]).find(x=>sa(x[0]+' '+(x[2]||'')).includes(m[1].trim()));if(st){location.href=P+'/de/radio/?ambiance='+st[1].replace(/^\/s\/|\.html$/g,'');return true}i.value=m[1];return false}
  if(a('radio')){location.href=P+'/de/radio/';return true}
  if(a('lecture','play','reprends','continue','lance')){if(typeof jouer==='function'){const s=L?L.etat():-1;if(s===2)cbCmd('playVideo');else if(s!==1)jouer(0)}return true}
  return false};
 rc.onresult=ev=>{const t=(ev.results[0]&&ev.results[0][0]&&ev.results[0][0].transcript)||'';charger().then(()=>{if(cmd(t))return;if(!i.value)i.value=t;montrer().then(()=>{const a=z.querySelector('a:not(.tout)');if(a){a.classList.add('actif');setTimeout(()=>{location.href=a.href},900)}})})};
 rc.onend=()=>{mb.classList.remove('ecoute');mb.setAttribute('aria-pressed','false');i.placeholder=PH;rc=null};rc.onerror=()=>{if(rc)rc.stop()};
 try{rc.start()}catch(_){rc.onend()}});}
})();