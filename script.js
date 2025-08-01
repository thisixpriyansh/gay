let highestZ = 1;

class Paper {
    holdingpaper = false;

    prevMouseX = 0;
    prevMouseY = 0;

    mouseX = 0;
    mouseY = 0;

    velocityX = 0;
    velocityY = 0;

    currentpaperX = 0;
    currentpaperY = 0;

    init(paperElement) {
        // Mouse events for desktop
        paperElement.addEventListener('mousedown', (e) => {
            this.startDrag(e.clientX, e.clientY, paperElement);
            e.preventDefault(); // Prevent text selection
        });

        document.addEventListener('mousemove', (e) => {
            this.drag(e.clientX, e.clientY, paperElement);
        });

        document.addEventListener('mouseup', () => {
            this.stopDrag();
        });

        // Touch events for mobile
        paperElement.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            this.startDrag(touch.clientX, touch.clientY, paperElement);
            e.preventDefault(); // Prevent scrolling and other touch behaviors
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (this.holdingpaper) {
                const touch = e.touches[0];
                this.drag(touch.clientX, touch.clientY, paperElement);
                e.preventDefault(); // Prevent scrolling while dragging
            }
        }, { passive: false });

        document.addEventListener('touchend', () => {
            this.stopDrag();
        });

        // Handle touch cancel (when touch is interrupted)
        document.addEventListener('touchcancel', () => {
            this.stopDrag();
        });
    }

    startDrag(clientX, clientY, paperElement) {
        this.holdingpaper = true;

        paperElement.style.zIndex = highestZ;
        highestZ += 1;

        this.prevMouseX = clientX;
        this.prevMouseY = clientY;
        this.mouseX = clientX;
        this.mouseY = clientY;

        // Add a slight scale effect to show the paper is being dragged
        paperElement.style.transform = `translateX(${this.currentpaperX}px) translateY(${this.currentpaperY}px) scale(1.05)`;
    }

    drag(clientX, clientY, paperElement) {
        this.mouseX = clientX;
        this.mouseY = clientY;

        this.velocityX = this.mouseX - this.prevMouseX;
        this.velocityY = this.mouseY - this.prevMouseY;

        if (this.holdingpaper) {
            this.currentpaperX += this.velocityX;
            this.currentpaperY += this.velocityY;

            this.prevMouseX = this.mouseX;
            this.prevMouseY = this.mouseY;

            paperElement.style.transform = `translateX(${this.currentpaperX}px) translateY(${this.currentpaperY}px) scale(1.05)`;
        }
    }

    stopDrag() {
        if (this.holdingpaper) {
            this.holdingpaper = false;
            // Remove the scale effect when dropping
            const paperElement = document.elementFromPoint(this.mouseX, this.mouseY)?.closest('.paper');
            if (paperElement) {
                paperElement.style.transform = `translateX(${this.currentpaperX}px) translateY(${this.currentpaperY}px) scale(1)`;
            }
        }
    }
}

const paperElements = Array.from(document.querySelectorAll('.paper'));

paperElements.forEach(paperElement => {
    const p = new Paper();
    p.init(paperElement);
});
