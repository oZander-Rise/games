(function (Ω) {

    "use strict";

    var Pipe = Ω.Entity.extend({

        reset: false,
        counted: false,

        init: function (group, dir, x, y, speed) {
            this._super(Math.floor(x), y);
            this.group = group;
            this.w = 48;
            this.h = 320;
            this.speed = speed;
            this.dir = dir;
        },

        tick: function () {
            this.x -= this.speed;
            if (this.reset) {
                this.reset = false;
            }
            if (this.x < -this.w) {
                this.x += Math.floor(Ω.env.w * 1.45) + this.w;
                this.reset = true;
                this.counted = false;
            }
            return true;
        },

        render: function (gfx) {
            if (this.dir == "up") {
                window.game.atlas.renderCustom(
                    gfx,
                    "pipe_up",
                    this.x - 2,
                    this.y,
                    this.w + 4,
                    gfx.h - 112 - this.y,
                    0
                );
            } else {
                window.game.atlas.renderCustom(
                    gfx,
                    "pipe_down",
                    this.x - 2,
                    0,
                    this.w + 4,
                    this.h + this.y,
                    -this.y
                );
            }
        }
    });

    window.Pipe = Pipe;

}(window.Ω));