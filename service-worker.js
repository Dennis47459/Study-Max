
const CACHE_NAME = "studymax-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js"
];

// Guardar os ficheiros principais
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.all(
        FILES_TO_CACHE.map(async (file) => {
          try {
            const response = await fetch(file);
            if (response.ok) {
              await cache.put(file, response);
            }
          } catch (error) {
            console.log("Ficheiro ainda não disponível:", file);
          }
        })
      );

      await self.skipWaiting();
    })
  );
});

// Ativar a nova versão e limpar caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(async (keys) => {
      await Promise.all(
        keys
          .filter((key) => key.startsWith("studymax-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );

      await self.clients.claim();
    })
  );
});

// Usar a cache quando não houver ligação à Internet
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, copy);
          });
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;

        if (event.request.mode === "navigate") {
          return (
            (await caches.match("./index.html")) ||
            new Response("Estás offline. Liga-te à Internet e tenta novamente.", {
              headers: { "Content-Type": "text/plain; charset=utf-8" }
            })
          );
        }

        return new Response("Recurso indisponível offline.", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        });
      })
  );
});
