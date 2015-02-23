/* global $, Crafty */

(function (global, minionCraft) {
    'use strict';
    var stateIndex = 0;

    var initEngine = function() {
        Crafty.init(600, 600);

        Crafty.scene('main', function() {
            Crafty.background('url("/static/img/bg.png")');
            Crafty.e('2D, Canvas, redHome').attr({x: 15, y: 15, w: 90, h:90, z: 2});
            Crafty.e('2D, Canvas, blueHome').attr({x: (30*17-15), y: (30*17-15), w: 90, h:90, z: 2});

            initMinions(global.states[0]);
            renderAction(global.states[0]);
        });

        //the loading screen that will display while our assets load
        Crafty.scene('loading', function() {
            Crafty.load(
                [
                    '/static/img/chavestias.png',
                    '/static/img/miraflores.png',
                    '/static/img/escualidos.png',
                    '/static/img/ramoverde.png'
                ],
                initGame,
                function () {},
                function (e) { console.log('err', e); }
            );

            // black background with some loading text
            Crafty.background('#000');
            Crafty.e('2D, DOM, Text').attr({w: 100, h: 20, x: 150, y: 120})
                .text('Loading')
                .css({'text-align': 'center'});
        });
        //automatically play the loading scene
        Crafty.scene('loading');
    };


    function initGame() {
        Crafty.sprite(54, '/static/img/chavestias.png', { 1: [0, 0] }, 18, 18);
        Crafty.sprite(54, '/static/img/escualidos.png', { 2: [0, 0] }, 18, 18);
        Crafty.sprite(92, '/static/img/miraflores.png', { redHome: [0, 0] });
        Crafty.sprite(92, '/static/img/ramoverde.png', { blueHome: [0, 0] });

        $.ajax(
            '/play/' + global.scope.armies[0] + '/' + global.scope.armies[1],
            {
                aync: true,
                contentType: 'application/json',
                dataType: 'json',
                success: function(game) {
                    global.states = game.states;
                    Crafty.scene('main');
                }
            }
        );
    }


    function onAnimationEnds() {
        global.animationsRunning--;
        if (global.animationsRunning === 0) {
            stateIndex++;
            if (stateIndex < global.states.length) {
                setTimeout(function () {
                    renderAction(global.states[stateIndex])
                }, 100);
            }
        }
    }


    function renderAction(state) {
        if (stateIndex + 1 < global.states.length) checkAliveMinions();

        for (var minionkey in state) {
            var minion = state[minionkey],
                direction;
            if (minion.action) {
                if (minion.action.dx == 1 && minion.action.dy == 1) {
                    direction = global.DOWNRIGHT;
                } else if (minion.action.dx == -1 && minion.action.dy == 1){
                    direction = global.DOWNLEFT;
                } else if (minion.action.dx == -1 && minion.action.dy == -1){
                    direction = global.UPLEFT;
                } else if (minion.action.dx == 1 && minion.action.dy == -1){
                    direction = global.UPRIGHT;
                } else if (minion.action.dx == 1) {
                    direction = global.RIGHT;
                } else if(minion.action.dx == -1) {
                    direction = global.LEFT;
                } else if(minion.action.dy == 1) {
                    direction = global.DOWN;
                } else if(minion.action.dy == -1) {
                    direction = global.UP;
                }
                if (minion.action.name == 'walk') {
                    minionCraft.move(global.minions[minionkey], direction);
                } else if (minion.action.name == 'attack'){
                    //fire explosions and michael bay stuff goes here
                    minionCraft.attack(global.minions[minionkey], direction);
                }
            }
        }
    }


    function initMinions(state0) {
        var minionStats;
        for (var minionId in state0) {
            minionStats = state0[minionId];
            minionCraft.add(minionId, minionStats.player, minionStats.x, minionStats.y);
        }
    }


    /*
     * Utils
     */
    var killMinion = function (minion) {
        global.animationsRunning++;
        minion.bind('AnimationEnd', onAnimationEnds);
        minion.animate('die', 1).dying = true;
    };

    var checkAliveMinions = function() {
        var oldMinions = Object.keys(global.states[stateIndex]),
            currentMinions = Object.keys(global.states[stateIndex+1]);

        oldMinions.forEach(function(minion) {
            if (currentMinions.indexOf(minion) == -1) {
                killMinion(global.minions[minion]);
            }
        });
        currentMinions.forEach(function(minion) {
            if (oldMinions.indexOf(minion) == -1) {  // new minion
                var newMinion = global.states[stateIndex+1][minion];
                minionCraft.add(newMinion.id, newMinion.player, newMinion.x, newMinion.y);
            }
        });
    };

    global.onAnimationEnds = onAnimationEnds;
    global.game = {
        initEngine: initEngine
    };

}(window, window.minionCraft));
