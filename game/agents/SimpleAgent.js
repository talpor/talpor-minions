var _ = require('lodash');
var ai = require('../ai');


function SimpleAgent(playerNumber) {
    ai.Agent.call(this, playerNumber);
    this.name = 'SimpleAgent';
}

SimpleAgent.prototype = _.extend(ai.Agent.prototype, {

    constructor: ai.Agent,

    getAction: function (world) {
        var self = this,
            weakestEnemy;

        _.each(this.getMyVikings(world), function (viking) {
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

            _.each(ai.DIRECTIONS, function (direction) {
                if (self.isDirectionUnoccupied(world, viking, direction)) {
                    self.walk(world, viking, direction);
                    return;
                }
            });
        });

    }

});

module.exports = SimpleAgent;
