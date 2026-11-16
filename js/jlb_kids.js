/* =========================================================
   JLB kids (6-12): Beranda, Misi, Peti Jumat, cat room, parents' corner
   ========================================================= */
const MISSIONS = {
  doa_bangun:{ n:'Doa bangun tidur', ic:'doa_bangun' }, sikat:{ n:'Sikat gigi pagi dan malam', ic:'sikat_gigi' }, minum:{ n:'Minum air 6 gelas', ic:'minum' },
  rapikan:{ n:'Rapikan tempat tidur', ic:'rapikan' }, bantu:{ n:'Bantu pekerjaan rumah', ic:'bantu_rumah' }, baca:{ n:'Membaca atau Iqro 1 halaman', ic:'baca' },
  baik:{ n:'Berbuat baik kepada saudara', ic:'berbuat_baik' }, jalan:{ n:'Main di luar 20 menit', ic:'jalan' }, tidur:{ n:'Tidur tepat waktu', ic:'tidur' },
  telepon:{ n:'Telepon kakek atau nenek', ic:'telepon' }
};
const ortu = id => Object.assign({ cap:240, chat:true, limit:10, missions:Object.keys(MISSIONS).filter(m => m !== 'telepon'), marks:{} }, pget(id || CUR, 'jlb:ortu', {}) || {});
const BADGES_K = [
  ['subuh7', 'Subuh 7 hari', 'emas', 'sholat'], ['lengkap7', 'Sholat lengkap 7 hari', 'emas', 'sunnah'], ['doabangun', 'Doa bangun 14 kali', 'perak', 'doa_bangun'],
  ['pembantu', 'Pembantu hebat', 'perunggu', 'bantu_rumah'], ['iqro', 'Iqro 10 hari', 'perak', 'baca'], ['fatihah', 'Hafal Al-Fatihah', 'perak', 'tilawah'],
  ['puasa', 'Puasa pertama', 'emas', 'puasa'], ['roda', 'Roda Ilmu 10x', 'perunggu', 'roda'], ['unit', 'Unit pertama', 'perunggu', 'ilmu'],
  ['ninja', 'Ninja 10 sesi', 'perunggu', 'ninja'], ['bersih', 'Jimon bersih 30 hari', 'perak', 'wudhu'], ['ramadan', 'Ramadan penuh', 'emas', 'puasa']
];
function badgesGot(id) {
  id = id || CUR; const days = pget(id, 'jlb:day', {}), O = ortu(id), learn = pget(id, 'jlb:learn', {}), roda = pget(id, 'jlb:roda', {}), log = pget(id, 'log', []);
  const run = test => { let best = 0, cur = 0; for (let i = 120; i >= 0; i--) { const d = days[dkey(jAdd(new Date(), -i))]; if (d && test(d)) { cur++; best = Math.max(best, cur); } else cur = 0; } return best; };
  const cnt = m => Object.values(days).filter(d => (d.m || {})[m]).length;
  const lit = d => PR.some(p => d.s && d.s[p] && d.s[p].f);
  const puasa = Object.values(pget(id, 'puasa', {}) || {}).some(x => x && (x.s === 'y' || x.s === 'half'));
  return new Set([
    run(d => d.s && d.s.subuh && d.s.subuh.f) >= 7 && 'subuh7', run(d => PR.every(p => d.s && d.s[p] && d.s[p].f)) >= 7 && 'lengkap7',
    cnt('doa_bangun') >= 14 && 'doabangun', cnt('bantu') >= 20 && 'pembantu', cnt('baca') >= 10 && 'iqro', O.marks.fatihah && 'fatihah',
    (O.marks.puasa || puasa) && 'puasa', Object.values(roda).filter(x => x && x.ok).length >= 10 && 'roda', Object.keys(learn).some(k => /-6$/.test(k) && learn[k].done) && 'unit',
    log.length >= 10 && 'ninja', run(lit) >= 30 && 'bersih', O.marks.ramadan && 'ramadan'
  ].filter(Boolean));
}
const JWORD = { 0:'', 1:'Kemarin kita tidak bertemu, aku jadi berdebu.', 2:'Aku kangen kamu… bulu-buluku jadi kusam.' };

