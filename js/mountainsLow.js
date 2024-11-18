import { InfiniteScrollingBackground } from './infiniteScrollingBackground.js';

export class MountainsLow extends InfiniteScrollingBackground {


    constructor(ctx) {

        super(ctx);

        this.velocity = 1.5;
        this.spritesheetUrl = 'spritesheets/mountains_low1.png';
    }

}