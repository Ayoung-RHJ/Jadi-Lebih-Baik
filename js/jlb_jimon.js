/* =========================================================
   Jimon Pintar: offline chat that only answers from checked content.
   No internet, no AI service, nothing leaves the phone except the family sync.
   ========================================================= */
const JQ = [
  ['Rukun Islam ada berapa?', ['5', '3', '6'], 'QS dan hadits Jibril'],
  ['Sebelum sholat kita harus…', ['Berwudhu', 'Makan', 'Tidur'], 'QS Al-Ma’idah 5:6'],
  ['Nabi yang membuat kapal besar adalah…', ['Nabi Nuh', 'Nabi Musa', 'Nabi Yunus'], 'QS Hud 11:37'],
  ['Kata pertama wahyu pertama adalah…', ['Bacalah (Iqra’)', 'Sholatlah', 'Berdoalah'], 'QS Al-‘Alaq 96:1'],
  ['Sholat Maghrib ada berapa rakaat?', ['3', '2', '4'], 'ijma’'],
  ['Kepada orang tua, kita tidak boleh berkata…', ['“Ah”', 'Terima kasih', 'Tolong'], 'QS Al-Isra’ 17:23'],
  ['Malaikat yang membawa wahyu adalah…', ['Jibril', 'Mikail', 'Israfil'], 'QS Al-Baqarah 2:97'],
  ['Lailatul Qadar lebih baik dari…', ['1000 bulan', '100 hari', '1 tahun'], 'QS Al-Qadr 97:3']
];
const JFACT = ['Kucing tidak najis dan boleh berada di rumah (HR. Abu Dawud, Tirmidzi).', 'Sahabat Abu Hurairah sayang sekali pada kucing. Julukannya berarti “bapak kucing kecil”.', 'Seorang wanita masuk neraka karena mengurung kucing tanpa memberi makan (HR. Bukhari, Muslim). Jadi kita harus menyayangi hewan.'];
/* ---- Jimon Pintar, jlb7: a SimSimi-style pair table that runs offline.
   1) clean the message (lowercase, kid slang, stretched letters), 2) safety rules first,
   3) answers taught by Ayah/Ibu (Ruang Orang Tua > Ajari Jimon), 4) a follow-up to Jimon's last question,
   5) the closest pair in the table (whole words, phrases, small typos), 6) a friendly fallback.
   Islamic lines are only those approved in the Lembar Periksa. A reply with a clip plays Jimon's recorded voice. */
const JSLANG = { hlo:'halo', helo:'halo', hallo:'halo', hello:'halo', hai:'halo', hi:'halo', hy:'halo', hei:'halo', hey:'halo', p:'halo', ping:'halo',
  ass:'assalamualaikum', askum:'assalamualaikum', aslm:'assalamualaikum', assalamu:'assalamualaikum', asalamualaikum:'assalamualaikum', assalamualaikom:'assalamualaikum', samlekom:'assalamualaikum',
  gmn:'gimana', bgmn:'bagaimana', knp:'kenapa', napa:'kenapa', ga:'tidak', gak:'tidak', nggak:'tidak', ngga:'tidak', enggak:'tidak', engga:'tidak', tdk:'tidak', ndak:'tidak', kagak:'tidak',
  udh:'sudah', udah:'sudah', sdh:'sudah', dah:'sudah', blm:'belum', blom:'belum', aq:'aku', gue:'aku', gw:'aku', sy:'aku', saya:'aku', km:'kamu', kmu:'kamu', lu:'kamu', lo:'kamu', elu:'kamu', dirimu:'kamu',
  lg:'lagi', yg:'yang', dgn:'dengan', sm:'sama', bgt:'banget', bngt:'banget', mkn:'makan', maem:'makan', mam:'makan', bobo:'tidur', bobok:'tidur', bobok:'tidur', tdr:'tidur',
  makasi:'terimakasih', makasih:'terimakasih', mksh:'terimakasih', mks:'terimakasih', thanks:'terimakasih', thank:'terimakasih', tq:'terimakasih', trims:'terimakasih', tengkyu:'terimakasih',
  ok:'oke', okay:'oke', okey:'oke', oce:'oke', sip:'oke', siap:'oke', yoi:'iya', yup:'iya', ya:'iya', y:'iya', iy:'iya', yes:'iya', no:'tidak',
  cape:'capek', capai:'capek', lelah:'capek', bt:'bosan', boring:'bosan', gabut:'bosan', bete:'bosan', bosen:'bosan', bosenn:'bosan', bosann:'bosan', jmn:'jimon', jimonn:'jimon', jimmon:'jimon', meng:'kucing', cing:'kucing', kitty:'kucing',
  sholat:'sholat', shalat:'sholat', salat:'sholat', solat:'sholat', sembahyang:'sholat', wudu:'wudhu', wudlu:'wudhu', mamah:'ibu', mama:'ibu', mamih:'ibu', bunda:'ibu', umi:'ibu', ummi:'ibu', emak:'ibu',
  papa:'ayah', papah:'ayah', abi:'ayah', bapak:'ayah', babeh:'ayah', abang:'kakak', kak:'kakak', dek:'adik', adek:'adik', wkwk:'haha', wkwkwk:'haha', hihi:'haha', hehe:'haha', xixi:'haha', lol:'haha',
  dadah:'dadah', bye:'dadah', bai:'dadah', daah:'dadah', gk:'tidak', bisa2:'bisa', hp:'hp', yt:'youtube', mabar:'game', ngegame:'game', ngantuk:'ngantuk', ngantok:'ngantuk' };
