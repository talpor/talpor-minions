var config = require('./config');


function World(size) {
    var self = this;

    this.size = size
    this.array = new Array(size);

    for (var i = 0; i < size; i++)
        this.array[i] = new Array(size);
}


World.prototype.getTile = function (x, y) {
    if (x < 0 || x >= this.size || y < 0 || y >= this.size) return false;
    return this.array[x][y];
};


World.prototype.safeClone = function () {
    var self = this,
        clone = new Array(this.size);

    for (var i = 0; i < this.size; i++) {
        clone[i] = new Array(this.size);
        for (var j = 0; j < this.size; j++)
            if (self.array[i][j])
                clone[i][j] = self.array[i][j].getStats();
    }
    return clone;
};


World.prototype.addUnit = function (unitConstructor, x, y, options) {
    if (x < 0 || x >= config.worldSize || y < 0 || y >= config.worldSize) return null;
    this.array[x][y] = new unitConstructor(x, y, options);
    return this.array[x][y];
};


World.prototype.isValidAction = function (unit, action) {
    var location = {
        x: unit.x + action.dx,
        y: unit.y + action.dy
    };
    var tile = this.getTile(unit.x, unit.y);

    if (!tile) return false;
    if (tile.id !== unit.id) return false;
    if (action.name == 'walk' && this.isOccupied(location.x, location.y)) return false;
    if (action.name == 'attack' && (!this.isOccupied(location.x, location.y) || this.array[location.x][location.y].player.number == unit.player.number)) return false;

    return true;
};

World.prototype.isOccupied = function (x, y) {
    if (x < 0 || x >= this.size || y < 0 || y >= this.size) return true;
    return Boolean(this.array[x][y]);
};


World.prototype.execAction = function (unit, action) {
    return this[action.name](unit, action.dx, action.dy);
};

World.prototype.walk = function (unit, dx, dy) {
    this.array[unit.x][unit.y] = undefined;

    unit.x += dx;
    unit.y += dy;

    this.array[unit.x][unit.y] = unit;
};

World.prototype.attack = function (unit, dx, dy) {
    var location = {
        x: unit.x + dx,
        y: unit.y + dy
    };

    var enemy = this.array[location.x][location.y];
    enemy.getDamage(unit.doDamage());
};


module.exports = World;
