/* =========================================================
   JLB kids (6-12): Beranda, Misi, Peti Jumat, cat room, parents' corner
   ========================================================= */
/* p = kelompok, t = waktu (SLOTS), h = catatan untuk orang tua, auto = tercentang sendiri dari Gerak/Belajar.
   Ibadah missions are Islamic content: wording reviewed by the ustadz (Lembar Periksa bagian 12). */
const MISSIONS = {
  dzikir_pagi:{ n:'Dzikir pagi bersama Ayah/Ibu', ic:'dzikir', p:'ibadah', t:'subuh', h:'Dibaca bersama setelah Subuh. Mulai dengan Radhitu billahi rabba, wabil islami dina, wabi Muhammadin nabiyya. Bila sudah lancar, tambah Al-Ikhlas, Al-Falaq, dan An-Nas, masing-masing 3 kali.' },
  dhuha:{ n:'Sholat Dhuha 2 rakaat', ic:'dhuha', p:'ibadah', t:'pagi', h:'Setelah matahari naik sampai sebelum Dzuhur. Di hari sekolah bisa saat istirahat.' },
  sedekah:{ n:'Sedekah atau berbagi', ic:'sedekah', p:'ibadah', t:'siang', h:'Uang, makanan, mainan, atau senyuman kepada orang lain. Senyum kepada saudara juga sedekah (HR. Tirmidzi).' },
  hafalan:{ n:'Hafalan 1 ayat', ic:'surat_harian', fb:'tilawah', p:'ibadah', t:'maghrib', h:'Menghafal atau mengulang 1 ayat bersama Ayah atau Ibu.' },
  wudhu_tidur:{ n:'Wudhu dan doa sebelum tidur', ic:'wudhu', p:'ibadah', t:'isya', h:'Tidur dalam keadaan suci, lalu membaca doa sebelum tidur.' },
  istighfar:{ n:'Istighfar sebelum tidur', ic:'istighfar', p:'ibadah', t:'isya', h:'Membaca Astaghfirullah beberapa kali sebelum tidur.' },
  puasa:{ n:'Belajar puasa', ic:'belajar_puasa', fb:'puasa', p:'ibadah', t:'subuh', h:'Hanya muncul di hari puasa sunnah. Boleh setengah hari.' },
  baca:{ n:'Membaca atau Iqro 1 halaman', ic:'baca', p:'ilmu', t:'maghrib' },
  pr:{ n:'Kerjakan PR tepat waktu', ic:'belajar', p:'ilmu', t:'sore' },
  belajar:{ n:'Belajar Seru 1 langkah', ic:'ilmu', p:'ilmu', t:'sore', auto:'#belajar', h:'Tercentang sendiri setelah anak menyelesaikan 1 langkah atau ujian di Belajar Seru.' },
  kisah:{ n:'Dengar kisah Nabi', ic:'kajian', p:'ilmu', t:'isya' },
  buku:{ n:'Baca buku cerita 10 menit', ic:'cerita_anak', p:'ilmu', t:'isya' },
  rapikan:{ n:'Rapikan tempat tidur', ic:'rapikan', p:'akhlak', t:'subuh' },
  baik:{ n:'Berbuat baik kepada saudara', ic:'berbuat_baik', p:'akhlak', t:'siang' },
  santun:{ n:'Tidak berkata kasar hari ini', ic:'muhasabah', p:'akhlak', t:'siang' },
  salam:{ n:'Ucapkan salam saat masuk rumah', ic:'peluk_keluarga', p:'akhlak', t:'siang' },
  bantu:{ n:'Bantu pekerjaan rumah', ic:'bantu_rumah', p:'akhlak', t:'sore' },
  telepon:{ n:'Telepon kakek atau nenek', ic:'telepon', p:'akhlak', t:'sore' },
  makan_hp:{ n:'Makan bersama tanpa HP', ic:'makan_bersama', fb:'tanpa_hp', p:'akhlak', t:'maghrib' },
  peluk:{ n:'Peluk Ayah dan Ibu', ic:'ngobrol_pasangan', fb:'berbuat_baik', p:'akhlak', t:'isya' },
  doa_bangun:{ n:'Doa bangun tidur', ic:'doa_bangun', p:'jasad', t:'subuh' },
  sikat:{ n:'Sikat gigi pagi dan malam', ic:'sikat_gigi', p:'jasad', t:'subuh' },
  sarapan:{ n:'Sarapan sehat', ic:'sarapan', p:'jasad', t:'pagi' },
  minum:{ n:'Minum air 6 gelas', ic:'minum', p:'jasad', t:'siang' },
  gerak:{ n:'Gerak bersama Jimon', ic:'ninja', p:'jasad', t:'sore', auto:'#home', h:'Tercentang sendiri setelah anak menyelesaikan 1 sesi Gerak bersama Jimon.' },
  jalan:{ n:'Main di luar 20 menit', ic:'jalan', p:'jasad', t:'sore' },
  tidur:{ n:'Tidur tepat waktu', ic:'tidur', p:'jasad', t:'isya' }
};
const KPIL = [['ibadah', 'Ibadah'], ['ilmu', 'Ilmu'], ['akhlak', 'Akhlak'], ['jasad', 'Jasad'], ['own', 'Misi keluarga']];
const KSLOT = { subuh:'Bangun pagi', pagi:'Pagi', siang:'Siang', sore:'Sore', maghrib:'Maghrib', isya:'Sebelum tidur' };
const KSLOT_K = Object.keys(KSLOT);
const KDEF_MIS = ['doa_bangun', 'sikat', 'minum', 'rapikan', 'bantu', 'baca', 'baik', 'jalan', 'tidur'];   // the 9 on before jlb8; new ones start off
const ortu = id => Object.assign({ cap:240, chat:true, limit:10, missions:KDEF_MIS.slice(), marks:{}, own:[] }, pget(id || CUR, 'jlb:ortu', {}) || {});
/* A mission by id: built-in, or one the family added in Ruang Orang Tua */
const kmDef = (id, O) => MISSIONS[id] || (() => { const x = ((O || ortu()).own || []).find(o => o.id === id); return x ? { n:x.n, ic:null, p:'own', t:x.t || 'sore', own:1 } : null; })();
const kmIcon = (m, sz = 54) => m.ic ? `<img src="${jimg('ikon/' + m.ic + '.webp')}" alt="" width="${sz}" height="${sz}" loading="lazy"${m.fb ? ` onerror="this.onerror=null;this.src='${jimg('ikon/' + m.fb + '.webp')}'"` : ''}>` : `<img src="${jimg('anak/star_jar.webp')}" alt="" width="${sz}" height="${sz}" loading="lazy">`;
const kidMisList = O => { O = O || ortu(); return kidMissionsToday(O.missions.filter(m => kmDef(m, O))); };
/* Roda Ilmu opens when half of today's missions are done (at most 5 needed) */
const kidMisGate = () => { const l = kidMisList(), d = dayOf(todayK()), done = l.filter(m => (d.m || {})[m]).length, need = Math.min(5, Math.ceil(l.length / 2)); return { ok:done >= need, done, need }; };
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
    (O.marks.puasa || puasa) && 'puasa', Object.values(roda).filter(x => x && x.ok).length >= 10 && 'roda', (Object.keys(learn).some(k => /-6$/.test(k) && learn[k].done) || Object.keys(pget(id, 'jlb:learn2', {}) || {}).some(k => k.startsWith('e:') && pget(id, 'jlb:learn2', {})[k].mum)) && 'unit',
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
  const surat = typeof suratOpen === 'function' && suratOpen() && (fri || ([6, 0].includes(now.getDay()) && suratSticker()));
  $('#v-taman').innerHTML = `<div class="jw jkidw">
  <section class="jhero" style="min-height:330px;justify-content:flex-start"><img class="bg" src="${jimg('langit/sky_' + skyNow(now) + '.webp')}" alt="" fetchpriority="high">
    <div class="jrow" style="justify-content:space-between"><span class="jpill">${pt.bal} XP</span><span class="jpill">Level ${levelOf(xpTotal()).l}</span></div>
    <h1 style="margin-top:10px">Halo, ${esc(PROF.name)}!</h1><span style="opacity:.9">${hijriTxt(hijri(now))}</span>
    <a href="#saya" style="position:absolute;left:50%;bottom:0;transform:translateX(-50%)" aria-label="Ke kamar Jimon">${dirt ? `<img src="${jimg('jimon/keadaan/j_debu.webp')}" alt="Jimon berdebu" width="170" height="165">` : jimonHTML({ face, wear:jWear(J.wear), w:160, blink:true, cls:'jbreathe' })}</a>
    ${dirt ? `<span style="position:absolute;left:12px;bottom:120px;max-width:150px;background:#fff;color:#0F1D3D;border-radius:16px;padding:8px 10px;font-size:.85rem">${JWORD[Math.min(2, dirt)]}</span>` : ''}</section>
  ${surat ? `<a class="jcard jk-surat" href="#surat"><img src="${jimg('jimon/pose/p_menulis.webp')}" alt="" width="70" height="83" class="jbreathe"><span><b>${fri ? 'Hari ini Jumat! Ada surat dari Jimon' : 'Surat Jumat dari Jimon'}</b><br><span class="jmut">${suratSticker() ? 'Baca suratnya dan ambil stiker pekan ini' : 'Baca lagi suratnya'}</span></span></a>` : ''}
  ${typeof rasaCard === 'function' ? rasaCard() : ''}
  <section class="jcard" style="background:var(--jkidcard)"><div class="jrow sp"><h2>Lentera sholat</h2><span class="jpill">${lit} dari 5</span></div><div class="jlant">${lan}</div>
    <span class="jmut">Nyalakan lentera setelah sholat. Setiap lentera +10 XP.</span></section>
  <div class="jgrid2">
    <a class="jcard" href="#amal" style="text-decoration:none;color:inherit;background:var(--jkidcard)">${jicon('rapikan')}<b>Misi hari ini</b><span class="jmut">${(() => { const l = kidMisList(); return l.filter(m => (d.m || {})[m]).length + ' dari ' + l.length; })()} selesai</span></a>
    <a class="jcard" href="#belajar" style="text-decoration:none;color:inherit;background:var(--jkidcard)">${jicon('ilmu')}<b>Belajar Seru</b><span class="jmut">Lanjutkan petualangan</span></a>
    <a class="jcard" href="#home" style="text-decoration:none;color:inherit;background:var(--jkidcard)">${jicon('ninja')}<b>Gerak bersama Jimon</b><span class="jmut">+10 XP tiap sesi</span></a>
    <a class="jcard" href="#jimon" style="text-decoration:none;color:inherit;background:var(--jkidcard)">${jicon('telepon')}<b>Ngobrol dengan Jimon</b><span class="jmut">Jimon menunggumu</span></a>
    <a class="jcard" href="#belajar/ka" style="text-decoration:none;color:inherit;background:var(--jkidcard)">${jicon('cerita_anak', '', 'baca')}<b>Kisah Akhlak</b><span class="jmut">${(() => { const A = jget('learn2', {}) || {}; return Object.keys(A).filter(k => k.startsWith('ka:') && A[k].done).length; })()} dari 10 kisah</span></a>
    <a class="jcard" href="#main" style="text-decoration:none;color:inherit;background:var(--jkidcard)"><img class="jic" src="${jimg('jimon/barang/b_bola_benang.webp')}" alt="" width="44" height="44"><b>Main bersama Jimon</b><span class="jmut">${typeof jimonState === 'function' ? jimonState().left + ' kali lagi hari ini' : '3 kali sehari'}</span></a></div>
  <a class="jcard" href="#peti" style="text-decoration:none;color:inherit;flex-direction:row;align-items:center;background:var(--jkidcard)"><img src="${jimg('anak/star_jar.webp')}" alt="" width="70" height="70"><span><h2>Toples bintang: ${pt.bal} XP</h2><span class="jmut">${fri ? 'Hari ini Jumat! Peti Jumat terbuka.' : 'Tukar jadi waktu main di Peti Jumat'}</span></span></a>
  </div>`;
}

