// script.js
let highestZ = 1;

class Paper {
  constructor() {
    this.holdingPaper = false;
    this.mouseTouchX = 0;
    this.mouseTouchY = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.prevMouseX = 0;
    this.prevMouseY = 0;
    this.velX = 0;
    this.velY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentPaperX = 0;
    this.currentPaperY = 0;
    this.rotating = false;
  }

  init(paper) {
    const self = this;

    function handleMove(e) {
      if (!self.rotating) {
        self.mouseX = e.clientX || e.touches[0].clientX;
        self.mouseY = e.clientY || e.touches[0].clientY;
        self.velX = self.mouseX - self.prevMouseX;
        self.velY = self.mouseY - self.prevMouseY;
      }

      const dirX = e.clientX - self.mouseTouchX || e.touches[0].clientX - self.mouseTouchX;
      const dirY = e.clientY - self.mouseTouchY || e.touches[0].clientY - self.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;
      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;

      if (self.rotating) {
        self.rotation = degrees;
      }

      if (self.holdingPaper) {
        if (!self.rotating) {
          self.currentPaperX += self.velX;
          self.currentPaperY += self.velY;
        }

        self.prevMouseX = self.mouseX;
        self.prevMouseY = self.mouseY;

        paper.style.transform = `translateX(${self.currentPaperX}px) translateY(${self.currentPaperY}px) rotateZ(${self.rotation}deg)`;
      }
    }

    function handleStart(e) {
      if (self.holdingPaper) return;
      self.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;

      if (e.button === 0 || e.touches.length === 1) {
        self.mouseTouchX = self.mouseX = self.prevMouseX = e.clientX || e.touches[0].clientX;
        self.mouseTouchY = self.mouseY = self.prevMouseY = e.clientY || e.touches[0].clientY;
      }

      if (e.button === 2) {
        self.rotating = true;
      }
    }

    function handleEnd() {
      self.holdingPaper = false;
      self.rotating = false;
    }

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove, { passive: true });

    paper.addEventListener('mousedown', handleStart);
    paper.addEventListener('touchstart', handleStart, { passive: true });

    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
