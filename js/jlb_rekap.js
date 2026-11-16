/* =========================================================
   Rekap (week to year), Rekap Hijriah, Rekap Keluarga Jumat
   Mujahadah and berhalangan days never appear here.
   ========================================================= */
const PER = [['Pekan', 7, 7], ['Bulan', 30, 6], ['Kuartal', 91, 13], ['6 Bulan', 182, 6], ['Tahun', 365, 12]];
let RP = 0;
const PHAB = { ibadah:['tilawah', 'dzikir', 'dhuha', 'tahajud', 'sedekah'], jasad:['latihan', 'jalan', 'minum', 'tidur'], ilmu:['baca', 'belajar', 'kajian'], akhlak:['telepon', 'bantu', 'baik', 'rapikan'] };
function pillarXP(days, from, to) {
  const o = { ibadah:0, jasad:0, ilmu:0, akhlak:0 };
  Object.keys(days).forEach(k => { if (k < from || k > to) return; const d = days[k];
    PR.forEach(p => { const s = (d.s || {})[p]; if (s && s.f) o.ibadah += 10; if (s && s.q) o.ibadah += 2; if (s && s.b) o.ibadah += 2; });
    Object.keys(d.a || {}).forEach(h => { const p = Object.keys(PHAB).find(x => PHAB[x].includes(h)); if (p) o[p] += 5; });
    Object.keys(d.m || {}).forEach(() => { o.akhlak += 5; }); });
  return o;
}
function stats(id, from, to) {
  const days = pget(id, 'jlb:day', {}); let act = 0, fard = 0, n = 0;
  for (let d = kOf(from); dkey(d) <= to; d = jAdd(d, 1)) { const r = days[dkey(d)]; n++; if (!r) continue; if (r.h) { n--; continue; }
    const f = PR.filter(p => r.s && r.s[p] && r.s[p].f).length; fard += f; if (f || Object.keys(r.a || {}).length || Object.keys(r.m || {}).length) act++; }
  return { act, n:Math.max(1, n), fpct:Math.round(fard / (Math.max(1, n) * 5) * 100), xp:xpRange(id, from, to) };
}
function lineChart(series, labels) {
  const W = 326, H = 150, max = Math.max(10, ...series.flatMap(s => s.v)), nx = labels.length;
  const X = i => Math.round(10 + i * (W - 20) / Math.max(1, nx - 1)), Y = v => Math.round(H - 8 - v / max * (H - 20));
  return `<svg viewBox="0 0 ${W} ${H + 16}" width="100%" role="img" aria-label="Grafik XP per pilar"><line x1="0" y1="${H - 8}" x2="${W}" y2="${H - 8}" stroke="var(--jline)"/>
    ${series.map((s, si) => `<polyline points="${s.v.map((v, i) => X(i) + ',' + Y(v)).join(' ')}" fill="none" stroke="${s.c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${['', '8 5', '2 5', '10 4 2 4'][si]}"/>`).join('')}
    ${labels.map((t, i) => (nx <= 13 || i % 2 === 0) ? `<text x="${X(i)}" y="${H + 12}" text-anchor="middle" font-size="9" fill="var(--jmut)">${t}</text>` : '').join('')}</svg>`;
}
function renderRekap() {
  const [nm, len, nb] = PER[RP], to = todayK(), from = dkey(jAdd(new Date(), -(len - 1))), pfrom = dkey(jAdd(new Date(), -(2 * len - 1))), pto = dkey(jAdd(new Date(), -len));
  const days = jget('day', {}), S = stats(CUR, from, to), Sp = stats(CUR, pfrom, pto), px = pillarXP(days, from, to), pp = pillarXP(days, pfrom, pto);
  const step = Math.ceil(len / nb), labels = [], series = Object.keys(PILLAR).map(k => ({ k, c:PILLAR[k].c, v:[] }));
  for (let b = 0; b < nb; b++) { const bf = dkey(jAdd(kOf(from), b * step)), bt = dkey(jAdd(kOf(from), Math.min(len - 1, b * step + step - 1))), x = pillarXP(days, bf, bt);
    series.forEach(s => s.v.push(x[s.k])); const d0 = kOf(bf); labels.push(len <= 7 ? dayShort(d0.getDay()) : len <= 30 ? d0.getDate() + '/' + (d0.getMonth() + 1) : MON[LANG][d0.getMonth()]); }
  const tot = Object.values(px).reduce((a, b) => a + b, 0) || 1;
  const diff = (a, b) => { const v = b ? Math.round((a - b) / b * 100) : (a ? 100 : 0); return `<b style="color:${v >= 0 ? 'var(--jg)' : '#8A5D00'}">${v >= 0 ? '+' : ''}${v}%</b>`; };
  let best = null; Object.keys(days).forEach(k => { if (k < from || k > to) return; const v = xpRange(CUR, k, k); if (!best || v > best[1]) best = [k, v]; });
  const habCnt = {}; Object.keys(days).forEach(k => { if (k < from || k > to) return; Object.keys(days[k].a || {}).forEach(h => { habCnt[h] = (habCnt[h] || 0) + 1; }); });
  const top = Object.entries(habCnt).sort((a, b) => b[1] - a[1])[0];
  const h1 = hijri(kOf(from)), h2 = hijri(kOf(to));
  $('#v-rekap').innerHTML = `<div class="jw"><div class="jrow sp" style="padding-top:8px"><h1>Rekap</h1></div>
    <div class="jsub" role="tablist">${PER.map((p, i) => `<a href="#rekap" role="tab" data-rp="${i}" ${i === RP ? 'aria-current="page" aria-selected="true"' : 'aria-selected="false"'}>${p[0]}</a>`).join('')}</div>
    <span class="jmut">${niceDate(kOf(from))} – ${niceDate(kOf(to))} · ${h1.d} ${HMON[LANG][h1.m - 1]} ${h1.y !== h2.y ? h1.y + ' ' : ''}– ${h2.d} ${HMON[LANG][h2.m - 1]} ${h2.y} H</span>
    <div class="jgrid2"><div class="jcard"><span class="jmut">XP</span><b style="font-size:1.6rem">${S.xp}</b>${diff(S.xp, Sp.xp)}</div><div class="jcard"><span class="jmut">Hari aktif</span><b style="font-size:1.6rem">${S.act} / ${S.n}</b><span class="jmut" style="font-size:.75rem">Hari berhalangan tidak dihitung</span></div>
      <div class="jcard"><span class="jmut">Sholat fardhu</span><b style="font-size:1.6rem">${S.fpct}%</b>${diff(S.fpct, Sp.fpct)}</div><div class="jcard"><span class="jmut">Level</span><b style="font-size:1.6rem">${levelOf(xpTotal()).l}</b><span class="jmut">${xpTotal()} XP total</span></div></div>
    <section class="jcard"><h2>Tamanmu ${nm.toLowerCase()} ini</h2><div style="border-radius:18px;overflow:hidden;background:linear-gradient(180deg,#CFE6FF,#EAF5D8 70%)"><div class="jplants" style="padding-top:8px">${Object.keys(PILLAR).map(k => { const n = px[k] / tot > .35 ? 4 : px[k] / tot > .2 ? 3 : px[k] > 0 ? 2 : 1;
      return `<div><img src="${jimg('taman/plant_' + PILLAR[k].plant + '_' + n + '.webp')}" alt="${PILLAR[k].n} tahap ${n}" loading="lazy" width="120" height="180"><span style="background:${PILLAR[k].c}">${PILLAR[k].n}</span></div>`; }).join('')}</div><div style="height:14px;background:#B98B54"></div></div></section>
    <section class="jcard"><h2>XP per pilar</h2>${lineChart(series, labels)}<div class="jrow" style="flex-wrap:wrap;font-size:.8rem;font-weight:700">${Object.keys(PILLAR).map(k => `<span style="color:${PILLAR[k].c}">● ${PILLAR[k].n}</span>`).join('')}</div></section>
    <section class="jcard"><h2>Dibanding periode sebelumnya</h2>${Object.keys(PILLAR).map(k => `<div class="jrow"><span style="width:64px;font-weight:800;color:${PILLAR[k].c}">${PILLAR[k].n}</span><div class="jbar" style="flex:1"><i style="width:${Math.min(100, px[k] / tot * 100)}%;background:${PILLAR[k].c}"></i></div><span style="width:56px;text-align:right">${diff(px[k], pp[k])}</span></div>`).join('')}
      <span class="jmut">Dibandingkan dengan dirimu sendiri, bukan dengan orang lain.</span></section>
    <section class="jcard"><h2>Kilas balik</h2>${best && best[1] ? `<p>Hari terbaik: <b>${niceDate(kOf(best[0]))}</b> (${best[1]} XP)</p>` : '<p class="jmut">Belum ada catatan di periode ini.</p>'}${top ? `<p>Paling rutin: <b>${esc((typeof HABITS !== 'undefined' && HABITS[top[0]] ? HABITS[top[0]].n : top[0]))}</b>, ${top[1]} hari</p>` : ''}</section>
    ${jbtn('Simpan sebagai gambar', 'data-rshot', 'navy block')}
    <a class="jcard" href="#hijriah" style="text-decoration:none;color:#fff;background:#2A1F5C;flex-direction:row;align-items:center"><img src="${jimg('anak/lantern_lit.webp')}" alt="" width="48" height="48"><span><b>Rekap Hijriah</b><br><span style="opacity:.8">Ramadan dan tahun Hijriah</span></span></a></div>`;
}
/* save the summary as a picture (drawn on a canvas, no outside service) */
function rekapImage() {
  const [nm, len] = PER[RP], to = todayK(), from = dkey(jAdd(new Date(), -(len - 1))), S = stats(CUR, from, to), c = document.createElement('canvas'); c.width = 1080; c.height = 1080;
  const g = c.getContext('2d'); g.fillStyle = '#0F1D3D'; g.fillRect(0, 0, 1080, 1080); g.fillStyle = '#F2B705'; g.font = '800 54px Saira, sans-serif'; g.fillText('JLB · Rekap ' + nm, 80, 150);
  g.fillStyle = '#fff'; g.font = '700 44px Saira, sans-serif'; g.fillText(PROF.name, 80, 230); g.font = '400 34px Saira, sans-serif'; g.fillText(niceDate(kOf(from)) + ' – ' + niceDate(kOf(to)), 80, 290);
  [['XP', S.xp], ['Hari aktif', S.act + ' / ' + S.n], ['Sholat fardhu', S.fpct + '%'], ['Level', levelOf(xpTotal()).l]].forEach(([k, v], i) => { const x = 80 + (i % 2) * 480, y = 420 + Math.floor(i / 2) * 260;
    g.fillStyle = '#17233B'; g.fillRect(x, y, 440, 220); g.fillStyle = '#C9D3EC'; g.font = '600 34px Saira, sans-serif'; g.fillText(k, x + 30, y + 70); g.fillStyle = '#fff'; g.font = '800 80px Saira, sans-serif'; g.fillText(String(v), x + 30, y + 170); });
  g.fillStyle = '#E9C77B'; g.font = '600 30px Saira, sans-serif'; g.fillText('Fastabiqul Khairat', 80, 1000);
  c.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'JLB-rekap-' + to + '.png'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); });
}

