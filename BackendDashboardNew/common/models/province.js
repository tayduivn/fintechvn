'use strict';

var Fun             = require('./../../libs/functions');

module.exports = function(Province) {

  /* Validate Data */
  Province.beforeValidate = function(next, fields) {
    let { name, countryId } = fields;
    if (!!name) 
      Province.validatesLengthOf('name', {
        min: 3, max: 250,
        message: {min: 'Name is too short', max: 'Name is too long'}});
    if (!!countryId)
      Province.validatesFormatOf('countryId', {with: /^[a-z\d]{24}$/g, message: 'Country id invalid'});

    next();
  };

  /* disableRemoteMethodByName */
  const enabledRemoteMethods = ['find', 'patchAttributes', 'create', 'deleteById'];
  Fun.disableAllMethodsBut(Province, enabledRemoteMethods);
};
