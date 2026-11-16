/* =========================================================
   JLB adult and teen screens: Taman, Amal, Detail, Saya, Perjalanan,
   Pohon Iman 40 hari, Mujahadah
   ========================================================= */
const HABITS = {
  tilawah:{ n:'Tilawah 1 halaman', p:'ibadah', ic:'tilawah', m:'Menjaga hubungan harian dengan Al-Qur\'an, sedikit tapi rutin.' },
  dzikir:{ n:'Dzikir pagi dan petang', p:'ibadah', ic:'dzikir', m:'Hati lebih tenang dan hari dimulai dengan mengingat Allah.' },
  dhuha:{ n:'Sholat Dhuha', p:'ibadah', ic:'dhuha', m:'Sholat sunnah di pagi hari, mengawali kerja dengan ibadah.' },
  tahajud:{ n:'Tahajud', p:'ibadah', ic:'tahajud', m:'Waktu tenang untuk berdoa di sepertiga malam.' },
  sedekah:{ n:'Sedekah', p:'ibadah', ic:'sedekah', m:'Melatih hati untuk berbagi, sekecil apa pun.' },
  kajian:{ n:'Kajian atau mendengar ceramah', p:'ilmu', ic:'kajian', m:'Menambah ilmu agama secara teratur.' },
  latihan:{ n:'Latihan 20 menit', p:'jasad', ic:'latihan', m:'Badan kuat untuk beribadah dan bekerja. Tercatat juga dari Latihan.' },
  jalan:{ n:'Jalan kaki 30 menit', p:'jasad', ic:'jalan', m:'Jantung sehat, pikiran segar.' },
  minum:{ n:'Minum air 8 gelas', p:'jasad', ic:'minum', m:'Tubuh terhidrasi, lebih fokus dan tidak mudah lelah.' },
  tidur:{ n:'Tidur sebelum jam 22', p:'jasad', ic:'tidur', m:'Bangun Subuh lebih mudah, badan pulih.' },
  baca:{ n:'Baca buku 10 halaman', p:'ilmu', ic:'baca', m:'Sedikit setiap hari, banyak dalam setahun.' },
  belajar:{ n:'Belajar keterampilan 30 menit', p:'ilmu', ic:'belajar', m:'Terus bertumbuh dalam pekerjaan dan hidup.' },
  telepon:{ n:'Telepon orang tua', p:'akhlak', ic:'telepon', m:'Menyambung silaturahmi dan berbakti.' },
  bantu:{ n:'Bantu pekerjaan rumah', p:'akhlak', ic:'bantu_rumah', m:'Meringankan beban keluarga.' },
  baik:{ n:'Tidak berkata kasar', p:'akhlak', ic:'berbuat_baik', m:'Menjaga lisan, menjaga hati orang lain.' },
  rapikan:{ n:'Rapikan tempat tidur', p:'akhlak', ic:'rapikan', m:'Hari dimulai dengan satu hal yang selesai.' }
};
const DEF_HABITS = ['tilawah', 'dzikir', 'latihan', 'minum', 'baca', 'telepon'];
const myHabits = () => jget('habits', DEF_HABITS).filter(h => HABITS[h]);
const STOPS = [
  ['islam', 'Yaqazah', 'Bangun dari kelalaian hati', 'Duduk hening 10 menit sebelum Subuh, mengingat kembalinya kita kepada Allah', 'QS Saba’ 34:46', 'p_yaqazah', 'Bangun dari lalai, siap jadi lebih baik', 'Bangun untuk Subuh atau sekolah tanpa mengeluh'],
  ['islam', 'Taubah', 'Kembali kepada Allah dan meninggalkan kebiasaan buruk', 'Saat tergelincir, segera istighfar dan tinggalkan satu kebiasaan buruk tertentu', 'QS At-Tahrim 66:8 · Ali ‘Imran 3:135', 'p_taubah', 'Kalau salah, kembali kepada Allah dan minta maaf', 'Ucapkan astaghfirullah saat salah, lalu minta maaf'],
  ['islam', 'Muhasabah', 'Menghitung neraca diri setiap hari', '5 menit sebelum tidur, tinjau amal baik dan buruk hari ini', 'QS Al-Hasyr 59:18', 'p_muhasabah', 'Ingat-ingat hari ini sebelum tidur', 'Ceritakan 1 hal baik dan 1 yang mau diperbaiki'],
  ['islam', 'Istiqamah', 'Teguh menjaga amal, walau sedikit', 'Jaga 1 amal kecil (misalnya 1 halaman Quran) tanpa putus', 'QS Hud 11:112', 'p_istiqamah', 'Terus berbuat baik setiap hari', 'Lakukan 1 kebaikan yang sama setiap hari'],
  ['iman', 'Ikhlas', 'Beramal hanya untuk dilihat Allah', 'Satu amal tersembunyi setiap hari yang tidak diketahui siapa pun', 'QS Al-Bayyinah 98:5', 'p_ikhlas', 'Berbuat baik karena Allah, bukan supaya dipuji', 'Kerjakan satu tugas rumah tanpa disuruh dan tanpa cerita'],
  ['iman', 'Sabar', 'Menahan diri dari keluh kesah', 'Saat marah, tunggu 10 menit dan berlindung kepada Allah sebelum bereaksi', 'QS Az-Zumar 39:10', 'p_sabar', 'Tidak mengeluh, tetap tenang', 'Menunggu giliran dengan sabar tanpa merengek'],
  ['iman', 'Syukur', 'Menyadari setiap nikmat datang dari-Nya', 'Tulis 3 hal yang kamu syukuri setiap pagi', 'QS Ibrahim 14:7', 'p_syukur', 'Semua nikmat datang dari Allah', 'Ucapkan alhamdulillah untuk 3 hal sebelum tidur'],
  ['iman', 'Tawakkal', 'Berusaha terbaik, lalu menyerahkan hasilnya kepada Allah', 'Pilih satu kecemasan, berdoa, lalu serahkan kepada-Nya', 'QS Ath-Thalaq 65:3', 'p_tawakkal', 'Berusaha sebaik mungkin, lalu serahkan kepada Allah', 'Ucapkan bismillah sebelum ujian setelah belajar'],
  ['ihsan', 'Muraqabah', 'Hidup dengan sadar bahwa Allah melihat segalanya', 'Berhenti sejenak sebelum memutuskan: apakah Allah ridha dengan ini?', 'QS Al-‘Alaq 96:14', 'p_muraqabah', 'Allah selalu melihat kita', 'Berkata jujur walau harus mengakui kesalahan'],
  ['ihsan', 'Mahabbah', 'Mendahulukan yang Allah cintai di atas keinginan diri', 'Renungkan satu Asmaul Husna setiap hari', 'QS Al-Baqarah 2:165', 'p_mahabbah', 'Sayang kepada Allah lebih dari apa pun', 'Sebut satu ciptaan Allah yang membuatmu bahagia'],
  ['ihsan', 'Ridha', 'Tenang sepenuhnya dengan ketentuan Allah', 'Saat rencana gagal, ucapkan qaddarallahu wa ma sya’a fa’al tanpa kesal', 'QS Al-Bayyinah 98:8', 'p_ridha', 'Menerima ketentuan Allah dengan senang hati', 'Ucapkan alhamdulillah saat kalah main atau mendengar kata tidak']
];
const STOP_POS = [[190, 640], [213, 600], [257, 497], [197, 443], [137, 401], [162, 359], [213, 325], [184, 270], [195, 230], [165, 195], [195, 160]];
const CHAP = { islam:'Bab Islam', iman:'Bab Iman', ihsan:'Bab Ihsan' };
const STOP_DAYS = 40;
function jalanState(id) {
  const J = id ? pget(id, 'jlb:jalan', {}) : jget('jalan', {}), stop = J.stop || 0, days = pget(id || CUR, 'jlb:day', {});
  const since = J.since || '0000';
  const n = Object.keys(days).filter(k => k >= since && days[k].jp).length;
  return { stop, n, ready:n >= STOP_DAYS && stop < STOPS.length - 1, since };
}
let AYAT = null;
const loadAyat = () => AYAT ? Promise.resolve(AYAT) : fetch('js/jlb_ayat.json?v=' + JLB_VER).then(r => r.json()).then(j => (AYAT = j));
function ayatHTML(k) {
  arabicFont();
  if (!AYAT || !AYAT[k]) return '';
  const a = AYAT[k];
  return `<div class="jcard"><div class="jar" lang="ar">${a.ar.map(esc).join(' ۝ ')}</div><p class="jtr">${a.id.map(x => esc(x.replace(/\d+\)/g, ''))).join(' ')}</p><span class="jsrc">QS ${esc(a.n)} ${a.s}:${a.a}${a.b > a.a ? '–' + a.b : ''} · Terjemah Kemenag</span>${listenBtn(a)}</div>`;
}
const stageOf = n => n >= 6 ? 4 : n >= 4 ? 3 : n >= 2 ? 2 : 1;
function pillarActivity(id, days = 7) {
  const out = { ibadah:0, jasad:0, ilmu:0, akhlak:0 }, all = pget(id || CUR, 'jlb:day', {});
  for (let i = 0; i < days; i++) {
    const d = all[dkey(jAdd(new Date(), -i))]; if (!d) continue;
    const fard = PR.filter(p => d.s && d.s[p] && d.s[p].f).length; if (fard >= 5 || d.h) out.ibadah++;
    const seen = {}; Object.keys(d.a || {}).forEach(h => { const H = HABITS[h]; if (H && !seen[H.p]) { seen[H.p] = 1; if (H.p !== 'ibadah') out[H.p]++; } });
  }
  return out;
}
const isWoman = () => (profOf(CUR).sex || PROF.sex) === 'female';

