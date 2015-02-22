/* global process */

var _ = require('lodash'),
    fs = require('fs'),
    uuid = require('node-uuid'),
    config = require('./config'),
    unit = require('./unit'),
    utils = require('./utils'),
    World = require('./world');


function Game() {
    var self = this;
    this.tickNumber = 0;
    this.player = 1;

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
     * Agents
     */
    this.player1 = {
        agent: new Agent1(),
        baseHP: config.tower.hp * 4,
        units: [
            new unit.Minion(1, 0, 4),
            new unit.Minion(1, 2, 4),
            new unit.Minion(1, 4, 4),
            new unit.Minion(1, 4, 2),
            new unit.Minion(1, 4, 0)
        ]
    };
    this.player2 = {
        agent: new Agent2(),
        baseHP: config.tower.hp * 4,
        units: [
            new unit.Minion(2, 15, 19),
            new unit.Minion(2, 15, 17),
            new unit.Minion(2, 15, 15),
            new unit.Minion(2, 17, 15),
            new unit.Minion(2, 19, 15)
        ]
    };

    _.each(this.player1.units, function (minion) {
        self.world.setUnit(minion.x, minion.y, minion)
    });
    _.each(this.player2.units, function (minion) {
        self.world.setUnit(minion.x, minion.y, minion)
    });
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
         * Current player moves.
         */
        var state = this.executeActions(
            this.getCurrentPlayer().agent.getAction(this.world.safeClone())
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


Game.prototype.getCurrentPlayer = function () {
    this.player = (this.player + 1) % 2;
    return this['player' + (this.player + 1)];
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

    _.each(actions, function (action, unitID) {
        var unit = self.units[unitID];

        if (!self.world.isValidAction(unit, action)) return;
        self.world.execAction(unit, action);
    });
};

new Game().start();