/* ---------------- Rekap Hijriah ---------------- */
let RH = 0;
function hijriDays(y, m) { const out = []; for (let i = -420; i <= 0; i++) { const d = jAdd(new Date(), i), h = hijri(d); if (h.y === y && (m == null || h.m === m)) out.push([dkey(d), h]); } return out; }
function renderHijriah() {
  const now = hijri(new Date()), ry = now.m > 9 || (now.m === 9 && now.d > 29) ? now.y : now.y - 1, ram = hijriDays(ry, 9), days = jget('day', {}), puasa = ps.get('puasa', {}) || {};
  const fasted = ram.filter(([k]) => puasa[k] && (puasa[k].s === 'y' || puasa[k].s === 'half')).length;
  const full = ram.filter(([k]) => { const r = days[k]; return r && PR.every(p => r.s && r.s[p] && r.s[p].f); }).length;
  const hab = h => ram.filter(([k]) => ((days[k] || {}).a || {})[h]).length;
  const last10 = ram.filter(([, h]) => h.d >= 21), lit = last10.filter(([k]) => { const r = days[k] || {}; return (r.a || {}).tahajud || (r.s && r.s.isya && r.s.isya.b); }).length;
  const C = ['#F3EEF9', '#E7DEFA', '#A992E8', '#6B3FC4', '#3D2391'];
  let nr = null; for (let i = 1; i < 400; i++) { const d = jAdd(new Date(), i), h = hijri(d); if (h.m === 9 && h.d === 1) { nr = [d, h, i]; break; } }
  const yr = hijriDays(now.y), mx = {}; yr.forEach(([k, h]) => { mx[h.m] = (mx[h.m] || 0) + xpRange(CUR, k, k); }); const mmax = Math.max(1, ...Object.values(mx));
  $('#v-hijriah').innerHTML = `<div class="jw"><section class="jhero" style="min-height:300px"><img class="bg" src="${jimg('langit/ramadan_header.webp')}" alt="Malam Ramadan: masjid, bulan sabit, lentera" style="object-position:60% 50%"><div class="shade"></div>
    <div class="jtop">${back('#rekap')}</div><span style="color:#F4D58A;font-weight:800;font-size:.8rem;letter-spacing:.08em">REKAP HIJRIAH</span><h1>${RH ? 'Tahun ' + now.y + ' H' : 'Ramadanku ' + ry + ' H'}</h1></section>
    <div class="jsub">${['Ramadan ' + ry + ' H', 'Tahun ' + now.y + ' H'].map((n, i) => `<a href="#hijriah" data-rh="${i}" ${i === RH ? 'aria-current="page"' : ''}>${n}</a>`).join('')}</div>
    ${RH === 0 ? (ram.length ? `<div class="jgrid2">${[['puasa', fasted + ' hari', 'Puasa'], ['sholat', full + ' hari', 'Sholat lengkap'], ['tilawah', hab('tilawah') + ' hari', 'Tilawah'], ['sedekah', hab('sedekah') + ' hari', 'Sedekah']].map(([ic, v, l]) => `<div class="jcard" style="flex-direction:row;align-items:center">${jicon(ic)}<span><b style="font-size:1.2rem">${v}</b><br><span class="jmut">${l}</span></span></div>`).join('')}</div>
      <span class="jmut">Hari berhalangan tidak ditampilkan dan tidak dihitung kurang.</span>
      <section class="jcard" style="background:#1B1640;color:#fff;padding:0;overflow:hidden"><img src="${jimg('langit/jalan_malam.webp')}" alt="" style="width:100%;height:180px;object-fit:cover" loading="lazy"><div style="padding:14px;display:flex;flex-direction:column;gap:10px"><div class="jrow sp"><b>10 malam terakhir</b><span style="color:#F4D58A;font-weight:800">${lit} dari ${last10.length || 10} malam</span></div>
        <div class="jrow" style="justify-content:space-between">${(last10.length ? last10 : Array.from({ length:10 }, (_, i) => [null, { d:21 + i }])).map(([k, h]) => { const r = (k && days[k]) || {}, on = (r.a || {}).tahajud || (r.s && r.s.isya && r.s.isya.b); return `<span style="text-align:center;font-size:.7rem"><img src="${jimg('anak/lantern_' + (on ? 'lit' : 'off') + '.webp')}" alt="Malam ${h.d}" width="28" height="36"><br>${h.d}</span>`; }).join('')}</div>
        <span style="opacity:.8;font-size:.8rem">Lentera menyala bila tahajud atau ba’diyah Isya tercatat malam itu.</span></div></section>
      <section class="jcard"><h2>30 hari Ramadan</h2><div class="jcal" style="grid-template-columns:repeat(10,minmax(0,1fr))">${ram.map(([k, h]) => { const v = xpRange(CUR, k, k), lv = v >= 70 ? 4 : v >= 50 ? 3 : v >= 25 ? 2 : v ? 1 : 0; return `<span style="background:${C[lv]};color:${lv >= 3 ? '#fff' : '#2A1F5C'};${h.d >= 21 ? 'outline:2px solid #E2A72E;outline-offset:-2px' : ''}" title="${h.d} Ramadan">${h.d}</span>`; }).join('')}</div><span class="jmut">Lebih gelap = lebih banyak amal · bingkai emas: 10 malam terakhir</span></section>`
      : '<p class="jmut">Belum ada catatan Ramadan.</p>')
    : `<section class="jcard"><h2>XP per bulan Hijriah</h2><div style="display:flex;align-items:flex-end;gap:4px;height:150px">${HMON[LANG].map((n, i) => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;gap:4px"><div style="width:100%;height:${Math.round((mx[i + 1] || 0) / mmax * 100)}%;min-height:2px;border-radius:6px 6px 3px 3px;background:${i === 8 ? '#E2A72E' : [0, 6, 10, 11].includes(i) ? '#6B3FC4' : '#A992E8'}"></div><span style="font-size:.6rem;font-weight:700">${n.slice(0, 3)}</span></div>`).join('')}</div><span class="jmut">Ramadan berwarna emas. Muharram, Rajab, Dzulqa’dah, Dzulhijjah: bulan haram.</span></section>`}
    ${nr ? `<section class="jcard" style="background:linear-gradient(135deg,#2A1F5C,#4B2C8F);color:#fff"><h2>Menuju Ramadan ${nr[1].y} H</h2><span style="opacity:.85">± ${nr[2]} hari lagi · perkiraan, menunggu sidang isbat</span>
      <label for="rhT" style="font-weight:700">Targetku</label><input id="rhT" class="inp" value="${esc(jget('ramadanTarget', ''))}" placeholder="Misalnya: khatam 1 kali, tarawih penuh"></section>` : ''}</div>`;
}

/* ---------------- Rekap Keluarga Jumat ---------------- */
function renderKeluarga() {
  const del = new Set(store.get('pdel', [])), fam = PROFILES.filter(p => !del.has(p.id)), to = todayK(), from = dkey(jAdd(new Date(), -6)), pf = dkey(jAdd(new Date(), -13)), pt = dkey(jAdd(new Date(), -7));
  const rows = fam.map(p => { const now = xpRange(p.id, from, to), was = xpRange(p.id, pf, pt), d = pget(p.id, 'jlb:day', {}); let f = 0;
    for (let i = 0; i < 7; i++) { const r = d[dkey(jAdd(new Date(), -i))]; if (r) f += PR.filter(x => r.s && r.s[x] && r.s[x].f).length; }
    return { p, now, up:now - was, f }; });
  const top = rows.slice().sort((a, b) => b.up - a.up)[0], max = Math.max(1, ...rows.map(r => r.now));
  $('#v-keluarga').innerHTML = `<div class="jw"><section class="jhero" style="min-height:280px"><img class="bg" src="${jimg('keluarga/keluarga.webp')}" alt="Keluarga" loading="lazy"><div class="shade"></div><div class="jtop">${back('#taman')}</div>
    <span style="color:#F4D58A;font-weight:800;font-size:.8rem">REKAP KELUARGA JUMAT</span><h1>Pekan ini bersama</h1><span>${niceDate(kOf(from))} – ${niceDate(kOf(to))}</span></section>
    <section class="jcard"><h2>Semangat semua</h2>${rows.map(r => `<div class="jrow"><span style="width:44px;height:44px;border-radius:50%;overflow:hidden;flex-shrink:0;${top && r === top && r.up > 0 ? 'box-shadow:0 0 0 3px #F2B705' : ''}">${avatarFor(r.p)}</span>
      <span style="flex:1"><b>${esc(r.p.name)}</b>${top && r === top && r.up > 0 ? ' <span class="jpill" style="background:#FFF4D6">Paling naik</span>' : ''}<div class="jbar"><i style="width:${r.now / max * 100}%"></i></div><span class="jmut">${r.f} sholat fardhu · ${r.now} XP</span></span>
      ${r.p.id !== CUR ? `<button class="jchip" data-fheart="${esc(r.p.name)}" aria-label="Kirim semangat ke ${esc(r.p.name)}">♥</button>` : ''}</div>`).join('')}
      <span class="jmut">Untuk saling menyemangati, bukan bersaing. Catatan pribadi seperti Mujahadah dan hari berhalangan tidak pernah ditampilkan.</span></section></div>`;
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-rp],[data-rh],[data-rshot],[data-fheart]'); if (!t) return;
  if (t.dataset.rp) { e.preventDefault(); RP = Number(t.dataset.rp); return renderRekap(); }
  if (t.dataset.rh) { e.preventDefault(); RH = Number(t.dataset.rh); return renderHijriah(); }
  if (t.dataset.rshot !== undefined) return rekapImage();
  if (t.dataset.fheart) jtoast('Semangat terkirim untuk ' + t.dataset.fheart + '!');
});
document.addEventListener('change', e => { if (e.target.id === 'rhT') { jset('ramadanTarget', e.target.value.trim()); jtoast('Target tersimpan'); } });
