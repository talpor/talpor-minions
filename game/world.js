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


World.prototype.isValidAction = function (unit, action) {
    var location = {
        x: unit.x + action.dx,
        y: unit.y + action.dy
    };

    if (this.array[unit.x][unit.y].id !== unit.id) return false;
    if (location.x < 0 || location.x >= this.size) return false;
    if (location.y < 0 || location.y >= this.size) return false;

    if (action.name == 'walk' && this.isOccupied(location)) return false;
    if (action.name == 'attack' && (!this.isOccupied(location) || this.array[location.x][location.y].player == unit.player)) return false;

    return true;
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
