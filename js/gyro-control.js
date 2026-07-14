// MOD-008: Gyroscope Control
// Mengontrol rotasi kamera menggunakan sensor DeviceOrientation (Giroskop)

import { DeviceOrientationControls } from './DeviceOrientationControls.js';

export class GyroControl {
    constructor(camera) {
        this.camera = camera;
        this.controls = null;
        this.isActive = false;
        this.isSupported = true; // Asumsi true sampai gagal
    }

    /**
     * Meminta izin (khusus iOS 13+) dan mengaktifkan kontrol giroskop
     * Fungsi ini harus dipanggil akibat dari User Gesture (klik tombol)
     */
    async enable() {
        if (this.isActive) return;

        try {
            // Cek kebutuhan Permission (iOS 13+)
            if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                const permissionState = await DeviceOrientationEvent.requestPermission();
                if (permissionState !== 'granted') {
                    console.warn("[Gyro Control] Izin giroskop ditolak oleh pengguna.");
                    this.isSupported = false;
                    return;
                }
            }
            
            // Jika izin diberikan atau tidak butuh izin (Android/PC)
            if (!this.controls) {
                this.controls = new DeviceOrientationControls(this.camera);
            }
            
            this.controls.enabled = true;
            this.controls.connect();
            this.isActive = true;
            console.log("[Gyro Control] Giroskop aktif.");
            
        } catch (error) {
            console.error("[Gyro Control] Gagal mengaktifkan giroskop:", error);
            this.isSupported = false;
        }
    }

    disable() {
        if (!this.isActive) return;
        
        if (this.controls) {
            this.controls.enabled = false;
            this.controls.disconnect();
        }
        this.isActive = false;
        console.log("[Gyro Control] Giroskop dinonaktifkan.");
    }

    // Dipanggil setiap frame pada render loop jika State = MIKRO
    update() {
        if (this.isActive && this.controls) {
            this.controls.update();
        }
    }
}
