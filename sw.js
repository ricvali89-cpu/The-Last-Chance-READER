const CACHE_NAME="tlc-reader-static-v1";
const SCOPE="/The-Last-Chance-READER/";
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith("tlc-reader-")&&k!==CACHE_NAME).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener("fetch",event=>{
  const req=event.request;
  if(req.method!=="GET") return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin) return;
  const isNavigation=req.mode==="navigate"||req.destination==="document"||url.pathname.endsWith(".html")||url.pathname.endsWith("/");
  if(isNavigation){
    event.respondWith((async()=>{
      try{
        return await fetch(req,{cache:"no-store"});
      }catch(e){
        const cached=await caches.match(req,{ignoreSearch:true});
        if(cached) return cached;
        throw e;
      }
    })());
    return;
  }
  if(req.destination==="image"){
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE_NAME);
      const cached=await cache.match(req);
      if(cached) return cached;
      const fresh=await fetch(req);
      if(fresh.ok) cache.put(req,fresh.clone());
      return fresh;
    })());
    return;
  }
  event.respondWith(fetch(req,{cache:"no-cache"}).catch(()=>caches.match(req)));
});