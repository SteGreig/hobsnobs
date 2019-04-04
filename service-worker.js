const staticAssets = [
    './',
    './css/main.css',
    './app-dist.js',
    './images/logo-hobsnobs.png',
    './images/close.svg'
]

self.addEventListener('install', async event => {
    const cache = await caches.open('static');
    cache.addAll(staticAssets);
})

self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);

    console.log("req: "+req);
    if(url.origin == location.origin) {
        event.respondWith(cacheFirst(req));
    } else {
        event.respondWith(networkFirst(req));
    }
})

async function cacheFirst(req) {
    const cachedResponse = await caches.match(req);
    return cachedResponse || fetch(req);
}

async function networkFirst(req) {
    const cache = await caches.open('biscuits');

    try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch (error) {
        return await cache.match(req);
    }
}
