self.addEventListener('install', function(event)
  {
    event.waitUntil(
      caches.open("full_app").then(function(cache)
        {
          return cache.addAll(
            [
              './index.html',
            ]);
        })
    );
  });

self.addEventListener('fetch', event =>
  {
    event.respondWith(async function()
    {
      const cachedResponse = await caches.match(event.request);

      if(cachedResponse)
        return cachedResponse;

      const response = await fetch(event.request);
      const cache = await caches.open("full_app");
      cache.put(event.request, response.clone());
      return response;
    }())
  });
