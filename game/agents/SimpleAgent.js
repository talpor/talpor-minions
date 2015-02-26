var _ = require('lodash');
var ai = require('../ai');

/**
 * SimpleAgent:
 *
 * Very basic agent that makes all units/vikings walk towards the
 * enemy base, and if they find an enemy in their way, they'll fight
 * it to death!
 *
 * If vikings find an obstacle in their way, they will try to find the
 * best possible move to avoid it.
 */

function SimpleAgent(playerNumber) {
    ai.Agent.call(this, playerNumber);
    this.name = 'SimpleAgent';
}

SimpleAgent.prototype = _.extend({}, ai.Agent.prototype, {

    constructor: SimpleAgent,

    getAction: function (world) {
        var self = this,
            enemyBase = this.getEnemyBase(world)[0],
            weakestEnemy;

        /*
         * For every viking will do an action.
         */
        _.each(this.getMyVikings(world), function (viking) {
            /*
             * If there are enemies around/in range, we will select
             * the weakest sorting by hp.
             */
            weakestEnemy = _.sortBy(self.getEnemiesInRange(world, viking), 'hp')[0];
            if (weakestEnemy) {
                // and attack!
                self.attackTarget(world, viking, weakestEnemy);
                return;
            }

            /*
             * No enemies vikings close, so we will try to figure out
             * the best way to get to the enemy base, trying to avoid
             * collisions with other vikings or obstacles.
             */
            var closerUnoccupiedToBase = self.getDirection(viking, enemyBase);
            var unoccupiedDirection = self.isDirectionUnoccupied(
                                                        world, viking, closerUnoccupiedToBase);

            // If we found an unoccupied direction, we walk to it.
            if (unoccupiedDirection) {
                self.walk(world, viking, closerUnoccupiedToBase);
            }
            else {
                var direction,
                    minDistance = self.getDistanceFromDirection(
                        viking,
                        {x: -1 * closerUnoccupiedToBase.x, y: -1 * closerUnoccupiedToBase.y},
                        enemyBase
                    ),
                    allDirections = [
                        {x: 1, y: 1},
                        {x: 1, y: 0},
                        {x: 1, y: -1},
                        {x: 0, y: 1},
                        {x: 0, y: -1},
                        {x: -1, y: -1},
                        {x: -1, y: 0},
                        {x: -1, y: 1}
                    ];
                while ((direction = allDirections.shift())) {
                    if (self.getDistanceFromDirection(viking, direction, enemyBase) < minDistance &&
                        self.isDirectionUnoccupied(world, viking, direction)) {
                        minDistance = self.getDistanceFromDirection(viking, direction, enemyBase);
                        closerUnoccupiedToBase = direction;
                        unoccupiedDirection = true;
                    }
                }
            }

        });

    }

});

module.exports = SimpleAgent;
