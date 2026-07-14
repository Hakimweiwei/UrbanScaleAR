// MOD-010: Virtual Joystick
// Mengelola input joystick sentuh untuk berjalan di mode MIKRO

export class Joystick {
    constructor(zoneElementId) {
        this.zone = document.getElementById(zoneElementId);
        
        // Buat elemen visual joystick
        this.joystickBase = document.createElement('div');
        this.joystickBase.id = 'joystick-base';
        
        this.joystickKnob = document.createElement('div');
        this.joystickKnob.id = 'joystick-knob';
        
        this.joystickBase.appendChild(this.joystickKnob);
        this.zone.appendChild(this.joystickBase);
        
        this.active = false;
        this.baseX = 0;
        this.baseY = 0;
        this.maxRadius = 40; // Maksimum radius joystick ditarik
        
        // Output dari joystick (-1 sampai 1)
        this.deltaX = 0; 
        this.deltaY = 0;
        
        this.initEvents();
    }
    
    initEvents() {
        this.zone.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        this.zone.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        this.zone.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: false });
        this.zone.addEventListener('touchcancel', this.onTouchEnd.bind(this), { passive: false });
        
        // Mouse fallback untuk testing di PC
        this.zone.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
    }
    
    show() {
        this.zone.classList.remove('hidden');
    }
    
    hide() {
        this.zone.classList.add('hidden');
        this.reset();
    }
    
    updateBasePosition(x, y) {
        this.baseX = x;
        this.baseY = y;
        this.joystickBase.style.left = (x - 50) + 'px'; // 50 adalah setengah ukuran base
        this.joystickBase.style.top = (y - 50) + 'px';
        this.joystickBase.classList.add('active');
        this.joystickKnob.style.transform = `translate(0px, 0px)`;
    }
    
    updateKnobPosition(x, y) {
        let dx = x - this.baseX;
        let dy = y - this.baseY;
        
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > this.maxRadius) {
            const ratio = this.maxRadius / distance;
            dx *= ratio;
            dy *= ratio;
        }
        
        this.joystickKnob.style.transform = `translate(${dx}px, ${dy}px)`;
        
        // Update delta untuk digunakan di render loop (-1 to 1)
        this.deltaX = dx / this.maxRadius;
        this.deltaY = dy / this.maxRadius; // Negatif = Maju
    }
    
    reset() {
        this.active = false;
        this.deltaX = 0;
        this.deltaY = 0;
        this.joystickBase.classList.remove('active');
        this.joystickKnob.style.transform = `translate(0px, 0px)`;
    }
    
    // --- Touch Events ---
    onTouchStart(e) {
        if (!e.targetTouches.length) return;
        e.preventDefault();
        this.active = true;
        const touch = e.targetTouches[0];
        this.updateBasePosition(touch.clientX, touch.clientY);
    }
    
    onTouchMove(e) {
        if (!this.active || !e.targetTouches.length) return;
        e.preventDefault();
        const touch = e.targetTouches[0];
        this.updateKnobPosition(touch.clientX, touch.clientY);
    }
    
    onTouchEnd(e) {
        this.reset();
    }
    
    // --- Mouse Events ---
    onMouseDown(e) {
        this.active = true;
        this.updateBasePosition(e.clientX, e.clientY);
    }
    
    onMouseMove(e) {
        if (!this.active) return;
        this.updateKnobPosition(e.clientX, e.clientY);
    }
    
    onMouseUp(e) {
        this.reset();
    }
}
