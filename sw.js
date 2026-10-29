const V='cb-202610292127';const BASE=['/','/radio/','/vendredi/','/lettre/','/monde/','/hors-ligne/','/avatar.png','/icone-192.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(BASE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request;const u=new URL(r.url);if(r.method!=='GET'||u.origin!==location.origin)return;
 if(r.mode==='navigate'||/\.(json|ics|xml)$/.test(u.pathname)){e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(k=>k.put(r,c));return x;}).catch(()=>caches.match(r).then(x=>x||(r.mode==='navigate'?caches.match('/hors-ligne/'):Response.error()))));return;}
 e.respondWith(caches.match(r).then(x=>x||fetch(r).then(y=>{if(y.ok){const c=y.clone();caches.open(V).then(k=>k.put(r,c));}return y;})));});
