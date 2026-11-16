# JLB · Jadi Lebih Baik

Fastabiqul Khairat. Built on FitRHJ / Jurnal Sehat Kita (the training part keeps that name).

Plain static site, no build step. Deploy this whole folder to Netlify (drag and drop the folder or the zip).
Keep it on the same Netlify site address so everyone's saved data (browser storage, keys `corner3:*`) stays.

## Files
- `index.html`: page shell; loads the CSS and the scripts below, in this order
- `css/app.css`: all styles
- `js/core.js`: storage, language, icons, theme, sound and coach voice
- `js/sync.js`: family-code sync with Supabase, profile PINs, backup export and import
- `js/figures.js`: drawn figure, animation, character poses (`FIG_FILES`, `IMGMAP`)
- `js/data.js`: muscles, exercises, avatars, art, coach lines
- `js/engine.js`: plan, schedule, 48-hour recovery, age rules, quick and custom sessions
- `js/journal.js`: activity journal, puasa check-in, stats, badges, family total, daily reminders
- `js/dalil_data.js`: the 37 ayat and hadith (review list: dalil-review.md)
- `js/calendar.js`: Plan > Calendar, Indonesian holidays, Hijri dates, puasa Sunnah, training on fasting days
- `js/ui.js`: header, tabs, profile picker, check-up, Home, Plan, Workouts, Progress, Me, settings
- `js/player.js`: session player
- `js/workouts.js`: quick workout, My workouts and the builder
- `js/boot.js`: welcome popup, start-up, service worker registration
- `js/jlb_core.js`: JLB shared code: day records, prayer times, XP and levels, Peti Jumat, Jimon picture and dust, new tabs and routes, sync merge
- `js/jlb_adult.js`: Taman, Amal, habit detail, Saya, Perjalanan, program 40 hari, Mujahadah (loaded on demand)
- `js/jlb_kids.js`: kids' Beranda, Misi, Kamar Jimon, Peti Jumat, Ruang Orang Tua (loaded on demand)
- `js/jlb_jimon.js`: Jimon Pintar chat, offline, answers only from checked content (loaded on demand)
- `js/jlb_learn.js`: Peta Belajar, lessons, kisah, Roda Ilmu (loaded on demand)
- `js/jlb_rekap.js`: Rekap, Hijriah and Ramadan, Keluarga (loaded on demand)
- `js/jlb_ayat.json`: Arabic and Kemenag translation for the ayat and hadith in JLB (from quran-json / quranenc and hadith-api). Never type Arabic by hand.
- `css/jlb.css`: JLB styles
- `manifest.webmanifest`, `sw.js`, `_headers`: install-to-home-screen, offline use, Netlify caching
- `img/jlb/`: all JLB pictures (brand, langit, taman, ikon, anak, belajar, keluarga, jimon)
- `img/brand`, `img/avatars`, `img/slides`, `img/fig`: images

## Adding a character pose
1. Put `img/fig/<name>.webp` (and optionally `<name>_glow.webp`) in the folder.
2. Add `<name>` to `FIG_FILES` in `js/figures.js`.
3. Point a move at it in `IMGMAP` in the same file.

## Calendar upkeep (once a year)
1. Each September the government signs the SKB 3 Menteri for next year. Add its dates to `HOLI` in `js/calendar.js`
   (`n` = libur nasional, `c` = cuti bersama) and add the year to `HOLI_YEARS`.
2. After each sidang isbat (Ramadan, Syawal, Zulhijah), add the announced first day to `KEMENAG`
   as `['YYYY-MM-DD', hijriYear, hijriMonth]`. Months not listed are estimated and marked as such.
3. Calendar settings (Kemenag or Umm al-Qura) are stored in `corner3:hijri`. Training on fasting days is per profile (`fast`: `plan` or `light`).

## Pictures
All punch, defence, exercise and warm-up pictures are in. The rear hook photos were mirrored to face right like the rest.

## Family sync (Supabase)
- Project URL and publishable key are at the top of `js/sync.js`. The publishable key is meant to be public.
- The database side is `fitrhj_supabase.sql` (run once in Supabase > SQL Editor). The app only calls
  `fit_pull` and `fit_push`; the `fit_kv` table itself is closed to the public key.
- Synced: the people list, every `p:<id>:*` key, and calendar settings. Kept on each device only:
  current person, language, theme, animations, plan view, welcome flag and the family code.
- Newest change wins. The people list, workout log and weight log are merged, so training logged
  on two phones keeps both. Deleted people stay deleted (`pdel`).

## Jurnal Sehat Kita (rebrand)
- Name in the header, title, welcome and link preview (`img/brand/og.png`, 1200×630). Logo unchanged.
- Indonesian is the default; every device switches once (`corner3:_id1`), the EN toggle still works.
- Activities are saved in the person's log with `kind:'act'`, so streak, minutes, energy and the calendar count them.
- Fasting answers: `corner3:p:<id>:puasa` = { date: { s:'y'|'half'|'n'|'h', k, at } }. Merged per date when syncing.
- To change a reminder, edit `js/dalil_data.js`, or send the change and it will be regenerated from the sources.

## JLB release notes
- **Version number.** Every script and stylesheet link ends in `?v=jlb4`, and `sw.js` has `VER = 'jlb4'`.
  When you change any js or css file, change it to the next number (`jlb5`) everywhere (index.html, sw.js `VER` and `PRE`, and `JLB_VER` in `js/jlb_core.js`).
  Otherwise phones keep the old file for up to a week.
- **New keys** (all per person, `corner3:p:<id>:jlb:*`): `day` (amaliyah, habits, missions, berhalangan, per date),
  `habits`, `set` (rawatib, city), `learn`, `roda`, `peti`, `jalan`, `40`, `jimon`, `ortu`, `chat`, `chatn`, `mjh`. `day`, `learn`, `peti`, `roda` and `jalan` merge per entry when syncing.
- **Private:** `mjh` (Mujahadah) is encrypted on the phone with its own 6-digit PIN before it is saved or synced, and never appears in Keluarga, Rekap or stats.
  Berhalangan days are never shown to the family.
- **Address:** still fitrhj.netlify.app. Moving to a new address later needs the backup export/import or a redirect, because browser storage belongs to the address.
- **Ayat audio (tombol Dengarkan).** Plays verse-by-verse recordings of Syaikh Mishary Rashid Alafasy, streamed from
  everyayah.com (`QARI` in `js/jlb_core.js`). To host them yourself, run `unduh_audio.ps1` and upload `img/jlb/audio/`
  (`SSSAAA.mp3` + `qari.json`); the app then uses those. The device voice never reads the Quran.
- **Doa setelah wudhu** comes from Jami' at-Tirmidzi no. 55 (hadith-api dataset), key `_hadith.wudhu` in `js/jlb_ayat.json`.
- **Tampilan Anak/Dewasa.** Stored as `mode` in `jlb:set`. Profiles 13+ switch it themselves in Saya; under 13 only a parent can, in Ruang Orang Tua (PIN).
- **Peti Jumat approvals** also appear at the top of a parent's Taman when any child has a request waiting (that child's parents' PIN).
