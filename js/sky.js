import { InfiniteScrollingBackground } from './infiniteScrollingBackground.js';

export class Sky extends InfiniteScrollingBackground {

    constructor(ctx) {

        super(ctx);

        this.velocity = 0.7;
        this.spritesheetUrl = 'spritesheets/sky.png';
    }

}