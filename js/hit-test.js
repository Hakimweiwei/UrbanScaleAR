// MOD-005: WebXR Hit-Test & Reticle
// Bertugas mendeteksi permukaan dunia nyata dan menampilkan kursor (reticle)

import * as THREE from 'three';

export class HitTestController {
    constructor(scene, renderer) {
        this.scene = scene;
        this.renderer = renderer;

        // Controller untuk mendeteksi Tap layar
        this.controller = this.renderer.xr.getController(0);
        this.scene.add(this.controller);

        this.hitTestSource = null;
        this.hitTestSourceRequested = false;

        this.createReticle();
    }

    createReticle() {
        // Buat geometry cincin sebagai reticle (kursor)
        const geometry = new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00, 
            transparent: true,
            opacity: 0.8
        });
        this.reticle = new THREE.Mesh(geometry, material);
        
        // Reticle awalnya tidak terlihat sampai lantai terdeteksi
        this.reticle.matrixAutoUpdate = false;
        this.reticle.visible = false;
        
        this.scene.add(this.reticle);
    }

    // Dipanggil setiap frame (di dalam loop animasi utama)
    update(frame, referenceSpace) {
        if (!frame) return;

        // 1. Meminta sumber hit-test jika belum ada
        if (!this.hitTestSourceRequested) {
            const session = this.renderer.xr.getSession();
            if (session) {
                session.requestReferenceSpace('viewer').then((viewerSpace) => {
                    session.requestHitTestSource({ space: viewerSpace }).then((source) => {
                        this.hitTestSource = source;
                    });
                });
                session.addEventListener('end', () => {
                    this.hitTestSourceRequested = false;
                    this.hitTestSource = null;
                });
                this.hitTestSourceRequested = true;
            }
        }

        // 2. Mengeksekusi hit-test
        if (this.hitTestSource) {
            const hitTestResults = frame.getHitTestResults(this.hitTestSource);

            if (hitTestResults.length > 0) {
                // Lantai terdeteksi
                const hit = hitTestResults[0];
                const hitPose = hit.getPose(referenceSpace);
                
                this.reticle.visible = true;
                this.reticle.matrix.fromArray(hitPose.transform.matrix);
            } else {
                // Tidak ada permukaan terdeteksi
                this.reticle.visible = false;
            }
        }
    }
    
    // Fungsi untuk mendaftarkan aksi saat layar di-tap (onSelect)
    onSelect(callback) {
        this.controller.addEventListener('select', () => {
            if (this.reticle.visible) {
                // Kembalikan matriks transformasi reticle saat ini
                callback(this.reticle.matrix);
            }
        });
    }
}
