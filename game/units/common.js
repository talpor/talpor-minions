var baseUnits = require('./base'),
    config = require('../config');


/**
 * Base
 * ----------------------------------------------------------------------------
 */
function Base(x, y, options) {
    baseUnits.Unit.call(this, x, y, 1);
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
    baseUnits.AttackUnit.call(
        this,
        x, y,
        config.viking.hp,
        config.viking.range,
        config.viking.attack
    );
}
Viking.prototype = Object.create(baseUnits.AttackUnit.prototype);
Viking.prototype.constructor = Viking;


/**
 * Tower
 * ----------------------------------------------------------------------------
 */
function Tower(x, y, options) {
    baseUnits.AttackUnit.call(
        this,
        x, y,
        config.tower.hp,
        config.tower.range,
        config.tower.attack
    );
}
Tower.prototype = Object.create(baseUnits.AttackUnit.prototype);
Tower.prototype.constructor = Tower;


module.exports = {
    Base: Base,
    Viking: Viking,
    Tower: Tower
};
