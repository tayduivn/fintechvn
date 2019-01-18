'use strict';

var Fun             = require('./../../libs/functions');

module.exports = function(Customfield) {

  /* disableRemoteMethodByName */
  const enabledRemoteMethods = ['find', 'patchAttributes', 'create', 'deleteById'];
  Fun.disableAllMethodsBut(Customfield, enabledRemoteMethods);
};
