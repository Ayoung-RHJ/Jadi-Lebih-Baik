/* =========================================================
   jlb13 · Jimon Teman Setia (kid mode only, loaded by the hook at the end of jlb_core.js)
   - Jimon kecil di Misi, Belajar, Peti, Perjalanan dan Rekap: ketuk = menyapa, usap = dielus, tekan lama = mendengkur.
     Beranda dan Kamar sudah punya Jimon besar, jadi di sana gelembungnya muncul di Jimon besar.
   - Sapaan pertama hari ini, kembali setelah lama pergi, dan misi/kisah pertama yang selesai: suara Jimon lalu
     nama anak dibaca suara HP (bisa dimatikan di Ruang Orang Tua). Gelembung selalu menulis namanya.
   - Teman misi: sikat gigi 2 menit, minum 6 gelas, rapikan tempat tidur 1 menit.
   - Istirahat mata setelah 20 menit di layar. Perasaanku hari ini. Rutinitas malam. Hadiah dua arah. Tata kamar.
   Penyimpanan: jlb:rasa (ikut sinkron, untuk Ayah dan Ibu), jlb:jimon gift/room/piyama (ikut sinkron),
   _jb:<id> dan _ingat:<id> hanya di HP ini (tidak sinkron).
   ========================================================= */

/* Clips with an [ustadz] line (Lembar Periksa bagian 15): approved by the ustadz on 23 Nov 2026, so none wait any more.
   A clip put in this set would be replaced by its neutral clip below until it is approved. */
const JB_TUNGGU = new Set([]);
const JB_GANTI = { v_sapa_pagi:'v_malam_pagi', v_puji_masya:'v_puji_bangga', v_malam_doa:'' };
const jbClip = id => JB_TUNGGU.has(id) ? JB_GANTI[id] : id;

/* text of every clip, shown in the bubble while it plays */
const JBL = {
  v_sapa_pagi:'Assalamualaikum! Selamat pagi!', v_sapa_siang:'Selamat siang! Sudah makan siang?', v_sapa_sore:'Selamat sore! Hari ini seru, ya?',
  v_sapa_maghrib:'Sudah Maghrib. Ayo pulang dan bersih-bersih dulu.', v_sapa_malam:'Selamat malam! Hari ini kamu hebat.', v_sapa_kangen:'Kamu datang! Aku kangen sekali!',
  v_sapa_jumat:'Hari ini Jumat! Ada surat dariku, lho!', v_sapa_libur:'Hari libur! Mau main apa kita hari ini?',
  v_puji_misi:'Yeay! Misinya selesai!', v_puji_masya:'MasyaAllah, hebat sekali!', v_puji_lentera:'Lentera sholatmu menyala!', v_puji_rekor:'Wah, ini rekor baru!',
  v_puji_bangga:'Aku bangga padamu.', v_puji_pelan:'Pelan-pelan saja, kamu pasti bisa.', v_puji_hampir:'Hampir! Ayo coba sekali lagi.',
  v_puji_rawat:'Terima kasih sudah merawatku.', v_puji_nyam:'Nyam nyam, enak sekali!', v_puji_segar:'Segar! Sekarang aku wangi.',
  v_ajak_sikat:'Sudah sikat gigi? Ayo bareng aku!', v_ajak_sikat2:'Sikat pelan-pelan, atas dan bawah.', v_ajak_sikat_ok:'Dua menit selesai! Gigimu bersih berkilau!',
  v_ajak_minum:'Minum air dulu, yuk.', v_ajak_rapi:'Ayo rapikan tempat tidur bersama!', v_ajak_mata:'Matamu capek? Kita istirahat sebentar, yuk.',
  v_ajak_napas:'Tarik napas pelan… lalu hembuskan.', v_ajak_kisah:'Mau baca kisah bersamaku?', v_ajak_gerak:'Ayo bergerak bersamaku!', v_ajak_main:'Ayo main sebentar, lalu lanjut lagi.',
  v_rasa_sedih:'Kamu sedang sedih? Aku di sini, menemanimu.', v_rasa_marah:'Boleh kok merasa marah. Kita tarik napas dulu, yuk.',
  v_rasa_takut:'Takut itu wajar. Ceritakan ke Ayah atau Ibu, ya.', v_rasa_capek:'Kamu capek, ya? Istirahat dulu sebentar.',
  v_rasa_gembira:'Senang sekali melihatmu gembira!', v_rasa_cerita:'Terima kasih sudah bercerita padaku.', v_rasa_peluk:'Peluk dariku!', v_rasa_besok:'Besok kita coba lagi, ya.',
  v_malam_malam:'Sudah malam… aku mulai mengantuk.', v_malam_doa:'Sebelum tidur, ayo berdoa dulu.', v_malam_tidur:'Selamat tidur. Sampai jumpa besok!',
  v_malam_lampu:'Jangan lupa matikan lampu, ya.', v_malam_pagi:'Selamat pagi! Aku sudah bangun!', v_malam_bangun:'Kamu bangun pagi! Hebat!',
  v_pendek_hoam:'Hoaaam…', v_pendek_hihi:'Hihihi!', v_pendek_hmm:'Hmm?', v_pendek_horee:'Horee!', v_pendek_wah:'Wah!', v_pendek_eh:'Eh?', v_pendek_ehem:'Ehem.', v_pendek_asyik:'Asyik!'
};
const JBP = p => jimg('jimon/pose/p_' + p + '.webp');
const JBB = b => jimg('jimon/barang/b_' + b + '.webp');
const JB_VIEWS = ['amal', 'belajar', 'peti', 'perjalanan', 'keluarga'];

/* ---- small local state (this phone only) ---- */
const jbKey = () => '_jb:' + CUR;
const jbS = () => store.get(jbKey(), {}) || {};
const jbPut = fn => { const S = jbS(); fn(S); store.set(jbKey(), S); return S; };
const jbOrtu = () => typeof ortu === 'function' ? ortu() : (pget(CUR, 'jlb:ortu', {}) || {});
const kidName = () => ((PROF && PROF.name) || '').trim().split(/\s+/)[0] || '';
const jbNight = () => ['isya', 'malam'].includes(slotNow(new Date())) && new Date().getHours() >= 18 || new Date().getHours() < 4;
const withName = (t, n) => n ? t.replace(/([!.?…]+)\s*$/, ', ' + n + '$1') : t;
const jbReduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/* the child's name in the phone's own voice, right after Jimon's clip */
function jsayName(n, then) {
  const done = () => { JTALK = false; if (then) then(); };
  if (!n || !jsoundOn() || jbOrtu().nama === false || !('speechSynthesis' in window)) return done();
  try {
    const u = new SpeechSynthesisUtterance(n + '!'); u.lang = 'id-ID'; u.rate = 1; u.pitch = 1.3;
    const v = speechSynthesis.getVoices().find(x => /^id/i.test(x.lang)); if (v) u.voice = v;
    let fired = false; const end = () => { if (!fired) { fired = true; done(); } };
    u.onend = end; u.onerror = end; setTimeout(end, 2500);
    speechSynthesis.cancel(); JTALK = true; speechSynthesis.speak(u);
  } catch (e) { done(); }
}
if ('speechSynthesis' in window) try { speechSynthesis.getVoices(); } catch (e) {}

