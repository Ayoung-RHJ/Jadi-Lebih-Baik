/* =========================================================
   JLB (Jadi Lebih Baik) core: paths, per-person data, prayer times,
   XP and levels, Jimon state, lazy modules, tabs and routes.
   All data lives in the same corner3:* storage and syncs like the rest.
   ========================================================= */
const JLB_VER = 'jlb6';
const JIMG = 'img/jlb/';
const PR = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
const PRN = { subuh:'Subuh', dzuhur:'Dzuhur', ashar:'Ashar', maghrib:'Maghrib', isya:'Isya' };
const RAWATIB = { subuh:['q'], dzuhur:['q', 'b'], ashar:[], maghrib:['b'], isya:['b'] };
const PILLAR = {
  ibadah:{ n:'Ibadah', c:'#0E7C66', plant:'kurma' }, jasad:{ n:'Jasad', c:'#2450D6', plant:'zaitun' },
  ilmu:{ n:'Ilmu', c:'#6B3FC4', plant:'anggur' }, akhlak:{ n:'Akhlak', c:'#A85705', plant:'tin' }
};
const LEVELS = [0, 100, 300, 600, 1000, 1500, 2100, 2800];
const todayK = () => dkey(new Date());
const jAdd = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const kOf = s => new Date(s + 'T00:00:00');
const jimg = p => JIMG + p;
function arabicFont() { const l = document.getElementById('amiriFont'); if (l && l.media !== 'all') l.media = 'all'; }
/* Kids view: by age unless a mode was chosen (13+ choose it themselves; under 13 only a parent, in Ruang Orang Tua) */
const ageKid = id => ageGroup((pget(id || CUR, 'profile', {}) || {}).age) === 'kid';
const kidMode = id => { const m = (pget(id || CUR, 'jlb:set', {}) || {}).mode; return m ? m === 'anak' : ageKid(id); };
const isKidP = () => !!CUR && kidMode(CUR);
function setMode(id, m) { const s = Object.assign({}, pget(id, 'jlb:set', {}) || {}); s.mode = m; pset(id, 'jlb:set', s);
  if (id === CUR) { document.body.classList.toggle('jkid', m === 'anak'); location.hash = '#taman'; paintChrome(); route(); } }
const modeCard = () => `<section class="jcard"><h2>Tampilan</h2><div class="jtick">${[['dewasa', 'Dewasa'], ['anak', 'Anak']].map(([v, t]) => `<button class="jchip" data-jmode="${v}" aria-pressed="${(v === 'anak') === isKidP()}">${t}</button>`).join('')}</div><span class="jmut">Anak: Jimon, Misi, Belajar Seru dan Peti Jumat. Dewasa: Taman, Amal, Latihan dan Rekap. Semua catatan tetap tersimpan.</span></section>`;
document.addEventListener('click', e => { const b = e.target.closest('[data-jmode]'); if (!b || ageKid()) return; setMode(CUR, b.dataset.jmode); });


/* ---- per-person storage (works for the current person or anyone in the family) ---- */
const pget = (id, k, d) => store.get('p:' + id + ':' + k, d);
const pset = (id, k, v) => store.set('p:' + id + ':' + k, v);
const jget = (k, d) => ps.get('jlb:' + k, d);
const jset = (k, v) => ps.set('jlb:' + k, v);
/* day records: { 'YYYY-MM-DD': { s:{subuh:{f,j,q,b}}, a:{habitId:1}, m:{missionId:1}, h:1, jp:1, at } } */
function dayOf(k, id) { const all = id ? pget(id, 'jlb:day', {}) : jget('day', {}); return all[k] || {}; }
function dayPut(k, fn) {
  const all = jget('day', {}), d = Object.assign({}, all[k] || {});
  fn(d); d.at = Date.now(); all[k] = d;
  const keys = Object.keys(all).sort(); if (keys.length > 800) keys.slice(0, keys.length - 800).forEach(x => delete all[x]);
  jset('day', all);
}
const setting = (k, d) => (jget('set', {})[k] ?? d);
const setSetting = (k, v) => { const s = jget('set', {}); s[k] = v; jset('set', s); };

