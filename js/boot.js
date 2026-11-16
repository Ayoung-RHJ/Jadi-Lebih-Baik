/* =========================================================
   First-visit welcome (shown once per device)
   ========================================================= */
const WELCOME = {
  id:{ t:'Selamat datang di JLB!', p:[
    'JLB, Jadi Lebih Baik. Fastabiqul khairat: berlomba-lomba dalam kebaikan (QS Al-Baqarah 2:148). Aplikasi ini untuk seluruh keluarga: pupu, mamah, kakek, nenek, poo sampai xumxum.',
    'Jaga sholat lewat Amaliyah, tanam kebiasaan baik di Taman, tempuh Perjalanan dan program 40 hari, tetap bergerak lewat Jurnal Sehat Kita, dan anak-anak belajar seru bersama Jimon.',
    'Mulailah dari langkah kecil, lakukan bersama, dan rayakan setiap kemajuan. Ayo jadi lebih baik bersama keluarga!'], b:'Mulai bersama' },
  en:{ t:'Welcome to JLB!', p:[
    'JLB, Jadi Lebih Baik (Becoming Better). Fastabiqul khairat: race one another in good deeds (QS Al-Baqarah 2:148). This app is for the whole family, from the grown-ups down to the little ones.',
    'Keep your prayers with Amaliyah, grow good habits in the Garden, walk the Journey and the 40-day programme, keep moving with Jurnal Sehat Kita, and the kids learn and play with Jimon.',
    'Start with small steps, do it together and celebrate every bit of progress. Let’s become better as a family!'], b:'Start together' }
};
function renderWelcome() {
  const w = WELCOME[LANG] || WELCOME.en;
  $('#wcIn').innerHTML = `<div class="wc-top"><div class="lang" role="group" aria-label="Language"><button data-lang="en" aria-pressed="${LANG === 'en'}">EN</button><button data-lang="id" aria-pressed="${LANG === 'id'}">ID</button></div>
    <img src="img/jlb/brand/emblem.webp" alt="JLB" width="96" height="95"></div>
    <div class="wc-body"><h2 id="wcTitle">${w.t}</h2>${w.p.map(x => `<p>${x}</p>`).join('')}
    <button class="btn primary block" id="wcGo">${w.b}</button></div>`;
}
function openWelcome() { $('#welcome').hidden = false; document.body.classList.add('wlock'); renderWelcome(); setTimeout(() => { const b = $('#wcGo'); if (b) b.focus(); }, 50); }
function closeWelcome() { store.set('welcomed', 1); store.set('welcomed_jlb', 1); $('#welcome').hidden = true; document.body.classList.remove('wlock'); }
$('#welcome').addEventListener('click', e => { if (e.target.closest('#wcGo')) closeWelcome(); });
document.addEventListener('keydown', e => { if (e.key !== 'Escape') return; if (!$('#welcome').hidden) closeWelcome(); else if (!$('#builder').hidden) closeBuilder(); else if (!$('#settings').hidden) closeSettings(); });

/* Boot */
paintChrome();
if (!PROF && PROFILES.length > 1) openPicker();
else if (!PROF && PROFILES.length === 1) { CUR = PROFILES[0].id; store.set('cur', CUR); PROF = ps.get('profile', null); route(); }
else if (PROF && PROFILES.length > 1) { route(); openPicker(); }
else route();
if (!store.get('welcomed_jlb', 0)) openWelcome();

/* Offline + faster repeat visits (JLB) */
if ('serviceWorker' in navigator && location.protocol === 'https:') addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
