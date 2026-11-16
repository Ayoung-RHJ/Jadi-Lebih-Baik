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
function jimonReply(txt, st) {
  const t = ' ' + txt.toLowerCase() + ' ';
  if (st.quiz) { const q = JQ[st.quiz.i], pick = st.quiz.opts[Number(t.trim()) - 1] || st.quiz.opts.find(o => t.includes(o.toLowerCase().replace(/[“”’‘]/g, ''))); st.quiz = null;
    if (pick === q[1][0]) return ['MasyaAllah, benar! Jawabannya ' + q[1][0] + ' (' + q[2] + ').', 'tertawa'];
    return ['Hampir! Jawabannya ' + q[1][0] + ' (' + q[2] + '). Kita coba lagi nanti ya.', 'peduli']; }
  if (/alamat|rumahku di|sekolah(ku)? di|nomor|no\.? ?hp|\bwa\b|whatsapp|\d{6,}|password|kata sandi/.test(t)) return ['Itu rahasia keluarga, tidak usah diceritakan ke siapa pun ya, termasuk aku.', 'peduli'];
  if (/sedih|nangis|menangis|takut|kesepian|dimarahi/.test(t)) return ['Aku di sini. Mau cerita ke Ayah atau Ibu juga? Kita bisa berdoa seperti Nabi Yunus.', 'peduli'];
  if (/capek|lelah|malas|ngantuk/.test(t)) return ['Wajar kok capek. Istirahat sebentar, minum air, lalu coba Jurus Ninja 5 menit yuk.', 'peduli'];
  if (/boleh|haram|halal|dosa|hukum|najis|kafir|surga|neraka|setan|jin\b|musik|pacar/.test(t)) return ['Itu pertanyaan bagus! Yang ini tanya Ayah, Ibu, atau ustadz ya.', 'dengar'];
  if (/game|roblox|youtube|tiktok|minecraft|film|kartun|hp\b/.test(t)) return ['Wah, aku cuma tahu soal belajar, gerak, dan akhlak. Mau kuis?', 'dengar'];
  if (/wudhu|wudu/.test(t)) return ['Supaya kita bersih dan siap menghadap Allah. Allah sendiri yang memerintahkan wudhu sebelum sholat (QS Al-Ma’idah 5:6). Mau coba urutan wudhu di Belajar Seru?', 'senang'];
  if (/sholat|shalat|salat|lentera/.test(t)) return ['Sholat wajib ada 5: Subuh, Dzuhur, Ashar, Maghrib, Isya. Sudah nyalakan lenteramu hari ini?', 'senang'];
  if (/kuis|tebak|soal|tanya aku/.test(t)) { const i = Math.floor(Math.random() * JQ.length), opts = JQ[i][1].slice().sort(() => Math.random() - .5); st.quiz = { i, opts };
    return [JQ[i][0] + ' ' + opts.map((o, n) => (n + 1) + ') ' + o).join('  '), 'kaget']; }
  if (/kisah|cerita|nabi/.test(t)) return ['Ada kisah Nabi Nuh, Ibrahim, Musa, Yunus, dan Nabi Muhammad ﷺ. Bukanya di Belajar Seru, aku temani!', 'senang'];
  if (/doa/.test(t)) return ['Doa harian ada di Belajar Seru, Unit 7: doa minta ilmu, doa untuk orang tua, doa makan, dan doa tidur.', 'senang'];
  if (/kucing|jimon|kamu siapa|siapa kamu/.test(t)) return [JFACT[Math.floor(Math.random() * JFACT.length)], 'tertawa'];
  if (/terima ?kasih|makasih/.test(t)) return ['Sama-sama! Aku senang belajar bersamamu.', 'senang'];
  if (/assalam|halo|hai\b|hi\b|pagi|siang|sore|malam/.test(t)) return [greet(), 'senang'];
  if (/rumahmu|tinggal di mana/.test(t)) return ['Aku tinggal di aplikasi ini!', 'tertawa'];
  return ['Hmm, aku belum tahu itu. Mau kuis, kisah, atau Jurus Ninja?', 'dengar'];
}
function greet() { const p = skyNow(); return p === 'subuh' ? 'Assalamu’alaikum! Sudah sholat Subuh? Aku sudah bangun dari tadi.' : p === 'isya' ? 'Assalamu’alaikum! Sebentar lagi tidur, sudah Isya belum?' : 'Assalamu’alaikum! Jangan lupa sholat tepat waktu ya, aku tunggu di sini.'; }
let JC = null;
function renderJimonChat() {
  const O = ortu(), J = jget('jimon', {}), el = $('#v-jimon'), tk = todayK(), cn = jget('chatn', {});
  if (!JC) JC = { msgs:[{ t:greet() }], face:'senang', quiz:null, anim:true, hearts:false, taps:[] };
  const used = cn.d === tk ? cn.n : 0, left = Math.max(0, O.limit - used);
  const dirt = jimonDirt(), wear = J.wear && J.wear !== 'tidur' ? J.wear : '';
  const cat = dirt ? `<img src="${jimg('jimon/keadaan/j_debu.webp')}" alt="Jimon berdebu" width="190" height="184">` : jimonHTML({ face:JC.face, wear, w:180, blink:JC.face === 'senang', cls:JC.wig ? 'jwig' : 'jbreathe' });
  el.innerHTML = `<div class="jw jkidw"><section class="jhero" style="min-height:300px;justify-content:flex-start"><img class="bg" src="${jimg('langit/sky_' + skyNow() + '.webp')}" alt="">
    <div class="jtop">${back('#saya')}<b style="color:#0F1D3D;background:rgba(255,255,255,.8);border-radius:12px;padding:2px 10px">Jimon</b><span class="jpill" style="margin-left:auto">Sisa ${left} pesan</span></div>
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
    <p class="jmut" style="font-size:.78rem">Jimon menjawab dari isi yang sudah diperiksa ustadz. Pertanyaan lain: tanya Ayah, Ibu, atau ustadz.</p></div></div>`;
  if (JC.anim) setTimeout(() => { if (JC) JC.anim = false; }, 2400);
  const box = $('#jIn'); if (box && !JC.anim) box.focus({ preventScroll:true });
}
function jimonSend(txt) {
  const O = ortu(), tk = todayK(), cn = jget('chatn', {}), used = cn.d === tk ? cn.n : 0;
  if (!O.chat || used >= O.limit || !txt.trim()) return;
  jset('chatn', { d:tk, n:used + 1 });
  JC.msgs.push({ me:1, t:txt }); JC.face = 'dengar'; JC.anim = false; renderJimonChat();
  setTimeout(() => { const [r, f] = jimonReply(txt, JC); JC.msgs.push({ t:r }); JC.face = f; const log = jget('chat', []); log.push({ me:1, t:txt, at:Date.now() }, { t:r, at:Date.now() }); jset('chat', log.slice(-60));
    if (document.body.dataset.view === 'jimon') renderJimonChat(); }, 900);
}
document.addEventListener('submit', e => { if (!e.target.matches('[data-jform]')) return; e.preventDefault(); const v = $('#jIn').value; $('#jIn').value = ''; jimonSend(v); });
document.addEventListener('click', e => {
  const q = e.target.closest('[data-jq]'); if (q) return jimonSend(q.dataset.jq);
  const p = e.target.closest('[data-jpet]'); if (!p || !JC || jimonDirt()) return;
  const now = Date.now(); JC.taps = JC.taps.filter(x => now - x < 1500).concat(now); const g = JC.taps.length >= 3;
  JC.face = g ? 'tertawa' : 'dengkur'; JC.hearts = true; JC.wig = g; JC.bubble = g ? 'Hihihi, geli!' : 'Prrr…'; if (g) JC.taps = []; JC.anim = false; renderJimonChat();
  clearTimeout(JC._t); JC._t = setTimeout(() => { if (!JC) return; JC.face = 'senang'; JC.hearts = false; JC.wig = false; JC.bubble = ''; if (document.body.dataset.view === 'jimon') renderJimonChat(); }, 1700);
});
/* idle: sleepy after a minute, asleep a little later; a tap wakes him */
setInterval(() => { if (!JC || document.body.dataset.view !== 'jimon' || document.hidden) return; JC.idle = (JC.idle || 0) + 1;
  if (JC.idle === 4) { JC.face = 'ngantuk'; JC.bubble = 'Hoaam…'; renderJimonChat(); } }, 15000);
document.addEventListener('pointerdown', () => { if (JC && JC.face === 'ngantuk') { JC.idle = 0; JC.face = 'senang'; JC.bubble = 'Halo lagi!'; if (document.body.dataset.view === 'jimon') renderJimonChat(); setTimeout(() => { if (JC) { JC.bubble = ''; } }, 1400); } else if (JC) JC.idle = 0; });
addEventListener('hashchange', () => { if (!location.hash.startsWith('#jimon')) JC = null; });
