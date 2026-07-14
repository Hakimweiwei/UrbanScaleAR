// Entry Point Aplikasi Utama (Fase 3: Camera State & UI)
alert("main.js mulai dimuat!");

import { getVariantFromURL } from './url-router.js';
import { AssetLoader } from './asset-loader.js';
import { ThreeSetup } from './three-init.js';
import { ARSessionController } from './ar-session.js';
import { HitTestController } from './hit-test.js';
import { DOMOverlay } from './dom-overlay.js';
import { AppState, STATES } from './app-state.js';
import { Joystick } from './joystick.js';
import * as THREE from 'three';

class App {
    constructor() {
        console.log("[App] Inisialisasi Fase 3...");

        this.variantConfig = getVariantFromURL();
        
        // 1. Setup UI DOM Overlay
        this.domOverlay = new DOMOverlay();
        
        // 2. Setup Joystick
        this.joystick = new Joystick('joystick-zone');
        
        // 3. Setup Inti Three.js
        this.threeSetup = new ThreeSetup();
        this.domOverlay.showStatus(`Memuat ${this.variantConfig.name}...`, 0);

        // 4. Setup Sesi AR
        this.arSession = new ARSessionController(
            this.threeSetup.renderer,
            (session) => this.onARStart(session),
            () => this.onAREnd()
        );

        // 5. Setup Hit-Test (Kursor Lantai)
        this.hitTest = new HitTestController(this.threeSetup.scene, this.threeSetup.renderer);
        this.hitTest.onSelect((reticleMatrix) => this.placeModel(reticleMatrix));

        // 6. Setup State Machine
        this.appState = new AppState(this.threeSetup.camera, this.threeSetup.scene, this.domOverlay);
        
        // 7. Event Listeners UI
        this.domOverlay.btnEnterRoom.addEventListener('click', () => this.onEnterRoomClick());
        this.domOverlay.btnExitRoom.addEventListener('click', () => this.onExitRoomClick());
        this.domOverlay.btnReposition.addEventListener('click', () => this.onRepositionClick());
        this.domOverlay.btnBackAR.addEventListener('click', () => this.onBackARClick());

        // Variabel Mode
        this.loadedModel = null;
        this.isModelPlaced = false;

        this.init();
    }

    async init() {
        try {
            const assetLoader = new AssetLoader();
            this.loadedModel = await assetLoader.loadVariant(
                this.variantConfig,
                (percent) => { this.domOverlay.showStatus(`Memuat ${this.variantConfig.name}... ${percent}%`, 0); }
            );

            this.threeSetup.scene.add(this.loadedModel);
            this.loadedModel.visible = false;
            
            this.domOverlay.showStatus("Model siap! Ketuk 'Mulai AR'");

            // Mulai Render Loop
            this.threeSetup.renderer.setAnimationLoop((timestamp, frame) => this.animate(timestamp, frame));
        } catch (error) {
            console.error("[App] Gagal memuat model:", error);
            this.domOverlay.showStatus("Gagal memuat model.", 0);
        }
    }

    onARStart(session) {
        console.log("[App] AR Session Dimulai");
        
        // Transisi state ke MAKRO setiap kali AR dimulai
        this.appState.enterMakro(this.threeSetup.cameraRig);
        this.domOverlay.onARStarted();
        
        if (!this.isModelPlaced) {
            this.domOverlay.showStatus("Arahkan kamera ke lantai dan gerakkan perlahan...", 0);
        }
    }

    onAREnd() {
        console.log("[App] AR Session Diakhiri");
        this.domOverlay.showStatus("", 0); // Sembunyikan status
        
        // Jika AR berakhir namun status bukan MIKRO, artinya user keluar manual dari AR (via sistem)
        if (this.appState.currentState !== STATES.MIKRO) {
            this.resetToIdle();
        }
    }

