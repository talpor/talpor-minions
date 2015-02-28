/* global rivets */

rivets.formatters.not = function(value) {
    return !value;
};

rivets.formatters.onoff = function(value) {
  return value ? 'On' : 'Off';
};