/* ---------------- Misi (papan stiker) ---------------- */
function renderMisi() {
  const O = ortu(), d = dayOf(todayK()), list = kidMisList(O), dm = d.m || {};
  const n = list.filter(m => dm[m]).length;
  let sn = slotNow(new Date()); if (!KSLOT[sn]) sn = 'subuh';
  const i0 = KSLOT_K.indexOf(sn), order = KSLOT_K.slice(i0).concat(KSLOT_K.slice(0, i0));
  const card = m => { const M = kmDef(m, O), on = !!dm[m];
    return `<button data-kmis="${m}" aria-pressed="${on}"${M.auto && !on ? ` data-kgo="${M.auto}"` : ''}>${kmIcon(M)}${esc(M.n)}${M.auto && !on ? '<small class="jmut">Selesaikan di aplikasi</small>' : ''}</button>`; };
  const groups = order.map((t, j) => { const l = list.filter(m => kmDef(m, O).t === t); if (!l.length) return '';
    const past = j > 0 && KSLOT_K.indexOf(t) < i0, k = l.filter(m => dm[m]).length;
    return `<div class="jrow sp jmslot${past ? ' past' : ''}"><h2>${KSLOT[t]}</h2><span class="jpill">${t === sn ? 'Sekarang · ' : past ? 'Tadi · ' : ''}${k}/${l.length}</span></div><div class="jstk">${l.map(card).join('')}</div>`; }).join('');
  $('#v-amal').innerHTML = `<div class="jw jkidw"><div class="jrow sp" style="padding-top:8px"><h1>Misi hari ini</h1><span class="jpill">${n} dari ${list.length}</span></div>
    <div class="jbar"><i style="width:${list.length ? n / list.length * 100 : 0}%"></i></div>
    ${groups || '<p class="jmut">Belum ada misi. Minta Ayah atau Ibu memilih misi di Ruang Orang Tua.</p>'}
    <p class="jmut">Setiap misi +5 XP. Selesaikan 1 misi untuk bisa memandikan Jimon.</p></div>`;
}