/* ---------------- Taman ---------------- */
let AMOPEN = null;
function renderTaman() {
  const now = new Date(), tk = todayK(), d = dayOf(tk), P = prayerNow(now), sky = skyNow(now);
  const cur = P.cur < 0 ? 4 : P.cur, rw = setting('rawatib', true);
  const open = AMOPEN === null ? cur : AMOPEN;
  const act = pillarActivity();
  const strip = PR.map((p, i) => {
    const s = (d.s || {})[p] || {}, parts = ['f'].concat(rw ? RAWATIB[p] : []), done = parts.filter(x => s[x]).length;
    const lock = P.cur >= 0 && i > P.cur;
    return `<button data-jam="${i}" class="${s.f ? 'done' : ''} ${lock ? 'lock' : ''}" aria-current="${i === open}" ${lock ? 'disabled' : ''} aria-label="${PRN[p]} ${hm(P.t[p])}, ${done} dari ${parts.length}">${PRN[p]}<small>${hm(P.t[p])}</small><small>${d.h ? 'berhalangan' : done + '/' + parts.length}</small></button>`;
  }).join('');
  const op = PR[open], s = (d.s || {})[op] || {};
  const chip = (k, t) => `<button class="jchip" data-amk="${op}:${k}" aria-pressed="${!!s[k]}">${t}</button>`;
  const sheet = d.h ? `<p class="jmut">Hari ini ditandai berhalangan. Tidak dihitung kurang, dan hanya kamu yang melihatnya.</p>`
    : `<div class="jtick">${rw && RAWATIB[op].includes('q') ? chip('q', 'Qabliyah') : ''}${chip('f', 'Fardhu')}${chip('j', 'Berjamaah')}${rw && RAWATIB[op].includes('b') ? chip('b', 'Ba’diyah') : ''}</div>`;
  const hb = myHabits(), J = jalanState(), st = STOPS[J.stop], p40 = jget('40', null);
  const fri = now.getDay() === 5;
  $('#v-taman').innerHTML = `<div class="jw">
  <section class="jhero" style="min-height:300px"><img class="bg" src="${jimg('langit/sky_' + sky + '.webp')}" alt="" fetchpriority="high" decoding="async"><div class="shade"></div>
    <div class="jtop"><img src="${jimg('brand/emblem.webp')}" alt="JLB" width="40" height="40" style="border-radius:50%"><span class="jpill" style="margin-left:auto">${xpTotal()} XP</span></div>
    <span style="font-size:.85rem;opacity:.9">${dayName(now.getDay())}, ${niceDate(now)} · ${hijriTxt(hijri(now))}</span>
    <h1>Assalamu’alaikum, ${esc(PROF.name)}</h1>
    <span style="opacity:.9">${P.next ? 'Berikutnya ' + PRN[P.next] + ' ' + hm(P.t[P.next]) : 'Waktu Isya, istirahat yang cukup ya'} · ${esc(setting('city', 'Jakarta'))}</span></section>
  ${petiInbox()}
  <section class="jcard" aria-label="Amaliyah sholat"><div class="jrow sp"><h2>Amaliyah sholat</h2>${isWoman() ? `<button class="jchip" data-jh aria-pressed="${!!d.h}">Berhalangan</button>` : ''}</div>
    <div class="jam" role="group">${strip}</div><div class="jrow sp"><b>${PRN[op]}</b><span class="jmut">${hm(P.t[op])}</span></div>${sheet}</section>
  <section class="jcard" aria-label="Taman"><div class="jrow sp"><h2>Tamanku</h2><span class="jmut">7 hari terakhir</span></div>
    <div style="position:relative;border-radius:18px;overflow:hidden;padding-top:8px;background:linear-gradient(180deg,#CFE6FF,#EAF5D8 70%)"><div class="jplants">${Object.keys(PILLAR).map(k => { const n = stageOf(act[k]);
      return `<div><img src="${jimg('taman/plant_' + PILLAR[k].plant + '_' + n + '.webp')}" alt="Tanaman ${PILLAR[k].n} tahap ${n}" loading="lazy" decoding="async" width="120" height="180"><span style="background:${PILLAR[k].c}">${PILLAR[k].n}</span></div>`; }).join('')}</div><div style="height:16px;background:#B98B54"></div></div></section>
  <section class="jcard" aria-label="Amal hari ini"><div class="jrow sp"><h2>Amal hari ini</h2><a href="#amal" class="jmut">Semua</a></div>
    ${hb.slice(0, 4).map(h => habBtn(h, d)).join('')}</section>
  <section class="jsplit" style="display:grid;gap:16px">
    <a class="jcard" href="#perjalanan" style="text-decoration:none;color:inherit"><span class="jmut">Perjalanan · ${CHAP[st[0]]}</span><h2>${st[1]}</h2><p class="jmut">${esc(st[3])}</p>
      <div class="jbar"><i style="width:${Math.min(100, J.n / STOP_DAYS * 100)}%"></i></div><span class="jmut">${J.n} dari ${STOP_DAYS} hari</span></a>
    ${p40 && !p40.done ? `<a class="jcard" href="#p40" style="text-decoration:none;color:inherit"><span class="jmut">Pohon Iman</span><h2>Hari ${p40Day(p40)} dari 40</h2><span class="jmut">Siram hari ini</span></a>` : ''}
    ${fri ? `<a class="jcard" href="#keluarga" style="text-decoration:none;color:inherit;flex-direction:row;align-items:center"><img src="${jimg('anak/chest.webp')}" alt="" width="64" height="64"><span><h2>Rekap Keluarga Jumat</h2><span class="jmut">Ketuk untuk membuka</span></span></a>` : ''}
  </section></div>`;
}
function habBtn(h, d) {
  const H = HABITS[h], on = !!(d.a || {})[h];
  return `<button class="jhab" data-jhab="${h}" aria-pressed="${on}">${jicon(H.ic)}<span><b>${esc(H.n)}</b><small>${PILLAR[H.p].n}</small></span><span class="ck">${on ? '✓' : ''}</span></button>`;
}

