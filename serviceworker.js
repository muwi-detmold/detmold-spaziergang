self.addEventListener('install', function(e) {
    console.log('install');

    e.waitUntil(
        caches.open('de.upb.detmoldspaziergang').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/css/onsenui-core.min.css',
                '/css/onsen-css-components.min.css',
                '/css/style.css',
                '/css/Amaranth.woff2',
                '/js/onsenui.min.js',
                '/img/Ear.png',
                '/img/SchlossBackground_600.png',
                '/img/left.png',
                '/img/places.png',
                '/img/Notes.png',
                '/img/home.png',
                '/img/menu.png',
                '/img/right.png',
                '/img/logo.png',
                '/img/Info.png',
                '/img/Credits.png',
                '/favicon.ico'
            ]);
        })
    );
});

self.addEventListener('fetch', function(e) {
    console.log('Requesting from cache: ' + e.request);
    e.respondWith(
        caches.match(e.request)
            .then(response => response || fetch(e.request))
    );
});