/* ---- prayer times (Kemenag: Fajr 20°, Isha 18°, Asr shadow 1, ihtiyat 2 min) ---- */
const CITIES = { Jakarta:[-6.2, 106.82, 7], Bandung:[-6.91, 107.61, 7], Surabaya:[-7.25, 112.75, 7], Semarang:[-6.97, 110.42, 7], Yogyakarta:[-7.8, 110.36, 7],
  Medan:[3.59, 98.67, 7], Palembang:[-2.99, 104.76, 7], Pekanbaru:[0.51, 101.45, 7], Pontianak:[-0.03, 109.33, 7], Denpasar:[-8.65, 115.22, 8],
  Makassar:[-5.15, 119.43, 8], Balikpapan:[-1.27, 116.83, 8], Banjarmasin:[-3.32, 114.59, 8], Manado:[1.47, 124.84, 8], Mataram:[-8.58, 116.12, 8],
  Ambon:[-3.7, 128.17, 9], Jayapura:[-2.53, 140.72, 9], 'Banda Aceh':[5.55, 95.32, 7], Padang:[-0.95, 100.35, 7], Malang:[-7.98, 112.63, 7] };
function prayerTimes(date, city) {
  const [lat, lng, tz] = CITIES[city] || CITIES.Jakarta;
  const rad = Math.PI / 180, d = (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(2000, 0, 1)) / 864e5 + 0.5;
  const g = (357.529 + 0.98560028 * d) * rad, q = 280.459 + 0.98564736 * d, L = (q + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * rad;
  const e = (23.439 - 0.00000036 * d) * rad, RA = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L)) / rad / 15;
  const decl = Math.asin(Math.sin(e) * Math.sin(L)), EqT = q / 15 - ((RA % 24) + 24) % 24;
  const noon = 12 + tz - lng / 15 - (((EqT + 12) % 24 + 24) % 24 - 12);
  const T = ang => Math.acos((Math.sin(ang * rad) - Math.sin(lat * rad) * Math.sin(decl)) / (Math.cos(lat * rad) * Math.cos(decl))) / rad / 15;
  const asrAng = -Math.atan(1 / (1 + Math.tan(Math.abs(lat * rad - decl)))) / rad;
  const h = { subuh:noon - T(-20), dzuhur:noon, ashar:noon + T(-asrAng), maghrib:noon + T(-0.833), isya:noon + T(-18) };
  const out = {}; Object.keys(h).forEach(k => { const m = Math.round(h[k] * 60) + 2; out[k] = m; });
  return out;   // minutes after midnight
}
const hm = m => pad(Math.floor(m / 60) % 24) + ':' + pad(m % 60);
function prayerNow(date = new Date()) {
  const t = prayerTimes(date, setting('city', 'Jakarta')), m = date.getHours() * 60 + date.getMinutes();
  let cur = -1; PR.forEach((p, i) => { if (m >= t[p]) cur = i; });
  return { t, cur, next:PR[cur + 1] || null };   // cur -1 = before Subuh (Isya of last night still open)
}
/* which part of the day the sky picture shows */
function skyNow(date = new Date()) {
  const { t } = prayerNow(date), m = date.getHours() * 60 + date.getMinutes();
  if (m < t.subuh || m >= t.isya) return 'isya';
  if (m < t.dzuhur - 120) return 'subuh';
  if (m < t.ashar) return 'dzuhur';
  if (m < t.maghrib) return 'ashar';
  return 'maghrib';
}