/* ---- say something: bubble + clip (+ name). On Beranda the bubble sits by the big Jimon ---- */
let JBT = null;
function jbSay(id, o = {}) {
  const clip = jbClip(id), name = o.name && jbOrtu().nama !== false ? kidName() : '', txt = o.text || withName(JBL[clip] || JBL[id] || '', o.name ? kidName() : '');
  const host = $('#jbuddy:not(.mini) .jbd-bub') || (document.body.dataset.view === 'taman' && $('#v-taman .jhero') ? jbHeroBub() : null) || (document.body.dataset.view === 'saya' && $('.jk-bub'));
  if (host && txt) { host.textContent = txt; host.hidden = false; host.classList.remove('jbd-pop'); void host.offsetWidth; host.classList.add('jbd-pop'); }
  clearTimeout(JBT);
  const hide = () => { JBT = setTimeout(() => { const b = $('#jbuddy .jbd-bub'); if (b) b.hidden = true; const h = $('.jbd-hbub'); if (h) h.remove(); }, 1800); };
  if (o.pose) jbPose(o.pose, o.poseMs || 2200);
  if (!clip || !jsoundOn()) { hide(); if (o.then) setTimeout(o.then, 1500); return; }
  jvoice(clip, () => { if (name) jsayName(name, () => { hide(); o.then && o.then(); }); else { hide(); o.then && o.then(); } });
}
function jbHeroBub() {
  let b = $('.jbd-hbub'); if (b) return b;
  b = document.createElement('span'); b.className = 'jbd-hbub'; b.setAttribute('aria-live', 'polite'); $('#v-taman .jhero').appendChild(b); return b;
}

/* ---------------- the floating mini Jimon ---------------- */
let JBD = { pose:null, walked:false, idle:0, lastTap:0, tapI:0, hearts:0 };
function jbCatHTML() {
  const J = jget('jimon', {}) || {};
  if (JBD.pose) return `<img class="jbd-pose" src="${JBP(JBD.pose)}" alt="">`;
  if (jimonDirt()) return `<img class="jbd-pose" src="${jimg('jimon/keadaan/j_debu.webp')}" alt="Jimon berdebu">`;
  if (jTidur(J)) return `<img class="jbd-pose" src="${JBP('piyama_tidur')}" alt="Jimon tidur"><span class="jzz z1">z</span><span class="jzz z2">Z</span>`;
  return jimonHTML({ face:JBD.face || 'senang', wear:jWear(J.wear), w:96 });
}
function jbPaint() {
  const el = $('#jbuddy'); if (!el || el.classList.contains('mini') || el.classList.contains('walk')) return;
  $('.jbd-cat', el).innerHTML = jbCatHTML() + (JBD.hearts ? '<span class="jheart" style="left:30%;top:-6px">♥</span><span class="jheart" style="left:62%;top:6px;animation-delay:.25s">♥</span>' : '');
}
function jbPose(p, ms) { JBD.pose = p; jbPaint(); clearTimeout(JBD.pt); JBD.pt = setTimeout(() => { JBD.pose = null; jbPaint(); }, ms); }
function jbBuild() {
  const el = document.createElement('div'); el.id = 'jbuddy'; el.className = 'jbd';
  el.innerHTML = `<div class="jbd-bub" hidden aria-live="polite"></div><button type="button" class="jbd-cat" aria-label="Jimon. Ketuk untuk menyapa, usap untuk mengelus"></button>
    <button type="button" class="jbd-x" aria-label="Kecilkan Jimon">×</button><button type="button" class="jbd-peek" aria-label="Panggil Jimon"><img src="${JBP('intip_bawah')}" alt=""></button>`;
  document.body.appendChild(el);
  if (jbS().mini) el.classList.add('mini');
  return el;
}
function jbWalkIn(el) {
  if (JBD.walked || jbReduce() || el.classList.contains('mini')) { JBD.walked = true; return jbPaint(); }
  JBD.walked = true; el.classList.add('walk'); const cat = $('.jbd-cat', el); let i = 0;
  cat.innerHTML = `<img class="jbd-pose" src="${jimg('jimon/jalan/w1.webp')}" alt="">`; const im = $('img', cat);
  const t = setInterval(() => { i++; im.src = jimg('jimon/jalan/w' + (i % 4 + 1) + '.webp'); }, 130);
  setTimeout(() => { clearInterval(t); im.src = jimg('jimon/jalan/w_duduk.webp'); setTimeout(() => { el.classList.remove('walk'); jbPaint(); }, 280); }, 1250);
}

/* called by the render hook after every screen */
function buddySync(view) {
  const kid = isKidP(); let el = $('#jbuddy');
  if (!kid) { if (el) el.remove(); const s = $('#jbSheet'); if (s) s.remove(); return; }
  const show = JB_VIEWS.includes(view) && !(view === 'belajar' && ROUTE_ARG);
  if (show) { if (!el) { el = jbBuild(); jbWalkIn(el); } el.hidden = false; jbPaint(); }
  else if (el) el.hidden = true;
  jbGreet(view);
}