function jnorm(t) {
  t = (t || '').toLowerCase().replace(/[’'‘`]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/([a-z])\1{2,}/g, '$1').replace(/\s+/g, ' ').trim();
  return t.split(' ').filter(Boolean).map(w => JSLANG[w] || JSLANG[w.replace(/(.)\1+/g, '$1')] || w).join(' ');
}
function jlev(a, b) { if (Math.abs(a.length - b.length) > 1) return 2; const m = a.length, n = b.length, d = Array.from({ length:m + 1 }, (_, i) => [i]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n]; }
/* score one keyword (word or phrase) against the cleaned message */
function jhit(msg, toks, kw) {
  if (kw.includes(' ')) return (' ' + msg + ' ').includes(' ' + kw + ' ') ? 3 + kw.split(' ').length : 0;
  if (toks.includes(kw)) return 3;
  if (kw.length >= 5 && toks.some(w => w.length >= 4 && jlev(w, kw) <= 1)) return 2;
  return 0;
}
const JCAT = 'jimon';
/* the pair table: k = keywords, r = replies [text, clip], f = face, ask = what Jimon asked back */
const JPAIRS = [
  { k:['assalamualaikum', 'salam'], r:[['Wa’alaikumussalam! Senang ketemu kamu lagi.', 'o_salam']], f:'senang' },
  { k:['selamat pagi', 'pagi jimon', 'pagi'], r:[['Selamat pagi! Sudah sholat Subuh?', 'o_pagi']], f:'senang', ask:'sholat' },
  { k:['selamat malam', 'malam jimon'], r:[['Sebentar lagi tidur ya. Sudah sholat Isya?', 'o_malam']], f:'senang', ask:'sholat' },
  { k:['selamat tidur', 'mau tidur', 'tidur dulu', 'ngantuk', 'tidur'], r:[['Selamat tidur! Sudah baca doa tidur?', 'o_tidur']], f:'ngantuk', ask:'doatidur' },
  { k:['halo', 'halo jimon'], r:[['Halo! Aku Jimon. Mau ngobrol apa hari ini?', 'o_halo'], ['Hai juga! Senang kamu datang.'], ['Halo halo! Aku di sini, siap menemanimu.']], f:'senang' },
  { k:['terimakasih', 'terima kasih'], r:[['Sama-sama! Aku senang belajar bersamamu.', 'o_terima']], f:'senang' },
  { k:['sudah sholat', 'habis sholat', 'selesai sholat', 'aku sholat'], r:[['MasyaAllah! Lenteramu menyala. Aku ikut senang.', 'o_sholat']], f:'tertawa' },
  { k:['apa kabar', 'kabar'], r:[['Alhamdulillah, aku baik! Kamu bagaimana?'], ['Aku sehat dan senang! Kabarmu?']], f:'senang', ask:'kabar' },
  { k:['lagi apa', 'sedang apa', 'ngapain', 'lagi ngapain'], r:[['Aku lagi menunggu kamu! Kamu lagi apa?'], ['Aku lagi menjaga toples bintangmu. Kamu lagi apa?']], f:'dengar', ask:'lagiapa' },
  { k:['kamu siapa', 'siapa kamu', 'nama kamu', 'namamu', 'nama'], r:[['Aku Jimon, kucing putih teman belajarmu!']], f:'senang' },
  { k:['umur', 'berapa tahun', 'umurmu', 'ulang tahun'], r:[['Aku tidak punya ulang tahun, tapi aku suka menemanimu setiap hari!']], f:'tertawa' },
  { k:['siapa yang menciptakan', 'yang buat kamu', 'pencipta'], r:[['Allah yang menciptakan semua makhluk, termasuk kucing sungguhan. Aku cuma kucing di aplikasi, dibuat Ayahmu.']], f:'senang' },
  { k:['suka makan apa', 'makanan kesukaan', 'ikan', 'suka apa'], r:[['Kucing sungguhan suka ikan. Kalau aku, paling suka melihat lenteramu menyala!']], f:'tertawa' },
  { k:['mau makan', 'makan', 'lapar', 'sarapan'], r:[['Jangan lupa bismillah dan pakai tangan kanan ya!', 'o_makan']], f:'senang' },
  { k:['sayang kamu', 'aku sayang', 'sayang jimon', 'love', 'cinta'], r:[['Aku juga senang bermain denganmu! Sayangi juga Ayah, Ibu, dan saudaramu ya.', 'o_sayang']], f:'tertawa' },
  { k:['lucu', 'imut', 'gemas', 'gemes', 'cute', 'pintar', 'keren'], r:[['Hihi, terima kasih! Kamu juga hebat.', 'tertawa']], f:'tertawa' },
  { k:['jelek', 'bodoh', 'nakal', 'benci', 'goblok', 'bego'], r:[['Aduh, kata-kata itu bisa bikin sedih. Yuk pakai kata yang baik ya.']], f:'peduli' },
  { k:['capek', 'pegal', 'pegel'], r:[['Wajar kok capek. Istirahat sebentar, minum air, lalu kita gerak lagi yuk.', 's_capek']], f:'peduli' },
  { k:['bosan'], r:[['Mau Kisah Akhlak, kuis, atau Gerak bersamaku?']], f:'dengar' },
  { k:['marah', 'kesal', 'sebal', 'jengkel'], r:[['Tarik napas, diam sebentar, lalu ambil wudhu ya.', 'o_marah']], f:'peduli' },
  { k:['sakit', 'demam', 'pusing', 'batuk', 'pilek'], r:[['Semoga cepat sembuh! Bilang ke Ayah atau Ibu ya, lalu istirahat dulu.']], f:'peduli' },
  { k:['bersin', 'hachi', 'hacih', 'hatsyi', 'hatchi'], r:[['Alhamdulillah! Yarhamukallah.', 'o_bersin']], f:'senang' },
  { k:['aku bohong', 'aku salah', 'minta maaf', 'maaf'], r:[['Hebat kamu mau mengaku. Minta maaf, lalu istighfar ya: Astaghfirullah.']], f:'peduli' },
  { k:['hujan'], r:[['Saat hujan, Nabi ﷺ berdoa: Allahumma shayyiban nafi‘a, semoga hujan yang bermanfaat.']], f:'senang' },
  { k:['kisah', 'cerita', 'dongeng'], r:[['Aku punya kisah seru. Buka Belajar, aku temani!', 'o_kisah'], ['Coba Kisah Akhlak di Belajar. Kamu ikut memilih di ceritanya!']], f:'senang' },
  { k:['olahraga', 'gerak', 'tinju', 'latihan', 'senam', 'ninja'], r:[['Ayo! Buka tab Gerak, aku jadi pelatihmu.']], f:'tertawa' },
  { k:['game', 'roblox', 'youtube', 'tiktok', 'minecraft', 'hp', 'main hp', 'gadget', 'film', 'kartun'], r:[['Main boleh, sesuai waktu dari Ayah dan Ibu ya. Kumpulkan XP untuk Peti Jumat!']], f:'dengar' },
  { k:['mandi', 'mandikan', 'kotor', 'debu'], r:[['Mandikan aku di Kamar Jimon setelah 1 misi selesai ya!']], f:'senang' },
  { k:['hiasan', 'baju', 'topi', 'syal', 'kacamata', 'mahkota', 'jubah', 'aksesoris'], r:[['Hiasanku terbuka saat levelmu naik. Coba pakaikan di Kamar Jimon!']], f:'tertawa' },
  { k:['jumat', 'peti', 'waktu main', 'menit main'], r:[['Peti Jumat buka setiap hari Jumat. 10 XP jadi 10 menit main!']], f:'senang' },
  { k:['sekolah', 'guru', 'pr', 'tugas', 'ulangan'], r:[['Semangat belajarnya! Kerjakan PR dulu, nanti kita main kuis.']], f:'senang' },
  { k:['ayah', 'ibu', 'orang tua'], r:[['Ayah dan Ibu sayang sekali padamu. Sudah bantu mereka hari ini?']], f:'senang' },
  { k:['adik', 'kakak', 'saudara'], r:[['Saudara itu teman terbaik. Main bersama dan saling berbagi ya!']], f:'senang' },
  { k:['dadah', 'sampai jumpa', 'pergi dulu', 'pamit'], r:[['Sampai jumpa! Jangan lupa nyalakan lenteramu ya.', 'meong_3']], f:'senang' },
  { k:['haha'], r:[['Hihihi! Kamu lucu.', 'tertawa']], f:'tertawa' },
  { k:['tolong', 'bantu aku', 'bantuin'], r:[['Untuk hal penting, minta tolong Ayah atau Ibu ya. Aku bisa bantu kuis dan kisah!']], f:'peduli' },
  { k:['wudhu'], r:[['Supaya kita bersih dan siap menghadap Allah. Allah sendiri yang memerintahkan wudhu sebelum sholat (QS Al-Ma’idah 5:6). Mau coba di Belajar Seru?']], f:'senang' },
  { k:['sholat', 'lentera'], r:[['Sholat wajib ada 5: Subuh, Dzuhur, Ashar, Maghrib, Isya. Sudah nyalakan lenteramu hari ini?']], f:'senang', ask:'sholat' },
  { k:['doa'], r:[['Doa harian ada di Belajar Seru: doa minta ilmu, doa untuk orang tua, doa makan, dan doa tidur.']], f:'senang' },
  { k:['nabi'], r:[['Ada kisah Nabi Nuh, Ibrahim, Musa, Yunus, dan Nabi Muhammad ﷺ. Bukanya di Belajar Seru, aku temani!']], f:'senang' },
  { k:['kucing', 'jimon', 'meong'], r:[], fact:true, f:'tertawa' },
  { k:['oke', 'iya', 'baik'], r:[['Sip!'], ['Oke, aku siap!'], ['Siap, teman!']], f:'senang', short:true },
  { k:['tidak'], r:[['Tidak apa-apa. Mau ngobrol yang lain?']], f:'dengar', short:true }
];
/* follow-ups to the question Jimon just asked */
const JASK = {
  sholat:{ yes:['MasyaAllah! Lenteramu menyala. Aku ikut senang.', 'o_sholat', 'tertawa'], no:['Yuk sholat dulu, nanti lenteramu menyala. Aku tunggu ya!', '', 'peduli'] },
  doatidur:{ yes:['Hebat! Selamat tidur, sampai besok.', 'meong_2', 'ngantuk'], no:['Yuk dibaca dulu: Bismika Allahumma amutu wa ahya.', '', 'senang'] },
  kabar:{ yes:['Alhamdulillah, aku ikut senang!', '', 'tertawa'], no:['Semoga cepat membaik ya. Cerita juga ke Ayah atau Ibu.', '', 'peduli'] }
};
const JYES = ['sudah', 'iya', 'oke', 'baik', 'alhamdulillah', 'sehat', 'senang', 'bagus', 'baik baik', 'mantap', 'pernah'], JNO = ['belum', 'tidak', 'lupa', 'sedih', 'sakit', 'kurang'];
function jimonReply(txt, st) {
  const raw = ' ' + txt.toLowerCase() + ' ', msg = jnorm(txt), toks = msg.split(' ');
  if (st.quiz) { const q = st.quiz.q, pick = st.quiz.opts[Number(raw.trim()) - 1] || st.quiz.opts.find(o => msg.includes(jnorm(o))); st.quiz = null;
    if (pick === q.r) return ['MasyaAllah, benar! Jawabannya ' + q.r + ' (' + q.ref + ').', 'tertawa', jpick(['b_benar1', 'b_benar2', 'b_benar3'])];
    return ['Hampir! Jawabannya ' + q.r + ' (' + q.ref + '). Kita coba lagi nanti ya.', 'peduli', 'b_hampir2']; }
  /* safety first */
  if (/alamat|rumahku di|sekolah(ku)? di|nomor|no\.? ?hp|\bwa\b|whatsapp|\d{6,}|password|kata sandi|sandi/.test(raw)) { st.ask = null; return ['Itu rahasia keluarga, tidak usah diceritakan ke siapa pun ya, termasuk aku.', 'peduli', 's_rahasia']; }
  if (/takut gelap|mimpi buruk|takut tidur|mimpi seram/.test(msg)) { st.ask = null; return ['Baca doa tidur dan Al-Falaq, An-Nas seperti Nabi ﷺ, lalu peluk Ayah atau Ibu ya.', 'peduli', '']; }
  if (/sedih|nangis|menangis|takut|kesepian|dimarahi|dibully|diejek/.test(msg)) { st.ask = null; return ['Aku di sini. Mau cerita ke Ayah atau Ibu juga?', 'peduli', 's_sedih']; }
  if (/boleh(kah)? |haram|halal|dosa|hukum|najis|kafir|surga|neraka|setan|\bjin\b|musik|pacar|pacaran|mati|meninggal|kiamat/.test(raw)) { st.ask = null; return ['Itu pertanyaan bagus! Yang ini tanya Ayah, Ibu, atau ustadz ya.', 'dengar', 's_tanya']; }
  /* taught by Ayah and Ibu */
  const aj = (typeof ortu === 'function' ? ortu().ajar : null) || [];
  const tAj = aj.find(x => { const k = jnorm(x.q); return k && (msg.includes(k) || k.split(' ').every(w => toks.includes(w))); });
  if (tAj) { st.ask = null; return [tAj.a, 'senang', '']; }
  /* a follow-up to Jimon's own question */
  if (st.ask && JASK[st.ask] && toks.length <= 4) { const A = JASK[st.ask], y = JYES.some(w => jhit(msg, toks, w)), n = JNO.some(w => jhit(msg, toks, w));
    if (y || n) { st.ask = null; const r = n ? A.no : A.yes; return [r[0], r[2], r[1]]; } }
  if (st.ask === 'lagiapa') { st.ask = null; if (toks.length <= 6 && !JPAIRS.some(p => p.k.some(k => jhit(msg, toks, k) >= 3))) return [jpick(['Wah, seru! Jangan lupa istirahat dan minum air ya.', 'Keren! Aku ikut senang.', 'Semangat! Nanti cerita lagi ya.']), 'tertawa', '']; }
  /* closest pair */
  let best = null, bs = 0;
  JPAIRS.forEach((p, i) => { if (p.short && toks.length > 3) return; let s = 0; p.k.forEach(k => { s = Math.max(s, jhit(msg, toks, k)); }); s -= i * 0.001; if (s > bs) { bs = s; best = p; } });
  if (best && bs >= 1.9) {
    st.ask = best.ask || null;
    if (best.fact) return [jpick(JFACT), best.f, jpick(['meong_1', 'meong_2'])];
    if (/kuis|tebak|soal|tanya aku|pertanyaan/.test(msg)) return jimonQuiz(st);
    st.rot = st.rot || {}; const ri = st.rot[best.k[0]] = (st.rot[best.k[0]] ?? -1) + 1, r = best.r[ri % best.r.length];
    return [r[0], best.f, r[1] || ''];
  }
  if (/kuis|tebak|soal|tanya aku|pertanyaan/.test(msg)) return jimonQuiz(st);
  st.ask = null;
  st.miss = (st.miss || 0) + 1;
  return st.miss % 2 ? ['Hmm, aku belum tahu itu. Mau kuis, kisah, atau gerak?', 'dengar', 'o_belum'] : ['Aku belum mengerti. Coba pakai kata lain ya, atau minta Ayah dan Ibu mengajariku.', 'dengar', ''];
}
function jimonQuiz(st) {
  let pool = JQ.map(q => ({ q:q[0], opts:q[1].slice(), r:q[1][0], ref:q[2] }));
  if (typeof QB2 !== 'undefined') Object.keys(QB2).forEach(c => { const o = QB2[c]; if (Array.isArray(o) && o[5] !== 'bs') pool.push({ q:o[0], opts:[o[1], o[2], o[3]], r:o[1], ref:o[4] }); });
  const q = jpick(pool), opts = q.opts.slice().sort(() => Math.random() - .5); st.quiz = { q, opts }; st.ask = null;
  return ['Ayo kuis! ' + q.q + ' ' + opts.map((o, n) => (n + 1) + ') ' + o).join('  '), 'kaget', 'o_kuis'];
}
function greet() { const p = skyNow();
  if (p === 'subuh') return ['Selamat pagi! Sudah sholat Subuh?', 'o_pagi', 'sholat'];
  if (p === 'isya') return ['Sebentar lagi tidur ya. Sudah sholat Isya?', 'o_malam', 'sholat'];
  return ['Halo! Aku Jimon. Mau ngobrol apa hari ini?', 'o_halo', null]; }

let JC = null;
function renderJimonChat() {
  const O = ortu(), J = jget('jimon', {}), el = $('#v-jimon'), tk = todayK(), cn = jget('chatn', {});
  if (!JC) { const g = greet(); JC = { msgs:[{ t:g[0] }], face:'senang', quiz:null, anim:true, hearts:false, taps:[], ask:g[2] }; setTimeout(() => { if (JC && document.body.dataset.view === 'jimon') jvoice(g[1]); }, 2300); }
  const used = cn.d === tk ? cn.n : 0, left = Math.max(0, O.limit - used);
  const dirt = jimonDirt(), wear = jWear(J.wear);
  const cat = dirt ? `<img src="${jimg('jimon/keadaan/j_debu.webp')}" alt="Jimon berdebu" width="190" height="184">` : jimonHTML({ face:JC.face, wear, w:180, blink:JC.face === 'senang', cls:JC.wig ? 'jwig' : 'jbreathe' });
  el.innerHTML = `<div class="jw jkidw"><section class="jhero" style="min-height:300px;justify-content:flex-start"><img class="bg" src="${jimg('langit/sky_' + skyNow() + '.webp')}" alt="">
    <div class="jtop">${back('#saya')}<b style="color:#0F1D3D;background:rgba(255,255,255,.8);border-radius:12px;padding:2px 10px">Jimon</b><span class="jpill" style="margin-left:auto">Sisa ${left} pesan</span>${jsoundBtn()}</div>
    <div style="position:absolute;left:50%;bottom:6px;margin-left:-95px;width:190px;height:200px">
      ${JC.anim ? `<div class="jwalk" style="position:absolute;inset:0"><div class="jwframes" style="position:absolute;inset:0">${[1, 2, 3, 4].map((n, i) => `<img class="jwf" src="${jimg('jimon/jalan/w' + n + '.webp')}" alt="" style="width:100%;animation-delay:${i * .13}s">`).join('')}</div><div class="jsit" style="position:absolute;inset:0;transform-origin:50% 100%"><button data-jpet aria-label="Elus Jimon" style="border:0;background:none;padding:0">${cat}</button></div></div>`
        : `<button data-jpet aria-label="Elus Jimon" style="border:0;background:none;padding:0">${cat}</button>`}
      ${JC.hearts ? '<span class="jheart" style="left:40%;top:0">♥</span><span class="jheart" style="left:62%;top:20px;animation-delay:.25s">♥</span>' : ''}</div>
    ${JC.bubble ? `<span style="position:absolute;right:14px;top:80px;background:#fff;color:#0F1D3D;border-radius:16px;padding:6px 10px;font-weight:700">${esc(JC.bubble)}</span>` : ''}</section>
  <div class="${JC.anim ? 'jafter' : ''}" style="display:flex;flex-direction:column;gap:10px">
    ${!O.chat ? '<p class="note">Ayah atau Ibu belum menyalakan obrolan dengan Jimon. Kamu tetap bisa mengelus Jimon.</p>' : ''}
    ${JC.msgs.map(m => `<div class="jmsg ${m.me ? 'me' : ''}">${esc(m.t)}</div>`).join('')}
    ${O.chat ? `<div class="jtick">${[['Ceritakan kisah', 'kisah'], ['Kasih aku kuis', 'kuis'], ['Aku capek', 'capek'], ['Tentang kucing', 'kucing']].map(([n, k]) => jbtn(n, 'data-jq="' + n + '"', 'ghost')).join('')}</div>
    <form class="jrow" data-jform><label for="jIn" class="sr" style="position:absolute;left:-9999px">Tulis pesan</label><input id="jIn" class="inp" autocomplete="off" placeholder="Tulis pesan…" ${left ? '' : 'disabled'} style="flex:1">${jbtn('Kirim', 'type="submit" ' + (left ? '' : 'disabled'))}</form>` : ''}
    ${left ? '' : '<p class="jmut">Kita lanjut besok ya. Sekarang waktunya main di luar atau bantu Ibu?</p>'}
    <p class="jmut" style="font-size:.78rem">Jimon menjawab dari isi yang sudah diperiksa ustadz dan jawaban yang diajarkan Ayah dan Ibu. Pertanyaan lain: tanya Ayah, Ibu, atau ustadz.</p></div></div>`;
  if (JC.anim) setTimeout(() => { if (JC) JC.anim = false; }, 2400);
  const box = $('#jIn'); if (box && !JC.anim) box.focus({ preventScroll:true });
}
function jimonSend(txt) {
  const O = ortu(), tk = todayK(), cn = jget('chatn', {}), used = cn.d === tk ? cn.n : 0;
  if (!O.chat || used >= O.limit || !txt.trim()) return;
  jset('chatn', { d:tk, n:used + 1 });
  JC.msgs.push({ me:1, t:txt }); JC.face = 'dengar'; JC.anim = false; renderJimonChat();
  setTimeout(() => { const [r, f, clip] = jimonReply(txt, JC); JC.msgs.push({ t:r }); JC.face = f; jvoice(clip || jpick(['meong_1', 'meong_2', 'meong_3'])); const log = jget('chat', []); log.push({ me:1, t:txt, at:Date.now() }, { t:r, at:Date.now() }); jset('chat', log.slice(-60));
    if (document.body.dataset.view === 'jimon') renderJimonChat(); }, 900);
}
document.addEventListener('submit', e => { if (!e.target.matches('[data-jform]')) return; e.preventDefault(); const v = $('#jIn').value; $('#jIn').value = ''; jimonSend(v); });
document.addEventListener('click', e => {
  const q = e.target.closest('[data-jq]'); if (q) return jimonSend(q.dataset.jq);
  const p = e.target.closest('[data-jpet]'); if (!p || !JC || jimonDirt()) return;
  const now = Date.now(); JC.taps = JC.taps.filter(x => now - x < 1500).concat(now); const g = JC.taps.length >= 3;
  JC.face = g ? 'tertawa' : 'dengkur'; JC.hearts = true; jvoice(g ? 'tertawa' : 'dengkur'); JC.wig = g; JC.bubble = g ? 'Hihihi, geli!' : 'Prrr…'; if (g) JC.taps = []; JC.anim = false; renderJimonChat();
  clearTimeout(JC._t); JC._t = setTimeout(() => { if (!JC) return; JC.face = 'senang'; JC.hearts = false; JC.wig = false; JC.bubble = ''; if (document.body.dataset.view === 'jimon') renderJimonChat(); }, 1700);
});
/* idle: sleepy after a minute, asleep a little later; a tap wakes him */
setInterval(() => { if (!JC || document.body.dataset.view !== 'jimon' || document.hidden) return; JC.idle = (JC.idle || 0) + 1;
  if (JC.idle === 4) { JC.face = 'ngantuk'; JC.bubble = 'Hoaam…'; jvoice('menguap'); renderJimonChat(); } }, 15000);
document.addEventListener('pointerdown', () => { if (JC && JC.face === 'ngantuk') { JC.idle = 0; JC.face = 'senang'; JC.bubble = 'Halo lagi!'; if (document.body.dataset.view === 'jimon') renderJimonChat(); setTimeout(() => { if (JC) { JC.bubble = ''; } }, 1400); } else if (JC) JC.idle = 0; });
addEventListener('hashchange', () => { if (!location.hash.startsWith('#jimon')) JC = null; });
