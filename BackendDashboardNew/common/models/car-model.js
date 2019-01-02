'use strict';

var Fun             = require('./../../libs/functions');

module.exports = function(Carmodel) {

  /* Validate Data */
  Carmodel.beforeValidate = function(next, fields) {
    let { name, carLineId } = fields;
    if (!!name) Carmodel.validatesLengthOf('name', {
      min: 3, max: 250,
      message: {min: 'Name is too short', max: 'Name is too long'}});
    // if (!!carLineId)
    //   Carmodel.validatesFormatOf('carLineId', {with: /^[a-z\d]{24}$/g, message: 'CarLine id invalid'});

    next();
  };

  /* disableRemoteMethodByName */
  const enabledRemoteMethods = ['find', 'patchAttributes', 'create', 'deleteById'];
  Fun.disableAllMethodsBut(Carmodel, enabledRemoteMethods);
};