/* ---------------- Beranda anak ---------------- */
function renderKidHome() {
  if (!jget('jimon', {}).since) jset('jimon', Object.assign({}, jget('jimon', {}), { since:todayK() }));
  const now = new Date(), tk = todayK(), d = dayOf(tk), P = prayerNow(now), J = jget('jimon', {}), dirt = jimonDirt(), pt = petiState();
  const lit = PR.filter(p => d.s && d.s[p] && d.s[p].f).length;
  const lan = PR.map((p, i) => { const on = d.s && d.s[p] && d.s[p].f, lock = P.cur >= 0 && i > P.cur, cur = i === (P.cur < 0 ? 4 : P.cur);
    return `<button data-klan="${p}" class="${on ? 'lit' : ''} ${lock ? 'lock' : ''}" ${lock ? 'disabled' : ''} aria-pressed="${!!on}" aria-label="Lentera ${PRN[p]} ${on ? 'menyala' : lock ? 'belum waktunya' : 'belum menyala'}">
      <img src="${jimg('anak/lantern_' + (on ? 'lit' : cur ? 'wait' : 'off') + '.webp')}" alt="" width="44" height="58">${PRN[p]}<small class="jmut">${hm(P.t[p])}</small></button>`; }).join('');
  const face = dirt ? null : lit >= 5 ? 'tertawa' : lit ? 'senang' : 'dengar';
  const fri = now.getDay() === 5;
  $('#v-taman').innerHTML = `<div class="jw jkidw">
  <section class="jhero" style="min-height:330px;justify-content:flex-start"><img class="bg" src="${jimg('langit/sky_' + skyNow(now) + '.webp')}" alt="" fetchpriority="high">
    <div class="jrow" style="justify-content:space-between"><span class="jpill">${pt.bal} XP</span><span class="jpill">Level ${levelOf(xpTotal()).l}</span></div>
    <h1 style="margin-top:10px">Halo, ${esc(PROF.name)}!</h1><span style="opacity:.9">${hijriTxt(hijri(now))}</span>
    <a href="#saya" style="position:absolute;left:50%;bottom:0;transform:translateX(-50%)" aria-label="Ke kamar Jimon">${dirt ? `<img src="${jimg('jimon/keadaan/j_debu.webp')}" alt="Jimon berdebu" width="170" height="165">` : jimonHTML({ face, wear:J.wear, w:160, blink:true, cls:'jbreathe' })}</a>
    ${dirt ? `<span style="position:absolute;left:12px;bottom:120px;max-width:150px;background:#fff;color:#0F1D3D;border-radius:16px;padding:8px 10px;font-size:.85rem">${JWORD[Math.min(2, dirt)]}</span>` : ''}</section>
  <section class="jcard" style="background:var(--jkidcard)"><div class="jrow sp"><h2>Lentera sholat</h2><span class="jpill">${lit} dari 5</span></div><div class="jlant">${lan}</div>
    <span class="jmut">Nyalakan lentera setelah sholat. Setiap lentera +10 XP.</span></section>
  <div class="jgrid2">
    <a class="jcard" href="#amal" style="text-decoration:none;color:inherit;background:var(--jkidcard)">${jicon('rapikan')}<b>Misi hari ini</b><span class="jmut">${Object.keys(d.m || {}).length} selesai</span></a>
    <a class="jcard" href="#belajar" style="text-decoration:none;color:inherit;background:var(--jkidcard)">${jicon('ilmu')}<b>Belajar Seru</b><span class="jmut">Lanjutkan petualangan</span></a>
    <a class="jcard" href="#home" style="text-decoration:none;color:inherit;background:var(--jkidcard)">${jicon('ninja')}<b>Jurus Ninja</b><span class="jmut">+10 XP tiap sesi</span></a>
    <a class="jcard" href="#jimon" style="text-decoration:none;color:inherit;background:var(--jkidcard)">${jicon('telepon')}<b>Ngobrol dengan Jimon</b><span class="jmut">Jimon menunggumu</span></a></div>
  <a class="jcard" href="#peti" style="text-decoration:none;color:inherit;flex-direction:row;align-items:center;background:var(--jkidcard)"><img src="${jimg('anak/star_jar.webp')}" alt="" width="70" height="70"><span><h2>Toples bintang: ${pt.bal} XP</h2><span class="jmut">${fri ? 'Hari ini Jumat! Peti Jumat terbuka.' : 'Tukar jadi waktu main di Peti Jumat'}</span></span></a>
  </div>`;
}