/* ---------------- Amal ---------------- */
let SARAN = false;
function renderAmal() {
  const tk = todayK(), d = dayOf(tk), hb = myHabits();
  const groups = Object.keys(PILLAR).map(k => [k, hb.filter(h => HABITS[h].p === k)]).filter(g => g[1].length);
  $('#v-amal').innerHTML = `<div class="jw"><div class="jrow sp" style="padding-top:8px"><h1>Amal</h1><span class="jpill">${Object.keys(d.a || {}).length} dari ${hb.length} hari ini</span></div>
  ${groups.map(([k, l]) => `<section class="jcard"><div class="jrow"><span style="width:12px;height:12px;border-radius:50%;background:${PILLAR[k].c}"></span><h2>${PILLAR[k].n}</h2></div>${l.map(h => `<div class="jrow">${habBtn(h, d)}<a href="#detail/${h}" class="jback" style="background:var(--jsoft)" aria-label="Detail ${esc(HABITS[h].n)}">${I('chev')}</a></div>`).join('')}</section>`).join('')}
  <section class="jcard"><div class="jrow"><span style="font-size:1.4rem">🌱</span><h2>Saran Amal</h2></div><p class="jmut">Pilih kebiasaan baru sesuai kemampuanmu. Setiap amal punya manfaatnya.</p>${jbtn(SARAN ? 'Tutup daftar' : 'Lihat saran amal', 'data-saran', 'ghost block')}
  ${SARAN ? Object.keys(HABITS).map(h => { const on = hb.includes(h); return `<div class="jhab" style="cursor:default">${jicon(HABITS[h].ic)}<span><b>${esc(HABITS[h].n)}</b><small>${esc(HABITS[h].m)}</small></span>${jbtn(on ? 'Hapus' : 'Tambah', `data-hadd="${h}"`, on ? 'ghost' : 'green')}</div>`; }).join('') : ''}</section>
  <a class="jcard" href="#rekap" style="text-decoration:none;color:inherit"><h2>Lihat rekap</h2><span class="jmut">Pekan, bulan, kuartal, sampai tahun</span></a></div>`;
}

