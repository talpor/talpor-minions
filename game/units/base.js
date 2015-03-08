/* global module */
/* exported Unit, Viking */

var config = require('../config'),
    _ = require('lodash');

var pkAutoIncrement = 0;

/**
 * Base Unit
 * ----------------------------------------------------------------------------
 */
function Unit(x, y, options) {
    if (!(typeof x === 'number' && typeof y === 'number' &&
          x < config.worldSize && y < config.worldSize &&
          x >= 0 && y >= 0)) {
        throw new Error('You must specify a valid location');
    }
    this.id = pkAutoIncrement++;
    this.x = x;
    this.y = y;
    this.hp = options.hp;
    this.size = options.size || 1;
    this.kind = options.kind || 'stationary';
    this.player = options.player || null;
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
    return this.hp <= 0;
};



/**
 * Child Unit
 * ----------------------------------------------------------------------------
 */

 function ChildUnit(unit, x, y) {
    this.id = pkAutoIncrement++;
    this.x = x;
    this.y = y;

    var getValue = function(key) {
        return this[key];
    };

    for (var key in unit) {
        if (key !== 'id' && key !== 'x' && key !== 'y') {
            if (typeof unit[key] === 'function') {
                this[key] = unit[key].bind(unit);
            }
            else {
                Object.defineProperty(this, key, {
                    get: getValue.bind(unit, key),
                    enumerable: true
                });
            }
        }
    }
}
ChildUnit.prototype.constructor = ChildUnit;

/**
 * Attacking Unit
 * ----------------------------------------------------------------------------
 */
function AttackUnit(x, y, options) {
    Unit.call(this, x, y, options || {});
    this.range = options.range;
    this.attack = options.attack;

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
    return this.attack;
};


module.exports = {
    Unit: Unit,
    AttackUnit: AttackUnit,
    ChildUnit: ChildUnit
};