/* ---------------- Misi (papan stiker) ---------------- */
function renderMisi() {
  const d = dayOf(todayK()), list = ortu().missions.filter(m => MISSIONS[m]);
  const n = list.filter(m => (d.m || {})[m]).length;
  $('#v-amal').innerHTML = `<div class="jw jkidw"><div class="jrow sp" style="padding-top:8px"><h1>Misi hari ini</h1><span class="jpill">${n} dari ${list.length}</span></div>
    <div class="jbar"><i style="width:${list.length ? n / list.length * 100 : 0}%"></i></div>
    <div class="jstk">${list.map(m => { const on = !!(d.m || {})[m]; return `<button data-kmis="${m}" aria-pressed="${on}"><img src="${jimg('ikon/' + MISSIONS[m].ic + '.webp')}" alt="" width="54" height="54" loading="lazy">${esc(MISSIONS[m].n)}</button>`; }).join('')}</div>
    <p class="jmut">Setiap misi +5 XP. Selesaikan 1 misi untuk bisa memandikan Jimon.</p></div>`;
}

/* ---------------- Kamar Jimon (Saya anak) ---------------- */
let KPET = 0, KBATH = false, KPOP = null;
function renderKamar() {
  if (!jget('jimon', {}).since) jset('jimon', Object.assign({}, jget('jimon', {}), { since:todayK() }));
  const J = jget('jimon', {}), dirt = KBATH ? 0 : jimonDirt(), xp = xpTotal(), L = levelOf(xp), got = badgesGot(), d = dayOf(todayK()), missDone = Object.keys(d.m || {}).length > 0;
  const wear = J.wear || '', tidur = wear === 'tidur';
  let cat;
  if (KBATH) cat = `<img src="${jimg('jimon/keadaan/j_mandi.webp')}" alt="Jimon mandi busa" width="172" height="214" class="jwig">`;
  else if (dirt) cat = `<img src="${jimg('jimon/keadaan/j_debu.webp')}" alt="Jimon berdebu" width="200" height="194">`;
  else if (tidur) cat = `<img src="${jimg('jimon/keadaan/j_tidur.webp')}" alt="Jimon tidur" width="200" height="141">`;
  else cat = jimonHTML({ face:KPET % 2 ? 'dengkur' : 'senang', wear, w:185, blink:!(KPET % 2), cls:'jbreathe' });
  const acc = Object.keys(JACC).map(k => { const A = JACC[k], lock = L.l < A.lv, on = wear === k;
    return `<button data-kwear="${k}" aria-pressed="${on}" ${lock ? 'disabled' : ''}><img src="${jimg('jimon/hiasan/a_' + k + '.webp')}" alt="" loading="lazy">${A.n}<small>${on ? 'dipakai' : lock ? 'Level ' + A.lv : 'terbuka'}</small></button>`; }).join('');
  $('#v-saya').innerHTML = `<div class="jw jkidw">
  <section class="jroom"><div class="floor"></div><div class="win"></div><div class="shelf"></div>
    <img src="${jimg('anak/star_jar.webp')}" alt="" style="position:absolute;right:30px;top:52px;height:60px" width="60" height="60">
    <div style="position:absolute;top:10px;right:14px;text-align:right"><b style="font-size:1.2rem">Jimon</b><br><span class="jpill">Level ${L.l}</span></div>
    ${dirt && !KBATH ? `<span style="position:absolute;left:12px;top:160px;max-width:150px;background:#fff;color:#0F1D3D;border-radius:16px;padding:8px 10px;font-size:.85rem">${JWORD[Math.min(2, dirt)]}</span>` : ''}
    <button class="cat" data-kpet aria-label="Elus Jimon">${cat}</button>
    ${KPET % 2 && !dirt ? '<span class="jheart" style="left:52%;bottom:200px">♥</span><span class="jheart" style="left:40%;bottom:180px;animation-delay:.3s">♥</span>' : ''}
    ${KBATH ? [10, 25, 40, 55, 70, 85].map((x, i) => `<span class="jbub" style="left:${x}%;bottom:${40 + i % 3 * 30}px;width:${16 + i % 3 * 8}px;height:${16 + i % 3 * 8}px;animation-delay:${i * .15}s"></span>`).join('') : ''}</section>
  ${dirt && !KBATH ? `<section class="jcard" style="background:#FFF4D6;color:#3D2C00"><b>${dirt >= 2 ? 'Jimon berdebu sekali' : 'Jimon sedikit berdebu'}</b><span>Selesaikan 1 misi hari ini, lalu mandikan Jimon supaya bersih dan wangi lagi.</span>
    <div class="jrow"><a class="jb ghost" href="#amal" style="flex:1">Ke Misi</a>${jbtn('Mandikan Jimon', 'data-kbath ' + (missDone ? '' : 'disabled'), 'block')}</div>${missDone ? '' : '<span class="jmut" style="color:#6B4A00">Tombol mandi aktif setelah 1 misi selesai.</span>'}</section>` : ''}
  <section class="jcard" style="background:var(--jkidcard)"><div class="jrow sp"><h2>Level ${L.l}</h2><span class="jpill">${xp} XP</span></div><div class="jbar"><i style="width:${L.pct}%"></i></div>
    <span class="jmut">${L.next ? (L.next - xp) + ' XP lagi ke Level ' + (L.l + 1) : 'Level tertinggi. MasyaAllah!'}</span><span class="jmut" style="font-size:.78rem">Level dihitung dari semua XP yang pernah didapat. Menukar waktu main tidak menurunkan level.</span></section>
  <section class="jcard" style="background:var(--jkidcard)"><div class="jrow sp"><h2>Hiasan Jimon</h2><button class="jchip" data-kwear="tidur" aria-pressed="${tidur}">Tidur</button></div><div class="jacc">${acc}</div>
    <span class="jmut">Hiasan yang dipakai ikut terlihat saat ngobrol dengan Jimon.</span></section>
  <a class="jb gold block" href="#jimon">Ngobrol dengan Jimon</a>
  <section class="jcard" style="background:var(--jkidcard)"><div class="jrow sp"><h2>Rak lencanaku</h2><span class="jmut">${got.size} dari ${BADGES_K.length}</span></div>
    <div class="jgrid4">${BADGES_K.map(([k, n, m, ic]) => { const g = got.has(k); return `<div style="text-align:center;opacity:${g ? 1 : .4};filter:${g ? 'none' : 'grayscale(1)'}"><span style="position:relative;display:inline-block;width:56px;height:70px"><img src="${jimg('anak/medali_' + m + '.webp')}" alt="" width="56" height="70" loading="lazy"><img src="${jimg('ikon/' + ic + '.webp')}" alt="" style="position:absolute;left:13px;top:11px;width:30px;height:30px;border-radius:50%" loading="lazy"></span><small style="display:block;font-size:.7rem;line-height:1.2">${n}</small></div>`; }).join('')}</div></section>
  <a class="jcard" href="#perjalanan" style="text-decoration:none;color:#3D2C00;background:var(--jy)"><b>Perjalananku ke langit</b><span>Sekarang: ${STOPS_KID_NAME()}</span></a>
  ${ageKid() ? '<a href="#ortu" class="jmut" style="text-align:center;padding:12px">Untuk Ayah dan Ibu (PIN)</a>' : modeCard()}
  </div>${KPOP ? `<div class="jsheet" data-kpop><div role="dialog" aria-modal="true" style="align-items:center;text-align:center"><span class="jmut" style="font-weight:800;letter-spacing:.06em">NAIK LEVEL!</span><h1>Level ${L.l}</h1>
    <img src="${jimg('jimon/hiasan/a_' + KPOP + '.webp')}" alt="" height="120" style="height:120px;width:auto" class="jwig"><p>Hiasan baru terbuka: <b>${JACC[KPOP].n}</b></p>${jbtn('Pakaikan ke Jimon', 'data-kwear="' + KPOP + '"', 'block')}${jbtn('Nanti saja', 'data-kpop', 'ghost block')}</div></div>` : ''}`;
}
const STOPS_KID_NAME = () => { const n = ['Yaqazah', 'Taubah', 'Muhasabah', 'Istiqamah', 'Ikhlas', 'Sabar', 'Syukur', 'Tawakkal', 'Muraqabah', 'Mahabbah', 'Ridha']; return n[(jget('jalan', {}).stop) || 0]; };
function checkLevelUp() {   // show the level-up sheet once per new level
  const L = levelOf(xpTotal()).l, J = jget('jimon', {});
  if ((J.seenLv || 1) < L) { const k = Object.keys(JACC).find(x => JACC[x].lv === L); jset('jimon', Object.assign({}, J, { seenLv:L })); if (k) { KPOP = k; } }
}

