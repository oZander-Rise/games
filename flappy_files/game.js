(function (Ω) {

    "use strict";

    var OmegaGame = Ω.Game.extend({

        canvas: "#board",

        fps: false,
        best: 0,

        soundOn: true,
        rate: 0,

        atlas: new Ω.SpriteAtlas("csv", "res/flappyAtlas/fb_atlas"),

        init: function (w, h, paramRate) {

            this._super(w, h);

            this.loadHi();

            Ω.evt.progress.push(function (remaining, max) {
                console.log((((max - remaining) / max) * 100 | 0) + "%");
            });

            Ω.input.bind({
                "jump": ["space", "mouse1", "touch"],
                "act": ["mouse1", "touch"]
            });

            this.rate = paramRate;
        },

        load: function () {

            this.setScreen(new TitleScreen());

        },

        loadHi: function () {
            try {
                if ("localStorage" in window) {
                    var tmp = localStorage.getItem("flapHi");
                    if (tmp) {
                        this.best = parseInt(tmp, 10) || 0;
                    }
                }
            }
            catch (e) {
                console.log("no localstorage");
                this.best = 0;
            }
        },

        saveHi: function () {
            try {
                if ("localStorage" in window) {
                    localStorage.setItem("flapHi", this.best);
                }
            } catch (e) {

            }
        },

        gotScore: function (score) {
            if (score > window.game.best) {
                window.game.best = score;
                this.saveHi();
                return true;
            }
            return false;
        }

    });

    window.OmegaGame = OmegaGame;

}(Ω));

function declOfNum(number, titles)  
{  
    cases = [2, 0, 1, 1, 1, 2];  
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  
}  

ButtonsHandler = function(e)
{
    var epos;
    if (e.type === "touchend") {
        epos = e.changedTouches ? e.changedTouches[0] : e;
    } else {
        epos = e.touches ? e.touches[0] : e;
    }

    var rect = Ω.gfx.canvas.getBoundingClientRect();

    var relX = (epos.pageX - rect.left) / game.rate,
        relY = (epos.pageY - rect.top) / game.rate;

    function isTouchInRect(x1, y1, x2, y2) {
            return (relX >= x1 && relY >= y1 &&  relX <= x2 && relY <= y2);
    }

    if (game.screen.state && game.screen.state.get() == "GAMEOVER" && game.screen.state.count > 100) {
        var isMobile = navigator.userAgent.match(/iPhone|iPad|iPod|Android/i);
        if (isTouchInRect(Ω.gfx.w / 2 + 10, Ω.gfx.h - 223,
                Ω.gfx.w / 2 + 10 + 53, Ω.gfx.h - 223 + 46)) {
            var tweetText = "Playing the original #FlappyBird at http://ozander-rise.github.io/games/." + 
                (game.screen.score > 2 ? (" Just scored " + game.screen.score + ".") : "");
            if (isMobile) {
                location.href = "twitter://post?message=" + escape(tweetText);
            } else {
                window.open(
                    "https://twitter.com/?status=" + escape(tweetText),
                    "_blank",
                    "toolbar=no,status=no,scrollbars=no,resizable=no,width=550,height=420");
            }
        } else if (isTouchInRect(Ω.gfx.w / 2 - 53 - 10, Ω.gfx.h - 223,
                Ω.gfx.w / 2 - 53 - 10 + 53, Ω.gfx.h - 223 + 46)) {
            if(navigator.language != "ru")
            {
                var fbUrl = "http://ozander-rise.github.io/games/?facebook",
                    fbTitle = "Just scored " + game.screen.score + " on Flappy Bird!",
                    fbSummary = "This game works on iOS, Android and any modern web browser. Doesn't require installation.",
                    fbImage = "http://ozander-rise.github.io/games/logo-new.png",
                    finalUrl = "http://www.facebook.com/sharer.php?s=100&p[url]=" + encodeURIComponent(fbUrl)
                        + "&p[images][0]=" + encodeURIComponent(fbImage)
                        + "&p[title]=" + encodeURIComponent(fbTitle)
                        + "&p[summary]=" + encodeURIComponent(fbSummary);
                    if (isMobile) {
                        var link = document.body.appendChild(document.createElement("a"));
                        link.href = finalUrl
                            + "&u=" + encodeURIComponent(fbUrl)
                            + "&t=" + encodeURIComponent(fbTitle);
                        link.click();
                        document.body.removeChild(link);
                    } else {
                        window.open(finalUrl,
                            "_blank",
                            "toolbar=no,status=no,scrollbars=no,resizable=no,width=550,height=420");
                    }
            }
            else
            {
                var titles = ['трубу', 'трубы', 'труб'],
                    cases = [2, 0, 1, 1, 1, 2], 
                    number = game.screen.score;

                var vkUrl = "http://ozander-rise.github.io/games/?vk",
                    vkTitle = "Я пролетел " + number + ' ' + titles[(number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5]] + " в игре Flappy Bird!",
                    vkSummary = "Игра работает на iOS, Android и любых других браузерах. Не требует установки.",
                    vkImage = "http://ozander-rise.github.io/games/logo-new.png",
                    finalUrl = "http://vkontakte.ru/share.php?[url]=" + encodeURIComponent(vkUrl)
                        + '&image='  + encodeURIComponent(vkImage)
                        + '&title=' + encodeURIComponent(vkTitle)
                        + '&description=' + encodeURIComponent(vkSummary) + '&noparse=true';
                    if (isMobile) {
                        var link = document.body.appendChild(document.createElement("a"));
                        link.href = finalUrl
                            + "&u=" + encodeURIComponent(vkUrl)
                            + "&t=" + encodeURIComponent(vkTitle);
                        link.click();
                        document.body.removeChild(link);
                    } else {
                        window.open(finalUrl,
                            "_blank",
                            "toolbar=no,status=no,scrollbars=no,resizable=no,width=550,height=420");
                    }
            }
        } else if (isTouchInRect(85, Ω.gfx.h - 169, 85 + 116, Ω.gfx.h - 169 + 70)) {
            window.game.setScreen(new MainScreen(), {type:"inout", time: 50});
        }
    }

    //disable scroll
    if (e.target == window.boardFg)
        e.preventDefault();
    else if (window.Ω) {
        Ω.input.reset();
    }
}

document.addEventListener("touchstart", ButtonsHandler);
document.addEventListener("click", ButtonsHandler);

if (navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)) {
    audioDummy = new Ω.Sound("res/audio/sfx_wing", 1);
    intervalDummy = setInterval(function() {
        if (audioDummy._loaded) {
            clearInterval(intervalDummy);
            audioDummy.play();
        }
    }, 100);
    funcDummy = function()
    {
        audioDummy.play();
        document.removeEventListener("touchstart", funcDummy);
        document.removeEventListener("click", funcDummy);
    }
    document.addEventListener("touchstart", funcDummy);
    document.addEventListener("click", funcDummy);
}