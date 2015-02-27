var path = require("path");


function getBattleFile(battleID) {
    return path.join(__dirname, 'battles', battleID + '.json.gz');
}


function pad(n, size) {
    size = size || 2
    var sn = n + '';
    while (sn.length < size) sn = ' ' + sn;
    return sn;
}

function printWorld(world) {
    var row, tile;
    var separator = '   -' + Array(world.length + 1).join('--------')
    console.log();
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
}


module.exports = {
    getBattleFile: getBattleFile,
    printWorld: printWorld
};
