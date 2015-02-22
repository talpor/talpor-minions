var minions = {};

function addMinion(minionId, playerNumber, xPosition, yPosition){
	console.log('ADding minions', arguments);
	//create our player entity with some premade components
	player = Crafty.e("2D, Canvas, "+playerNumber+", Controls, CustomControls, SpriteAnimation, Collision")
		.attr({w: BOX_SIZE, h: BOX_SIZE, x: xPosition*BOX_SIZE, y: yPosition*BOX_SIZE, z: 1})
	
	player._step = BOX_SIZE;
	player._moving = NONE;
	player._moved = 0;
	player._direction = RIGHT;
	player._dying = false;

	player.animate("walk_left", [[2,0], [2,1], [2,2],[2,3], [2,4]])
		.animate("walk_right", [[2,0], [2,1], [2,2],[2,3], [2,4]])
		.animate("walk_up", [[0,0], [0,1], [0,2],[0,3], [0,4]])
		.animate("walk_down", [[4,0], [4,1], [4,2],[4,3], [4,4]])

		.animate("attack_up", [[0,5], [0,6], [0,7],[0,8], [0,4]])
		.animate("attack_down", [[4,5], [4,6], [4,7],[4,8], [4,4]])
		.animate("attack_left", [[2,5], [2,6], [2,7],[2,8], [2,4]])
		.animate("attack_right", [[2,5], [2,6], [2,7],[2,8], [2,4]])
		.animate("die", [[4,9], [4,10], [4,11],[3,11]])


		.bind("EnterFrame", function(e) {
			if (player._moving != NONE){
				if (player._moving == UP){
					player.animate("walk_up", 10);
					player.y -= 1;
				} else if (player._moving == DOWN){
					player.animate("walk_down", 10);
					player.y += 1;
				} else if (player._moving == LEFT){
					if (player._direction == RIGHT){
						this.flip('X');	
						player._direction = LEFT;
					}
					this.animate("walk_left", 10);
					player.x -= 1;
				} else if (player._moving == RIGHT){
					if (player._direction == LEFT){
						this.unflip('X');	
						player._direction = RIGHT;

					}
					this.animate("walk_right", 10);
					player.x += 1;
				}
				player._moved++;
				if (player._moved == player._step){
					player._moving = NONE;
					player._moved = 0;
					player.stop();
				}
			} else {
				player._moving = NONE;
				player._moved = 0;
			}

			if (player.dying){
				player.alpha -= 0.01;

				if (player.alpha <= 0){
					player.destroy();
				}
			}
			
		})
	player.id = minionId;

	minions[minionId] = player;
}

function moveMinion(minion, direction){
	minion._moving = direction;
}

function attackMinion(player, direction){
	if(direction == "LEFT") {
		if (player._direction == RIGHT){
			player.flip('X');	
			player._direction = LEFT;
		}
		player.stop().animate("attack_left", 10);


	} else if(direction == "RIGHT") {
		if (player._direction == LEFT){
			player.unflip('X');	
			player._direction = RIGHT;
		}
		player.stop().animate("attack_right", 10);

	} else if(direction == "UP") {
		player.stop().animate("attack_up", 10);
			
	} else if(direction == "DOWN") {
		player.stop().animate("attack_down", 10);
	
	}

}

function killMinion(player, direction){
	player.stop().animate("die", 14).dying = true;;
}