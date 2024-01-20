window.addEventListener("load", () => {
  const game = new Game("main-canvas");
  const gameStared = document.getElementById("play");
  const gameRestart = document.getElementById("play-again");
  const gamePaused = document.getElementById("continue");

  gameStared.addEventListener("click", () => {
    document.getElementById("start-panel").classList.add("hidden");
    document.getElementById("main-canvas").classList.remove("hidden");
    game.start();
  });

  gameRestart.addEventListener("click", () => {
    document.getElementById("end-panel").classList.add("hidden");
    document.getElementById("main-canvas").classList.remove("hidden");
    game.reset();
    game.start();
  });

  gamePaused.addEventListener("click", () => {
    document.getElementById("pause-panel").classList.add("hidden");
    document.getElementById("main-canvas").classList.remove("hidden");
    game.start();
  });

  document.addEventListener("keydown", (event) => game.onKeyEvent(event));
});
