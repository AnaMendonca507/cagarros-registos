const CACHE_NAME =
  "cagarros-app-v2";


const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./spea-logo-white.png"
];


self.addEventListener(
  "install",
  event => {

    event.waitUntil(

      caches
        .open(
          CACHE_NAME
        )
        .then(
          cache =>
            cache.addAll(
              APP_FILES
            )
        )

    );


    self.skipWaiting();

  }
);


self.addEventListener(
  "activate",
  event => {

    event.waitUntil(

      caches
        .keys()
        .then(
          keys =>
            Promise.all(

              keys
                .filter(
                  key =>
                    key !==
                    CACHE_NAME
                )
                .map(
                  key =>
                    caches.delete(
                      key
                    )
                )

            )
        )

    );


    self.clients.claim();

  }
);


self.addEventListener(
  "fetch",
  event => {

    /*
      Só fazemos cache dos ficheiros
      da própria aplicação GitHub Pages.

      APIs externas não são interferidas.
    */
    const requestUrl =
      new URL(
        event.request.url
      );


    if (
      event.request.method !==
      "GET" ||
      requestUrl.origin !==
        self.location.origin
    ) {

      return;

    }


    event.respondWith(

      fetch(
        event.request
      )

      .then(
        response => {

          const copy =
            response.clone();


          caches
            .open(
              CACHE_NAME
            )
            .then(
              cache =>
                cache.put(
                  event.request,
                  copy
                )
            );


          return response;

        }
      )

      .catch(
        () =>
          caches
            .match(
              event.request
            )
            .then(
              cached =>
                cached ||
                caches.match(
                  "./index.html"
                )
            )
      )

    );

  }
);
