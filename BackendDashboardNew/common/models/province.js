'use strict';

var Fun             = require('./../../libs/functions');

module.exports = function(Province) {

  /* Validate Data */
  Province.validatesLengthOf('name', { min: 3, max: 250, message: {min: 'Name is too short', max: 'Name is too long'}})
  Province.validateAsync('countryId', hasCountryId, { message: 'CountryId not found models' });
  
  async function hasCountryId(err, next) {
    let { countryId } = this;
    if (!countryId) return next();
    var Country = Province.app.models.country;
    let exist = await Country.exists(countryId);
    if(!exist) err();
    return next();
  }

  /* disableRemoteMethodByName */
  const enabledRemoteMethods = ['find', 'patchAttributes', 'create', 'deleteById'];
  Fun.disableAllMethodsBut(Province, enabledRemoteMethods);
};
