/* =========================================================
   jlb14 · Main bersama Musim 2: lima game kanvas untuk anak (dimuat di #main)
   Mesin diadaptasi dari game WIRTIX: Hisana Run (Pulang), Catch the Crunch (Hujan Bintang),
   Tower Stacker (Menara Kardus), Speed Fest Drift (Kejar Tikus), Crispy Slicer (Masak Sup).
   Aturan anak: tanpa nilai minus, tanpa "mati", tanpa musik (hanya efek suara pendek dan suara Jimon),
   satu jari, waktu game berhenti saat aplikasi ditinggal. Rekor pribadi di jlb:jimon.rek (ikut sinkron).
   Semua ukuran dalam piksel layar arena (W × H), kecepatan per detik.
   ========================================================= */
const M2P = n => n.includes('/') ? jimg(n) : jimg('main2/' + n + '.webp');
const G2IMG = {};
function g2Load(names) {
  return Promise.all(names.map(n => G2IMG[n] ? G2IMG[n] : (G2IMG[n] = new Promise(res => {
    const i = new Image(); i.decoding = 'async'; i.onload = () => res(i); i.onerror = () => res(null); i.src = M2P(n);
  })))).then(list => { const o = {}; names.forEach((n, k) => { o[n.split('/').pop().replace(/\.webp$/, '')] = list[k]; }); return o; });
}
/* clips waiting for the ustadz (Lembar Periksa bagian 15) get a neutral clip here; v_game_rumah was approved on 23 Nov 2026 */
const G2TUNGGU = {};
const g2v = (id, then) => jvoice(G2TUNGGU[id] || id, then);

/* short sound effects made in code (tones, not music) */
let G2AC = null;
function sfx(k) {
  if (!jsoundOn()) return;
  const P = { pop:[660, 1180, .12, 'sine'], jump:[360, 760, .16, 'triangle'], thud:[170, 80, .2, 'square'], splash:[900, 260, .22, 'sawtooth'],
    slice:[1500, 520, .1, 'sawtooth'], plop:[280, 620, .13, 'sine'], tidy:[520, 1040, .15, 'triangle'], bad:[240, 150, .22, 'square'], wob:[300, 220, .25, 'triangle'] }[k];
  if (!P) return;
  try {
    G2AC = G2AC || new (window.AudioContext || window.webkitAudioContext)(); if (G2AC.state === 'suspended') G2AC.resume();
    const ac = G2AC, t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
    o.type = P[3]; o.frequency.setValueAtTime(P[0], t); o.frequency.exponentialRampToValueAtTime(P[1], t + P[2]);
    g.gain.setValueAtTime(.09, t); g.gain.exponentialRampToValueAtTime(.001, t + P[2]);
    o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + P[2] + .03);
  } catch (e) {}
}

/* ---- drawing helpers ---- */
function dImg(c, im, x, y, w, h, o = {}) {   // x,y = anchor point; o.ax/o.ay = anchor (0..1), o.rot, o.flip, o.alpha
  if (!im) return;
  c.save(); c.translate(x, y); if (o.rot) c.rotate(o.rot); if (o.flip) c.scale(-1, 1); if (o.alpha !== undefined) c.globalAlpha = o.alpha;
  c.drawImage(im, -w * (o.ax ?? .5), -h * (o.ay ?? .5), w, h); c.restore();
}
const hOf = (im, w) => im ? w * im.height / im.width : w;
const wOf = (im, h) => im ? h * im.width / im.height : h;
function cover(c, im, W, H, alpha = 1) { if (!im) return; const s = Math.max(W / im.width, H / im.height), w = im.width * s, h = im.height * s;
  c.globalAlpha = alpha; c.drawImage(im, (W - w) / 2, (H - h) / 2, w, h); c.globalAlpha = 1; }
