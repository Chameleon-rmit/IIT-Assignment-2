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

// .. Okay, this could use a little explanation, especially as we're using Promises
// When our web app asks for something from a link...
self.addEventListener('fetch', event =>
  {
    event.respondWith(
    caches.open("full_app")
      .then(cache =>
        {
          // ... look up the request in the cache ...
          return cache.match(event.request)
            .then(offline =>
              {
                // ... even if we have a cached value fetch it from the network for the newest version ...
                var online = fetch(event.request)
                  .then(networkResponse =>
                    {
                      // ... and put it in our cache ...
                      cache.put(event.request, networkResponse.clone());
                      return networkResponse;
                    });
                // ... return the online version if we can, otherwise the cached version ...
                return online || offline;
              });
        }),
    );
  });
// ... Some implications of this is that it will cache the whole application.
// Which is fine because it's going to be entirely static anyway. Something to keep in mind though.
