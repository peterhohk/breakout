"use strict";
import { addBricks } from "./layouts.js";
function deg2rad(deg) {
    return deg * Math.PI / 180;
}
function rad2deg(rad) {
    return rad * 180 / Math.PI;
}
// class definitions
export class Game {
    constructor(canvas) {
        this.debug = false;
        this.objects = [];
        this.playing = true;
        this.stats = {
            score: 0,
            lives: 3,
        };
        this.keypresses = {
            "ArrowLeft": false,
            "ArrowRight": false,
            " ": false,
        };
        this.activeTouch = null;
        this.touchStatus = {
            justTapped: false,
            justMoved: false,
            justUntapped: false,
        };
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }
    init() {
        window.requestAnimationFrame(() => this.main());
        this.ctx.fillStyle = "#eee";
        this.ctx.strokeStyle = "#eee";
        this.ctx.lineWidth = 2;
        // handle keyboard input
        window.addEventListener("keydown", (e) => {
            if (this.keypresses.hasOwnProperty(e.key)) {
                this.keypresses[e.key] = true;
            }
        });
        window.addEventListener("keyup", (e) => {
            if (this.keypresses.hasOwnProperty(e.key)) {
                this.keypresses[e.key] = false;
            }
        });
        // handle touch input
        const handleTouchStart = (e) => {
            if (this.activeTouch)
                return;
            const bound = this.canvas.getBoundingClientRect();
            const touch = e.changedTouches.item(0);
            this.activeTouch = {
                identifier: touch.identifier,
                isTap: true,
                lastX: touch.clientX - bound.x,
                lastY: touch.clientY - bound.y,
                currentX: touch.clientX - bound.x,
                currentY: touch.clientY - bound.y,
            };
            this.touchStatus.justTapped = true;
            window.requestAnimationFrame(() => { this.touchStatus.justTapped = false; });
        };
        const handleTouchMove = (e) => {
            if (!this.activeTouch)
                return;
            const bound = this.canvas.getBoundingClientRect();
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches.item(i);
                if (touch.identifier === this.activeTouch.identifier) {
                    this.activeTouch.isTap = false;
                    this.activeTouch.lastX = this.activeTouch.currentX;
                    this.activeTouch.lastY = this.activeTouch.currentY;
                    this.activeTouch.currentX = touch.clientX - bound.x;
                    this.activeTouch.currentY = touch.clientY - bound.y;
                    this.touchStatus.justMoved = true;
                    window.requestAnimationFrame(() => { this.touchStatus.justMoved = false; });
                }
            }
        };
        const handleTouchEnd = (e) => {
            if (!this.activeTouch)
                return;
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches.item(i);
                if (touch.identifier === this.activeTouch.identifier) {
                    if (this.activeTouch.isTap) {
                        this.touchStatus.justUntapped = true;
                        window.requestAnimationFrame(() => { this.touchStatus.justUntapped = false; });
                    }
                    this.activeTouch = null;
                    break;
                }
            }
        };
        window.addEventListener("touchstart", handleTouchStart);
        window.addEventListener("touchmove", (e) => { e.preventDefault(); handleTouchMove(e); }, { passive: false });
        window.addEventListener("touchend", handleTouchEnd);
        window.addEventListener("touchcancel", handleTouchEnd);
    }
    main() {
        if (this.playing) {
            window.requestAnimationFrame(() => this.main());
        }
        else
            return;
        const ball = this.getObject(Ball);
        const paddle = this.getObject(Paddle);
        const bricks = this.getAllObjects(Brick);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // draw objects
        this.objects.forEach((obj) => obj.draw());
        // draw stats
        this.drawText(this.stats.score.toString(), this.canvas.width - 2, 0, "32px monospace", "top", "right");
        for (let i = 0; i < this.stats.lives; i++) {
            this.ctx.save();
            this.ctx.translate(this.canvas.width - 10 - i * 20, 36);
            const rgrad = this.ctx.createRadialGradient(-4, -4, 0, 0, 0, 8);
            rgrad.addColorStop(0.25, "#eee");
            rgrad.addColorStop(1, "#444");
            this.ctx.fillStyle = rgrad;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 8, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
        // draw controls
        if (!ball.fired) {
            this.drawArrowhead(paddle.x + paddle.width / 2 + 32, paddle.y, 16, 12, 0);
            this.drawArrowhead(paddle.x - paddle.width / 2 - 32, paddle.y, 16, 12, 180);
            this.drawArrowhead(ball.x + 32, ball.y - 32, 16, 12, -45);
            this.drawText("RIGHT", paddle.x + paddle.width / 2 + 24, paddle.y - 8, "16px monospace", "bottom", "center");
            this.drawText("LEFT", paddle.x - paddle.width / 2 - 24, paddle.y - 8, "16px monospace", "bottom", "center");
            this.drawText("SPACE", ball.x + 24, ball.y - 36, "16px monospace", "bottom", "center");
        }
        // draw win condition
        if (bricks.length === 0) {
            this.playing = false;
            this.drawText("YOU WIN", this.canvas.width / 2, this.canvas.height / 2, "64px monospace", "middle", "center");
        }
        // draw lose consition
        if (this.stats.lives === 0) {
            this.playing = false;
            this.drawText("GAME OVER", this.canvas.width / 2, this.canvas.height / 2, "64px monospace", "middle", "center");
        }
        // update objects
        this.objects.forEach((obj) => obj.update());
        // debug information
        if (this.debug) {
            if (ball.speed) {
                this.ctx.beginPath();
                this.ctx.moveTo(ball.x, ball.y);
                this.ctx.lineTo(ball.x + 1152 * Math.cos(deg2rad(ball.angle)), ball.y + 1152 * Math.sin(deg2rad(ball.angle)));
                this.ctx.stroke();
            }
            this.drawText(`Ball speed: ${ball.speed.toFixed(3)}`, 16, 32, "16px monospace", "top", "left");
            this.drawText(`Ball angle: ${ball.angle.toFixed(3)}`, 16, 48, "16px monospace", "top", "left");
        }
    }
    // utility methods
    addObject(objClass, ...args) {
        this.objects.push(new objClass(this, ...args));
    }
    removeObject(objToRemove) {
        this.objects = this.objects.filter((obj) => obj !== objToRemove);
    }
    getAllObjects(objClass) {
        return this.objects.filter((obj) => obj instanceof objClass);
    }
    getObject(objClass) {
        return this.getAllObjects(objClass)[0];
    }
    addBricks(layout) {
        addBricks(this, layout);
    }
    drawText(text, x, y, f, b, a) {
        this.ctx.save();
        this.ctx.font = f;
        this.ctx.textBaseline = b;
        this.ctx.textAlign = a;
        this.ctx.fillText(text, x, y);
        this.ctx.restore();
    }
    drawArrowhead(x, y, width, height, angle) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(deg2rad(angle));
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(-width, -height / 2);
        this.ctx.lineTo(-width, height / 2);
        this.ctx.fill();
        this.ctx.restore();
    }
}
class GameObject {
    constructor(game, x, y) {
        this.width = 0;
        this.height = 0;
        this.vx = 0;
        this.vy = 0;
        this.game = game;
        this.x = x;
        this.y = y;
    }
    get speed() { return Math.sqrt(this.vx ** 2 + this.vy ** 2); }
    set speed(newSpeed) {
        const oldSpeed = this.speed;
        if (oldSpeed === 0) {
            this.vx = newSpeed;
            this.vy = 0;
        }
        else {
            this.vy *= newSpeed / oldSpeed;
            this.vx *= newSpeed / oldSpeed;
        }
    }
    get angle() { return rad2deg(Math.atan2(this.vy, this.vx)); }
    set angle(newAngle) {
        const oldSpeed = this.speed;
        this.vx = oldSpeed * Math.cos(deg2rad(newAngle));
        this.vy = oldSpeed * Math.sin(deg2rad(newAngle));
    }
    draw() {
        this.game.ctx.save();
        this.game.ctx.translate(this.x, this.y);
        this.drawObject();
        this.game.ctx.restore();
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.updateObject();
    }
    // utility methods
    distanceTo(other) {
        return Math.sqrt((other.x - this.x) ** 2 + (other.y - this.y) ** 2);
    }
    collidesWith(other) {
        return (this.x + this.vx + this.width / 2 > other.x - other.width / 2 &&
            this.x + this.vx - this.width / 2 < other.x + other.width / 2 &&
            this.y + this.vy + this.height / 2 > other.y - other.height / 2 &&
            this.y + this.vy - this.height / 2 < other.y + other.height / 2);
    }
    onCollisionWith(objClass, handler) {
        this.game.getAllObjects(objClass).sort((a, b) => this.distanceTo(a) - this.distanceTo(b)).forEach((other) => {
            if (this.collidesWith(other)) {
                handler(other);
            }
        });
    }
    bounceOff(other) {
        if (this.x + this.vx < other.x - other.width / 2) {
            this.vx = -Math.abs(this.vx);
        }
        if (this.x + this.vx > other.x + other.width / 2) {
            this.vx = Math.abs(this.vx);
        }
        if (this.y + this.vy < other.y - other.height / 2) {
            this.vy = -Math.abs(this.vy);
        }
        if (this.y + this.vy > other.y + other.height / 2) {
            this.vy = Math.abs(this.vy);
        }
    }
}
export class Ball extends GameObject {
    constructor() {
        super(...arguments);
        this.radius = 8;
        this.width = this.radius * 2;
        this.height = this.radius * 2;
        this.fired = false;
        this.speedIncrement = 0.125;
        this.maxSpeed = 8;
        this.angleVariation = 5;
    }
    drawObject() {
        const rgrad = this.game.ctx.createRadialGradient(-this.radius / 2, -this.radius / 2, 0, 0, 0, this.radius);
        rgrad.addColorStop(0.25, "#eee");
        rgrad.addColorStop(1, "#444");
        this.game.ctx.fillStyle = rgrad;
        this.game.ctx.beginPath();
        this.game.ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        this.game.ctx.fill();
    }
    updateObject() {
        const paddle = this.game.getObject(Paddle);
        // controls before firing
        if (!this.fired) {
            this.x = paddle.x;
            if (this.game.keypresses[" "] || this.game.touchStatus.justUntapped) {
                this.fired = true;
                this.speed = 4;
                this.angle = -45;
            }
        }
        // bounce off walls
        if (this.x + this.vx > this.game.canvas.width - this.width / 2) {
            this.vx = -Math.abs(this.vx);
        }
        if (this.x + this.vx < this.width / 2) {
            this.vx = Math.abs(this.vx);
        }
        if (this.y + this.vy < this.height / 2) {
            this.vy = Math.abs(this.vy);
        }
        // bounce off paddle and adjust velocity
        this.onCollisionWith(Paddle, (paddle) => {
            this.bounceOff(paddle);
            this.speed = Math.min(this.speed + this.speedIncrement, this.maxSpeed);
            this.angle += (this.x - paddle.x) / (paddle.width / 2) * this.angleVariation;
        });
        // bounce off bricks and destroy bricks
        this.onCollisionWith(Brick, (brick) => {
            this.bounceOff(brick);
            this.game.removeObject(brick);
            this.game.stats.score++;
        });
        // bounce off metal bricks
        this.onCollisionWith(Metal, (metal) => {
            this.bounceOff(metal);
        });
        // lose a life if fail to catch ball
        if (this.y + this.vy > this.game.canvas.height + this.height) {
            this.game.stats.lives--;
            if (this.game.stats.lives !== 0) {
                this.fired = false;
                this.x = paddle.x;
                this.y = this.game.canvas.height - 40;
                this.speed = 0;
            }
        }
    }
}
export class Paddle extends GameObject {
    constructor() {
        super(...arguments);
        this.width = 128;
        this.height = 16;
        this.moveSpeed = 8;
        this.touchSpeedMultiplier = 4;
    }
    drawObject() {
        const lgrad = this.game.ctx.createLinearGradient(0, -this.height / 2, 0, this.height / 2);
        lgrad.addColorStop(0, "#eee");
        lgrad.addColorStop(0.5, "#444");
        this.game.ctx.fillStyle = lgrad;
        this.game.ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    }
    updateObject() {
        // move with arrow keys
        if (this.game.keypresses["ArrowLeft"]) {
            this.x -= this.moveSpeed;
        }
        if (this.game.keypresses["ArrowRight"]) {
            this.x += this.moveSpeed;
        }
        // move with touch controls
        if (this.game.activeTouch && this.game.touchStatus.justMoved) {
            const touch = this.game.activeTouch;
            this.x += (touch.currentX - touch.lastX) * this.touchSpeedMultiplier;
        }
        // keep paddle within bounds
        const minX = this.width / 2;
        const maxX = this.game.canvas.width - this.width / 2;
        this.x = (this.x <= minX) ? minX : (this.x > maxX) ? maxX : this.x;
    }
}
export class Brick extends GameObject {
    constructor(game, x, y, options) {
        super(game, x, y);
        this.height = 32;
        this.width = (options.size === "small") ? 32 : (options.size === "medium") ? 64 : 96;
        this.hue = options.hue;
    }
    drawObject() {
        const lgrad = this.game.ctx.createLinearGradient(-this.width / 2, -this.height / 2, this.width / 2, this.height / 2);
        lgrad.addColorStop(0, `hsl(${this.hue} 100% 50%)`);
        lgrad.addColorStop(0.25, `hsl(${this.hue} 100% 68%)`);
        lgrad.addColorStop(0.5, `hsl(${this.hue} 100% 50%)`);
        this.game.ctx.fillStyle = lgrad;
        this.game.ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        this.game.ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
    }
    updateObject() { }
}
export class Metal extends GameObject {
    constructor(game, x, y, options) {
        super(game, x, y);
        this.height = 32;
        this.width = (options.size === "small") ? 32 : (options.size === "medium") ? 64 : 96;
    }
    drawObject() {
        const lgrad = this.game.ctx.createLinearGradient(-this.width / 2, -this.height / 2, this.width / 2, this.height / 2);
        lgrad.addColorStop(0, "hsl(0 0% 50%)");
        lgrad.addColorStop(0.25, "hsl(0 0% 82%)");
        lgrad.addColorStop(0.5, "hsl(0 0% 50%)");
        this.game.ctx.fillStyle = lgrad;
        this.game.ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        this.game.ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
    }
    updateObject() { }
}