/* ---- first greeting of the day, coming back after a while, waking up after the night routine ---- */
function jbGreet(view) {
  const tk = todayK(), S = jbS(); if (S.greet === tk) { if (S.last !== tk) jbPut(x => { x.last = tk; }); return; }
  if (!['taman', 'amal', 'belajar', 'saya', 'peti'].includes(view)) return;
  const gap = S.last ? Math.round((kOf(tk) - kOf(S.last)) / 864e5) : 0, now = new Date(), sl = slotNow(now), dow = now.getDay(), J = jget('jimon', {}) || {};
  let id, then = null;
  if (gap >= 2) id = 'v_sapa_kangen';
  else if (J.piyama && jTidur(J) && ['malam', 'subuh', 'pagi'].includes(sl) && now.getHours() >= 4) {
    jset('jimon', Object.assign({}, J, { tidur:false, piyama:'' })); id = 'v_malam_pagi';
    if (sl === 'subuh' || now.getHours() < 6) then = () => jbSay('v_malam_bangun', { pose:'meregang' });
  }
  else if (dow === 5 && !['maghrib', 'isya'].includes(sl)) id = 'v_sapa_jumat';
  else if ([0, 6].includes(dow) && ['pagi', 'siang', 'subuh'].includes(sl)) id = 'v_sapa_libur';
  else id = { malam:now.getHours() >= 4 ? 'v_sapa_pagi' : 'v_sapa_malam', subuh:'v_sapa_pagi', pagi:'v_sapa_pagi', siang:'v_sapa_siang', sore:'v_sapa_sore', maghrib:'v_sapa_maghrib', isya:'v_sapa_malam' }[sl];
  jbPut(x => { x.greet = tk; x.last = tk; });
  setTimeout(() => { if (view === 'saya' && typeof renderKamar === 'function' && document.body.dataset.view === 'saya') renderKamar(); jbSay(id, { name:true, then }); }, view === 'taman' || view === 'saya' ? 700 : 1700);
}

/* ---- events from other screens: 'misi', 'lentera', 'kisah' ---- */
function jbuddyReact(ev, delay = 0) {
  if (!isKidP()) return;
  setTimeout(() => {
    jbuzz(25);
    const tk = todayK(), first = jbS().masya !== tk;
    if ((ev === 'misi' || ev === 'kisah') && first) { jbPut(x => { x.masya = tk; }); return jbSay('v_puji_masya', { name:true, pose:'lompat', poseMs:2600 }); }
    if (ev === 'misi') { const d = dayOf(tk), l = typeof kidMisList === 'function' ? kidMisList() : [], n = l.filter(m => (d.m || {})[m]).length;
      return jbSay(l.length && n === l.length ? 'v_puji_rekor' : jpick(['v_puji_misi', 'v_puji_misi', 'v_pendek_horee', 'v_puji_bangga']), { pose:'lompat', poseMs:2000, text:l.length && n === l.length ? 'Semua misi hari ini selesai! Wah, ini rekor baru!' : '' }); }
    if (ev === 'lentera') return jbSay('v_puji_lentera', { pose:'peluk_bintang', poseMs:2200 });
    if (ev === 'kisah') return jbSay('v_puji_bangga', { pose:'lompat' });
  }, delay);
}

/* ---- taps, swipe-to-pet, long press ---- */
function jbLines() {
  const v = document.body.dataset.view, tk = todayK(), d = dayOf(tk), dm = d.m || {}, O = jbOrtu(), l = typeof kidMisList === 'function' ? kidMisList(O) : [];
  const out = [], M = jbIngat();
  if (v === 'amal') {
    if (l.includes('sikat') && !dm.sikat) out.push(['v_ajak_sikat', 'Sudah sikat gigi? Ketuk misi Sikat gigi, kita sikat bareng!']);
    if (l.includes('minum') && !dm.minum) out.push(['v_ajak_minum', '']);
    if (l.includes('rapikan') && !dm.rapikan && ['subuh', 'pagi'].includes(slotNow(new Date()))) out.push(['v_ajak_rapi', '']);
    if (l.length && l.every(m => dm[m])) out.push(['v_puji_bangga', 'Semua misi selesai. Aku bangga padamu.']);
  }
  if (v === 'belajar') out.push(['v_ajak_kisah', '']);
  if (M.makan) out.push(['v_pendek_ehem', 'Ehem. Kamu pernah bilang suka ' + M.makan + '. Jangan lupa makan, ya!']);
  if (M.cita) out.push(['v_pendek_wah', 'Wah, calon ' + M.cita + '! Ayo rajin belajar dan minum air.']);
  if (M.teman) out.push(['v_pendek_hmm', 'Hmm? Sudah berbuat baik kepada ' + M.teman + ' hari ini?']);
  if (M.hewan) out.push(['v_pendek_hihi', 'Hihihi! Aku dan ' + M.hewan + ' sama-sama lucu, ya?']);
  return out.concat([['v_pendek_hihi', 'Hihihi! Geli!'], ['v_pendek_wah', 'Wah! Halo lagi!'], ['v_pendek_eh', 'Eh? Kamu mengetukku!'], ['v_pendek_hmm', 'Hmm? Ada apa?'], ['v_ajak_main', ''], ['v_puji_pelan', '']]);
}
function jbTap() {
  JBD.idle = 0; jbuzz(8);
  const J = jget('jimon', {}) || {};
  if (jTidur(J)) return jbSay('', { text:'Zzz… Jimon sedang tidur. Bangunkan di kamar Jimon, ya.' });
  if (jimonDirt()) return jbSay('', { text:'Aku berdebu… mandikan aku di kamar, ya.' });
  const L = jbLines(), x = L[JBD.tapI++ % L.length];
  const cat = $('#jbuddy .jbd-cat'); if (cat) { cat.classList.remove('jbd-hop'); void cat.offsetWidth; cat.classList.add('jbd-hop'); }
  jbSay(x[0], { text:x[1] || '' });
}
function jbPet(long) {
  JBD.idle = 0; JBD.face = 'dengkur'; JBD.hearts = 1; jbPaint(); jbuzz(long ? 30 : 12);
  const now = Date.now(); if (now - (JBD.petAt || 0) > 1500) { JBD.petAt = now; jvoice(long ? 'dengkur' : jpick(['dengkur', 'dengkur', 'tertawa'])); if (typeof jimonMood === 'function') jimonMood('elus'); }
  const b = $('#jbuddy .jbd-bub'); if (b) { b.textContent = long ? 'Prrr… nyaman sekali.' : 'Prrr…'; b.hidden = false; }
  clearTimeout(JBD.pet); JBD.pet = setTimeout(() => { JBD.face = null; JBD.hearts = 0; jbPaint(); if (b) b.hidden = true; }, 1600);
}
/* swipe-to-pet works on the floating Jimon and on the big Jimon in the room */
let JBP0 = null;
document.addEventListener('pointerdown', e => {
  const t = e.target.closest('#jbuddy .jbd-cat, .jkamar .cat'); if (!t || !isKidP()) return;
  JBP0 = { t, x:e.clientX, y:e.clientY, d:0, moved:false, long:false, room:t.matches('.jkamar .cat') };
  clearTimeout(JBP0.lt); JBP0.lt = setTimeout(() => { if (JBP0 && !JBP0.moved && !JBP0.room) { JBP0.long = true; jbPet(true); } }, 550);
});
document.addEventListener('pointermove', e => {
  if (!JBP0) return; const dx = e.clientX - JBP0.x, dy = e.clientY - JBP0.y; JBP0.d += Math.hypot(dx, dy); JBP0.x = e.clientX; JBP0.y = e.clientY;
  if (JBP0.d > 60) { JBP0.moved = true; JBP0.d = 0; clearTimeout(JBP0.lt);
    if (JBP0.room) { const J = jget('jimon', {}); if (!jimonDirt() && !jTidur(J)) { jbuzz(10); const now = Date.now(); if (now - (JBD.petAt || 0) > 1500) { JBD.petAt = now; jvoice('dengkur'); jimonMood('elus'); }
      const r = $('.jkamar'); if (r) { const h = document.createElement('span'); h.className = 'jheart'; h.textContent = '♥'; const R = r.getBoundingClientRect(); h.style.left = (e.clientX - R.left) + 'px'; h.style.top = (e.clientY - R.top - 20) + 'px'; r.appendChild(h); setTimeout(() => h.remove(), 1400); } } }
    else jbPet(false); }
}, { passive:true });
document.addEventListener('pointerup', () => { if (JBP0) { clearTimeout(JBP0.lt); JBP0.end = Date.now(); JBPL = JBP0; } JBP0 = null; });
document.addEventListener('pointercancel', () => { if (JBP0) clearTimeout(JBP0.lt); JBP0 = null; });
let JBPL = null;   // the last press, so the click after a swipe or long press is ignored
document.addEventListener('click', e => {
  const swallow = JBPL && (JBPL.moved || JBPL.long) && Date.now() - JBPL.end < 400;
  if (e.target.closest('.jkamar .cat') && swallow) { e.stopPropagation(); e.preventDefault(); return; }
  if (e.target.closest('#jbuddy .jbd-cat')) { if (!swallow) jbTap(); return; }
  if (e.target.closest('#jbuddy .jbd-x')) { jbPut(x => { x.mini = true; }); $('#jbuddy').classList.add('mini'); jbuzz(8); return; }
  if (e.target.closest('#jbuddy .jbd-peek')) { jbPut(x => { x.mini = false; }); const el = $('#jbuddy'); el.classList.remove('mini'); jbPaint(); jbSay('v_pendek_wah', { text:'Wah! Aku kembali!' }); return; }
}, true);

