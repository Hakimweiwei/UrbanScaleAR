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
● Achievable: Menggunakan WebXR Device API untuk pelacakan spasial 6-DoF dan antarmuka Virtual Joystick untuk navigasi interior, sepenuhnya berjalan di mobile browser.
● Relevant: Memberikan alat bantu analisis spasial komprehensif (eksterior & interior) bagi evaluator desain melalui pemindaian QR Code spesifik.
● Time-bound: Menyelesaikan pengembangan sistem menggunakan metodologi Agile Sprint berbasis Fase dalam kurun waktu satu semester akademik tersisa.

1.3 Target Pengguna
● Mahasiswa dan Dosen Arsitektur/Desain: Untuk mengevaluasi prototipe massa bangunan dan tata ruang interior secara cepat dan imersif.
● Evaluator Desain: Untuk melakukan inspeksi visual terhadap opsi-opsi alternatif desain dan sirkulasi ruang dalam tanpa perlu membuka perangkat lunak 3D desktop yang berat.
● Pengembang Informatika: Sebagai studi kasus implementasi WebXR, manipulasi DOM, URL Routing, dan Camera State Management di atas WebGL.

1.4 Batasan Masalah
● Platform (WebAR): Berjalan sepenuhnya di mobile browser via URL/QR Code. Tidak ada pembuatan aplikasi native (APK/IPA).
● Metode Tracking (Makro): Menggunakan Markerless AR (WebXR Hit-Test & Plane Tracking) untuk penempatan model di lantai ruangan nyata, didukung oleh Visual-Inertial Odometry (VIO) agar objek tidak hilang saat dikelilingi.
● Mode Interior (Mikro): Menggunakan arsitektur Camera Rig yang dipadukan dengan Virtual Joystick untuk simulasi berjalan (Walkthrough) di dalam model tanpa memutus pelacakan ruang fisik WebXR.
● Ketersediaan Aset & Routing: Sistem menggunakan aset model 3D format glTF yang telah tersedia. Masing-masing model memiliki QR Code uniknya sendiri yang memicu pemuatan aset spesifik via parameter URL (URL Routing) untuk mengoptimasi memori browser.
● Lingkungan Pengembangan: Eksklusif menggunakan Antigravity IDE (HTML, CSS, JavaScript, Three.js). Pengujian dilakukan secara lokal menggunakan HTTPS Tunneling (Cloudflare) dan WebXR Emulator, serta deployment akhir ke GitHub Pages (Zero-Budget).

---

BAB 2
KONSEP AUGMENTED REALITY

2.1 Definisi dan Tipe AR
Tipe AR yang diterapkan dalam proyek ini menggunakan pendekatan Hybrid Spatial Computing:
● Markerless WebAR (Plane Tracking) untuk Mode Makro
  ○ Definisi: Menggunakan WebXR Hit-Test API untuk mendeteksi permukaan datar (lantai) dan menempatkan model 3D.
  ○ Alasan Pemilihan: Memungkinkan pengguna meletakkan "maket digital" di lantai ruangan mereka dan berjalan mengelilinginya secara fisik (Walkaround) berkat dukungan VIO bawaan browser.
● First-Person VR (Camera Rig & Virtual Joystick) untuk Mode Mikro
  ○ Definisi: Memindahkan Camera Rig ke dalam model 3D tanpa mematikan sesi WebXR, di mana rotasi kepala pengguna dilacak secara fisik (6-DoF), sementara translasi/langkah disimulasikan menggunakan Virtual Joystick di layar.
  ○ Alasan Pemilihan: Memberikan pengalaman "masuk ke dalam ruangan" yang bebas mual (karena tracking kepala fisik tetap menyala) tanpa memerlukan headset VR.

2.2 Skenario Penggunaan (User Flow - Konsep Studio Assembler)
1. Scan Gateway (URL Routing): Pengguna memindai salah satu dari QR Code spesifik (misal: QR Varian 0, 1, atau 2). Browser membuka WebAR dan JavaScript otomatis membaca parameter URL untuk memuat model glTF yang sesuai di background (menghemat RAM).
2. Scan & Place (Mode Makro): Pengguna mengarahkan kamera ke lantai, tap layar (Hit-Test) untuk memunculkan model 3D bangunan.
3. Physical Walkaround: Pengguna berjalan mengelilingi model 3D yang tertanam di lantai secara fisik. VIO memastikan model tetap diam di tempat (zero-drifting).
4. Portal Transition: Pengguna menekan tombol "Masuk Ruangan" pada UI Web.
5. Immersive Walkthrough (Mode Mikro): Layar bertransisi dengan mulus. Sesi WebXR tetap menyala. Camera Rig diteleportasi ke dalam ruangan model 3D. Pengguna dapat menggunakan Virtual Joystick untuk berjalan mengelilingi interior sambil menoleh secara fisik layaknya tur nyata.
6. Exit: Pengguna menekan tombol "Keluar" merah untuk kembali ke pengaturan awal AR Makro, memungkinkan mereka menempatkan ulang posisi maket di dunia nyata.

