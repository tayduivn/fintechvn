'use strict';

var Fun             = require('./../../libs/functions');
var mess            = require('./../../constants/errorMessage.json');

module.exports = function(Config) {

  Config.beforeSave = function(next, fields) {
    let error = mess.DATA_INVALID;
    let {name, type, extra} = fields;

    if (!name && !type && undefined !== extra) error = null;
    if (!!error) return next(error);
    return next();
  };
  
  /* disableRemoteMethodByName */
  const enabledRemoteMethods = ['find', 'create', 'patchAttributes'];
  Fun.disableAllMethodsBut(Config, enabledRemoteMethods);
};
