import { InfiniteScrollingBackground } from './infiniteScrollingBackground.js';

export class MountainsHigh extends InfiniteScrollingBackground {


    constructor(ctx) {

        super(ctx);

        this.velocity = 1;
        this.spritesheetUrl = 'spritesheets/mountains_high1.png';

    }

}