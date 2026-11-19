/* =========================================================
   Kisah Akhlak (anak): rak + Buku Kisahku, 8 halaman bergambar, Bacakan (suara HP, kalimat disorot),
   2 momen memilih, Pesan dari kisah ini, 10 soal (8 model), hasil dan renungan.
   Isi kisah ada di js/jlb_kisahdata.js (KA). Gambar: img/jlb/kisah/k<n>_<0..8>.webp (0 = sampul).
   Progres di jlb:learn2 'ka:<n>' (ikut gabung per kisah saat sinkron): done, mum, best, xp.
   XP: selesai pertama kali +10, Mumtaz (9–10 benar) pertama kali +5. Kisah Pilihan lama tidak dipakai lagi; XP-nya tetap.
   ========================================================= */
const kaImg = (n, i) => jimg('kisah/k' + n + '_' + i + '.webp');
const kaRec = n => L2()['ka:' + n] || {};
const kaProg = () => jget('kaprog', {}) || {};
let KX = null;            // kisah yang sedang dibuka
let KAPET = 0;            // elus Jimon di rak
const KA_J0 = jimg('jimon/pose/p_membaca.webp');

/* ---- suara HP: kalimat demi kalimat, tanpa teks Arab ---- */
function kaSents(t) {   // split into sentences without lookbehind (older iPhones)
  const s = t.replace(/\s+/g, ' ').trim(), out = []; let a = 0;
  const re = /[.!?…]["”’]?\s+(?=["“‘]?[A-Z0-9])/g; let m;
  while ((m = re.exec(s))) { const end = m.index + m[0].trimEnd().length; out.push(s.slice(a, end)); a = m.index + m[0].length; }
  out.push(s.slice(a)); return out.filter(Boolean);
}
const kaSpeakTxt = t => t.replace(/\s*ﷺ/g, '').replace(/[“”"]/g, '');
function kaStop() { if (KX) { KX.run = (KX.run || 0) + 1; KX.reading = false; KX.cur = -1; } try { speechSynthesis.cancel(); } catch (e) {} }
function kaSpeak(list, onSent, onEnd) {
  const run = KX.run = (KX.run || 0) + 1;
  const go = i => {
    if (!KX || KX.run !== run) return;
    if (i >= list.length) return onEnd && onEnd();
    onSent && onSent(i);
    try { const u = new SpeechSynthesisUtterance(kaSpeakTxt(list[i])); u.lang = 'id-ID'; u.rate = .92;
      u.onend = () => setTimeout(() => go(i + 1), 120); u.onerror = () => go(i + 1); speechSynthesis.speak(u); }
    catch (e) { setTimeout(() => go(i + 1), 1500); }
  };
  try { speechSynthesis.cancel(); } catch (e) {}
  go(0);
}
const kaTTS = () => 'speechSynthesis' in window;

/* ---- Jimon kecil di samping teks ---- */
function kaJimon(img, say, src, cls = '') {
  return `<div class="ka-jim ${cls}"><img src="${img}" alt="Jimon" class="jbreathe" width="92" height="104"><div class="ka-bub">${say}${src ? `<span class="jsrc">${esc(src)}</span>` : ''}</div></div>`;
}
const kaPoseFor = line => /\?$/.test(line) ? jimg('jimon/suasana/berpikir.webp') : /MasyaAllah|Hebat|Keren|hebat|keren|!$/.test(line) ? jimg('jimon/pose/p_lompat.webp') : jimonFace('senang');

/* ---------------- Rak dan Buku Kisahku ---------------- */
function renderKARak() {
  KX = null;
  const P = kaProg(), mum = KA.filter(k => kaRec(k.n).mum).length, done = KA.filter(k => kaRec(k.n).done).length;
  const say = KAPET ? (KAPET % 3 ? 'Prrr… aku suka dibacakan cerita!' : 'Hihihi, geli!') : done ? 'Mau baca kisah apa lagi hari ini? Aku temani!' : 'Mau baca kisah apa hari ini? Aku temani!';
  const covers = KA.map(k => kaRec(k.n).mum ? `<img src="${kaImg(k.n, 0)}" alt="Sampul ${esc(k.t)}" loading="lazy">` : `<i aria-hidden="true"></i>`).join('');
  const row = k => { const r = kaRec(k.n), pg = P[k.n];
    const st = r.mum ? ['Mumtaz ★', 'mum'] : r.done ? ['Selesai · ' + (r.best || 0) + '/10', 'done'] : pg ? ['Hal. ' + pg, 'now'] : ['Baru', 'new'];
    return `<a class="ka-row" href="#belajar/ka-${k.n}"><img src="${kaImg(k.n, 0)}" alt="" width="96" height="54" loading="lazy" decoding="async"><span class="ka-rt"><b>${esc(k.t)}</b><span class="jmut">8 halaman · 10 soal · ${esc(k.tema)}</span></span><span class="ka-st ${st[1]}">${st[0]}</span></a>`; };
  $('#v-belajar').innerHTML = `<div class="jw jkidw">
    <section class="ka-head"><img class="bg" src="${jimg('langit/sky_' + skyNow() + '.webp')}" alt="">
      <div class="jrow ka-top">${back('#belajar')}<b>Kisah Akhlak</b>${jsoundBtn()}</div>
      <div class="ka-say" aria-live="polite">${say}</div>
      <button class="ka-pet" data-kapet aria-label="Elus Jimon"><img src="${KA_J0}" alt="Jimon membaca" class="${KAPET ? 'jwig' : 'jbreathe'}"></button></section>
    <section class="jcard" style="background:var(--jkidcard)"><div class="jrow sp"><h2>Buku Kisahku</h2><span class="jpill">${mum} / ${KA.length} sampul</span></div>
      <div class="ka-covers">${covers}</div><span class="jmut">Selesaikan kisah dengan nilai Mumtaz (9 atau 10 benar) untuk mendapat sampulnya.</span></section>
    <h2>Pilih kisah</h2><div class="ka-list">${KA.map(row).join('')}</div>
    <p class="jmut">Selesai pertama kali +10 XP. Nilai Mumtaz pertama kali +5 XP.</p></div>`;
}

/* ---------------- Satu kisah ---------------- */
function kaOpen(n) {
  const K = KA.find(k => k.n === n); if (!K) return null;
  if (!KX || KX.n !== n) {
    const pg = Math.min(7, Math.max(0, (kaProg()[n] || 1) - 1));
    KX = { n, K, ph:'baca', pg, picked:{}, tried:{}, heard:{}, cur:-1, run:0, order:{} };
    K.pages.forEach((p, i) => { if (p.ch) KX.order[i] = shuffle(p.ch.o.map((t, j) => j)); });
    for (let i = 0; i < 9; i++) { const im = new Image(); im.decoding = 'async'; im.src = kaImg(n, i); }   // disimpan untuk dibaca tanpa internet
    jvoice('k_mulai');
  }
  return KX;
}
function renderKAStory(n) {
  if (!kaOpen(n)) { location.hash = '#belajar/ka'; return; }
  if (KX.ph === 'pesan') return paintKAPesan();
  if (KX.ph === 'soal') return paintKASoal();
  if (KX.ph === 'hasil') return paintKAHasil();
  paintKAPage();
}
function kaHead(sub) {
  return `<div class="jrow" style="padding-top:8px">${back('#belajar/ka', 'Ke rak kisah')}<b class="ka-title">${esc(KX.K.t)}</b><span class="jmut ka-sub">${sub}</span>${jsoundBtn()}</div>`;
}
function paintKAPage() {
  const K = KX.K, i = KX.pg, P = K.pages[i], C = P.ch, solved = !C || KX.picked[i] === C.best, tried = KX.tried[i] || [];
  const all = [P.a, P.b]; let si = 0;
  const para = t => `<p>${kaSents(t).map(s => `<span class="ka-s${KX.cur === si++ ? ' on' : ''}">${esc(s)}</span>`).join(' ')}</p>`;
  const dots = K.pages.map((_, j) => `<i class="${j <= i ? 'on' : ''}"></i>`).join('');
  let jim = '';
  if (C) {
    const pk = KX.picked[i];
    jim = pk === undefined && !tried.length ? kaJimon(jimg('jimon/suasana/berpikir.webp'), 'Hmm… kalau kamu jadi tokohnya, apa yang kamu lakukan?')
      : solved ? kaJimon(jimg('jimon/pose/p_lompat.webp'), 'MasyaAllah, pilihan yang baik! Ayo lihat apa yang terjadi!', '', 'ka-hop')
      : kaJimon(jimonFace('peduli'), esc(C.nudge), C.nd ? 'dalil: ' + C.nd : '');
  } else if (KX.heard[i] && P.j) jim = kaJimon(kaPoseFor(P.j), esc(P.j), P.jd ? 'dalil: ' + P.jd : '', 'ka-rise');
  else jim = kaJimon(KA_J0, KX.reading ? 'Aku ikut mendengarkan…' : i === 0 ? 'Tekan Bacakan, aku ikut dengar ceritanya!' : 'Lanjut! Kita baca halaman ini bersama.');
  const choice = C ? `<span class="ka-tag">Kamu yang memilih!</span><h2>${esc(C.q)}</h2>
    <div class="ka-opts">${KX.order[i].map(j => { const ok = solved && j === C.best, no = tried.includes(j);
      return `<button data-kach="${j}" class="${ok ? 'ok' : no ? 'no' : ''}" ${solved || no ? 'disabled' : ''} aria-pressed="${ok}">${esc(C.o[j])}</button>`; }).join('')}</div>` : '';
  $('#v-belajar').innerHTML = `<div class="jw jkidw ka-paper">${kaHead('Hal. ' + (i + 1) + ' / 8')}
    <div class="ka-dots" aria-hidden="true">${dots}</div>
    <div class="ka-pic"><img src="${kaImg(K.n, i + 1)}" alt="Gambar halaman ${i + 1}" width="1024" height="576" decoding="async"></div>
    <section class="ka-text" aria-label="Teks cerita">${all.map(para).join('')}</section>
    ${kaTTS() ? `<button class="jb gold block" data-karead aria-pressed="${!!KX.reading}">${KX.reading ? 'Berhenti' : 'Bacakan'}</button>` : ''}
    ${choice}${jim}
    <div class="jrow ka-nav">${jbtn('Sebelumnya', 'data-kaprev ' + (i ? '' : 'disabled'), 'ghost')}${solved ? jbtn(i === 7 ? 'Pesan dari kisah ini' : 'Berikutnya', 'data-kanext') : jbtn('Pilih dulu ya', 'disabled')}</div></div>`;
  if (!C && !KX.heard[i] && !KX.reading) { clearTimeout(KX.tm); const w = (P.a + ' ' + P.b).split(' ').length; KX.tm = setTimeout(() => { if (KX && KX.ph === 'baca' && KX.pg === i && !KX.reading) { KX.heard[i] = true; paintKAPage(); } }, Math.max(7000, w * 260)); }
}
function kaRead() {
  if (KX.reading) { kaStop(); return paintKAPage(); }
  const P = KX.K.pages[KX.pg], list = kaSents(P.a).concat(kaSents(P.b)), pg = KX.pg;
  KX.reading = true; clearTimeout(KX.tm); paintKAPage();
  kaSpeak(list, i => { KX.cur = i; if (KX.pg === pg && KX.ph === 'baca') paintKAPage(); },
    () => { if (!KX || KX.pg !== pg) return; KX.reading = false; KX.cur = -1; KX.heard[pg] = true; jvoice('meong_1'); paintKAPage(); });
}

/* ---------------- Pesan dari kisah ini ---------------- */
function paintKAPesan() {
  if (!AYAT_L) loadAyatL().then(() => { if (KX && KX.ph === 'pesan' && document.body.dataset.view === 'belajar') paintKAPesan(); });
  const K = KX.K;
  const card = p => {
    if (p.k === 'h') return `<div class="ka-pes"><span class="ka-tag g">Hadits</span><p>${esc(p.t)}</p><span class="jsrc">${esc(p.ref)}</span></div>`;
    const A = AYAT_L && AYAT_L[p.key]; if (A) arabicFont();
    return `<div class="ka-pes"><span class="ka-tag g">Ayat</span>${A ? `<div class="jar" lang="ar">${A.ar.map(esc).join(' ۝ ')}</div>${listenBtn(A)}<p class="jtr">${A.id.map(esc).join(' ')}</p><span class="jsrc">${esc(p.ref)} · Terjemah Kemenag</span>` : '<div class="jload"><span></span></div>'}
      <p><b>Inti makna:</b> ${esc(p.t)}</p></div>`;
  };
  $('#v-belajar').innerHTML = `<div class="jw jkidw">${kaHead('Setelah hal. 8')}
    <section class="ka-pesan"><img src="${KA_J0}" alt="" class="ka-pj jbreathe" width="96" height="108"><span class="ka-tag">Pesan dari kisah ini</span>${K.pesan.map(card).join('')}
      ${kaJimon(jimonFace('senang'), esc(K.jp))}</section>
    ${kaTTS() ? `<button class="jb gold block" data-kapread aria-pressed="${!!KX.reading}">${KX.reading ? 'Berhenti' : 'Bacakan maknanya'}</button>` : ''}
    <p class="jmut">Bacakan hanya membaca makna dalam bahasa Indonesia. Teks Arab tidak dibacakan suara HP; ayat punya tombol rekaman Syaikh Alafasy, hadits tanpa audio.</p>
    <div class="jrow ka-nav">${jbtn('Kembali ke cerita', 'data-kaback', 'ghost')}${jbtn('Lanjut ke soal', 'data-kasoal')}</div></div>`;
}

/* ---------------- Soal ---------------- */
const KA_TY = { pg:'Pilihan ganda', bs:'Benar atau salah?', ur:'Urutkan kejadian', sb:'Siapa yang berkata?', sa:'Sebab dan akibat', pt:'Perasaan tokoh', kb:'Kata baru', dl:'Dalil yang cocok' };
const KA_FACE = { senang:'M8 14c1 1.5 2.4 2.2 4 2.2s3-.7 4-2.2', sedih:'M8 16.5c1-1.5 2.4-2.2 4-2.2s3 .7 4 2.2', takut:'', marah:'M8 16h8', datar:'M8.5 15.5h7' };
function kaFace(label) {
  const l = label.toLowerCase(), k = /senang|bangga|lega|gembira/.test(l) ? 'senang' : /sedih|kecewa|malu/.test(l) ? 'sedih' : /takut/.test(l) ? 'takut' : /marah/.test(l) ? 'marah' : 'datar';
  return `<svg aria-hidden="true" width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="9.5"/><circle cx="9" cy="10.5" r=".9" fill="currentColor"/><circle cx="15" cy="10.5" r=".9" fill="currentColor"/>${k === 'takut' ? '<ellipse cx="12" cy="15.5" rx="2" ry="2.4"/>' : `<path d="${KA_FACE[k]}"/>`}${k === 'marah' ? '<path d="M7 8.5l3 1.2M17 8.5l-3 1.2"/>' : ''}</svg>`;
}
function kaStartSoal() {
  kaStop();
  KX.ph = 'soal'; KX.qi = 0; KX.ok = 0; KX.res = [];
  KX.qs = KX.K.qs.map(q => Object.assign({}, q, {
    ord: q.ty === 'ur' ? shuffle(q.o.map((_, j) => j)) : q.ty === 'sa' ? shuffle(q.o.map((_, j) => j)) : q.ty === 'bs' || q.ty === 'pt' ? q.o.map((_, j) => j) : shuffle(q.o.map((_, j) => j)) }));
  kaNewQ(); jvoice('o_kuis');
}
function kaNewQ() { KX.sel = null; KX.seq = []; KX.pair = {}; KX.left = 0; KX.chk = false; }
function kaRight(q) {
  if (q.ty === 'ur') return KX.seq.length === q.o.length && KX.seq.every((v, k) => v === k);
  if (q.ty === 'sa') return q.o.every((_, k) => KX.pair[k] === k);
  return KX.sel === q.r;
}
const kaReady = q => q.ty === 'ur' ? KX.seq.length === q.o.length : q.ty === 'sa' ? Object.keys(KX.pair).length === q.o.length : KX.sel !== null;
function paintKASoal() {
  const q = KX.qs[KX.qi], n = KX.qs.length, ok = KX.chk && kaRight(q);
  const bar = KX.qs.map((_, k) => `<i class="${k < KX.qi ? (KX.res[k] ? 'ok' : 'no') : k === KX.qi ? 'now' : ''}"></i>`).join('');
  const cls = j => { const on = KX.sel === j; if (!KX.chk) return on ? 'sel' : ''; return j === q.r ? 'ok' : on ? 'no' : ''; };
  let body = '';
  if (q.ty === 'ur') body = `<span class="jmut">Ketuk kejadian sesuai urutannya. Ketuk lagi untuk membatalkan.</span><div class="ka-opts">${q.ord.map(j => { const pos = KX.seq.indexOf(j), good = KX.chk && pos === j;
      return `<button data-kaur="${j}" class="ka-ur ${pos >= 0 ? 'sel' : ''} ${KX.chk ? (good ? 'ok' : 'no') : ''}" ${KX.chk ? 'disabled' : ''}><span class="ka-n">${pos >= 0 ? pos + 1 : ''}</span>${esc(q.o[j])}${KX.chk && !good ? `<small>urutan ke-${j + 1}</small>` : ''}</button>`; }).join('')}</div>`;
  else if (q.ty === 'sa') {
    const used = Object.values(KX.pair);
    body = `<span class="jmut">Ketuk perbuatan, lalu ketuk akibatnya.</span><div class="ka-sa">${q.o.map((p, k) => { const e = KX.pair[k], good = KX.chk && e === k;
        return `<button data-kasal="${k}" class="ka-cause ${KX.left === k ? 'sel' : ''} ${KX.chk ? (good ? 'ok' : 'no') : ''}" ${KX.chk ? 'disabled' : ''}><b>${esc(p[0])}</b><span class="ka-arrow">→ ${e !== undefined ? esc(q.o[e][1]) : '<i class="jmut">pilih akibatnya</i>'}</span>${KX.chk && !good ? `<small>Yang benar: ${esc(p[1])}</small>` : ''}</button>`; }).join('')}</div>
      ${KX.chk ? '' : `<div class="ka-pool">${q.ord.map(j => `<button data-kasar="${j}" class="jchip" ${used.includes(j) || KX.left === null ? 'disabled' : ''}>${esc(q.o[j][1])}</button>`).join('')}</div>`}`;
  }
  else if (q.ty === 'pt') body = `<div class="ka-faces">${q.ord.map(j => `<button data-kaopt="${j}" class="${cls(j)}" ${KX.chk ? 'disabled' : ''} aria-pressed="${KX.sel === j}">${kaFace(q.o[j])}<b>${esc(q.o[j])}</b></button>`).join('')}</div>`;
  else body = `<div class="ka-opts ${q.ty === 'bs' ? 'two' : ''}">${q.ord.map(j => `<button data-kaopt="${j}" class="${cls(j)}" ${KX.chk ? 'disabled' : ''} aria-pressed="${KX.sel === j}">${esc(q.o[j])}</button>`).join('')}</div>`;
  const qtext = q.ty === 'sb' ? `<b class="ka-qh">Siapa yang berkata seperti ini?</b><div class="ka-quote">${esc(q.q)}</div>`
    : q.ty === 'kb' ? `<b class="ka-qh">${esc(q.q).replace(esc(q.w), '<mark>' + esc(q.w) + '</mark>')}</b>` : `<b class="ka-qh">${esc(q.q)}</b>`;
  const tip = { pg:'Ingat lagi ceritanya. Pelan-pelan saja!', bs:'Benar atau salah, ya?', ur:'Ingat lagi urutan ceritanya.', sb:'Siapa ya yang berkata begitu?', sa:'Apa yang terjadi karena perbuatan itu?', pt:'Coba bayangkan jadi tokohnya saat itu…', kb:'Ingat kalimatnya di cerita.', dl:'Ingat Pesan dari kisah ini.' }[q.ty];
  const fb = !KX.chk ? kaJimon(KA_J0, tip) : ok ? kaJimon(jimonFace('tertawa'), jpick(['MasyaAllah, benar!', 'Tepat! Kamu menyimak dengan baik.', 'Hebat, kamu ingat!']) + (q.ex ? ' ' + esc(q.ex[0].toUpperCase() + q.ex.slice(1)) + '.' : ''), '', 'ka-rise')
    : kaJimon(jimonFace('peduli'), 'Hampir! Lihat jawaban yang benar ya. Kita belajar bersama.' + (q.ex ? ' ' + esc(q.ex[0].toUpperCase() + q.ex.slice(1)) + '.' : ''), '', 'ka-rise');
  $('#v-belajar').innerHTML = `<div class="jw jkidw">${kaHead('Soal ' + (KX.qi + 1) + ' / ' + n)}<div class="ka-qbar" aria-hidden="true">${bar}</div>
    <section class="jcard ka-q" style="background:var(--jkidcard)"><span class="ka-tag b">${KA_TY[q.ty]}</span>${qtext}${body}</section>${fb}
    ${!KX.chk ? jbtn('Periksa', 'data-kacheck ' + (kaReady(q) ? '' : 'disabled'), 'block') : KX.qi < n - 1 ? jbtn('Soal berikutnya', 'data-kaqn', 'block') : jbtn('Lihat hasil', 'data-kaqn', 'green block')}</div>`;
}

/* ---------------- Hasil dan renungan ---------------- */
function kaFinish() {
  const n = KX.n, before = kaRec(n), mum = KX.ok >= 9;
  let gain = 0, cover = false;
  l2put('ka:' + n, x => { x.best = Math.max(x.best || 0, KX.ok); x.tries = (x.tries || 0) + 1; x.last = todayK();
    if (!x.done) { x.done = 1; x.d = todayK(); x.xp = (x.xp || 0) + 10; gain += 10; }
    if (mum && !x.mum) { x.mum = 1; x.md = todayK(); x.xp = (x.xp || 0) + 5; gain += 5; cover = true; } });
  const P = kaProg(); delete P[n]; jset('kaprog', P);
  KX.gain = gain; KX.cover = cover; KX.first = !before.done; KX.ph = 'hasil';
  if (typeof jimonMood === 'function') jimonMood('kisah'); else { const J = jget('jimon', {}) || {}; J.kisah = todayK(); jset('jimon', J); }
  kidAutoMis('belajar');
  jvoice(mum ? 'b_mumtaz' : 'c_bagus'); bell && ding();
  paintKAHasil();
}
function paintKAHasil() {
  const K = KX.K, mum = KX.ok >= 9, R = (jget('ren', {}) || {})[K.n], mumN = KA.filter(k => kaRec(k.n).mum).length;
  $('#v-belajar').innerHTML = `<div class="jw jkidw">
    <section class="ka-head tall"><img class="bg" src="${jimg('langit/sky_' + skyNow() + '.webp')}" alt="">
      <div class="ka-say c">${mum ? 'Mumtaz! Kamu menyimak ceritanya dengan sangat baik.' : 'Alhamdulillah, kisahnya selesai! Terima kasih sudah membaca bersamaku.'}</div>
      <img class="ka-cheer ${mum ? 'ka-hop' : 'jbreathe'}" src="${jimg(mum ? 'jimon/pose/p_lompat.webp' : 'jimon/suasana/bangga.webp')}" alt="Jimon ${mum ? 'melompat gembira' : 'bangga'}">
      ${mum ? '<span class="ka-star s1">★</span><span class="ka-star s2">★</span><span class="ka-star s3">★</span>' : ''}</section>
    <div class="jrow" style="justify-content:center"><span class="jpill">${KX.ok} / 10 benar</span>${KX.gain ? `<span class="jpill gold">+${KX.gain} XP</span>` : ''}</div>
    ${KX.cover ? `<div class="jcard ka-cover pop" style="flex-direction:row;align-items:center;background:var(--jkidcard)"><img src="${kaImg(K.n, 0)}" alt="" width="112" height="63"><span><b>Sampul baru di Buku Kisahku!</b><br><span class="jmut">${esc(K.t)} · ${mumN} / ${KA.length} sampul</span></span></div>`
      : !mum ? `<p class="jmut" style="text-align:center">Mumtaz mulai 9 benar. Kamu bisa mencoba soalnya lagi kapan saja untuk mendapat sampulnya.</p>` : ''}
    <section class="ka-ren"><span class="ka-tag g">Renungan · tanpa nilai</span><label for="kaRen"><b>${esc(K.ren)}</b></label>
      <textarea id="kaRen" rows="3" maxlength="400" placeholder="Tulis atau ceritakan ke Ayah atau Ibu…">${esc((R && R.t) || '')}</textarea>
      <span class="jmut">Jawabanmu bisa dibaca Ayah dan Ibu di Ruang Orang Tua.</span>${jbtn(R && R.t ? 'Perbarui renungan' : 'Simpan renungan', 'data-karen', 'green block')}</section>
    <div class="jrow ka-nav">${mum ? '' : jbtn('Coba soal lagi', 'data-kasoal', 'ghost')}<a class="jb" href="#belajar/ka">Kembali ke rak</a></div></div>`;
}

/* ---------------- route + events ---------------- */
function renderKA(a) {
  if (a === 'ka' || a === 'kp' || (a && a.startsWith('kp-'))) return renderKARak();
  const n = Number(a.slice(3)); return renderKAStory(n);
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-kapet],[data-karead],[data-kach],[data-kaprev],[data-kanext],[data-kapread],[data-kaback],[data-kasoal],[data-kaopt],[data-kaur],[data-kasal],[data-kasar],[data-kacheck],[data-kaqn],[data-karen]');
  if (!t || t.disabled) return;
  const ds = t.dataset;
  if (ds.kapet !== undefined) { KAPET++; jvoice(KAPET % 3 ? 'dengkur' : 'tertawa'); if (typeof jimonMood === 'function') jimonMood('elus'); return renderKARak(); }
  if (!KX) return;
  if (ds.karead !== undefined) return kaRead();
  if (ds.kach !== undefined) { const i = KX.pg, C = KX.K.pages[i].ch, j = Number(ds.kach); kaStop();
    if (j === C.best) { KX.picked[i] = j; jvoice('k_hebat'); }
    else { KX.tried[i] = (KX.tried[i] || []).concat(j); jvoice('k_pilih'); }
    return paintKAPage(); }
  if (ds.kaprev !== undefined) { kaStop(); KX.pg = Math.max(0, KX.pg - 1); window.scrollTo(0, 0); return paintKAPage(); }
  if (ds.kanext !== undefined) { kaStop();
    if (KX.pg < 7) { KX.pg++; const P = kaProg(); P[KX.n] = KX.pg + 1; jset('kaprog', P); window.scrollTo(0, 0); return paintKAPage(); }
    KX.ph = 'pesan'; window.scrollTo(0, 0); return paintKAPesan(); }
  if (ds.kapread !== undefined) { if (KX.reading) { kaStop(); return paintKAPesan(); }
    const list = KX.K.pesan.flatMap(p => kaSents(p.t)).concat(kaSents(KX.K.jp)); KX.reading = true; stopListen(); paintKAPesan();
    kaSpeak(list, null, () => { if (KX) { KX.reading = false; if (KX.ph === 'pesan') paintKAPesan(); } }); return; }
  if (ds.kaback !== undefined) { kaStop(); KX.ph = 'baca'; KX.pg = 7; return paintKAPage(); }
  if (ds.kasoal !== undefined) { stopListen(); kaStartSoal(); window.scrollTo(0, 0); return paintKASoal(); }
  if (KX.ph !== 'soal' && ds.karen === undefined) return;
  const q = KX.qs && KX.qs[KX.qi];
  if (ds.kaopt !== undefined && !KX.chk) { KX.sel = Number(ds.kaopt); jvoice('meong_3'); return paintKASoal(); }
  if (ds.kaur !== undefined && !KX.chk) { const j = Number(ds.kaur), p = KX.seq.indexOf(j); if (p >= 0) KX.seq = KX.seq.filter(x => x !== j); else KX.seq.push(j); return paintKASoal(); }
  if (ds.kasal !== undefined && !KX.chk) { const k = Number(ds.kasal); if (KX.pair[k] !== undefined) { delete KX.pair[k]; KX.left = k; } else KX.left = KX.left === k ? null : k; return paintKASoal(); }
  if (ds.kasar !== undefined && !KX.chk && KX.left !== null) { KX.pair[KX.left] = Number(ds.kasar); const nx = q.o.findIndex((_, k) => KX.pair[k] === undefined); KX.left = nx >= 0 ? nx : null; return paintKASoal(); }
  if (ds.kacheck !== undefined) { if (!kaReady(q)) return; KX.chk = true; const ok = kaRight(q); KX.res[KX.qi] = ok; if (ok) KX.ok++;
    jvoice(ok ? jpick(['b_benar1', 'b_benar2', 'b_benar3']) : 'b_hampir1'); return paintKASoal(); }
  if (ds.kaqn !== undefined) { window.scrollTo(0, 0); if (KX.qi < KX.qs.length - 1) { KX.qi++; kaNewQ(); return paintKASoal(); } return kaFinish(); }
  if (ds.karen !== undefined) { const v = ($('#kaRen').value || '').trim(); if (!v) { jtoast('Tulis renunganmu dulu ya.'); return; }
    const R = Object.assign({}, jget('ren', {}) || {}); R[KX.n] = { t:v, at:Date.now(), d:todayK() }; jset('ren', R); jvoice('dengkur'); jtoast('Tersimpan. Terima kasih!'); t.textContent = 'Tersimpan. Terima kasih!'; return; }
});
addEventListener('hashchange', () => { if (!/^#belajar\/ka-\d+/.test(location.hash) || (KX && location.hash !== '#belajar/ka-' + KX.n)) { kaStop(); if (KX) clearTimeout(KX.tm); KX = null; } if (!location.hash.startsWith('#belajar/ka')) KAPET = 0; });
