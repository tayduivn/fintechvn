'use strict';

var Fun             = require('./../../libs/functions');

module.exports = function(Carline) {

  /* Validate Data */
  Carline.beforeValidate = function(next, fields) { console.log(fields)
    let { name, carManufacturerId } = fields;
    // console.log(carManufacturerId)
    
    if (!!name) Carline.validatesLengthOf('name', {
      min: 3, max: 250,
      message: {min: 'Name is too short', max: 'Name is too long'}});
    // if (!!carManufacturerId)
      // Carline.validatesFormatOf('carManufacturerId', {with: /^[a-z\d]{24}$/g, message: 'CarManufacturer id invalid'});

    next();
  };

  /* disableRemoteMethodByName */
  const enabledRemoteMethods = ['find', 'patchAttributes', 'create', 'deleteById'];
  Fun.disableAllMethodsBut(Carline, enabledRemoteMethods);
};
