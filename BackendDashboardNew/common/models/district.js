'use strict';

var Fun             = require('./../../libs/functions');

module.exports = function(District) {

  /* Validate Data */
  District.beforeValidate = function(next, fields) {
    let { name, provinceId } = fields;
    if (!!name) District.validatesLengthOf('name', {
      min: 3, max: 250,
      message: {min: 'Name is too short', max: 'Name is too long'}});
    if (!!provinceId)
      District.validatesFormatOf('provinceId', {with: /^[a-z\d]{24}$/g, message: 'Province id invalid'});

    next();
  };

  /* disableRemoteMethodByName */
  const enabledRemoteMethods = ['find', 'patchAttributes', 'create', 'deleteById'];
  Fun.disableAllMethodsBut(District, enabledRemoteMethods);
};