/* idle: a yawn now and then (sound at most once every 10 minutes) */
setInterval(() => {
  const el = $('#jbuddy'); if (!el || el.hidden || el.classList.contains('mini') || document.hidden || JBD.pose) return;
  JBD.idle++; if (JBD.idle < 6) return; JBD.idle = 0;
  const now = Date.now(), loud = now - (JBD.yawnAt || 0) > 6e5 && !(JAU && !JAU.paused); if (loud) JBD.yawnAt = now;
  if (Math.random() < .5) { jbPose('menguap', 2200); if (loud) jvoice('v_pendek_hoam'); } else jbPose(jpick(['heran', 'meregang']), 2000);
}, 12000);

/* ---------------- sheets ---------------- */
function jbSheet(html, cls = '') {
  jbClose(); const s = document.createElement('div'); s.className = 'jsheet'; s.id = 'jbSheet';
  s.innerHTML = `<div role="dialog" aria-modal="true" class="jbs ${cls}">${html}</div>`; document.body.appendChild(s);
  const f = s.querySelector('button'); if (f) f.focus({ preventScroll:true }); return s;
}
function jbClose() { const s = $('#jbSheet'); if (s) { clearInterval(s._t); s.remove(); } }
addEventListener('hashchange', jbClose);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#jbSheet')) jbClose(); });
const jbRing = (left, total, label) => { const p = Math.max(0, left / total), C = 2 * Math.PI * 52;
  return `<span class="jbring"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" class="bg"/><circle cx="60" cy="60" r="52" class="fg" style="stroke-dasharray:${C};stroke-dashoffset:${C * (1 - p)}"/></svg><b>${label}</b></span>`; };
const mmss = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');

