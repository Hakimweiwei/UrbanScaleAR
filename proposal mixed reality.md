PROPOSAL RENCANA RANCANGAN DESAIN PROYEK AUGMENTED REALITY (AR)

Mata Kuliah: Augmented Reality
Dosen Pengampu: Dhani Ariatmanto
Judul Proyek: UrbanScale WebAR: Prototipe Visualisasi Spasial dan Analisis Tata Ruang Arsitektur dengan Transisi Makro-Mikro Berbasis WebXR

Disusun Oleh (Kelompok [Nomor]):
1. Achmed Bintang Asy-Syfa M. - 23.11.5818
2. Awaludin - 23.11.5822
3. Muhamad Imam Hakim - 23.11.5857

PROGRAM STUDI S1 INFORMATIKA
Fakultas Ilmu Komputer
Universitas AMIKOM Yogyakarta
2026

---

DAFTAR ISI
BAB 1: PENDAHULUAN
BAB 2: KONSEP AUGMENTED REALITY
BAB 3: RANCANGAN TEKNIS DAN SISTEM
BAB 4: RANCANGAN INTERAKSI DAN UI/UX WEB
BAB 5: RENCANA PENGEMBANGAN
BAB 6: PENUTUP
DAFTAR PUSTAKA

---

BAB 1
PENDAHULUAN

1.1 Latar Belakang Masalah
Dalam proses evaluasi dan prototyping desain arsitektur, representasi visual konvensional sering kali gagal memberikan pemahaman spasial yang komprehensif. Di satu sisi, Augmented Reality (AR) skala lantai (Makro) sangat baik untuk memvisualisasikan massa bangunan dari luar (eksterior) dan konteks lingkungan, namun gagal memberikan pengalaman imersif ke dalam tata ruang. Di sisi lain, tur Virtual Reality (VR) interior (Mikro) mampu meninjau detail ruangan, namun sering kali kehilangan konteks lingkungan sekitar dan secara tradisional membutuhkan perangkat Head-Mounted Display (HMD) yang mahal serta aplikasi native yang berat.

UrbanScale WebAR memecahkan dikotomi ini melalui pendekatan "Macro-to-Micro Spatial Transition" yang terinspirasi dari perangkat lunak perakitan spasial tingkat lanjut (seperti Studio Assembler). Aplikasi ini memungkinkan pengguna untuk memproyeksikan maket bangunan di ruangan nyata (Mode Makro), mengelilinginya secara fisik untuk menganalisis massa dan fasad, lalu melakukan "teleportasi" masuk ke dalam bangunan (Mode Mikro) untuk meninjau tata ruang interior secara First-Person hanya dengan bermodalkan browser smartphone. Pendekatan Frictionless ini menghilangkan batasan antara evaluasi eksterior dan interior dalam satu pipeline komputasi spasial yang ringan, tanpa memerlukan instalasi aplikasi native maupun perangkat keras VR khusus.

1.2 Visi dan Tujuan Proyek
Visi:
Menyediakan lingkungan komputasi spasial berbasis web yang imersif, memungkinkan transisi mulus antara inspeksi massa bangunan (eksterior) dan analisis tata ruang (interior) tanpa batasan platform perangkat keras.

Tujuan (SMART):
● Specific: Membangun aplikasi WebAR dengan fitur Camera State Machine dan URL Routing yang memungkinkan transisi dari mode AR Markerless (Plane Tracking) ke mode First-Person Interior View menggunakan Antigravity IDE dan Three.js.
● Measurable: Aplikasi mampu mempertahankan stabilitas objek (zero-drifting) saat pengguna berjalan mengelilingi model (VIO Tracking), dan melakukan switching kamera ke mode interior dalam waktu < 1 detik tanpa memuat ulang aset.
● Achievable: Menggunakan WebXR Device API untuk pelacakan spasial dan DeviceOrientation API (Gyroscope) untuk navigasi interior, sepenuhnya berjalan di mobile browser.
● Relevant: Memberikan alat bantu analisis spasial komprehensif (eksterior & interior) bagi evaluator desain melalui pemindaian QR Code spesifik.
● Time-bound: Menyelesaikan pengembangan sistem menggunakan metodologi Agile Sprint berbasis Fase dalam kurun waktu satu semester akademik tersisa.

