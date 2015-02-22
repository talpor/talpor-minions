function Player(number, agentConstructor) {
    this.number = number;
    this.agent = new agentConstructor(number);
    this.units = [];
}

Player.prototype.addUnit = function (unit) {
    unit.player = this;
    this.units.push(unit);
    return unit;
};


module.exports = Player;