/* a picture repeated sideways; every second copy mirrored so the edges always meet */
function tileX(c, im, off, y, h, W, alpha = 1) {
  if (!im) return; const w = wOf(im, h); let x = off % (2 * w); if (x > 0) x -= 2 * w; let k = 0;
  c.globalAlpha = alpha;
  for (; x < W; x += w, k++) { if (k % 2) { c.save(); c.translate(x + w, y); c.scale(-1, 1); c.drawImage(im, 0, 0, w + 1, h); c.restore(); } else c.drawImage(im, x, y, w + 1, h); }
  c.globalAlpha = 1;
}
function pill(c, txt, x, y, al = 'left') {
  c.font = '800 16px ' + getComputedStyle(document.body).getPropertyValue('--jfont').split(',')[0].replace(/['"]/g, '') + ', system-ui, sans-serif';
  const w = c.measureText(txt).width + 22, X = al === 'right' ? x - w : al === 'center' ? x - w / 2 : x;
  c.fillStyle = 'rgba(255,255,255,.92)'; c.beginPath(); c.roundRect ? c.roundRect(X, y, w, 30, 15) : c.rect(X, y, w, 30); c.fill();
  c.fillStyle = '#0F1D3D'; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillText(txt, X + 11, y + 16);
}
function popText(S, txt, x, y, col = '#F2C94C') { S.pops.push({ txt, x, y, t:0, col }); }
function drawPops(c, S, dt) {
  S.pops = S.pops.filter(p => (p.t += dt) < .8);
  S.pops.forEach(p => { c.globalAlpha = 1 - p.t / .8; c.font = '900 24px system-ui, sans-serif'; c.textAlign = 'center'; c.lineWidth = 4; c.strokeStyle = '#fff';
    c.strokeText(p.txt, p.x, p.y - p.t * 60); c.fillStyle = p.col; c.fillText(p.txt, p.x, p.y - p.t * 60); });
  c.globalAlpha = 1; c.textAlign = 'left';
}

/* ---------------- the shared runner ---------------- */
function g2Run(g) {
  const G = G2[g.id]; if (!G) return;
  gameShell(g, `<section class="jg2" id="jg2" style="--c:${g.c}"><canvas id="jg2c" aria-label="${esc(g.n)}"></canvas><div class="jg2-load" id="jg2l">Menyiapkan permainan…</div></section>
    <p class="jmut">${esc(g.how)}</p>`, '');
  const sec = $('#jg2'), cv = $('#jg2c');
  const W = sec.clientWidth, H = Math.round(Math.max(380, Math.min(innerHeight - 190, W * 1.55, 720)));
  const dpr = Math.min(2, devicePixelRatio || 1);
  cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.height = H + 'px'; sec.style.height = H + 'px';
  const c = cv.getContext('2d'); c.scale(dpr, dpr);
  g2Load(G.imgs).then(I => {
    if (!JG || JG.id !== g.id || JG.phase !== 'run' || !cv.isConnected) return;
    const l = $('#jg2l'); if (l) l.remove();
    const S = JG.s = { W, H, I, t:0, score:0, pops:[], over:null, g };
    G.init(S);
    if (G.voice) setTimeout(() => { if (JG && JG.s === S) g2v(G.voice); }, 300);
    const pos = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    cv.onpointerdown = e => { e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (x) {} S.down = true; const [x, y] = pos(e); G.down && G.down(S, x, y); };
    cv.onpointermove = e => { if (!S.down && !G.hover) return; e.preventDefault(); const [x, y] = pos(e); G.move && G.move(S, x, y); };
    cv.onpointerup = cv.onpointercancel = e => { S.down = false; G.up && G.up(S); };
    let last = 0;
    const loop = now => {
      if (!JG || JG.s !== S || JG.phase !== 'run' || document.body.dataset.view !== 'main' || !cv.isConnected) return;
      const dt = Math.min(.05, last ? (now - last) / 1000 : 0); last = now;
      if (!S.over) { S.t += dt; G.step(S, dt); }
      c.clearRect(0, 0, W, H); G.draw(S, c, dt); drawPops(c, S, dt);
      if (G.dur) { const left = Math.max(0, Math.ceil(G.dur(S) - S.t)); if (left !== S.shown) { S.shown = left; const s = $('#jgSub'); if (s) s.textContent = left + ' detik'; } }
      if (S.over) { S.overT = (S.overT || 0) + dt; if (S.overT > (S.overWait ?? .9)) return g2Finish(g, G, S); }
      JG.raf = requestAnimationFrame(loop);
    };
    cancelAnimationFrame(JG.raf); JG.raf = requestAnimationFrame(loop);
  });
}
function g2Finish(g, G, S) {
  const [title, sub, voice, img] = G.end(S), score = Math.round(S.score);
  let prev = 0; jimonSave(J => { J.rek = Object.assign({}, J.rek || {}); prev = J.rek[g.id] || 0; if (score > prev) J.rek[g.id] = score; });
  const rekor = score > prev && prev > 0;
  gameEnd(g, title, sub + (rekor ? ' Rekor baru!' : ''), img);
  g2v(voice || 'c_selesai', () => { if (rekor) jvoice('v_puji_rekor'); });
}
document.addEventListener('visibilitychange', () => { if (!document.hidden && JG && JG.s) JG.s.down = false; });

const G2 = {};

/* ======== 1. Jimon Pulang Sebelum Maghrib (runner, dari Hisana Run) ======== */
G2.pulang = {
  imgs:['bg_pulang_siang', 'bg_pulang_senja', 'bg_jalan', 'j_lari1', 'j_lari2', 'j_lari3', 'j_lompat', 'j_luncur', 'j_jatuh', 'genangan', 'pagar', 'jemuran', 'jimon/barang/b_ikan.webp'],
  voice:'v_game_lompat', dur:() => 50,
  init(S) {
    const { W, H } = S; S.gH = H * .2; S.gy = H - S.gH * .78; S.ph = H * .16; S.sc = S.ph / S.I.j_lari1.height;
    Object.assign(S, { y:S.gy, vy:0, air:false, slide:0, stum:0, inv:0, hits:0, fish:0, sp:W * .55, dist:0, next:W * .9, obs:[], fishes:[], fr:0, hint:4 });
  },
  down(S, x, y) {
    if (S.stum > 0) return;
    if (y < S.H * .55) { if (!S.air) { S.vy = -S.H * 1.55; S.air = true; S.slide = 0; sfx('jump'); } }
    else if (!S.air) { S.slide = .75; sfx('pop'); }
    S.hint = Math.min(S.hint, .6);
  },
  step(S, dt) {
    const { W, H } = S;
    S.sp = W * (.55 + Math.min(.3, S.t * .007)) * (S.stum > 0 ? .45 : 1);
    S.dist += S.sp * dt; S.fr += dt * 10; S.hint -= dt;
    if (S.slide > 0) S.slide -= dt; if (S.stum > 0) S.stum -= dt; if (S.inv > 0) S.inv -= dt;
    if (S.air) { S.vy += H * 4.2 * dt; S.y += S.vy * dt; if (S.y >= S.gy) { S.y = S.gy; S.vy = 0; S.air = false; } }
    /* new things on the road */
    S.next -= S.sp * dt;
    if (S.next <= 0 && S.t < 47) {
      const r = Math.random(), k = r < .4 ? 'genangan' : r < .72 ? 'pagar' : 'jemuran', I = S.I[k];
      const w = k === 'genangan' ? W * .3 : k === 'pagar' ? W * .3 : W * .46, h = hOf(I, w);
      const y = k === 'jemuran' ? S.gy - S.ph * .56 - h : S.gy - h + (k === 'genangan' ? h * .45 : 4);
      S.obs.push({ k, x:W + 10, y, w, h });
      if (Math.random() < .75) { const fy = k === 'jemuran' ? S.gy - S.ph * .3 : k === 'genangan' || Math.random() < .5 ? S.gy - S.ph * 1.55 : S.gy - S.ph * .45;
        S.fishes.push({ x:W + 10 + w / 2 + (k === 'jemuran' ? 0 : 0), y:fy, got:0 }); }
      S.next = W * (.75 + Math.random() * .7) * (1 + Math.min(.4, S.t * .004));
    }
    S.obs.forEach(o => { o.x -= S.sp * dt; }); S.obs = S.obs.filter(o => o.x + o.w > -10);
    S.fishes.forEach(f => { f.x -= S.sp * dt; }); S.fishes = S.fishes.filter(f => f.x > -60 && !f.got);
    /* Jimon's box */
    const px = W * .22, pw = S.ph * .5, ph = S.slide > 0 ? S.ph * .45 : S.ph * .92, top = S.y - ph;
    S.fishes.forEach(f => { if (Math.abs(f.x - px) < pw * .8 && f.y > top - 20 && f.y < S.y + 10) { f.got = 1; S.fish++; S.score = S.fish; sfx('pop'); popText(S, '+1', f.x, f.y - 20); } });
    if (S.inv <= 0 && S.stum <= 0) for (const o of S.obs) {
      if (o.x + o.w * .15 > px + pw / 2 || o.x + o.w * .85 < px - pw / 2) continue;
      const hit = o.k === 'jemuran' ? top < o.y + o.h * .8 : o.k === 'genangan' ? S.y > o.y + o.h * .3 : S.y > o.y + o.h * .25;
      if (hit) { S.hits++; S.stum = .8; S.inv = 2; S.slide = 0; sfx('thud'); jbuzz(40); if (S.hits === 1) jvoice('v_pendek_eh'); if (S.hits >= 3) S.over = 'jatuh'; break; }
    }
    if (S.t >= 50 && !S.over) S.over = 'rumah';
  },
  draw(S, c) {
    const { W, H, I } = S, gTop = H - S.gH, p = Math.min(1, S.t / 50);
    c.fillStyle = '#9ED8F5'; c.fillRect(0, 0, W, gTop);
    tileX(c, I.bg_pulang_siang, -S.dist * .22, 0, gTop + 6, W);
    tileX(c, I.bg_pulang_senja, -S.dist * .22, 0, gTop + 6, W, Math.max(0, (p - .25) / .75));
    tileX(c, I.bg_jalan, -S.dist, H - S.gH, S.gH, W);
    S.obs.forEach(o => dImg(c, I[o.k], o.x, o.y, o.w, o.h, { ax:0, ay:0 }));
    const fw = W * .12; S.fishes.forEach(f => dImg(c, I.b_ikan, f.x, f.y + Math.sin(S.t * 5 + f.x * .02) * 4, fw, hOf(I.b_ikan, fw)));
    /* Jimon */
    if (!(S.inv > 0 && S.stum <= 0 && Math.floor(S.t * 10) % 2)) {
      const im = S.stum > 0 ? I.j_jatuh : S.slide > 0 ? I.j_luncur : S.air ? I.j_lompat : I['j_lari' + (Math.floor(S.fr) % 3 + 1)];
      const sc = S.sc * (S.slide > 0 ? .78 : 1), bob = !S.air && !S.slide && !S.stum ? Math.abs(Math.sin(S.fr * 1.05)) * -3 : 0;
      dImg(c, im, W * .22, S.y + bob + 4, im.width * sc, im.height * sc, { ax:.5, ay:1 });
    }
    /* home bar */
    pill(c, 'Ikan ' + S.fish, 10, 10); const bx = W - 150, by = 20; c.fillStyle = 'rgba(255,255,255,.85)'; c.fillRect(bx, by, 120, 10);
    c.fillStyle = '#F2994A'; c.fillRect(bx, by, 120 * p, 10); c.font = '18px system-ui'; c.fillText('🏠', bx + 122, by + 6); c.fillText('🐾', bx + 120 * p - 9, by + 6);
    if (S.hint > 0) { c.globalAlpha = Math.min(1, S.hint); pill(c, '↑ Ketuk di atas: lompat', W / 2, H * .28, 'center'); pill(c, '↓ Ketuk di bawah: meluncur', W / 2, H * .62, 'center'); c.globalAlpha = 1; }
  },
  end(S) {
    return S.over === 'rumah' ? ['Alhamdulillah, Jimon sampai rumah!', 'Sebelum Maghrib, dengan ' + S.fish + ' ikan.', 'v_game_rumah', jimg('jimon/pose/p_lompat.webp')]
      : ['Jimon tersandung 3 kali', 'Ikan terkumpul: ' + S.fish + '. Besok kita coba lagi, ya.', 'v_rasa_besok', jimg('jimon/pose/p_khawatir.webp')];
  }
};

/* ======== 2. Hujan Bintang Jimon (tangkap, dari Catch the Crunch) ======== */
G2.hujan = {
  imgs:['bg_hujan', 'j_kiri', 'j_kanan', 'bintang', 'bulan', 'awan_petir', 'jimon/barang/b_ikan.webp'],
  voice:'v_game_tangkap', dur:() => 45, hover:false,
  init(S) { Object.assign(S, { px:S.W / 2, tx:S.W / 2, face:'j_kanan', items:[], spawn:.6, stun:0, warned:0, stars:0 }); S.pw = S.W * .3; S.ph = hOf(S.I.j_kanan, S.pw); },
  down(S, x) { S.tx = x; }, move(S, x) { S.tx = x; },
  step(S, dt) {
    const { W, H } = S;
    if (S.stun > 0) S.stun -= dt;
    else { const nx = S.px + (S.tx - S.px) * Math.min(1, dt * 12); if (Math.abs(nx - S.px) > .6) S.face = nx < S.px ? 'j_kiri' : 'j_kanan'; S.px = Math.max(S.pw * .4, Math.min(W - S.pw * .4, nx)); }
    S.spawn -= dt;
    if (S.spawn <= 0 && S.t < 44) {
      const r = Math.random(), k = r < .55 ? 'bintang' : r < .74 ? 'b_ikan' : r < .81 ? 'bulan' : 'awan_petir';
      const s = { bintang:.13, b_ikan:.15, bulan:.11, awan_petir:.19 }[k] * W;
      S.items.push({ k, x:s / 2 + Math.random() * (W - s), y:-s, s, vy:H * (.26 + Math.random() * .12 + Math.min(.18, S.t * .004)), ph:Math.random() * 6 });
      S.spawn = Math.max(.38, .95 - S.t * .012) * (.7 + Math.random() * .6);
    }
    const bx = S.px, by = H - S.ph * .42;
    S.items.forEach(it => {
      it.y += it.vy * dt; it.x += Math.sin(S.t * 2 + it.ph) * 18 * dt;
      if (!it.done && Math.abs(it.x - bx) < S.pw * .36 && Math.abs(it.y - by) < S.ph * .2 + it.s * .25) {
        it.done = 1;
        if (it.k === 'awan_petir') { if (S.stun <= 0) { S.stun = .8; sfx('bad'); jbuzz(30); if (!S.warned) { S.warned = 1; g2v('v_game_awas'); } popText(S, 'Kaget!', bx, by - 40, '#6B7A99'); } }
        else { const n = { bintang:1, b_ikan:2, bulan:3 }[it.k]; S.score += n; S.stars++; sfx('pop'); popText(S, '+' + n, it.x, it.y); }
      }
    });
    S.items = S.items.filter(it => !it.done && it.y < H + it.s);
    if (S.t >= 45) S.over = 'waktu';
  },
  draw(S, c) {
    const { W, H, I } = S; cover(c, I.bg_hujan, W, H);
    S.items.forEach(it => dImg(c, I[it.k], it.x, it.y, it.s, hOf(I[it.k], it.s), { rot:it.k === 'bintang' ? Math.sin(S.t * 3 + it.ph) * .25 : 0 }));
    const shake = S.stun > 0 ? Math.sin(S.t * 60) * 5 : 0;
    dImg(c, I[S.face], S.px + shake, H - 4, S.pw, S.ph, { ay:1, alpha:S.stun > 0 ? .8 : 1 });
    pill(c, '⭐ ' + S.score, 10, 10);
  },
  end(S) { return [S.score + ' poin bintang!', 'Kamu menangkap ' + S.stars + ' benda di langit sore.', S.score >= 40 ? 'v_puji_bangga' : 'v_pendek_horee', jimg('jimon/pose/p_peluk_bintang.webp')]; }
};

/* ======== 3. Menara Kardus Jimon (dari Tower Stacker) ======== */
G2.menara = {
  imgs:['bg_menara', 'alas', 'kait', 'dahan', 'k_kardus1', 'k_kardus2', 'k_kardus3', 'k_buku', 'k_bantal', 'k_peti', 'j_puncak'],
  dur:() => 90,
  init(S) {
    const { W, H, I } = S, bg = I.bg_menara;
    /* the background sheet: bottom half = garden, its upper part = day sky (repeated, mirrored), top half = night sky (repeated) */
    if (bg && !G2.menara.cv) {
      const w = bg.width, h = bg.height, hh = Math.floor(h / 2), q = Math.floor(h / 4);
      const mk = (sy, sh, flipH) => { const cv = document.createElement('canvas'); cv.width = w; cv.height = sh * 2; const x = cv.getContext('2d');
        x.drawImage(bg, 0, sy, w, sh, 0, sh, w, sh); x.save(); x.translate(0, sh); x.scale(1, -1); x.drawImage(bg, 0, sy, w, sh, 0, 0, w, sh); x.restore(); return cv; };
      const ground = document.createElement('canvas'); ground.width = w; ground.height = hh; ground.getContext('2d').drawImage(bg, 0, hh, w, hh, 0, 0, w, hh);
      G2.menara.cv = { ground, cloud:mk(hh, q), space:mk(0, hh) };
    }
    S.bw = W * .44; S.baseW = W * .82; S.baseY = H * .92;                  // top of the stage (world y)
    S.blocks = []; S.cam = 0; S.camT = 0; S.ang = 0; S.angV = 0; S.state = 'swing'; S.warn = 0;
    G2.menara.newBlock(S);
  },
  /* real balance: for every box, the middle of all boxes above it must stay over that box (the first one over the stage) */
  stands(S) {
    const B = S.blocks;
    for (let i = 0; i < B.length; i++) {
      const up = B.slice(i), cg = up.reduce((a, q) => a + q.x, 0) / up.length, under = i ? B[i - 1] : { x:S.W / 2, w:S.baseW };
      if (Math.abs(cg - under.x) > under.w / 2) return false;
    }
    return true;
  },
  kinds:['k_kardus1', 'k_kardus2', 'k_kardus3', 'k_buku', 'k_bantal', 'k_peti'],
  topY(S) { return S.blocks.length ? S.blocks[S.blocks.length - 1].y : S.baseY; },
  newBlock(S) {
    const k = jpick(G2.menara.kinds), h = Math.min(hOf(S.I[k], S.bw), S.bw * .62);
    S.cur = { k, w:S.bw, h, x:S.W / 2, y:G2.menara.topY(S) - S.H * .28 - h, ph:Math.random() * Math.PI * 2, vy:0 };
    S.state = 'swing';
  },
  down(S) { if (S.state === 'swing' && !S.over) { S.state = 'drop'; sfx('pop'); } },
  step(S, dt) {
    const { W, H } = S, M = G2.menara, b = S.cur, n = S.blocks.length;
    S.cam += (S.camT - S.cam) * Math.min(1, dt * 4);
    if (S.state === 'swing') { b.ph += dt * Math.min(3.4, 1.7 + n * .07); b.x = W / 2 + Math.sin(b.ph) * ((W - b.w) / 2 - 6); }
    else if (S.state === 'drop') {
      b.vy += H * 3.2 * dt; b.y += b.vy * dt; const top = M.topY(S);
      if (b.y + b.h >= top) {
        const under = n ? S.blocks[n - 1] : { x:W / 2, w:S.baseW }, ov = Math.min(b.x + b.w / 2, under.x + under.w / 2) - Math.max(b.x - b.w / 2, under.x - under.w / 2);
        if (ov >= b.w * .3) {
          b.y = top - b.h; S.blocks.push(b);
          if (!M.stands(S)) { S.state = 'fall'; S.over = 'runtuh'; S.overWait = 1.6; S.angV = Math.sign(b.x - W / 2) * .08; sfx('bad'); return; } S.score = S.blocks.length; sfx('thud'); jbuzz(15); popText(S, '+1', b.x, b.y + S.cam);
          if (S.score % 10 === 0) g2v('v_game_menara');
          S.camT = Math.max(0, (S.baseY - b.y) - H * .24);   // keep the top of the tower at about 68% of the screen
          M.newBlock(S);
        } else { S.state = 'fall'; S.over = 'jatuh'; S.overWait = 1.3; sfx('bad'); }
      }
    }
    /* wobble: the tower leans toward its heavy side; too far and it falls */
    if (n && S.state !== 'fall') {
      const cg = S.blocks.reduce((a, q) => a + q.x, 0) / n, target = (cg - W / 2) / W * .9 * (1 + n * .05);
      S.angV += (target - S.ang) * 6 * dt; S.angV *= Math.pow(.05, dt); S.ang += S.angV * dt * 10;
      if (Math.abs(S.ang) > .11 && !S.warn) { S.warn = 1; g2v('v_game_hap'); sfx('wob'); }
      if (Math.abs(S.ang) > .2) { S.state = 'fall'; S.over = 'runtuh'; S.overWait = 1.4; sfx('bad'); }
    }
    if (S.state === 'fall') { S.angV += Math.sign(S.ang || 1) * dt * .6; S.ang += S.angV * dt * 3; b.vy += H * 3 * dt; b.y += b.vy * dt; }
    if (S.t >= 90 && !S.over) { S.over = 'waktu'; S.overWait = 1.2; }
  },
  draw(S, c) {
    const { W, H, I } = S, cv = G2.menara.cv;
    c.fillStyle = '#0F1D3D'; c.fillRect(0, 0, W, H);
    if (cv) { const s = W / cv.ground.width, gh = cv.ground.height * s, y0 = H - gh + S.cam * .5;
      c.drawImage(cv.ground, 0, y0, W, gh); const ch = cv.cloud.height * s; let y = y0;
      for (let i = 0; i < 4; i++) { y -= ch - 2; if (y < H && y + ch > 0) c.drawImage(cv.cloud, 0, y, W, ch); }
      const sh = cv.space.height * s; while (y > 0) { y -= sh - 2; if (y < H) c.drawImage(cv.space, 0, y, W, sh); } }
    c.save(); c.translate(0, S.cam);
    dImg(c, I.alas, W / 2, S.baseY - 6, S.baseW, hOf(I.alas, S.baseW), { ay:0 });
    const px = W / 2, py = S.baseY;
    c.save(); c.translate(px, py); c.rotate(S.ang); c.translate(-px, -py);
    S.blocks.forEach(q => dImg(c, I[q.k], q.x, q.y, q.w, q.h, { ay:0 }));
    if (S.over === 'waktu') { const top = G2.menara.topY(S), jw = W * .28; dImg(c, I.j_puncak, W / 2 + (S.blocks.length ? S.blocks[S.blocks.length - 1].x - W / 2 : 0), top + 4, jw, hOf(I.j_puncak, jw), { ay:1 }); }
    c.restore();
    const b = S.cur;
    if (S.state === 'swing' && !S.over) {
      const kw = W * .1, kh = hOf(I.kait, kw), hx = b.x, hy = b.y - kh * .78;
      c.strokeStyle = '#6B4A2B'; c.lineWidth = 4; c.beginPath(); c.moveTo(W / 2, -S.cam - 4); c.lineTo(hx, hy); c.stroke();
      dImg(c, I.kait, hx, b.y + 4, kw, kh, { ay:1 });
    }
    if (S.state !== 'fall' || S.over === 'jatuh') dImg(c, I[b.k], b.x, b.y, b.w, b.h, { ay:0 });
    c.restore();
    const dw = W * .55; dImg(c, I.dahan, W - dw / 2 + 8, 34, dw, hOf(I.dahan, dw), { ay:.5 });
    pill(c, S.score + ' kardus', 10, 10);
  },
  end(S) {
    return S.over === 'waktu' ? ['Menara ' + S.score + ' kardus! Jimon sampai di puncak.', 'Sabar dan teliti, hasilnya tinggi sekali.', 'v_game_menara', jimg('main2/j_puncak.webp')]
      : ['Menaramu ' + S.score + ' kardus!', 'Hap! Pelan-pelan, besok lebih tinggi lagi.', S.score >= 10 ? 'v_puji_bangga' : 'v_puji_hampir', jimg('main2/j_puncak.webp')];
  }
};

/* ======== 4. Jimon Kejar Tikus (fisika drift dari Speed Fest, kontrol satu jari) ======== */
G2.kejar = {
  imgs:['bg_kamar_atas', 't_lari', 't_luncur', 't_duduk', 't_tikus', 't_benang', 't_bulu', 't_bantal', 't_buku', 't_kardus'],
  voice:'v_game_kejar', dur:S => S.phase === 'rapi' ? S.rapiEnd : 40,
  init(S) {
    const { W, H } = S;
    S.bx = [W * .14, W * .86]; S.by = [H * .13, H * .88];
    Object.assign(S, { x:W / 2, y:H * .55, vx:0, vy:0, ang:-Math.PI / 2, tx:null, ty:null, phase:'kejar', got:0, rapi:0, L:W * .24 });
    S.toys = []; G2.kejar.addToy(S, 't_tikus'); G2.kejar.addToy(S, 't_benang');
    const home = [['t_bantal', .3, .25], ['t_buku', .72, .3], ['t_kardus', .74, .76], ['t_bantal', .28, .72]];
    S.mess = home.map(([k, hx, hy]) => ({ k, hx:W * hx, hy:H * hy, x:W * hx, y:H * hy, vx:0, vy:0, a:0, va:0, s:W * (k === 't_kardus' ? .15 : .19), back:0 }));
  },
  addToy(S, k) {
    const { W, H } = S; let x, y, tries = 0;
    do { x = S.bx[0] + Math.random() * (S.bx[1] - S.bx[0]); y = S.by[0] + Math.random() * (S.by[1] - S.by[0]); } while (Math.hypot(x - S.x, y - S.y) < W * .4 && ++tries < 20);
    S.toys.push({ k, x, y, vx:0, vy:0, a:Math.random() * 6, wt:0, s:W * (k === 't_tikus' ? .16 : k === 't_bulu' ? .2 : .12) });
  },
  down(S, x, y) {
    if (S.phase === 'rapi') { const m = S.mess.find(q => !q.back && G2.kejar.messy(S, q) && Math.hypot(q.x - x, q.y - y) < q.s * .75);
      if (m) { m.back = .35; m.fx = m.x; m.fy = m.y; m.fa = m.a; S.rapi++; S.score++; sfx('tidy'); jbuzz(10); popText(S, '+1', m.x, m.y - 20, '#27AE60'); } return; }
    S.tx = x; S.ty = y;
  },
  move(S, x, y) { if (S.phase === 'kejar') { S.tx = x; S.ty = y; } },
  up(S) { S.tx = null; },
  messy(S, q) { return Math.hypot(q.x - q.hx, q.y - q.hy) > S.W * .06 || Math.abs(q.a) > .35; },
  step(S, dt) {
    const { W, H } = S, K = G2.kejar;
    if (S.phase === 'kejar') {
      /* the car physics: turn toward the finger, push forward, sideways speed fades slowly = sliding */
      const fx = Math.cos(S.ang), fy = Math.sin(S.ang); let fwd = S.vx * fx + S.vy * fy, lat = -S.vx * fy + S.vy * fx;
      if (S.tx !== null && Math.hypot(S.tx - S.x, S.ty - S.y) > 18) {
        let d = Math.atan2(S.ty - S.y, S.tx - S.x) - S.ang; d = Math.atan2(Math.sin(d), Math.cos(d));
        S.ang += Math.max(-1, Math.min(1, d * 3)) * 6 * dt; fwd += W * 2.4 * dt * (Math.abs(d) < 1.6 ? 1 : .3);
      } else fwd *= Math.pow(.25, dt);
      fwd = Math.min(fwd, W * 1.05); lat *= Math.pow(.07, dt);
      const nx = Math.cos(S.ang), ny = Math.sin(S.ang); S.vx = nx * fwd - ny * lat; S.vy = ny * fwd + nx * lat; S.lat = Math.abs(lat);
      S.x += S.vx * dt; S.y += S.vy * dt;
      if (S.x < S.bx[0]) { S.x = S.bx[0]; S.vx = Math.abs(S.vx) * .4; } if (S.x > S.bx[1]) { S.x = S.bx[1]; S.vx = -Math.abs(S.vx) * .4; }
      if (S.y < S.by[0]) { S.y = S.by[0]; S.vy = Math.abs(S.vy) * .4; } if (S.y > S.by[1]) { S.y = S.by[1]; S.vy = -Math.abs(S.vy) * .4; }
      /* toys: the mouse runs away when Jimon comes close, the others roll or hop */
      S.toys.forEach(t => {
        const dx = t.x - S.x, dy = t.y - S.y, d = Math.hypot(dx, dy) || 1;
        t.wt -= dt; if (t.wt <= 0) { t.wt = .6 + Math.random(); const a = Math.random() * 6.28, v = W * (t.k === 't_tikus' ? .25 : .12); t.vx = Math.cos(a) * v; t.vy = Math.sin(a) * v; }
        if (t.k === 't_tikus' && d < W * .34) { const v = W * .62; t.vx += (dx / d * v - t.vx) * Math.min(1, dt * 5); t.vy += (dy / d * v - t.vy) * Math.min(1, dt * 5); }
        t.x += t.vx * dt; t.y += t.vy * dt;
        if (t.x < S.bx[0] || t.x > S.bx[1]) { t.vx *= -1; t.x = Math.max(S.bx[0], Math.min(S.bx[1], t.x)); }
        if (t.y < S.by[0] || t.y > S.by[1]) { t.vy *= -1; t.y = Math.max(S.by[0], Math.min(S.by[1], t.y)); }
        if (Math.hypot(t.vx, t.vy) > 4) t.a = Math.atan2(t.vy, t.vx);
        if (d < S.L * .38 + t.s * .3) { t.got = 1; const n = t.k === 't_tikus' ? 2 : 1; S.got++; S.score += n; sfx('pop'); jbuzz(15); popText(S, '+' + n, t.x, t.y - 20); }
      });
      const caught = S.toys.filter(t => t.got).map(t => t.k); S.toys = S.toys.filter(t => !t.got);
      caught.forEach(k => setTimeout(() => { if (JG && JG.s === S && S.phase === 'kejar') K.addToy(S, k === 't_tikus' ? 't_tikus' : jpick(['t_benang', 't_bulu'])); }, 700));
      /* bumping into things makes a mess (no penalty) */
      const sp = Math.hypot(S.vx, S.vy);
      S.mess.forEach(q => { const dx = q.x - S.x, dy = q.y - S.y, d = Math.hypot(dx, dy) || 1;
        if (d < S.L * .4 + q.s * .4 && sp > W * .2 && !q.hitT) { q.vx = S.vx * .9 + dx / d * W * .3; q.vy = S.vy * .9 + dy / d * W * .3; q.va = (Math.random() - .5) * 10; q.hitT = .4; sfx('thud'); } });
      if (S.t >= 40) { S.phase = 'rapi'; S.tx = null; S.vx = S.vy = 0; S.rapiEnd = 52; const any = S.mess.some(q => K.messy(S, q));
        if (any) g2v('v_game_berantakan'); else { S.score += 3; popText(S, 'Kamar masih rapi! +3', W / 2, H / 2, '#27AE60'); g2v('v_game_rapi'); S.over = 'rapi'; S.overWait = 1.8; } }
    } else if (!S.over) {
      if (S.mess.every(q => !K.messy(S, q) && !q.back)) { S.over = 'rapi'; S.overWait = 2; g2v('v_game_rapi'); }
      else if (S.t >= S.rapiEnd) S.over = 'waktu';
    }
    S.mess.forEach(q => {
      if (q.hitT) q.hitT = Math.max(0, q.hitT - dt);
      if (q.back > 0) { q.back -= dt; const k = 1 - Math.max(0, q.back) / .35; q.x = q.fx + (q.hx - q.fx) * k; q.y = q.fy + (q.hy - q.fy) * k; q.a = q.fa * (1 - k); if (q.back <= 0) { q.back = 0; q.x = q.hx; q.y = q.hy; q.a = 0; q.vx = q.vy = q.va = 0; } return; }
      q.x += q.vx * dt; q.y += q.vy * dt; q.a += q.va * dt; const f = Math.pow(.12, dt); q.vx *= f; q.vy *= f; q.va *= f;
      if (q.x < S.bx[0] || q.x > S.bx[1]) { q.vx *= -.5; q.x = Math.max(S.bx[0], Math.min(S.bx[1], q.x)); }
      if (q.y < S.by[0] || q.y > S.by[1]) { q.vy *= -.5; q.y = Math.max(S.by[0], Math.min(S.by[1], q.y)); }
    });
  },
  draw(S, c) {
    const { W, H, I } = S, K = G2.kejar; cover(c, I.bg_kamar_atas, W, H);
    S.mess.forEach(q => { const im = I[q.k];
      if (S.phase === 'rapi' && K.messy(S, q) && !q.back) { c.strokeStyle = 'rgba(242,201,76,.95)'; c.lineWidth = 4; c.beginPath(); c.arc(q.x, q.y, q.s * (.62 + Math.sin(S.t * 6) * .06), 0, 6.3); c.stroke(); }
      dImg(c, im, q.x, q.y, q.s, hOf(im, q.s), { rot:q.a }); });
    S.toys.forEach(t => dImg(c, I[t.k], t.x, t.y, t.s, hOf(I[t.k], t.s), { rot:t.a }));
    if (S.phase === 'rapi') { const w = S.L * .7; dImg(c, I.t_duduk, S.x, S.y, w, hOf(I.t_duduk, w), { rot:S.ang }); }
    else { const im = S.lat > W * .22 ? I.t_luncur : I.t_lari, w = S.L; dImg(c, im, S.x, S.y, w, hOf(im, w), { rot:S.ang }); }
    if (S.tx !== null && S.phase === 'kejar') { c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.arc(S.tx, S.ty, 14, 0, 6.3); c.fill(); }
    pill(c, '🐭 ' + S.got, 10, 10);
    if (S.phase === 'rapi' && !S.over) pill(c, 'Ketuk barang yang berantakan!', W / 2, H - 46, 'center');
    if (S.t < 3) { c.globalAlpha = 1 - S.t / 3; pill(c, 'Tahan dan geser jari, Jimon mengikuti', W / 2, H * .45, 'center'); c.globalAlpha = 1; }
  },
  end(S) {
    const tidy = S.over === 'rapi';
    return [S.got + ' mainan tertangkap!', tidy ? 'Kamarnya rapi lagi. Terima kasih sudah merapikan!' : 'Masih ada yang berantakan. Besok kita rapikan bersama, ya.', tidy ? 'v_puji_rawat' : 'v_rasa_besok', jimg('jimon/pose/p_main_bola.webp')];
  }
};

/* ======== 5. Masak Sup Jimon (usap, dari Crispy Slicer) ======== */
G2.masak = {
  imgs:['bg_dapur', 'c_koki', 'c_sup', 'c_eh', 'panci', 'ikan', 'ikan_b', 'wortel', 'wortel_b', 'tomat', 'tomat_b', 'kentang', 'kentang_b', 'jagung', 'jagung_b', 'brokoli', 'brokoli_b', 'x_kaus', 'x_sandal'],
  voice:'v_game_masak', dur:() => 30,
  food:['ikan', 'wortel', 'tomat', 'kentang', 'jagung', 'brokoli'],
  col:{ ikan:'#F4B6C2', wortel:'#F2994A', tomat:'#EB5757', kentang:'#F2D16B', jagung:'#F2C94C', brokoli:'#6FCF52' },
  halves(S, k) {   // the cut picture holds two halves side by side: split it once
    const M = G2.masak; M.hv = M.hv || {}; if (M.hv[k]) return M.hv[k]; const im = S.I[k + '_b']; if (!im) return null;
    const w = Math.floor(im.width / 2), mk = sx => { const c = document.createElement('canvas'); c.width = w; c.height = im.height; c.getContext('2d').drawImage(im, sx, 0, w, im.height, 0, 0, w, im.height); return c; };
    return (M.hv[k] = [mk(0), mk(w)]);
  },
  init(S) {
    const { W, H } = S; Object.assign(S, { items:[], bits:[], trail:[], spawn:.4, combo:0, eh:0, warned:0, inPot:0, sliced:0 });
    S.potW = W * .44; S.potH = hOf(S.I.panci, S.potW); S.potX = W / 2; S.potY = H - S.potH * .66;   // mouth of the pot
  },
  down(S, x, y) { S.trail = [{ x, y, t:S.t }]; },
  move(S, x, y) {
    const p = S.trail[S.trail.length - 1]; S.trail.push({ x, y, t:S.t }); if (S.trail.length > 14) S.trail.shift();
    if (!p || Math.hypot(x - p.x, y - p.y) < 4) return;
    const M = G2.masak;
    S.items.forEach(it => {
      if (it.cut) return; const r = it.s * .45, d = segDist(it.x, it.y, p.x, p.y, x, y); if (d > r) return;
      it.cut = 1;
      if (it.bad) { S.combo = 0; S.eh = .9; sfx('bad'); jbuzz(30); it.vx = (x - p.x) * 8; it.vy = -S.H * .4; it.va = 14; it.cut = 2;
        if (!S.warned) { S.warned = 1; g2v('v_game_bukan'); } else jvoice('v_pendek_eh'); popText(S, 'Eh?', it.x, it.y - 20, '#6B7A99'); return; }
      S.combo++; S.sliced++; const n = S.combo >= 3 ? 2 : 1; S.score += n; sfx('slice'); jbuzz(8); popText(S, '+' + n + (S.combo >= 3 ? ' kombo!' : ''), it.x, it.y - 24);
      const hv = M.halves(S, it.k); if (!hv) return;
      [-1, 1].forEach((sgn, k) => S.bits.push({ im:hv[k], k:it.k, x:it.x + sgn * it.s * .2, y:it.y, vx:sgn * S.W * .25 + it.vx * .3, vy:Math.min(it.vy, -S.H * .25), a:it.a, va:sgn * 4, s:it.s * .62 }));
    });
  },
  up(S) {},
  step(S, dt) {
    const { W, H } = S, M = G2.masak;
    if (S.eh > 0) S.eh -= dt;
    S.spawn -= dt;
    if (S.spawn <= 0 && S.t < 28.5) {
      const many = S.t > 10 && Math.random() < .35 ? 2 : 1;
      for (let i = 0; i < many; i++) {
        const bad = Math.random() < .15 && S.t > 3, k = bad ? jpick(['x_kaus', 'x_sandal']) : jpick(M.food), x = W * (.14 + Math.random() * .72), s = W * (bad ? .17 : .2);
        S.items.push({ k, bad, x, y:H + s, s, vx:(W / 2 - x) * (.35 + Math.random() * .3), vy:-H * (1.2 + Math.random() * .25), a:Math.random() * 6, va:(Math.random() - .5) * 5 });
      }
      S.spawn = Math.max(.55, 1.15 - S.t * .02) * (.8 + Math.random() * .5);
    }
    const g = H * 1.55;
    S.items.forEach(it => { it.vy += g * dt; it.x += it.vx * dt; it.y += it.vy * dt; it.a += it.va * dt; });
    S.items = S.items.filter(it => it.cut !== 1 && it.y < H + it.s * 1.2);
    /* cut pieces steer gently into the pot: nothing is wasted */
    S.bits.forEach(b => {
      b.vy += g * .9 * dt; b.vx += ((S.potX - b.x) * 3.2 - b.vx) * Math.min(1, dt * 2.2); b.x += b.vx * dt; b.y += b.vy * dt; b.a += b.va * dt;
      if (b.vy > 0 && b.y > S.potY && Math.abs(b.x - S.potX) < S.potW * .42) { b.in = 1; S.inPot++; sfx('plop');
        for (let i = 0; i < 6; i++) S.pops.push({ txt:'•', x:b.x + (Math.random() - .5) * 30, y:S.potY, t:Math.random() * .3, col:M.col[b.k] }); }
    });
    S.bits = S.bits.filter(b => !b.in && b.y < H + 80);
    if (S.trail.length && S.t - S.trail[S.trail.length - 1].t > .12) S.trail.shift();
    if (S.t >= 30 && !S.over) { S.over = 'waktu'; S.overWait = 1.2; }
  },
  draw(S, c) {
    const { W, H, I } = S; cover(c, I.bg_dapur, W, H);
    const kh = H * .24, kim = S.over ? I.c_sup : S.eh > 0 ? I.c_eh : I.c_koki; dImg(c, kim, W * .02, H - 2, wOf(kim, kh), kh, { ax:0, ay:1 });
    S.items.forEach(it => dImg(c, I[it.k], it.x, it.y, it.s, hOf(I[it.k], it.s), { rot:it.a }));
    S.bits.forEach(b => dImg(c, b.im, b.x, b.y, b.s, b.s * b.im.height / b.im.width, { rot:b.a }));
    dImg(c, I.panci, S.potX, H - 2, S.potW, S.potH, { ay:1 });
    if (S.trail.length > 1) { c.lineCap = c.lineJoin = 'round'; c.beginPath(); c.moveTo(S.trail[0].x, S.trail[0].y); S.trail.forEach(p => c.lineTo(p.x, p.y));
      c.strokeStyle = 'rgba(242,201,76,.45)'; c.lineWidth = 14; c.stroke(); c.strokeStyle = '#fff'; c.lineWidth = 5; c.stroke(); }
    pill(c, '🍲 ' + S.inPot + ' potong', 10, 10); if (S.combo >= 3) pill(c, 'Kombo ' + S.combo, W - 10, 10, 'right');
  },
  end(S) { return ['Supnya jadi! ' + S.inPot + ' potong bahan masuk panci.', 'Sebelum makan: Jangan lupa bismillah dan pakai tangan kanan ya!', 'v_game_sup', jimg('main2/c_sup.webp')]; }
};
function segDist(px, py, ax, ay, bx, by) {
  const l2 = (bx - ax) ** 2 + (by - ay) ** 2; if (!l2) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * (bx - ax) + (py - ay) * (by - ay)) / l2)); return Math.hypot(px - ax - t * (bx - ax), py - ay - t * (by - ay));
}