1.3 Target Pengguna
● Mahasiswa dan Dosen Arsitektur/Desain: Untuk mengevaluasi prototipe massa bangunan dan tata ruang interior secara cepat dan imersif.
● Evaluator Desain: Untuk melakukan inspeksi visual terhadap opsi-opsi alternatif desain dan sirkulasi ruang dalam tanpa perlu membuka perangkat lunak 3D desktop yang berat.
● Pengembang Informatika: Sebagai studi kasus implementasi WebXR, manipulasi DOM, URL Routing, dan Camera State Management di atas WebGL.

1.4 Batasan Masalah
● Platform (WebAR): Berjalan sepenuhnya di mobile browser via URL/QR Code. Tidak ada pembuatan aplikasi native (APK/IPA).
● Metode Tracking (Makro): Menggunakan Markerless AR (WebXR Hit-Test & Plane Tracking) untuk penempatan model di lantai ruangan nyata, didukung oleh Visual-Inertial Odometry (VIO) agar objek tidak hilang saat dikelilingi.
● Mode Interior (Mikro): Menggunakan Virtual Camera yang dikunci pada DeviceOrientation (Gyroscope HP) untuk simulasi tur 360° di dalam model.
● Ketersediaan Aset & Routing: Sistem menggunakan 3 (tiga) aset model 3D format glTF yang telah tersedia. Masing-masing model memiliki QR Code uniknya sendiri yang memicu pemuatan aset spesifik via parameter URL (URL Routing) untuk mengoptimasi memori browser.
● Lingkungan Pengembangan: Eksklusif menggunakan Antigravity IDE (HTML, CSS, JavaScript, Three.js). Pengujian dilakukan secara lokal menggunakan HTTPS Tunneling (Ngrok) dan WebXR Emulator tanpa biaya server (Zero-Budget).

---

BAB 2
KONSEP AUGMENTED REALITY

2.1 Definisi dan Tipe AR
Tipe AR yang diterapkan dalam proyek ini menggunakan pendekatan Hybrid Spatial Computing:
● Markerless WebAR (Plane Tracking) untuk Mode Makro
  ○ Definisi: Menggunakan WebXR Hit-Test API untuk mendeteksi permukaan datar (lantai) dan menempatkan model 3D.
  ○ Alasan Pemilihan: Memungkinkan pengguna meletakkan "maket digital" di lantai ruangan mereka dan berjalan mengelilinginya secara fisik (Walkaround) berkat dukungan VIO bawaan browser.
● First-Person VR (DeviceOrientation) untuk Mode Mikro
  ○ Definisi: Mengubah kamera dari pelacak AR fisik menjadi kamera virtual di dalam model 3D yang merespons putaran Gyroscope HP.
  ○ Alasan Pemilihan: Memberikan pengalaman "masuk ke dalam ruangan" (immersive walkthrough) tanpa memerlukan headset VR, memanfaatkan sensor IMU bawaan smartphone.

2.2 Skenario Penggunaan (User Flow - Konsep Studio Assembler)
1. Scan Gateway (URL Routing): Pengguna memindai salah satu dari 3 QR Code spesifik (misal: QR Varian A, B, atau C). Browser membuka WebAR dan JavaScript otomatis membaca parameter URL untuk memuat 1 model glTF yang sesuai di background (menghemat RAM).
2. Scan & Place (Mode Makro): Pengguna mengarahkan kamera ke lantai, tap layar (Hit-Test) untuk memunculkan model 3D bangunan.
3. Physical Walkaround: Pengguna berjalan mengelilingi model 3D yang tertanam di lantai secara fisik. VIO memastikan model tetap diam di tempat (zero-drifting).
4. Portal Transition: Pengguna menekan tombol "Masuk ke Dalam" (Enter Interior) pada UI Web (DOM Overlay).
5. Immersive Walkthrough (Mode Mikro): Layar bertransisi. WebXR tracking dimatikan. Kamera kini berada di dalam ruangan model 3D. Pengguna dapat menolehkan HP-nya ke segala arah menggunakan Gyroscope untuk meninjau detail interior layaknya tur 360°.
6. Exit: Pengguna menekan tombol "Keluar" untuk kembali ke mode AR Makro atau memindai QR Code lain untuk melihat varian desain yang berbeda.

