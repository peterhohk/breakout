"use strict";
import { Brick, Metal } from "./classes.js";
export function addBricks(game, layout) {
    const instructions = new Map();
    instructions.set("rectangle", () => {
        for (let row = 0; row < 12; row++) {
            for (let col = 0; col < 6; col++) {
                game.addObject(Brick, game.canvas.width / 2 - 240 + col * 96, 80 + row * 32, { size: "large", hue: row * 30 });
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
                const px = game.canvas.width / 2 - (template[row].length - 1) * 16 + col * 32;
                const py = 80 + row * 32;
                switch (template[row][col]) {
                    case "O":
                        game.addObject(Brick, px + 32, py, { size: "large", hue: Math.abs(row - 5) * 7.5 });
                        break;
                    case "Y":
                        game.addObject(Brick, px + 32, py, { size: "large", hue: 45 });
                        break;
                    case "y":
                        game.addObject(Brick, px + 16, py, { size: "medium", hue: 45 });
                        break;
                    case ",":
                        game.addObject(Brick, px, py, { size: "small", hue: 45 });
                        break;
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
                const px = game.canvas.width / 2 - (template[row].length - 1) * 32 + col * 64;
                const py = 80 + row * 32;
                switch (template[row][col]) {
                    case "#":
                        game.addObject(Brick, px, py, { size: "medium", hue: 210 });
                        break;
                    case " ":
                        game.addObject(Metal, px, py, { size: "medium" });
                        break;
                }
            }
        }
    });
    const instruction = instructions.get(layout);
    if (instruction) {
        instruction();
    }
}
