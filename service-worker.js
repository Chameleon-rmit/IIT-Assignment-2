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

// .. Okay, this could use a little explanation
// When our web app asks for something from a link...
self.addEventListener('fetch', event =>
  {
    event.respondWith(async function()
    {
      // ... check if it's in our cache...
      const cachedResponse = await caches.match(event.request);

      // ... and if it is, return it...
      if(cachedResponse)
        return cachedResponse;

      // ... if it isn't then fetch the response into a variable...
      const response = await fetch(event.request);
      const cache = await caches.open("full_app");
      // ... so that we can put a copy of it in the cache...
      cache.put(event.request, response.clone());
      // ... as well as returning the response to our application. ...
      return response;
    }())
  });
// ... Some implications of this is that it will cache the whole application.
// Which is fine because it's going to be entirely static anyway. Something to keep in mind though.
