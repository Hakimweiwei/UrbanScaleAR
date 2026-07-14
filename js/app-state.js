// MOD-007: App State Machine
// Mengelola status aplikasi (MAKRO vs MIKRO) dan perpindahan kamera

import * as THREE from 'three';

export const STATES = {
    MAKRO: 'MAKRO', // Di luar ruangan, AR aktif
    MIKRO: 'MIKRO'  // Di dalam ruangan, AR mati, Giroskop aktif
};

export class AppState {
    constructor(camera, scene, domOverlay) {
        this.currentState = STATES.MAKRO;
        
        this.camera = camera;
        this.scene = scene;
        this.domOverlay = domOverlay;
        
        // Simpan posisi awal kamera AR (dunia nyata) agar bisa kembali
        this.makroCameraMatrix = null;
    }

    /**
     * Masuk ke Mode MIKRO (Interior)
     * @param {THREE.Group} model - Model 3D yang sedang aktif
     * @param {Object} spawnConfig - Posisi {x,y,z} tempat pengguna harus berdiri di dalam model
     */
    enterMikro(model, spawnConfig, cameraRig) {
        console.log("[App State] Transisi ke MIKRO...");
        this.currentState = STATES.MIKRO;

        // 1. Simpan matriks kamera saat ini sebelum dipindah
        this.makroCameraMatrix = this.camera.matrixWorld.clone();

        // 2. TIDAK LAGI MEMATIKAN AR SESSION!
        // Pindahkan cameraRig ke dalam model (spawnPoint)
        
        // Hitung kordinat absolut berdasarkan posisi model yang diletakkan di lantai
        // (x, y, z lokal model diubah ke koordinat dunia)
        
        // Karena semua model sudah dinormalisasi menjadi ukuran 50cm di asset-loader,
        // tinggi mata (kamera) di dalam ruangan mini (diorama 50cm) harus sebanding.
        // Asumsikan tinggi rumah 50cm, maka tinggi mata manusia adalah sekitar 15cm dari lantai.
        
        // Sesuaikan near clipping plane menjadi sangat kecil (0.001) agar dinding tidak tembus/hilang (layar hitam)
        this.camera.near = 0.001;
        this.camera.updateProjectionMatrix();

        // Hitung Bounding Box dari model yang sudah dinormalisasi untuk mengetahui tinggi aktualnya di dunia
        const box = new THREE.Box3().setFromObject(model);
        const actualHeight = box.max.y - box.min.y;
        
        // Tinggi mata (kamera) adalah sekitar 30% dari tinggi total rumah (asumsi lantai 1)
        // Ini mencegah kita terdampar di atas atap jika rumahnya lebar tapi ceper.
        const eyeHeight = actualHeight * 0.3;
        
        // Ambil posisi dan rotasi model di dunia nyata
        const modelPos = new THREE.Vector3();
        const modelQuat = new THREE.Quaternion();
        const modelScale = new THREE.Vector3();
        model.matrixWorld.decompose(modelPos, modelQuat, modelScale);
        
        // Asumsi normalizedScale adalah scale seragam di X, Y, Z
        const normalizedScale = modelScale.x; 

        // Terapkan spawnConfig yang ada di config (dikali dengan skala maket)
        // Kita juga perlu memutar offset berdasarkan rotasi model di dunia nyata
        const localOffset = new THREE.Vector3(
            (spawnConfig.x || 0) * normalizedScale,
            0,
            (spawnConfig.z || 0) * normalizedScale
        );
        localOffset.applyQuaternion(modelQuat); // Putar offset sesuai hadap model
        
        const spawnX = modelPos.x + localOffset.x;
        const spawnY = modelPos.y + eyeHeight;
        const spawnZ = modelPos.z + localOffset.z;
        
        cameraRig.position.set(spawnX, spawnY, spawnZ);
        
        // Putar cameraRig agar menghadap sama dengan rotasi maket
        cameraRig.quaternion.copy(modelQuat);
        
        // 4. Update UI
        this.domOverlay.onStateMikro();
        
        // Tambahkan background color agar tidak gelap gulita jika melihat ke luar jendela
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
    }

    /**
     * Kembali ke Mode MAKRO (Eksterior/AR)
     */
    enterMakro(cameraRig) {
        console.log("[App State] Transisi ke MAKRO...");
        this.currentState = STATES.MAKRO;

        // Kembalikan cameraRig ke pusat dunia WebXR
        if (cameraRig) {
            cameraRig.position.set(0, 0, 0);
            cameraRig.rotation.set(0, 0, 0);
        }

        // Kembalikan clipping plane ke standar
        this.camera.near = 0.1;
        this.camera.updateProjectionMatrix();
        
        // Hapus background color (transparan untuk AR)
        this.scene.background = null;

        // 4. Update UI
        this.domOverlay.onStateMakro();
        this.domOverlay.showStatus("Ketuk 'Mulai AR' lagi untuk meletakkan ulang atau melihat dari luar.");
    }
}
