/* global Crafty */

(function(global) {
    'use strict';

    function addViking(vikingId, playerNumber, xPosition, yPosition){

        // create our player entity with some premade components
        var player = Crafty.e('2D, Canvas, ' + playerNumber +
                              ', Controls, CustomControls, ' +
                              'SpriteAnimation, Collision')
                .attr({
                    w: global.BOX_SIZE,
                    h: global.BOX_SIZE,
                    x: xPosition*global.BOX_SIZE,
                    y: yPosition*global.BOX_SIZE,
                    z: 1
                });

        player._step = global.BOX_SIZE;
        player._moving = global.NONE;
        player._moved = 0;
        player._direction = global.RIGHT;
        player._dying = false;

        player
            .animate('walk_left', [[2,0], [2,1], [2,2],[2,3], [2,4]])
            .animate('walk_right', [[2,0], [2,1], [2,2],[2,3], [2,4]])
            .animate('walk_up', [[0,0], [0,1], [0,2],[0,3], [0,4]])
            .animate('walk_down', [[4,0], [4,1], [4,2],[4,3], [4,4]])

            .animate('walk_up_right', [[1,0], [1,1], [1,2],[1,3], [1,4]])
            .animate('walk_down_right', [[3,0], [3,1], [3,2],[3,3], [3,4]])
            .animate('walk_up_left', [[1,0], [1,1], [1,2],[1,3], [1,4]])
            .animate('walk_down_left', [[3,0], [3,1], [3,2],[3,3], [3,4]])

            .animate('attack_up', [[0,5], [0,6], [0,7],[0,8], [0,4]])
            .animate('attack_down', [[4,5], [4,6], [4,7],[4,8], [4,4]])
            .animate('attack_left', [[2,5], [2,6], [2,7],[2,8], [2,4]])
            .animate('attack_right', [[2,5], [2,6], [2,7],[2,8], [2,4]])

            .animate('attack_up_right', [[1,5], [1,6], [1,7],[1,8], [1,4]])
            .animate('attack_down_right', [[3,5], [3,6], [3,7],[3,8], [3,4]])
            .animate('attack_up_left', [[1,5], [1,6], [1,7],[1,8], [1,4]])
            .animate('attack_down_left', [[1,5], [1,6], [1,7],[1,8], [1,4]])
            .animate('die', [[4,9], [4,10], [4,11],[3,11]])

        .bind('EnterFrame', function() {
            if (player._moving != global.NONE) {
                if (player._moving == global.UP) {
                    player.animate('walk_up', 1);
                    player.y -= 1;
                } else if (player._moving == global.DOWN) {
                    player.animate('walk_down', 1);
                    player.y += 1;
                } else if (player._moving == global.LEFT) {
                    if (player._direction == global.RIGHT) {
                        this.flip('X');
                        player._direction = global.LEFT;
                    }
                    this.animate('walk_left', 1);
                    player.x -= 1;
                } else if (player._moving == global.RIGHT) {
                    if (player._direction == global.LEFT) {
                        this.unflip('X');
                        player._direction = global.RIGHT;
                    }
                    this.animate('walk_right', 1);
                    player.x += 1;

                } else if (player._moving == global.UPRIGHT) {
                    if (player._direction == global.LEFT) {
                        this.unflip('X');
                        player._direction = global.RIGHT;
                    }
                    this.animate('walk_up_right', 1);
                    player.x += 1;
                    player.y -= 1;
                } else if (player._moving == global.UPLEFT) {
                    if (player._direction == global.RIGHT) {
                        this.flip('X');
                        player._direction = global.LEFT;
                    }
                    this.animate('walk_up_left', 1);
                    player.x -= 1;
                    player.y -= 1;
                } else if (player._moving == global.DOWNRIGHT) {
                    if (player._direction == global.LEFT) {
                        this.unflip('X');
                        player._direction = global.RIGHT;
                    }
                    this.animate('walk_down_right', 1);
                    player.x += 1;
                    player.y += 1;
                } else if (player._moving == global.DOWNLEFT) {
                    if (player._direction == global.RIGHT) {
                        this.flip('X');
                        player._direction = global.LEFT;
                    }
                    this.animate('walk_down_left', 1);
                    player.x -= 1;
                    player.y += 1;
                }

                player._moved++;
                if (player._moved == player._step) {
                    player._moving = global.NONE;
                    player._moved = 0;
                //    player.stop();
                }
            } else {
                player._moving = global.NONE;
                player._moved = 0;
            }

            if (player.dying) {
                player.alpha -= 0.01;

                if (player.alpha <= 0){
                    var id = player.id;
                    player.destroy();
                    delete(global.vikings[id]);

                }
            }

        });

        player.id = vikingId;
        player.owner = playerNumber;

        global.vikings[vikingId] = player;
    }

    function moveViking(viking, direction){
        global.animationsRunning++;
        viking.bind('AnimationEnd', global.onAnimationEnds);
        viking._moving = direction;
    }

    function attackViking(viking, direction){
        global.animationsRunning++;
        viking.bind('AnimationEnd', global.onAnimationEnds);
        if(direction == global.LEFT) {
            if (viking._direction == global.RIGHT){
                viking.flip('X');
                viking._direction = global.LEFT;
            }
            viking.animate('attack_left', 1);
        } else if(direction == global.RIGHT) {
            if (viking._direction == global.LEFT){
                viking.unflip('X');
                viking._direction = global.RIGHT;
            }
            viking.animate('attack_right', 1);

        } else if(direction == global.UP) {
            viking.animate('attack_up', 1);

        } else if(direction == global.DOWN) {
            viking.animate('attack_down', 1);

        } else if(direction == global.UPLEFT) {
            if (viking._direction == global.RIGHT){
                viking.flip('X');
                viking._direction = global.LEFT;
            }
            viking.animate('attack_up_left', 1);

        }  else if(direction == global.UPRIGHT) {
            if (viking._direction == global.LEFT){
                viking.unflip('X');
                viking._direction = global.RIGHT;
            }
            viking.animate('attack_up_right', 1);

        } else if(direction == global.DOWNLEFT) {
            if (viking._direction == global.RIGHT){
                viking.flip('X');
                viking._direction = global.LEFT;
            }
            viking.animate('attack_down_left', 1);

        }  else if(direction == global.DOWNRIGHT) {
            if (viking._direction == global.LEFT){
                viking.unflip('X');
                viking._direction = global.RIGHT;
            }
            viking.animate('attack_down_right', 1);
        }
    }

    function winner(playerNumber){

      var winner = Crafty.e('2D, Canvas, ' + playerNumber )
            .attr({
                w: 400,
                h: 400,
                x: 25,
                y: 150,
                z: 10
            }).sprite(5,0);

        var deal =  Crafty.e('2D, Canvas, dealWithIt') .attr({
                w: 60,
                h: 10,
                x: 270,
                y: 150,
                z: 11,
                alpha: 0
            }).bind('EnterFrame', function() {
                if( this.y < 202){
                    this.y+=1;
                    this.alpha += 0.025;
                }
            });

    }

    global.vikingCraft = {
        add: addViking,
        move: moveViking,
        attack: attackViking,
        setWinner: winner
    };
})(window);
