'use strict';

var p = require('../package.json');
var version = p.version.split('.').shift();
module.exports = {
  restApiRoot: '/api' + (version > 0 ? '/v' + version : ''),
  host: process.env.HOST || 'localhost',
  // host: process.env.HOST || '192.168.1.2',
  port: process.env.PORT || 5200,
};