/* ---------------- Detail amal (real calendar with Hijri dates) ---------------- */
let DMON = null;
function renderDetail() {
  const h = HABITS[ROUTE_ARG] ? ROUTE_ARG : myHabits()[0], H = HABITS[h], all = jget('day', {});
  const now = new Date(); if (!DMON) DMON = { y:now.getFullYear(), m:now.getMonth() };
  const first = new Date(DMON.y, DMON.m, 1), days = new Date(DMON.y, DMON.m + 1, 0).getDate(), lead = (first.getDay() + 6) % 7;
  let cells = ''; for (let i = 0; i < lead; i++) cells += '<span class="x"></span>';
  let cnt = 0;
  for (let i = 1; i <= days; i++) { const dd = new Date(DMON.y, DMON.m, i), k = dkey(dd), on = !!((all[k] || {}).a || {})[h], hj = hijri(dd); if (on) cnt++;
    cells += `<span class="${k === todayK() ? 'now' : on ? 'on' : ''}" title="${niceDate(dd)} · ${hijriTxt(hj)}">${i}<small>${hj.d === 1 ? hj.d + ' ' + HMON[LANG][hj.m - 1].slice(0, 6) : hj.d}</small></span>`; }
  let streak = 0; for (let i = 0; i < 400; i++) { const k = dkey(jAdd(now, -i)); if (((all[k] || {}).a || {})[h]) streak++; else if (i > 0) break; }
  const total = Object.values(all).filter(x => (x.a || {})[h]).length;
  const h1 = hijri(first), h2 = hijri(new Date(DMON.y, DMON.m, days));
  $('#v-detail').innerHTML = `<div class="jw"><section class="jhero" style="min-height:220px"><img class="bg" src="${jimg('langit/sky_' + skyNow() + '.webp')}" alt=""><div class="shade"></div>
    <div class="jtop">${back('#amal')}</div><div class="jrow">${jicon(H.ic)}<h1>${esc(H.n)}</h1></div><span>${PILLAR[H.p].n}</span></section>
  <div class="jgrid3"><div class="jcard"><span class="jmut">Beruntun</span><b style="font-size:1.6rem">${streak}</b></div><div class="jcard"><span class="jmut">Bulan ini</span><b style="font-size:1.6rem">${cnt}</b></div><div class="jcard"><span class="jmut">Total</span><b style="font-size:1.6rem">${total}</b></div></div>
  <section class="jcard"><div class="jrow sp"><button class="jback" style="background:var(--jsoft)" data-dmon="-1" aria-label="Bulan sebelumnya">${I('chev', 'flip')}</button>
    <span style="text-align:center"><b>${MON[LANG][DMON.m]} ${DMON.y}</b><br><span class="jmut">${HMON[LANG][h1.m - 1]}${h1.m !== h2.m ? ' – ' + HMON[LANG][h2.m - 1] : ''} ${h2.y} H</span></span>
    <button class="jback" style="background:var(--jsoft)" data-dmon="1" aria-label="Bulan berikutnya">${I('chev')}</button></div>
    <div class="jcal">${['Sen','Sel','Rab','Kam','Jum','Sab','Min'].map(x => `<b>${x}</b>`).join('')}${cells}</div><span class="jmut">Hijau: dikerjakan · Angka kecil: tanggal Hijriah</span></section>
  <section class="jcard"><h2>Manfaat</h2><p>${esc(H.m)}</p></section></div>`;
}

/* ---------------- Saya ---------------- */
function renderSaya() {
  const xp = xpTotal(), L = levelOf(xp), J = jalanState(), d = dayOf(todayK()), st = STOPS[J.stop];
  $('#v-saya').innerHTML = `<div class="jw"><section class="jhero" style="min-height:250px"><img class="bg" src="${jimg('langit/sky_' + skyNow() + '.webp')}" alt=""><div class="shade"></div>
    <div class="jrow"><span style="width:64px;height:64px;border-radius:50%;overflow:hidden;background:#fff;display:inline-block">${avatarFor(profOf(CUR))}</span><span><h1>${esc(PROF.name)}</h1><span>Level ${L.l} · ${xp} XP</span></span></div></section>
  <section class="jcard"><div class="jrow sp"><h2>Perjalanan</h2><span class="jmut">${CHAP[st[0]]}</span></div>
    <div class="jdots" aria-label="Titik ${J.stop + 1} dari 11">${STOPS.map((s, i) => `<i class="${i < J.stop ? 'd' : i === J.stop ? 'n' : ''}" title="${s[1]}"></i>`).join('')}</div>
    <p><b>${st[1]}</b>: ${esc(st[2])}</p>
    <button class="jhab" data-jp aria-pressed="${!!d.jp}"><span><b>Amalan hari ini</b><small>${esc(st[3])}</small></span><span class="ck">${d.jp ? '✓' : ''}</span></button>
    <span class="jmut">${J.n} dari ${STOP_DAYS} hari</span>${J.ready ? jbtn('Lanjut ke titik berikutnya', 'data-jnext', 'gold block') : ''}
    <a class="jb ghost block" href="#perjalanan">Buka Perjalanan langit</a></section>
  <div class="jgrid2"><a class="jcard" href="#p40" style="text-decoration:none;color:inherit"><img src="${jimg('taman/pohon_iman_2.webp')}" alt="" height="80" style="height:80px;width:auto;align-self:center"><b>Pohon Iman 40 hari</b></a>
    <a class="jcard" href="#mujahadah" style="text-decoration:none;color:inherit"><span style="font-size:2rem;text-align:center">${I('lock')}</span><b>Mujahadah</b><span class="jmut">Privat, terkunci PIN</span></a></div>
  <section class="jcard"><h2>Pengaturan amaliyah</h2>
    <label class="jrow sp"><span>Tampilkan sholat rawatib</span><input type="checkbox" data-jset="rawatib" ${setting('rawatib', true) ? 'checked' : ''} style="width:24px;height:24px"></label>
    <label class="jrow sp"><span>Kota untuk waktu sholat</span><select data-jset="city" class="inp" style="max-width:170px">${Object.keys(CITIES).sort().map(c => `<option ${c === setting('city', 'Jakarta') ? 'selected' : ''}>${c}</option>`).join('')}</select></label></section>
  ${ageKid() ? '<a href="#ortu" class="jmut" style="text-align:center;padding:12px">Untuk Ayah dan Ibu (PIN)</a>' : modeCard()}
  <a class="jcard" href="#me" style="text-decoration:none;color:inherit"><h2>Profil, latihan, sinkron keluarga, PIN</h2><span class="jmut">Pengaturan Jurnal Sehat Kita</span></a></div>`;
}

