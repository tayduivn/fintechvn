'use strict';

var Fun             = require('./../../libs/functions');

module.exports = function(Ward) {

  /* Validate Data */
  Ward.validatesLengthOf('name', { min: 3, max: 250, message: {min: 'Name is too short', max: 'Name is too long'}})
  Ward.validateAsync('districtId', hasDistrictId, { message: 'DistrictId not found models' });
  
  async function hasDistrictId(err, next) {
    let { districtId } = this;
    if (!districtId) return next();
    var District = Ward.app.models.district;
    let exist = await District.exists(districtId);
    if(!exist) err();
    return next();
  }
  
  /* disableRemoteMethodByName */
  const enabledRemoteMethods = ['find', 'patchAttributes', 'create', 'deleteById'];
  Fun.disableAllMethodsBut(Ward, enabledRemoteMethods);
};
