'use strict';

module.exports = {
  TB_USERS: ['email', 'password', 'firstname', 'lastname',
    'phone', 'token', 'address', 'channel', 'agency', 'gender',
    'status', 'account_type', 'created_at', 'permit'], // user
  
  TB_COUNTRY: ['name'], // country

  TB_DISTRICT: ['name', 'provinceId'], // district

  TB_PROVINCE: ['name', 'countryId'], // province
  
  TB_WARD: ['name', 'districtId'], // ward

  TB_CARMANUFACTURER: ['name'], // carManufacturer

  TB_CARLINE: ['name'], // carLine

  TB_CARMODEL: ['name', 'carLabelId'], // carModel

  TB_CARLABEL: ['name', 'carManufacturerId', 'carLineId'], // carLabel

  TB_DISTANCEYEAR: ['rangeYear'], // distanceYear

  TB_CONFIG: ['name', 'type', 'extra'], // config
};