/* ---------------- Perjalanan langit ---------------- */
let JOPEN = null, JKID = null;
function renderPerjalanan() {
  const J = jalanState(), kid = JKID === null ? isKidP() : JKID, H = 1397 / 780 * 100;
  if (!AYAT) loadAyat().then(() => { if (document.body.dataset.view === 'perjalanan' && JOPEN !== null) renderPerjalanan(); });
  const stops = STOPS.map((s, i) => { const done = i < J.stop, now = i === J.stop, [x, y] = STOP_POS[i];
    return `<button class="jstop ${done ? 'done' : now ? 'now' : 'lock'}" data-jstop="${i}" style="left:${x / 390 * 100}%;top:${y / 698 * 100}%;flex-direction:${i % 2 ? 'row-reverse' : 'row'}" aria-label="${s[1]}${done ? ', sudah ditempuh' : now ? ', sedang ditempuh' : ', terkunci'}"><i>${done ? '✓' : now ? '★' : ''}</i><span>${s[1]}</span></button>`; }).join('');
  const o = JOPEN === null ? null : STOPS[JOPEN];
  $('#v-perjalanan').innerHTML = `<div class="jw"><section class="jsky" style="aspect-ratio:780/1397"><img class="bg" src="${jimg('langit/perjalanan_langit.webp')}" alt="Langit perjalanan dari bawah ke atas" decoding="async"><div class="band"></div>
    <div style="position:absolute;top:10px;left:12px;right:12px;display:flex;gap:8px;align-items:center">${back('#saya')}<div class="jsub" style="margin:0 0 0 auto">${['Dewasa', 'Anak'].map((n, i) => `<a href="#perjalanan" data-jkid="${i}" ${!!i === kid ? 'aria-current="page"' : ''}>${n}</a>`).join('')}</div></div>
    ${stops}</section>
  <section class="jcard"><span class="jmut">Perjalanan mendekat kepada Allah lewat yang wajib, lalu yang sunnah. Bab yang dilalui, bukan peringkat yang dicapai.</span><span class="jsrc">QS Ali ‘Imran 3:31</span></section>
  <section class="jcard"><span class="jmut">Bekal yang terus dibawa</span><p>${J.stop ? STOPS.slice(0, J.stop).map(s => s[1]).join(' · ') : 'Mulai dari Yaqazah'}</p></section></div>
  ${o ? `<div class="jsheet" data-jclose><div role="dialog" aria-modal="true" aria-label="${o[1]}"><div class="jrow sp"><span class="jmut">${CHAP[o[0]]} · Titik ${JOPEN + 1}</span>${jbtn('Tutup', 'data-jclose', 'ghost')}</div>
    <h2>${o[1]}</h2><p>${esc(kid ? o[6] : o[2])}</p>${JOPEN > J.stop ? `<p class="jmut">Terbuka setelah ${STOPS[JOPEN - 1][1]}.</p>` : `<div class="jcard" style="background:var(--jsoft)"><b>Amalan</b><p>${esc(kid ? o[7] : o[3])}</p></div>`}
    ${ayatHTML(o[5])}</div></div>` : ''}`;
}

