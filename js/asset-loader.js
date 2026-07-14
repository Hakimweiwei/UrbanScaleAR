// MOD-003: Asset Loader
// Bertugas memuat file glTF/glb dari URL yang diberikan

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as THREE from 'three';

export class AssetLoader {
    constructor() {
        this.loader = new GLTFLoader();
        
        // Opsional: Setup DRACO Loader jika model dikompresi
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://unpkg.com/three@0.160.0/examples/jsm/libs/draco/');
        this.loader.setDRACOLoader(dracoLoader);
    }

    /**
     * Memuat model 3D berdasarkan konfigurasi varian
     * @param {Object} variantConfig - Objek konfigurasi dari variant-config.js
     * @param {Function} onProgress - Callback untuk progress (0-100)
     * @returns {Promise<THREE.Group>} - Promise yang me-resolve ke Three.js Group dari model
     */
    loadVariant(variantConfig, onProgress) {
        return new Promise((resolve, reject) => {
            console.log(`[Asset Loader] Memuat model dari ${variantConfig.url}...`);
            
            this.loader.load(
                variantConfig.url,
                (gltf) => {
                    const model = gltf.scene;
                    
                    // --- NORMALISASI MODEL (Auto-Scale & Auto-Center) ---
                    // Hitung Bounding Box dari model asli
                    const box = new THREE.Box3().setFromObject(model);
                    const size = new THREE.Vector3();
                    const center = new THREE.Vector3();
                    box.getSize(size);
                    box.getCenter(center);
                    
                    // 1. Pindahkan model agar titik tengah bawahnya (lantai) berada di (0,0,0)
                    model.position.x = -center.x;
                    model.position.y = -box.min.y; // Pastikan rata dengan lantai
                    model.position.z = -center.z;
                    
                    // 2. Bungkus ke dalam sebuah Wrapper Group
                    const wrapper = new THREE.Group();
                    wrapper.add(model);
                    
                    // 3. Hitung dimensi maksimal (panjang, lebar, atau tinggi)
                    const maxDim = Math.max(size.x, size.y, size.z);
                    
                    // 4. Skala target: Kita ingin ukuran maksimal model di atas meja adalah 2 meter (2.0 unit)
                    const targetSize = 2.0;
                    const normalizedScale = targetSize / maxDim;
                    
                    // Terapkan skala yang sudah dinormalisasi
                    wrapper.scale.set(normalizedScale, normalizedScale, normalizedScale);
                    
                    // Simpan normalizedScale agar bisa dipakai oleh app-state.js nanti
                    wrapper.userData.originalScale = normalizedScale;
                    // Simpan dimensi asli agar app-state tau ukuran sebenarnya
                    wrapper.userData.realSize = size;
                    
                    console.log(`[Asset Loader] Berhasil memuat: ${variantConfig.name}. Skala disesuaikan menjadi ${normalizedScale.toFixed(5)}`);
                    resolve(wrapper);
                },
                (xhr) => {
                    if (onProgress && xhr.total > 0) {
                        const percent = Math.round((xhr.loaded / xhr.total) * 100);
                        onProgress(percent);
                    }
                },
                (error) => {
                    console.error(`[Asset Loader] Gagal memuat model:`, error);
                    reject(error);
                }
            );
        });
    }
}
