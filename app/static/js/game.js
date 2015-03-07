/* global $, _, Crafty, LZString */

(function (global, vikingCraft, baseCraft) {
    'use strict';
    var stateIndex = 0;

    var initEngine = function (gameUrl) {
        global.scope.playing = true;
        Crafty.init(global.BOX_SIZE*20, global.BOX_SIZE*20);
        $('#cr-stage').css({'height': '300px'});
        $('#cr-stage').slideDown();

        Crafty.scene('main', function() {
            Crafty.background('url("/static/img/bg.png")');

            initBases(global.states[stateIndex]);
            initVikings(global.states[stateIndex]);
            renderAction();
        });

        //the loading screen that will display while our assets load
        Crafty.scene('loading', function() {
            Crafty.load(
                [
                    '/static/img/chavestias.png',
                    '/static/img/miraflores.png',
                    '/static/img/escualidos.png',
                    '/static/img/ramoverde.png',
                    '/static/img/fire.png',
                    '/static/img/explosion.png',
                    '/static/img/deal.png'
                ],
                initGame.bind(null, gameUrl),
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


    function initGame(gameUrl) {
        Crafty.sprite(54, '/static/img/chavestias.png', { 2: [0, 0] }, 18, 18);
        Crafty.sprite(54, '/static/img/escualidos.png', { 1: [0, 0] }, 18, 18);
        Crafty.sprite(92, '/static/img/miraflores.png', { redHome: [0, 0] });
        Crafty.sprite(92, '/static/img/ramoverde.png', { blueHome: [0, 0] });
        Crafty.sprite(32, '/static/img/fire.png', { fire: [0, 0] });
        Crafty.sprite(315,230, '/static/img/explosion.png', { boom: [0, 0] });
        Crafty.sprite(100,20, '/static/img/deal.png', { dealWithIt: [0, 0] });

        $.ajax(
            gameUrl,
            {
                dataType: 'text',
                success: function(gzippedGame, status, xhr) {
                    var game = JSON.parse(
                        LZString.decompressFromUTF16(gzippedGame)
                    );

                    //console.log(game.id, game.winner, game.players[0].agent, game.players[1].agent);
                    global.scope.result = {
                        id: game.id,
                        winner: game.winner,
                        player0: game.players[0],
                        player1: game.players[1]
                    };

                    global.states = game.states;
                    global.winner = game.winner;
                    global.loser = (game.winner == 2 ? 1 : 2);
                    Crafty.scene('main');
                }
            }
        );
    }

    function onAnimationEnds() {
        global.scope.gameProgress = stateIndex + '/' + global.states.length;
        global.animationsRunning--;
        if (global.animationsRunning === 0) {
            if (stateIndex < global.states.length) {
                setTimeout(function () {
                    renderAction();
                }, global.scope.gameSpeed);
            } else {
                global.bases[global.loser].explode();
                setTimeout(function () {
                    vikingCraft.setWinner(global.winner);
                }, 2000);
            }
        }
    }

    function renderAction(state, force) {

        if (global.scope.gameSpeed === 0 && !force ||
            stateIndex >= global.states.length) return;

        state = state || global.states[stateIndex];

        if (stateIndex + 1 < global.states.length) {
            checkAliveVikings();
            global.bases[1].hp = state.bases[1];
            global.bases[2].hp = state.bases[2];
        }
        var idles = 0,
            vikings = 0;
        for (var vikingkey in state.units) {
            global.vikings[vikingkey].hp = state.units[vikingkey].hp;
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
                } else if (viking.action.dx == -1) {
                    direction = global.LEFT;
                } else if (viking.action.dy == 1) {
                    direction = global.DOWN;
                } else if (viking.action.dy == -1) {
                    direction = global.UP;
                }
                if (viking.action.please == 'walk') {
                    vikingCraft.move(global.vikings[vikingkey], direction);
                } else if (viking.action.please == 'attack') {
                    // fire explosions and michael bay stuff goes here
                    vikingCraft.attack(global.vikings[vikingkey], direction);
                }
            } else {
                idles++;
            }
            vikings++;
        }

        if (idles == vikings && stateIndex < global.states.length) {
            while (++stateIndex < global.states.length) {
                if (_.any(global.states[stateIndex].units, function (unit) { return unit.action !== undefined })) break;
            }
            renderAction();
        }
        stateIndex++;
    }
    global.nextTurn = renderAction.bind(null, null, true);

    function initBases(state0){
        baseCraft.add(1, 'blueHome', 15, 15);
        baseCraft.add(2, 'redHome', (30*17-15), (30*17-15));
        global.bases[1]._baseHP = state0.bases[1];
        global.bases[2]._baseHP = state0.bases[2];
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
        stop: stopEngine,
        goToState: function(state) {
            if (isNaN(Number(state))) return;
            var currentSpeed = global.scope.gameSpeed;
            global.scope.gameSpeed = 0;

            vikingCraft.clean();
            baseCraft.clean();
            stateIndex = Number(state);
            initBases(global.states[stateIndex]);
            initVikings(global.states[stateIndex]);

            global.animationsRunning = 0;
            global.scope.gameSpeed = currentSpeed;
            renderAction(null, true);
        }
    };

}(window, window.vikingCraft, window.baseCraft));
