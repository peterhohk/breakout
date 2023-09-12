"use strict";

import { Game, Ball, Paddle } from "./classes.js";
import { LayoutName } from "./layouts.js";

const setup = document.querySelector("#setup") as HTMLFormElement;
setup.addEventListener("submit", (e) => {
  e.preventDefault();
  setup.remove();
  const game = new Game(document.querySelector("#game")!);
  game.addObject(Ball, game.canvas.width/2, game.canvas.height - 40);
  game.addObject(Paddle, game.canvas.width/2, game.canvas.height - 24);
  game.addBricks(new FormData(setup).get("layout") as LayoutName);
  game.init();
});

// preview genetarion utility (for dev use)
// window.addEventListener("keydown", (e) => {
//   if (e.key === "s") {
//     const w = window.open();
//     w?.document.write(`<img src="${(document.querySelector("#game") as HTMLCanvasElement).toDataURL("image/png")}">`);
//     location.reload();
//   };
// })