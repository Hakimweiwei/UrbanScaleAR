// MOD-013: Variant Configuration
// Menyimpan metadata dan path aset untuk setiap varian ruangan

export const variants = {
    '0': {
        id: '0',
        name: 'Varian 0 - Bad Room',
        url: './assets/models/rumah.glb',
        scale: 0.005, // Diperkecil lagi jadi ukuran maket meja
        spawnPoint: { x: 0, y: 1.6, z: 0 },
        metadata: {
            luas: 'Kecil',
            material: 'Standar'
        }
    },
    '1': {
        id: '1',
        name: 'Varian 1 - Modular House',
        url: './assets/models/modular_house/scene.gltf',
        scale: 0.005, // Diperkecil lagi jadi ukuran maket meja
        spawnPoint: { x: 0, y: 1.6, z: 0 },
        metadata: {
            luas: 'Menengah',
            material: 'Kayu & Besi'
        }
    },
    '2': {
        id: '2',
        name: 'Varian 2 - Modern House',
        url: './assets/models/modern_house/scene.gltf',
        scale: 0.005, // Diperkecil lagi jadi ukuran maket meja
        spawnPoint: { x: 0, y: 1.6, z: 0 },
        metadata: {
            luas: 'Sangat Besar',
            material: 'Beton & Kaca'
        }
    },
    '3': {
        id: '3',
        name: 'Varian 3 - Vianney House 2',
        url: './assets/vianney_house_2/scene.gltf',
        scale: 1.0, // Scale doesn't matter anymore due to auto-scale
        spawnPoint: { x: 0, y: 1.6, z: 0 },
        metadata: {
            luas: 'Menengah',
            material: 'Bata & Kayu'
        }
    }
};

export const DEFAULT_VARIANT = '0';
