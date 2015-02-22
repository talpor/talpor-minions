/* global Crafty */

var NONE = 0,
    UP = 1,
    DOWN = 2,
    LEFT = 3,
    RIGHT = 4;

var BOX_SIZE = 30;


window.onload = function() {
    //start crafty

    var states = [
	{
            'x' : {
	        hp: 12,
	        player: 1,
	        x:0,
	        y:0,
	        currentAction:{
		    name: 'move',
		    x: 0,
		    y: 1
	        }
	    },
	    'y' : {
		hp: 12,
		player: 2,
		x:19,
		y:19,
		currentAction:{
		    name: 'stay'
		}
	    }
	}
	,

	{
            'x': {
	        hp: 12,
	        player: 1,
	        x:2,
	        y:3,
	        currentAction:{
		    name: 'attack',
		    x: 1,
		    y: 0
	        }
	    }
	    ,

	    'Y': {
	        hp: 12,
	        player: 2,
	        x:19,
	        y:19,
	        currentAction:{
		    name: 'stay'
	        }
	    }
	}

    ];



    Crafty.init(600,600);

    //turn the sprite map into usable components
    Crafty.sprite(
        54, "/static/img/sprite.png", { 1: [0, 0], 2: [0, 0] }, 18, 18
    );

    /*	Crafty.sprite(54, "/static/img/sprite.png", {
     player1: [0,0],
     }, 18, 18);*/

    // method to randomy generate the map
    function generateWorld() {
        Crafty.background("url('/static/img/bg.png')");
    }

    function initMinions(state0) {
        var minionStats;
        for (var minionId in state0) {
            minionStats = state0[minionId];
	    addMinion(minionId, minionStats.player, minionStats.x, minionStats.y);
        }
    }


    //the loading screen that will display while our assets load
    Crafty.scene("loading", function() {
        //load takes an array of assets and a callback when complete
        console.log('sprite loading');

        Crafty.load(
            ["/static/img/sprite.png"],
            function () {
	        Crafty.scene("main"); //when everything is loaded, run the main scene
	    },
            function (e) { console.log('prog', e); },
            function (e) { console.log('err', e); }
        );

        // black background with some loading text
        Crafty.background("#000");
        Crafty.e("2D, DOM, Text").attr({w: 100, h: 20, x: 150, y: 120})
	    .text("Loading")
	    .css({"text-align": "center"});
    });

    //automatically play the loading scene
    Crafty.scene("loading");
    var left = false;

    Crafty.scene("main", function() {
        generateWorld();
        initMinions(states[0]);
    });
};


function renderAction(state) {
    for (var minionkey in state) {
	var minion = state[minionkey];

	var direction;
	if (minion.currentAction.x == 1) {
	    direction = RIGHT;
	} else if(minion.currentAction.x == -1) {
	    direction = LEFT;
	} else if(minion.currentAction.y == 1) {
	    direction = DOWN;
	} else if(minion.currentAction.y == -1) {
	    direction = UP;
	}


	if (minion.currentAction.name == 'move') {
	    moveMinion(minions[minionkey], direction);
	} else if (minion.currentAction.name == 'attack'){
	    //fire explosions and michael bay stuff goes here
	    attackMinion(minions[minionkey], direction);
	}
    }
}