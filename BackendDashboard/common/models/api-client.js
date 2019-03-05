'use strict';

var mess      = require('./../../errorMess/messagse.json');

module.exports = function(Apiclient) {
  const enabledRemoteMethods = ['find', 'prototype.patchAttributes', 'create', 'deleteById'];
  Apiclient.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Apiclient.disableRemoteMethodByName(methodName);
    }
  });

  Apiclient.beforeRemote('**', function(ctx, unused, next) {
    let { userCurrent } = Apiclient.app;
    if (userCurrent.account_type === 0)
      next();
    else next(mess.ACCOUNT_NOT_PERMISSION);
  });
};