/* ---------------- Pohon Iman 40 hari ---------------- */
function p40Day(P) { return Math.min(40, Math.floor((kOf(todayK()) - kOf(P.start)) / 864e5) + 1); }
function p40Full(P) {   // days where every chosen habit was done (or excused, or shielded)
  const all = jget('day', {}); let n = 0; const out = {};
  for (let i = 0; i < 40; i++) { const k = dkey(jAdd(kOf(P.start), i)); if (k > todayK()) break; const d = all[k] || {};
    const full = P.items.every(h => (d.a || {})[h]); out[k] = full ? 'on' : d.h ? 'h' : (P.shield || {})[k] ? 's' : k === todayK() ? 'now' : 'miss'; if (full || out[k] === 's' || out[k] === 'h') n++; }
  return { n, out };
}
let P40SEL = null;
function render40() {
  const P = jget('40', null), el = $('#v-p40');
  if (!AYAT) loadAyat().then(() => { if (document.body.dataset.view === 'p40') render40(); });
  if (!P || P.done) {
    const sel = P40SEL || ['tilawah', 'latihan', 'telepon'];
    el.innerHTML = `<div class="jw"><section class="jhero" style="background:#0F1D3D;min-height:280px;align-items:center;text-align:center"><img class="bg" src="${jimg('anak/pattern.webp')}" alt="" style="opacity:.18"><div class="jtop">${back('#saya')}</div>
      <img src="${jimg('taman/pohon_iman_1.webp')}" alt="Benih pohon iman" height="110" style="height:110px;width:auto"><h1>40 hari, satu niat</h1><p style="opacity:.85">Tanam 3 sampai 5 amal. Rawat setiap hari sampai akarnya kuat dan berbuah.</p></section>
      ${ayatHTML('p_pohon')}
      <section class="jcard"><label for="niat40"><b>Niatku</b></label><textarea id="niat40" class="inp" rows="3" placeholder="Aku ingin lebih dekat dengan Allah dan lebih sabar di rumah.">${esc((P && P.niat) || '')}</textarea><span class="jmut">Muncul lagi di hari ke-40.</span></section>
      <section class="jcard"><div class="jrow sp"><h2>Pilih amal</h2><span class="jpill">${sel.length} dipilih · 3–5</span></div>
        <div class="jgrid2">${Object.keys(HABITS).map(h => `<button class="jhab" data-p40sel="${h}" aria-pressed="${sel.includes(h)}" style="flex-direction:column;align-items:flex-start">${jicon(HABITS[h].ic)}<b style="font-size:.85rem">${esc(HABITS[h].n)}</b></button>`).join('')}</div></section>
      <section class="jcard" style="background:var(--jsoft)"><span>• Satu hari dihitung jika semua amal pilihan selesai.</span><span>• 1 perisai per pekan untuk hari yang terlewat.</span><span>• Terlewat tanpa perisai? Lanjut, tidak mulai dari nol.</span></section>
      ${jbtn('Bismillah, tanam sekarang', 'data-p40go', 'navy block')}</div>`;
    return;
  }
  const day = p40Day(P), F = p40Full(P), stage = F.n >= 40 ? 4 : F.n >= 20 ? 3 : F.n >= 10 ? 2 : 1, d = dayOf(todayK());
  if (F.n >= 40 && !P.done) { P.done = todayK(); jset('40', P); }
  let cells = ''; for (let i = 0; i < 40; i++) { const k = dkey(jAdd(kOf(P.start), i)), dd = kOf(k), st = F.out[k] || '';
    cells += `<span class="${st === 'on' ? 'on' : st === 's' || st === 'h' ? 'part' : st === 'now' ? 'now' : ''}" title="Hari ${i + 1} · ${niceDate(dd)} · ${hijriTxt(hijri(dd))}">${dd.getDate()}<small>${hijri(dd).d}</small></span>`; }
  const wk = weekKey(), shieldUsed = Object.keys(P.shield || {}).some(k => weekKey(kOf(k)) === wk);
  const missYest = F.out[dkey(jAdd(new Date(), -1))] === 'miss';
  el.innerHTML = `<div class="jw"><section class="jhero" style="min-height:360px;justify-content:flex-end"><img class="bg" src="${jimg('langit/sky_dzuhur.webp')}" alt="" style="object-position:50% 70%">
    <div style="position:absolute;left:0;right:0;bottom:0;height:110px;background:linear-gradient(180deg,#8B5A2B,#B98B54)"></div>
    <div class="jtop">${back('#saya')}<b style="margin:auto">Pohon Iman · 40 Hari</b></div>
    <img src="${jimg('taman/pohon_iman_' + stage + '.webp')}" alt="Pohon iman tahap ${stage} dari 4" style="position:absolute;left:50%;bottom:0;transform:translateX(-50%);height:300px;width:auto">
    <div style="position:relative"><b style="font-size:1.8rem">Hari ${day}</b> <span>dari 40 · ${F.n} hari penuh</span></div></section>
    ${P.done ? `<section class="jcard" style="background:#0F1D3D;color:#fff"><h2>MasyaAllah, pohonmu berbuah!</h2><p>Niatmu: “${esc(P.niat || '')}”</p>${jbtn('Mulai 40 hari baru', 'data-p40new', 'gold')}</section>` : ''}
    <section class="jcard"><div class="jrow sp"><h2>Siram hari ini</h2><span class="jpill">${P.items.filter(h => (d.a || {})[h]).length} dari ${P.items.length}</span></div>${P.items.map(h => habBtn(h, d)).join('')}</section>
    ${missYest && !shieldUsed ? `<section class="jcard" style="background:#FFF4D6"><b>Kemarin terlewat</b><p>Pakai perisai pekan ini supaya kemarin tetap dihitung.</p>${jbtn('Pakai perisai', 'data-p40shield', 'gold')}</section>` : ''}
    <section class="jcard"><div class="jrow sp"><b>${niceDate(kOf(P.start))} – ${niceDate(jAdd(kOf(P.start), 39))}</b></div><div class="jcal">${cells}</div><span class="jmut">Hijau: penuh · Kuning: perisai atau berhalangan · Angka kecil: Hijriah</span></section>
    <section class="jcard" style="background:#0F1D3D;color:#fff"><span style="color:#E9C77B;font-size:.75rem;font-weight:800">NIATKU</span><p>“${esc(P.niat || '')}”</p></section>
    ${ayatHTML('p_40')}</div>`;
}

/* ---------------- Mujahadah: encrypted with its own PIN before it is saved or synced ---------------- */
let MJ = null;   // { key, list } while unlocked
const te = new TextEncoder(), td = new TextDecoder();
const b64 = a => btoa(String.fromCharCode(...new Uint8Array(a))), unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
async function mjKey(pin, salt) { const base = await crypto.subtle.importKey('raw', te.encode(pin), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name:'PBKDF2', salt, iterations:150000, hash:'SHA-256' }, base, { name:'AES-GCM', length:256 }, false, ['encrypt', 'decrypt']); }
async function mjSave() { const iv = crypto.getRandomValues(new Uint8Array(12)), ct = await crypto.subtle.encrypt({ name:'AES-GCM', iv }, MJ.key, te.encode(JSON.stringify(MJ.list)));
  jset('mjh', { v:1, salt:MJ.salt, iv:b64(iv), ct:b64(ct) }); }
