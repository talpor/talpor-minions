/* global Crafty */

(function(global) {
    'use strict';

    function addBase(baseId, playerBase, xPosition, yPosition) {
        // create our player entity with some premade components
        var base = Crafty.e('2D, Canvas, ' + playerBase +
                              ', SpriteAnimation, Collision')
                .attr({
                    w: global.BOX_SIZE*3,
                    h: global.BOX_SIZE*3,
                    x: xPosition,
                    y: yPosition,
                    z: 2
                });

        var barBaseWidth =  global.BOX_SIZE*3*(4/5);
        base.hpBarBkgd = Crafty.e('2D, Canvas, Color')
             .color('white')
             .attr({z:10, x: base.x-1+global.BOX_SIZE/4, y: base.y-1, w: barBaseWidth+2, h: global.BOX_SIZE/10+2});

        base.hpBar = Crafty.e('2D, Canvas, Color')
             .color('green')
             .attr({z:11, x: base.x+global.BOX_SIZE/4, y: base.y, w: barBaseWidth, h: global.BOX_SIZE/10});

        base.fire = Crafty.e('2D, Canvas, fire, SpriteAnimation, Collision')
                .attr({
                    w: 0,
                    h: 0,
                    x: xPosition+global.BOX_SIZE/2,
                    y: yPosition+global.BOX_SIZE/5,
                    z: 3,
                    alpha: 0
                }).animate('burning', [[0,0], [1,0], [2,0], [0,0]])
               .bind('EnterFrame', function() {
                    base.fire.animate('burning', 1);
               });
            base.fire.animationSpeed = 0.005;

            base.fire.hp = 96;
            base.fire._baseHP = 96;
            base.fire._defaultX = xPosition;
            base.fire._defaultY = yPosition;

            base.fire.bind('EnterFrame', function() {
                base.hpBar.w = barBaseWidth*(base.hp/base._baseHP);
                           // console.log(base.hp, base._baseHP);
                if(base.hp / base._baseHP < 0.3){
                    //burning as hell
                    base.hpBar.color('red');

                    if (this.w < global.BOX_SIZE / 0.75){
                        //if flame is too small
                        this.w++;
                        this.h++;
                    }
                    if (this.xPosition < this._defaultX+global.BOX_SIZE/2){
                        this.xPosition+=1;
                    }
                    if (this.yPosition < this._defaultY+global.BOX_SIZE/5){
                        this.yPosition+=1;
                    } 
                    if (this.alpha < 1){
                        this.alpha += 0.01;
                    }

                } else if(base.hp / base._baseHP < 0.8){
                    base.hpBar.color('#df691a');

                    //burning, but not as hell
                    if (this.w < global.BOX_SIZE / 1.5){
                        //if flame is too small
                        this.w++;
                        this.h++;
                    } else if (this.w > global.BOX_SIZE / 1.75){
                        //if flame is too big
                        this.w--;
                        this.h--;
                    }
                    if (this.xPosition < this._defaultX+global.BOX_SIZE/2){
                        this.xPosition+=1;
                    }
                    if (this.yPosition < this._defaultY+global.BOX_SIZE/5){
                        this.yPosition+=1;
                    } 
                    if (this.alpha < 1){
                        this.alpha += 0.01;
                    }
                } else {
                    if (this.alpha > 0){
                        this.alpha -= 0.01;
                    }
                }
            });

            base.explode = function(){
                base.hpBar.w = 0;

                var boom = Crafty.e('2D, Canvas, boom, SpriteAnimation')
                .attr({
                    w: global.BOX_SIZE*6,
                    h: global.BOX_SIZE*5,
                    x: base.x-2*global.BOX_SIZE,
                    y: base.y-2*global.BOX_SIZE,
                    z: 5,
                }).bind('EnterFrame', function() {
                    if (base.alpha > 0.01 ){
                        base.alpha -= 0.02;
                        base.fire.alpha -= 0.02;
                        player.hpBarBkgd.alpha -= 0.02;

                    } else {
                        base.alpha = 0;
                        base.fire.alpha = 0;
                    }
                })
                .animate('kaboom', [[0,0], [1,0], [2,0], [3,0], [4,0], 
                                    [0,1], [1,1], [2,1], [3,1], [4,1],
                                    [0,2], [1,2], [2,2], [3,2], [4,2],
                                    [0,3], [1,3], [2,3], [3,3], [4,3],
                                    [0,4], [1,4], [2,4]]);
            
                boom.animate('kaboom',1);
            };

        base.id = baseId;

        global.bases[baseId] = base;
    }

    function removeBases() {
        for (var key in global.bases) {
            global.bases[key].hpBarBkgd.destroy();
            global.bases[key].hpBar.destroy();
            if (global.bases[key].fire) {
                global.bases[key].fire.destroy();
            }
            global.bases[key].destroy();
        }
    }

    global.baseCraft = {
        add: addBase,
        clean: removeBases
    };
})(window);
