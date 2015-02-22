var _ = require('lodash');


var Agent = function(player) {
    this.player = player;
};

Agent.prototype = {
    constructor: Agent,

    /**
     * Asks for the players public API to obtain possible actions,
     * invoking `getAction`.
     *
     * Every action is store in `this.actions` object, which is a
     * brand new object every time this method gets called.
     *
     * Private method, keep it this way.
     */
    _doTurn: function (world) {
        this.actions = {};
        this.world = world;
        this.getAction();
        return this.actions;
    },

    /**
     * Returns a list with the player's current minions.
     */
    getMyMinions: function(world) {
        var self = this,
            myMinons = [];

        _.each(world, function(col) {
            _.each(col, function(tile) {
                if (tile && tile.player === self.player) {
                    myMinons.push(tile);
                }
            });
        });

        return myMinons;
    },

    getMyBase: function(world) {
        // pass
    },

    /**
     * Returns a list with the enemy's current minions.
     */
    getEnemyMinons: function(world) {
        var self = this,
            enemyMinons = [];

        _.each(world, function(col) {
            _.each(col, function(tile) {
                if (tile && tile.player !== this.player) {
                    enemyMinons.push(tile);
                }
            });
        });

        return enemyMinons;
    },

    getEnemyBase: function(world) {
        // pass
    },

    /**
     * Returns true if a given `direction` for the given `minion` is
     * not occupied in the current `world`. False otherwise.
     */
    isDirectionUnoccupied: function(world, minion, dir) {
        return !Boolean(world[minion.x + dir.x][minion.y + dir.y]);
    },

    getDistance: function(world, loc1, loc2) {
        // pass
    },

    /**
     * Stores a 'walk' action into the private `_actions` attr.
     */
    walk: function(world, minion, dir) {
        this.actions[minion.id] = {
            name: 'walk',
            x: dir.x,
            y: dir.y
        };
    },

    /**
     * Stores an 'attack' action into the private `_actions` attr.
     */
    attack: function(world, minion, dir) {
        this.actions[minion.id] = {
            name: 'attack',
            x: dir.x,
            y: dir.y
        };
    }
};

module.exports = {
    Agent: Agent,
    DIRECTIONS: {
        N: {x: 0, y: -1},
        S: {x: 0, y: 1},
        E: {x: 1, y: 0},
        W: {x: -1, y: 0},
        NE: {x: 1, y: -1},
        SE: {x: 1, y: 1},
        SW: {x: -1, y: 1},
        NW: {x: -1, y: -1}
    }
};