function renderMujahadah() {
  const box = jget('mjh', null), el = $('#v-mujahadah');
  if (!AYAT) loadAyat().then(() => { if (document.body.dataset.view === 'mujahadah') renderMujahadah(); });
  if (!MJ) {
    el.innerHTML = `<div class="jw"><section class="jhero" style="background:#0F1D3D;min-height:220px"><img class="bg" src="${jimg('anak/pattern.webp')}" alt="" style="opacity:.15"><div class="jtop">${back('#saya')}</div>
      <span style="font-size:2.4rem">${I('lock')}</span><h1>Mujahadah</h1><p style="opacity:.85">Catatan perjuanganmu melawan kebiasaan buruk. Dikunci dengan PIN sebelum disimpan, jadi tidak ada orang lain yang bisa membaca, termasuk keluarga dan server.</p></section>
      <section class="jcard"><label for="mjPin"><b>${box ? 'Masukkan PIN Mujahadah' : 'Buat PIN Mujahadah (6 angka)'}</b></label>
      <input id="mjPin" class="inp" type="password" inputmode="numeric" maxlength="6" autocomplete="off">
      ${box ? '' : `<input id="mjPin2" class="inp" type="password" inputmode="numeric" maxlength="6" autocomplete="off" placeholder="Ulangi PIN" aria-label="Ulangi PIN"><p class="note" style="margin:0">PIN ini tidak bisa dipulihkan. Kalau lupa, catatan Mujahadah hilang untuk selamanya. Ini harga dari privasi yang sungguhan.</p>`}
      <p id="mjErr" class="jmut" role="alert"></p>${jbtn(box ? 'Buka' : 'Buat dan buka', 'data-mjopen', 'navy block')}</section>${ayatHTML('p_zumar')}</div>`;
    return;
  }
  el.innerHTML = `<div class="jw"><div class="jrow sp" style="padding-top:8px">${back('#saya')}<h1>Mujahadah</h1>${jbtn('Kunci', 'data-mjlock', 'ghost')}</div>
    <section class="jcard"><label for="mjTxt"><b>Catatan hari ini</b></label><textarea id="mjTxt" class="inp" rows="4" placeholder="Apa yang kamu lawan hari ini, dan bagaimana hasilnya?"></textarea>${jbtn('Simpan terkunci', 'data-mjadd', 'green')}</section>
    ${MJ.list.slice().reverse().map(x => `<section class="jcard"><span class="jmut">${niceDate(kOf(x.d))} · ${hijriTxt(hijri(kOf(x.d)))}</span><p>${esc(x.t)}</p></section>`).join('') || '<p class="jmut">Belum ada catatan.</p>'}
    <p class="jmut">Tidak pernah muncul di rekap, liga, atau rekap keluarga.</p></div>`;
}
addEventListener('hashchange', () => { if (!location.hash.startsWith('#mujahadah')) MJ = null; });

