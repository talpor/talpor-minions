/* global module */

var config = require('./config'),
    units = require('./units/common');

function Player(number, world, AgentConstructor) {
    this.number = number;
    this.world = world;
    this.agent = new AgentConstructor(number, world.safeClone());
    this.units = [];
    this.hp = config.player.hp;
}

Player.prototype.addUnit = function (unit) {
    unit.player = this;
    this.units.push(unit);

    if (unit instanceof units.Base)
        this.base = unit;

    return unit;
};

Player.prototype.getDamage = function (damage) {
    this.hp -= damage;
};

Player.prototype.getStats = function () {
    return {
        number: this.number,
        agent: this.agent.getName()
    };
};

Player.prototype.isDead = function () {
    return this.hp <= 0;
};


module.exports = Player;
