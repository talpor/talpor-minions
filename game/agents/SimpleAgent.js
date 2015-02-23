var _ = require('lodash');
var uuid = require('node-uuid');
var ai = require('../ai');


function MyAgent(playerNumber) {
    ai.Agent.call(this, playerNumber);
}

MyAgent.prototype = _.extend(ai.Agent.prototype, {

    constructor: ai.Agent,

    getAction: function (world) {
        var self = this,
            weakestEnemy;

        _.each(this.getMyMinions(world), function (minion) {
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

            _.each(ai.DIRECTIONS, function (direction) {
                if (self.isDirectionUnoccupied(world, minion, direction)) {
                    self.walk(world, minion, direction);
                    return;
                }
            });
        });

    }

});

module.exports = MyAgent;