/* ---------------- events ---------------- */
document.addEventListener('click', async e => {
  const t = e.target.closest('[data-jam],[data-amk],[data-jh],[data-jhab],[data-saran],[data-hadd],[data-dmon],[data-jp],[data-jnext],[data-jstop],[data-jclose],[data-jkid],[data-p40sel],[data-p40go],[data-p40shield],[data-p40new],[data-mjopen],[data-mjlock],[data-mjadd]');
  if (!t) return;
  const ds = t.dataset, tk = todayK(), view = document.body.dataset.view;
  if (ds.jam !== undefined) { AMOPEN = Number(ds.jam); return renderTaman(); }
  if (ds.amk) { const [p, k] = ds.amk.split(':'); dayPut(tk, d => { d.s = d.s || {}; const s = Object.assign({}, d.s[p] || {}); s[k] = s[k] ? 0 : 1; if (k === 'j' && s.j) s.f = 1; if (k === 'f' && !s.f) s.j = 0; d.s[p] = s; });
    if (k === 'f' && dayOf(tk).s[p].f) jtoast('MasyaAllah! ' + PRN[p] + ' tercatat'); return renderTaman(); }
  if (ds.jh !== undefined) { dayPut(tk, d => { d.h = d.h ? 0 : 1; }); return renderTaman(); }
  if (ds.jhab) { dayPut(tk, d => { d.a = Object.assign({}, d.a || {}); if (d.a[ds.jhab]) delete d.a[ds.jhab]; else d.a[ds.jhab] = 1; }); return RENDER[view](); }
  if (ds.saran !== undefined) { SARAN = !SARAN; return renderAmal(); }
  if (ds.hadd) { const l = myHabits(); jset('habits', l.includes(ds.hadd) ? l.filter(x => x !== ds.hadd) : l.concat(ds.hadd)); return renderAmal(); }
  if (ds.dmon) { const m = DMON.m + Number(ds.dmon); DMON = { y:DMON.y + Math.floor(m / 12), m:((m % 12) + 12) % 12 }; return renderDetail(); }
  if (ds.jp !== undefined) { dayPut(tk, d => { d.jp = d.jp ? 0 : 1; }); return renderSaya(); }
  if (ds.jnext !== undefined) { const J = jget('jalan', {}); jset('jalan', { stop:Math.min(STOPS.length - 1, (J.stop || 0) + 1), since:dkey(jAdd(new Date(), 1)) }); jtoast('Bab baru dimulai. Bismillah!'); return renderSaya(); }
  if (ds.jstop !== undefined) { JOPEN = Number(ds.jstop); return renderPerjalanan(); }
  if (ds.jclose !== undefined && (e.target === t || t.tagName === 'BUTTON')) { JOPEN = null; return renderPerjalanan(); }
  if (ds.jkid !== undefined) { e.preventDefault(); JKID = ds.jkid === '1'; return renderPerjalanan(); }
  if (ds.p40sel) { const s = P40SEL || ['tilawah', 'latihan', 'telepon']; P40SEL = s.includes(ds.p40sel) ? s.filter(x => x !== ds.p40sel) : s.length < 5 ? s.concat(ds.p40sel) : s; return render40(); }
  if (ds.p40go !== undefined) { const s = P40SEL || ['tilawah', 'latihan', 'telepon']; if (s.length < 3) return jtoast('Pilih minimal 3 amal');
    jset('40', { start:tk, niat:($('#niat40').value || '').trim(), items:s, shield:{} }); const hb = myHabits(); jset('habits', hb.concat(s.filter(x => !hb.includes(x)))); return render40(); }
  if (ds.p40shield !== undefined) { const P = jget('40', null); P.shield = Object.assign({}, P.shield, { [dkey(jAdd(new Date(), -1))]:1 }); jset('40', P); return render40(); }
  if (ds.p40new !== undefined) { jset('40', null); P40SEL = null; return render40(); }
  if (ds.mjopen !== undefined) {
    const pin = ($('#mjPin').value || '').trim(), err = $('#mjErr'), box = jget('mjh', null);
    if (!/^\d{6}$/.test(pin)) { err.textContent = 'PIN harus 6 angka.'; return; }
    if (!box) { if (pin !== ($('#mjPin2').value || '').trim()) { err.textContent = 'Kedua PIN tidak sama.'; return; }
      const salt = b64(crypto.getRandomValues(new Uint8Array(16))); MJ = { salt, key:await mjKey(pin, unb64(salt)), list:[] }; await mjSave(); return renderMujahadah(); }
    try { const key = await mjKey(pin, unb64(box.salt)), pt = await crypto.subtle.decrypt({ name:'AES-GCM', iv:unb64(box.iv) }, key, unb64(box.ct)); MJ = { salt:box.salt, key, list:JSON.parse(td.decode(pt)) }; renderMujahadah(); }
    catch (x) { err.textContent = 'PIN salah.'; }
    return;
  }
  if (ds.mjlock !== undefined) { MJ = null; return renderMujahadah(); }
  if (ds.mjadd !== undefined) { const v = ($('#mjTxt').value || '').trim(); if (!v) return; MJ.list.push({ d:tk, t:v }); await mjSave(); jtoast('Tersimpan terkunci'); return renderMujahadah(); }
});
document.addEventListener('change', e => {
  const t = e.target.closest('[data-jset]'); if (!t) return;
  setSetting(t.dataset.jset, t.type === 'checkbox' ? t.checked : t.value); jtoast('Tersimpan');
});

/* ---------- Peti Jumat requests from the children, approved from a parent's own profile ---------- */
const PUNL = new Set();
function petiInbox() {
  const kids = (PROFILES || []).filter(p => p.id !== CUR && kidMode(p.id));
  const rows = [];
  kids.forEach(p => Object.entries(pget(p.id, 'jlb:peti', {}) || {}).forEach(([k, r]) => { if (r && r.st === 'req') rows.push({ p, k, r }); }));
  if (!rows.length) return '';
  const locked = rows.some(x => !PUNL.has(x.p.id));
  return `<section class="jcard" style="border:2px solid var(--jy)"><div class="jrow"><img src="${jimg('anak/chest.webp')}" alt="" width="48" height="48"><h2>Permintaan Peti Jumat</h2></div>
    ${locked ? '<label for="pqPin" class="jmut">Masukkan PIN orang tua, lalu pilih Setujui atau Tolak</label><input id="pqPin" class="inp" type="password" inputmode="numeric" maxlength="4" autocomplete="off"><p id="pqErr" class="jmut" role="alert"></p>' : ''}
    ${rows.map(x => { const S = petiState(x.p.id); return `<div class="jrow sp" style="flex-wrap:wrap;gap:8px"><span><b>${esc(x.p.name)}</b> minta ${x.r.min} menit main<br><span class="jmut">Sisa pekan ini ${S.left} dari ${S.cap} menit · ${niceDate(new Date(x.r.at))}</span></span>
      <span class="jrow">${jbtn('Setujui', `data-preq="${x.p.id}|${x.k}|ok"`, 'green')}${jbtn('Tolak', `data-preq="${x.p.id}|${x.k}|no"`, 'ghost')}</span></div>`; }).join('')}</section>`;
}
document.addEventListener('click', async e => {
  const b = e.target.closest('[data-preq]'); if (!b) return;
  const [kid, k, st] = b.dataset.preq.split('|'), O = pget(kid, 'jlb:ortu', {}) || {};
  if (!PUNL.has(kid)) {
    const pin = (($('#pqPin') || {}).value || '').trim(), err = $('#pqErr');
    if (!/^\d{4}$/.test(pin)) { if (err) err.textContent = 'Masukkan PIN orang tua (4 angka).'; return; }
    const h = await pinHash('ortu:' + kid, pin);
    if (!O.pin) pset(kid, 'jlb:ortu', Object.assign({}, O, { pin:h }));
    else if (h !== O.pin) { if (err) err.textContent = 'PIN salah.'; return; }
    PUNL.add(kid);
  }
  const R = Object.assign({}, pget(kid, 'jlb:peti', {}) || {});
  if (R[k]) { R[k] = Object.assign({}, R[k], { st, at:Date.now() }); pset(kid, 'jlb:peti', R); }
  jtoast(st === 'ok' ? 'Disetujui. Selamat bermain!' : 'Permintaan ditolak.');
  if (typeof syncSoon === 'function') syncSoon(1500);
  renderTaman();
});
addEventListener('hashchange', () => PUNL.clear());
