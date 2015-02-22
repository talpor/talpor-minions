var config = require('./config');


function World(size) {
    var self = this;

    this.size = size
    this.array = new Array(size);

    for (var i = 0; i < size; i++)
        this.array[i] = new Array(size);
}


World.prototype.safeClone = function () {
    var self = this,
        clone = new Array(this.size);

    for (var i = 0; i < this.size; i++) {
        clone[i] = new Array(this.size);
        for (var j = 0; j < this.size; j++)
            if (self.array[i][j])
                clone[i][j] = self.array[i][j].getStats();
    }
};


World.prototype.setUnit = function (x, y, unit) {
    this.array[x][y] = unit;
};


module.exports = World;
