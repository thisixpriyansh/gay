let highestZ = 1;

class Paper {
    holdingpaper = false;
    isDragging = false;
    
    startX = 0;
    startY = 0;
    currentX = 0;
    currentY = 0;
    
    paperX = 0;
    paperY = 0;
    
    holdTimer = null;
    holdDelay = 200; // 200ms hold delay for mobile

    init(paperElement) {
        // Touch events for mobile
        paperElement.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            this.startX = touch.clientX;
            this.startY = touch.clientY;
            this.currentX = touch.clientX;
            this.currentY = touch.clientY;
            
            // Start hold timer for mobile
            this.holdTimer = setTimeout(() => {
                this.startHold(paperElement);
            }, this.holdDelay);
            
            e.preventDefault();
        }, { passive: false });

        paperElement.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            this.currentX = touch.clientX;
            this.currentY = touch.clientY;
            
            // If we're holding, start dragging
            if (this.holdingpaper) {
                this.isDragging = true;
                this.drag(paperElement);
                e.preventDefault();
            } else {
                // Cancel hold timer if moved too much before hold completes
                const deltaX = Math.abs(this.currentX - this.startX);
                const deltaY = Math.abs(this.currentY - this.startY);
                if (deltaX > 10 || deltaY > 10) {
                    this.cancelHold();
                }
            }
        }, { passive: false });

        paperElement.addEventListener('touchend', () => {
            this.stopDrag(paperElement);
            this.cancelHold();
        });

        paperElement.addEventListener('touchcancel', () => {
            this.stopDrag(paperElement);
            this.cancelHold();
        });

        // Mouse events for desktop (immediate drag)
        paperElement.addEventListener('mousedown', (e) => {
            this.startX = e.clientX;
            this.startY = e.clientY;
            this.currentX = e.clientX;
            this.currentY = e.clientY;
            this.startHold(paperElement);
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (this.holdingpaper) {
                this.currentX = e.clientX;
                this.currentY = e.clientY;
                this.drag(paperElement);
            }
        });

        document.addEventListener('mouseup', () => {
            this.stopDrag(paperElement);
        });

        // Add visual feedback styles
        paperElement.style.transition = 'transform 0.2s ease-out';
    }

    startHold(paperElement) {
        this.holdingpaper = true;
        
        // Bring to front
        paperElement.style.zIndex = highestZ;
        highestZ += 1;
        
        // Visual feedback - lift effect
        paperElement.style.transform = `translateX(${this.paperX}px) translateY(${this.paperY}px) scale(1.1) rotateZ(-5deg)`;
        paperElement.style.transition = 'none'; // Remove transition during drag
        paperElement.style.boxShadow = '5px 25px 40px 15px rgba(0, 0, 0, 0.7)';
        
        // Add haptic feedback for mobile (if supported)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        console.log('Paper held - ready to drag');
    }

    drag(paperElement) {
        if (!this.holdingpaper) return;
        
        const deltaX = this.currentX - this.startX;
        const deltaY = this.currentY - this.startY;
        
        this.paperX = deltaX;
        this.paperY = deltaY;
        
        paperElement.style.transform = `translateX(${this.paperX}px) translateY(${this.paperY}px) scale(1.1) rotateZ(-2deg)`;
    }

    stopDrag(paperElement) {
        if (this.holdingpaper) {
            this.holdingpaper = false;
            this.isDragging = false;
            
            // Reset visual effects
            paperElement.style.transition = 'transform 0.3s ease-out, box-shadow 0.3s ease-out';
            paperElement.style.transform = `translateX(${this.paperX}px) translateY(${this.paperY}px) scale(1) rotateZ(-5deg)`;
            paperElement.style.boxShadow = '1px 15px 20px 8px rgba(0, 0, 0, 0.5)';
            
            // Reset start position for next drag
            this.startX = this.currentX;
            this.startY = this.currentY;
            
            console.log('Paper dropped');
        }
    }

    cancelHold() {
        if (this.holdTimer) {
            clearTimeout(this.holdTimer);
            this.holdTimer = null;
        }
    }
}

const paperElements = Array.from(document.querySelectorAll('.paper'));

paperElements.forEach(paperElement => {
    const p = new Paper();
    p.init(paperElement);
});

// Add some CSS for better mobile experience
const style = document.createElement('style');
style.textContent = `
    .paper {
        cursor: grab;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
    }
    
    .paper:active {
        cursor: grabbing;
    }
    
    body {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
        overflow: hidden; /* Prevent scroll during drag */
    }
`;
document.head.appendChild(style);