/* ---- mission companion: sikat, minum, rapikan ---- */
const JBMIS = {
  sikat:{ n:'Sikat gigi bareng Jimon', p:'sikat_gigi', sec:120, how:'Dua menit. Sikat pelan-pelan, atas dan bawah, depan dan belakang.', start:'v_ajak_sikat', mid:'v_ajak_sikat2', end:'v_ajak_sikat_ok' },
  rapikan:{ n:'Rapikan tempat tidur bareng Jimon', p:'rapikan', sec:60, how:'Satu menit. Tarik selimut, tepuk bantal, rapikan guling.', start:'v_ajak_rapi', end:'v_puji_misi' },
  minum:{ n:'Minum air bareng Jimon', p:'minum', glass:6, start:'v_ajak_minum' }
};
function jbTick(id) {
  const tk = todayK(); if ((dayOf(tk).m || {})[id]) return;
  dayPut(tk, d => { d.m = Object.assign({}, d.m || {}); d.m[id] = 1; });
  jtoast('Misi selesai! +5 XP'); if (typeof checkLevelUp === 'function') checkLevelUp();
  if (document.body.dataset.view === 'amal' && typeof renderMisi === 'function') renderMisi();
  if (typeof checkLevelUp === 'function' && typeof KPOP !== 'undefined' && KPOP !== null && document.body.dataset.view === 'saya') renderKamar();
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-kmis]'); if (!t || !isKidP()) return;
  const id = t.dataset.kmis; if (!JBMIS[id] || (dayOf(todayK()).m || {})[id]) return;
  e.stopPropagation(); e.preventDefault(); jbMisOpen(id);
}, true);
function jbMisOpen(id) {
  const M = JBMIS[id]; JBD.mis = { id, run:false };
  if (M.glass) return jbGlass(true);
  jbSheet(`<img class="jbs-pose jbreathe" src="${JBP(M.p)}" alt=""><h2>${M.n}</h2><p class="jmut">${M.how}</p>
    ${jbtn('Mulai ' + (M.sec >= 120 ? '2 menit' : '1 menit') + ' bareng Jimon', 'data-jbgo', 'block')}${jbtn('Aku sudah selesai', 'data-jbdone', 'ghost block')}${jbtn('Nanti saja', 'data-jbx', 'ghost block')}`);
  jbSay(M.start);
}
function jbMisRun() {
  const id = JBD.mis.id, M = JBMIS[id], t0 = Date.now(); let midDone = false; JBD.mis.run = true;
  const paint = left => { const s = $('#jbSheet'); if (!s) return; $('.jbs', s).innerHTML = `<img class="jbs-pose jbd-brush" src="${JBP(M.p)}" alt="">${jbRing(left, M.sec, mmss(left))}<p class="jbs-say" aria-live="polite">${esc(left > M.sec / 2 ? JBL[M.start] : JBL[M.mid || M.start])}</p>${jbtn('Berhenti', 'data-jbx', 'ghost block')}`; };
  const s = $('#jbSheet'); paint(M.sec); jbuzz(20);
  s._t = setInterval(() => {
    const left = Math.max(0, M.sec - Math.round((Date.now() - t0) / 1000));
    if (!$('#jbSheet')) return; paint(left);
    if (M.mid && !midDone && left <= M.sec / 2) { midDone = true; jvoice(M.mid); jbuzz(15); }
    if (!left) { clearInterval(s._t); jbuzz([40, 60, 40]);
      $('.jbs', s).innerHTML = `<img class="jbs-pose ka-hop" src="${JBP('lompat')}" alt=""><h2>${esc(JBL[M.end])}</h2>${jbtn('Horee!', 'data-jbx', 'gold block')}`;
      jvoice(M.end, () => { jbTick(id); jbuddyReact('misi', 200); }); }
  }, 500);
}
function jbGlass(open) {
  const tk = todayK(), S = jbS(), n = S.gl && S.gl.d === tk ? S.gl.n : 0, done = (dayOf(tk).m || {}).minum;
  const html = `<img class="jbs-pose ${JBD.drink ? 'jbd-drink' : 'jbreathe'}" src="${JBP('minum')}" alt=""><h2>Minum air bareng Jimon</h2>
    <div class="jbglass" role="img" aria-label="${n} dari 6 gelas">${[0, 1, 2, 3, 4, 5].map(i => `<img src="${JBB('gelas')}" alt="" class="${i < n ? 'on' : ''}">`).join('')}</div>
    <p class="jmut">${done ? 'Misi minum hari ini sudah selesai. Tetap minum kalau haus, ya!' : n + ' dari 6 gelas hari ini. Setiap habis minum, ketuk tombol di bawah.'}</p>
    ${jbtn('Aku minum 1 gelas', 'data-jbglass', 'block')}${done ? '' : jbtn('Sudah 6 gelas', 'data-jbdone', 'ghost block')}${jbtn('Tutup', 'data-jbx', 'ghost block')}`;
  if (open) { jbSheet(html); jbSay('v_ajak_minum'); } else { const s = $('#jbSheet .jbs'); if (s) s.innerHTML = html; }
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-jbgo],[data-jbdone],[data-jbx],[data-jbglass]'); if (!t) return;
  const ds = t.dataset;
  if (ds.jbx !== undefined) { jbClose(); return; }
  if (ds.jbgo !== undefined) return jbMisRun();
  if (ds.jbdone !== undefined && JBD.mis) { const id = JBD.mis.id; jbClose(); jbTick(id); jbuddyReact('misi', 150); return; }
  if (ds.jbglass !== undefined) { const tk = todayK(); const S = jbPut(x => { x.gl = x.gl && x.gl.d === tk ? { d:tk, n:x.gl.n + 1 } : { d:tk, n:1 }; });
    JBD.drink = true; jbGlass(false); jbuzz(15); setTimeout(() => { JBD.drink = false; }, 1200);
    if (S.gl.n >= 6 && !(dayOf(tk).m || {}).minum) jvoice('v_pendek_horee', () => { jbTick('minum'); if ($('#jbSheet')) jbGlass(false); jbuddyReact('misi', 100); });
    else jvoice(jpick(['v_pendek_asyik', 'v_pendek_wah', 'v_pendek_horee'])); }
});

/* ---- eye rest after 20 minutes on the screen ---- */
setInterval(() => {
  if (!CUR || !isKidP() || document.hidden) return;
  const now = Date.now(), S = jbS(), busy = $('#jbSheet') || (typeof jkidSes === 'function' && jkidSes()) || (typeof JG !== 'undefined' && JG && JG.phase === 'run');
  const eye = now - (S.eyeAt || 0) > 5 * 60e3 ? 15 : (S.eye || 0) + 15;   // a 5-minute break starts the count again
  jbPut(x => { x.eye = eye; x.eyeAt = now; });
  if (eye >= 20 * 60 && !busy) { jbPut(x => { x.eye = 0; }); jbEye(); }
}, 15000);
function jbEye() {
  jbSheet(`<img class="jbs-pose jbreathe" src="${JBP('meregang')}" alt="Jimon meregangkan badan"><h2>Istirahat mata, yuk!</h2>
    <p>Sudah 20 menit melihat layar. Lihat benda yang jauh di luar jendela selama 20 detik, lalu kedipkan mata pelan-pelan.</p>
    ${jbtn('Mulai 20 detik', 'data-jbeye', 'block')}${jbtn('Nanti saja (5 menit lagi)', 'data-jbeyel', 'ghost block')}`);
  jbSay('v_ajak_mata');
}
document.addEventListener('click', e => {
  if (e.target.closest('[data-jbeyel]')) { jbPut(x => { x.eye = 15 * 60; x.eyeAt = Date.now(); }); return jbClose(); }
  if (!e.target.closest('[data-jbeye]')) return;
  const s = $('#jbSheet'), t0 = Date.now();
  const paint = left => { $('.jbs', s).innerHTML = `<img class="jbs-pose jbreathe" src="${JBP('meregang')}" alt="">${jbRing(left, 20, left + '')}<p>Lihat jauh ke luar jendela…</p>${jbtn('Selesai', 'data-jbx', 'ghost block')}`; };
  paint(20); s._t = setInterval(() => { const left = Math.max(0, 20 - Math.round((Date.now() - t0) / 1000)); if (!$('#jbSheet')) return; paint(left);
    if (!left) { clearInterval(s._t); $('.jbs', s).innerHTML = `<img class="jbs-pose ka-hop" src="${JBP('lompat')}" alt=""><h2>Matamu segar lagi!</h2>${jbtn('Lanjut', 'data-jbx', 'gold block')}`; jvoice('v_pendek_asyik'); jbuzz(30); } }, 500);
});

