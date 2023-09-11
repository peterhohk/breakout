"use strict";
import { Game, Ball, Paddle } from "./classes.js";
const setup = document.querySelector("#setup");
setup.addEventListener("submit", (e) => {
    e.preventDefault();
    setup.remove();
    const game = new Game(document.querySelector("#game"));
    game.addObject(Ball, game.canvas.width / 2, game.canvas.height - 40);
    game.addObject(Paddle, game.canvas.width / 2, game.canvas.height - 24);
    game.addBricks(new FormData(setup).get("layout"));
    game.init();
});
