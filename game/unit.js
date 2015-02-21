/* exported Unit, Minon */

var config = require('./config'),
    uuid = require('node-uuid'),
    _ = require('lodash-node');

function Unit(hp, x, y) {
    this.id = uuid.v4();
    this.x = x;
    this.y = y;
    this.hp = hp;
}

Unit.prototype.getStats = function() {
    return {
        x: this.x,
        y: this.y,
        hp: this.hp
    };
};

function Minon(x, y) {
    Unit.call(this, config.minon.hp, x, y);
    this.range = config.minon.range;
    this.attack = config.minon.attack;
    this.currentAction = {
        // pass
    };
}
Minon.prototype = Object.create(Unit.prototype);
Minon.prototype.constructor = Minon;

Minon.prototype.getStats = function () {
    var self = this;
    return _.extend(Unit.prototype.getStats.call(this), {
        range: self.range,
        attack: self.attack
    });
};

Minon.prototype.validMove = function() {
    //
};

function Tower() {
    Unit.call(this);
    this.range = config.tower.range;
    this.attack = config.tower.attack;
}
Tower.prototype = Object.create(Unit.prototype);
Tower.prototype.constructor = Unit;

Tower.prototype.getStats = function () {
    var self = this;
    return _.extend(Unit.prototype.getStats.call(this), {
        range: self.range,
        attack: self.attack
    });
};