/* ---- XP ---- */
function xpBreak(id) {
  id = id || CUR;
  const pr = pget(id, 'profile', {}) || {}, kid = ageGroup(pr.age) === 'kid';
  const days = pget(id, 'jlb:day', {}), learn = pget(id, 'jlb:learn', {}), roda = pget(id, 'jlb:roda', {}), log = pget(id, 'log', []);
  const r = { sholat:0, rawatib:0, amal:0, misi:0, belajar:0, roda:0, gerak:0, jalan:0 };
  Object.values(days).forEach(d => {
    PR.forEach(p => { const s = (d.s || {})[p]; if (!s) return; if (s.f) r.sholat += 10; if (!kid) { if (s.q) r.rawatib += 2; if (s.b) r.rawatib += 2; } });
    r.amal += Object.keys(d.a || {}).filter(k => d.a[k]).length * 5;
    r.misi += Object.keys(d.m || {}).filter(k => d.m[k]).length * 5;
    if (d.jp) r.jalan += 5;
  });
  Object.values(learn).forEach(l => { if (l && l.done) r.belajar += l.xp || 10; });
  Object.values(roda).forEach(x => { if (x) r.roda += x.ok ? 5 : 2; });
  r.gerak = log.filter(e => e && e.kind !== 'act').length * 10 + log.filter(e => e && e.kind === 'act').length * 10;
  r.total = Object.keys(r).reduce((a, k) => a + r[k], 0);
  return r;
}
const xpTotal = id => xpBreak(id).total;
function xpRange(id, from, to) {   // XP earned between two day keys (inclusive), from day records only
  const days = pget(id || CUR, 'jlb:day', {}); let n = 0;
  Object.keys(days).forEach(k => { if (k < from || k > to) return; const d = days[k];
    PR.forEach(p => { const s = (d.s || {})[p]; if (s && s.f) n += 10; if (s && s.q) n += 2; if (s && s.b) n += 2; });
    n += Object.keys(d.a || {}).length * 5 + Object.keys(d.m || {}).length * 5 + (d.jp ? 5 : 0); });
  return n;
}
function levelOf(xp) { let l = 1; LEVELS.forEach((t, i) => { if (xp >= t) l = i + 1; }); const next = LEVELS[l] || null; return { l, next, base:LEVELS[l - 1], pct:next ? Math.round((xp - LEVELS[l - 1]) / (next - LEVELS[l - 1]) * 100) : 100 }; }
/* Peti Jumat: XP spent on play time (10 XP = 10 minutes) */
const weekKey = (d = new Date()) => { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 2) % 7)); return dkey(x); };   // weeks start Saturday, chest opens Friday
function petiState(id) {
  id = id || CUR;
  const reqs = pget(id, 'jlb:peti', {}), cap = (pget(id, 'jlb:ortu', {}) || {}).cap ?? 240, wk = weekKey();
  let spent = 0, weekMin = 0;
  Object.values(reqs).forEach(r => { if (!r || r.st === 'no') return; spent += r.min; if (r.wk === wk && r.st === 'ok') weekMin += r.min; });
  const earned = xpTotal(id);
  return { earned, spent, bal:Math.max(0, earned - spent), cap, weekMin, left:Math.max(0, cap - weekMin), reqs, wk };
}

/* ---- Jimon ---- */
const JACC = {
  syal:{ n:'Syal', lv:1, pos:[30.6, 51.3, 38.9, 0] }, tas:{ n:'Tas kecil', lv:2, pos:[37.5, 52.6, 33.3, 0] }, ikat:{ n:'Ikat kepala', lv:3, pos:[27.2, 17.9, 47.2, 0] },
  kacamata:{ n:'Kacamata', lv:4, pos:[24.2, 32.3, 63.6, 0] }, lentera:{ n:'Lentera', lv:5, pos:[72.8, 69.7, 16.1, 0] }, topi:{ n:'Topi petualang', lv:6, pos:[23.6, 4.1, 52.8, 0] },
  jubah:{ n:'Jubah pahlawan', lv:7, pos:[11.1, 50.3, 77.8, 1] }, mahkota:{ n:'Mahkota zaitun', lv:8, pos:[27.8, 9.7, 44.4, 0] }
};
const JHEAD = { ikat:1, kacamata:1, topi:1, mahkota:1 };
const jimonFace = f => jimg('jimon/ekspresi/e_' + f + '.webp');
function jimonDirt(id) {
  id = id || CUR; const J = pget(id, 'jlb:jimon', {}) || {}, days = pget(id, 'jlb:day', {}), tk = todayK();
  if (J.bath === tk || !J.since) return 0;
  let miss = 0, d = jAdd(new Date(), -1);
  for (let i = 0; i < 14; i++) {
    const k = dkey(d); if (J.bath && k <= J.bath) break;
    const r = days[k]; if (r && r.s && PR.some(p => r.s[p] && r.s[p].f)) break;
    if (J.since && k < J.since) break;
    miss++; d = jAdd(d, -1);
  }
  return miss;
}
/* A Jimon picture with an accessory layer. size = width in px */
function jimonHTML(o = {}) {
  const face = o.face || 'senang', wear = o.wear, a = wear && JACC[wear] && !o.plain ? JACC[wear] : null, f = face === 'dengar' && JHEAD[wear] ? 'senang' : face;
  const w = o.w || 180, h = Math.round(w * 390 / 360);
  const layer = x => `<img class="jm-acc" src="${jimg('jimon/hiasan/a_' + wear + '.webp')}" alt="" style="left:${x[0]}%;top:${x[1]}%;width:${x[2]}%" loading="lazy" decoding="async">`;
  return `<span class="jimon ${o.cls || ''}" style="width:${w}px;height:${h}px">${a && a.pos[3] ? layer(a.pos) : ''}<img class="jm-face" src="${jimonFace(f)}" alt="${esc(o.alt || 'Jimon')}" width="${w}" height="${h}" decoding="async">${o.blink ? `<img class="jm-blink" src="${jimonFace('kedip')}" alt="" decoding="async">` : ''}${a && !a.pos[3] ? layer(a.pos) : ''}</span>`;
}

