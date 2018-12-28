'use strict';

var Fun             = require('./../../libs/functions');

module.exports = function(Ward) {

  /* Validate Data */
  Ward.beforeValidate = function(next, fields) {
    let { name, districtId } = fields;
    if (!!name) Ward.validatesLengthOf('name', {
      min: 3, max: 250,
      message: {min: 'Name is too short', max: 'Name is too long'}});
    if (!!districtId)
      Ward.validatesFormatOf('districtId', {with: /^[a-z\d]{24}$/g, message: 'District id invalid'});

    next();
  };
  
  /* disableRemoteMethodByName */
  const enabledRemoteMethods = ['find', 'patchAttributes', 'create', 'deleteById'];
  Fun.disableAllMethodsBut(Ward, enabledRemoteMethods);
};
