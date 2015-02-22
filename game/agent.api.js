var Agent = function(world) {
    this.actions = {};
    this.world = world;
};

Agent.prototype = {
    constructor: Agent,
    getMyMinons: function() {
        // pass
    },
    getMyBase: function() {
        // pass
    },
    getEnemyMinons: function() {
        // pass
    },
    getEnemyBase: function() {
        // pass
    },
    getTile: function(x, y) {
        return this.world[x][y];
    },
    isUnoccupied: function(location) {
        // pass
    },
    isPassable: function(location) {
        // pass
    },
    getDistance: function(loc1, loc2) {
        // pass
    },
    getWorld: function() {
        return this.world;
    },
    walk: function(minion, x, y) {
        this.actions[minion.id] = {
            name: 'walk',
            x: x,
            y: y
        };
    },
    attack: function(minion, x, y) {
        this.actions[minion.id] = {
            name: 'attack',
            x: x,
            y: y
        };
    }
};