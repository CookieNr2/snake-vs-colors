class Fruit {
  constructor(ctx, snake) {
    this.ctx = ctx;
    this.snake = snake;

    this.x = undefined;
    this.y = undefined;
    this.overlap = true;

    this.spawn();
  }

  spawn() {
    this.color = `hsl(${~~(Math.random() * 360)},100%,50%)`;
    const availablePositions = [];
    // Goes through all squares of the canvas and they do not overlap with the Snake they are pushed to the availablePositions array.

    for (let x = 0; x < GRID_W; x++) {
      for (let y = 0; y < GRID_H; y++) {
        const overlapsSnake = this.snake.currentSnake.some(
          (square) => square.x === x && square.y === y
        );
        if (!overlapsSnake) {
          availablePositions.push({ x, y });
        }
      }
    }
    // If there are no available positions left, the game stops.
    if (availablePositions.length === 0) {
      stop();
      return;
    }

    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    const randomPosition = availablePositions[randomIndex];
    this.x = randomPosition.x;
    this.y = randomPosition.y;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.shadowBlur = 15;
    this.ctx.shadowColor = this.color;
    this.ctx.fillRect(
      this.x * SQUARE_SIZE,
      this.y * SQUARE_SIZE,
      SQUARE_SIZE,
      SQUARE_SIZE
    );
  }
}
