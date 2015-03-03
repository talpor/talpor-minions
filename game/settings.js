/* global process */

var path = require('path'),
    ini = require('node-ini');

var _ = require('lodash');


var Settings = {};

// Common
Settings.Common = {
    debug: true
};

// Development
Settings.development = {
    debug: false,
    sentryDSN: 'https://198259cf4480430790c2c3425a1d8f4f:a705f0505b56489abc8caf1e304eafef@sentry.talpor.com/31'
};



var vikingsConfig, extraConfiguration;
try {
    vikingsConfig = ini.parseSync(path.join(__dirname, process.env.VIKINGS_CONFIG));
    extraConfiguration = Settings[vikingsConfig.NODE_ENV.replace(/'/g, '')];
} catch (err) {
    extraConfiguration = {};
};

module.exports = _.merge(Settings.Common, extraConfiguration);
