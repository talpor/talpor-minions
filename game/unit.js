/* global module */
/* exported Unit, Minon */

var config = require('./config'),
    uuid = require('node-uuid'),
    _ = require('lodash');

module.exports = {
    Minon: Minon,
    Tower: Tower
};

function Unit(player, hp, x, y) {
    if (!(typeof x === 'number' && typeof y === 'number' &&
        x < config.worldSize && y < config.worldSize &&
        x >= 0 && y >= 0)) {
        throw new Error('You must specify a valid location');
    }
    this.player = player;
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

function Tower(x, y) {
    Unit.call(this, config.tower.hp, x, y);
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
