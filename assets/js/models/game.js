class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.canvas.height = CANVAS_H;
    this.canvas.width = CANVAS_W;
    this.ctx = this.canvas.getContext("2d");

    this.sound = new Audio("assets/audio/background-music.wav");
    this.sound.loop = true;
    this.sound.currentTime = 0;
    this.sound.volume = 0.03;

    this.pausePanel = document.getElementById("pause-panel");
    this.endPanel = document.getElementById("end-panel");

    this.fps = FPS;
    this.score = 0;
    this.lives = 3;

    this.arrowKeysPressed = {
      up: false,
      down: false,
      left: false,
      right: false,
    };

    this.snakeBoosted = false;
    this.snakeBoosting = false;

    this.regularSnakeSpeed = SNAKE_MOVE_RATE;
    this.boostedSnakeSpeed = undefined;
    this.snakeBoostTimeout = undefined;

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
        this.regularSnakeSpeed
      );
    }
    this.fruit.draw();
    this.sound.play();
  }

  mainLoop() {
    // Fruit eaten: logic to add points
    const snakeEatsFruit = this.snake.move(this.fruit);
    if (snakeEatsFruit) {
      this.score += POINTS_PER_FRUIT;
      document.getElementById("current-score").innerText = this.score;
      this.checkScore();
    }
    const blocksEaten = this.snake.isEatingBody();
    if (blocksEaten > 0) {
      this.lives--;
      this.score -= POINTS_PER_FRUIT * blocksEaten;
      document.getElementById("current-score").innerText = this.score;
      document.getElementById("lives").innerText = this.lives;
      if (this.lives < 1) this.finishGame();
    }
  }

  reloadSnakeSpeed = () => {
    const interval = this.snakeBoosted
      ? this.boostedSnakeSpeed
      : this.regularSnakeSpeed;
    console.log(`reloading into ${interval}  speed`);
    clearInterval(this.moveIntervalId);
    this.moveIntervalId = setInterval(this.mainLoop.bind(this), interval);
  };

  /*
   * Checks the current core.
   * Increases snake move rate.
   */
  checkScore() {
    switch (this.score) {
      case 50:
        this.regularSnakeSpeed = SNAKE_MOVE_RATE / 2;
        this.reloadSnakeSpeed();
        break;
      case 30:
        this.regularSnakeSpeed = SNAKE_MOVE_RATE / 1.7;
        this.reloadSnakeSpeed();
        break;
      case 10:
        this.regularSnakeSpeed = SNAKE_MOVE_RATE / 1.2;
        this.reloadSnakeSpeed();
        break;
    }
  }

  /*
   * Checks if control keys are pressed.
   */

  updateKeysArrowPressed(event) {
    switch (event.type) {
      case "keydown":
        switch (event.keyCode) {
          case KEY_UP:
            this.arrowKeysPressed.up = true;
            break;
          case KEY_DOWN:
            this.arrowKeysPressed.down = true;
            break;
          case KEY_LEFT:
            this.arrowKeysPressed.left = true;
            break;
          case KEY_RIGHT:
            this.arrowKeysPressed.right = true;
            break;
        }
        break;
      case "keyup":
        switch (event.keyCode) {
          case KEY_UP:
            this.arrowKeysPressed.up = false;
            break;
          case KEY_DOWN:
            this.arrowKeysPressed.down = false;
            break;
          case KEY_LEFT:
            this.arrowKeysPressed.left = false;
            break;
          case KEY_RIGHT:
            this.arrowKeysPressed.right = false;
            break;
        }
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

    this.updateKeysArrowPressed(event);
    // Start boosting the Snake is not boosting or boosted and control keys are pressed
    if (
      event.type === "keydown" &&
      !this.snakeBoosted &&
      !this.snakeBoosting &&
      (this.arrowKeysPressed.down ||
        this.arrowKeysPressed.left ||
        this.arrowKeysPressed.right ||
        this.arrowKeysPressed.up)
    ) {
      this.snakeBoostTimeout = setTimeout(() => {
        this.boostedSnakeSpeed = this.regularSnakeSpeed / SPEED_INCREMENT;
        this.snakeBoosted = true;
        this.snakeBoosting = false;
        this.reloadSnakeSpeed();
      }, 500);
      this.snakeBoosting = true;
    }
    // Stop boosting the Snake is boosted and control keys are not pressed
    if (
      event.type === "keyup" &&
      !this.arrowKeysPressed.down &&
      !this.arrowKeysPressed.left &&
      !this.arrowKeysPressed.right &&
      !this.arrowKeysPressed.up
    ) {
      clearTimeout(this.snakeBoostTimeout);
      if (this.snakeBoosted) {
        this.snakeBoosted = false;
        this.reloadSnakeSpeed();
      }
      this.snakeBoosting = false;
    }
  }

  pause() {
    if (!this.isPaused()) {
      this.stop();
      this.toggleElementVisibility(this.pausePanel, true);
      this.toggleElementVisibility(this.canvas, false);
      this.sound.pause();
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
    this.reset();
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
    this.regularSnakeSpeed = SNAKE_MOVE_RATE;
    this.reloadSnakeSpeed();
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