/* ---------------- Perasaanku hari ini ---------------- */
const RASA = {
  senang:['😊', 'Senang', 'tertawa_guling', 'v_rasa_gembira'], sedih:['😢', 'Sedih', 'peluk_hati', 'v_rasa_sedih'], marah:['😠', 'Marah', 'khawatir', 'v_rasa_marah'],
  takut:['😨', 'Takut', 'khawatir', 'v_rasa_takut'], capek:['😴', 'Capek', 'menguap', 'v_rasa_capek']
};
function rasaCard() {
  const r = (jget('rasa', {}) || {})[todayK()];
  if (r && RASA[r.m] && !JBD.rasaEdit) return `<section class="jcard jbrasa done" style="background:var(--jkidcard)"><span class="jbrasa-e" aria-hidden="true">${RASA[r.m][0]}</span><span style="flex:1"><b>Hari ini aku merasa ${RASA[r.m][1].toLowerCase()}</b><br><span class="jmut">Jimon sudah tahu. Ayah dan Ibu juga bisa melihatnya.</span></span><button class="jchip" data-rasaedit>Ubah</button></section>`;
  return `<section class="jcard jbrasa" style="background:var(--jkidcard)"><h2>Perasaanku hari ini</h2><div class="jbrasa-f">${Object.keys(RASA).map(k => `<button data-rasa="${k}" aria-label="${RASA[k][1]}"><span aria-hidden="true">${RASA[k][0]}</span>${RASA[k][1]}</button>`).join('')}</div></section>`;
}
function rasaOpen(k) {
  const R = Object.assign({}, jget('rasa', {}) || {}); R[todayK()] = { m:k, at:Date.now() };
  Object.keys(R).sort().slice(0, -60).forEach(x => delete R[x]); jset('rasa', R); JBD.rasaEdit = false;
  const X = RASA[k], extra = k === 'marah' ? jbtn('Tarik napas bareng Jimon', 'data-rasanapas', 'block') : k === 'sedih' || k === 'takut' ? jbtn('Peluk Jimon', 'data-rasapeluk', 'block') : '';
  jbSheet(`<img class="jbs-pose ${k === 'senang' ? 'jwig' : 'jbreathe'}" src="${JBP(X[2])}" alt=""><h2>${esc(JBL[X[3]])}</h2>
    ${k === 'sedih' || k === 'takut' ? '<p>Ceritakan juga ke Ayah atau Ibu, ya. Mereka sayang padamu.</p>' : k === 'capek' ? '<p>Minum air, duduk sebentar, atau minta peluk Ayah dan Ibu.</p>' : ''}
    <div id="jbNapas"></div>${extra}${jbtn('Terima kasih, Jimon', 'data-rasaok', 'ghost block')}`);
  jbSay(X[3]); jbuzz(15);
  if (document.body.dataset.view === 'taman') renderKidHome();
}
function rasaNapas() {
  const box = $('#jbNapas'); if (!box) return; let i = 0;
  const step = () => { if (!$('#jbNapas')) return; if (i >= 6) { box.innerHTML = '<p><b>Bagus! Sekarang lebih tenang, ya.</b></p>'; jvoice('v_rasa_cerita'); return; }
    const inn = i % 2 === 0; box.innerHTML = `<div class="jbnapas ${inn ? 'in' : 'out'}"><span>${inn ? 'Tarik napas…' : 'Hembuskan…'}</span></div><p class="jmut">${Math.floor(i / 2) + 1} dari 3</p>`; i++; setTimeout(step, 4000); };
  jvoice('v_ajak_napas'); step();
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-rasa],[data-rasaedit],[data-rasaok],[data-rasanapas],[data-rasapeluk]'); if (!t) return;
  const ds = t.dataset;
  if (ds.rasa) return rasaOpen(ds.rasa);
  if (ds.rasaedit !== undefined) { JBD.rasaEdit = true; return renderKidHome(); }
  if (ds.rasanapas !== undefined) { t.remove(); return rasaNapas(); }
  if (ds.rasapeluk !== undefined) { t.remove(); const p = $('#jbSheet .jbs-pose'); if (p) { p.src = JBP('peluk_hati'); p.insertAdjacentHTML('afterend', '<span class="jbs-hearts" aria-hidden="true"><i>♥</i><i>♥</i><i>♥</i></span>'); } jbuzz([20, 40, 20]); return jvoice('v_rasa_peluk'); }
  if (ds.rasaok !== undefined) { jbClose(); jvoice('v_rasa_cerita'); }
});

/* ---------------- Kamar: malam, hadiah, tata kamar ---------------- */
const JTOY = [['tikus', 'Tikus mainan', 10], ['tongkat_bulu', 'Tongkat bulu', 25], ['lonceng', 'Lonceng', 45], ['bantal_ikan', 'Bantal ikan', 70]];
const JFURN = [['karpet', 'Karpet bulat'], ['tanaman', 'Tanaman'], ['lampu_bulan', 'Lampu bulan'], ['rak_buku', 'Rak buku'], ['kasur', 'Kasur kucing'], ['bingkai', 'Bingkai hati']];
/* default place in the room: centre x, centre y (% of the room) and width (%) */
const JPOS = { karpet:[50, 88, 46], tanaman:[90, 52, 15], lampu_bulan:[11, 50, 12], rak_buku:[85, 34, 17], kasur:[22, 84, 28], bingkai:[30, 24, 12],
  tikus:[72, 90, 12], tongkat_bulu:[63, 80, 10], lonceng:[44, 30, 8], bantal_ikan:[30, 92, 18] };
