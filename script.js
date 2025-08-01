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
        paperElement.addEventListener('mousedown', (e) => {
            this.holdingpaper = true;

            paperElement.style.zIndex = highestZ;
            highestZ += 1;

            if (e.button === 0) {
                this.prevMouseX = this.mouseX;
                this.prevMouseY = this.mouseY;

                console.log(this.prevMouseX);
                console.log(this.prevMouseY);
            }
        });

        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            this.velocityX = this.mouseX - this.prevMouseX;
            this.velocityY = this.mouseY - this.prevMouseY;

            if (this.holdingpaper) {
                this.currentpaperX += this.velocityX;
                this.currentpaperY += this.velocityY;

                this.prevMouseX = this.mouseX;
                this.prevMouseY = this.mouseY;

                paperElement.style.transform = `translateX(${this.currentpaperX}px) translateY(${this.currentpaperY}px)`;
            }
        });

        window.addEventListener('mouseup', () => {
            this.holdingpaper = false;
        });
    }
}

const paperElements = Array.from(document.querySelectorAll('.paper'));

paperElements.forEach(paperElement => {
    const p = new Paper();
    p.init(paperElement);
});

