'use strict';

var Fun             = require('./../../libs/functions');

module.exports = function(Carlabel) {

  /* Validate Data */
  Carlabel.validatesLengthOf('name', { min: 1, max: 250, message: {min: 'Name is too short', max: 'Name is too long'}});
  Carlabel.validateAsync('carManufacturerId', hasCarManufacturerId, { message: 'CarManufacturerId not found models' });
  Carlabel.validateAsync('carLineId', hasCarLineId, { message: 'CarLineId not found models' });

  async function hasCarManufacturerId(err, next) { 
    if (!this.carManufacturerId) return next();
    var CarManufacturer = Carlabel.app.models.carManufacturer;
    let exist = await CarManufacturer.exists(this.carManufacturerId);
    if(!exist) err();
    return next();
  }

  async function hasCarLineId(err, next) { 
    if (!this.carLineId) return next();
    var CarLine = Carlabel.app.models.carLine;
    let exist = await CarLine.exists(this.carLineId);
    if(!exist) err();
    return next();
  }

  /* disableRemoteMethodByName */
  const enabledRemoteMethods = ['find', 'patchAttributes', 'create', 'deleteById'];
  Fun.disableAllMethodsBut(Carlabel, enabledRemoteMethods);

};
