'use strict';

var mess      = require('./../../errorMess/messagse.json');

module.exports = function(PrivilegeModule){
  const enabledRemoteMethods = ['find', 'prototype.patchAttributes', 'create', 'deleteById'];
  PrivilegeModule.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      PrivilegeModule.disableRemoteMethodByName(methodName);
    }
  });

  PrivilegeModule.beforeRemote('**', function(ctx, unused, next) {
    let { userCurrent } = PrivilegeModule.app;
    if (userCurrent.account_type === 0)
      next();
    else next(mess.ACCOUNT_NOT_PERMISSION);
  });

};
