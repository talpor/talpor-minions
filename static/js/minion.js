minions = {};
animationsRunning = 0;

function addMinion(minionId, playerNumber, xPosition, yPosition){
    console.log('Adding minions', arguments);

    // create our player entity with some premade components
    var player = Crafty.e("2D, Canvas, "+playerNumber+", Controls, CustomControls, SpriteAnimation, Collision")
	    .attr({w: BOX_SIZE, h: BOX_SIZE, x: xPosition*BOX_SIZE, y: yPosition*BOX_SIZE, z: 1})

    player._step = BOX_SIZE;
    player._moving = NONE;
    player._moved = 0;
    player._direction = RIGHT;
    player._dying = false;

    player
        .animate("walk_left", [[2,0], [2,1], [2,2],[2,3], [2,4]])
	.animate("walk_right", [[2,0], [2,1], [2,2],[2,3], [2,4]])
	.animate("walk_up", [[0,0], [0,1], [0,2],[0,3], [0,4]])
	.animate("walk_down", [[4,0], [4,1], [4,2],[4,3], [4,4]])
	
	.animate("walk_up_right", [[1,0], [1,1], [1,2],[1,3], [1,4]])
	.animate("walk_down_right", [[3,0], [3,1], [3,2],[3,3], [3,4]])
	.animate("walk_up_left", [[1,0], [1,1], [1,2],[1,3], [1,4]])
	.animate("walk_down_left", [[3,0], [3,1], [3,2],[3,3], [3,4]])


	.animate("attack_up", [[0,5], [0,6], [0,7],[0,8], [0,4]])
	.animate("attack_down", [[4,5], [4,6], [4,7],[4,8], [4,4]])
	.animate("attack_left", [[2,5], [2,6], [2,7],[2,8], [2,4]])
	.animate("attack_right", [[2,5], [2,6], [2,7],[2,8], [2,4]])

	.animate("attack_up_right", [[1,5], [1,6], [1,7],[1,8], [1,4]])
	.animate("attack_down_right", [[3,5], [3,6], [3,7],[3,8], [3,4]])
	.animate("attack_up_left", [[1,5], [1,6], [1,7],[1,8], [1,4]])
	.animate("attack_down_left", [[1,5], [1,6], [1,7],[1,8], [1,4]])


	.animate("die", [[4,9], [4,10], [4,11],[3,11]])


	.bind("EnterFrame", function(e) {

            // console.log('player', player, playerNumber, 'entering frame');


	    if (player._moving != NONE) {
			if (player._moving == UP) {
			    player.animate("walk_up", 1);
			    player.y -= 1;
			} else if (player._moving == DOWN) {
			    player.animate("walk_down", 1);
			    player.y += 1;
			} else if (player._moving == LEFT) {
			    if (player._direction == RIGHT) {
					this.flip('X');
					player._direction = LEFT;
			    }
			    this.animate("walk_left", 1);
			    player.x -= 1;
			} else if (player._moving == RIGHT) {
			    if (player._direction == LEFT) {
					this.unflip('X');
					player._direction = RIGHT;
			    }
			    this.animate("walk_right", 1);
			    player.x += 1;
			
			} else if (player._moving == UPRIGHT) {
			    if (player._direction == LEFT) {
					this.unflip('X');
					player._direction = RIGHT;
			    }
			    this.animate("walk_up_right", 1);
			    player.x += 1;
			    player.y -= 1;
			} else if (player._moving == UPLEFT) {
			    if (player._direction == RIGHT) {
					this.flip('X');
					player._direction = LEFT;
			    }
			    this.animate("walk_up_left", 1);
			    player.x -= 1;
			    player.y -= 1;
			} else if (player._moving == DOWNRIGHT) {
			    if (player._direction == LEFT) {
					this.unflip('X');
					player._direction = RIGHT;
			    }
			    this.animate("walk_down_right", 1);
			    player.x += 1;
			    player.y += 1;
			} else if (player._moving == DOWNLEFT) {
			    if (player._direction == RIGHT) {
					this.flip('X');
					player._direction = LEFT;
			    }
			    this.animate("walk_down_left", 1);
			    player.x -= 1;
			    player.y += 1;
			}

			player._moved++;
			if (player._moved == player._step) {
			    player._moving = NONE;
			    player._moved = 0;
			//    player.stop();
			}
	    } else {
		player._moving = NONE;
		player._moved = 0;
	    }

	    if (player.dying) {
		player.alpha -= 0.01;

		if (player.alpha <= 0){
		    player.destroy();
		}
	    }

	})

    player.id = minionId;

    minions[minionId] = player;
}

function onAnimationEnds(e){
	if(stateIndex > 0){
		var oldMinions = Object.keys(states[stateIndex-1]);
		var currentMinions = Object.keys(states[stateIndex]);
		checkAliveMinions(oldMinions, currentMinions);
	}

	animationsRunning--;
	console.log('ANIMATIONS REMAININNG', e, animationsRunning);	
	
	if (animationsRunning == 0){
		stateIndex++;
		if (stateIndex < states.length){
			 setTimeout(function(){ renderAction(states[stateIndex]); }, 500);

	        
	    }

	}
}

function moveMinion(minion, direction){
	animationsRunning++;
	minion.bind("AnimationEnd", onAnimationEnds);

	minion._moving = direction;
}

function attackMinion(minion, direction){
	animationsRunning++;
	minion.bind("AnimationEnd", onAnimationEnds);

	if(direction == LEFT) {
		if (minion._direction == RIGHT){
			minion.flip('X');
			minion._direction = LEFT;
		}
		minion.animate("attack_left", 1);
	} else if(direction == RIGHT) {
		if (minion._direction == LEFT){
			minion.unflip('X');
			minion._direction = RIGHT;
		}
		minion.animate("attack_right", 1);

	} else if(direction == UP) {
		minion.animate("attack_up", 1);

	} else if(direction == DOWN) {
		minion.animate("attack_down", 1);

	} else if(direction == UPLEFT) {
		if (minion._direction == RIGHT){
			minion.flip('X');
			minion._direction = LEFT;
		}
		minion.animate("attack_up_left", 1);

	}  else if(direction == UPRIGHT) {
		if (minion._direction == LEFT){
			minion.unflip('X');
			minion._direction = RIGHT;
		}
		minion.animate("attack_up_right", 1);

	} else if(direction == DOWNLEFT) {
		if (minion._direction == RIGHT){
			minion.flip('X');
			minion._direction = LEFT;
		}
		minion.animate("attack_down_left", 1);
		
	}  else if(direction == DOWNRIGHT) {
		if (minion._direction == LEFT){
			minion.unflip('X');
			minion._direction = RIGHT;
		}
		minion.animate("attack_down_right", 1);
	}



}

function killMinion(minion, direction){
	animationsRunning++;
	minion.bind("AnimationEnd", onAnimationEnds);

	minion.animate("die", 1).dying = true;;
}

function checkAliveMinions(oldMinions, currentMinions){
	console.log(oldMinions, currentMinions);
	for (var i in oldMinions){
		if (currentMinions.indexOf(oldMinions[i]) == -1){
			//dead minion
			console.log(oldMinions[i]);

			killMinion(minions[oldMinions[i]]);
		}
	}

	for (var j in currentMinions){
		if (oldMinions.indexOf(currentMinions[j]) == -1){
			var newMinion = states[stateIndex][currentMinions[j]];
			addMinion(newMinion.id, newMinion.player, newMinion.x, newMinion.y);
			//new minion
		}
	}
}
