/* global $, Crafty */

(function(global) {
    'use strict';
    var stateIndex = 0;

    var initEngine = function() {

        $.ajax('/play/' + global.scope.armies[0] + '/' + global.scope.armies[1], {
            aync: true,
            contentType: 'application/json',
            dataType: 'json',
            success: function(game) {
                global.states = game.states;
            }
        });

        Crafty.init(600,600);

        //turn the sprite map into usable components
        Crafty.sprite(
            54, '/static/img/chavestias.png', { 1: [0, 0] }, 18, 18
        );
        Crafty.sprite(
            54, '/static/img/escualidos.png', { 2: [0, 0] }, 18, 18
        );
        Crafty.sprite(
            92, '/static/img/miraflores.png', { redHome: [0, 0] } 
        );
        Crafty.sprite(
            92, '/static/img/ramoverde.png', { blueHome: [0, 0] } 
        );

        // method to randomy generate the map
        function generateWorld() {
            Crafty.background('url("/static/img/bg.png")');
            
            Crafty.e('2D, Canvas, redHome')
                    .attr({x: 15, y: 15, w: 90, h:90, z: 2});
            Crafty.e('2D, Canvas, blueHome')
                    .attr({x: (30*17-15), y: (30*17-15), w: 90, h:90, z: 2});
        }
        //the loading screen that will display while our assets load
        Crafty.scene('loading', function() {
            //load takes an array of assets and a callback when complete
            Crafty.load(
                ['/static/img/chavestias.png', 
                '/static/img/miraflores.png',
                '/static/img/escualidos.png',
                '/static/img/ramoverde.png'],
                function () {
                Crafty.scene('main'); //when everything is loaded, run the main scene
            },
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

        Crafty.scene('main', function() {
            generateWorld();

        });
    };

    function onAnimationEnds() {
        var killMinion = function(minion){
                global.animationsRunning++;
                minion.bind('AnimationEnd', onAnimationEnds);

                minion.animate('die', 1).dying = true;
            },
            checkAliveMinions = function(oldMinions, currentMinions) {
                oldMinions.forEach(function(minion) {
                    if (currentMinions.indexOf(minion) == -1) {
                        killMinion(global.minions[minion]);
                    }
                });
                currentMinions.forEach(function(minion) {
                    //console.log(oldMinions);
                    if (oldMinions.indexOf(minion) == -1) {
                        var newMinion = global.states[stateIndex][minion];
                        global.addMinion(newMinion.id, newMinion.player, newMinion.x, newMinion.y);
                        //new minion
                    }
                });
            };
        if (stateIndex > 0) {
            var oldMinions = Object.keys(global.states[stateIndex-1]),
                currentMinions = Object.keys(global.states[stateIndex]);
            checkAliveMinions(oldMinions, currentMinions);
        }
        global.animationsRunning--;
        if (global.animationsRunning === 0){
            stateIndex++;
            if (stateIndex < global.states.length){
                 setTimeout(function(){ renderAction(global.states[stateIndex]); }, 500); 
            }
        }
    }

    function renderAction(state) {
        for (var minionkey in state) {
            var minion = state[minionkey],
                direction;
            if (minion.action){
                if (minion.action.dx == 1 && minion.action.dy == 1){
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
                    global.moveMinion(global.minions[minionkey], direction);
                } else if (minion.action.name == 'attack'){
                    //fire explosions and michael bay stuff goes here
                    global.attackMinion(global.minions[minionkey], direction);
                }
            }
        }
    }
    function initMinions(state0) {
        var minionStats;
        for (var minionId in state0) {
            minionStats = state0[minionId];
            global.addMinion(minionId, minionStats.player, minionStats.x, minionStats.y);
        }
    }

    function startGame() {
        stateIndex = 0;
        initMinions(global.states[0]);
        renderAction(global.states[stateIndex]);
    }

    global.renderAction = renderAction;
    global.startGame = startGame;
    global.initEngine = initEngine;
    global.onAnimationEnds = onAnimationEnds;
}(window));
