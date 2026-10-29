const V='cb-202610291601';const BASE=['/','/radio/','/vendredi/','/lettre/','/monde/','/hors-ligne/','/avatar.png','/icone-192.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(BASE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request;const u=new URL(r.url);if(r.method!=='GET'||u.origin!==location.origin)return;
 if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(k=>k.put(r,c));return x;}).catch(()=>caches.match(r).then(x=>x||caches.match('/hors-ligne/'))));return;}
 e.respondWith(caches.match(r).then(x=>x||fetch(r).then(y=>{if(y.ok){const c=y.clone();caches.open(V).then(k=>k.put(r,c));}return y;})));});
