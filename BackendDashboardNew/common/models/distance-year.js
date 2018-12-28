'use strict';

var Fun             = require('./../../libs/functions');
var mess            = require('./../../constants/errorMessage.json');

module.exports = function(Distanceyear) {

  /* Validate Data */
  Distanceyear.beforeSave = function(next, fields) {
    let error = mess.DATA_INVALID;
    let {rangeYear} = fields;

    if (!!rangeYear && Fun.isArr(rangeYear)) {
      rangeYear = JSON.stringify(rangeYear);
      let reg = /^\[\d(\,\d)*\]$/g;
      if (reg.test(rangeYear)) error = null;
    }
    if (!!error) return next(error);
    return next();
  };

  /* disableRemoteMethodByName */
  const enabledRemoteMethods = ['find', 'patchAttributes'];
  Fun.disableAllMethodsBut(Distanceyear, enabledRemoteMethods);
};