    resetToIdle() {
        this.isModelPlaced = false;
        if (this.loadedModel) {
            this.loadedModel.visible = false;
        }
        this.appState.currentState = STATES.IDLE;
        this.domOverlay.onResetToIdle();
        
        // Reset posisi kamera agar tidak freeze menatap ruang kosong
        this.threeSetup.camera.position.set(0, 0, 0);
        this.threeSetup.camera.rotation.set(0, 0, 0);
        this.threeSetup.scene.background = null;
    }

    placeModel(matrix) {
        if (!this.loadedModel || this.isModelPlaced) return;

        // Ekstrak posisi dan rotasi dari reticle, JANGAN copy matrix langsung karena akan mereset Scale!
        const position = new THREE.Vector3();
        const rotation = new THREE.Quaternion();
        const dummyScale = new THREE.Vector3();
        matrix.decompose(position, rotation, dummyScale);
        
        this.loadedModel.position.copy(position);
        this.loadedModel.quaternion.copy(rotation);
        
        this.loadedModel.matrixAutoUpdate = true; // Biarkan Three.js menghitung matrix dari pos/rot/scale
        this.loadedModel.updateMatrixWorld(true);
        this.loadedModel.visible = true;
        this.isModelPlaced = true;
        
        this.hitTest.reticle.visible = false;
        
        this.domOverlay.showStatus("Model diletakkan!");
        this.domOverlay.onModelPlaced(); // Memunculkan tombol Masuk Ruangan
    }

    onEnterRoomClick() {
        // Transisi ke MIKRO tanpa mematikan WebXR
        this.appState.enterMikro(this.loadedModel, this.variantConfig.spawnPoint, this.threeSetup.cameraRig);
        
        // Aktifkan Joystick
        this.joystick.show();
    }

    onBackARClick() {
        // Matikan Joystick
        this.joystick.hide();
        
        // Transisi kembali ke MAKRO (di dunia nyata)
        this.appState.enterMakro(this.threeSetup.cameraRig);
    }

    onExitRoomClick() {
        // Keluar dari AR sepenuhnya
        this.joystick.hide();
        
        if (this.arSession.currentSession) {
            this.arSession.currentSession.end();
        }
        
        this.resetToIdle();
    }
    
    onRepositionClick() {
        // Sembunyikan model saat ini, jangan hapus dari scene
        if (this.loadedModel) {
            this.loadedModel.visible = false;
        }
        this.isModelPlaced = false;
        
        // Update UI untuk kembali ke state awal peletakan
        this.domOverlay.onRepositionStarted();
        this.domOverlay.showStatus("Arahkan kamera ke lantai baru dan ketuk layar.");
    }

    animate(timestamp, frame) {
        // 1. Logika Update berdasarkan State
        if (this.appState.currentState === STATES.MAKRO) {
            // Update Hit-Test (AR Mode)
            if (this.arSession.currentSession && !this.isModelPlaced) {
                const referenceSpace = this.threeSetup.renderer.xr.getReferenceSpace();
                this.hitTest.update(frame, referenceSpace);
            }
        } else if (this.appState.currentState === STATES.MIKRO) {
            if (this.joystick && this.joystick.isActive) {
                const vector = this.joystick.getVector();
                // Sensitivitas gerak virtual
                const moveSpeed = 0.05;
                
                // Dapatkan arah hadap kamera saat ini di dunia nyata
                const forward = new THREE.Vector3();
                this.threeSetup.camera.getWorldDirection(forward);
                
                // Pastikan kita hanya bergerak di bidang datar (X-Z)
                forward.y = 0; 
                forward.normalize();
                
                // Hitung arah kanan
                const right = new THREE.Vector3();
                right.crossVectors(forward, this.threeSetup.camera.up).normalize();
                
                // Terapkan translasi pada RIG, bukan kameranya
                this.threeSetup.cameraRig.position.addScaledVector(forward, -vector.y * moveSpeed);
                this.threeSetup.cameraRig.position.addScaledVector(right, vector.x * moveSpeed);
            }
        }

        // 2. Render
        this.threeSetup.render();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
