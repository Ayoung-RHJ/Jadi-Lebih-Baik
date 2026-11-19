/* =========================================================
   Belajar Seru, Musim Baru: 5 islands, 10 units, steps of 5 questions, unit and island exams.
   Kisah Akhlak (#belajar/ka) lives in js/jlb_kisah.js; it replaced Kisah Pilihan in jlb12 (old Kisah Pilihan XP is kept).
   Lesson types: kisah, kuis, susun, doa, puzzle, garis, ujian. Plus Roda Ilmu.
   ========================================================= */
/* quiz bank: code: [question, right answer, wrong 1, wrong 2, reference, Roda category] */
const QB = {
  'U1-1':['Rukun Islam ada berapa?', '5', '3', '6', 'HR. Bukhari, Muslim', 'Sholat'], 'U1-2':['Rukun Islam yang pertama adalah…', 'Syahadat', 'Sholat', 'Puasa', 'HR. Bukhari, Muslim', 'Sholat'],
  'U1-3':['Puasa wajib dilakukan di bulan…', 'Ramadan', 'Syawal', 'Rajab', 'QS 2:185', 'Quran'], 'U1-4':['Zakat diberikan kepada…', 'Orang yang berhak, seperti fakir miskin', 'Siapa saja', 'Teman dekat', 'QS 9:60', 'Akhlak'],
  'U1-5':['Ibadah haji dilakukan di kota…', 'Makkah', 'Madinah', 'Thaif', 'QS 3:96–97', 'Sirah'],
  'U2-1':['Sebelum sholat kita harus…', 'Berwudhu', 'Makan', 'Tidur', 'QS 5:6', 'Sholat'], 'U2-2':['Dalam ayat wudhu, yang pertama dibasuh adalah…', 'Wajah', 'Kaki', 'Kepala', 'QS 5:6', 'Quran'],
  'U2-3':['Tangan dibasuh sampai…', 'Siku', 'Pergelangan', 'Bahu', 'QS 5:6', 'Sholat'], 'U2-4':['Kaki dibasuh sampai…', 'Mata kaki', 'Lutut', 'Jari kaki', 'QS 5:6', 'Sholat'],
  'U2-5':['Kalau tidak ada air, kita boleh…', 'Bertayamum dengan debu yang bersih', 'Tidak sholat', 'Menunggu besok', 'QS 5:6; 4:43', 'Quran'],
  'U3-1':['Sholat wajib sehari semalam ada berapa?', '5', '3', '7', 'HR. Bukhari, Muslim', 'Sholat'], 'U3-2':['Saat sholat kita menghadap ke…', 'Ka’bah (kiblat)', 'Matahari', 'Rumah', 'QS 2:144', 'Sholat'],
  'U3-3':['Sholat Subuh ada berapa rakaat?', '2', '3', '4', 'ijma’', 'Sholat'], 'U3-4':['Sholat Maghrib ada berapa rakaat?', '3', '2', '4', 'ijma’', 'Sholat'],
  'U3-5':['Sholat mencegah kita dari…', 'Perbuatan keji dan mungkar', 'Bermain', 'Belajar', 'QS 29:45', 'Quran'],
  'U4-1':['Nabi yang membuat kapal besar adalah…', 'Nabi Nuh', 'Nabi Musa', 'Nabi Yunus', 'QS 11:37', 'Nabi'], 'U4-2':['Nabi Ibrahim membangun Ka’bah bersama…', 'Nabi Ismail', 'Nabi Ishaq', 'Nabi Yusuf', 'QS 2:127', 'Nabi'],
  'U4-3':['Api yang membakar Nabi Ibrahim menjadi…', 'Dingin dan menyelamatkan', 'Lebih panas', 'Padam sendiri', 'QS 21:69', 'Nabi'], 'U4-4':['Laut terbelah ketika Nabi Musa memukulnya dengan…', 'Tongkat', 'Batu', 'Tangan', 'QS 26:63', 'Nabi'],
  'U4-5':['Nabi terakhir adalah…', 'Nabi Muhammad ﷺ', 'Nabi Isa', 'Nabi Musa', 'QS 33:40', 'Nabi'],
  'U5-1':['Kata pertama wahyu pertama adalah…', 'Bacalah (Iqra’)', 'Sholatlah', 'Berdoalah', 'QS 96:1', 'Sirah'], 'U5-2':['Nabi ﷺ lahir di kota…', 'Makkah', 'Madinah', 'Thaif', 'Sirah', 'Sirah'],
  'U5-3':['Saat hijrah, Nabi ﷺ bersembunyi di gua bersama…', 'Abu Bakar', 'Umar', 'Ali', 'QS 9:40; sirah', 'Sirah'], 'U5-4':['Nabi ﷺ hijrah dari Makkah ke…', 'Madinah', 'Thaif', 'Badar', 'Sirah', 'Sirah'],
  'U5-5':['Saat Fathu Makkah, Nabi ﷺ kepada penduduk Makkah…', 'Memaafkan', 'Marah', 'Pergi', 'Sirah', 'Akhlak'],
  'U6-1':['Kepada orang tua, kita tidak boleh berkata…', '“Ah”', 'Terima kasih', 'Tolong', 'QS 17:23', 'Akhlak'], 'U6-2':['Kalau diberi salam, kita menjawab dengan…', 'Yang lebih baik atau sama', 'Diam', 'Tertawa', 'QS 4:86', 'Akhlak'],
  'U6-3':['Mengejek dan memanggil teman dengan julukan buruk itu…', 'Dilarang Allah', 'Boleh kalau bercanda', 'Lucu', 'QS 49:11', 'Akhlak'], 'U6-4':['Seorang wanita masuk neraka karena…', 'Mengurung kucing tanpa memberi makan', 'Lupa sholat', 'Tidur siang', 'HR. Bukhari, Muslim', 'Akhlak'],
  'U6-5':['Orang yang jujur, perkataannya…', 'Selalu benar', 'Kadang benar', 'Ditambah-tambah', 'QS 9:119; 33:70', 'Akhlak'],
  'U7-1':['“Ya Tuhanku, tambahkanlah aku ilmu” adalah doa…', 'Minta ilmu', 'Sebelum makan', 'Sebelum tidur', 'QS 20:114', 'Doa'], 'U7-2':['Doa untuk orang tua meminta Allah…', 'Menyayangi mereka seperti mereka menyayangiku waktu kecil', 'Memberi uang', 'Membuat mereka kuat', 'QS 17:24', 'Doa'],
  'U7-3':['Doa “Rabbana atina” meminta kebaikan di…', 'Dunia dan akhirat', 'Dunia saja', 'Akhirat saja', 'QS 2:201', 'Doa'], 'U7-4':['Sebelum makan kita membaca…', 'Bismillah', 'Alhamdulillah', 'Subhanallah', 'HR. Bukhari, Muslim', 'Doa'],
  'U7-5':['Setelah makan kita mengucapkan…', 'Alhamdulillah', 'Bismillah', 'Astaghfirullah', 'HR. Muslim', 'Doa'],
  'U8-1':['Rukun Iman ada berapa?', '6', '5', '7', 'QS 2:285; 4:136; HR. Muslim', 'Nabi'], 'U8-2':['Malaikat yang membawa wahyu adalah…', 'Jibril', 'Mikail', 'Israfil', 'QS 2:97', 'Quran'],
  'U8-3':['Kitab yang diturunkan kepada Nabi Musa adalah…', 'Taurat', 'Injil', 'Zabur', 'QS 5:44', 'Nabi'], 'U8-4':['Kitab yang diturunkan kepada Nabi Dawud adalah…', 'Zabur', 'Taurat', 'Injil', 'QS 4:163', 'Nabi'],
  'U8-5':['Kitab yang diturunkan kepada Nabi Muhammad ﷺ adalah…', 'Al-Qur’an', 'Injil', 'Taurat', 'QS 25:1', 'Quran'],
  'U9-1':['Surat Al-Ikhlas menjelaskan bahwa Allah…', 'Maha Esa, tidak beranak dan tidak diperanakkan', 'Punya anak', 'Ada banyak', 'QS 112', 'Quran'], 'U9-2':['Surat Al-Fatihah ada berapa ayat?', '7', '5', '10', 'QS 1', 'Quran'],
  'U9-3':['Dalam surat An-Nas, kita berlindung dari…', 'Bisikan setan', 'Hujan', 'Hewan buas', 'QS 114', 'Quran'], 'U9-4':['Surat Al-Kautsar memerintahkan kita untuk…', 'Sholat dan berkurban', 'Tidur', 'Berlari', 'QS 108:2', 'Quran'],
  'U9-5':['Menurut surat Al-‘Asr, manusia rugi kecuali yang…', 'Beriman, beramal saleh, saling menasihati', 'Kaya', 'Pintar', 'QS 103', 'Quran'],
  'U10-1':['Kita berpuasa supaya menjadi orang yang…', 'Bertakwa', 'Kurus', 'Lapar', 'QS 2:183', 'Quran'], 'U10-2':['Al-Qur’an diturunkan di bulan…', 'Ramadan', 'Muharram', 'Syawal', 'QS 2:185', 'Quran'],
  'U10-3':['Lailatul Qadar lebih baik dari…', '1000 bulan', '100 hari', '1 tahun', 'QS 97:3', 'Quran'], 'U10-4':['Puasa dimulai dari terbit fajar sampai…', 'Malam (Maghrib)', 'Siang', 'Tengah malam', 'QS 2:187', 'Sholat'],
  'U10-5':['Anak yang belum kuat puasa penuh boleh…', 'Belajar puasa setengah hari dulu', 'Tidak usah belajar puasa', 'Puasa diam-diam', 'Disetujui ustadz (tadrij)', 'Akhlak']
};
/* stories: [picture, text, lesson, reference, ayat key, quiz [q, right, w1, w2]] */
const KS = {
  nuh:['kisah_nuh', 'Nabi Nuh mengajak kaumnya menyembah Allah saja, bertahun-tahun lamanya. Lalu Allah memerintahkan beliau membuat sebuah kapal yang sangat besar. Banyak orang lewat dan mengejek, tetapi Nabi Nuh tetap sabar dan taat. Ketika banjir besar datang, Allah menyelamatkan Nabi Nuh dan orang-orang beriman di dalam kapal.', 'Tetap taat kepada Allah walaupun diejek.', 'QS Hud 11:36–44', 'k_nuh', ['Apa yang Allah perintahkan kepada Nabi Nuh?', 'Membuat kapal besar', 'Membangun rumah', 'Menanam pohon']],
  ibrahim:['kisah_kabah', 'Nabi Ibrahim dan putranya, Nabi Ismail, membangun Ka’bah batu demi batu. Sambil bekerja, keduanya berdoa agar Allah menerima amal mereka. Ka’bah menjadi rumah pertama yang dibangun untuk beribadah kepada Allah.', 'Bekerja sambil berdoa, dan berharap amal diterima Allah.', 'QS Al-Baqarah 2:127; Ali ‘Imran 3:96', 'k_ibrahim', ['Siapa yang membantu Nabi Ibrahim membangun Ka’bah?', 'Nabi Ismail', 'Nabi Musa', 'Nabi Yunus']],
  musa:['kisah_musa', 'Nabi Musa dan kaumnya dikejar Fir’aun dan pasukannya sampai ke tepi laut. Kaumnya takut, tetapi Nabi Musa yakin Allah bersamanya dan akan memberi jalan. Allah memerintahkan beliau memukul laut dengan tongkatnya, lalu laut terbelah. Nabi Musa dan kaumnya pun selamat.', 'Saat takut, yakin bahwa Allah bersama kita.', 'QS Asy-Syu’ara 26:61–65', 'k_musa', ['Dengan apa Nabi Musa memukul laut?', 'Tongkat', 'Batu', 'Tangan']],
  yunus:['kisah_yunus', 'Nabi Yunus pergi meninggalkan kaumnya dalam keadaan marah, lalu beliau ditelan ikan besar. Di dalam gelap, beliau berdoa, mengakui kesalahannya dan memohon ampun kepada Allah. Allah mendengar doa itu dan menyelamatkannya.', 'Kalau salah, segera minta ampun kepada Allah.', 'QS Al-Anbiya 21:87–88; As-Saffat 37:139–146', 'k_yunus', ['Apa yang dilakukan Nabi Yunus di dalam perut ikan?', 'Berdoa memohon ampun', 'Tidur', 'Menangis saja']],
  hira:['kisah_hira', 'Nabi Muhammad ﷺ sering menyendiri di Gua Hira, sebuah gua di atas Jabal Nur, untuk merenung. Di sanalah wahyu pertama turun, dimulai dengan perintah “Bacalah dengan nama Tuhanmu yang menciptakan”. Karena itu, membaca dan belajar adalah bagian dari ibadah.', 'Belajar dan membaca itu perintah Allah.', 'QS Al-‘Alaq 96:1–5; nama Gua Hira: HR. Bukhari', 'k_hira', ['Apa perintah pertama dalam wahyu pertama?', 'Bacalah', 'Berlarilah', 'Tidurlah']],
  hijrah:['kisah_hijrah', 'Saat hijrah dari Makkah ke Madinah, Nabi Muhammad ﷺ dan sahabatnya, Abu Bakar radhiyallahu ‘anhu, bersembunyi di Gua Tsur. Abu Bakar cemas karena para pengejar sudah dekat. Nabi ﷺ menenangkannya: jangan bersedih, Allah bersama kita. Allah menurunkan ketenangan dan melindungi mereka.', 'Allah selalu bersama orang yang berserah kepada-Nya.', 'QS At-Taubah 9:40; nama: sirah', 'k_hijrah', ['Apa kata Nabi ﷺ kepada Abu Bakar di dalam gua?', 'Jangan bersedih, Allah bersama kita', 'Ayo pulang', 'Kita harus lari']],
  fathu:['kisah_fathu', 'Bertahun-tahun setelah hijrah, Nabi Muhammad ﷺ kembali ke Makkah bersama kaum Muslimin. Allah memberi pertolongan dan kemenangan, dan Ka’bah dibersihkan dari berhala. Nabi ﷺ memaafkan penduduk Makkah yang dulu memusuhi beliau, dan banyak orang kemudian masuk Islam berbondong-bondong.', 'Kemenangan datang dari Allah; orang yang kuat tetap pemaaf.', 'QS An-Nasr 110:1–3; QS Al-Isra 17:81; sirah', 'k_fathu', ['Dari mana datangnya kemenangan?', 'Dari Allah', 'Dari pasukan yang banyak', 'Dari keberuntungan']],
  syahadat:['kisah_syahadat', 'Allah sendiri bersaksi bahwa tidak ada tuhan selain Dia, begitu juga para malaikat dan orang-orang yang berilmu. Syahadat adalah kalimat pertama seorang Muslim: kita bersaksi bahwa tidak ada tuhan selain Allah, dan Nabi Muhammad ﷺ adalah utusan Allah. Kalimat ini kita ucapkan setiap hari di dalam sholat.', 'Kita hanya menyembah Allah dan mengikuti Rasul-Nya.', 'QS 3:18; 47:19; 48:29', 'k_syahadat', ['Syahadat artinya kita bersaksi bahwa…', 'Tidak ada tuhan selain Allah dan Muhammad utusan Allah', 'Kita anak yang pintar', 'Kita harus rajin belajar']],
  haji:['kisah_haji', 'Allah memerintahkan Nabi Ibrahim untuk menyeru manusia agar berhaji. Allah berfirman, mereka akan datang berjalan kaki dan berkendaraan dari tempat-tempat yang jauh. Sampai hari ini, jutaan orang datang ke Baitullah di Makkah. Haji wajib bagi orang yang mampu.', 'Haji adalah panggilan Allah; kita berdoa semoga suatu hari mampu berhaji.', 'QS 22:27; 3:97', 'k_haji', ['Haji wajib bagi orang yang…', 'Mampu', 'Sedang liburan', 'Tinggal di Makkah saja']],
  kiblat:['kisah_kiblat', 'Dahulu kaum Muslimin sholat menghadap Baitul Maqdis. Nabi Muhammad ﷺ sering menengadahkan wajah ke langit, berharap kiblat dipindahkan. Lalu Allah memerintahkan: hadapkan wajahmu ke arah Masjidil Haram. Sejak itu, di mana pun kita berada, kita sholat menghadap Ka’bah.', 'Kita taat pada perintah Allah, dan seluruh Muslim bersatu menghadap satu kiblat.', 'QS 2:144; 2:142–143; nama Baitul Maqdis: HR. Bukhari', 'k_kiblat', ['Di mana pun kita sholat, kita menghadap ke…', 'Ka’bah', 'Matahari terbit', 'Rumah kita']],
  hewan:['kisah_hewan', 'Allah berfirman bahwa hewan di bumi dan burung yang terbang adalah umat seperti kita. Nabi ﷺ bercerita tentang seorang laki-laki yang melihat anjing kehausan. Ia turun ke sumur, mengisi sepatunya dengan air, lalu memberi anjing itu minum. Allah berterima kasih kepadanya dan mengampuni dosanya.', 'Menyayangi hewan adalah kebaikan yang dicintai Allah.', 'QS 6:38; HR. Bukhari, Muslim', 'k_hewan', ['Apa yang dilakukan laki-laki itu?', 'Memberi minum anjing yang kehausan', 'Mengusir anjing itu', 'Pergi tanpa peduli']],
  zarrah:['kisah_zarrah', 'Allah berfirman: siapa yang berbuat kebaikan seberat zarrah pun, ia akan melihat balasannya. Zarrah itu sangat kecil, lebih kecil dari butir debu. Jadi senyum, menolong adik, atau memungut sampah pun tidak ada yang sia-sia. Keburukan sekecil apa pun juga akan dilihat, maka kita berhati-hati.', 'Tidak ada kebaikan yang terlalu kecil.', 'QS 99:7–8', 'k_zarrah', ['Kebaikan sekecil apa pun…', 'Akan dilihat balasannya', 'Dilupakan', 'Tidak dihitung']],
  takdir:['kisah_takdir', 'Allah menciptakan segala sesuatu dengan ukuran. Matahari terbit tepat waktu, hujan turun sesuai kadarnya, dan biji tumbuh menjadi pohon. Kita tetap berusaha dan berdoa, lalu menerima ketetapan Allah dengan sabar dan syukur.', 'Berusaha, berdoa, lalu ridha.', 'QS 54:49; QS 13:11', 'k_takdir', ['Allah menciptakan segala sesuatu…', 'Dengan ukuran', 'Secara kebetulan', 'Tanpa tujuan']],
  quran:['kisah_quran', 'Bulan Ramadan adalah bulan diturunkannya Al-Qur’an, petunjuk bagi manusia. Allah menurunkannya pada malam yang mulia. Karena itu, di bulan Ramadan kita memperbanyak membaca Al-Qur’an.', 'Al-Qur’an adalah petunjuk hidup kita.', 'QS 2:185; 97:1', 'k_quran', ['Al-Qur’an adalah…', 'Petunjuk bagi manusia', 'Buku cerita', 'Buku pelajaran sekolah']],
  lailah:['../langit/jalan_malam', 'Ada satu malam di bulan Ramadan yang lebih baik dari seribu bulan, namanya Lailatul Qadar. Pada malam itu para malaikat dan Jibril turun dengan izin Allah. Malam itu penuh kesejahteraan sampai terbit fajar. Kita menghidupkan sepuluh malam terakhir Ramadan dengan ibadah untuk mencarinya.', 'Bersungguh-sungguh di malam-malam yang mulia.', 'QS 97:1–5; sepuluh malam terakhir: HR. Bukhari', 'k_lailah', ['Malam Lailatul Qadar penuh kesejahteraan sampai…', 'Terbit fajar', 'Tengah malam', 'Siang hari']],
  wudhu:['kisah_wudhu', 'Supaya kita bersih dan siap menghadap Allah. Allah sendiri yang memerintahkan wudhu sebelum sholat: membasuh wajah, tangan sampai siku, mengusap kepala, dan membasuh kaki sampai mata kaki.', 'Wudhu membuat kita bersih dan siap sholat.', 'QS Al-Ma’idah 5:6', 'k_wudhu', ['Sebelum sholat kita harus…', 'Berwudhu', 'Makan', 'Tidur']]
};
const SUSUN = {
  S1:['Urutkan rukun Islam', ['Syahadat', 'Sholat', 'Zakat', 'Puasa', 'Haji'], 'HR. Bukhari, Muslim'],
  S2:['Urutkan wudhu', ['Niat', 'Basuh wajah', 'Basuh tangan sampai siku', 'Usap kepala', 'Basuh kaki sampai mata kaki'], 'QS 5:6; niat: HR. Bukhari'],
  S3:['Urutkan gerakan sholat', ['Takbiratul ihram', 'Berdiri dan Al-Fatihah', 'Rukuk', 'I’tidal', 'Sujud', 'Duduk di antara dua sujud', 'Sujud', 'Salam'], 'QS 22:77; urutan: hadits'],
  S3k:['Urutkan gerakan sholat', ['Takbir', 'Berdiri', 'Rukuk', 'Sujud', 'Salam'], 'QS 22:77; urutan: hadits'],
  S4:['Urutkan rukun iman', ['Allah', 'Malaikat', 'Kitab', 'Rasul', 'Hari akhir', 'Takdir'], 'QS 4:136; 54:49; urutan: HR. Muslim'],
  S5:['Urutkan sholat dalam sehari', ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'], 'Urutan waktu']
};
const GARIS = {
  G1:[['Wahyu pertama di Gua Hira', 'kisah_hira', '± 13 th sebelum Hijrah'], ['Hijrah ke Madinah', 'kisah_hijrah', '1 H'], ['Perang Badar', '../ikon/minum', '2 H'], ['Fathu Makkah', 'kisah_fathu', '8 H']],
  G2:[['Nabi Adam', '../taman/plant_tin_4', ''], ['Nabi Nuh', 'kisah_nuh', ''], ['Nabi Ibrahim', 'kisah_kabah', ''], ['Nabi Musa', 'kisah_musa', ''], ['Nabi Isa', 'kartu_isa', ''], ['Nabi Muhammad ﷺ', 'kisah_hira', '']]
};
/* doa lessons: ayat key in jlb_ayat.json, or _hadith key */
const DOA = { fatihah:['Al-Fatihah', 'fatihah'], ilmu:['Doa minta ilmu', 'ilmu'], ortu:['Doa untuk orang tua', 'ortu'], atina:['Doa kebaikan dunia akhirat', 'atina'],
  makan:['Doa sebelum makan', 'h:makan,lupa'], tidur:['Doa tidur dan bangun tidur', 'h:tidur,bangun'], wudhu:['Doa setelah wudhu', 'h:wudhu'], berbuka:['Doa berbuka puasa', 'h:berbuka'],
  ikhlas:['Surat Al-Ikhlas', 'ikhlas'], falaq:['Surat Al-Falaq', 'falaq'], nas:['Surat An-Nas', 'nas'], kautsar:['Surat Al-Kautsar', 'kautsar'], asr:['Surat Al-‘Asr', 'asr'] };
const L_ = (n, t, d, xp) => ({ n, t, d, xp:xp || 10 });
const UNITS = [
  ['Rukun Islam', '#0E7C66', [L_('Lima rukun', 'kuis', ['U1-1', 'U1-2']), L_('Syahadat', 'kisah', 'syahadat'), L_('Puasa dan zakat', 'kuis', ['U1-3', 'U1-4']), L_('Haji ke Makkah', 'kisah', 'haji'), L_('Urutkan rukun Islam', 'susun', 'S1')]],
  ['Wudhu', '#2450D6', [L_('Kenapa wudhu', 'kisah', 'wudhu'), L_('Air dan basuhan', 'kuis', ['U2-2', 'U2-3', 'U2-4']), L_('Urutan wudhu', 'susun', 'S2'), L_('Doa setelah wudhu', 'doa', 'wudhu'), L_('Kalau tidak ada air', 'kuis', ['U2-5'])]],
  ['Sholat', '#A85705', [L_('Lima waktu', 'kuis', ['U3-1', 'U3-5']), L_('Menghadap kiblat', 'kisah', 'kiblat'), L_('Gerakan sholat', 'susun', 'S3'), L_('Al-Fatihah', 'doa', 'fatihah'), L_('Jumlah rakaat', 'kuis', ['U3-3', 'U3-4'])]],
  ['Kisah para Nabi', '#16337F', [L_('Nabi Nuh', 'kisah', 'nuh'), L_('Nabi Ibrahim', 'kisah', 'ibrahim'), L_('Nabi Musa', 'kisah', 'musa'), L_('Nabi Yunus', 'kisah', 'yunus'), L_('Urutan para Nabi', 'garis', 'G2', 15)]],
  ['Sirah Nabi ﷺ', '#B85C00', [L_('Wahyu di Gua Hira', 'kisah', 'hira'), L_('Hijrah dan Gua Tsur', 'kisah', 'hijrah'), L_('Kota-kota Sirah', 'puzzle', 'P1', 15), L_('Fathu Makkah', 'kisah', 'fathu'), L_('Urutan peristiwa', 'garis', 'G1', 15)]],
  ['Akhlak', '#6B3FC4', [L_('Berbakti pada orang tua', 'kuis', ['U6-1']), L_('Salam', 'kuis', ['U6-2']), L_('Tidak mengejek', 'kuis', ['U6-3']), L_('Jujur', 'kuis', ['U6-5']), L_('Menyayangi hewan', 'kisah', 'hewan')]],
  ['Doa harian', '#0B6B57', [L_('Doa minta ilmu', 'doa', 'ilmu'), L_('Doa untuk orang tua', 'doa', 'ortu'), L_('Kebaikan dunia akhirat', 'doa', 'atina'), L_('Doa makan', 'doa', 'makan'), L_('Doa tidur', 'doa', 'tidur')]],
  ['Rukun Iman', '#2A1F5C', [L_('Enam rukun iman', 'kuis', ['U8-1']), L_('Malaikat', 'kuis', ['U8-2']), L_('Kitab-kitab Allah', 'kuis', ['U8-3', 'U8-4', 'U8-5']), L_('Urutkan rukun iman', 'susun', 'S4'), L_('Hari akhir dan takdir', 'kisah', 'zarrah,takdir')]],
  ['Surat pendek', '#0E7C66', [L_('Al-Ikhlas', 'doa', 'ikhlas'), L_('Al-Falaq', 'doa', 'falaq'), L_('An-Nas', 'doa', 'nas'), L_('Al-Kautsar', 'doa', 'kautsar'), L_('Al-‘Asr', 'doa', 'asr')]],
  ['Ramadan', '#4B2C8F', [L_('Kenapa puasa', 'kuis', ['U10-1']), L_('Al-Qur’an turun', 'kisah', 'quran'), L_('Lailatul Qadar', 'kisah', 'lailah'), L_('Sahur dan berbuka', 'kuis', ['U10-4', 'U10-5']), L_('Doa berbuka', 'doa', 'berbuka')]]
];

/* ---------------- Musim Baru: islands, steps, exams ----------------
   5 islands, 2 units each. A unit = 5 steps (5 questions each) + a unit exam (20 questions).
   An island ends with a boss exam (30 questions). Mumtaz (90%+) on every exam opens the way on;
   the next island opens 7 days after the last one at the earliest (parents can open or lock it).
   Progress lives in jlb:learn2 (per-entry merge on sync). XP: step +5 (replay +5 once a day),
   unit exam Mumtaz +10 (+5 perfect), island exam Mumtaz +30 (+10 perfect). Old jlb:learn XP is kept. */
const LESSONS = []; UNITS.forEach((u, ui) => u[2].forEach((l, li) => LESSONS.push(Object.assign({ id:'u' + (ui + 1) + '-' + (li + 1), u:ui, step:li + 1 }, l, { xp:5 }))));
const lessonById = id => LESSONS.find(l => l.id === id);
const ISL = [['Pulau Rukun', '#0E7C66'], ['Pulau Sholat dan Nabi', '#A85705'], ['Pulau Sirah dan Akhlak', '#6B3FC4'], ['Pulau Doa dan Iman', '#2450D6'], ['Pulau Qur’an dan Ramadan', '#4B2C8F']];
const LICON = { kisah:'baca', kuis:'ilmu', susun:'roda', doa:'doa_bangun', puzzle:'jalan', garis:'kajian', ujian:'sholat', boss:'kajian' };
const STONE_X = [50, 28, 66, 36, 70, 44, 64, 30, 62, 34, 68, 42];
const shuffle = a => a.map(x => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map(p => p[1]);
const GRADE = p => p >= 90 ? 'Mumtaz' : p >= 80 ? 'Jayyid Jiddan' : p >= 70 ? 'Jayyid' : 'Belum lulus';
const L2 = () => jget('learn2', {}) || {};
function l2put(k, fn) { const all = L2(), e = Object.assign({}, all[k] || {}); fn(e); e.at = Date.now(); all[k] = e; jset('learn2', all); if (typeof checkLevelUp === 'function') checkLevelUp(); }
const learnDone = () => { const A = L2(), o = {}; Object.keys(A).forEach(k => { if (k.startsWith('s:') && A[k].done) o[k.slice(2)] = A[k]; }); return o; };
const stepDone = id => !!(L2()['s:' + id] || {}).done;
const examMum = u => !!(L2()['e:u' + (u + 1)] || {}).mum;
const bossMum = i => !!(L2()['b:' + (i + 1)] || {}).mum;
const triedToday = k => !!((L2()[k] || {}).tries || {})[todayK()];
/* when island i (0-based) opens: day key, or null while its earlier island is unfinished */
function islandOpenDay(i) {
  const A = L2(), over = ((pget(CUR, 'jlb:ortu', {}) || {}).isl || {})[i + 1];
  if (i === 0) return (A['i:1'] || {}).d || todayK();
  const prev = islandOpenDay(i - 1);
  if (over && over.st === 'open') return over.d;
  if (!prev || !bossMum(i - 1)) return null;
  const boss = A['b:' + i] || {}, w = dkey(jAdd(kOf(prev), 7));
  return [w, boss.md || todayK()].sort()[1];
}
function islandState(i) {
  const over = ((pget(CUR, 'jlb:ortu', {}) || {}).isl || {})[i + 1];
  if (over && over.st === 'lock') return { open:false, why:'Dikunci Ayah atau Ibu' };
  const d = islandOpenDay(i);
  if (!d) return { open:false, why:i ? 'Selesaikan ujian ' + ISL[i - 1][0] + ' dengan nilai Mumtaz' : '' };
  if (d > todayK()) return { open:false, day:d, why:'Buka ' + niceDate(kOf(d)) };
  return { open:true, day:d };
}
/* the path, in order: steps and exams for each unit, then the island exam */
function pathItems() {
  const out = [];
  ISL.forEach((isl, i) => {
    [i * 2, i * 2 + 1].forEach(u => {
      LESSONS.filter(l => l.u === u).forEach(l => out.push({ kind:'step', id:l.id, u, isl:i, n:l.n, t:l.t, l }));
      out.push({ kind:'exam', id:'e' + (u + 1), u, isl:i, n:'Ujian ' + UNITS[u][0], t:'ujian' });
    });
    out.push({ kind:'boss', id:'b' + (i + 1), isl:i, n:'Ujian ' + isl[0], t:'boss' });
  });
  return out;
}
const itemDone = it => it.kind === 'step' ? stepDone(it.id) : it.kind === 'exam' ? examMum(it.u) : bossMum(it.isl);
function curItem() { return pathItems().find(it => !itemDone(it)) || null; }
/* can the child open this item now? */
function itemOpen(it) {
  if (itemDone(it)) return true;
  const c = curItem(); if (!c || c.id !== it.id) return false;
  return islandState(it.isl).open;
}
const itemById = id => pathItems().find(it => it.id === id);

/* ---------------- questions ---------------- */
const PA_N = { ilmu:'doa minta ilmu (QS 20:114)', ortu:'doa untuk orang tua (QS 17:24)', atina:'doa kebaikan dunia akhirat (QS 2:201)' };
function buildQ(c) {
  const o = QB[c] || QB2[c]; if (!o) return null;
  if (Array.isArray(o)) {
    if (o[5] === 'bs') return { c, q:'Benar atau salah? ' + o[0], opts:['Benar', 'Salah'], r:o[1], ref:o[4] };
    return Object.assign(qOpts(o[0], o[1], o[2], o[3]), { c, ref:o[4] });
  }
  if (!AYAT_L) return { c, wait:true };
  if (o.sa) { const A = AYAT_L[o.sa], i = o.a - A.a, right = A.ar[i + 1];
    const pool = A.ar.filter((x, j) => j !== i && j !== i + 1); const others = shuffle(pool.length >= 2 ? pool : pool.concat(AYAT_L.ikhlas.ar, AYAT_L.nas.ar).filter(x => x !== right && x !== A.ar[i])).slice(0, 2);
    return { c, q:'Sambung ayatnya. Setelah ayat ini, bacaannya adalah…', ar:A.ar[i], opts:shuffle([right].concat(others)), r:right, ref:'QS ' + A.n + ' ' + A.s + ':' + (o.a + 1), arab:true }; }
  if (o.pa) { const keys = ['ilmu', 'ortu', 'atina'], txt = k => AYAT_L[k].ar.join(' ');
    return { c, q:'Pilih teks Arab ' + PA_N[o.pa] + '.', opts:shuffle(keys.map(txt)), r:txt(o.pa), ref:o.ref, arab:true }; }
  return null;
}
const unitPool = u => { const ids = LESSONS.filter(l => l.u === u).map(l => l.id); return ids.flatMap(id => STEPQ[id]).concat(CADQ['u' + (u + 1)] || []); };
function itemQs(it) {
  if (it.kind === 'step') return shuffle(STEPQ[it.id]).map(buildQ).filter(Boolean);
  if (it.kind === 'exam') return shuffle(unitPool(it.u)).slice(0, 20).map(buildQ).filter(Boolean);
  return shuffle(unitPool(it.isl * 2).concat(unitPool(it.isl * 2 + 1))).slice(0, 30).map(buildQ).filter(Boolean);
}

/* ---------------- map ---------------- */
let LS = null, AYAT_L = null;
function renderBelajar() {
  if (!AYAT_L) loadAyatL();
  if (!L2()['i:1']) l2put('i:1', e => { e.d = todayK(); });
  const a = ROUTE_ARG;
  if (a === 'roda') return renderRoda();
  if (a && /^k[ap](-|$)/.test(a)) return jlazy(['kisahdata', 'kisah'], 'belajar', () => renderKA(a.startsWith('kp') ? 'ka' : a));
  if (a && itemById(a)) return renderItem(itemById(a));
  LS = null;
  const P = pathItems(), cur = curItem(), segs = [5, 4, 3, 2, 1], segH = 1200 / 670 * 100;
  let stones = '', marks = '';
  P.forEach(it => {
    const isl = it.isl, inSeg = it.kind === 'boss' ? 12 : (it.u % 2) * 6 + (it.kind === 'exam' ? 5 : it.l.step - 1);
    const segTop = (4 - isl) * (segH - 8), y = segTop + segH * (it.kind === 'boss' ? 0.1 : 0.92 - inSeg * 0.062), x = it.kind === 'boss' ? 50 : STONE_X[inSeg];
    const done = itemDone(it), now = cur && cur.id === it.id, st = islandState(isl), open = now && st.open, lock = !done && !open;
    const sz = it.kind === 'boss' ? 84 : now ? 78 : 64, bg = done ? (it.kind === 'step' ? '#0E7C66' : '#F2B705') : open ? '#F2B705' : '#DCE1EC';
    const badge = done && it.kind !== 'step' ? '<em class="jmum">Mumtaz</em>' : done ? '<em class="jok" aria-hidden="true">✓</em>' : '';
    stones += `<a class="jstone ${it.kind} ${open ? 'now' : lock ? 'lock' : ''}" ${lock ? `data-lwhy="${isl}" href="#belajar"` : `href="#belajar/${it.id}"`} style="left:${x}%;top:calc(${y} * 1vw * var(--mw))" ${open ? 'id="stoneNow"' : ''} aria-label="${esc(it.n)}, ${done ? 'selesai' : open ? 'sekarang' : 'terkunci'}">
      <i style="width:min(${sz}px,${(sz / 3.9).toFixed(1)}vw);height:min(${sz}px,${(sz / 3.9).toFixed(1)}vw);background:${bg}"><img src="${jimg(it.kind === 'boss' ? 'anak/star_jar.webp' : 'ikon/' + LICON[it.t] + '.webp')}" alt="" loading="lazy">${badge}</i><b>${esc(it.n)}</b></a>`;
    if (it.kind === 'step' && it.l.step === 1) marks += `<span class="junit" style="top:calc(${y + 3} * 1vw * var(--mw));background:${UNITS[it.u][1]}">Unit ${it.u + 1} · ${UNITS[it.u][0]}</span>`;
    if (it.kind === 'boss') { const done5 = bossMum(isl);
      marks += `<span class="jisl ${done5 ? 'gold' : ''}" style="top:calc(${segTop + 4} * 1vw * var(--mw));background:${ISL[isl][1]}">${done5 ? '★ ' : ''}Pulau ${isl + 1} · ${ISL[isl][0].replace('Pulau ', '')}</span>`;
      if (!st.open) marks += `<div class="jlockisl" style="top:calc(${segTop + segH * .42} * 1vw * var(--mw))"><b>Pulau ${isl + 1} terkunci</b><span>${esc(st.why)}</span></div>`; }
  });
  const done = P.filter(itemDone).length, today = todayK(), roda = (jget('roda', {}) || {})[today], A = L2(), kaDone = Object.keys(A).filter(k => k.startsWith('ka:') && A[k].done).length;
  const curOpen = cur && islandState(cur.isl).open;
  $('#v-belajar').innerHTML = `<div class="jw jkidw"><div class="jrow sp" style="padding-top:8px"><h1>Belajar Seru</h1><span class="jrow" style="gap:6px"><span class="jpill">${done} dari ${P.length}</span>${jsoundBtn()}</span></div>
    <p class="jmut" style="margin:-6px 0 0">Musim baru: 5 pulau, setiap langkah 5 soal, ujian unit dan ujian pulau. Nilai Mumtaz membuka jalan berikutnya.</p>
    ${!cur ? '<p class="note ok">MasyaAllah, semua pulau selesai!</p>' : curOpen ? `<a class="jb gold block" href="#belajar/${cur.id}">Lanjut: ${esc(cur.n)}</a>` : `<p class="note">${esc(islandState(cur.isl).why)}. Sambil menunggu, ulangi pelajaran yang sudah selesai (+5 XP sekali sehari) atau baca Kisah Akhlak.</p>`}
    <div class="jgrid2">
    <a class="jcard" href="#belajar/ka" style="text-decoration:none;color:inherit;background:var(--jkidcard)">${jicon('cerita_anak', '', 'baca')}<b>Kisah Akhlak</b><span class="jmut">${kaDone} dari 10 kisah</span></a>
    <a class="jcard" href="#belajar/roda" style="text-decoration:none;color:inherit;background:var(--jkidcard)">${jicon('roda')}<b>Roda Ilmu</b><span class="jmut">${roda ? 'Sudah diputar hari ini' : '1 putaran hari ini'}</span></a></div>
    <section class="jmap" style="--mw:1">${segs.map(s => `<img class="seg" src="${jimg('belajar/peta_' + s + '.webp')}" alt="" loading="${s < 3 ? 'eager' : 'lazy'}" decoding="async" width="670" height="1200">`).join('')}${stones}${marks}</section></div>`;
  fixMapScale();
  const sn = $('#stoneNow'); if (sn) setTimeout(() => sn.scrollIntoView({ block:'center', behavior:'instant' in window ? 'instant' : 'auto' }), 60);
}
function fixMapScale() { const m = $('.jmap'); if (!m) return; m.style.setProperty('--mw', m.clientWidth / innerWidth); }
addEventListener('resize', () => { if (document.body.dataset.view === 'belajar') fixMapScale(); });

/* ---------------- a step or an exam ---------------- */
function loadAyatL() { return fetch('js/jlb_ayat.json?v=' + JLB_VER).then(r => r.json()).then(j => { AYAT_L = j; if (document.body.dataset.view === 'belajar' && LS) { LS.qs = LS.qs.map(q => q && q.wait ? buildQ(q.c) : q); renderItem(itemById(LS.id)); } }); }
function ayahBox(k) {
  if (!AYAT_L) return '<div class="jload"><span></span></div>';
  if (k.startsWith('h:')) {
    const ks = k.slice(2).split(',').filter(Boolean);
    arabicFont();
    return ks.map(x => { const h = AYAT_L._hadith[x]; return `<div class="jcard"><div class="jar" lang="ar">${esc(h.ar)}</div><p class="jtr">${esc(h.id)}</p><span class="jsrc">${esc(h.src)}</span></div>`; }).join('');
  }
  const a = AYAT_L[k]; if (!a) return ''; arabicFont();
  return `<div class="jcard"><div class="jar" lang="ar">${a.ar.map(esc).join(' ۝ ')}</div><p class="jtr">${a.id.map(esc).join(' ')}</p><span class="jsrc">QS ${esc(a.n)} ${a.s}:${a.a}${a.b > a.a ? '–' + a.b : ''} · Terjemah Kemenag</span>${listenBtn(a)}</div>`;
}
const qOpts = (q, r, w1, w2) => ({ q, opts:shuffle([r, w1, w2]), r });
function renderItem(it) {
  if (!it) { location.hash = '#belajar'; return; }
  if (!LS || LS.id !== it.id) {
    if (!itemOpen(it)) { location.hash = '#belajar'; return; }
    if (it.kind !== 'step' && triedToday(it.kind === 'exam' ? 'e:u' + (it.u + 1) : 'b:' + (it.isl + 1))) { LS = { id:it.id, blocked:true }; return paintItem(it); }
    const l = it.l, intro = it.kind === 'step' && l.t !== 'kuis';
    LS = { id:it.id, phase:intro ? 'intro' : 'q', qs:itemQs(it), qi:0, pick:null, ok:0, asked:0, wrongs:0, page:0, placed:[], put:{}, checked:false, replay:itemDone(it) };
    if (it.kind === 'step' && l.t === 'susun') { const S = SUSUN[l.d === 'S3' && Number(PROF.age) < 9 ? 'S3k' : l.d]; LS.items = S[1].map((t, i) => ({ t, i })); LS.cards = shuffle(LS.items.slice()); LS.src = S; }
    if (it.kind === 'step' && l.t === 'garis') { LS.items = GARIS[l.d].map((x, i) => ({ t:x[0], img:x[1], yr:x[2], i })); LS.cards = shuffle(LS.items.slice()); }
    if (it.kind !== 'step') jvoice('b_ujian');
  }
  paintItem(it);
}
function paintItem(it) {
  const exam = it.kind !== 'step', l = it.l, color = it.kind === 'boss' ? ISL[it.isl][1] : UNITS[it.u][1];
  const total = LS.qs ? LS.qs.length : 0, pct = LS.phase === 'done' ? 100 : LS.phase === 'intro' ? 8 : Math.round(LS.qi / Math.max(1, total) * 100);
  const head = `<div class="jrow" style="padding-top:8px">${back('#belajar', 'Tutup')}<div class="jbar" style="flex:1"><i style="width:${LS.blocked ? 0 : pct}%"></i></div>${jsoundBtn()}</div>
    <span class="jmut" style="font-weight:800;color:${color};text-transform:uppercase;letter-spacing:.06em">${it.kind === 'boss' ? 'Ujian pulau · ' + ISL[it.isl][0] : 'Unit ' + (it.u + 1) + ' · ' + esc(UNITS[it.u][0])}${LS.replay && !exam ? ' · ulangan' : ''}</span><h1>${esc(it.n)}</h1>`;
  let body = '';
  if (LS.blocked) body = `<div class="jcard" style="align-items:center;text-align:center"><img src="${jimg('jimon/suasana/berpikir.webp')}" alt="" width="150" style="width:150px;height:auto"><h2>Ujian ini sudah dicoba hari ini</h2><span class="jmut">Setiap ujian boleh dicoba sekali sehari. Besok kita coba lagi ya, sambil mengulang langkah-langkahnya.</span></div><a class="jb ghost block" href="#belajar">Kembali ke peta</a>`;
  else if (LS.phase === 'done') body = exam ? examResultHTML(it) : stepDoneHTML(it);
  else if (LS.phase === 'intro') body = introHTML(it);
  else body = quizHTML(exam);
  $('#v-belajar').innerHTML = `<div class="jw jkidw">${head}${body}</div>`;
}
function introHTML(it) {
  const l = it.l;
  if (l.t === 'kisah') { const k = l.d.split(',')[LS.page], K = KS[k];
    return `<div style="border-radius:20px;overflow:hidden;height:300px"><img src="${jimg('belajar/' + K[0] + '.webp')}" alt="" style="width:100%;height:100%;object-fit:cover;object-position:50% 60%"></div>
      <p style="font-size:1.12rem;line-height:1.6">${esc(K[1])}</p><div class="jcard" style="background:var(--jsoft)"><b>Pelajaran</b><span>${esc(K[2])}</span><span class="jsrc">${esc(K[3])}</span></div>
      <div class="jrow">${jbtn('Dengarkan', 'data-lsay', 'ghost')}${jbtn('Lihat ayat', 'data-lay', 'ghost')}</div>${LS.ay ? ayahBox(K[4]) : ''}
      <div class="jrow"><img src="${jimonFace('dengar')}" alt="" width="80" height="87"><span class="jmsg">Siap untuk 5 pertanyaan?</span></div>${jbtn('Lanjut', 'data-lnext', 'green block')}`; }
  if (l.t === 'doa') { const D = DOA[l.d]; return `${ayahBox(D[1])}<div class="jrow"><img src="${jimonFace('senang')}" alt="" width="80" height="87"><span class="jmsg">Baca pelan-pelan bersama Ayah atau Ibu, lalu jawab 5 pertanyaan.</span></div>${jbtn('Aku sudah membaca', 'data-lnext', 'green block')}`; }
  if (l.t === 'susun') return susunHTML(false);
  if (l.t === 'garis') return susunHTML(true);
  if (l.t === 'puzzle') return puzzleHTML();
  return '';
}
function quizHTML(exam) {
  const q = LS.qs[LS.qi]; if (!q) return '';
  if (q.wait) return '<div class="jload" aria-busy="true"><span></span></div>';
  const ans = LS.pick !== null, fb = ans && LS.pick === q.r;
  if (q.arab) arabicFont();
  return `<div class="jcard"><span class="jmut">Soal ${LS.qi + 1} dari ${LS.qs.length}${exam ? ' · benar ' + LS.ok : ''}</span><h2 style="font-size:1.3rem">${esc(q.q)}</h2>${q.ar ? `<div class="jar" lang="ar">${esc(q.ar)}</div>` : ''}</div>
    <div class="jopt ${q.arab ? 'arab' : ''}">${q.opts.map(o => `<button data-lopt="${esc(o)}" ${q.arab ? 'lang="ar"' : ''} class="${ans && o === q.r ? 'ok' : ans && LS.pick === o ? 'no' : ''}" ${ans ? 'disabled' : ''}>${esc(o)}</button>`).join('')}</div>
    ${!ans ? '' : `<div class="jrow"><img src="${jimonFace(fb ? 'tertawa' : 'peduli')}" alt="" width="80" height="87"><span class="jmsg">${fb ? jpick(['MasyaAllah, benar!', 'Tepat sekali!', 'Hebat, kamu ingat!']) : exam ? 'Belum tepat. Jawaban yang benar sudah ditandai hijau.' : 'Hampir! Jawaban yang benar ditandai hijau. Soal ini muncul lagi nanti ya.'} <small class="jsrc">${esc(q.ref || '')}</small></span></div>${jbtn('Lanjut', 'data-lqn', 'green block')}`}`;
}
function susunHTML(garis) {
  const n = LS.items.length, ok = LS.checked && LS.placed.every((x, i) => x.i === i);
  return `<p class="jmut">${garis ? 'Ketuk kartu sesuai urutan, dari yang paling awal.' : 'Ketuk kartu sesuai urutan yang benar.'}</p>
    <div style="display:flex;flex-direction:column;gap:8px">${Array.from({ length:n }, (_, i) => { const x = LS.placed[i]; const wrong = LS.checked && x && x.i !== i;
      return `<div class="jslot ${x ? 'f' : ''}" style="${wrong ? 'border-color:var(--jy);background:#FFF4D6' : LS.checked && x ? 'border-color:var(--jg)' : ''}"><b>${i + 1}</b>${x ? `${garis ? `<img src="${jimg('belajar/' + x.img + '.webp')}" alt="" width="46" height="46" style="border-radius:10px;object-fit:cover">` : ''}<span style="flex:1">${esc(x.t)}</span>${garis && ok && x.yr ? `<span class="jpill" style="background:var(--jg);color:#fff">${esc(x.yr)}</span>` : ''}` : '<span class="jmut">…</span>'}</div>`; }).join('')}</div>
    <div class="jcards">${LS.cards.map((c, j) => `<button data-lcard="${j}" ${LS.placed.includes(c) ? 'disabled' : ''}>${esc(c.t)}</button>`).join('')}</div>
    ${LS.checked ? `<div class="jrow"><img src="${jimonFace(ok ? 'tertawa' : 'peduli')}" alt="" width="80" height="87"><span class="jmsg">${ok ? 'Hebat, urutannya benar! Sekarang 5 pertanyaan.' : 'Yang kuning belum pas. Tekan Ulang dan coba lagi.'}</span></div>` : ''}
    <div class="jrow">${jbtn('Ulang', 'data-lreset', 'ghost')}${ok ? jbtn('Lanjut', 'data-lnext', 'green') : jbtn('Periksa', 'data-lcheck ' + (LS.placed.length < n ? 'disabled' : ''), 'green')}</div>${LS.src ? `<span class="jsrc">${esc(LS.src[2])}</span>` : ''}`;
}
const PZD = [['Madinah', 79.6, 15.7], ['Badar', 34.9, 36.1], ['Makkah', 70.4, 86], ['Thaif', 88.8, 90.6]];
function puzzleHTML() {
  const all = Object.keys(LS.put).length === 4, right = PZD.filter((p, i) => LS.put[i] === p[0]).length;
  return `<p class="jmut">Ketuk nama kota, lalu ketuk titiknya di peta.</p>
    <div style="position:relative;border-radius:22px;overflow:hidden;aspect-ratio:358/477"><img src="${jimg('belajar/peta_hijaz.webp')}" alt="Peta Hijaz" style="width:100%;height:100%;object-fit:fill">
    ${PZD.map((p, i) => { const v = LS.put[i], okk = LS.checked && v === p[0];
      return `<button data-pzdot="${i}" style="position:absolute;left:${p[1]}%;top:${p[2]}%;transform:translate(-50%,-50%);min-width:44px;min-height:44px;border-radius:22px;border:3px solid #fff;padding:0 10px;font:800 .85rem var(--jfont);background:${LS.checked && v ? (okk ? '#0E7C66' : '#F2B705') : v ? '#2450D6' : '#fff'};color:${v ? '#fff' : '#0F1D3D'}">${v || '?'}</button>`; }).join('')}</div>
    <div class="jgrid4">${PZD.map(p => p[0]).sort().map(c => `<button class="jchip" data-pzc="${c}" aria-pressed="${LS.pick === c}" ${Object.values(LS.put).includes(c) ? 'disabled' : ''}>${c}</button>`).join('')}</div>
    ${LS.checked ? `<div class="jrow"><img src="${jimonFace(right === 4 ? 'tertawa' : 'peduli')}" alt="" width="80" height="87"><span class="jmsg">${right === 4 ? 'MasyaAllah, semua benar!' : right + ' dari 4 benar. Yang kuning pindahkan lagi ya.'}</span></div>` : '<div class="jrow"><img src="' + jimonFace('dengar') + '" alt="" width="80" height="87"><span class="jmsg">Petunjuk: Badar ada di antara Makkah dan Madinah, dekat laut.</span></div>'}
    <div class="jrow">${jbtn('Ulang', 'data-lreset', 'ghost')}${LS.checked && right === 4 ? jbtn('Lanjut', 'data-lnext', 'green') : jbtn('Periksa', 'data-pzcheck ' + (all ? '' : 'disabled'), 'green')}</div>`;
}
function nextAfter(it) { const nx = curItem(); return nx && nx.id !== it.id && islandState(nx.isl).open ? `<a class="jb gold block" href="#belajar/${nx.id}">Lanjut: ${esc(nx.n)}</a>` : ''; }
function stepDoneHTML(it) {
  return `<div class="jcard" style="align-items:center;text-align:center"><img src="${jimg('jimon/suasana/bangga.webp')}" alt="Jimon bangga" width="160" height="170" class="jwig" style="width:160px;height:auto">
    <h2>${LS.replay ? 'Ulangan selesai!' : 'Langkah selesai!'}</h2><span class="jmut">${LS.wrongs ? 'Ada ' + LS.wrongs + ' jawaban yang diulang. Bagus, kamu terus mencoba!' : 'Semua benar sejak pertama. MasyaAllah!'}</span>
    <img src="${jimg('anak/star_jar.webp')}" alt="" width="70" height="70"><b style="font-size:1.4rem">${LS.gain ? '+' + LS.gain + ' XP' : 'XP ulangan sudah didapat hari ini'}</b></div>
    ${nextAfter(it)}<a class="jb ghost block" href="#belajar">Kembali ke peta</a>`;
}
function examResultHTML(it) {
  const p = Math.round(LS.ok / LS.qs.length * 100), g = GRADE(p), mum = p >= 90;
  return `<div class="jcard" style="align-items:center;text-align:center"><img src="${jimg('jimon/suasana/' + (mum ? 'bangga' : 'berpikir') + '.webp')}" alt="" width="160" class="${mum ? 'jwig' : ''}" style="width:160px;height:auto">
    <h2>${it.kind === 'boss' ? 'Ujian pulau' : 'Ujian unit'}: ${g}</h2><b style="font-size:2rem">${LS.ok} / ${LS.qs.length}</b><span class="jmut">${p}% · Mumtaz mulai 90%</span>
    ${LS.gain ? `<b style="font-size:1.3rem;color:var(--jg)">+${LS.gain} XP</b>` : ''}
    <span>${mum ? (it.kind === 'boss' ? 'Pulau ini selesai! Pulau berikutnya terbuka paling cepat 7 hari setelah pulau ini dibuka.' : 'Jalan berikutnya terbuka.') : 'Belum Mumtaz. Ujian ini bisa dicoba lagi besok. Sambil menunggu, ulangi langkah-langkahnya ya.'}</span></div>
    ${mum ? nextAfter(it) : ''}<a class="jb ghost block" href="#belajar">Kembali ke peta</a>`;
}
function finishStep(it) {
  const tk = todayK(), k = 's:' + it.id, e = L2()[k] || {};
  if (!e.done) { l2put(k, x => { x.done = 1; x.xp = 5; x.d = tk; }); LS.gain = 5; }
  else if (!(e.rp || {})[tk]) { l2put(k, x => { x.rp = Object.assign({}, x.rp || {}); x.rp[tk] = 5; }); LS.gain = 5; }
  else LS.gain = 0;
  LS.phase = 'done'; kidAutoMis('belajar'); jvoice('b_langkah'); bell && ding(); paintItem(it);
}
function finishExam(it) {
  const tk = todayK(), k = it.kind === 'exam' ? 'e:u' + (it.u + 1) : 'b:' + (it.isl + 1), p = Math.round(LS.ok / LS.qs.length * 100), mum = p >= 90, perfect = LS.ok === LS.qs.length;
  const base = it.kind === 'exam' ? 10 : 30, bonus = it.kind === 'exam' ? 5 : 10, before = L2()[k] || {}, wasLast = it.kind === 'boss';
  let gain = 0;
  l2put(k, x => { x.tries = Object.assign({}, x.tries || {}); x.tries[tk] = p; x.best = Math.max(x.best || 0, p);
    if (mum && !x.mum) { x.mum = 1; x.md = tk; x.xp = (x.xp || 0) + base; gain += base; }
    if (perfect && !x.perfect) { x.perfect = 1; x.xp = (x.xp || 0) + bonus; gain += bonus; } });
  LS.gain = gain; LS.phase = 'done'; kidAutoMis('belajar');
  jvoice(!mum ? 'b_ulang' : perfect ? 'b_mumtaz' : 'b_lulus', mum && wasLast && !before.mum && it.isl < 4 ? () => jvoice('b_tunggu') : null);
  bell && ding(); paintItem(it);
}

/* ---------------- Roda Ilmu ---------------- */
let RD = null;
const RCAT = ['Doa', 'Sholat', 'Nabi', 'Sirah', 'Quran', 'Akhlak'];
function renderRoda() {
  const tk = todayK(), R = jget('roda', {}), done = R[tk];
  const G = isKidP() && typeof kidMisGate === 'function' ? kidMisGate() : { ok:true }, allMisi = G.ok;
  if (!RD) RD = { rot:0, cat:null, q:null, pick:null };
  $('#v-belajar').innerHTML = `<div class="jw" style="background:#0F1D3D;color:#fff;margin-top:-12px;padding-top:12px;min-height:100vh">
    <div class="jrow">${back('#belajar', 'Tutup')}<h1 style="color:#fff">Roda Ilmu</h1></div><p style="opacity:.8">1 putaran hari ini · benar +5 XP, mencoba +2 XP</p>
    <div class="jpin"></div><div class="jwheel" style="transform:rotate(${RD.rot}deg)">${RCAT.map((c, i) => `<span style="transform:rotate(${30 + i * 60}deg) translateY(-105px)">${c}</span>`).join('')}</div>
    ${done && !RD.q ? `<p class="note" style="color:#0F1D3D">Sudah diputar hari ini (${done.ok ? 'benar' : 'mencoba'}). Kembali besok ya!</p>` : !allMisi ? `<p class="note" style="color:#0F1D3D">Terbuka setelah ${G.need} misi hari ini selesai. Sekarang baru ${G.done}.</p>` : !RD.cat ? jbtn('PUTAR!', 'data-rspin', 'gold block') : ''}
    ${RD.q ? `<div class="jcard" style="color:var(--jink)"><span class="jmut">Kategori: ${RD.cat}</span><h2>${esc(RD.q.q)}</h2><div class="jopt">${RD.q.opts.map(o => `<button data-ropt="${esc(o)}" class="${RD.pick === o ? (o === RD.q.r ? 'ok' : 'no') : RD.pick && o === RD.q.r ? 'ok' : ''}" ${RD.pick ? 'disabled' : ''}>${esc(o)}</button>`).join('')}</div>
      ${RD.pick ? `<b>${RD.pick === RD.q.r ? 'MasyaAllah, benar! +5 XP' : 'Terima kasih sudah mencoba! +2 XP'}</b>` : ''}</div>` : ''}</div>`;
}


/* ---------------- events ---------------- */
document.addEventListener('click', e => {
  const w = e.target.closest('[data-lwhy]');
  if (w) { e.preventDefault(); const i = Number(w.dataset.lwhy), st = islandState(i), cur = curItem();
    jtoast(!st.open ? 'Pulau ' + (i + 1) + ': ' + st.why : cur ? 'Selesaikan dulu: ' + cur.n : 'Terkunci'); if (!st.open && i > 0) jvoice('b_tunggu'); return; }
  const t = e.target.closest('[data-lsay],[data-lay],[data-lnext],[data-lopt],[data-lqn],[data-lcard],[data-lreset],[data-lcheck],[data-pzc],[data-pzdot],[data-pzcheck],[data-rspin],[data-ropt]');
  if (!t || t.disabled) return;
  const ds = t.dataset, it = LS && itemById(LS.id), l = it && it.l;
  if (ds.rspin !== undefined) { const ci = Math.floor(Math.random() * 6); RD.rot = 1440 - (30 + ci * 60); RD.cat = RCAT[ci]; renderRoda();
    setTimeout(() => { const pool = Object.keys(QB).filter(k => QB[k][5] === RD.cat), c = pool[Math.floor(Math.random() * pool.length)]; RD.q = qOpts(QB[c][0], QB[c][1], QB[c][2], QB[c][3]); renderRoda(); }, 3300); return; }
  if (ds.ropt) { RD.pick = ds.ropt; const R = jget('roda', {}); R[todayK()] = { ok:ds.ropt === RD.q.r ? 1 : 0, at:Date.now() }; jset('roda', R); jvoice(ds.ropt === RD.q.r ? jpick(['b_benar1', 'b_benar2', 'b_benar3']) : 'b_hampir2'); if (typeof checkLevelUp === 'function') checkLevelUp(); return renderRoda(); }
  if (!it) return;
  if (ds.lsay !== undefined) { const k = l.d.split(',')[LS.page]; if ('speechSynthesis' in window) { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(KS[k][1]); u.lang = 'id-ID'; u.rate = .95; speechSynthesis.speak(u); } return; }
  if (ds.lay !== undefined) { LS.ay = !LS.ay; return paintItem(it); }
  if (ds.lnext !== undefined) { if ('speechSynthesis' in window) speechSynthesis.cancel();
    if (l && l.t === 'kisah' && LS.page < l.d.split(',').length - 1) { LS.page++; LS.ay = false; } else { LS.phase = 'q'; LS.pick = null; }
    window.scrollTo(0, 0); return paintItem(it); }
  if (ds.lopt) { if (LS.pick !== null) return; const q = LS.qs[LS.qi], ok = ds.lopt === q.r; LS.pick = ds.lopt; LS.asked++;
    if (ok) { LS.ok++; jvoice(jpick(['b_benar1', 'b_benar2', 'b_benar3'])); }
    else { LS.wrongs++; jvoice(it.kind === 'step' ? 'b_hampir1' : 'b_hampir2');
      if (it.kind === 'step') { const again = buildQ(q.c); if (again) LS.qs.push(again); } }
    return paintItem(it); }
  if (ds.lqn !== undefined) { LS.pick = null; LS.qi++; window.scrollTo(0, 0);
    if (LS.qi >= LS.qs.length) return it.kind === 'step' ? finishStep(it) : finishExam(it);
    return paintItem(it); }
  if (ds.lcard) { const c = LS.cards[Number(ds.lcard)]; if (LS.placed.length < LS.items.length) LS.placed.push(c); LS.checked = false; return paintItem(it); }
  if (ds.lreset !== undefined) { LS.placed = []; LS.put = {}; LS.checked = false; LS.pick = null; return paintItem(it); }
  if (ds.lcheck !== undefined) { LS.checked = true; return paintItem(it); }
  if (ds.pzc) { LS.pick = LS.pick === ds.pzc ? null : ds.pzc; return paintItem(it); }
  if (ds.pzdot !== undefined) { if (!LS.pick) return; Object.keys(LS.put).forEach(k => { if (LS.put[k] === LS.pick) delete LS.put[k]; }); LS.put[ds.pzdot] = LS.pick; LS.pick = null; LS.checked = false; return paintItem(it); }
  if (ds.pzcheck !== undefined) { LS.checked = true; LS.pick = null; return paintItem(it); }
});
addEventListener('hashchange', () => { if (!location.hash.startsWith('#belajar')) { LS = null; RD = null; if ('speechSynthesis' in window) speechSynthesis.cancel(); }
  else if (location.hash === '#belajar/roda') RD = null; });
