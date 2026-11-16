/* JLB service worker
   - pages: network first, cached copy when offline
   - js/css/json: stale-while-revalidate (files carry ?v=, so a new release is a new URL)
   - pictures and fonts: cache first
   - anything else (Supabase sync, other sites): never touched
   Bump VER on every release. */
const VER = 'jlb1';
const SHELL = 'jlb-shell-' + VER, RUN = 'jlb-run-' + VER, IMG = 'jlb-img-v1';
const PRE = ['./', 'index.html', 'manifest.webmanifest',
  'css/app.css?v=jlb1', 'css/jlb.css?v=jlb1',
  'js/core.js?v=jlb1', 'js/sync.js?v=jlb1', 'js/figures.js?v=jlb1', 'js/data.js?v=jlb1', 'js/engine.js?v=jlb1',
  'js/calendar.js?v=jlb1', 'js/dalil_data.js?v=jlb1', 'js/journal.js?v=jlb1', 'js/ui.js?v=jlb1', 'js/player.js?v=jlb1',
  'js/handwrap.js?v=jlb1', 'js/workouts.js?v=jlb1', 'js/jlb_core.js?v=jlb1', 'js/boot.js?v=jlb1',
  'img/jlb/brand/emblem-96.webp'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(PRE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('jlb-') && ![SHELL, RUN, IMG].includes(k)).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

const isFont = u => u.hostname === 'fonts.gstatic.com' || u.hostname === 'fonts.googleapis.com';

self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin && !isFont(u)) return;

  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(SHELL).then(x => x.put('index.html', c)); return res; })
      .catch(() => caches.match('index.html')));
    return;
  }
  if (isFont(u) || /\.(webp|png|jpe?g|svg|gif|woff2?)$/i.test(u.pathname)) {
    e.respondWith(caches.open(IMG).then(c => c.match(r).then(hit => hit || fetch(r).then(res => { if (res.ok || res.type === 'opaque') c.put(r, res.clone()); return res; }))));
    return;
  }
  if (/\.(js|css|json|webmanifest)$/i.test(u.pathname)) {
    e.respondWith(caches.open(RUN).then(c => caches.match(r).then(hit => {
      const net = fetch(r).then(res => { if (res.ok) c.put(r, res.clone()); return res; }).catch(() => hit || caches.match(r));
      return hit || net;
    })));
  }
});