const JNAME = Object.fromEntries(JTOY.map(x => [x[0], x[1]]).concat(JFURN));
const misTotal = () => { const D = jget('day', {}) || {}; return Object.values(D).reduce((a, d) => a + Object.keys((d && d.m) || {}).filter(m => d.m[m]).length, 0); };
const misWeek = () => { const D = jget('day', {}) || {}, wk = weekKey(); return Object.keys(D).filter(k => weekKey(kOf(k)) === wk).reduce((a, k) => a + Object.keys(D[k].m || {}).filter(m => D[k].m[m]).length, 0); };
const jGift = () => Object.assign({ toys:{}, furn:{} }, (jget('jimon', {}) || {}).gift || {});
const jRoom = () => (jget('jimon', {}) || {}).room || {};
function jOwned() { const G = jGift(); return Object.keys(G.toys).concat(Object.keys(G.furn)); }
let JEDIT = false;
/* decorations inside the room scene (called from jimonRoomHTML) */
function jroomDecor() {
  const R = jRoom(), night = jroomNight();
  return jOwned().filter(k => JPOS[k] && (R[k] || {}).on !== false).map(k => { const p = R[k] || {}, x = p.x ?? JPOS[k][0], y = p.y ?? JPOS[k][1];
    return `${k === 'lampu_bulan' && night ? `<span class="jdec-glow" style="left:${x}%;top:${y}%"></span>` : ''}<img class="jdec ${k === 'karpet' ? 'floor' : ''}" data-dec="${k}" src="${JBB(k)}" alt="${JEDIT ? esc(JNAME[k]) : ''}" draggable="false" style="left:${x}%;top:${y}%;width:${JPOS[k][2]}%">`; }).join('');
}
function jroomNight() { return jbNight(); }
/* cards under the room (called from renderKamar) */
function jbKamarExtra() {
  const J = jget('jimon', {}) || {}, G = jGift(), night = jbNight(), tidur = jTidur(J), dirt = jimonDirt(), tot = misTotal(), wk = weekKey(), wm = misWeek();
  const nextFurn = JFURN.find(([k]) => !G.furn[k]), gotWeek = Object.values(G.furn).includes(wk), canGift = nextFurn && !gotWeek && wm >= 7;
  const owned = jOwned();
  return `${night && !tidur && !dirt ? `<button class="jcard jbnight" data-jbnight><img src="${JBP('piyama_duduk')}" alt="" width="70" height="82"><span><b>Ajak Jimon tidur</b><br><span class="jmut">Pakai piyama, berdoa, lalu tidur</span></span></button>` : ''}
  ${canGift ? `<button class="jcard jbgiftj" data-jbgiftj><img class="jwig" src="${JBP('beri_kado')}" alt="" width="64" height="88"><span><b>Jimon punya kado untukmu!</b><br><span class="jmut">Terima kasih sudah rajin pekan ini</span></span></button>` : ''}
  <section class="jcard" style="background:var(--jkidcard)"><div class="jrow sp"><h2>Hadiah untuk Jimon</h2><span class="jpill">${tot} misi</span></div>
    <div class="jbtoys">${JTOY.map(([k, n, need]) => { const got = G.toys[k], open = tot >= need;
      return `<div class="${got ? 'got' : open ? 'open' : 'lock'}"><img src="${JBB(k)}" alt="" loading="lazy"><b>${n}</b>${got ? '<small>Sudah diberikan</small>' : open ? jbtn('Berikan', 'data-jbtoy="' + k + '"', 'green') : `<small>${need - tot} misi lagi</small>`}</div>`; }).join('')}</div>
    <span class="jmut">Hadiah terbuka dari jumlah misi yang selesai. Jimon membalas dengan perabot kamar setiap pekan kamu menyelesaikan 7 misi.</span></section>
  ${owned.length ? `<section class="jcard" style="background:var(--jkidcard)"><div class="jrow sp"><h2>Tata kamar Jimon</h2>${jbtn(JEDIT ? 'Selesai menata' : 'Tata kamar', 'data-jbedit', JEDIT ? 'green' : 'ghost')}</div>
    ${JEDIT ? `<span class="jmut">Geser barang di kamar dengan jari. Ketuk nama barang untuk menyimpan atau mengeluarkannya.</span><div class="jtick">${owned.map(k => `<button class="jchip" data-jbshow="${k}" aria-pressed="${(jRoom()[k] || {}).on !== false}">${esc(JNAME[k])}</button>`).join('')}${jbtn('Kembalikan posisi', 'data-jbreset', 'ghost')}</div>`
      : `<span class="jmut">${owned.length} barang di kamar. Ketuk Tata kamar untuk memindahkannya.</span>`}</section>` : ''}`;
}
function jbSaveJ(fn) { const J = Object.assign({}, jget('jimon', {}) || {}); fn(J); jset('jimon', J); }
function jbNightFlow(step) {
  if (step === 1) { jbSheet(`<img class="jbs-pose jbreathe" src="${JBP('piyama_duduk')}" alt="Jimon memakai piyama"><h2>${esc(JBL.v_malam_malam)}</h2><p class="jmut">Jimon sudah memakai piyama bintangnya.</p>${jbtn('Lanjut', 'data-jbn="2"', 'block')}${jbtn('Nanti saja', 'data-jbx', 'ghost block')}`); return jbSay('v_malam_malam'); }
  if (step === 2) { $('#jbSheet .jbs').innerHTML = `<img class="jbs-pose" src="${JBP('piyama_tenang')}" alt="Jimon duduk tenang"><h2>Sebelum tidur, ayo berdoa dulu.</h2>
      <div class="jbdoa"><b>Doa sebelum tidur</b><p>Bismika Allahumma amutu wa ahya.</p></div><p class="jmut">Baca bersama Ayah atau Ibu, ya. Jimon mendengarkan.</p>${jbtn('Sudah berdoa', 'data-jbn="3"', 'block')}`;
    return jbSay('v_malam_doa'); }
  if (step === 3) { jbSaveJ(J => { J.tidur = true; J.piyama = todayK(); });
    $('#jbSheet .jbs').innerHTML = `<img class="jbs-pose jm-sleep" src="${JBP('piyama_tidur')}" alt="Jimon tidur"><h2>${esc(JBL.v_malam_tidur)}</h2><p class="jmut">${esc(JBL.v_malam_lampu)}</p>${jbtn('Selamat tidur, Jimon', 'data-jbx', 'navy block')}`;
    jvoice('v_malam_tidur', () => jvoice('v_malam_lampu')); jbuzz(20); if (document.body.dataset.view === 'saya') renderKamar(); }
}
function jbToyGive(k) {
  jbSaveJ(J => { const G = Object.assign({ toys:{}, furn:{} }, J.gift || {}); G.toys = Object.assign({}, G.toys, { [k]:todayK() }); J.gift = G; J.hap = Math.min(100, (J.hap ?? 70) + 10); });
  jbSheet(`<span class="jbs-gift"><img class="jbs-pose ka-hop" src="${JBP('buka_kado')}" alt="Jimon membuka kado"><img class="jbs-item" src="${JBB(k)}" alt=""></span><h2>Wah! ${esc(JNAME[k])} untukku? Terima kasih!</h2><p class="jmut">${esc(JNAME[k])} sekarang ada di kamar Jimon.</p>${jbtn('Sama-sama, Jimon!', 'data-jbx', 'gold block')}`);
  jbuzz([20, 40, 20]); jvoice('v_pendek_horee', () => jvoice('v_puji_rawat'));
  if (document.body.dataset.view === 'saya') renderKamar();
}
function jbGiftFromJimon(open) {
  const G = jGift(), nf = JFURN.find(([k]) => !G.furn[k]); if (!nf) return;
  if (!open) { jbSheet(`<img class="jbs-pose jwig" src="${JBP('beri_kado')}" alt="Jimon memberi kado"><h2>Ehem. Ini kado untukmu!</h2><p class="jmut">Karena kamu rajin menyelesaikan misi pekan ini.</p>${jbtn('Buka kado', 'data-jbgiftopen', 'gold block')}`); return jvoice('v_pendek_ehem'); }
  jbSaveJ(J => { const X = Object.assign({ toys:{}, furn:{} }, J.gift || {}); X.furn = Object.assign({}, X.furn, { [nf[0]]:weekKey() }); J.gift = X; });
  $('#jbSheet .jbs').innerHTML = `<img class="jbs-item big ka-hop" src="${JBB(nf[0])}" alt=""><h2>${esc(nf[1])} untuk kamar kita!</h2><p class="jmut">Kamu bisa menatanya di kamar Jimon. Ketuk Tata kamar.</p>${jbtn('Asyik!', 'data-jbx', 'gold block')}`;
  jbuzz([30, 50, 30]); jvoice('v_pendek_asyik');
  if (document.body.dataset.view === 'saya') renderKamar();
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-jbnight],[data-jbn],[data-jbtoy],[data-jbgiftj],[data-jbgiftopen],[data-jbedit],[data-jbshow],[data-jbreset]'); if (!t || t.disabled) return;
  const ds = t.dataset;
  if (ds.jbnight !== undefined) return jbNightFlow(1);
  if (ds.jbn) return jbNightFlow(Number(ds.jbn));
  if (ds.jbtoy) return jbToyGive(ds.jbtoy);
  if (ds.jbgiftj !== undefined) return jbGiftFromJimon(false);
  if (ds.jbgiftopen !== undefined) return jbGiftFromJimon(true);
  if (ds.jbedit !== undefined) { JEDIT = !JEDIT; jbuzz(8); renderKamar(); if (JEDIT) { const r = $('.jkamar'); if (r) r.scrollIntoView({ behavior:jbReduce() ? 'auto' : 'smooth', block:'start' }); } return; }
  if (ds.jbshow) { jbSaveJ(J => { const R = Object.assign({}, J.room || {}); const p = Object.assign({}, R[ds.jbshow] || {}); p.on = p.on === false; R[ds.jbshow] = p; J.room = R; }); return renderKamar(); }
  if (ds.jbreset !== undefined) { jbSaveJ(J => { const R = {}; Object.keys(J.room || {}).forEach(k => { if ((J.room[k] || {}).on === false) R[k] = { on:false }; }); J.room = R; }); return renderKamar(); }
});
addEventListener('hashchange', () => { if (!location.hash.startsWith('#saya')) JEDIT = false; });
/* drag decorations while decorating */
let JDRAG = null;
document.addEventListener('pointerdown', e => {
  if (!JEDIT) return; const im = e.target.closest('.jkamar .jdec'); if (!im) return;
  e.preventDefault(); const R = im.closest('.jkamar').getBoundingClientRect(); JDRAG = { im, R, k:im.dataset.dec }; im.classList.add('drag'); try { im.setPointerCapture(e.pointerId); } catch (x) {}
});
document.addEventListener('pointermove', e => {
  if (!JDRAG) return; const { im, R } = JDRAG;
  JDRAG.x = Math.max(4, Math.min(96, (e.clientX - R.left) / R.width * 100)); JDRAG.y = Math.max(8, Math.min(97, (e.clientY - R.top) / R.height * 100));
  im.style.left = JDRAG.x + '%'; im.style.top = JDRAG.y + '%';
});
document.addEventListener('pointerup', () => {
  if (!JDRAG) return; const { im, k, x, y } = JDRAG; im.classList.remove('drag'); JDRAG = null;
  if (x === undefined) return; jbuzz(8);
  jbSaveJ(J => { const R = Object.assign({}, J.room || {}); R[k] = Object.assign({}, R[k] || {}, { x:Math.round(x * 10) / 10, y:Math.round(y * 10) / 10 }); J.room = R; });
});