/* ---------------- Peti Jumat ---------------- */
function renderPeti() {
  const S = petiState(), fri = new Date().getDay() === 5, pend = Object.entries(S.reqs).filter(([, r]) => r && r.st === 'req');
  const can = Math.min(S.bal, S.left), opts = [10, 20, 30, 60, 90].filter(m => m <= can);
  $('#v-peti').innerHTML = `<div class="jw jkidw"><div class="jrow" style="padding-top:8px">${back('#taman')}<h1>Peti Jumat</h1></div>
    <section class="jcard" style="align-items:center;text-align:center;background:var(--jkidcard)"><img src="${jimg('anak/chest.webp')}" alt="" width="120" height="120"><h2>${S.bal} XP di toples</h2>
      <span class="jmut">10 XP = 10 menit main · Sisa pekan ini ${S.left} menit dari ${S.cap}</span></section>
    ${fri ? `<section class="jcard" style="background:var(--jkidcard)"><h2>Tukar jadi waktu main</h2>${opts.length ? `<div class="jtick">${opts.map(m => jbtn(m + ' menit', 'data-kpeti="' + m + '"', 'gold')).join('')}</div><span class="jmut">Ayah atau Ibu akan menyetujui.</span>` : '<p class="jmut">XP atau sisa waktu pekan ini belum cukup.</p>'}</section>`
      : `<section class="jcard" style="background:var(--jkidcard)"><p>Peti dibuka setiap hari <b>Jumat</b>. Kumpulkan XP dulu ya!</p></section>`}
    ${pend.map(([, r]) => `<section class="jcard" style="background:#FFF4D6;color:#3D2C00">Menunggu persetujuan: ${r.min} menit</section>`).join('')}
    <a class="jcard" href="#keluarga" style="text-decoration:none;color:inherit;background:var(--jkidcard)"><b>Lihat Rekap Keluarga pekan ini</b></a></div>`;
}

