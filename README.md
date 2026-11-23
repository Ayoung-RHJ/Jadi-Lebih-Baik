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
- `js/jlb_gerak.js`: kids' Gerak tab (Gerak bersama Jimon) and Jimon as the kids' coach inside the session player (loaded with the page)
- `js/jlb_core.js`: JLB shared code: day records, prayer times, XP and levels, Peti Jumat, Jimon picture and dust, new tabs and routes, sync merge
- `js/jlb_adult.js`: Taman, Amal, habit detail, Saya, Perjalanan, program 40 hari, Mujahadah (loaded on demand)
- `js/jlb_kids.js`: kids' Beranda, Misi, Kamar Jimon, Peti Jumat, Ruang Orang Tua (loaded on demand)
- `js/jlb_jimon.js`: Jimon Pintar chat, offline, answers only from checked content (loaded on demand)
- `js/jlb_learn.js`: Belajar Musim Baru (5 pulau, steps, unit and island exams), Kisah Pilihan, Roda Ilmu (loaded on demand)
- `js/jlb_soal.js`: the 250 new approved questions (QB2), 5 questions per step (STEPQ), spare questions (CADQ) and the 10 old Kisah Pilihan stories (no longer shown since jlb12; their XP is kept), generated from the approved Lembar Periksa (loaded on demand)
- `js/jlb_kisahdata.js`: the 10 Kisah Akhlak stories (8 pages, choices, Pesan, 10 questions, renungan), copied from the approved Naskah Kisah Akhlak (Lembar Periksa bagian 13)
- `js/jlb_kisah.js`: Kisah Akhlak screens (#belajar/ka): shelf and Buku Kisahku, pages with Bacakan, choices, Pesan, 8 question types, result and renungan (loaded on demand)
- `js/jlb_buddy.js`: Jimon Teman Setia (jlb13, kid mode only): floating Jimon, greetings with the child's name, mission companion, eye rest, Perasaanku, night routine, gifts, room decorating, question of the day (loaded on demand by the hook at the end of `jlb_core.js`)
- `js/jlb_main2.js`: Main bersama Musim 2 (jlb14): five canvas games (Pulang, Hujan Bintang, Menara Kardus, Kejar Tikus, Masak Sup) adapted from the WIRTIX game engines; pictures in `img/jlb/main2/` (loaded with #main)
- `js/jlb_teman.js`: Jimon lebih hidup: moods, new room, feeding, Main bersama (#main, 5 games), Surat Jumat and weekly stickers (#surat) (loaded on demand)
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
- **Version number.** Every script and stylesheet link ends in `?v=jlb8`, and `sw.js` has `VER = 'jlb8'`.
  When you change any js or css file, change it to the next number (`jlb8`) everywhere (index.html, sw.js `VER` and `PRE`, and `JLB_VER` in `js/jlb_core.js`).
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
- **Amal order and slots.** Every amal in `HABITS` (`js/jlb_adult.js`) has a time slot `t` (malam, subuh, pagi, siang, sore, maghrib, isya). Lists follow the day; Taman starts at the current slot.
- **New icons.** An amal can name an icon that is not uploaded yet (`ic`) with a fallback (`fb`). Upload the new picture to `img/jlb/ikon/` and it appears without a code change.
- **Puasa sunnah** comes from `dayInfo()` in `js/calendar.js` (Senin, Kamis, Ayyamul Bidh, Arafah, Tasu'a, Asyura, 6 Syawal). A tick is saved as amal `puasa` and also in the Jurnal Sehat Kita fasting log. Kids get it only as the "Belajar puasa" mission, switched on by a parent.

## jlb7 (Musim Baru)
- **Belajar Musim Baru.** 5 pulau of 2 units. A step has 5 questions (wrong answers come back at the end), +5 XP; replaying a finished step gives +5 XP once a day.
  Unit exam: 20 questions from the unit (steps + spares), Mumtaz (90%+) +10 XP, perfect +5. Island exam: 30 questions from both units, Mumtaz +30, perfect +10.
  Each exam can be tried once a day. The next island opens after the island exam is Mumtaz, at the earliest 7 days after the previous island opened.
  Parents can open or lock an island in Ruang Orang Tua (`isl` in `jlb:ortu`). Progress is `jlb:learn2` (per-entry merge); the old `jlb:learn` XP is kept.
- **Kisah Pilihan.** 10 approved akhlak stories (`KISAHP` in `js/jlb_soal.js`), +5 XP the first time each, stored as `k:<id>` in `jlb:learn2`.
- **Jimon's voice.** 58 recorded lines (Google AI Studio TTS, cut and levelled) plus meow, purr, giggle and yawn in `img/jlb/jimon/suara/`.
  `jvoice(id)` in `js/jlb_core.js` plays one clip at a time; the speaker button turns it off on this device (`corner3:jsound`). The clip names match the scripts in the JLB Musim Baru doc.
- **Jimon Pintar** (`js/jlb_jimon.js`) is a pair table: slang clean-up, safety rules first, then answers taught by parents (Ajari Jimon, `ajar` in `jlb:ortu`), follow-ups, and the closest pair. Islamic lines only from the Lembar Periksa.
- **Gerak bersama Jimon.** Kids' Gerak tab with 3 adventures (10, 15, 20 min) built by `playSession` (bodyweight only). In the player, kids get Jimon's poses (`img/jlb/jimon/pelatih/`) and recorded lines instead of the device voice.
- **Accessories** now go one per slot (kepala, mata, leher, badan, punggung, tangan); `wear` in `jlb:jimon` is `{ slot: item }` (an old single item still works). Positions and per-face shifts are `JACC`, `JFACE_DY`, `JEYE_DY` in `js/jlb_core.js`.
- **Picture cache.** `sw.js` caches pictures and sounds forever under `IMG`. jlb7 changed pictures that kept their names (Jimon's accessories), so `IMG` is now `jlb-img-v2`. Do the same whenever a picture or sound is replaced under the same name.

## jlb8 (Misi anak)

- **27 missions** in `MISSIONS` (`js/jlb_kids.js`), each with a group `p` (ibadah, ilmu, akhlak, jasad), a time `t` (subuh, pagi, siang, sore, maghrib, isya) and an optional note `h` for parents. Old mission ids are unchanged, so past ticks and XP stay.
- **Defaults.** `KDEF_MIS` holds the 9 missions that were on before jlb8. New missions start off until a parent switches them on in Ruang Orang Tua.
- **Misi screen** groups missions by time of day, starting with the current part of the day; earlier parts show at the bottom as "Tadi".
- **Auto missions.** `gerak` and `belajar` have `auto`: the child can't tick them by hand. `kidAutoMis()` in `jlb_core.js` ticks them when a kid Gerak session completes or a Belajar step or exam finishes, but only if the parent switched them on.
- **Misi keluarga.** Parents add up to 10 of their own missions (`ortu().own`, ids `own…`), shown with the star-jar icon. They sync with `jlb:ortu`.
- **Roda Ilmu** now opens after half of today's missions are done, at most 5 (it used to need all of them).
- **Ustadz.** The Ibadah mission names and notes are in Lembar Periksa section 12.

## jlb9 (Misi ibadah disetujui)

- The ustadz approved all 7 Ibadah missions in Lembar Periksa section 12 (17 Nov 2026). Parent notes for `dzikir_pagi` (Radhitu billahi rabba…, then Al-Ikhlas, Al-Falaq, An-Nas 3×) and `sedekah` (smile is sadaqah, HR. Tirmidzi) follow the ustadz's answers.
- `IMG` is `jlb-img-v3` (Jimon's JUARA! headband and new scarf replaced pictures under the same names).

## jlb10 (Batas pesan Jimon)

- Parents set Jimon Pintar's daily message limit in Ruang Orang Tua > Jimon: 5, 10, 15, 20 or 30 (default 10). Stored as `limit` in `jlb:ortu`, so it syncs like the other parent settings.

## jlb11 (Cek awal anak bersama Jimon)

- Under 13, the check-up switches to the kids' look after "Tentang kamu": Jimon leads every step (`wzKid()` in `js/ui.js`, styles `.wzk-*` in `css/jlb.css`), paw-print progress, recorded clips only.
- Steps: Untuk Ayah atau Ibu (3 health questions + sore body part), Kamu suka bergerak?, Kapan kita main? (preset Sen/Rab/Jum, 15 or 20 min), Kenalan dengan Jimon (writing hand sets the stance), Siap berpetualang.
- New kid profiles get push calm, combo calls by name, backup voice Rani and boxing experience none (`kidDef`); parents change them in Settings. Teens and adults are unchanged.

## jlb12 (Kisah Akhlak + Jimon lebih hidup)
- **Kisah Akhlak** replaces Kisah Pilihan in Belajar (`#belajar/ka`, old `#belajar/kp` links open it). Progress in `jlb:learn2` as `ka:<n>`
  (done, mum, best, xp). XP: first finish +10, first Mumtaz (9–10 correct) +5 and the cover in Buku Kisahku. Old Kisah Pilihan XP stays.
  Renungan answers: `jlb:ren` (shown in Ruang Orang Tua). Page position: `jlb:kaprog`. Pictures: `img/jlb/kisah/k<n>_<0..8>.webp` (0 = cover).
- **Pesan dari kisah ini** uses `ka_hujurat` (49:11), `ka_amanah` (4:58), `ka_ortu` (17:23), `ka_jujur` (9:119) in `js/jlb_ayat.json`
  (Arabic and Kemenag translation from quran-json 3.1.2, same source as the rest). The phone voice never reads Arabic; ayat play Alafasy.
- **Jimon** (`jlb:jimon`): `full`/`hap` with `mat` (moods drop slowly, never below 5%), `fed` and `fishFrom` (1 fish per mission, 3 to start),
  `play` (Main bersama, 3 times a day, no XP), `kisah`, `stk` (weekly sticker per week). levels unlock games (jlb14 order in the jlb14 section).
- **Surat Jumat** (`#surat`): built from last week's records (Saturday to Friday); shown on Beranda on Friday, and on Saturday and Sunday while the sticker is unclaimed.
  Share makes a PNG and opens the phone's share menu (WhatsApp).
- **Tadabbur Alam**: only a "Segera hadir" card on the adult Taman until the material is checked (now planned for jlb15).

## jlb13 (Jimon Teman Setia)
- **Rig**: every default-face Jimon (`jimonHTML` with face `senang`) uses `img/jlb/jimon/rig/r_*.webp` (720×780, same canvas as `e_senang`, so accessories line up).
  `jlb_core.js` swaps frames: random blink, tail left/right, ear twitch; mouth `r_m1`/`r_m2` while a clip plays or the phone says the name (`JTALK`).
- **Voice**: `jvoice` keeps each clip loaded (`JACACHE`), `jpreload(ids)`, `jbuzz(ms)` = short vibration (Android only).
- **Floating Jimon** on Misi, Belajar, Peti, Perjalanan and Rekap (Beranda and Kamar use their big Jimon). Tap = line, swipe = pet, long press = purr,
  × = hides him (peeks from the bottom; tap to call back). Walks in once per visit; yawns when idle.
- **Name**: first greeting of the day, first mission or kisah done today, and back after 2+ days: Jimon's clip, then the name in the phone voice (`speechSynthesis`, id-ID).
  Parents can turn it off (Ruang Orang Tua → Jimon, `ortu.nama`). The bubble always writes the name.
- **[ustadz] clips** `v_sapa_pagi`, `v_puji_masya`, `v_malam_doa` wait for Lembar Periksa bagian 15 (`JB_TUNGGU` in `jlb_buddy.js`; neutral clips are used meanwhile). Empty the set after approval.
- **Mission companion**: tapping Sikat gigi (2 min), Rapikan (1 min) or Minum (6 glasses) opens Jimon's timer; the mission ticks itself at the end. "Aku sudah selesai" still ticks at once.
- **Eye rest**: after 20 minutes of kid-mode screen time (a 5-minute break resets it): stretch + look far for 20 seconds. Count in `_jb:<id>` (this phone only).
- **Perasaanku hari ini** (Beranda): `jlb:rasa` {date:{m, at}} (synced, merged per day); Ruang Orang Tua shows the last 14 days.
- **Night**: after Isya the room dims; "Ajak Jimon tidur" = piyama → doa text (approved: Bismika Allahumma amutu wa ahya., not spoken) → sleep (`jimon.tidur`, `jimon.piyama`).
  The first greeting next morning wakes him (`v_malam_pagi`, `v_malam_bangun` before 6).
- **Gifts**: toys for Jimon open at 10/25/45/70 missions (`jimon.gift.toys`); Jimon gives one furniture piece per week with 7+ missions (`jimon.gift.furn`).
  Everything owned appears in the room; "Tata kamar" drags them (`jimon.room` {item:{x, y, on}} in % of the room).
- **Question of the day** in Ngobrol (makanan, warna, cita-cita, hewan, teman, pelajaran; at night "apa yang membuatmu senang" is not kept). Answers in `_ingat:<id>`, this phone only, used in Jimon's lines.

## jlb14 (Main bersama Musim 2)
- Five new games in Main bersama, code in `js/jlb_main2.js` (one shared canvas runner `g2Run`, one object per game in `G2`).
  Engines adapted from the WIRTIX games: Hisana Run → **Jimon Pulang Sebelum Maghrib**, Catch the Crunch → **Hujan Bintang**,
  Tower Stacker → **Menara Kardus**, Speed Fest Drift → **Kejar Tikus** (one-finger steering, then a tidy-up round), Crispy Slicer → **Masak Sup** (pieces go into the pot).
- Unlocks (`JGAMES` in `jlb_teman.js`): bola, tiru, cari from Level 1; suara 2; adab 3; pulang 4; hujan 5; menara 6; kejar 7; masak 8. All share the 3 plays a day, no XP.
- No minus points, no "dying", no music: short tones made in code (`sfx`) and Jimon's clips `v_game_*`. Game time stops while the app is in the background.
- Personal best per game in `jlb:jimon.rek` (synced); a new best plays `v_puji_rekor`.
- `v_game_rumah` ("Alhamdulillah, sampai rumah!") waits for Lembar Periksa bagian 15 (`G2TUNGGU`); `v_pendek_horee` is used meanwhile.
- Masak Sup ends with the approved line o5 as text: "Jangan lupa bismillah dan pakai tangan kanan ya!".
