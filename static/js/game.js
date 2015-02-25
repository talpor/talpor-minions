/* global $, Crafty */

(function (global, vikingCraft) {
    'use strict';
    var stateIndex = 0;

    var initEngine = function() {
        Crafty.init(600, 600);
        $('#cr-stage').css({'height': '300px'});
        $('#cr-stage').slideDown();
        Crafty.scene('main', function() {
            Crafty.background('url("/static/img/bg.png")');
            Crafty.e('2D, Canvas, redHome').attr({x: 15, y: 15, w: 90, h:90, z: 2});
            Crafty.e('2D, Canvas, blueHome').attr({x: (30*17-15), y: (30*17-15), w: 90, h:90, z: 2});

            initVikings(global.states[0]);
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
            '/play/' + global.scope.selectedArmies[0] + '/' +
                       global.scope.selectedArmies[1],
            {
                aync: true,
                contentType: 'application/json',
                dataType: 'json',
                success: function(game) {
                    console.log(game.winner, game.players[0].agent, game.players[1].agent);
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
        if (stateIndex + 1 < global.states.length) checkAliveVikings();

        for (var vikingkey in state.units) {
            var viking = state.units[vikingkey],
                direction;
            if (viking.action) {
                if (viking.action.dx == 1 && viking.action.dy == 1) {
                    direction = global.DOWNRIGHT;
                } else if (viking.action.dx == -1 && viking.action.dy == 1){
                    direction = global.DOWNLEFT;
                } else if (viking.action.dx == -1 && viking.action.dy == -1){
                    direction = global.UPLEFT;
                } else if (viking.action.dx == 1 && viking.action.dy == -1){
                    direction = global.UPRIGHT;
                } else if (viking.action.dx == 1) {
                    direction = global.RIGHT;
                } else if(viking.action.dx == -1) {
                    direction = global.LEFT;
                } else if(viking.action.dy == 1) {
                    direction = global.DOWN;
                } else if(viking.action.dy == -1) {
                    direction = global.UP;
                }
                if (viking.action.please == 'walk') {
                    vikingCraft.move(global.vikings[vikingkey], direction);
                } else if (viking.action.please == 'attack'){
                    //fire explosions and michael bay stuff goes here
                    vikingCraft.attack(global.vikings[vikingkey], direction);
                }
            }
        }
    }


    function initVikings(state0) {
        var vikingStats;
        for (var vikingId in state0.units) {
            vikingStats = state0.units[vikingId];
            vikingCraft.add(vikingId, vikingStats.player, vikingStats.x, vikingStats.y);
        }
    }


    /*
     * Utils
     */
    var killViking = function (viking) {
        global.animationsRunning++;
        viking.bind('AnimationEnd', onAnimationEnds);
        viking.animate('die', 1).dying = true;
    };

    var checkAliveVikings = function() {
        var oldVikings = Object.keys(global.states[stateIndex].units),
            currentVikings = Object.keys(global.states[stateIndex+1].units);

        oldVikings.forEach(function(viking) {
            if (currentVikings.indexOf(viking) == -1) {
                killViking(global.vikings[viking]);
            }
        });
        currentVikings.forEach(function(viking) {
            if (oldVikings.indexOf(viking) == -1) {  // new viking
                var newViking = global.states[stateIndex+1].units[viking];
                vikingCraft.add(newViking.id, newViking.player, newViking.x, newViking.y);
            }
        });
    };

    function stopEngine() {}

    global.onAnimationEnds = onAnimationEnds;
    global.engine = {
        init: initEngine,
        stop: stopEngine
    };

}(window, window.vikingCraft));
