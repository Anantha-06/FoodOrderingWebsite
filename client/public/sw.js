self.addEventListener("install", (event) => {
  console.log("Service Worker Installed");
  event.waitUntil(
    caches.open("byteeats-cache").then((cache) => {
      return cache.addAll(["/", "/icon-192x192.png", "/icon-512x512.png"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  console.log("Fetching:", event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
