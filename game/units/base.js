/* global module */
/* exported Unit, Minion */

var config = require('../config'),
    uuid = require('node-uuid'),
    _ = require('lodash');

var pkAutoIncrement = 0;

/**
 * Base Unit
 * ----------------------------------------------------------------------------
 */
function Unit(x, y, hp, options) {
    if (!(typeof x === 'number' && typeof y === 'number' &&
          x < config.worldSize && y < config.worldSize &&
          x >= 0 && y >= 0)) {
        throw new Error('You must specify a valid location');
    }
    this.id = pkAutoIncrement++;
    this.x = x;
    this.y = y;
    this.hp = hp;
    this.kind = 'stationary';

    if (options && options.player)
        this.player = options.player;
    else
        this.player = null;
}

Unit.prototype.getStats = function() {
    return {
        id: this.id,
        player: this.player.number,
        x: this.x,
        y: this.y,
        hp: this.hp,
        kind: this.kind
    };
};

Unit.prototype.getDamage = function (damage) {
    this.hp -= damage;
};

Unit.prototype.isDead = function () {
    return this.hp <= 0
};


/**
 * Attacking Unit
 * ----------------------------------------------------------------------------
 */
function AttackUnit(x, y, hp, range, attack) {
    Unit.call(this, x, y, hp);
    this.range = range;
    this.attack = attack;

    this.kind = 'moving';
}
AttackUnit.prototype = Object.create(Unit.prototype);
AttackUnit.prototype.constructor = AttackUnit;

AttackUnit.prototype.getStats = function () {
    return _.extend(Unit.prototype.getStats.call(this), {
        range: this.range,
        attack: this.attack
    });
};

AttackUnit.prototype.doDamage = function () {
    return self.attack;
};


module.exports = {
    Unit: Unit,
    AttackUnit: AttackUnit
};