/* ---------------- Untuk Ayah dan Ibu ---------------- */
let OUNLOCK = false;
async function ortuHash(pin) { return pinHash('ortu:' + CUR, pin); }
function renderOrtu() {
  const O = ortu(), S = petiState(), el = $('#v-ortu');
  if (!OUNLOCK) {
    el.innerHTML = `<div class="jw"><div class="jrow" style="padding-top:8px">${back('#saya')}<h1>Untuk Ayah dan Ibu</h1></div>
      <section class="jcard"><label for="oPin"><b>${O.pin ? 'Masukkan PIN orang tua' : 'Buat PIN orang tua (4 angka)'}</b></label><input id="oPin" class="inp" type="password" inputmode="numeric" maxlength="4" autocomplete="off">
      <p id="oErr" class="jmut" role="alert"></p>${jbtn('Buka', 'data-oopen', 'navy block')}<span class="jmut">Lupa PIN? Hapus lewat kode keluarga di pengaturan profil.</span></section></div>`;
    return;
  }
  const pend = Object.entries(S.reqs).filter(([, r]) => r && r.st === 'req'), chat = jget('chat', []).slice(-20).reverse();
  el.innerHTML = `<div class="jw"><div class="jrow sp" style="padding-top:8px">${back('#saya')}<h1>Untuk Ayah dan Ibu</h1>${jbtn('Kunci', 'data-olock', 'ghost')}</div>
    <section class="jcard"><h2>Permintaan waktu main</h2>${pend.length ? pend.map(([k, r]) => `<div class="jrow sp"><span>${r.min} menit · ${niceDate(new Date(r.at))}</span><span class="jrow">${jbtn('Setujui', 'data-oreq="' + k + ':ok"', 'green')}${jbtn('Tolak', 'data-oreq="' + k + ':no"', 'ghost')}</span></div>`).join('') : '<p class="jmut">Tidak ada permintaan.</p>'}
      <span class="jmut">Sisa pekan ini ${S.left} dari ${S.cap} menit. Saldo ${S.bal} XP.</span></section>
    <section class="jcard"><h2>Tampilan</h2><div class="jtick">${[['anak', 'Anak'], ['dewasa', 'Dewasa']].map(([v, t]) => `<button class="jchip" data-omode="${v}" aria-pressed="${(v === 'anak') === isKidP()}">${t}</button>`).join('')}</div><span class="jmut">Hanya Ayah atau Ibu yang bisa mengganti tampilan anak di bawah 13 tahun.</span></section>
    <section class="jcard"><h2>Batas waktu main per pekan</h2><div class="jtick">${[120, 180, 240, 300, 360].map(m => `<button class="jchip" data-ocap="${m}" aria-pressed="${O.cap === m}">${m / 60} jam</button>`).join('')}</div></section>
    <section class="jcard"><h2>Misi harian</h2>${Object.keys(MISSIONS).map(m => `<label class="jrow sp"><span>${MISSIONS[m].n}</span><input type="checkbox" data-omis="${m}" ${O.missions.includes(m) ? 'checked' : ''} style="width:24px;height:24px"></label>`).join('')}</section>
    <section class="jcard"><h2>Tandai pencapaian</h2>${[['fatihah', 'Sudah hafal Al-Fatihah'], ['puasa', 'Puasa pertama'], ['ramadan', 'Ramadan penuh (sesuai kemampuan)']].map(([k, t]) => `<label class="jrow sp"><span>${t}</span><input type="checkbox" data-omark="${k}" ${O.marks[k] ? 'checked' : ''} style="width:24px;height:24px"></label>`).join('')}</section>
    <section class="jcard"><h2>Jimon</h2><label class="jrow sp"><span>Boleh ngobrol dengan Jimon</span><input type="checkbox" data-ochat ${O.chat ? 'checked' : ''} style="width:24px;height:24px"></label>
      <span class="jmut">Jimon Pintar bekerja tanpa internet dan hanya menjawab dari isi yang sudah diperiksa ustadz. Batas ${O.limit} pesan per hari. Mengelus Jimon tidak memberi XP.</span>
      <b>Obrolan terakhir</b>${chat.length ? chat.map(c => `<p class="jmut">${c.me ? 'Anak' : 'Jimon'}: ${esc(c.t)}</p>`).join('') : '<p class="jmut">Belum ada obrolan.</p>'}</section></div>`;
}
const setOrtu = patch => { const O = Object.assign({}, pget(CUR, 'jlb:ortu', {}) || {}, patch); jset('ortu', O); };

