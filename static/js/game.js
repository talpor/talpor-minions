/* global $, console, moveMinion, attackMinion, minions, Crafty, addMinion */
/* exported NONE, BOX_SIZE, startGame */

var t, states;
$.ajax('/play/i7/i7', {
    aync: true,
    contentType: 'application/json',
    dataType: 'json',
    success: function(game) {
        t = game;
        states = t.states;
    }
});

var NONE = 0,
    UP = 1,
    DOWN = 2,
    LEFT = 3,
    RIGHT = 4,
    UPRIGHT = 5,
    DOWNRIGHT = 6,
    UPLEFT = 7,
    DOWNLEFT = 8;


var BOX_SIZE = 30;
var stateIndex = 0;

window.onload = function() {

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
		
		Crafty.e("2D, Canvas, redHome")
				.attr({x: 15, y: 15, w: 90, h:90, z: 2});
		Crafty.e("2D, Canvas, blueHome")
				.attr({x: (30*17-15), y: (30*17-15), w: 90, h:90, z: 2});
	

    }




    //the loading screen that will display while our assets load
    Crafty.scene('loading', function() {
        //load takes an array of assets and a callback when complete
        console.log('sprite loading');

        Crafty.load(
            ['/static/img/chavestias.png', 
            '/static/img/miraflores.png',
            '/static/img/escualidos.png',
            '/static/img/ramoverde.png'],
            function () {
            Crafty.scene('main'); //when everything is loaded, run the main scene
        },
            function (e) { console.log('prog', e); },
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


function renderAction(state) {
    for (var minionkey in state) {
        var minion = state[minionkey];

        var direction;
        if (minion.action){
            if (minion.action.dx == 1 && minion.action.dy == 1){
                direction = DOWNRIGHT;
            } else if (minion.action.dx == -1 && minion.action.dy == 1){
                direction = DOWNLEFT;
            } else if (minion.action.dx == -1 && minion.action.dy == -1){
                direction = UPLEFT;
            } else if (minion.action.dx == 1 && minion.action.dy == -1){
                direction = UPRIGHT;
            } else if (minion.action.dx == 1) {
                direction = RIGHT;
            } else if(minion.action.dx == -1) {
                direction = LEFT;
            } else if(minion.action.dy == 1) {
                direction = DOWN;
            } else if(minion.action.dy == -1) {
                direction = UP;
            }
        
            if (minion.action.name == 'walk') {
                moveMinion(minions[minionkey], direction);
            } else if (minion.action.name == 'attack'){
                //fire explosions and michael bay stuff goes here
                attackMinion(minions[minionkey], direction);
            }
        }

    
    }
}

function initMinions(state0) {
    var minionStats;
    for (var minionId in state0) {
        minionStats = state0[minionId];
    addMinion(minionId, minionStats.player, minionStats.x, minionStats.y);
    }
}

function startGame (){
    stateIndex = 0;

    initMinions(states[0]);

    renderAction(states[stateIndex]);

}