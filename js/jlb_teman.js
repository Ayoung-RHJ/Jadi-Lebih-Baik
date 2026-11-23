/* =========================================================
   Jimon lebih hidup (anak): suasana hati, kamar baru, beri ikan, main bersama (5 permainan),
   Surat Jumat dan stiker pekanan. Tanpa video: pose gambar + animasi CSS.
   Semua di jlb:jimon (per orang, ikut sinkron): full/hap + mat (waktu terakhir dihitung), fed, fishFrom,
   play { tanggal: kali }, kisah (tanggal), stk { pekan: stiker }.
   Main bersama tidak memberi XP: hanya menaikkan hati Senang, maksimal 3 kali sehari.
   ========================================================= */
const JPOSE = p => jimg('jimon/pose/p_' + p + '.webp');
const JBRG = b => jimg('jimon/barang/b_' + b + '.webp');
const JSTK = ['bintang', 'buku', 'bulan', 'hati', 'jimon_jempol', 'lentera', 'masjid', 'tetes'];
const JSTK_N = { bintang:'Bintang', buku:'Buku', bulan:'Bulan', hati:'Hati', jimon_jempol:'Jimon jempol', lentera:'Lentera', masjid:'Masjid', tetes:'Tetes air' };
const JPLAY_MAX = 3;
const jshuf = a => a.map(x => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map(p => p[1]);
const jclamp = v => Math.max(5, Math.min(100, Math.round(v)));

/* ---- suasana hati: turun pelan saat lama tidak dibuka, tidak pernah menghukum ---- */
function jimonState() {
  const J = jget('jimon', {}) || {}, tk = todayK(), h = Math.max(0, (Date.now() - (J.mat || Date.now())) / 36e5);
  const full = jclamp((J.full ?? 60) - h * 3), hap = jclamp((J.hap ?? 70) - h * 2);
  const dirt = jimonDirt(), since = J.bath ? Math.round((kOf(tk) - kOf(J.bath)) / 864e5) : 2;
  const clean = dirt >= 2 ? 10 : dirt === 1 ? 35 : jclamp(100 - since * 15);
  const from = J.fishFrom || tk, days = jget('day', {}) || {};
  const earned = Object.keys(days).filter(k => k >= from).reduce((a, k) => a + Object.keys(days[k].m || {}).filter(m => days[k].m[m]).length, 0);
  const fish = Math.max(0, 3 + earned - (J.fed || 0));
  const plays = (J.play || {})[tk] || 0;
  return { J, full, hap, clean, dirt, fish, plays, left:Math.max(0, JPLAY_MAX - plays) };
}
function jimonSave(fn) {
  const S = jimonState(), J = Object.assign({}, S.J, { full:S.full, hap:S.hap, mat:Date.now() });
  if (!J.fishFrom) J.fishFrom = todayK();
  fn && fn(J, S); J.full = jclamp(J.full); J.hap = jclamp(J.hap); jset('jimon', J); return J;
}
/* events from elsewhere: 'elus', 'main', 'kisah', 'makan', 'mandi' */
function jimonMood(ev) {
  return jimonSave(J => {
    if (ev === 'elus') J.hap += 3;
    if (ev === 'main') { J.hap += 15; J.play = Object.assign({}, J.play || {}); const tk = todayK(); J.play[tk] = (J.play[tk] || 0) + 1;
      Object.keys(J.play).sort().slice(0, -7).forEach(k => delete J.play[k]); }
    if (ev === 'kisah') { J.hap += 10; J.kisah = todayK(); }
    if (ev === 'makan') { J.full += 25; J.hap += 5; J.fed = (J.fed || 0) + 1; }
    if (ev === 'mandi') J.hap += 5;
  });
}

/* ---- pujian spesifik dari catatan anak ---- */
function jimonPraise(S) {
  if (S.full < 30) return 'Perutku keroncongan… ada ikan untukku?';
  const tk = todayK(), days = jget('day', {}) || {}, d = days[tk] || {};
  let run = 0; for (let i = (d.s && d.s.subuh && d.s.subuh.f) ? 0 : 1; i < 60; i++) { const x = days[dkey(jAdd(new Date(), -i))]; if (x && x.s && x.s.subuh && x.s.subuh.f) run++; else break; }
  if (run >= 3) return 'MasyaAllah, kamu sholat Subuh ' + run + ' hari berturut-turut! Aku bangga!';
  if (PR.every(p => d.s && d.s[p] && d.s[p].f)) return 'Lima lentera menyala hari ini. Aku senang sekali!';
  if (S.J.kisah === tk) return 'Terima kasih sudah membaca kisah bersamaku hari ini!';
  const today = Object.keys(d.m || {}).filter(m => d.m[m]);
  const first = today.find(m => !Object.keys(days).some(k => k < tk && (days[k].m || {})[m]));
  if (first && typeof kmDef === 'function' && kmDef(first) && Object.keys(days).length > 1) return 'Wah, hari ini kamu pertama kali “' + kmDef(first).n + '”. Keren!';
  if (today.length) return 'Sudah ' + today.length + ' misi hari ini. Semangat terus!';
  const sl = slotNow(new Date());
  return sl === 'isya' || sl === 'malam' ? 'Sudah malam. Jangan lupa doa sebelum tidur ya.' : sl === 'subuh' || sl === 'pagi' ? 'Selamat pagi! Hari ini kita berbuat baik apa ya?' : 'Halo! Aku senang kamu datang.';
}
const jmoodBars = S => `<div class="jmoods">${[['Kenyang', S.full, '#F2994A'], ['Bersih', S.clean, '#2F80ED'], ['Senang', S.hap, '#EB5757']].map(([n, v, c]) =>
  `<div><span>${n}</span><i role="meter" aria-label="${n}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${v}"><b style="width:${v}%;background:${c}"></b></i></div>`).join('')}</div>`;

/* ---- kamar Jimon (dipakai oleh renderKamar di jlb_kids.js) ---- */
let KEAT = false, KSAY = '';
function jimonRoomHTML(o) {
  const S = jimonState(), J = S.J, wear = jWear(J.wear), tidur = jTidur(J);
  let cat, fx = '';
  if (o.bath) { cat = `<img src="${jimg('jimon/keadaan/j_mandi.webp')}" alt="Jimon mandi busa" class="jwig jk-cat">`;
    fx = [10, 25, 40, 55, 70, 85].map((x, i) => `<span class="jbub" style="left:${x}%;bottom:${60 + i % 3 * 30}px;width:${16 + i % 3 * 8}px;height:${16 + i % 3 * 8}px;animation-delay:${i * .15}s"></span>`).join(''); }
  else if (KEAT) cat = `<img src="${JPOSE('makan')}" alt="Jimon makan" class="jk-cat jm-eat">`;
  else if (o.dirt) cat = `<img src="${jimg('jimon/keadaan/j_debu.webp')}" alt="Jimon berdebu" class="jk-cat">`;
  else if (tidur) { cat = J.piyama ? `<img src="${JPOSE('piyama_tidur')}" alt="Jimon tidur memakai piyama" class="jk-cat jm-sleep" style="height:min(150px,34vw)">` : `<img src="${JPOSE('sembunyi_selimut')}" alt="Jimon tidur di balik selimut" class="jk-cat jm-sleep">`; fx = '<span class="jzz z1">z</span><span class="jzz z2">z</span><span class="jzz z3">Z</span>'; }
  else if (KSAY && S.full >= 90 && o.fed) cat = `<img src="${JPOSE('kenyang')}" alt="Jimon kenyang" class="jk-cat jwig">`;
  else if (S.full < 30) cat = `<img src="${JPOSE('lapar')}" alt="Jimon lapar" class="jk-cat jbreathe">`;
  else cat = jimonHTML({ face:o.pet % 2 ? 'dengkur' : 'senang', wear, w:170, blink:!(o.pet % 2), cls:'jbreathe' });
  if (o.pet % 2 && !o.dirt && !o.bath && !KEAT) fx += '<span class="jheart" style="left:52%;bottom:210px">♥</span><span class="jheart" style="left:40%;bottom:190px;animation-delay:.3s">♥</span>';
  const say = KSAY || (o.dirt ? JWORD[Math.min(2, o.dirt)] : tidur ? 'Zzz… (ketuk “Bangun” di Hiasan Jimon)' : jimonPraise(S));
  const night = typeof jroomNight === 'function' && jroomNight(), edit = typeof JEDIT !== 'undefined' && JEDIT;
  return `<section class="jkamar${night ? ' night' : ''}${edit ? ' edit' : ''}" aria-label="Kamar Jimon"><img class="bg" src="${jimg('jimon/kamar.webp')}" alt="" width="900" height="1003" decoding="async">
    ${typeof jroomDecor === 'function' ? jroomDecor() : ''}
    ${jmoodBars(S)}<div class="jk-bub" aria-live="polite">${esc(say)}</div>
    <img class="jk-bed" src="${JBRG('bantal')}" alt="" width="320" height="222">${KEAT ? '' : `<img class="jk-bowl" src="${JBRG('mangkuk_makan')}" alt="" width="320" height="213">`}
    <a class="jk-peti" href="#peti" aria-label="Peti Jumat"><img src="${jimg('anak/chest.webp')}" alt="" width="64" height="64"></a>
    <span class="jk-lv">Level ${o.lv}</span>
    <button class="cat" data-kpet aria-label="Elus Jimon">${cat}</button>${fx}</section>
  <section class="jcard jk-fish" style="background:var(--jkidcard)"><img src="${JBRG('ikan')}" alt="" width="64" height="29"><span><b>${S.fish} ikan</b><br><span class="jmut">Dapat 1 ikan setiap misi selesai</span></span>${jbtn('Beri ikan', 'data-kfeed ' + (S.fish && !KEAT && !o.bath ? '' : 'disabled'), 'green')}</section>
  <div class="jgrid2"><a class="jcard jk-act blue" href="#main"><b>Main bersama</b><span>${S.left ? S.left + ' kali lagi hari ini' : 'Besok main lagi ya'}</span></a>
    <button class="jcard jk-act" data-kbath ${o.canBath ? '' : 'disabled'}><b>Mandikan</b><span class="jmut">${o.dirt ? (o.missDone ? 'Ayo mandi!' : 'Selesaikan 1 misi dulu') : J.bath === todayK() ? 'Sudah wangi hari ini' : 'Biar wangi'}</span></button></div>
  ${suratOpen() ? `<a class="jcard jk-surat" href="#surat"><img src="${JPOSE('menulis')}" alt="" width="70" height="83"><span><b>Surat Jumat dari Jimon</b><br><span class="jmut">${suratSticker() ? 'Ada stiker pekan ini!' : 'Baca lagi suratnya'}</span></span></a>` : ''}`;
}

/* ---------------- Main bersama ---------------- */
const JGAMES = [
  { id:'bola', n:'Kejar bola benang', d:'Ketuk bola benang secepat mungkin', lv:1, skill:'Refleks', img:JBRG('bola_benang'), c:'#EB5757', how:'Ketuk bola benang sebelum Jimon menangkapnya. 30 detik.' },
  { id:'tiru', n:'Jimon menirukan', d:'Jimon bergerak, kamu menirukan', lv:1, skill:'Gerak badan', img:JPOSE('lompat'), c:'#0E7C66', how:'Jimon memperagakan 5 gerakan. Tirukan, lalu tekan Sudah. Tanpa kamera.' },
  { id:'cari', n:'Cari Jimon', d:'Jimon bersembunyi di kamar', lv:1, skill:'Fokus', img:JPOSE('intip_kardus'), c:'#2450D6', how:'Jimon bersembunyi di balik salah satu benda. Temukan dia dalam 3 kali tebak. Makin lama makin banyak tempat.' },
  { id:'suara', n:'Tebak suara', d:'Dengar suaranya, pilih gambarnya', lv:2, skill:'Mendengar', img:jimg('jimon/pelatih/pelatih_peluit.webp'), c:'#A85705', how:'Dengarkan suaranya, lalu pilih gambar yang cocok. 5 suara.' },
  { id:'adab', n:'Susun adab makan Jimon', d:'Urutkan adab sebelum sampai sesudah makan', lv:3, skill:'Adab', img:JBRG('mangkuk_makan'), c:'#6B3FC4', how:'Susun kartu adab makan dengan urutan yang benar, lalu Jimon makan dengan lahap.' },
  /* jlb14: Main bersama Musim 2, canvas games in js/jlb_main2.js (engines adapted from the WIRTIX games) */
  { id:'pulang', n:'Jimon Pulang Sebelum Maghrib', d:'Lari pulang, lompati genangan dan pagar', lv:4, skill:'Lincah', img:jimg('main2/j_lari1.webp'), c:'#E07A2E', ext:1, how:'Ketuk bagian ATAS layar untuk melompat, ketuk bagian BAWAH untuk meluncur di bawah jemuran. Kumpulkan ikan dan sampai rumah sebelum Maghrib.' },
  { id:'hujan', n:'Hujan Bintang Jimon', d:'Tangkap bintang dengan keranjang', lv:5, skill:'Fokus', img:jimg('main2/bintang.webp'), c:'#2F80ED', ext:1, how:'Geser jari ke kiri dan kanan. Tangkap bintang, ikan, dan bulan. Hindari awan petir. 45 detik.' },
  { id:'menara', n:'Menara Kardus Jimon', d:'Susun kardus setinggi mungkin', lv:6, skill:'Sabar', img:jimg('main2/k_kardus3.webp'), c:'#A0703C', ext:1, how:'Kardus berayun di tali. Ketuk layar saat kardus tepat di atas menara. Pelan-pelan, jangan sampai miring!' },
  { id:'kejar', n:'Jimon Kejar Tikus', d:'Kejar tikus mainan, lalu rapikan kamar', lv:7, skill:'Lincah', img:jimg('main2/t_tikus.webp'), c:'#8E5BD6', ext:1, how:'Tahan dan geser jari, Jimon berlari ke arah jarimu dan meluncur di lantai licin. Tangkap tikus mainan. Setelah itu, ketuk barang yang berantakan supaya rapi lagi.' },
  { id:'masak', n:'Masak Sup Jimon', d:'Potong bahan, masukkan ke panci', lv:8, skill:'Cekatan', img:jimg('main2/panci.webp'), c:'#C2453A', ext:1, how:'Usap layar untuk memotong bahan yang dilempar. Potongannya masuk panci. Jangan potong kaus kaki dan sandal! 30 detik. Di dapur sungguhan, pakai pisau bersama Ayah atau Ibu ya.' }
];
let JG = null;    // permainan yang sedang berjalan
function renderMain() {
  const a = ROUTE_ARG, S = jimonState(), lv = levelOf(xpTotal()).l;
  if (a && JGAMES.some(g => g.id === a)) { const g = JGAMES.find(x => x.id === a); if (g.lv > lv) { location.hash = '#main'; return; } return renderGame(g); }
  JG = null;
  $('#v-main').innerHTML = `<div class="jw jkidw"><div class="jrow" style="padding-top:8px">${back('#saya')}<h1>Main bersama Jimon</h1>${jsoundBtn()}</div>
    <section class="jkamar short"><img class="bg" src="${jimg('jimon/kamar.webp')}" alt="" width="900" height="1003"><div class="jk-bub">${S.left ? 'Mau main apa hari ini? Pilih satu ya!' : 'Hari ini sudah 3 kali main. Besok kita main lagi ya!'}</div>
      <img class="jk-cat jbreathe" src="${JPOSE('main_bola')}" alt="Jimon bermain bola benang" style="position:absolute;left:50%;bottom:16px;transform:translateX(-50%);height:150px;width:auto"></section>
    <div class="jrow sp"><b>${S.left} dari ${JPLAY_MAX} kali main tersisa hari ini</b><span class="jtok">${[0, 1, 2].map(k => `<i class="${k < S.left ? 'on' : ''}"></i>`).join('')}</span></div>
    <div class="ka-list">${JGAMES.map(g => { const lock = g.lv > lv;
      return `<a class="ka-row jg-row ${lock ? 'lock' : ''}" href="${lock ? '#main' : '#main/' + g.id}" ${lock ? `data-jglock="${g.lv}"` : ''}><span class="jg-ic" style="background:${g.c}"><img src="${g.img}" alt="" loading="lazy"></span><span class="ka-rt"><b>${g.n}</b><span class="jmut">${g.d}</span></span><span class="ka-st ${lock ? '' : 'new'}">${lock ? 'Level ' + g.lv : g.skill}</span></a>`; }).join('')}</div>
    <p class="jmut">Kegiatan baru terbuka saat level naik. Semua kegiatan berbagi jatah 3 kali main sehari dan hanya menaikkan hati Senang Jimon, tanpa XP.</p></div>`;
}
function gameShell(g, inner, sub = '') {
  $('#v-main').innerHTML = `<div class="jw jkidw"><div class="jrow" style="padding-top:8px">${back('#main')}<h1 style="font-size:1.3rem">${g.n}</h1><span class="jg-sub" id="jgSub">${sub}</span>${jsoundBtn()}</div>${inner}</div>`;
}
function gameIntro(g) {
  const S = jimonState();
  return gameShell(g, `<section class="jcard" style="align-items:center;text-align:center;background:var(--jkidcard)"><img src="${g.img}" alt="" style="height:130px;width:auto" class="jbreathe"><h2>${g.n}</h2><span class="jmut">${g.how}</span>${g.ext && ((S.J.rek || {})[g.id]) ? `<span class="jpill">Rekormu: ${S.J.rek[g.id]}</span>` : ''}
    ${S.left ? jbtn('Mulai main', 'data-jgstart', 'block') : '<p class="note">Hari ini sudah 3 kali main. Besok kita main lagi ya!</p>'}<span class="jmut">${S.left} dari ${JPLAY_MAX} kali main tersisa hari ini</span></section>`);
}
function gameEnd(g, title, sub, img) {
  const S = jimonState();
  JG.phase = 'end';
  gameShell(g, `<section class="jcard" style="align-items:center;text-align:center;background:var(--jkidcard)"><img src="${img || JPOSE('lompat')}" alt="Jimon gembira" class="ka-hop" style="height:150px;width:auto"><h2>${title}</h2><span class="jmut">${sub}</span>
    <span class="jmut">Hati Senang Jimon naik. Sisa ${S.left} kali main hari ini.</span>${S.left ? jbtn('Main lagi', 'data-jgstart', 'block') : ''}<a class="jb ghost block" href="#main">Pilih permainan lain</a></section>`);
}
function renderGame(g) {
  if (!JG || JG.id !== g.id) JG = { id:g.id, phase:'intro' };
  if (JG.phase !== 'run') return gameIntro(g);
  if (g.ext) return typeof g2Run === 'function' ? g2Run(g) : null;
  ({ bola:paintBola, tiru:paintTiru, cari:paintCari, suara:paintSuara, adab:paintAdab })[g.id](g);
}
function gameStart(g) {
  if (!jimonState().left) return;
  jimonMood('main'); if (JG) { cancelAnimationFrame(JG.raf); JG.p = null; }
  JG = { id:g.id, phase:'run', score:0, round:0, tries:0 };
  if (g.id === 'bola') { JG.t = 30; JG.p = null; }
  if (g.id === 'tiru') JG.moves = jshuf(JTIRU).slice(0, 5);
  if (g.id === 'cari') cariRound();
  if (g.id === 'suara') { JG.list = jshuf(Object.keys(JSUARA)).slice(0, 5); suaraRound(); }
  if (g.id === 'adab') { JG.cards = jshuf(JADAB.map((_, i) => i)); JG.seq = []; JG.chk = false; }
  jvoice('c_mulai');
  renderGame(g);
}

/* 1. Kejar bola benang: the ball rolls and bounces continuously (requestAnimationFrame, GPU transforms),
   Jimon runs after it, a tap counts on touch-down. Speed grows a little with every catch. */
function paintBola(g) {
  gameShell(g, `<section class="jg-arena" id="jgArena"><div class="jg-score" id="jgScore">${JG.score} tangkap</div>
    <img class="jg-cat" id="jgCat" src="${jimonFace('senang')}" alt="Jimon mengejar bola">
    <button class="jg-ball" id="jgBall" aria-label="Tangkap bola benang"><img src="${JBRG('bola_benang')}" alt="" width="70" height="77" draggable="false"></button>
    <div class="jg-pops" id="jgPops" aria-hidden="true"></div></section>
    <p class="jmut">Ketuk bola benang yang menggelinding. 30 detik, maksimal 3 kali sehari. Setiap main menaikkan hati Senang Jimon, tanpa XP.</p>`, JG.t + ' detik');
  bolaRun(g);
}
function bolaRun(g) {
  const A = $('#jgArena'), B = $('#jgBall'), C = $('#jgCat'); if (!A || !B) return;
  const R = 35;                                    // ball radius in px (picture 70 px)
  const W = () => A.clientWidth, H = () => A.clientHeight;
  const P = JG.p = JG.p || { x:W() / 2, y:H() * .3, vx:170, vy:0, rot:0, cx:W() / 2, face:1, last:0, end:performance.now() + JG.t * 1000, pop:0 };
  const launch = () => { const sp = 170 + Math.min(JG.score, 20) * 9, ang = (Math.random() * .5 + .25) * Math.PI;
    P.x = R + Math.random() * (W() - 2 * R); P.y = R + 4; P.vx = Math.cos(ang) * sp * (Math.random() < .5 ? -1 : 1); P.vy = Math.sin(ang) * sp * .4; };
  JG.launch = launch;
  const step = now => {
    if (!JG || JG.id !== 'bola' || JG.phase !== 'run' || document.body.dataset.view !== 'main' || !A.isConnected) return;
    const dt = Math.min(.05, P.last ? (now - P.last) / 1000 : 0); P.last = now;
    if (P.pop > 0) P.pop -= dt;
    else {
      P.vy += 520 * dt;                            // a soft bounce like a yarn ball
      P.x += P.vx * dt; P.y += P.vy * dt;
      if (P.x < R) { P.x = R; P.vx = Math.abs(P.vx); } if (P.x > W() - R) { P.x = W() - R; P.vx = -Math.abs(P.vx); }
      const floor = H() - R - 8;
      if (P.y > floor) { P.y = floor; P.vy = -Math.max(380, Math.abs(P.vy) * .82); }
      if (P.y < R) { P.y = R; P.vy = Math.abs(P.vy); }
      P.rot += P.vx * dt * 2.2;
    }
    P.cx += (P.x - P.cx) * Math.min(1, dt * 3.2);    // Jimon follows smoothly
    if (Math.abs(P.x - P.cx) > 6) P.face = P.x > P.cx ? 1 : -1;
    B.style.transform = `translate3d(${(P.x - R).toFixed(1)}px,${(P.y - R).toFixed(1)}px,0)`;
    B.firstChild.style.transform = `rotate(${P.rot.toFixed(0)}deg)${P.pop > 0 ? ` scale(${(1 + P.pop * 1.6).toFixed(2)})` : ''}`;
    B.style.opacity = P.pop > 0 ? Math.max(0, P.pop / .25).toFixed(2) : 1;
    if (C) C.style.transform = `translate3d(${(P.cx - C.clientWidth / 2).toFixed(1)}px,0,0) scaleX(${P.face})`;
    const left = Math.max(0, Math.ceil((P.end - now) / 1000));
    if (left !== JG.t) { JG.t = left; const s = $('#jgSub'); if (s) s.textContent = left + ' detik'; }
    if (left <= 0) { JG.p = null; jvoice('c_selesai'); return gameEnd(g, 'Hore! ' + JG.score + ' kali tertangkap!', JG.score >= 15 ? 'Refleksmu cepat sekali!' : 'Seru! Ayo coba lagi besok.'); }
    JG.raf = requestAnimationFrame(step);
  };
  cancelAnimationFrame(JG.raf); P.last = 0; JG.raf = requestAnimationFrame(step);
  B.onpointerdown = e => { e.preventDefault(); if (!JG || JG.phase !== 'run' || P.pop > 0) return;
    JG.score++; const s = $('#jgScore'); if (s) s.textContent = JG.score + ' tangkap';
    const pp = $('#jgPops'); if (pp) { const el = document.createElement('span'); el.textContent = '+1'; el.style.left = P.x + 'px'; el.style.top = (P.y - 20) + 'px'; pp.appendChild(el); setTimeout(() => el.remove(), 700); }
    if (C) { C.classList.remove('jg-jump'); void C.offsetWidth; C.classList.add('jg-jump'); C.src = JPOSE('lompat'); clearTimeout(JG.ct); JG.ct = setTimeout(() => { C.src = jimonFace('senang'); }, 450); }
    jvoice(JG.score % 4 === 0 ? jpick(['meong_1', 'meong_2', 'meong_3']) : 'b_benar1');
    P.pop = .25; setTimeout(() => { if (JG && JG.phase === 'run') launch(); }, 250); };
}
document.addEventListener('visibilitychange', () => { if (!JG || JG.id !== 'bola' || JG.phase !== 'run' || !JG.p) return;
  if (document.hidden) JG.p.paused = JG.p.end - performance.now();
  else if (JG.p.paused) { JG.p.end = performance.now() + JG.p.paused; JG.p.paused = 0; JG.p.last = 0; } });

/* 2. Jimon menirukan */
const JTIRU = [['Lompat di tempat 3 kali', 'jimon/pose/p_lompat.webp'], ['Angkat kedua tangan tinggi-tinggi', 'jimon/pelatih/pelatih_regang.webp'], ['Jongkok seperti katak', 'jimon/pelatih/pelatih_katak.webp'],
  ['Pukul jab pelan ke depan', 'jimon/pelatih/pelatih_jab.webp'], ['Tarik napas dalam-dalam', 'jimon/pelatih/pelatih_napas.webp'], ['Acungkan jempol', 'jimon/pelatih/pelatih_jempol.webp'],
  ['Lambaikan tangan', 'jimon/suasana/melambai.webp'], ['Bersorak gembira', 'jimon/pelatih/pelatih_sorak.webp']];
function paintTiru(g) {
  const m = JG.moves[JG.round];
  gameShell(g, `<section class="jcard" style="align-items:center;text-align:center;background:var(--jkidcard)"><span class="jpill">Gerakan ${JG.round + 1} dari 5</span>
    <img src="${jimg(m[1])}" alt="" class="ka-hop" style="height:200px;width:auto"><h2>${m[0]}</h2><span class="jmut">Tirukan Jimon di depan HP, lalu tekan Sudah.</span>${jbtn('Sudah!', 'data-jgtiru', 'green block')}</section>`);
}

/* 3. Cari Jimon */
const JSPOT = [['kardus', JBRG('kardus'), JPOSE('intip_kardus')], ['bantal', JBRG('bantal'), JPOSE('sembunyi_selimut')], ['peti', jimg('anak/chest.webp'), jimonFace('tertawa')],
  ['mangkuk', JBRG('mangkuk_makan'), jimonFace('kaget')], ['amplop', JBRG('amplop'), jimonFace('kedip')]];
function cariRound() { const n = Math.min(5, 3 + JG.round); JG.spots = jshuf(JSPOT.slice()).slice(0, n); JG.hide = Math.floor(Math.random() * n); JG.miss = []; JG.found = false; JG.tries = 0; }
function paintCari(g) {
  gameShell(g, `<section class="jcard" style="background:var(--jkidcard)"><span class="jpill">Ronde ${JG.round + 1} dari 3 · ${3 - JG.tries} tebakan lagi</span>
    <h2>${JG.found ? 'Ketemu!' : JG.tries >= 3 ? 'Ternyata di sini!' : 'Jimon bersembunyi di mana, ya?'}</h2>
    <div class="jg-spots">${JG.spots.map((s, i) => { const show = (JG.found || JG.tries >= 3) && i === JG.hide, miss = JG.miss.includes(i);
      return `<button data-jgspot="${i}" class="${miss ? 'no' : ''} ${show ? 'ok' : ''}" ${JG.found || JG.tries >= 3 || miss ? 'disabled' : ''} aria-label="${s[0]}"><img src="${s[1]}" alt="">${show ? `<img class="jg-peek ka-hop" src="${s[2]}" alt="Jimon">` : ''}${i === JG.hide && !show && JG.miss.length >= 2 ? '<i class="jg-tail" aria-hidden="true"></i>' : ''}</button>`; }).join('')}</div>
    ${JG.found || JG.tries >= 3 ? jbtn(JG.round < 2 ? 'Ronde berikutnya' : 'Selesai', 'data-jgnext', 'block') : '<span class="jmut">Petunjuk: lihat baik-baik, kadang ujung ekornya terlihat.</span>'}</section>`);
}

/* 4. Tebak suara */
const JSUARA = { bel:['Bel', '🔔'], burung:['Burung berkicau', '🐦'], dengkur:['Kucing mendengkur', 'img:jimon/ekspresi/e_dengkur.webp'], hujan:['Hujan', '🌧️'],
  jam:['Jam', '⏰'], keran:['Air keran', '🚰'], ketuk:['Pintu diketuk', '🚪'], peluit:['Peluit', 'img:jimon/pelatih/pelatih_peluit.webp'] };
function suaraRound() { const k = JG.list[JG.round]; JG.ans = k; JG.opts = jshuf([k].concat(jshuf(Object.keys(JSUARA).filter(x => x !== k)).slice(0, 2))); JG.pick = null; setTimeout(() => jvoice('t_' + k), 350); }
const suaraPic = v => v.startsWith('img:') ? `<img src="${jimg(v.slice(4))}" alt="">` : `<span aria-hidden="true">${v}</span>`;
function paintSuara(g) {
  gameShell(g, `<section class="jcard" style="align-items:center;text-align:center;background:var(--jkidcard)"><span class="jpill">Suara ${JG.round + 1} dari 5 · benar ${JG.score}</span>
    ${jbtn('Dengar lagi', 'data-jgdengar', 'gold')}<h2>Itu suara apa?</h2>
    <div class="jg-sounds">${JG.opts.map(k => `<button data-jgsuara="${k}" class="${JG.pick ? (k === JG.ans ? 'ok' : k === JG.pick ? 'no' : '') : ''}" ${JG.pick ? 'disabled' : ''}>${suaraPic(JSUARA[k][1])}<b>${JSUARA[k][0]}</b></button>`).join('')}</div>
    ${JG.pick ? `<b>${JG.pick === JG.ans ? 'Benar! Telingamu tajam.' : 'Hampir! Itu suara ' + JSUARA[JG.ans][0].toLowerCase() + '.'}</b>${jbtn(JG.round < 4 ? 'Suara berikutnya' : 'Selesai', 'data-jgnext', 'block')}` : ''}</section>`);
}

/* 5. Susun adab makan */
const JADAB = ['Cuci tangan', 'Membaca Bismillah', 'Makan dengan tangan kanan', 'Membaca Alhamdulillah'];
function paintAdab(g) {
  const ok = JG.chk && JG.seq.every((v, k) => v === k);
  gameShell(g, `<section class="jcard" style="background:var(--jkidcard)"><h2>Urutkan adab makan Jimon</h2><span class="jmut">Ketuk kartu sesuai urutan, dari sebelum makan sampai sesudah makan.</span>
    <div class="ka-opts">${JG.cards.map(j => { const p = JG.seq.indexOf(j), good = JG.chk && p === j;
      return `<button data-jgadab="${j}" class="ka-ur ${p >= 0 ? 'sel' : ''} ${JG.chk ? (good ? 'ok' : 'no') : ''}" ${ok ? 'disabled' : ''}><span class="ka-n">${p >= 0 ? p + 1 : ''}</span>${JADAB[j]}</button>`; }).join('')}</div>
    ${ok ? `<div class="jrow"><img src="${JPOSE('makan')}" alt="Jimon makan" class="jm-eat" style="height:120px;width:auto"><span class="jmsg">Nyam! Alhamdulillah, enak sekali. Terima kasih sudah mengingatkanku!</span></div>${jbtn('Selesai', 'data-jgnext', 'green block')}`
      : JG.chk ? `<span class="jmut">Yang kuning belum pas. Ketuk Ulang, lalu coba lagi.</span>${jbtn('Ulang', 'data-jgulang', 'ghost block')}` : jbtn('Periksa', 'data-jgcek ' + (JG.seq.length === 4 ? '' : 'disabled'), 'block')}</section>`);
}

/* ---------------- Surat Jumat ---------------- */
/* the letter belongs to the last Friday (today on Friday) and stays readable until the next one */
const lastFri = (d = new Date()) => jAdd(d, -((d.getDay() - 5 + 7) % 7));
const suratWeek = () => weekKey(lastFri());
const suratOpen = () => { const J = jget('jimon', {}) || {}; return !!(J.since && J.since <= dkey(lastFri())); };
const suratSticker = () => suratOpen() && !((jget('jimon', {}) || {}).stk || {})[suratWeek()];
const stickerOf = wk => JSTK[Math.floor(kOf(wk).getTime() / 6048e5) % JSTK.length];
function suratData() {
  const fri = lastFri(), from = dkey(jAdd(fri, -6)), to = dkey(fri), days = jget('day', {}) || {}, inR = k => k >= from && k <= to;
  let misi = 0, subuh = 0; Object.keys(days).filter(inR).forEach(k => { const d = days[k]; misi += Object.keys(d.m || {}).filter(m => d.m[m]).length; if (d.s && d.s.subuh && d.s.subuh.f) subuh++; });
  const A = jget('learn2', {}) || {}, kisah = Object.keys(A).filter(k => k.startsWith('ka:') && inR(A[k].last || A[k].d || '')).length;
  const gerak = (ps.get('log', []) || []).filter(e => e && inR(e.d || '')).length;
  const best = subuh >= 5 ? 'kamu sholat Subuh ' + subuh + ' hari pekan ini!' : misi >= 10 ? 'kamu menyelesaikan ' + misi + ' misi pekan ini!' : kisah ? 'kamu membaca ' + kisah + ' kisah bersamaku!' : gerak ? 'kamu bergerak bersamaku ' + gerak + ' kali!' : subuh ? 'kamu sholat Subuh ' + subuh + ' hari pekan ini!' : 'kamu terus mencoba. Itu sudah hebat!';
  const doneAll = typeof KA !== 'undefined' ? Object.keys(A).filter(k => k.startsWith('ka:') && A[k].done).length >= KA.length : false;
  return { fri, stats:[[misi, 'misi selesai', '#0E7C66'], [kisah, 'kisah dibaca', '#2450D6'], [gerak, 'kali Gerak bersamaku', '#A85705'], [subuh, 'Subuh tepat waktu', '#6B3FC4']],
    best, next:doneAll ? 'Pekan depan, yuk kita terus berbuat baik bersama.' : 'Pekan depan, yuk kita baca satu kisah baru bersama.' };
}
const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
function caveat() { if (!$('#caveatFont')) { const l = document.createElement('link'); l.id = 'caveatFont'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap'; document.head.appendChild(l); } }
let SURAT_V = '';
function renderSurat() {
  if (!suratOpen()) { $('#v-surat').innerHTML = `<div class="jw jkidw"><div class="jrow" style="padding-top:8px">${back('#saya')}<h1>Surat dari Jimon</h1></div><section class="jcard" style="background:var(--jkidcard)"><p>Jimon menulis surat setiap hari <b>Jumat</b>. Tunggu suratnya ya!</p></section></div>`; return; }
  caveat();
  const D = suratData(), wk = suratWeek(), J = jget('jimon', {}) || {}, got = (J.stk || {})[wk], st = stickerOf(wk), album = [...new Set(Object.values(J.stk || {}))];
  if (SURAT_V !== wk + todayK()) { SURAT_V = wk + todayK(); jvoice('j_jumat'); }
  $('#v-surat').innerHTML = `<div class="jw jkidw"><div class="jrow" style="padding-top:8px">${back('#saya')}<h1>Surat dari Jimon</h1></div>
    <section class="jletter" aria-label="Surat dari Jimon"><i class="tape" aria-hidden="true"></i><img class="pen" src="${JPOSE('menulis')}" alt="Jimon menulis surat">
      <span class="dt">Jumat, ${D.fri.getDate()} ${BULAN[D.fri.getMonth()]}</span><span class="to">Untuk ${esc(PROF.name)} sahabatku,</span>
      <p>Assalamualaikum! Pekan ini aku senang sekali menemanimu.${D.stats.some(([v]) => v) ? ' Lihat apa saja yang sudah kamu lakukan:' : ''}</p>
      ${D.stats.filter(([v]) => v).map(([v, n, c]) => `<span><b style="color:${c}">★ ${v}</b> ${n}</span>`).join('')}
      <p>Yang paling membuatku bangga: <u>${esc(D.best)}</u> MasyaAllah.</p><p>${D.next}</p>
      <div class="sign"><span>Salam sayang,<br>Jimon</span><img class="paw" src="${JPOSE('cap_kaki')}" alt="Cap kaki Jimon"></div></section>
    <button class="jb block jwa" data-sshare>Bagikan ke WhatsApp</button>
    <section class="jcard jk-fish" style="background:var(--jkidcard)"><img src="${jimg('jimon/stiker/st_' + st + '.webp')}" alt="Stiker ${JSTK_N[st]}" width="64" height="64" class="${got ? '' : 'jbreathe'}"><span><b>Stiker pekan ini: ${JSTK_N[st]}</b><br><span class="jmut">8 stiker berganti setiap pekan</span></span>${jbtn(got ? 'Tersimpan' : 'Ambil stiker', 'data-sstk ' + (got ? 'disabled' : ''), 'green')}</section>
    <section class="jcard" style="background:var(--jkidcard)"><div class="jrow sp"><h2>Album stikerku</h2><span class="jpill">${album.length} / ${JSTK.length}</span></div>
      <div class="jg-album">${JSTK.map(s => `<img src="${jimg('jimon/stiker/st_' + s + '.webp')}" alt="${JSTK_N[s]}" loading="lazy" class="${album.includes(s) ? '' : 'off'}">`).join('')}</div></section></div>`;
}
/* the letter as a picture, to share in the family WhatsApp group */
async function suratImage() {
  const D = suratData(), W = 1080, c = document.createElement('canvas'), x = c.getContext('2d');
  try { await document.fonts.load('700 60px Caveat'); await document.fonts.load('500 46px Caveat'); } catch (e) {}
  const font = (w, s) => `${w} ${s}px Caveat, Saira, system-ui, sans-serif`;
  const wrap = (t, maxW) => { const out = []; let cur = ''; t.split(' ').forEach(w => { const n = cur ? cur + ' ' + w : w; if (x.measureText(n).width > maxW && cur) { out.push(cur); cur = w; } else cur = n; }); out.push(cur); return out; };
  /* lay out first, then size the picture to fit */
  const L = []; let y = 175;
  const add = (t, s = 50, w = 500, col = '#1E3A8A') => { x.font = font(w, s); wrap(t, y < 360 ? W - 470 : W - 300).forEach(l => { L.push([l, s, w, col, y]); y += 64; }); };
  add('Jumat, ' + D.fri.getDate() + ' ' + BULAN[D.fri.getMonth()], 44, 500, '#A85705');
  add('Untuk ' + PROF.name + ' sahabatku,', 64, 700);
  add('Assalamualaikum! Pekan ini aku senang sekali menemanimu.' + (D.stats.some(([v]) => v) ? ' Lihat apa saja yang sudah kamu lakukan:' : ''));
  D.stats.filter(([v]) => v).forEach(([v, n, col]) => add('★ ' + v + ' ' + n, 50, 700, col));
  add('Yang paling membuatku bangga: ' + D.best + ' MasyaAllah.');
  add(D.next); y += 30;
  const sy = y, H = sy + 260; c.width = W; c.height = H;
  x.fillStyle = '#EAF3FF'; x.fillRect(0, 0, W, H);
  x.save(); x.translate(W / 2, H / 2); x.rotate(-0.012); x.translate(-W / 2, -H / 2);
  x.fillStyle = '#FFFEF8'; x.shadowColor = 'rgba(15,29,61,.18)'; x.shadowBlur = 40; x.fillRect(60, 60, W - 120, H - 120); x.shadowBlur = 0;
  x.strokeStyle = '#D6E4FA'; x.lineWidth = 2; for (let ly = 191; ly < H - 70; ly += 64) { x.beginPath(); x.moveTo(60, ly); x.lineTo(W - 60, ly); x.stroke(); }
  x.strokeStyle = '#F5B5B5'; x.beginPath(); x.moveTo(120, 60); x.lineTo(120, H - 60); x.stroke();
  const pen = new Image(); pen.src = JPOSE('menulis'); const paw = new Image(); paw.src = JPOSE('cap_kaki');
  await Promise.all([pen, paw].map(im => im.decode ? im.decode().catch(() => {}) : null));
  try { x.drawImage(pen, W - 310, 80, 210, 210 * pen.naturalHeight / pen.naturalWidth); } catch (e) {}
  L.forEach(([t, s, w, col, ly]) => { x.font = font(w, s); x.fillStyle = col; x.fillText(t, 150, ly); });
  x.font = font(500, 54); x.fillStyle = '#1E3A8A'; x.textAlign = 'right'; x.fillText('Salam sayang,', W - 300, sy + 40); x.fillText('Jimon', W - 300, sy + 104); x.textAlign = 'left';
  try { x.drawImage(paw, W - 280, sy - 20, 170, 170 * paw.naturalHeight / paw.naturalWidth); } catch (e) {}
  x.restore();
  x.font = font(500, 34); x.fillStyle = '#3B4A6B'; x.fillText('JLB · Jadi Lebih Baik', 80, H - 18);
  return new Promise(ok => c.toBlob(ok, 'image/png'));
}
async function suratShare() {
  const name = PROF.name, D = suratData(), st = D.stats.filter(([v]) => v), txt = 'Surat Jumat dari Jimon untuk ' + name + (st.length ? ': ' + st.map(([v, n]) => v + ' ' + n).join(', ') + '.' : '.') + ' MasyaAllah!';
  try {
    const blob = await suratImage(), file = new File([blob], 'surat-jimon-' + dkey(D.fri) + '.png', { type:'image/png' });
    if (navigator.canShare && navigator.canShare({ files:[file] })) { await navigator.share({ files:[file], title:'Surat dari Jimon', text:txt }); return; }
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file.name; document.body.appendChild(a); a.click(); a.remove();
    jtoast('Gambar surat tersimpan. Kirim lewat WhatsApp ya.');
  } catch (e) { if (e && e.name === 'AbortError') return; location.href = 'https://wa.me/?text=' + encodeURIComponent(txt); }
}

/* ---------------- events ---------------- */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-jglock],[data-jgstart],[data-jgtiru],[data-jgspot],[data-jgnext],[data-jgdengar],[data-jgsuara],[data-jgadab],[data-jgcek],[data-jgulang],[data-sshare],[data-sstk],[data-kfeed]');
  if (!t || t.disabled) return;
  const ds = t.dataset, g = JG && JGAMES.find(x => x.id === JG.id);
  if (ds.jglock) { e.preventDefault(); jtoast('Yang ini terbuka di Level ' + ds.jglock + '. Ayo kumpulkan XP dari misi!'); jvoice('meong_2'); return; }
  if (ds.kfeed !== undefined) { const S = jimonState(); if (!S.fish) { KSAY = 'Ikannya habis. Selesaikan misi untuk dapat ikan lagi ya!'; return renderKamar(); }
    jimonMood('makan'); KEAT = true; KSAY = 'Nyam nyam…'; jvoice('meong_1'); renderKamar();
    setTimeout(() => { KEAT = false; KSAY = jimonState().full >= 90 ? 'Nyam! Perutku kenyang sekali. Terima kasih!' : 'Nyam nyam… enak! Terima kasih!'; jvoice('dengkur');
      if (document.body.dataset.view === 'saya') renderKamar(true); setTimeout(() => { KSAY = ''; }, 4000); }, 1800); return; }
  if (ds.sshare !== undefined) return suratShare();
  if (ds.sstk !== undefined) { const wk = suratWeek(); jimonSave(J => { J.stk = Object.assign({}, J.stk || {}); J.stk[wk] = stickerOf(wk); }); jvoice('k_hebat'); jtoast('Stiker masuk ke album!'); return renderSurat(); }
  if (!g) return;
  if (ds.jgstart !== undefined) return gameStart(g);
  if (ds.jgtiru !== undefined) { jvoice(jpick(['c_bagus', 'c_semangat', 'c_kuat'])); JG.round++; if (JG.round >= 5) return gameEnd(g, 'Hebat, kamu menirukan 5 gerakan!', 'Badanmu bergerak, Jimon ikut senang.'); return paintTiru(g); }
  if (ds.jgspot !== undefined) { const i = Number(ds.jgspot); JG.tries++;
    if (i === JG.hide) { JG.found = true; JG.score++; jvoice('tertawa'); } else { JG.miss.push(i); jvoice('meong_3'); }
    return paintCari(g); }
  if (ds.jgdengar !== undefined) return jvoice('t_' + JG.ans);
  if (ds.jgsuara) { JG.pick = ds.jgsuara; if (JG.pick === JG.ans) { JG.score++; jvoice(jpick(['b_benar1', 'b_benar2', 'b_benar3'])); } else jvoice('b_hampir2'); return paintSuara(g); }
  if (ds.jgadab !== undefined) { const j = Number(ds.jgadab); if (JG.chk) return; const p = JG.seq.indexOf(j); if (p >= 0) JG.seq = JG.seq.filter(x => x !== j); else JG.seq.push(j); return paintAdab(g); }
  if (ds.jgcek !== undefined) { JG.chk = true; const ok = JG.seq.every((v, k) => v === k); jvoice(ok ? 'b_benar1' : 'b_hampir1'); return paintAdab(g); }
  if (ds.jgulang !== undefined) { JG.seq = []; JG.chk = false; return paintAdab(g); }
  if (ds.jgnext !== undefined) {
    if (g.id === 'cari') { if (JG.round < 2) { JG.round++; cariRound(); return paintCari(g); } return gameEnd(g, 'Kamu menemukan Jimon ' + JG.score + ' dari 3 kali!', JG.score === 3 ? 'Matamu jeli sekali!' : 'Jimon pintar bersembunyi, ya!'); }
    if (g.id === 'suara') { if (JG.round < 4) { JG.round++; suaraRound(); return paintSuara(g); } return gameEnd(g, JG.score + ' dari 5 suara benar!', JG.score >= 4 ? 'Telingamu tajam sekali!' : 'Ayo dengarkan lebih teliti besok.'); }
    if (g.id === 'adab') { jimonSave(J => { J.full += 10; }); return gameEnd(g, 'Jimon makan dengan adab yang baik!', 'Cuci tangan, Bismillah, tangan kanan, Alhamdulillah.'); }
  }
});
addEventListener('hashchange', () => { if (JG && !location.hash.startsWith('#main/' + JG.id)) { cancelAnimationFrame(JG.raf); JG = null; } if (!location.hash.startsWith('#saya')) { KSAY = ''; KEAT = false; } });
