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

rivets.formatters.inHome = function(value) {
  return value === 'home';
};

rivets.formatters.progress = function(value) {
    if (!value) return '';
    var values = value.match(/\d+/g);
    if (values.length === 2) {
        return 'width: ' + (values[0]/values[1]*100) + '%';
    }
    return '';
};