---

BAB 3
RANCANGAN TEKNIS DAN SISTEM

3.1 Spesifikasi Perangkat Keras
● Platform Target: Smartphone dengan browser modern (Chrome/Safari) yang mendukung WebXR dan DeviceOrientation API.
● Sensor Spasial: Kamera (untuk AR Plane Tracking) dan IMU/Gyroscope (untuk navigasi look-around di dalam ruangan).
● Lingkungan Testing (Zero-Budget): Laptop/PC tanpa sensor AR/Gyro, dibantu oleh WebXR API Emulator untuk simulasi logika, dan Ngrok untuk bridging HTTPS ke HP.

3.2 Spesifikasi Perangkat Lunak
● IDE: Antigravity IDE (Eksklusif untuk pengembangan HTML, CSS, JS, dan manajemen Local Server).
● Web 3D Engine: Three.js (Untuk manajemen Scene, GLTFLoader, dan Camera State Machine).
● Framework AR: WebXR Device API (Hit-Test).
● Bahasa Pemrograman: JavaScript (ES6+), HTML5, CSS3.
● Format Aset: glTF / GLB (3 File yang telah disediakan).
● Infrastruktur Testing: Local Server (Live Server) + HTTPS Tunneling (Ngrok) untuk bypass restriksi keamanan kamera browser tanpa perlu deploy ke cloud berbayar.

3.3 Arsitektur Sistem AR (Camera State Machine & URL Routing)
Sistem dirancang dengan arsitektur ringan berbasis web:
1. URL Routing Layer: Membaca `URLSearchParams` dari browser saat QR di-scan untuk menentukan model glTF mana yang akan di-instantiate (mencegah browser crash karena load 3 model sekaligus).
2. State AR (Exterior / Makro):
   ○ renderer.xr.enabled = true
   ○ Kamera dikendalikan oleh WebXR Frame of Reference (melacak pergerakan fisik user di dunia nyata).
3. State Interior (First-Person / Mikro):
   ○ renderer.xr.enabled = false (Tracking AR diputus).
   ○ Posisi kamera dipindahkan ke koordinat X,Y,Z di dalam model GLTF.
   ○ Rotasi kamera di-bind ke DeviceOrientationEvent (Gyroscope HP) agar user bisa melihat sekeliling interior.

---

BAB 4
RANCANGAN INTERAKSI DAN UI/UX WEB

Tampilan web menggunakan DOM Overlay (HTML/CSS) yang beradaptasi berdasarkan State aplikasi:

4.1 State 1: AR Viewport (Makro)
● Tampilan: Feed kamera dunia nyata dengan model 3D di lantai.
● UI Overlay:
  ○ Reticle (Indikator penempatan di lantai).
  ○ Tombol Aksi: "Masuk ke Ruangan" (Hanya muncul jika user sudah menempatkan model).
  ○ Instruksi Visual: Panduan cara berjalan mengelilingi model.

4.2 State 2: Interior Viewport (Mikro)
● Tampilan: Layar penuh merender bagian dalam model 3D (feed kamera terputus dari dunia nyata, berganti ke render lingkungan 3D murni).
● UI Overlay:
  ○ Crosshair / Compass: Indikator arah hadap di dalam ruangan.
  ○ Tombol "Keluar ke Maket" (Exit Interior).
  ○ Pop-up Info: Metadata ruangan (Luas, material).

4.3 Metode Interaksi
● Tap to Place: Menempatkan maket di lantai via Hit-Test.
● Physical Walkaround: Berjalan fisik mengelilingi maket (AR Mode).
● Gyroscope Look-Around: Menolehkan HP untuk melihat langit-langit, lantai, dan sudut ruangan saat berada di Mode Interior.

---

BAB 5
RENCANA PENGEMBANGAN

