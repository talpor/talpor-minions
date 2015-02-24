var _ = require('lodash');
var ai = require('../ai');


function DefensiveAgent(playerNumber, world) {
    ai.Agent.call(this, playerNumber);

    this.name = 'DefensiveAgent';

    this.guardableSpots = [];
    for (var i = 0; i < world.length; i++)
        this.guardableSpots.push({x: i, y: world.length - i - 1});
}

DefensiveAgent.prototype = _.extend({}, ai.Agent.prototype, {
    constructor: ai.Agent,

    guard: {},

    getAction: function (world) {

        var self = this,
            vikings = this.getMyVikings(world),
            enemiesClose = _.filter(this.getEnemyMinons(world), function (enemy) { return enemy.x + enemy.y < world.length; }),
            weakestEnemy, enemy;

        var currentVikingKeys = _.pluck(vikings, 'id'),
            currentEnemiesCloseKeys = _.pluck(enemiesClose, 'id'),
            idleVikings = [],
            vikingsGuardingEnemies = [],
            guardedEnemies = [];

        _.each(this.guard, function (guarded, vikingKey) {
            // First remove from `guard` all dead enemies and dead vikings keys
            if (currentVikingKeys.indexOf(vikingKey) == -1) {
                delete guarded[vikingKey];
                return;
            }
            if (guarded.id) {
                if (currentEnemiesCloseKeys.indexOf(guarded.id) == -1) {
                    delete guarded[vikingKey];
                    return;
                } else {
                    vikingsGuardingEnemies.push(vikingKey);
                    guardedEnemies.push(guarded.id);
                }
            }
        });

        var unguardedEnemies = _.filter(enemiesClose, function (enemy) { return guardedEnemies.indexOf(enemy.id) == -1; });

        _.each(vikings, function (viking) {
            // Check if I have enemies around me, so I can attack.
            weakestEnemy = _.sortBy(self.getEnemiesInRange(world, viking), 'hp')[0];
            if (weakestEnemy) {
                self.attack(
                    world, viking,
                    {
                        x: weakestEnemy.x - viking.x,
                        y: weakestEnemy.y - viking.y
                    }
                )
                return;
            }

            // If this viking is already guarding an enemy, let them
            if (vikingsGuardingEnemies.indexOf(viking.id) !== -1) {
                enemy = self.guard[viking.id];
                self.walkTowards(world, viking, enemy);
                return;
            }

            // Then check if there's an enemy close that's not guarded
            if (unguardedEnemies.length) {
                enemy = unguardedEnemies.shift();
                self.guard[viking.id] = enemy;
                self.walkTowards(world, viking, enemy);
                return;
            }

            // If there are no unguarded enemies, we mark this viking as idle.
            idleVikings.push(viking);
        });

        var unguardedSpots = [], guarded;
        _.each(self.guardableSpots, function (spot) {
            guarded = false;
            _.each(self.guard, function (guardedSpot) {
                if (guardedSpot.x == spot.x && guardedSpot.y == spot.y) guarded = true;
            });
            if (!guarded)
                unguardedSpots.push(spot);
        });
        unguardedSpots = _.shuffle(unguardedSpots);
        var spot;
        _.each(idleVikings, function (idleViking) {
            spot = unguardedSpots.shift();
            if (!spot) return;
            self.guard[idleViking.id] = spot;
            self.walkTowards(world, idleViking, spot);
        });
    }
});

module.exports = DefensiveAgent;
