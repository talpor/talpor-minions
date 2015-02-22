RED = 0;
BLUE = 1;

minionTextures = [PIXI.Texture.fromImage("static/img/redminion.png"), PIXI.Texture.fromImage("static/img/minion.png")];
var startPoints = [{x: 50, y:50}, {x: 550, y: 550}];

var minions = {};

var unit = {
	id: 'x',
	range: 1,
	hp: 12,
	attack: 4,
	currentAction:{
		name: 'attack',
		target:{
			x: 2,
			y: 3,
		}
	}
};

var initState = [
	[{	id: 'x',
		range: 1,
		hp: 12,
		attack: 4,
		position: {
			x:2,
			y:2,
		}
	}
	],
	[{	id: 'y',
		range: 1,
		hp: 12,
		attack: 4,
		position: {
			x:18,
			y:18,
		}
	},
	]
];

var states = [
	{   'x' : {
			hp: 12,
			player: 0,
			position: {
				x:2,
				y:2,
			},
			currentAction:{
				name: 'move',
				target:{
					x: 0,
					y: 1,
				}
			}
		},
	 	'y' : {
			hp: 12,
			player: 1,
			position: {
				x:18,
				y:18,
			},
			currentAction:{
				name: 'stay',
			}
		}
	}
	,
	
		{'x': {
			hp: 12,
			player: 0,
			position: {
				x:2,
				y:3,
			},
			currentAction:{
				name: 'stay',
			}
		}
		,

		'x2': {
			hp: 12,
			player: 0,
			position: {
				x:3,
				y:2,
			},
			currentAction:{
				name: 'stay',
			}
		}
		}
	
];


POS_SIZE = 25;
SPEED = 1;
FRAMES = POS_SIZE / SPEED;
STEP =  POS_SIZE / FRAMES;


function addMinion(player, unit){

	var minion = new PIXI.Sprite(minionTextures[player]);

	// center the sprites anchor point
	minion.anchor.x = 0.5;
	minion.anchor.y = 0.5;
	minion.uuid = unit.id;
	
	// move the sprite t the center of the screen
	minion.position.x = unit.position.x * POS_SIZE;
	minion.position.y = unit.position.y * POS_SIZE;
	minion.width = POS_SIZE;
	minion.height = POS_SIZE;
	minions[unit.id] = minion;
	stage.addChild(minion);
}


// create an new instance of a pixi stage
var stage = new PIXI.Stage(0x66FF99);

// create a renderer instance
var renderer = PIXI.autoDetectRenderer(500, 500);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

requestAnimFrame( animate );


// create a texture from an image path
// create a new Sprite using the texture


function init(){

	 var background = new PIXI.Sprite(PIXI.Texture.fromImage('static/img/background.jpg'));
	// background.anchor.x = 0.5;
	// background.anchor.y = 0.5;
	
	
	// move the sprite t the center of the screen
	background.position.x = 0;
	background.position.y = 0;
	background.width = 500;
	background.height = 500;

	stage.addChild(background);

	for (var i in initState){
		var playerState = initState[i];
		for (var j in playerState){
		//	console.log(playerState[j]);
			addMinion(i, playerState[j]);
		}
		
	}
    //renderer.render(stage);
}


function renderAction(state){
	for (var key in state) {
		unit = state[key];
//		console.log(unit);

		if (unit.currentAction.name == 'move'){
			minions[key].position.x += unit.currentAction.target.x*STEP;
			minions[key].position.y += unit.currentAction.target.y*STEP;
		} else if (unit.currentAction.name == 'attack'){
			//fire explosions and michael bay stuff goes here
		}
	}
}

function checkAliveMinions(oldMinions, currentMinions){
	console.log(oldMinions, currentMinions);
	for (var i in oldMinions){
		if (currentMinions.indexOf(oldMinions[i]) == -1){
			//dead minion
			console.log(oldMinions[i]);

			minions[oldMinions[i]].alpha -= 0.2;
		}
	}

	for (var j in currentMinions){
		if (oldMinions.indexOf(currentMinions[i]) == -1){
			addMinion(states[stateIndex][currentMinions[i]].player, states[stateIndex][currentMinions[i]]);
			//new minion
		}
	}
}


var started = false;
var stateIndex = 0;
var frame = 0;

function animate() {

	if(!started){
		init();
		started = true;
	} else {

		if(stateIndex < states.length){
			renderAction(states[stateIndex]);
			if(stateIndex > 0){
				var oldMinions = Object.keys(states[stateIndex-1]);
				var currentMinions = Object.keys(states[stateIndex]);
				checkAliveMinions(oldMinions, currentMinions);
				
			}
				
	
			if (frame == 24){
				stateIndex++;
			}
			frame = (frame + 1)% 25;
		}
		
	}


    requestAnimFrame( animate );


    // just for fun, lets rotate mr rabbit a little
    //bunny.rotation += 0.1;
	
    // render the stage   
    renderer.render(stage);
}

