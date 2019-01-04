'use strict';

var Fun             = require('./../../libs/functions');
var mess            = require('./../../constants/errorMessage.json');

module.exports = function(Distance) {

  /* Validate Data */
  Distance.validatesLengthOf('name', { min: 3, max: 250, message: {min: 'Name is too short', max: 'Name is too long'}});
  
  Distance.beforeSave = function(next, fields) {
    let error = mess.DATA_INVALID;
    let {range} = fields;

    if (!!range && Fun.isArr(range)) {
      range = JSON.stringify(range);
      let reg = /^\[\d(\,\d)*\]$/g;
      if (reg.test(range)) error = null;
    }
    if (!!error) return next(error);
    return next();
  };

  /* disableRemoteMethodByName */
  const enabledRemoteMethods = ['find', 'create', 'patchAttributes'];
  Fun.disableAllMethodsBut(Distance, enabledRemoteMethods);
};
