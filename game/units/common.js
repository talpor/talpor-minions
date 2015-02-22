var baseUnits = require('./base'),
    config = require('../config');


/**
 * Base
 * ----------------------------------------------------------------------------
 */
function Base(player, x, y) {
    baseUnits.Unit.call(this, player, config.base.hp, x, y);
}
Base.prototype = Object.create(baseUnits.Unit.prototype);
Base.prototype.constructor = Base;


/**
 * Minion
 * ----------------------------------------------------------------------------
 */
function Minion(player, x, y) {
    baseUnits.AttackUnit.call(
        this,
        player,
        config.minion.hp,
        config.minion.range,
        config.minion.attack,
        x, y
    );
}
Minion.prototype = Object.create(baseUnits.AttackUnit.prototype);
Minion.prototype.constructor = Minion;


/**
 * Tower
 * ----------------------------------------------------------------------------
 */
function Tower(player, x, y) {
    baseUnits.AttackUnit.call(
        this,
        player,
        config.tower.hp,
        config.tower.range,
        config.tower.attack,
        x, y
    );
}
Tower.prototype = Object.create(baseUnits.AttackUnit.prototype);
Tower.prototype.constructor = Tower;


module.exports = {
    Base: Base,
    Minion: Minion,
    Tower: Tower
};
