'use strict';

var Fun             = require('./../../libs/functions');

module.exports = function(Carlabel) {

  /* Validate Data */
  Carlabel.validatesLengthOf('name', { min: 1, max: 250, message: {min: 'Name is too short', max: 'Name is too long'}});

  /* disableRemoteMethodByName */
  const enabledRemoteMethods = ['find', 'patchAttributes', 'create', 'deleteById'];
  Fun.disableAllMethodsBut(Carlabel, enabledRemoteMethods);

};
