const drawGrid = (ctx) => {
  ctx.lineWidth = 1.1;
  ctx.strokeStyle = "rgba(54, 48, 98, 0.3)";
  ctx.shadowBlur = 0;

  // Draws a vertical line for each X position.
  for (let i = 1; i < GRID_W; i++) {
    let x = SQUARE_SIZE * i;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CANVAS_H);
    ctx.stroke();
  }

  // Draws a horizontal line for each Y position.
  for (let i = 1; i < GRID_H; i++) {
    let y = SQUARE_SIZE * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_W, y);
    ctx.stroke();
  }
};
