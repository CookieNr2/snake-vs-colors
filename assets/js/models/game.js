class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.canvas.height = CANVAS_H;
    this.canvas.width = CANVAS_W;
    this.ctx = this.canvas.getContext("2d");

    this.pausePanel = document.getElementById("pause-panel");
    this.endPanel = document.getElementById("end-panel");

    this.fps = FPS;
    this.score = 0;
    this.lives = 3;

    this.snakeMoveRate = SNAKE_MOVE_RATE;

    this.drawIntervalId = undefined;
    this.moveIntervalId = undefined;

    this.snake = new Snake(
      this.ctx,
      Math.floor(Math.random() * GRID_W),
      Math.floor(Math.random() * GRID_H)
    );

    this.fruit = new Fruit(this.ctx, this.snake);
  }

  start() {
    if (!this.drawIntervalId) {
      this.drawIntervalId = setInterval(() => {
        this.draw();
      }, this.fps);
    }
    if (!this.moveIntervalId) {
      this.moveIntervalId = setInterval(
        this.mainLoop.bind(this),
        this.snakeMoveRate
      );
    }
    this.fruit.draw();
  }

  mainLoop() {
    // Fruit eaten: logic to add points
    const snakeEatsFruit = this.snake.move(this.fruit);
    if (snakeEatsFruit) {
      this.score += 10;
      document.getElementById("current-score").innerText = this.score;
      this.checkScore();
    }
    if (this.snake.isEatingBody()) {
      this.lives--;
      document.getElementById("lives").innerText = this.lives;
      if (this.lives < 1) this.finishGame();
    }
  }

  /*
   * Checks the current core.
   * Increases snake move rate.
   */
  checkScore() {
    const reloadSnakeSpeed = () => {
      clearInterval(this.moveIntervalId);
      this.moveIntervalId = setInterval(
        this.mainLoop.bind(this),
        this.snakeMoveRate
      );
    };

    switch (this.score) {
      case 50:
        this.snakeMoveRate = SNAKE_MOVE_RATE / 2;
        reloadSnakeSpeed();
        break;
      case 30:
        this.snakeMoveRate = SNAKE_MOVE_RATE / 1.7;
        reloadSnakeSpeed();
        break;
      case 10:
        this.snakeMoveRate = SNAKE_MOVE_RATE / 1.2;
        reloadSnakeSpeed();
        break;
    }
  }

  onKeyEvent(event) {
    this.snake.onKeyEvent(event);
    if (event.keyCode === KEY_SPACE && event.type === "keydown") {
      if (this.isPaused()) {
        this.unpause();
      } else {
        this.pause();
      }
    }
  }

  pause() {
    if (!this.isPaused()) {
      this.stop();
      this.toggleElementVisibility(this.pausePanel, true);
      this.toggleElementVisibility(this.canvas, false);
    }
  }

  unpause() {
    if (this.isPaused()) {
      this.start();
      this.toggleElementVisibility(this.pausePanel, false);
      this.toggleElementVisibility(this.canvas, true);
    }
  }

  toggleElementVisibility(element, visible) {
    element.classList.toggle("hidden", !visible);
  }

  isPaused() {
    return (
      this.drawIntervalId === undefined && this.moveIntervalId === undefined
    );
  }

  stop() {
    clearInterval(this.drawIntervalId);
    clearInterval(this.moveIntervalId);
    this.drawIntervalId = undefined;
    this.moveIntervalId = undefined;
  }

  finishGame() {
    this.stop();
    this.saveScore(this.score);
    this.toggleElementVisibility(this.canvas, false);
    this.toggleElementVisibility(this.endPanel, true);
    document.getElementById("final-score").innerText = this.score;
  }

  saveScore(score) {
    const existingScore = localStorage.getItem(SCORE_KEY)
      ? localStorage.getItem(SCORE_KEY)
      : 0;

    if (score > existingScore) {
      localStorage.setItem(SCORE_KEY, score);
      document.getElementById(
        "best-score"
      ).innerText = `New best score: ${this.score}`;
    } else {
      document.getElementById(
        "best-score"
      ).innerText = `Best score: ${existingScore}`;
    }
  }

  reset() {
    this.score = 0;
    this.lives = 3;
    this.snakeMoveRate = SNAKE_MOVE_RATE;
    document.getElementById("current-score").innerText = this.score;
    document.getElementById("lives").innerText = this.lives;
    this.snake = new Snake(
      this.ctx,
      Math.floor(Math.random() * GRID_W),
      Math.floor(Math.random() * GRID_H)
    );
    this.fruit = new Fruit(this.ctx, this.snake);
  }

  draw() {
    this.ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    drawGrid(this.ctx);
    this.fruit.draw();
    this.snake.draw();
  }
}