/* ---------------- events ---------------- */
document.addEventListener('click', async e => {
  const t = e.target.closest('[data-klan],[data-kmis],[data-kpet],[data-kbath],[data-kwear],[data-kpop],[data-kpeti],[data-oopen],[data-olock],[data-oreq],[data-ocap],[data-omode]');
  if (!t || t.disabled) return;
  const ds = t.dataset, tk = todayK();
  if (ds.klan) { dayPut(tk, d => { d.s = d.s || {}; const s = Object.assign({}, d.s[ds.klan] || {}); s.f = s.f ? 0 : 1; d.s[ds.klan] = s; });
    if (dayOf(tk).s[ds.klan].f) { jtoast('Lentera ' + PRN[ds.klan] + ' menyala! +10 XP'); checkLevelUp(); } return renderKidHome(); }
  if (ds.kmis) { dayPut(tk, d => { d.m = Object.assign({}, d.m || {}); if (d.m[ds.kmis]) delete d.m[ds.kmis]; else d.m[ds.kmis] = 1; });
    if ((dayOf(tk).m || {})[ds.kmis]) { jtoast('Misi selesai! +5 XP'); checkLevelUp(); } return renderMisi(); }
  if (ds.kpet !== undefined) { if (jimonDirt() || KBATH) return; KPET++; renderKamar(); clearTimeout(window._kp); window._kp = setTimeout(() => { if (KPET % 2) { KPET++; if (document.body.dataset.view === 'saya') renderKamar(); } }, 1700); return; }
  if (ds.kbath !== undefined) { KBATH = true; renderKamar(); setTimeout(() => { KBATH = false; jset('jimon', Object.assign({}, jget('jimon', {}), { bath:tk })); jtoast('Wah, wangi! Terima kasih sudah merawatku.'); if (document.body.dataset.view === 'saya') renderKamar(); }, 1800); return; }
  if (ds.kwear) { const J = jget('jimon', {}); jset('jimon', Object.assign({}, J, { wear:J.wear === ds.kwear ? '' : ds.kwear })); KPOP = null; return renderKamar(); }
  if (ds.kpop !== undefined && (e.target === t || t.tagName === 'BUTTON')) { KPOP = null; return renderKamar(); }
  if (ds.kpeti) { const R = jget('peti', {}); R['r' + Date.now()] = { wk:weekKey(), min:Number(ds.kpeti), st:'req', at:Date.now() }; jset('peti', R); jtoast('Permintaan dikirim ke Ayah atau Ibu'); return renderPeti(); }
  if (ds.oopen !== undefined) { const pin = ($('#oPin').value || '').trim(), O = ortu(); if (!/^\d{4}$/.test(pin)) { $('#oErr').textContent = 'PIN harus 4 angka.'; return; }
    const h = await ortuHash(pin); if (!O.pin) { setOrtu({ pin:h }); OUNLOCK = true; } else if (h === O.pin) OUNLOCK = true; else { $('#oErr').textContent = 'PIN salah.'; return; } return renderOrtu(); }
  if (ds.olock !== undefined) { OUNLOCK = false; return renderOrtu(); }
  if (ds.oreq) { const [k, st] = ds.oreq.split(':'), R = jget('peti', {}); if (R[k]) { R[k] = Object.assign({}, R[k], { st, at:Date.now() }); jset('peti', R); } return renderOrtu(); }
  if (ds.ocap) { setOrtu({ cap:Number(ds.ocap) }); return renderOrtu(); }
  if (ds.omode && OUNLOCK) { OUNLOCK = false; return setMode(CUR, ds.omode); }
});
document.addEventListener('change', e => {
  const t = e.target; if (!OUNLOCK) return;
  if (t.dataset.omis) { const O = ortu(); setOrtu({ missions:t.checked ? O.missions.concat(t.dataset.omis) : O.missions.filter(m => m !== t.dataset.omis) }); }
  else if (t.dataset.omark) { const O = ortu(); setOrtu({ marks:Object.assign({}, O.marks, { [t.dataset.omark]:t.checked }) }); }
  else if (t.dataset.ochat !== undefined) setOrtu({ chat:t.checked });
});
addEventListener('hashchange', () => { if (!location.hash.startsWith('#ortu')) OUNLOCK = false; });