/* ---------------- Kamar Jimon (Saya anak) ---------------- */
let OWNT = 'sore';
let KPET = 0, KBATH = false, KPOP = null, KVOICE = '';
function renderKamar(fed) {
  if (!jget('jimon', {}).since) jset('jimon', Object.assign({}, jget('jimon', {}), { since:todayK() }));
  const J = jget('jimon', {}), dirt = KBATH ? 0 : jimonDirt(), xp = xpTotal(), L = levelOf(xp), got = badgesGot(), d = dayOf(todayK()), missDone = Object.keys(d.m || {}).length > 0;
  const wear = jWear(J.wear), tidur = jTidur(J), worn = Object.keys(wear).length;
  if (dirt && !KBATH && KVOICE !== 'debu' + todayK()) { KVOICE = 'debu' + todayK(); jvoice('j_debu'); }
  const canBath = !KBATH && !tidur && (dirt ? missDone : J.bath !== todayK());
  const acc = JSLOTS.map(([sl, sn]) => { const ks = Object.keys(JACC).filter(k => JACC[k].slot === sl);
    return `<div class="jaccg"><b>${sn}${ks.length > 1 ? ' <small>pilih satu</small>' : ''}</b><div class="jacc">${ks.map(k => { const A = JACC[k], lock = L.l < A.lv, on = wear[sl] === k;
      return `<button data-kwear="${k}" aria-pressed="${on}" ${lock ? 'disabled' : ''}><img src="${jimg('jimon/hiasan/a_' + k + '.webp')}" alt="" loading="lazy">${A.n}<small>${on ? 'dipakai' : lock ? 'Level ' + A.lv : 'terbuka'}</small></button>`; }).join('')}</div></div>`; }).join('');
  $('#v-saya').innerHTML = `<div class="jw jkidw">
  ${jimonRoomHTML({ bath:KBATH, dirt, pet:KPET, lv:L.l, canBath, missDone, fed })}
  ${typeof jbKamarExtra === 'function' ? jbKamarExtra() : ''}
  ${dirt && !KBATH ? `<section class="jcard" style="background:#FFF4D6;color:#3D2C00"><b>${dirt >= 2 ? 'Jimon berdebu sekali' : 'Jimon sedikit berdebu'}</b><span>Selesaikan 1 misi hari ini, lalu mandikan Jimon supaya bersih dan wangi lagi.</span>
    ${missDone ? '' : '<a class="jb ghost block" href="#amal">Ke Misi</a>'}</section>` : ''}
  <section class="jcard" style="background:var(--jkidcard)"><div class="jrow sp"><h2>Level ${L.l}</h2><span class="jpill">${xp} XP</span></div><div class="jbar"><i style="width:${L.pct}%"></i></div>
    <span class="jmut">${L.next ? (L.next - xp) + ' XP lagi ke Level ' + (L.l + 1) : 'Level tertinggi. MasyaAllah!'}</span><span class="jmut" style="font-size:.78rem">Level dihitung dari semua XP yang pernah didapat. Menukar waktu main tidak menurunkan level.</span></section>
  <section class="jcard" style="background:var(--jkidcard)"><div class="jrow sp"><h2>Hiasan Jimon</h2><span class="jrow" style="gap:6px">${worn ? '<button class="jchip" data-kwear="lepas">Lepas semua</button>' : ''}<button class="jchip" data-kwear="tidur" aria-pressed="${tidur}">${tidur ? 'Bangun' : 'Tidur'}</button></span></div>
    <span class="jmut">Hiasan dari bagian berbeda bisa dipakai bersamaan. Di satu bagian, pilih satu saja.</span>${acc}
    <span class="jmut">Hiasan yang dipakai ikut terlihat di Beranda dan saat ngobrol dengan Jimon.</span></section>
  <a class="jb gold block" href="#jimon">Ngobrol dengan Jimon</a>
  <section class="jcard" style="background:var(--jkidcard)"><div class="jrow sp"><h2>Rak lencanaku</h2><span class="jmut">${got.size} dari ${BADGES_K.length}</span></div>
    <div class="jgrid4">${BADGES_K.map(([k, n, m, ic]) => { const g = got.has(k); return `<div style="text-align:center;opacity:${g ? 1 : .4};filter:${g ? 'none' : 'grayscale(1)'}"><span style="position:relative;display:inline-block;width:56px;height:70px"><img src="${jimg('anak/medali_' + m + '.webp')}" alt="" width="56" height="70" loading="lazy"><img src="${jimg('ikon/' + ic + '.webp')}" alt="" style="position:absolute;left:13px;top:11px;width:30px;height:30px;border-radius:50%" loading="lazy"></span><small style="display:block;font-size:.7rem;line-height:1.2">${n}</small></div>`; }).join('')}</div></section>
  <a class="jcard" href="#perjalanan" style="text-decoration:none;color:#3D2C00;background:var(--jy)"><b>Perjalananku ke langit</b><span>Sekarang: ${STOPS_KID_NAME()}</span></a>
  ${ageKid() ? '<a href="#ortu" class="jmut" style="text-align:center;padding:12px">Untuk Ayah dan Ibu (PIN)</a>' : modeCard()}
  </div>${KPOP !== null ? `<div class="jsheet" data-kpop><div role="dialog" aria-modal="true" style="align-items:center;text-align:center"><span class="jmut" style="font-weight:800;letter-spacing:.06em">NAIK LEVEL!</span><h1>Level ${L.l}</h1>
    <span class="jlvup"><img src="${jimg('jimon/pose/p_peluk_bintang.webp')}" alt="Jimon memeluk bintang" class="ka-hop"><i>✦</i><i>✦</i><i>✦</i></span>
    ${KPOP ? `<img src="${jimg('jimon/hiasan/a_' + KPOP + '.webp')}" alt="" height="80" style="height:80px;width:auto" class="jwig"><p>Hiasan baru terbuka: <b>${JACC[KPOP].n}</b></p>${jbtn('Pakaikan ke Jimon', 'data-kwear="' + KPOP + '"', 'block')}` : '<p>MasyaAllah, terus berbuat baik ya!</p>'}${jbtn(KPOP ? 'Nanti saja' : 'Terima kasih, Jimon!', 'data-kpop', 'ghost block')}</div></div>` : ''}`;
}
const STOPS_KID_NAME = () => { const n = ['Yaqazah', 'Taubah', 'Muhasabah', 'Istiqamah', 'Ikhlas', 'Sabar', 'Syukur', 'Tawakkal', 'Muraqabah', 'Mahabbah', 'Ridha']; return n[(jget('jalan', {}).stop) || 0]; };
function checkLevelUp() {   // show the level-up sheet once per new level
  const L = levelOf(xpTotal()).l, J = jget('jimon', {});
  if ((J.seenLv || 1) < L) { const k = Object.keys(JACC).find(x => JACC[x].lv === L); jset('jimon', Object.assign({}, J, { seenLv:L })); KPOP = k || ''; jvoice('c_naik'); }
}