/* ---- small UI helpers ---- */
const jbtn = (label, attrs = '', cls = '') => `<button class="jb ${cls}" ${attrs}>${label}</button>`;
const jicon = (n, alt = '', fb = '') => `<img class="jic" src="${jimg('ikon/' + n + '.webp')}" alt="${esc(alt)}" width="44" height="44" loading="lazy" decoding="async"${fb && fb !== n ? ` onerror="this.onerror=null;this.src='${jimg('ikon/' + fb + '.webp')}'"` : ''}>`;
/* Parts of the day, in order (amal follow the day like a calendar) */
const SLOTS = [['malam', 'Sepertiga malam'], ['subuh', 'Subuh'], ['pagi', 'Pagi'], ['siang', 'Siang'], ['sore', 'Sore'], ['maghrib', 'Maghrib'], ['isya', 'Malam']];
function slotNow(date = new Date()) {
  const t = prayerTimes(date, setting('city', 'Jakarta')), m = date.getHours() * 60 + date.getMinutes();
  return m < t.subuh ? 'malam' : m < t.subuh + 90 ? 'subuh' : m < t.dzuhur ? 'pagi' : m < t.ashar ? 'siang' : m < t.maghrib ? 'sore' : m < t.isya ? 'maghrib' : 'isya';
}
/* Puasa sunnah from the app calendar (js/calendar.js) */
const FAST_IC = { mon:'puasa_senin_kamis', thu:'puasa_senin_kamis', bidh:'ayyamul_bidh', arafah:'arafah', tasua:'asyura', asyura:'asyura', syawal:'syawal' };
const FAST_ID = { mon:'Senin', thu:'Kamis', bidh:'Ayyamul Bidh', arafah:'Arafah', tasua:'Tasu’a', asyura:'Asyura', syawal:'6 hari Syawal' };
function syawalCount(id, date = new Date()) {
  const h = hijri(date), all = pget(id || CUR, 'jlb:day', {}) || {};
  return Object.keys(all).filter(k => { if (!(all[k].a || {}).puasa) return false; const x = hijri(kOf(k)); return x.y === h.y && x.m === 10; }).length;
}
function fastToday(id, date = new Date()) {
  const x = dayInfo(date); let f = x.fast.slice();
  if (f.includes('syawal') && syawalCount(id, date) >= 6 && !(dayOf(todayK(), id).a || {}).puasa) f = f.filter(k => k !== 'syawal');
  return f;
}
const kidMissionsToday = list => list.filter(m => m !== 'puasa' || dayInfo(new Date()).fasting);
function jtoast(t) { let el = $('#jToast'); if (!el) { el = document.createElement('div'); el.id = 'jToast'; el.className = 'jtoast'; el.setAttribute('role', 'status'); document.body.appendChild(el); } el.textContent = t; el.classList.add('on'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), 2200); }
const hijriShort = d => { const h = hijri(d); return h.d + ' ' + HMON[LANG][h.m - 1]; };
function back(href, label = 'Kembali') { return `<a class="jback" href="${href}" aria-label="${label}">${I('chev', 'flip')}</a>`; }

