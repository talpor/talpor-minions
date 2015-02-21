function Unit() {
    this.id = null;
    this.range = 1;
    this.hp = 12;
    this.attack = 4;

    this.currentAction = {
        name: 'moving',
        target: {x: 0 , y: 0}
    };
};

// Unit.prototype.something();
