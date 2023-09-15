"use strict";

import { Game, Brick, Metal } from "./classes.js";

export type LayoutName = "rectangle" | "cross" | "sus" | "typescript" | "turtle";

export function addBricks(game: Game, layout: LayoutName) {
  const instructions: Map<LayoutName, () => void> = new Map();
  instructions.set("rectangle", () => {
    for (let row = 0; row < 12; row++) {
      for (let col = 0; col < 6; col++) {
        game.addObject(Brick, game.canvas.width/2 - 240 + col*96, 80 + row*32, {size: "large", hue: row*30});
      }
    }
  });
  instructions.set("cross", () => {
    const template = [
      "Y  Y             Y  Y  ",
      "y O  Y         Y  O  y ",
      " Y  O  Y     Y  O  Y   ",
      "   Y  O  y ,y O  Y     ",
      "     Y  O  ,O  Y       ",
      "       Y  O  Y         ",
      "     Y  O  ,O  Y       ",
      "   Y  O  y ,y O  Y     ",
      " Y  O  Y     Y  O  Y   ",
      "y O  Y         Y  O  y ",
      "Y  Y             Y  Y  ",
    ];
    for (let row = 0; row < template.length; row++) {
      for (let col = 0; col < template[row].length; col++) {
        const px = game.canvas.width/2 - (template[row].length-1)*16 + col*32;
        const py = 80 + row*32;
        switch (template[row][col]) {
          case "O": game.addObject(Brick, px + 32, py, {size: "large", hue: Math.abs(row-5)*7.5}); break;
          case "Y": game.addObject(Brick, px + 32, py, {size: "large", hue: 45}); break;
          case "y": game.addObject(Brick, px + 16, py, {size: "medium", hue: 45}); break;
          case ",": game.addObject(Brick, px, py, {size: "small", hue: 45}); break;
        }
      }
    }
  });
  instructions.set("sus", () => {
    const template = [
      " R             B    ",
      "R  r    G     B  b  ",
      "#  R   G  g   #  B  ",
      "#  R   #  G   #  B  ",
      "R  R   #  G   B  B  ",
      "R  R   G  G   B  B  ",
      "R  R   G  G   B  B  ",
      "r  r   G  G   b  b  ",
      "r  r   g  g   b  b  ",
      "       g  g         ",
    ];
    for (let row = 0; row < template.length; row++) {
      for (let col = 0; col < template[row].length; col++) {
        const px = game.canvas.width/2 - (template[row].length-1)*16 + col*32;
        const py = 80 + row*32;
        switch (template[row][col]) {
          case "R": game.addObject(Brick, px + 32, py, {size: "large", hue: 0}); break;
          case "G": game.addObject(Brick, px + 32, py, {size: "large", hue: 120}); break;
          case "B": game.addObject(Brick, px + 32, py, {size: "large", hue: 240}); break;
          case "#": game.addObject(Metal, px + 32, py, {size: "large"}); break;
          case "r": game.addObject(Brick, px + 16, py, {size: "medium", hue: 0}); break;
          case "g": game.addObject(Brick, px + 16, py, {size: "medium", hue: 120}); break;
          case "b": game.addObject(Brick, px + 16, py, {size: "medium", hue: 240}); break;
        }
      }
    }
  });
  instructions.set("typescript", () => {
    const template = [
      "##########",
      "##########",
      "##########",
      "##########",
      "##   #   #",
      "### ## ###",
      "### ## ###",
      "### ##   #",
      "### #### #",
      "### #### #",
      "### ##   #",
      "##########",
    ];
    for (let row = 0; row < template.length; row++) {
      for (let col = 0; col < template[row].length; col++) {
        const px = game.canvas.width/2 - (template[row].length-1)*32 + col*64;
        const py = 80 + row*32;
        switch (template[row][col]) {
          case "#": game.addObject(Brick, px, py, {size: "medium", hue: 210}); break;
          case " ": game.addObject(Metal, px, py, {size: "medium"}); break;
        }
      }
    }
  });
  instructions.set("turtle", () => {
    const template = [
      "        g g        ",
      "      ,g g g       ",
      "       ,    ,      ",
      "     # # # # #     ",
      "    # g g g g #    ",
      "   # g g g g g #   ",
      "   xg g g g g g x  ",
      "   xG  g g g G  x  ",
      "   xg g g g g g x  ",
      "Y  xG  g g g G  x  ",
      "Y  Y  # # # # Y  y ",
      "   Y          Y    ",
      "   Y          Y    ",
    ];
    for (let row = 0; row < template.length; row++) {
      for (let col = 0; col < template[row].length; col++) {
        const px = game.canvas.width/2 - (template[row].length-1)*16 + col*32;
        const py = 80 + row*32;
        switch (template[row][col]) {
          case "G": game.addObject(Brick, px + 32, py, {size: "large", hue: 150}); break;
          case "Y": game.addObject(Brick, px + 32, py, {size: "large", hue: 90}); break;
          case "g": game.addObject(Brick, px + 16, py, {size: "medium", hue: 150}); break;
          case "y": game.addObject(Brick, px + 16, py, {size: "medium", hue: 90}); break;
          case "#": game.addObject(Metal, px + 16, py, {size: "medium"}); break;
          case ",": game.addObject(Brick, px, py, {size: "small", hue: 90}); break;
          case "x": game.addObject(Metal, px, py, {size: "small"}); break;
        }
      }
    }
  });
  const instruction = instructions.get(layout);
  if (instruction) {instruction();}
}