var _ = require('lodash'),
    config = require('./config');


var Agent = function(playerNumber) {
    this.playerNumber = playerNumber;
};

Agent.prototype = {
    constructor: Agent,

    /**
     * Asks for the agent's public API to obtain possible actions,
     * invoking `getAction`.
     *
     * Every action is stored in `this._actions` object, which is a
     * brand new object every time this method gets called.
     *
     * Private method, keep it this way.
     */
    _doTurn: function (world) {
        this._actions = {};
        this.getAction(world);
        return this._actions;
    },

    /**
     * Returns a list of units. They can be of a specific `kind`. If
     * `own` is true, this method will return only the current
     * player's units, if not, it will return their enemies. `own` is
     * true by default.
     */
    _getUnits: function (world, kind, own) {
        var self = this,
            units = [];

        if (_.isUndefined(own)) own = true;

        _.each(world, function(col) {
            _.each(col, function(tile) {
                if (!tile) return;
                if (own && tile.player !== this.playerNumber) return;
                if (!own && tile.player === this.playerNumber) return;
                if (kind && tile.kind !== kind) return;

                units.push(tile);
            });
        });

        return units;
    },

    /**
     * Returns a world's tile or false if position is invalid
     */
    getTile: function (world, x, y) {
        if (x < 0 || x >= config.worldSize || y < 0 || y >= config.worldSize) return false;
        return world[x][y];
    },

    /**
     * Returns a list with the player's current minions.
     */
    getMyMinions: function (world) {
        return this._getUnits(world, 'moving');
    },

    getMyBase: function(world) {
        return this._getUnits(world, 'stationary');
    },

    /**
     * Returns a list with the enemy's current minions.
     */
    getEnemyMinons: function(world) {
        return this._getUnits(world, 'moving', false);
    },

    getEnemyBase: function(world) {
        return this._getUnits(world, 'stationary', false);
    },

    /**
     * Returns true if a given `direction` for the given `minion` is
     * not occupied in the current `world`. False otherwise.
     */
    isDirectionUnoccupied: function(world, minion, dir) {
        var tile = this.getTile(world, minion.x + dir.x, minion.y + dir.y)
        return !Boolean(tile || tile == false);
    },

    getDistance: function(world, loc1, loc2) {
        // pass
    },

    /**
     * Stores a 'walk' action into the private `_actions` attr.
     */
    walk: function(world, minion, dir) {
        this._actions[minion.id] = {
            name: 'walk',
            dx: dir.x,
            dy: dir.y
        };
    },

    /**
     * Stores an 'attack' action into the private `_actions` attr.
     */
    attack: function(world, minion, dir) {
        this._actions[minion.id] = {
            name: 'attack',
            dx: dir.x,
            dy: dir.y
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
