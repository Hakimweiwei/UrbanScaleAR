// MOD-004: AR Session Controller
// Mengelola transisi masuk dan keluar dari WebXR Immersive-AR session

export class ARSessionController {
    constructor(renderer, onSessionStart, onSessionEnd) {
        this.renderer = renderer;
        this.onSessionStart = onSessionStart;
        this.onSessionEnd = onSessionEnd;
        this.currentSession = null;

        this.btnStart = document.getElementById('btn-start-ar');
        this.checkARSupport();
    }

    async checkARSupport() {
        if ('xr' in navigator) {
            try {
                const isSupported = await navigator.xr.isSessionSupported('immersive-ar');
                if (isSupported) {
                    this.btnStart.innerText = "Mulai AR";
                    this.btnStart.addEventListener('click', this.startAR.bind(this));
                } else {
                    this.disableButton("AR Tidak Didukung");
                }
            } catch (error) {
                this.disableButton("Error Cek AR");
                console.error("[AR Session] Gagal mengecek dukungan AR:", error);
            }
        } else {
            this.disableButton("WebXR Tidak Didukung");
        }
    }

    disableButton(text) {
        this.btnStart.innerText = text;
        this.btnStart.disabled = true;
        this.btnStart.style.backgroundColor = '#ccc';
        this.btnStart.style.cursor = 'not-allowed';
        
        // Tampilkan error banner (Fase 4)
        const errorBanner = document.getElementById('error-banner');
        if (errorBanner) {
            errorBanner.classList.remove('hidden');
            // Pastikan overlay terlihat
            document.getElementById('ar-overlay').classList.remove('hidden');
        }
    }

    async startAR() {
        if (this.currentSession) return;

        try {
            const session = await navigator.xr.requestSession('immersive-ar', {
                requiredFeatures: ['hit-test', 'dom-overlay'],
                domOverlay: { root: document.getElementById('ar-overlay') }
            });

            this.onSessionStarted(session);
        } catch (error) {
            console.error("[AR Session] Gagal memulai sesi AR:", error);
            alert("Gagal memulai AR: " + error.message);
        }
    }

    onSessionStarted(session) {
        this.currentSession = session;
        this.btnStart.classList.add('hidden'); // Sembunyikan tombol mulai AR

        session.addEventListener('end', this.onSessionEnded.bind(this));
        
        // Setup WebGL context for WebXR
        this.renderer.xr.setReferenceSpaceType('local');
        this.renderer.xr.setSession(session);

        if (this.onSessionStart) this.onSessionStart(session);
    }

    onSessionEnded() {
        this.currentSession = null;
        // Jangan tampilkan tombol di sini, biarkan main.js dan dom-overlay.js yang mengatur
        // visibilitas tombol berdasarkan state aplikasi.

        if (this.onSessionEnd) this.onSessionEnd();
    }
}
