(function (Ω) {

    "use strict";

    var Bird = Ω.Entity.extend({
        w: 25,
        h: 5,

        rx: 14,
        ry: 11,

        ac: 0,
        jumpAc: -2.8,
        maxGravity: 8,
        gravityAc: 0.335,

        color: 0,

        state: null,
        flapping: 100,

        font: new Ω.Font("res/flapfont.png", 16, 22, "abcdefghijklmnopqrstuvwxyz"),
        font2: new Ω.Font("res/flapfont2.png", 16, 21, "abcdefghijklmnopqrstuvwxyz"),

        sounds: {
            "hit": new Ω.Sound("res/audio/sfx_hit", 1),
            "die": new Ω.Sound("res/audio/sfx_die", 1),
            "wing": new Ω.Sound("res/audio/sfx_wing", 1)
        },

        words: [
            "cursed", "anguish", "frustration", "jumping", "triumph", "crazed", "elated", "wizard",
            "irritate", "terrified", "drumroll", "dishearten", "depress", "annoying", "vexatious",
            "trying", "troubled", "unpleasant", "failing", "unhappy", "falling", "chopsticks", "thwarts",
            "disappoint", "infuriate", "jubilant", "pleasurable", "festive", "rapturous", "joyful",
            "gratified", "beaming", "radiant", "fortunate", "delighted", "gleeful", "cheerful", "chirpy",
            "optimist", "vivacious", "jaunty", "carefree", "bouncy", "quizzical", "searching", "amusing",
            "eccentric", "speaker", "mocking", "gracious", "flippant", "frivolous", "danger", "accident",
            "unhealthy", "wicked", "dynamite", "elbow", "flapping", "gliding", "carpet", "pineapple",
            "transport", "museum", "keyboard", "trigonometry", "airmail", "downtown", "encyclopedia",
            "hacksaw", "knowledge", "kettledrum"
            ],
        curWord: "",
        nextWord: "",
        curIdx: 0,

        init: function (x, y, screen) {
            this.curWord = this.chooseWord();
            this.nextWord = this.chooseWord();
            this._super(x, y);
            this.screen = screen;
            this.state = new Ω.utils.State("BORN");
        },

        tick: function () {
            this.state.tick();
            switch (this.state.get()) {
                case "BORN":
                    this.state.set("CRUISING");
                    break;
                case "CRUSING":
                    this.y += Math.sin(Date.now() / 150) * 0.70;
                    this.flapping = 150;
                    break;
                case "RUNNING":
                    if (this.state.first()) {
                        this.ac = this.jumpAc + this.jumpAc;
                        this.flapping = 75;
                        this.sounds.wing.play();
                    }
                    var oldy = this.y;
                    this.ac = Math.min(this.ac + this.gravityAc, this.maxGravity);
                    this.y = Math.max(-40, this.y + this.ac);

                    if (Ω.input.pressed("jump")) {
                       this.ac = this.jumpAc + this.jumpAc;
                       this.sounds.wing.play();
                    }

                    if (this.y > Ω.env.h - 112 - this.h) {
                        this.y = oldy;
                        this.die();
                    }
                    break;
                case "DYING":
                    this.ac = Math.min(this.ac + 0.4, 10);
                    if (this.y < Ω.env.h - 112 - this.h) {
                        this.y += this.ac;
                    }
                    this.flapping = 0;
                    break;
            }
        },

        handleKeys: function () {
            var rightKey = false;
            if (Ω.input.lastKey) {
                if (String.fromCharCode(Ω.input.lastKey).toLowerCase() === this.curWord[this.curIdx]){
                    this.ac = -7;
                    this.curIdx++;
                    if (this.curIdx > this.curWord.length - 1) {
                        this.curIdx = 0;
                        this.curWord = this.nextWord;
                        this.nextWord = this.chooseWord();
                    }
                    rightKey = true;
                }
                Ω.input.lastKey = null;
            }
            return rightKey;
        },

        chooseWord: function () {
            return this.words[(Math.random() * (this.words.length)) | 0];
        },

        setColor: function (color) {
            this.color = color;
        },

        die: function () {
            if (this.screen.state.is("RUNNING")) {
                this.sounds.hit.play();
                this.sounds.die.play();
                this.screen.state.set("DYING");
                this.state.set("DYING");
                this.ac = 0;
            }
        },

        hit: function (p) {
            this.die();
        },

        render: function (gfx) {

            var c = gfx.ctx,
                angle = this.ac - 6;

            if (angle > 1)
                angle = Math.pow(angle, 2.5);
            angle = angle / (angle > 0 ? 3 : 10); 
            angle = Math.max(angle, -0.4);
            angle = Math.atan(angle);
            if (!this.ac)
                angle = 0;

            window.game.atlas.render(
                gfx,
                "bird" + this.color + "_" + Ω.utils.toggle(this.flapping, 3),
                this.x - 23,
                this.y - 24,
                angle
                );
        }
    });

    window.Bird = Bird;

}(window.Ω));