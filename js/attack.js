import { Sprite } from './sprite.js';

export class Attack {

    constructor(ctx, imageUrl) {
        this.ctx = ctx;
        this.gameWidth = ctx.canvas.width;
        this.gameHeight = ctx.canvas.height;
        this.horizontalOffset = 1;
        this.imageUrl = 'spritesheets/attack.png';
        this.x;
        this.y;

        this.velocity = 55;

        this.isActive = false;
    }

    load(loadingFinished) {

        this.image = new Image();

        this.image.addEventListener('load', () => {
            this.height = this.image.height;
            this.width = this.image.width;
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height - parseInt(this.gameHeight * 0.20);

            loadingFinished();
        });
        this.image.src = this.imageUrl;
    }
    update(speed) {
        this.x = this.velocity * speed;
        // speed++;
        // this.velocity++;
    }
    reset() {
        this.isActive = false;
        this.x = this.gameWidth;
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y);
    }
}