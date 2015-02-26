/* global module */

var _ = require('lodash'),
    ai = require('ai'),
    math = require('math');

/**
 * SimpleAgent:
 *
 * Very basic agent that makes all units/vikings walk towards the
 * enemy base, and if they find an enemy in their way, they'll fight
 * it to death!
 *
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
             * the best way to get to the enemy base.
             */
            var directionToBase = math.getDirection(viking, enemyBase);
            var unoccupiedDirection = self.isDirectionUnoccupied(
                                                        world, viking, directionToBase);

            // If we found an unoccupied direction, we walk to it.
            if (unoccupiedDirection) {
                self.walk(world, viking, directionToBase);
            }
        });

    }

});

module.exports = SimpleAgent;
