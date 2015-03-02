var path = require("path");

var _ = require("lodash");


function getBattleFile(battleID) {
    return path.join(__dirname, 'battles', battleID + '.json.gz');
}


function pad(n, size) {
    size = size || 2
    var sn = n + '';
    while (sn.length < size) sn = ' ' + sn;
    return sn;
}

function printWorld(world, state) {
    var row, tile;
    var separator = '   -' + Array(world.length + 1).join('--------')

    // Header
    var header = '   ';
    for (var k = 0; k < world.length; k++)
        header += pad(k, 6) + '  ';
    console.log(header);

    // Body
    console.log(separator);
    for (var i = 0; i < world.length; i++) {
        row = pad(i) + ' | ';
        for (var j = 0; j < world.length; j++) {
            tile = world[j][i];
            if (tile) {
                if (tile.kind === 'moving') {
                    row += 'V' + tile.player + ' ' + pad(tile.id);
                } else if (tile.kind == 'stationary') {
                    row += 'B' + tile.player + ' ' + pad(tile.id);
                }
            } else {
                row += '     ';
            }
            row += ' | ';
        }
        console.log(row);
        console.log(separator);
    }

    if (state) {
        console.log('Bases:');
        _.each(state.bases, function (base, player) {
            console.log('    B' + player + ':', base);
        });
        console.log();
        console.log('Actions:');
        _.each(state.units, function (unit) {
            if (unit.action)
                console.log('    V' + unit.player + ' ' + pad(unit.id) + ':', unit.action.please, 'to (' + (unit.x + unit.action.dx) + ', ' + (unit.y + unit.action.dy) + ') -- Direction:', _.omit(unit.action, 'please'));
        });
    }

    console.log();
    console.log('====' + Array(world.length + 1).join('========'));
    console.log();
}


module.exports = {
    getBattleFile: getBattleFile,
    printWorld: printWorld
};