5.1 Daftar Kebutuhan Aset
| Kategori | Nama Aset | Fungsi | Sumber / Format |
| --- | --- | --- | --- |
| Model 3D | Aset 1: Konsep Massa & Interior | Representasi volumetrik dan tata ruang. | File Lokal (.glb) - Sudah Tersedia |
| Model 3D | Aset 2: Varian Fasad Alternatif | Representasi desain fasad berbeda. | File Lokal (.glb) - Sudah Tersedia |
| Model 3D | Aset 3: Konsep Lanskap Tapak | Representasi integrasi bangunan & lahan. | File Lokal (.glb) - Sudah Tersedia |
| Gateway | 3 QR Code Unik (URL Params) | Trigger pemuatan model spesifik via URL. | Generate QR Code (Gratis) |
| UI/UX | Web DOM Elements | HUD AR, Tombol Transisi, Modal Info. | HTML5 / CSS3 |

5.2 Jadwal Kerja (Timeline Berbasis Fase)
| Tahapan Pengembangan | Fase 1: Setup Web & Aset | Fase 2: AR Plane Tracking | Fase 3: Camera State & UI | Fase 4: Testing & Deploy |
| --- | :---: | :---: | :---: | :---: |
| Inisialisasi Project di Antigravity IDE & Setup Three.js. | ✔ | | | |
| Setup URL Routing & Preload Aset glTF. | ✔ | | | |
| Implementasi WebXR Hit-Test (Tap to Place). | | ✔ | | |
| Coding HTML/CSS untuk HUD dan Tombol Transisi. | | | ✔ | |
| Logika JS: Camera State Machine (AR ke Interior/Gyroscope). | | | ✔ | |
| QA: Uji coba Walkaround & Gyroscope via Ngrok (HTTPS) & Emulator. | | | | ✔ |
| Finalisasi & Generate 3 QR Code untuk Presentasi. | | | | ✔ |

5.3 Pembagian Tugas Tim
| Nama | Peran | Tugas |
| --- | --- | --- |
| Achmed Bintang Asy-Syfa M. | WebXR & Three.js Dev | Setup WebXR Hit-Test, VIO Tracking, dan logika Camera State Machine di Antigravity IDE. |
| Awaludin | Web UI/UX Frontend | Coding HTML/CSS untuk HUD, transisi animasi, dan integrasi DeviceOrientation API. |
| Muhamad Imam Hakim | Asset & Logic Optimizer | Setup URL Routing (Parameter), koordinat "Spawn Point" kamera di dalam GLTF, dan setup lighting. |

---

BAB 6
PENUTUP

6.1 Kesimpulan
● Transisi Spasial Makro-Mikro: Proyek ini berhasil mengimplementasikan alur evaluasi desain yang komprehensif, memungkinkan pengguna menganalisis massa bangunan dari luar (AR) dan meninjau tata ruang dari dalam (First-Person VR) dalam satu aplikasi web yang ringan.
● Pemanfaatan Sensor Fusion: Kombinasi antara WebXR (untuk pelacakan ruang fisik) dan DeviceOrientation API (untuk navigasi ruang virtual) membuktikan bahwa browser modern mampu menangani komputasi spasial tingkat lanjut tanpa perangkat keras tambahan.
● Optimasi Memori via URL Routing: Penggunaan 3 QR Code terpisah yang memicu parameter URL membuktikan pendekatan cerdas dalam manajemen memori browser mobile, mencegah crash akibat pemuatan aset 3D ganda.
● Zero-Budget Development: Pemanfaatan Antigravity IDE, Local Server, WebXR Emulator, dan HTTPS Tunneling (Ngrok) membuktikan bahwa pengembangan WebXR tingkat lanjut dapat dilakukan tanpa biaya infrastruktur server.

6.2 Rencana Pengembangan Lanjutan
● Spatial Audio: Menambahkan efek suara 3D (HRTF) di dalam Mode Interior (misal: suara langkah kaki atau gema ruangan) untuk meningkatkan imersi.
● Interactive Hotspots: Menambahkan titik klik (raycasting) di dalam Mode Interior untuk membuka detail material atau spesifikasi furnitur.
● Multiplayer Tour: Mengintegrasikan WebRTC agar dua pengguna dapat masuk ke dalam "ruangan" virtual yang sama secara bersamaan dari perangkat yang berbeda.

