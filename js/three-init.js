// MOD-001: Three.js Init
// Bertugas mengatur Scene, Camera, Renderer, dan pencahayaan awal

import * as THREE from 'three';

export class ThreeSetup {
    constructor() {
        // 1. Scene
        this.scene = new THREE.Scene();

        // 2. Camera
        this.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.01,
            20
        );
        // Default posisi kamera
        this.camera.position.set(0, 1.6, 3); // Tinggi rata-rata manusia 1.6m
        
        // MOD-011: WebXR Camera Rig
        // Agar bisa bergerak bebas di dalam VR sambil mempertahankan tracking WebXR
        this.cameraRig = new THREE.Group();
        this.cameraRig.add(this.camera);
        this.scene.add(this.cameraRig);

        // 3. Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true // Transparan agar kamera dunia nyata (WebXR) bisa terlihat
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.xr.enabled = true; // Siap untuk WebXR

        // Masukkan canvas ke dalam body
        document.body.appendChild(this.renderer.domElement);

        // 4. Pencahayaan
        this.setupLights();

        // 5. Handle Resize
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }

    setupLights() {
        // Hemisphere Light (Cahaya ambient dari langit dan pantulan tanah)
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 2.5); // Diperterang
        hemiLight.position.set(0.5, 1, 0.25);
        this.scene.add(hemiLight);

        // Directional Light (Cahaya matahari)
        const dirLight = new THREE.DirectionalLight(0xffffff, 2.0); // Diperterang
        dirLight.position.set(0, 5, 0);
        this.scene.add(dirLight);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Dipanggil setiap frame
    render() {
        this.renderer.render(this.scene, this.camera);
    }
}
