/* global process */

var _ = require('lodash'),
    fs = require('fs'),
    uuid = require('node-uuid'),
    config = require('./config'),
    unit = require('./units/common'),
    Player = require('./player'),
    World = require('./world');


function Game() {
    var self = this;
    this.tickNumber = 0;
    this.playerNumber = 1;
    this.units = {};

    /*
     * Parse arguments
     */
    var agents = _.map(process.argv.slice(2), function (arg) {
        return './agents/' + arg;
    });
    var Agent1 = require(agents[0]),
        Agent2 = require(agents[1]);

    /*
     * New World
     */
    this.world = new World(config.worldSize);

    /*
     * Players
     */
    this.player1 = new Player(1, Agent1);
    this.player2 = new Player(2, Agent2);

    /*
     * Set units in place
     */
    this.newUnit(this.player1, unit.Minion, 0, 4)
    this.newUnit(this.player1, unit.Minion, 2, 4)
    this.newUnit(this.player1, unit.Minion, 4, 4)
    this.newUnit(this.player1, unit.Minion, 4, 2)
    this.newUnit(this.player1, unit.Minion, 4, 0)

    this.newUnit(this.player2, unit.Minion, 15, 19)
    this.newUnit(this.player2, unit.Minion, 15, 17)
    this.newUnit(this.player2, unit.Minion, 15, 15)
    this.newUnit(this.player2, unit.Minion, 17, 15)
    this.newUnit(this.player2, unit.Minion, 19, 15)
}


/**
 * Main game method.
 *
 * Runs the game's loop until it's finished.
 */
Game.prototype.start = function () {
    var states = new Array();

    while (!this.finished()) {
        /*
         * Is it time to add new units?
         */
        this.addNewUnits();

        /*
         * Current player moves.
         */
        var state = this.executeActions(
            this.getCurrentPlayer().agent._doTurn(this.world.safeClone())
        );
        states.push(state);
    }

    // Write results to some json file
    var jsonFileName = '/tmp/' + uuid.v4() + '.json';
    var str = JSON.stringify({
        winner: this.getWinner(),
        states: states
    }) + '\n';
    fs.writeFile(jsonFileName, str, function () {
        return jsonFileName;
    });
};

/**
 * Swaps the current player.
 */
Game.prototype.getCurrentPlayer = function () {
    this.playerNumber = (this.playerNumber + 1) % 2;
    return this['player' + (this.playerNumber + 1)];
};


/**
 * Returns a bool value, did the game end?
 */
Game.prototype.finished = function () {
    this.tickNumber++;
    return this.player1.baseHP < 0 || this.player2.baseHP < 0 ||
        this.tickNumber > config.maxGameTicks;
};


/**
 * Adds a single new unit for a specific player.
 */
Game.prototype.newUnit = function (player, unitConstructor, x, y) {
    var u = this.world.addUnit(unitConstructor, x, y);
    player.addUnit(u);
    this.units[u.id] = u;

};

/**
 * Adds new units if the time is right.
 */
Game.prototype.addNewUnits = function () {
    if ((this.tickNumber % config.newUnitsNumberOfTicks) !== 0)

        return;
};


/**
 * Returns who won the game, or null if draw.
 */
Game.prototype.getWinner = function () {
    if (this.player1.baseHP < 0) return 2;
    else if (this.player2.baseHP < 0) return 1;

    if (this.player1.units.length < this.player2.units.length) return 2;
    else if (this.player1.units.length > this.player2.units.length) return 1;

    return null;
};


/**
 * Executes actions for both players.
 *
 * Returns the current state for all of the game units in play.
 */
Game.prototype.executeActions = function (actions) {
    var self = this;

    var state = {};
    _.each(self.units, function (unit, unitID) {
        if (unit.isDead())
            delete self.units[unitID];

        state[unit.id] = unit.getStats();
    });

    _.each(actions, function (action, unitID) {
        var unit = self.units[unitID];
        if (!self.world.isValidAction(unit, action)) return;

        self.world.execAction(unit, action);
        state[unitID].action = action;
    });

    return state;
};

new Game().start();
