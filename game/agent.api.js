var Agent = function(player) {
        this.player = player;
    },
    directions = {
        n: {x: 0, y: -1},
        s: {x: 0, y: 1},
        e: {x: 1, y: 0},
        w: {x: -1, y: 0},
    };

Agent.prototype = {
    constructor: Agent,

    _doTurn: function (world) {
        this.actions = {};
        this.world = world;
        this.getAction();
        return this.actions;
    },

    getMyMinons: function(world) {
        var myMinons = [];
        world.forEach(function(col) {
            col.forEach(function(tile) {
                if (tile && tile.player === this.player) {
                    myMinons.push(tile);
                }
            });
        });
        return myMinons;
    },
    getMyBase: function(world) {
        // pass
    },
    getEnemyMinons: function(world) {
        var enemyMinons = [];
        world.forEach(function(col) {
            col.forEach(function(tile) {
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
    isUnoccupied: function(world, x, y) {
        return Boolean(world[x][y]);
    },
    getDistance: function(world, loc1, loc2) {
        // pass
    },
    walk: function(world, minion, dir) {
        this.actions[minion.id] = {
            name: 'walk',
            x: directions[dir].x,
            y: directions[dir].y
        };
    },
    attack: function(world, minion, dir) {
        this.actions[minion.id] = {
            name: 'attack',
            x: directions[dir].x,
            y: directions[dir].y
        };
    }
};

module.exports = Agent;
