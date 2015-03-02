/* global process */

var fs = require('fs'),
    _ = require('lodash'),
    LZString = require('lz-string');

var config = require('./config'),
    utils = require('./utils'),
    World = require('./world');

var world = new Array(config.worldSize),
    battle = JSON.parse(
        LZString.decompressFromUTF16(
            fs.readFileSync(utils.getBattleFile(process.argv[2]), {encoding: 'utf8'})
        )
    );

for (var i = 0; i < config.worldSize; i++) {
    world[i] = new Array(config.worldSize);
    for (var j = 0; j < config.worldSize; j++)
        world[i][j] = null;
}


function done() {
    console.log('The End.');
    process.exit();
}

function newWorldState(world, state) {
    // Clean up
    for (var i = 0; i < config.worldSize; i++)
        for (var j = 0; j < config.worldSize; j++)
            world[i][j] = null;

    // Set up new state
    _.each(state.units, function (unit) {
        world[unit.x][unit.y] = unit;
    });
}

console.log();
console.log('------------------------------------------------------------------------------');
console.log('  BATTLE: ', battle.id);
console.log('  Players:', _.map(battle.players, function (player) { return '(' + player.number + ') ' + player.agent; }));
console.log('  Winner: ', battle.winner);
console.log('------------------------------------------------------------------------------');
console.log();
console.log('Hit Enter to start getting the battle turns...');
console.log();

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (txt) {

    var state = battle.states.shift();

    newWorldState(world, state);
    utils.printWorld(world, state);

});