---

BAB 3
RANCANGAN TEKNIS DAN SISTEM

3.1 Spesifikasi Perangkat Keras
● Platform Target: Smartphone dengan browser modern (Chrome/Safari) yang mendukung WebXR API.
● Sensor Spasial: Kamera dan Depth Sensor (untuk AR Plane Tracking) serta IMU (untuk pelacakan kepala 6-DoF).
● Lingkungan Testing (Zero-Budget): Laptop/PC, dibantu oleh WebXR API Emulator untuk simulasi logika, dan Cloudflare Tunneling untuk bridging HTTPS ke HP.

3.2 Spesifikasi Perangkat Lunak
● IDE: Antigravity IDE / VS Code (Untuk pengembangan HTML, CSS, JS, dan manajemen Local Server).
● Web 3D Engine: Three.js (Untuk manajemen Scene, GLTFLoader, dan Camera State Machine).
● Framework AR: WebXR Device API (Hit-Test & Camera Rigging).
● Bahasa Pemrograman: JavaScript (ES6+), HTML5, CSS3.
● Format Aset: glTF / GLB.
● Infrastruktur Testing & Deploy: Local Server (Live Server) + HTTPS Tunneling (Cloudflare) untuk testing, dan GitHub Pages untuk server publik produksi secara gratis.

3.3 Arsitektur Sistem AR (Camera State Machine & URL Routing)
Sistem dirancang dengan arsitektur ringan berbasis web:
1. URL Routing Layer: Membaca `URLSearchParams` dari browser saat QR di-scan untuk menentukan model glTF mana yang akan di-instantiate.
2. State AR (Exterior / Makro):
   ○ renderer.xr.enabled = true
   ○ Camera Rig berada di pusat dunia (0,0,0). Kamera murni dikendalikan oleh pelacakan fisik pengguna di dunia nyata (WebXR).
3. State Interior (First-Person / Mikro):
   ○ renderer.xr.enabled = true (Tracking AR WebXR tetap dipertahankan untuk mencegah screen-freeze).
   ○ Camera Rig (pembungkus kamera) dipindahkan ke koordinat spawn di dalam model GLTF, terskala secara otomatis.
   ○ Gerakan pergeseran kamera (maju/mundur/kiri/kanan) ditangani secara programatik lewat input Virtual Joystick.

---

BAB 4
RANCANGAN INTERAKSI DAN UI/UX WEB

Tampilan web menggunakan DOM Overlay (HTML/CSS) yang beradaptasi berdasarkan State aplikasi:

4.1 State 1: AR Viewport (Makro)
● Tampilan: Feed kamera dunia nyata dengan model 3D di lantai.
● UI Overlay:
  ○ Reticle (Indikator penempatan di lantai berbentuk cincin).
  ○ Tombol Aksi: "Pindah Maket" dan "Masuk Ruangan" (Hanya muncul setelah model ditempatkan).
  ○ Instruksi Visual: Panduan status sistem.

4.2 State 2: Interior Viewport (Mikro)
● Tampilan: Render lingkungan 3D murni dari dalam model (feed kamera disembunyikan/digantikan oleh langit buatan dan interior ruangan).
● UI Overlay:
  ○ Virtual Joystick (nipple.js): Muncul di sebelah kiri bawah untuk mengontrol arah berjalan.
  ○ Tombol "Kembali ke AR" & Tombol "Keluar" (Merah): Untuk navigasi antar-state.
  ○ Pop-up Info: Informasi varian model yang sedang diamati.

4.3 Metode Interaksi
● Tap to Place: Menempatkan maket di lantai via Hit-Test.
● Physical Walkaround: Berjalan fisik mengelilingi maket (AR Mode).
● 6-DoF Look-Around & Joystick Walk: Menolehkan kepala/HP secara fisik untuk meninjau ruangan (difasilitasi WebXR) dan menggeser jempol pada Joystick untuk melangkah secara virtual (Mode Interior).

