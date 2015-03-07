/* global rivets */

rivets.formatters.not = function(value) {
    return !value;
};

rivets.formatters.isHundred = function(value) {
  return value === 100;
};

rivets.formatters.isFiveHundred = function(value) {
  return value === 500;
};

rivets.formatters.isZero = function(value) {
  return value === 0;
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
