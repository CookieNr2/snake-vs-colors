class Square {
  constructor(ctx, x, y) {
    this.ctx = ctx;

    this.x = x;
    this.y = y;

    this.color = "rgb(255,255,255)";
  }

  splash() {
    const rect = document.getElementById("main-canvas").getBoundingClientRect();

    confetti({
      spread: 360,
      ticks: 1500,
      gravity: 0,
      decay: 1,
      startVelocity: 2,
      colors: [this.color],
      particleCount: 100,
      scalar: 1,
      particleCount: 10,
      origin: {
        x:
          (rect.left + this.x * SQUARE_SIZE + SQUARE_SIZE / 2) /
          window.innerWidth,
        y:
          (rect.top + this.y * SQUARE_SIZE + SQUARE_SIZE / 2) /
          window.innerHeight,
      },
    });
  }

  draw() {
    this.ctx.fillRect(
      this.x * SQUARE_SIZE,
      this.y * SQUARE_SIZE,
      SQUARE_SIZE,
      SQUARE_SIZE
    );
  }
}
