var _ = require("lodash");

var baseUnits = require('./base'),
    config = require('../config');


/**
 * Base
 * ----------------------------------------------------------------------------
 */
function Base(x, y, options) {
    baseUnits.Unit.call(this, x, y, { hp: 1, size: 2 });
}
Base.prototype = Object.create(baseUnits.Unit.prototype);
Base.prototype.constructor = Base;

Base.prototype.getDamage = function (damage) {
    this.player.getDamage(damage);
};


/**
 * Viking
 * ----------------------------------------------------------------------------
 */
function Viking(x, y, options) {
    options = _.extend({}, options, {
        hp: config.viking.hp,
        size: config.viking.size,
        range: config.viking.range,
        attack: config.viking.attack
    });
    baseUnits.AttackUnit.call(this, x, y, options);
}
Viking.prototype = Object.create(baseUnits.AttackUnit.prototype);
Viking.prototype.constructor = Viking;


/**
 * Tower
 * ----------------------------------------------------------------------------
 */
function Tower(x, y, options) {
    options = _.extend({}, options, {
        hp: config.tower.hp,
        size: config.tower.size,
        range: config.tower.range,
        attack: config.tower.attack
    });
    baseUnits.AttackUnit.call(this, x, y, options);
}
Tower.prototype = Object.create(baseUnits.AttackUnit.prototype);
Tower.prototype.constructor = Tower;


module.exports = {
    Base: Base,
    Viking: Viking,
    Tower: Tower
};
