var baseUnits = require('./base'),
    config = require('../config');


/**
 * Base
 * ----------------------------------------------------------------------------
 */
function Base(x, y, options) {
    baseUnits.Unit.call(this, x, y, config.base.hp);
}
Base.prototype = Object.create(baseUnits.Unit.prototype);
Base.prototype.constructor = Base;


/**
 * Minion
 * ----------------------------------------------------------------------------
 */
function Minion(x, y, options) {
    baseUnits.AttackUnit.call(
        this,
        x, y,
        config.minion.hp,
        config.minion.range,
        config.minion.attack
    );
}
Minion.prototype = Object.create(baseUnits.AttackUnit.prototype);
Minion.prototype.constructor = Minion;


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
    Minion: Minion,
    Tower: Tower
};
