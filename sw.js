/* offline support: keeps the app files on the device */
var CACHE="rasht-jard-0edf5a41";
var ASSETS=["./", "index.html", "jspdf.umd.min.js", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "fonts/cairo-arabic-400-normal.woff2", "fonts/cairo-arabic-600-normal.woff2", "fonts/cairo-arabic-700-normal.woff2", "fonts/cairo-arabic-800-normal.woff2", "fonts/cairo-latin-400-normal.woff2", "fonts/cairo-latin-600-normal.woff2", "fonts/cairo-latin-700-normal.woff2", "fonts/cairo-latin-800-normal.woff2"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  var u=new URL(e.request.url);
  if(u.origin!==location.origin)return;
  if(e.request.mode==="navigate"){
    e.respondWith(fetch(e.request).then(function(r){
      var cp=r.clone();caches.open(CACHE).then(function(c){c.put("index.html",cp);});return r;
    }).catch(function(){return caches.match("index.html");}));
    return;
  }
  e.respondWith(caches.match(e.request).then(function(m){
    return m||fetch(e.request).then(function(r){
      var cp=r.clone();caches.open(CACHE).then(function(c){c.put(e.request,cp);});return r;
    });
  }));
});
