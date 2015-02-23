/* global process */

var _ = require('lodash'),
    fs = require('fs'),
    uuid = require('node-uuid'),
    config = require('./config'),
    unit = require('./units/common'),
    Player = require('./player'),
    World = require('./world');


function Game() {
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
    this.player1 = new Player(1, this.world, Agent1);
    this.player2 = new Player(2, this.world, Agent2);

    /*
     * Sets bases  -- TO-DO: Find a automatic way to select good places to place bases.
     */
    this.newUnit(this.player1, unit.Base, 1, 1);
    this.newUnit(this.player1, unit.Base, 1, 2);
    this.newUnit(this.player1, unit.Base, 2, 1);
    this.newUnit(this.player1, unit.Base, 2, 2);

    this.newUnit(this.player2, unit.Base, 17, 17);
    this.newUnit(this.player2, unit.Base, 17, 18);
    this.newUnit(this.player2, unit.Base, 18, 17);
    this.newUnit(this.player2, unit.Base, 18, 18);

    /*
     * Set units in place
     */
    this.newUnit(this.player1, unit.Viking, 0, 4);
    this.newUnit(this.player1, unit.Viking, 2, 4);
    this.newUnit(this.player1, unit.Viking, 4, 4);
    this.newUnit(this.player1, unit.Viking, 4, 2);
    this.newUnit(this.player1, unit.Viking, 4, 0);

    this.newUnit(this.player2, unit.Viking, 15, 19);
    this.newUnit(this.player2, unit.Viking, 15, 17);
    this.newUnit(this.player2, unit.Viking, 15, 15);
    this.newUnit(this.player2, unit.Viking, 17, 15);
    this.newUnit(this.player2, unit.Viking, 19, 15);
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
        this.currentPlayer = this.getCurrentPlayer();
        var state = this.executeActions(
            this.currentPlayer.agent._doTurn(this.world.safeClone())
        );

        states.push(state);
    }

    // Write results to some json file
    var jsonFileName = '/tmp/' + uuid.v4() + '.json';
    var winner = this.getWinner();
    winner = winner ? winner.number : null;
    var str = JSON.stringify({
        winner: winner,
        states: states
    }) + '\n';
    fs.writeFile(jsonFileName, str, function () {
        return jsonFileName;
    });
    process.stdout.write(jsonFileName);
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
    return this.player1.isDead() || this.player2.isDead() || this.tickNumber > config.maxGameTicks;
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
 * Removes a unit from the game using its unitID
 */
Game.prototype.killUnit = function (unitID, actions) {
    var player = this.units[unitID].player,
        x = this.units[unitID].x,
        y = this.units[unitID].y;

    delete this.units[unitID];
    _.remove(player.units, function (unit) { return unit.id === unitID });
    this.world.removeUnit(x, y);

    if (actions)
        delete actions[unitID];
};

/**
 * Adds new units if the time is right.
 */
Game.prototype.addNewUnits = function () {
    if ((this.tickNumber % config.newUnitsNumberOfTicks) !== 0) return;
    if (!this.world.isOccupied(3, 3))
        this.newUnit(this.player1, unit.Viking, 3, 3);
    if (!this.world.isOccupied(16, 16))
        this.newUnit(this.player2, unit.Viking, 16, 16);
};


/**
 * Returns who won the game, or null if draw.
 */
Game.prototype.getWinner = function () {
    if (this.player1.isDead()) return this.player2;
    else if (this.player2.isDead()) return this.player1;

    if (this.player1.hp > this.player2.hp) return this.player1;
    else if (this.player1.hp < this.player2.hp) return this.player2;

    if (this.player1.units.length < this.player2.units.length) return this.player2;
    else if (this.player1.units.length > this.player2.units.length) return this.player1;

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
    _.each(_.filter(self.units, function (unit) { return unit.kind == 'moving' }), function (unit, index) {
        if (unit.isDead())
            self.killUnit(unit.id, actions);

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
