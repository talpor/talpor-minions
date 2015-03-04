/* global rivets */

rivets.formatters.not = function(value) {
    return !value;
};

rivets.formatters.onoff = function(value) {
  return value ? 'On' : 'Off';
};

rivets.formatters.fast = function(value) {
  return value > 499;
};

rivets.formatters.slow = function(value) {
  return value < 101;
};
