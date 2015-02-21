var config = require('./config');


function World(size) {
    var self = this;

    this.array = new Array(size);

    for (var i = 0; i < size; i++)
        this.array[i] = new Array(size);

    this.safeClone = function () {
        var clone = new Array(size);

        for (var i = 0; i < size; i++) {
            clone[i] = new Array(size);
            for (var j = 0; j < size; j++)
                if (self.array[i][j] !== null)
                    clone[i][j] = self.array[i][j].getStats();
        }
    };
}


module.exports = World;
