var _ = require('lodash');
var ai = require('../ai');


function DefensiveAgent(playerNumber, world) {
    ai.Agent.call(this, playerNumber);

    this.guardableSpots = [];
    for (var i = 0; i < world.length; i++)
        this.guardableSpots.push({x: i, y: world.length - i - 1});
}

DefensiveAgent.prototype = _.extend(ai.Agent.prototype, {
    constructor: ai.Agent,

    guard: {},

    getAction: function (world) {

        var self = this,
            minions = this.getMyMinions(world),
            enemiesClose = _.filter(this.getEnemyMinons(world), function (enemy) { return enemy.x + enemy.y < world.length; }),
            weakestEnemy, enemy;

        var currentMinionKeys = _.pluck(minions, 'id'),
            currentEnemiesCloseKeys = _.pluck(enemiesClose, 'id'),
            idleMinions = [],
            minionsGuardingEnemies = [],
            guardedEnemies = [];

        _.each(this.guard, function (guarded, minionKey) {
            // First remove from `guard` all dead enemies and dead minions keys
            if (currentMinionKeys.indexOf(minionKey) == -1) {
                delete guarded[minionKey];
                return;
            }
            if (guarded.id) {
                if (currentEnemiesCloseKeys.indexOf(guarded.id) == -1) {
                    delete guarded[minionKey];
                    return;
                } else {
                    minionsGuardingEnemies.push(minionKey);
                    guardedEnemies.push(guarded.id);
                }
            }
        });

        var unguardedEnemies = _.filter(enemiesClose, function (enemy) { return guardedEnemies.indexOf(enemy.id) == -1; });

        _.each(minions, function (minion) {
            // Check if I have enemies around me, so I can attack.
            weakestEnemy = _.sortBy(self.getEnemiesInRange(world, minion), 'hp')[0];
            if (weakestEnemy) {
                self.attack(
                    world, minion,
                    {
                        x: weakestEnemy.x - minion.x,
                        y: weakestEnemy.y - minion.y
                    }
                )
                return;
            }

            // If this minion is already guarding an enemy, let them
            if (minionsGuardingEnemies.indexOf(minion.id) !== -1) {
                enemy = self.guard[minion.id];
                self.walkTowards(world, minion, enemy);
                return;
            }

            // Then check if there's an enemy close that's not guarded
            if (unguardedEnemies.length) {
                enemy = unguardedEnemies.shift();
                self.guard[minion.id] = enemy;
                self.walkTowards(world, minion, enemy);
                return;
            }

            // If there are no unguarded enemies, we mark this minion as idle.
            idleMinions.push(minion);
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
        _.each(idleMinions, function (idleMinion) {
            spot = unguardedSpots.shift();
            if (!spot) return;
            self.guard[idleMinion.id] = spot;
            self.walkTowards(world, idleMinion, spot);
        });
    },

    walkTowards: function (world, minion, location) {
        this.walk(world, minion, this.getDirection(minion, location));
    }
});

module.exports = DefensiveAgent;
