/* global process */

var _ = require('lodash'),
    fs = require('fs'),
    uuid = require('node-uuid'),
    path = require('path'),
    LZString = require('lz-string');

var config = require('./config'),
    unit = require('./units/common'),
    utils = require('./utils'),
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
    var actions,
        states = new Array();

    while (!this.finished()) {
        /*
         * Is it time to add new units?
         */
        this.addNewUnits();

        /*
         * Get player's actions
         *
         */
        this.currentPlayer = this.getCurrentPlayer();
        actions = this.currentPlayer.agent._doTurn(this.world.safeClone());

        /*
         * Save state before executing actions
         */
        states.push(this.generateState(actions));

        /*
         * Current player moves.
         */
        this.executeActions(actions);
    }

    // Push last game state
    states.push(this.generateState());

    // Write results to some json file
    var battleID = uuid.v4().split('-')[4]
    var jsonFileName = utils.getBattleFile(battleID);
    var winner = this.getWinner();
    winner = winner ? winner.number : null;

    var str = JSON.stringify({
        id: battleID,
        winner: winner,
        players: [this.player1.getStats(), this.player2.getStats()],
        states: states
    }) + '\n';

    fs.writeFileSync(jsonFileName, LZString.compressToUTF16(str));
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
Game.prototype.killUnit = function (unitID) {
    var player = this.units[unitID].player,
        x = this.units[unitID].x,
        y = this.units[unitID].y;

    delete this.units[unitID];
    _.remove(player.units, function (unit) { return unit.id === unitID });
    this.world.removeUnit(x, y);
};


/**
 * Return the an unoccupied tile around a base
 */
Game.prototype.getUnoccupiedTileAroundBase = function (player) {
    "use strict";
    var oThis = this;
    var result;
    if (player.number === 1){
        _.each(_.range(3, -1, -1),function(elem){
            if (!oThis.world.isOccupied(elem, 3) && !result) {
                result = [elem, 3];
            }
            if (!oThis.world.isOccupied(3, elem) && !result){
                result = [3, elem];
            }
        });
        _.each(_.range(3, -1, -1),function(elem){
            if (!oThis.world.isOccupied(elem, 0) && !result){
                result = [elem, 0];
            }
            if (!oThis.world.isOccupied(0, elem) && !result){
                result = [0, elem];
            }
        });
    }else if(player.number === 2){
        _.each(_.range(16,20),function(elem){
            if (!oThis.world.isOccupied(elem, 16) && !result){
                result = [elem, 16];
            }
            if (!oThis.world.isOccupied(16, elem) && !result){
                result = [16, elem];
            }
        });
        _.each(_.range(16,20),function(elem){
            if (!oThis.world.isOccupied(elem, 19) && !result){
                result = [elem, 19];
            }
            if (!oThis.world.isOccupied(0, elem) && !result){
                result = [19, elem];
            }
        });
    }
    return result;
};

/**
 * Adds new units if the time is right.
 */
Game.prototype.addNewUnits = function () {
    "use strict";

    if ((this.tickNumber % config.newUnitsNumberOfTicks) !== 0) return;
    var unoccupied;

    unoccupied =this.getUnoccupiedTileAroundBase(this.player1);
    if (unoccupied){
        this.newUnit(this.player1, unit.Viking, unoccupied[0], unoccupied[1]);
    }

    unoccupied =this.getUnoccupiedTileAroundBase(this.player2);
    if (unoccupied){
        this.newUnit(this.player2, unit.Viking, unoccupied[0], unoccupied[1]);
    }
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
 * Generates a state for a single turn.
 *
 * If a unit is
 */
Game.prototype.generateState = function (actions) {
    var self = this;
    var state = {
        bases: {
            // _.zipObject(_.pluck(this.players, 'id'), _.pluck(this.players, 'hp'))
            1: this.player1.hp,
            2: this.player2.hp
        },
        units: {}
    };

    _.each(_.filter(this.units, function (unit) { return unit.kind == 'moving' }), function (unit, index) {
        state.units[unit.id] = unit.getStats();
    });
    _.each(actions, function (action, unitID) {
        state.units[unitID].action = action;
    });

    return state;
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
    _.each(_.filter(this.units, function (unit) { return unit.kind == 'moving' }), function (unit, index) {
        if (unit.isDead())
            self.killUnit(unit.id);
    });
};

new Game().start();
