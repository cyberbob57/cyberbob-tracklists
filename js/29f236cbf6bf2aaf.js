(()=>{const d=document.querySelector('details.langue-choix');if(!d)return;
document.addEventListener('click',e=>{if(d.open&&!d.contains(e.target))d.open=false});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&d.open){d.open=false;const s=d.querySelector('summary');if(s)s.focus()}});
document.querySelectorAll('.menu-tel-langue a[hreflang],.r-menu-langues a[hreflang]').forEach(a=>{const s=d.querySelector('a[hreflang="'+a.getAttribute('hreflang')+'"]');if(s)a.href=s.href});})()