'use strict';

var mess      = require('./../../errorMess/messagse.json');

module.exports = function(PrivilegeGroup){
  const enabledRemoteMethods = ['find', 'prototype.patchAttributes', 'create', 'deleteById'];
  PrivilegeGroup.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      PrivilegeGroup.disableRemoteMethodByName(methodName);
    }
  });

  PrivilegeGroup.beforeRemote('**', function(ctx, unused, next) {
    let { userCurrent } = PrivilegeGroup.app;
    if (userCurrent.account_type === 0)
      next();
    else next(mess.ACCOUNT_NOT_PERMISSION);
  });

  PrivilegeGroup.beforeRemote('deleteById', function(ctx, unused, next) {
    let { id } = ctx.args;
    PrivilegeGroup.app.models.privilegeModule.destroyAll({group_id: id});
    next();
  });
};
