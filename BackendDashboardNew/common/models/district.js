'use strict';

var Fun             = require('./../../libs/functions');

module.exports = function(District) {

  /* Validate Data */
  District.validatesLengthOf('name', { min: 3, max: 250, message: {min: 'Name is too short', max: 'Name is too long'}})
  District.validateAsync('provinceId', hasProvinceId, { message: 'ProvinceId not found models' });
  
  async function hasProvinceId(err, next) {
    let { provinceId } = this;
    if (!provinceId) return next();
    var Province = District.app.models.province;
    let exist = await Province.exists(provinceId);
    if(!exist) err();
    return next();
  }

  /* disableRemoteMethodByName */
  const enabledRemoteMethods = ['find', 'patchAttributes', 'create', 'deleteById'];
  Fun.disableAllMethodsBut(District, enabledRemoteMethods);
};
