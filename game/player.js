/* global module */

var config = require('./config');

function Player(number, AgentConstructor) {
    this.number = number;
    this.agent = new AgentConstructor(number);
    this.units = [];
    this.hp = config.player.hp;
}

Player.prototype.addUnit = function (unit) {
    unit.player = this;
    this.units.push(unit);
    return unit;
};

Player.prototype.getDamage = function (damage) {
    this.hp -= damage;
};

Player.prototype.isDead = function () {
    return this.hp <= 0;
};


module.exports = Player;