/* ---------------- Ngobrol: one question a day, remembered on this phone only ---------------- */
const JINGAT = [['makan', 'Makanan apa yang paling kamu suka?'], ['warna', 'Warna favoritmu apa?'], ['cita', 'Kalau sudah besar, kamu ingin jadi apa?'],
  ['hewan', 'Hewan apa yang kamu suka selain kucing?'], ['teman', 'Siapa teman baikmu?'], ['pelajaran', 'Pelajaran apa yang paling kamu suka?']];
const jbIngat = () => store.get('_ingat:' + CUR, {}) || {};
/* the question for today, or null (asked once a day; at night: what made you happy, not kept) */
function jbQuestion() {
  const M = jbIngat(), tk = todayK(); if (M.d === tk) return null;
  if (slotNow(new Date()) === 'isya') return ['senang', 'Apa yang membuatmu senang hari ini?'];
  return JINGAT.find(([k]) => !M[k]) || null;
}
function jbAsked() { const M = jbIngat(); M.d = todayK(); store.set('_ingat:' + CUR, M); }
/* answer to Jimon's question → reply text. Short and plain words only; anything personal was caught before this */
function jbRemember(k, txt) {
  const a = txt.trim().replace(/^(aku|saya)\s+(suka|ingin jadi|mau jadi|ingin|mau)\s+/i, '').replace(/^(suka|jadi)\s+/i, '').replace(/[.!?]+$/, '').slice(0, 30);
  if (!a || a.split(/\s+/).length > 5) return 'Wah, seru! Nanti cerita lagi, ya.';
  if (k === 'senang') return 'Alhamdulillah! Aku ikut senang mendengarnya.';
  const M = jbIngat(); M[k] = a; store.set('_ingat:' + CUR, M);
  return ({ makan:'Hmm, ' + a + ' pasti enak! Aku akan ingat.', warna:a + '? Warna yang cantik! Aku akan ingat.', cita:'MasyaAllah, calon ' + a + '! Aku akan mendukungmu.',
    hewan:a + ' lucu sekali! Aku akan ingat.', teman:'Wah, ' + a + ' pasti teman yang baik. Sampaikan salamku, ya!', pelajaran:a + '? Keren! Nanti kita belajar bersama.' })[k];
}

/* clips used on almost every screen stay loaded */
jpreload(['v_puji_misi', 'v_puji_lentera', 'v_pendek_hihi', 'v_pendek_wah', 'v_pendek_eh', 'v_pendek_hmm', 'dengkur']);
