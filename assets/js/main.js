window.addEventListener("load", () => {
  const game = new Game("main-canvas");
  multicolorText();

  function addButtonClickListener(buttonId, action) {
    const button = document.getElementById(buttonId);
    button.addEventListener("click", () => {
      document.getElementById("start-panel").classList.add("hidden");
      document.getElementById("end-panel").classList.add("hidden");
      document.getElementById("pause-panel").classList.add("hidden");
      document.getElementById("main-canvas").classList.remove("hidden");
      document.getElementById("game-data").classList.remove("hidden");
      action();
    });
  }

  addButtonClickListener("play", () => {
    game.reset();
    game.start();
  });

  addButtonClickListener("play-again", () => {
    game.reset();
    game.start();
  });

  addButtonClickListener("continue", () => {
    game.start();
  });

  addButtonClickListener("go-back", () => {
    document.getElementById("instructions-panel").classList.add("hidden");
    document.getElementById("start-panel").classList.remove("hidden");
    document.getElementById("main-canvas").classList.add("hidden");
    document.getElementById("game-data").classList.add("hidden");
  });

  addButtonClickListener("instructions", () => {
    document.getElementById("instructions-panel").classList.remove("hidden");
    document.getElementById("main-canvas").classList.add("hidden");
    document.getElementById("game-data").classList.add("hidden");
  });

  addButtonClickListener("exit", () => {
    document.getElementById("start-panel").classList.remove("hidden");
    document.getElementById("end-panel").classList.add("hidden");
    document.getElementById("pause-panel").classList.add("hidden");
    document.getElementById("main-canvas").classList.add("hidden");
    document.getElementById("game-data").classList.add("hidden");
    game.stop();
    game.reset();
  });

  document.addEventListener("keydown", (event) => game.onKeyEvent(event));

  function multicolorText() {
    const snakeLetters = document.querySelectorAll("h2 span");
    snakeLetters.forEach((element) => {
      element.classList.add("multicolor");
      element.style.color = `hsla(${Math.floor(
        Math.random() * 360
      )}, 100%, 50%, 1)`;
    });
  }
});
