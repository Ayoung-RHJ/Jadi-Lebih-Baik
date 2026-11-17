/* =========================================================
   Gerak bersama Jimon (kids, jlb7)
   - Gerak tab for kids: pick an adventure (10/15/20 min), see the week's stars and today's moves.
   - In the session player Jimon is the coach for kids: his pose follows the phase and he speaks
     the recorded lines (img/jlb/jimon/suara/c_*.mp3) instead of the device voice.
   Sessions come from the existing kids' builder (playSession): bodyweight only, max 20 minutes, warm-up required.
   ========================================================= */
const GLV = [['kilat', 'Ninja Kilat', 10, 'Pemanasan, tinju, gerak seru', '#0E7C66'], ['tangguh', 'Ninja Tangguh', 15, 'Lebih banyak ronde tinju', '#2450D6'], ['juara', 'Ninja Juara', 20, 'Petualangan terpanjang', '#A85705']];
const PELATIH = p => jimg('jimon/pelatih/pelatih_' + p + '.webp');
let GK = { pose:'siap', say:'', pet:0 };
function gerakSes(lv) { const L = GLV.find(x => x[0] === lv) || GLV[0]; return Object.assign(playSession(PROF, weekNo(PROF) || 1, L[2]), { name:L[1] }); }
function weekStars() {
  const log = (typeof getLog === 'function' ? getLog() : ps.get('log', [])) || [], out = [];
  const d0 = new Date(); d0.setHours(0, 0, 0, 0); d0.setDate(d0.getDate() - ((d0.getDay() + 6) % 7));   // Monday
  for (let i = 0; i < 7; i++) { const k = dkey(jAdd(d0, i)), n = log.filter(e => e && e.d === k).reduce((a, e) => a + (e.stars || (e.min ? 1 : 0)), 0);
    out.push({ k, n:Math.min(3, n), future:k > todayK(), today:k === todayK() }); }
  return out;
}
function renderGerakKid() {
  const lv = setting('gerakLv', 'kilat'), L = GLV.find(x => x[0] === lv) || GLV[0], ses = gerakSes(lv), wk = weekStars(), tot = wk.reduce((a, d) => a + d.n, 0), today = wk.find(d => d.today);
  const moves = [...new Set([].concat(ses.warm.slice(0, 2), ses.play ? ses.play.moves : []))].slice(0, 6).filter(id => MOVES[id]);
  if (!GK.say) GK.say = today && today.n ? 'MasyaAllah, hari ini kamu sudah bergerak! Mau satu petualangan lagi?' : 'Assalamu’alaikum! Aku pelatihmu hari ini. Pilih petualangan, lalu kita gerak!';
  $('#v-home').innerHTML = `<div class="jw jkidw jgerak">
    <section class="jghero"><div class="jrow sp"><b class="jgt">Gerak bersama Jimon</b>${jsoundBtn()}</div>
      <p class="jgbub" aria-live="polite">${esc(GK.say)}</p><span class="jgtag">Pelatih</span>
      <button class="jgcat" data-gpet aria-label="Elus Jimon"><img src="${PELATIH(GK.pose)}" alt="Jimon pelatih" width="200" height="231"></button></section>
    <section class="jcard" style="background:var(--jkidcard)"><div class="jrow sp"><h2>Bintang pekan ini</h2><span class="jpill">${tot} / 21</span></div>
      <div class="jgweek">${wk.map((d, i) => `<span class="${d.n ? 'on' : d.future ? 'fut' : ''} ${d.today ? 'now' : ''}"><b>${d.n ? '★' + d.n : d.future ? '' : '·'}</b><small>${['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Ahd'][i]}</small></span>`).join('')}</div></section>
    <section class="jgpick"><h2>Pilih petualanganmu</h2>${GLV.map(x => `<button data-glv="${x[0]}" aria-pressed="${x[0] === lv}"><span style="background:${x[4]}">${x[2]}'</span><span><b>${x[1]}</b><small>${x[3]}</small></span><em>+10 XP</em></button>`).join('')}</section>
    <section class="jcard" style="background:var(--jkidcard)"><div class="jrow sp"><h2>Gerakan hari ini</h2><span class="jpill" style="background:#E3F3EE;color:#0B5C4C">Tanpa dumbel</span></div>
      <div class="jgmoves">${moves.map(id => `<span>${esc(L_n(id))}</span>`).join('')}</div>
      <span class="jmut">${ses.warm.length} gerakan pemanasan${ses.box ? ', ' + ses.box.rounds + ' ronde tinju' : ''}${ses.play ? ', ' + ses.play.moves.length + ' gerak seru' : ''}, lalu pendinginan. Sekitar ${ses.min} menit.</span>
      <span class="jmut">Berlatih dengan Ayah, Ibu, atau orang dewasa di dekatmu. Kalau ada yang sakit, berhenti dan bilang ya.</span></section>
    <button class="jb gold block jggo" data-gstart>Ayo mulai, ${esc(L[1])}!</button></div>`;
}
const L_n = id => (typeof L === 'function' ? L(MOVES[id].n) : MOVES[id].n[1]);
document.addEventListener('click', e => {
  const t = e.target.closest('[data-glv],[data-gstart],[data-gpet]'); if (!t) return;
  if (t.dataset.glv) { setSetting('gerakLv', t.dataset.glv); const L = GLV.find(x => x[0] === t.dataset.glv); GK.say = L[1] + '? Pilihan keren! Sekitar ' + L[2] + ' menit.'; GK.pose = 'jempol'; jvoice('meong_1'); return renderGerakKid(); }
  if (t.dataset.gpet !== undefined) { GK.pet++; const g = GK.pet % 3 === 0; GK.pose = g ? 'sorak' : jpick(['siap', 'peluit', 'jempol']); GK.say = g ? 'Hihihi, geli! Ayo kita gerak!' : 'Prrr… aku sudah siap!';
    jvoice(g ? 'tertawa' : 'dengkur'); renderGerakKid(); const c = $('.jgcat'); if (c) c.classList.add('jwig'); return; }
  if (t.dataset.gstart !== undefined) { jhush(); GK.say = ''; startSession('PLAY', gerakSes(setting('gerakLv', 'kilat'))); }
});
/* kids get this screen on the Gerak tab; the sub-nav (Gerakan, Jurnal) stays */
{ const f = RENDER.home; RENDER.home = function () {
    if (!isKidP()) return f();
    renderGerakKid(); const el = $('#v-home');
    el.insertAdjacentHTML('afterbegin', `<nav class="jsub" aria-label="Gerak"><span class="jsub-t">Gerak</span>${[['home', 'Jimon Pelatih'], ['workouts', 'Gerakan'], ['progress', 'Jurnal']].map(([h, t]) => `<a href="#${h}" ${h === 'home' ? 'aria-current="page"' : ''}>${t}</a>`).join('')}</nav>`);
  }; }

/* ---- Jimon as the coach inside the session player (kids only) ---- */
const jkidSes = () => typeof S !== 'undefined' && S && S.ses && S.ses.kid && isKidP();
function poseFor(st) {
  if (!st) return 'siap';
  if (st.k === 'finish') return 'bintang';
  if (st.k === 'rest' || st.k === 'brest') return 'minum';
  if (st.k === 'round' || st.id === 'stance') return st.k === 'round' ? 'jab' : 'siap';
  if (st.blk === 'warm') return st.i === 0 ? 'peluit' : st.i % 2 ? 'hitung' : 'siap';
  if (st.blk === 'cool') return st.id === 'breathe' ? 'napas' : 'regang';
  if (st.blk === 'play') return st.id === 'frog' ? 'katak' : st.i % 2 ? 'sorak' : 'jempol';
  return 'siap';
}
function jimonizePlayer() {
  if (!jkidSes()) return;
  const st = S.steps[S.i], img = `<img class="jcoach" src="${PELATIH(poseFor(st))}" alt="Jimon pelatih" width="96" height="111">`;
  document.querySelectorAll('#plIn .coachline').forEach(c => { const av = c.firstElementChild; if (av && av.tagName !== 'P' && !av.classList.contains('jcoach')) av.outerHTML = img; c.classList.add('jimonc'); });
  PL.classList.add('jkidpl');
}
{ const rs = renderStep; renderStep = function () { if (S) S._jv = 0; rs(); jimonizePlayer(); }; }
{ const fs = finishSession; finishSession = function (complete) { fs(complete); if (jkidSes()) { S._fin = 1; jimonizePlayer(); const st = $('#plIn .coachline img.jcoach'); if (st) st.src = PELATIH(complete ? 'bintang' : 'lelah'); } }; }
{ const cp = closePlayer; closePlayer = function () { jhush(); PL.classList.remove('jkidpl'); cp(); }; }
/* The device voice is replaced by Jimon's recorded lines for kids; the written line still shows as a subtitle */
{ const sayDev = say; say = function (text, opt = {}) {
    if (!jkidSes() || opt.voice) return sayDev(text, opt);
    const sub = $('#plSay'); if (sub && !opt.quiet && text && !/^\d+$/.test(text)) sub.textContent = text;
    if (opt.quiet || !text || /^(Switch sides|Ganti sisi)/.test(text)) return;
    const st = S.steps[S.i] || {}, n = S._jv = (S._jv || 0) + 1;
    if (S._fin || st.k === 'finish') return jvoiceSeq(['c_selesai', 'c_bintang']);
    if (S.i === 0 && n === 1) return jvoiceSeq(['c_mulai', 'c_pemanasan']);
    if (st.k === 'rest' || st.k === 'brest') return jvoice(n === 1 ? jpick(['c_minum', 'c_istirahat']) : 'c_lanjut');
    if (st.k === 'round') return jvoice(n === 1 ? 'c_tinju' : jpick(['c_semangat', 'c_ayo', 'c_kuat']));
    if (st.blk === 'warm') return jvoice(n === 1 ? jpick(['c_ayo', 'c_bagus', 'c_pelan']) : 'c_setengah');
    if (st.blk === 'cool') return jvoice(n === 1 ? (st.i === 0 ? 'c_pendinginan' : 'c_pelan') : 'c_bagus');
    if (st.blk === 'play') return jvoice(n === 1 ? jpick(['c_ayo', 'c_semangat', 'c_bagus']) : 'c_setengah');
    return jvoice(jpick(['c_ayo', 'c_bagus']));
  }; }
document.addEventListener('click', e => { const b = e.target.closest('[data-pl="pause"]'); if (!b || !jkidSes()) return;
  setTimeout(() => { if (S) jvoice(S.paused ? 'c_jeda' : 'c_lanjut'); }, 0); });