---

BAB 5
RENCANA PENGEMBANGAN

5.1 Daftar Kebutuhan Aset
| Kategori | Nama Aset | Fungsi | Sumber / Format |
| --- | --- | --- | --- |
| Model 3D | Aset 1: Modern House | Representasi volumetrik dan tata ruang. | File Lokal (.glb) - Sudah Tersedia |
| Model 3D | Aset 2: Modular House | Representasi desain fasad berbeda. | File Lokal (.glb) - Sudah Tersedia |
| Model 3D | Aset 3: Konsep Lanskap Tapak | Representasi integrasi bangunan & lahan. | File Lokal (.glb) - Tersedia via Varian |
| Gateway | QR Code Unik (URL Params) | Trigger pemuatan model spesifik via URL. | Python Script QR Generator |
| UI/UX | Web DOM Elements & Joystick | HUD AR, Tombol Transisi, Virtual Joystick. | HTML5 / CSS3 / nipple.js |

5.2 Jadwal Kerja (Timeline Berbasis Fase)
| Tahapan Pengembangan | Fase 1: Setup Web & Aset | Fase 2: AR Plane Tracking | Fase 3: Camera State & UI | Fase 4: Testing & Deploy |
| --- | :---: | :---: | :---: | :---: |
| Inisialisasi Project di Antigravity IDE & Setup Three.js. | ✔ | | | |
| Setup URL Routing & Preload Aset glTF. | ✔ | | | |
| Implementasi WebXR Hit-Test (Tap to Place). | | ✔ | | |
| Coding HTML/CSS untuk HUD dan Integrasi Virtual Joystick. | | | ✔ | |
| Logika JS: Camera State Machine (Camera Rig Makro-Mikro). | | | ✔ | |
| QA: Uji coba transisi ruangan mulus via Cloudflare Tunnel. | | | | ✔ |
| Finalisasi & Deployment akhir ke GitHub Pages. | | | | ✔ |

5.3 Pembagian Tugas Tim
| Nama | Peran | Tugas |
| --- | --- | --- |
| Achmed Bintang Asy-Syfa M. | WebXR & Three.js Dev | Setup WebXR Hit-Test, VIO Tracking, dan logika Transisi Camera Rig Makro ke Mikro. |
| Awaludin | Web UI/UX Frontend | Coding HTML/CSS untuk HUD, tombol-tombol interaktif, dan integrasi library Virtual Joystick. |
| Muhamad Imam Hakim | Asset & Logic Optimizer | Setup URL Routing (Parameter), Auto-Scaling aset glTF, dan infrastruktur Cloudflare/GitHub Pages. |

---

BAB 6
PENUTUP

6.1 Kesimpulan
● Transisi Spasial Makro-Mikro: Proyek ini berhasil mengimplementasikan alur evaluasi desain yang komprehensif, memungkinkan pengguna menganalisis massa bangunan dari luar (AR) dan meninjau tata ruang dari dalam (First-Person VR) dalam satu aplikasi web yang ringan.
● Keunggulan Arsitektur Camera Rig: Tidak seperti aplikasi AR web standar, mempertahankan WebXR session tetap menyala saat di dalam ruangan dengan menggunakan pembungkus Camera Rig berhasil mencegah lag dan memberikan pengalaman navigasi hybrid (fisik + virtual) yang sangat mulus tanpa screen-freeze.
● Optimasi Memori via URL Routing: Penggunaan QR Code terpisah yang memicu parameter URL membuktikan pendekatan cerdas dalam manajemen memori browser mobile, mencegah crash akibat pemuatan aset 3D ganda.
● Zero-Budget Development: Pemanfaatan VS Code, Local Server, WebXR Emulator, Cloudflare Tunneling, dan GitHub Pages membuktikan bahwa pengembangan dan perilisan proyek WebXR skala penuh dapat dilakukan tanpa biaya infrastruktur server sama sekali.

6.2 Rencana Pengembangan Lanjutan
● Batas Ruangan Fisis (Bounding Box): Menambahkan sistem kolisi sederhana agar pergerakan Virtual Joystick tidak bisa menembus area luar dari luas bangunan.
● Interactive Hotspots: Menambahkan titik klik (raycasting) di dalam Mode Interior untuk membuka detail material atau spesifikasi furnitur.
● Multiplayer Tour: Mengintegrasikan WebRTC agar dua pengguna dapat masuk ke dalam "ruangan" virtual yang sama secara bersamaan dari perangkat yang berbeda.
