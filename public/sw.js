// Orbit Showcase: the family's one service worker (Shared-Proxy/kit/sw.js),
// with this site's settings: its own files kept so it opens without a
// connection.
self.ORBIT_SW = { cache: 'orbit-showcase-v1', title: 'Orbit Showcase' };
importScripts('../Shared-Proxy/kit/sw.js');
