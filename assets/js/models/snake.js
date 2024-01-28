class Snake {
  constructor(ctx, x, y) {
    this.ctx = ctx;

    this.x = x;
    this.y = y;
    this.lastDirection = undefined;
    this.direction = KEY_RIGHT;

    this.sound = new Audio("assets/audio/piano-sound.wav");

    this.currentSnake = [
      new Square(this.ctx, x - 2, y),
      new Square(this.ctx, x - 1, y),
      new Square(this.ctx, x, y),
    ];
  }

  checkMovingBackwards() {
    switch (this.direction) {
      case KEY_UP:
        if (this.lastDirection == KEY_DOWN) this.direction = this.lastDirection;
        break;
      case KEY_DOWN:
        if (this.lastDirection == KEY_UP) this.direction = this.lastDirection;
        break;
      case KEY_LEFT:
        if (this.lastDirection == KEY_RIGHT)
          this.direction = this.lastDirection;
        break;
      case KEY_RIGHT:
        if (this.lastDirection == KEY_LEFT) this.direction = this.lastDirection;
        break;
    }
  }

  move(fruit) {
    this.checkMovingBackwards();
    this.lastDirection = this.direction;

    switch (this.direction) {
      case KEY_UP:
        this.y--;
        if (this.y < 0) this.y += GRID_H;
        break;
      case KEY_DOWN:
        this.y++;
        if (this.y >= GRID_H) this.y -= GRID_H;
        break;
      case KEY_LEFT:
        this.x--;
        if (this.x < 0) this.x += GRID_W;
        break;
      case KEY_RIGHT:
        this.x++;
        if (this.x >= GRID_W) this.x -= GRID_W;
        break;
    }

    const fruitEaten = this.eatFruit(fruit);

    if (!fruitEaten) this.currentSnake.shift();
    this.currentSnake.push(new Square(this.ctx, this.x, this.y));

    return fruitEaten;
  }

  /*
   * Checks if the fruit is on the head and eats the fruit.
   * New fruit spawns.
   */
  eatFruit(fruit) {
    if (this.x === fruit.x && this.y === fruit.y) {
      this.sound.play();
      fruit.splash();
      fruit.spawn();
      return true;
    }
    return false;
  }

  isEatingBody() {
    // Check if the current snake x & y eats a body. if they have, return true. else false.
    const body = this.currentSnake.slice(0, this.currentSnake.length - 1);
    const head = this.currentSnake[this.currentSnake.length - 1];
    let result = false;
    body.forEach((square) => {
      if (head.x === square.x && head.y === square.y) {
        result = true;
      }
    });
    return result;
  }

  onKeyEvent(event) {
    if (event.type === "keydown") {
      switch (event.keyCode) {
        case KEY_RIGHT:
        case KEY_LEFT:
        case KEY_UP:
        case KEY_DOWN:
          this.direction = event.keyCode;
          break;
      }
    }
  }

  draw() {
    for (let i = 0; i < this.currentSnake.length - 1; i++) {
      this.ctx.fillStyle = `hsla(360, 0%, 100%, ${
        SNAKE_IN_TRANS +
        (i * (SNAKE_FN_TRANS - SNAKE_IN_TRANS)) / this.currentSnake.length
      })`;

      this.ctx.shadowBlur = 5;
      this.ctx.shadowColor = "rgba(255,255,255,.3 )";
      this.currentSnake[i].draw();
    }
    this.ctx.fillStyle = `hsla(360, 0%, 100%, 1)`;

    this.ctx.shadowBlur = 17;
    this.ctx.shadowColor = "rgba(255,255,255,.3 )";
    this.currentSnake[this.currentSnake.length - 1].draw();
  }
}
