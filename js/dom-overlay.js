// MOD-006: DOM Overlay Controller
// Mengelola visibilitas elemen UI HTML

export class DOMOverlay {
    constructor() {
        this.btnStartAR = document.getElementById('btn-start-ar');
        this.btnEnterRoom = document.getElementById('btn-enter-room');
        this.btnExitRoom = document.getElementById('btn-exit-room');
        this.btnReposition = document.getElementById('btn-reposition');
        this.btnBackAR = document.getElementById('btn-back-ar');
        this.crosshair = document.getElementById('crosshair');
        this.statusText = document.getElementById('status-text');
    }

    showStatus(message, duration = 3000) {
        this.statusText.innerText = message;
        this.statusText.classList.remove('hidden');
        if (duration > 0) {
            setTimeout(() => {
                this.statusText.classList.add('hidden');
            }, duration);
        }
    }

    onARStarted() {
        this.btnStartAR.classList.add('hidden');
    }

    onModelPlaced() {
        // Tampilkan tombol masuk ruangan dan pindah maket setelah model diletakkan
        this.btnEnterRoom.classList.remove('hidden');
        this.btnReposition.classList.remove('hidden');
    }

    onStateMikro() {
        // Saat masuk ruangan (MIKRO)
        this.btnStartAR.classList.add('hidden'); // Paksa sembunyikan jika event onSessionEnded mencoba memunculkannya
        this.btnEnterRoom.classList.add('hidden');
        this.btnReposition.classList.add('hidden');
        this.btnBackAR.classList.remove('hidden');
        this.btnExitRoom.classList.remove('hidden');
        this.crosshair.classList.remove('hidden'); // Crosshair gaya FPV
    }

    onStateMakro() {
        // Saat kembali ke luar (MAKRO)
        this.btnBackAR.classList.add('hidden');
        this.btnExitRoom.classList.add('hidden');
        this.crosshair.classList.add('hidden');
        
        // Asumsikan model sudah diletakkan jika kita kembali ke Makro
        this.btnEnterRoom.classList.remove('hidden');
        this.btnReposition.classList.remove('hidden');
    }
    
    onRepositionStarted() {
        this.btnEnterRoom.classList.add('hidden');
        this.btnReposition.classList.add('hidden');
    }
    
    onResetToIdle() {
        this.btnStartAR.classList.remove('hidden');
        this.btnEnterRoom.classList.add('hidden');
        this.btnReposition.classList.add('hidden');
        this.btnBackAR.classList.add('hidden');
        this.btnExitRoom.classList.add('hidden');
        this.crosshair.classList.add('hidden');
        this.showStatus("AR dihentikan. Klik Mulai AR untuk meletakkan maket kembali.", 0);
    }
}
