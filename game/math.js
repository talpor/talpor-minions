/* global module */

var math = {
    getDistance: function (from, to) {
        return {
            x: to.x - from.x,
            y: to.y - from.y
        };
    },
    getDirection: function (from, to) {
        var distance = this.getDistance(from, to);
        var direction = distance;
        if (distance.x) direction.x /= Math.abs(distance.x);
        if (distance.y) direction.y /= Math.abs(distance.y);
        return direction;
    },
    getDistanceFromDirection: function (from, direction, to) {
        return this.getDistance(
            {x: from.x + direction.x, y: from.y + direction.y},
            to
        );
    }
};

module.exports = math;