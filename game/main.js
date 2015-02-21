/* global process */

function Game() {
    /*
     * Parse arguments
     */

    this.agent1 = require(process.argv[0]);
    this.agent2 = require(process.argv[1]);

    this.world = [];
}

Game.prototype.start = function () {
    while (!this.finished()) {
        this.agent1.getAction(this.world),
        this.agent2.getAction(this.world);

        this.exec_actions(this.agent1);
        this.exec_actions(this.agent2);


    }
};

Game.start();