/* ---------------- Peti Jumat ---------------- */
function renderPeti() {
  if (new Date().getDay() === 5 && KVOICE !== 'jumat' + todayK()) { KVOICE = 'jumat' + todayK(); jvoice('j_jumat'); }
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
    <a class="jcard" href="#me" style="text-decoration:none;color:inherit"><h2>Profil, sinkron keluarga, PIN</h2><span class="jmut">Masukkan kode keluarga di perangkat ini, ubah profil anak, atau pasang PIN profil.</span></a>
    <section class="jcard"><h2>Tampilan</h2><div class="jtick">${[['anak', 'Anak'], ['dewasa', 'Dewasa']].map(([v, t]) => `<button class="jchip" data-omode="${v}" aria-pressed="${(v === 'anak') === isKidP()}">${t}</button>`).join('')}</div><span class="jmut">Hanya Ayah atau Ibu yang bisa mengganti tampilan anak di bawah 13 tahun.</span></section>
    <section class="jcard"><h2>Batas waktu main per pekan</h2><div class="jtick">${[120, 180, 240, 300, 360].map(m => `<button class="jchip" data-ocap="${m}" aria-pressed="${O.cap === m}">${m / 60} jam</button>`).join('')}</div></section>
    <section class="jcard"><div class="jrow sp"><h2>Misi harian</h2><span class="jpill">${O.missions.filter(m => kmDef(m, O)).length} aktif</span></div>
      <span class="jmut">Pilih misi untuk anak ini. Misi muncul di layar anak sesuai waktunya. Mulailah dari sedikit, lalu tambah pelan-pelan.</span>
      ${KPIL.map(([p, pn]) => { const ids = p === 'own' ? (O.own || []).map(x => x.id) : Object.keys(MISSIONS).filter(m => MISSIONS[m].p === p); if (!ids.length && p !== 'own') return '';
        return `<h3 class="jomh">${pn}</h3>${ids.map(m => { const M = kmDef(m, O); return `<label class="jrow sp jomis"><span class="jrow" style="gap:10px;flex-wrap:nowrap">${kmIcon(M, 36)}<span><b>${esc(M.n)}</b><br><span class="jmut">${KSLOT[M.t]}${M.h ? ' · ' + esc(M.h) : ''}</span></span></span><span class="jrow" style="gap:8px;flex-wrap:nowrap">${M.own ? jbtn('Hapus', 'data-oowndel="' + m + '"', 'ghost') : ''}<input type="checkbox" data-omis="${m}" ${O.missions.includes(m) ? 'checked' : ''} style="width:24px;height:24px"></span></label>`; }).join('')}`; }).join('')}
      <h3 class="jomh">Tambah misi sendiri</h3>
      <label for="oOwnN"><b>Nama misi</b></label><input id="oOwnN" class="inp" maxlength="40" placeholder="contoh: Siram tanaman" autocomplete="off">
      <span class="jmut"><b>Waktunya</b></span><div class="jtick">${KSLOT_K.map(t => `<button class="jchip" data-oownt="${t}" aria-pressed="${OWNT === t}">${KSLOT[t]}</button>`).join('')}</div>
      ${jbtn('Tambah misi', 'data-oownadd', 'navy block')}<span class="jmut">Paling banyak 10 misi keluarga. Setiap misi tetap +5 XP.</span></section>
    <section class="jcard"><h2>Tandai pencapaian</h2>${[['fatihah', 'Sudah hafal Al-Fatihah'], ['puasa', 'Puasa pertama'], ['ramadan', 'Ramadan penuh (sesuai kemampuan)']].map(([k, t]) => `<label class="jrow sp"><span>${t}</span><input type="checkbox" data-omark="${k}" ${O.marks[k] ? 'checked' : ''} style="width:24px;height:24px"></label>`).join('')}</section>
    <section class="jcard"><h2>Belajar: akses pulau</h2><span class="jmut">Aturan biasa: pulau berikutnya terbuka setelah ujian pulau Mumtaz, paling cepat 7 hari setelah pulau sebelumnya dibuka. Di sini Ayah atau Ibu bisa membuka lebih awal atau mengunci.</span>
      ${typeof islandState === 'function' ? ISL.map((x, i) => { const st = islandState(i), ov = (O.isl || {})[i + 1];
        return `<div class="jrow sp" style="flex-wrap:wrap"><span><b>Pulau ${i + 1}</b> · ${x[0].replace('Pulau ', '')}<br><span class="jmut">${st.open ? 'Terbuka' : esc(st.why)}${ov ? ' · diatur orang tua' : ''}</span></span>${i ? `<span class="jrow" style="gap:6px">${jbtn('Buka', 'data-oisl="' + (i + 1) + ':open"', ov && ov.st === 'open' ? 'green' : 'ghost')}${jbtn('Kunci', 'data-oisl="' + (i + 1) + ':lock"', ov && ov.st === 'lock' ? 'navy' : 'ghost')}${ov ? jbtn('Aturan biasa', 'data-oisl="' + (i + 1) + ':auto"', 'ghost') : ''}</span>` : ''}</div>`; }).join('') : ''}</section>
    <section class="jcard"><h2>Renungan Kisah Akhlak</h2>${(() => { const R = jget('ren', {}) || {}, ks = Object.keys(R).filter(k => R[k] && R[k].t).sort((a, b) => R[b].at - R[a].at);
      return ks.length ? ks.map(k => `<div><b>Kisah ${esc(k)}${typeof KA !== 'undefined' && KA[k - 1] ? ' · ' + esc(KA[k - 1].t) : ''}</b><br><span class="jmut">${niceDate(new Date(R[k].at))}</span><p>${esc(R[k].t)}</p></div>`).join('') : '<p class="jmut">Belum ada renungan yang disimpan.</p>'; })()}
      <span class="jmut">Jawaban renungan anak setelah menyelesaikan Kisah Akhlak. Tanpa nilai, untuk bahan ngobrol bersama.</span></section>
    <section class="jcard"><h2>Perasaan anak 14 hari terakhir</h2>${(() => { const R = jget('rasa', {}) || {}, E = { senang:['😊', 'senang'], sedih:['😢', 'sedih'], marah:['😠', 'marah'], takut:['😨', 'takut'], capek:['😴', 'capek'] };
      const days = Array.from({ length:14 }, (_, i) => dkey(jAdd(new Date(), i - 13))), n = days.filter(k => R[k]).length;
      const cnt = Object.keys(E).map(m => [m, days.filter(k => R[k] && R[k].m === m).length]).filter(x => x[1]);
      return `<div class="jorasa">${days.map(k => { const r = R[k], e = r && E[r.m]; return `<span title="${niceDate(kOf(k))}${e ? ': ' + e[1] : ''}"><b aria-hidden="true">${e ? e[0] : '·'}</b><small>${kOf(k).getDate()}</small></span>`; }).join('')}</div>
        ${n ? `<span class="jmut">${cnt.map(([m, c]) => E[m][1] + ' ' + c + ' hari').join(' · ')}</span>` : '<p class="jmut">Belum ada isian. Anak memilih perasaannya di Beranda.</p>'}`; })()}
      <span class="jmut">Diisi anak sendiri di Beranda. Tanpa nilai; kalau ada hari sedih, marah, atau takut, ajak ngobrol dengan lembut.</span></section>
    <section class="jcard"><h2>Ajari Jimon</h2><span class="jmut">Tambahkan jawaban Jimon untuk kata-kata yang sering ditulis anak. Jawaban dari Ayah atau Ibu dipakai lebih dulu, dan ikut tersinkron ke perangkat keluarga.</span>
      <label for="oAjQ"><b>Kalau anak menulis</b></label><input id="oAjQ" class="inp" maxlength="60" placeholder="contoh: jimon suka ikan" autocomplete="off">
      <label for="oAjA"><b>Jimon menjawab</b></label><input id="oAjA" class="inp" maxlength="160" placeholder="contoh: Suka sekali! Tapi aku lebih suka belajar bersamamu." autocomplete="off">
      ${jbtn('Simpan jawaban', 'data-oajar', 'navy block')}
      ${(O.ajar || []).map((x, i) => `<div class="jrow sp"><span><b>${esc(x.q)}</b><br><span class="jmut">${esc(x.a)}</span></span>${jbtn('Hapus', 'data-oajdel="' + i + '"', 'ghost')}</div>`).join('') || '<span class="jmut">Belum ada.</span>'}</section>
    <section class="jcard"><h2>Jimon</h2><label class="jrow sp"><span>Boleh ngobrol dengan Jimon</span><input type="checkbox" data-ochat ${O.chat ? 'checked' : ''} style="width:24px;height:24px"></label>
      <label class="jrow sp"><span>Jimon memanggil nama anak dengan suara HP<br><span class="jmut">Saat sapaan pertama hari ini, misi atau kisah pertama selesai, dan saat lama tidak bertemu</span></span><input type="checkbox" data-onama ${O.nama !== false ? 'checked' : ''} style="width:24px;height:24px"></label>
      <b>Batas pesan per hari</b><div class="jtick">${[5, 10, 15, 20, 30].map(n => `<button class="jchip" data-olim="${n}" aria-pressed="${O.limit === n}">${n} pesan</button>`).join('')}</div>
      <span class="jmut">Jimon Pintar bekerja tanpa internet dan gratis, jadi batas ini hanya untuk mengatur waktu layar. Sekarang ${O.limit} pesan per hari; perubahan langsung berlaku hari ini. Mengelus Jimon tidak memberi XP.</span>
      <b>Obrolan terakhir</b>${chat.length ? chat.map(c => `<p class="jmut">${c.me ? 'Anak' : 'Jimon'}: ${esc(c.t)}</p>`).join('') : '<p class="jmut">Belum ada obrolan.</p>'}</section></div>`;
}
const setOrtu = patch => { const O = Object.assign({}, pget(CUR, 'jlb:ortu', {}) || {}, patch); jset('ortu', O); };

/* ---------------- events ---------------- */
document.addEventListener('click', async e => {
  const t = e.target.closest('[data-klan],[data-kmis],[data-kpet],[data-kbath],[data-kwear],[data-kpop],[data-kpeti],[data-oopen],[data-olock],[data-oreq],[data-ocap],[data-olim],[data-omode],[data-oisl],[data-oajar],[data-oajdel],[data-oownt],[data-oownadd],[data-oowndel]');
  if (!t || t.disabled) return;
  const ds = t.dataset, tk = todayK();
  if (ds.klan) { dayPut(tk, d => { d.s = d.s || {}; const s = Object.assign({}, d.s[ds.klan] || {}); s.f = s.f ? 0 : 1; d.s[ds.klan] = s; });
    if (dayOf(tk).s[ds.klan].f) { jtoast('Lentera ' + PRN[ds.klan] + ' menyala! +10 XP'); checkLevelUp(); if (typeof jbuddyReact === 'function') jbuddyReact('lentera', 150); } return renderKidHome(); }
  if (ds.kgo) { jtoast(ds.kgo === '#home' ? 'Misi ini tercentang sendiri setelah sesi Gerak selesai' : 'Misi ini tercentang sendiri setelah 1 langkah Belajar Seru'); location.hash = ds.kgo; return; }
  if (ds.kmis) { if (MISSIONS[ds.kmis] && MISSIONS[ds.kmis].auto && (dayOf(tk).m || {})[ds.kmis]) return;
    dayPut(tk, d => { d.m = Object.assign({}, d.m || {}); if (d.m[ds.kmis]) delete d.m[ds.kmis]; else d.m[ds.kmis] = 1; });
    if (ds.kmis === 'puasa' && typeof setFast === 'function') setFast(tk, (dayOf(tk).m || {}).puasa ? 'half' : '');
    if ((dayOf(tk).m || {})[ds.kmis]) { jtoast('Misi selesai! +5 XP'); checkLevelUp(); if (typeof jbuddyReact === 'function') jbuddyReact('misi', 150); } return renderMisi(); }
  if (ds.kpet !== undefined) { if (jimonDirt() || KBATH || jTidur(jget('jimon', {}))) return; KPET++; if (KPET % 2) { jvoice(KPET % 6 === 5 ? 'tertawa' : 'dengkur'); if (typeof jimonMood === 'function') jimonMood('elus'); } renderKamar(); clearTimeout(window._kp); window._kp = setTimeout(() => { if (KPET % 2) { KPET++; if (document.body.dataset.view === 'saya') renderKamar(); } }, 1700); return; }
  if (ds.kbath !== undefined) { KBATH = true; jvoice('t_keran'); renderKamar(); setTimeout(() => { KBATH = false; jset('jimon', Object.assign({}, jget('jimon', {}), { bath:tk })); if (typeof jimonMood === 'function') jimonMood('mandi'); jtoast('Wah, wangi! Terima kasih sudah merawatku.'); jvoice('j_mandi'); if (document.body.dataset.view === 'saya') renderKamar(); }, 1800); return; }
  if (ds.kwear) { const J = jget('jimon', {}), W = jWear(J.wear), k = ds.kwear; let tidur = jTidur(J);
    if (k === 'tidur') tidur = !tidur; else if (k === 'lepas') Object.keys(W).forEach(x => delete W[x]);
    else if (JACC[k]) { const sl = JACC[k].slot; if (W[sl] === k) delete W[sl]; else { W[sl] = k; tidur = false; jvoice('j_hiasan'); } }
    jset('jimon', Object.assign({}, J, { wear:W, tidur })); KPOP = null; return renderKamar(); }
  if (ds.kpop !== undefined && (e.target === t || t.tagName === 'BUTTON')) { KPOP = null; return renderKamar(); }
  if (ds.kpeti) { const R = jget('peti', {}); R['r' + Date.now()] = { wk:weekKey(), min:Number(ds.kpeti), st:'req', at:Date.now() }; jset('peti', R); jtoast('Permintaan dikirim ke Ayah atau Ibu'); return renderPeti(); }
  if (ds.oopen !== undefined) { const pin = ($('#oPin').value || '').trim(), O = ortu(); if (!/^\d{4}$/.test(pin)) { $('#oErr').textContent = 'PIN harus 4 angka.'; return; }
    const h = await ortuHash(pin); if (!O.pin) { setOrtu({ pin:h }); OUNLOCK = true; } else if (h === O.pin) OUNLOCK = true; else { $('#oErr').textContent = 'PIN salah.'; return; } return renderOrtu(); }
  if (ds.olock !== undefined) { OUNLOCK = false; return renderOrtu(); }
  if (ds.oreq) { const [k, st] = ds.oreq.split(':'), R = jget('peti', {}); if (R[k]) { R[k] = Object.assign({}, R[k], { st, at:Date.now() }); jset('peti', R); } return renderOrtu(); }
  if (ds.ocap) { setOrtu({ cap:Number(ds.ocap) }); return renderOrtu(); }
  if (ds.olim) { setOrtu({ limit:Number(ds.olim) }); return renderOrtu(); }
  if (ds.oisl && OUNLOCK) { const [n, st] = ds.oisl.split(':'), I = Object.assign({}, ortu().isl || {}); if (st === 'auto') delete I[n]; else I[n] = { st, d:todayK() }; setOrtu({ isl:I }); return renderOrtu(); }
  if (ds.oajar !== undefined && OUNLOCK) { const q = ($('#oAjQ').value || '').trim(), a = ($('#oAjA').value || '').trim(); if (!q || !a) { jtoast('Isi kedua kolom dulu ya.'); return; }
    setOrtu({ ajar:[{ q, a }].concat(ortu().ajar || []).slice(0, 40) }); jtoast('Jimon sudah belajar jawaban baru'); return renderOrtu(); }
  if (ds.oajdel !== undefined && OUNLOCK) { const A = (ortu().ajar || []).slice(); A.splice(Number(ds.oajdel), 1); setOrtu({ ajar:A }); return renderOrtu(); }
  if (ds.oownt && OUNLOCK) { OWNT = ds.oownt; const v = ($('#oOwnN') || {}).value || ''; renderOrtu(); if ($('#oOwnN')) $('#oOwnN').value = v; return; }
  if (ds.oownadd !== undefined && OUNLOCK) { const n = ($('#oOwnN').value || '').trim(), O = ortu(); if (!n) { jtoast('Tulis nama misinya dulu ya.'); return; }
    if ((O.own || []).length >= 10) { jtoast('Sudah 10 misi keluarga. Hapus satu dulu.'); return; }
    const id = 'own' + Date.now().toString(36); setOrtu({ own:(O.own || []).concat({ id, n, t:OWNT }), missions:O.missions.concat(id) }); jtoast('Misi baru ditambahkan'); return renderOrtu(); }
  if (ds.oowndel && OUNLOCK) { const O = ortu(); setOrtu({ own:(O.own || []).filter(x => x.id !== ds.oowndel), missions:O.missions.filter(m => m !== ds.oowndel) }); return renderOrtu(); }
  if (ds.omode && OUNLOCK) { OUNLOCK = false; return setMode(CUR, ds.omode); }
});
document.addEventListener('change', e => {
  const t = e.target; if (!OUNLOCK) return;
  if (t.dataset.omis) { const O = ortu(); setOrtu({ missions:t.checked ? O.missions.filter(m => m !== t.dataset.omis).concat(t.dataset.omis) : O.missions.filter(m => m !== t.dataset.omis) }); }
  else if (t.dataset.omark) { const O = ortu(); setOrtu({ marks:Object.assign({}, O.marks, { [t.dataset.omark]:t.checked }) }); }
  else if (t.dataset.ochat !== undefined) setOrtu({ chat:t.checked });
  else if (t.dataset.onama !== undefined) setOrtu({ nama:t.checked });
});
addEventListener('hashchange', () => { if (!location.hash.startsWith('#ortu')) OUNLOCK = false; });