/* ---- lazy modules: loaded the first time a screen needs them ---- */
const JMOD = {};
function jmod(name) {
  if (JMOD[name]) return JMOD[name];
  JMOD[name] = new Promise((ok, bad) => { const s = document.createElement('script'); s.src = 'js/jlb_' + name + '.js?v=' + JLB_VER; s.onload = ok; s.onerror = () => { delete JMOD[name]; bad(); }; document.head.appendChild(s); });
  return JMOD[name];
}
function jlazy(mods, view, fn) {
  const el = $('#v-' + view);
  const ready = mods.every(m => JMOD[m] && JMOD[m].done);
  if (ready) return fn();
  el.innerHTML = '<div class="jload" aria-busy="true"><span></span></div>';
  Promise.all(mods.map(jmod)).then(() => { mods.forEach(m => { JMOD[m].done = true; }); if (document.body.dataset.view === view) fn(); })
    .catch(() => { el.innerHTML = `<p class="note">${tt('Couldn’t load this part. Check the connection and try again.','Bagian ini belum bisa dimuat. Cek koneksi lalu coba lagi.')}</p>`; });
}

/* ---- tabs and routes ---- */
function jlbTabs() {
  if (isKidP()) return [['taman', 'Beranda', 'home'], ['amal', 'Misi', 'star'], ['home', 'Gerak', 'glove'], ['belajar', 'Belajar', 'book'], ['saya', 'Saya', 'me']];
  return [['taman', tt('Garden','Taman'), 'home'], ['amal', 'Amal', 'check'], ['home', tt('Training','Latihan'), 'glove'], ['rekap', 'Rekap', 'progress'], ['saya', tt('Me','Saya'), 'me']];
}
const JTAB_OF = { plan:'home', workouts:'home', progress:'home', me:'saya', perjalanan:'saya', p40:'saya', mujahadah:'saya', detail:'amal', peti:'taman', jimon:'saya', ortu:'saya', keluarga:'taman', hijriah:'rekap', ngobrol:'saya' };
Object.assign(RENDER, {
  taman:() => isKidP() ? jlazy(['kids'], 'taman', () => renderKidHome()) : jlazy(['adult'], 'taman', () => renderTaman()),
  amal:() => isKidP() ? jlazy(['kids'], 'amal', () => renderMisi()) : jlazy(['adult'], 'amal', () => renderAmal()),
  detail:() => jlazy(['adult'], 'detail', () => renderDetail()),
  saya:() => isKidP() ? jlazy(['kids'], 'saya', () => renderKamar()) : jlazy(['adult'], 'saya', () => renderSaya()),
  perjalanan:() => jlazy(['adult'], 'perjalanan', () => renderPerjalanan()),
  p40:() => jlazy(['adult'], 'p40', () => render40()),
  mujahadah:() => jlazy(['adult'], 'mujahadah', () => renderMujahadah()),
  rekap:() => jlazy(['rekap'], 'rekap', () => renderRekap()),
  hijriah:() => jlazy(['rekap'], 'hijriah', () => renderHijriah()),
  keluarga:() => jlazy(['rekap'], 'keluarga', () => renderKeluarga()),
  peti:() => jlazy(['kids'], 'peti', () => renderPeti()),
  ortu:() => jlazy(['kids'], 'ortu', () => renderOrtu()),
  jimon:() => jlazy(['kids', 'jimon'], 'jimon', () => renderJimonChat()),
  belajar:() => jlazy(['learn'], 'belajar', () => renderBelajar())
});
(function addViews() {
  const main = document.querySelector('main');
  Object.keys(RENDER).forEach(k => { if (!$('#v-' + k)) { const s = document.createElement('section'); s.id = 'v-' + k; s.className = 'view'; s.hidden = true; main.appendChild(s); } });
})();
/* home (training) gets the Latihan sub-nav on top */
['home', 'plan', 'workouts', 'progress'].forEach(k => {
  const f = RENDER[k];
  RENDER[k] = function () { f(); const el = $('#v-' + k); if (!el || el.querySelector('.jsub')) return;
    const kid = isKidP(), items = kid ? [['home', 'Jurus Ninja'], ['workouts', tt('Moves','Gerakan')], ['progress', tt('Journal','Jurnal')]] : [['home', tt('Today','Hari ini')], ['plan', tt('Plan','Program')], ['workouts', tt('Workouts','Latihan')], ['progress', tt('Journal','Jurnal')]];
    el.insertAdjacentHTML('afterbegin', `<nav class="jsub" aria-label="${tt('Training','Latihan')}"><span class="jsub-t">${kid ? 'Gerak' : 'Jurnal Sehat Kita'}</span>${items.map(([h, t]) => `<a href="#${h}" ${h === k ? 'aria-current="page"' : ''}>${t}</a>`).join('')}</nav>`); };
});
/* Me (settings) gets a back link to Saya */
{ const f = RENDER.me; RENDER.me = function () { f(); const el = $('#v-me'); if (el && !el.querySelector('.jsub')) el.insertAdjacentHTML('afterbegin', `<nav class="jsub"><a href="#saya">‹ ${tt('Back to Me','Kembali ke Saya')}</a></nav>`); }; }

