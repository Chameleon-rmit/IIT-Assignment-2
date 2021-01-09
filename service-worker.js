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
    event.respondWith(
      caches.match(event.request).then(function(response)
        {
          return response || fetch(event.request);
        })
    );
  });
/*
    event.respondWith(async function()
    {
      const cache = await caches.open("full_app");
      const cachedResponse = await cache.match(event.request);

      if(cachedResponse)
      {
        event.waitUntil(cache.add(event.request));
        return cachedResponse;
      }

      return fetch(event.request);
    })
  });
  */
