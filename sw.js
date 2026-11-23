/* JLB service worker
   - pages: network first, cached copy when offline
   - js/css/json: stale-while-revalidate (files carry ?v=, so a new release is a new URL)
   - pictures and fonts: cache first
   - anything else (Supabase sync, other sites): never touched
   Bump VER on every release. Bump IMG when a picture or sound keeps its name but changes (jlb7: Jimon accessories).
   Pictures are fetched with cache:'no-cache' when they go into IMG, so the browser checks Netlify
   instead of reusing its own 30-day copy (v4: the old scarf and headband stayed after v3).
   jlb12 adds new pictures and sounds under new names only (img/jlb/kisah, Jimon pose/barang/stiker/suara t_*), so IMG stays v4
   and phones do not download every old picture again. Kisah pictures are cached when a story is first opened.
   jlb13 (Jimon Teman Setia) also adds only new names (jimon/rig, new pose/barang, suara v_*), so IMG stays v4.
   jlb14 (Main bersama Musim 2) adds img/jlb/main2 and suara v_game_*: new names again, IMG stays v4. */
const VER = 'jlb14';
const SHELL = 'jlb-shell-' + VER, RUN = 'jlb-run-' + VER, IMG = 'jlb-img-v4';
const PRE = ['./', 'index.html', 'manifest.webmanifest',
  'css/app.css?v=jlb14', 'css/jlb.css?v=jlb14',
  'js/core.js?v=jlb14', 'js/sync.js?v=jlb14', 'js/figures.js?v=jlb14', 'js/data.js?v=jlb14', 'js/engine.js?v=jlb14',
  'js/calendar.js?v=jlb14', 'js/dalil_data.js?v=jlb14', 'js/journal.js?v=jlb14', 'js/ui.js?v=jlb14', 'js/player.js?v=jlb14',
  'js/handwrap.js?v=jlb14', 'js/workouts.js?v=jlb14', 'js/jlb_core.js?v=jlb14', 'js/jlb_gerak.js?v=jlb14', 'js/boot.js?v=jlb14',
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
  if (isFont(u) || /\.(webp|png|jpe?g|svg|gif|woff2?|mp3)$/i.test(u.pathname)) {
    e.respondWith(caches.open(IMG).then(c => c.match(r).then(hit => hit || fetch(isFont(u) ? r : new Request(r, { cache:'no-cache' })).then(res => { if (res.ok || res.type === 'opaque') c.put(r, res.clone()); return res; }))));
    return;
  }
  if (/\.(js|css|json|webmanifest)$/i.test(u.pathname)) {
    e.respondWith(caches.open(RUN).then(c => caches.match(r).then(hit => {
      const net = fetch(r).then(res => { if (res.ok) c.put(r, res.clone()); return res; }).catch(() => hit || caches.match(r));
      return hit || net;
    })));
  }
});