/* ---- sync: merge per day so two phones never overwrite each other ---- */
function jlbMerge(k, local, remote) {
  if (!/^p:[^:]+:jlb:(day|learn|peti|roda|jalan)$/.test(k)) return undefined;
  if (!local || !remote || typeof local !== 'object' || typeof remote !== 'object') return undefined;
  const m = Object.assign({}, local);
  Object.keys(remote).forEach(d => { const a = m[d], b = remote[d]; if (!a || ((b && b.at) || 0) >= ((a && a.at) || 0)) m[d] = b; });
  return m;
}

/* ---------- Ayat audio ----------
   Streams verse-by-verse recordings from everyayah.com (free for non-commercial use, reciter credited).
   To host the files yourself instead, upload img/jlb/audio/SSSAAA.mp3 plus img/jlb/audio/qari.json
   ({"name":..., "sumber":...}); that file then takes over. The device voice never reads the Quran. */
let QARI = { name:'Syaikh Mishary Rashid Alafasy', sumber:'everyayah.com', base:'https://everyayah.com/data/Alafasy_128kbps/' }, JPLAY = null;
function qariOn(q) { QARI = q; document.body.classList.add('jaudio');
  document.documentElement.style.setProperty('--qari', JSON.stringify('Tilawah: ' + q.name + (q.sumber ? ' · ' + q.sumber : ''))); }
qariOn(QARI);
fetch(JIMG + 'audio/qari.json', { cache:'no-cache' }).then(r => r.ok ? r.json() : null).catch(() => null).then(q => {
  if (q && q.name) qariOn(Object.assign({ base:JIMG + 'audio/' }, q));
});
function listenBtn(a) { return a && a.s ? `<button type="button" class="jb ghost jlisten" data-listen="${a.s}:${a.a}:${a.b || a.a}" aria-pressed="false">Dengarkan</button><span class="jsrc jqari"></span>` : ''; }
const pad3 = n => String(n).padStart(3, '0');
function stopListen() { if (!JPLAY) return; JPLAY.au.pause(); JPLAY.btn.setAttribute('aria-pressed', 'false'); JPLAY.btn.textContent = 'Dengarkan'; JPLAY = null; }
document.addEventListener('click', e => {
  const b = e.target.closest('[data-listen]'); if (!b || !QARI) return;
  if (JPLAY && JPLAY.btn === b) return stopListen();
  stopListen(); if ('speechSynthesis' in window) speechSynthesis.cancel();
  const [s, a, z] = b.dataset.listen.split(':').map(Number), list = [];
  for (let i = a; i <= z; i++) list.push(QARI.base + pad3(s) + pad3(i) + '.mp3');
  const au = new Audio(); let i = 0;
  JPLAY = { au, btn:b }; b.setAttribute('aria-pressed', 'true'); b.textContent = 'Berhenti';
  au.onended = () => { if (JPLAY && JPLAY.au === au && ++i < list.length) { au.src = list[i]; au.play().catch(() => {}); } else if (JPLAY && JPLAY.au === au) stopListen(); };
  au.onerror = () => { if (JPLAY && JPLAY.au === au) { stopListen(); jtoast('Rekaman belum bisa diputar. Periksa internet.'); } };
  au.src = list[0]; au.play().catch(() => {});
});
addEventListener('hashchange', stopListen);
