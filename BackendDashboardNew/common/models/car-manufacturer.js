'use strict';

var Fun             = require('./../../libs/functions');

module.exports = function(Carmanufacturer) {
  
  /* Validate Data */
  Carmanufacturer.validatesLengthOf('name', { min: 3, max: 250, message: {min: 'Name is too short', max: 'Name is too long'}});

  /* disableRemoteMethodByName */
  const enabledRemoteMethods = ['find', 'patchAttributes', 'create', 'deleteById'];
  Fun.disableAllMethodsBut(Carmanufacturer, enabledRemoteMethods);
};
