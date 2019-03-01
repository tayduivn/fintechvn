'use strict';

module.exports = function(PrivilegeGroup){
  const enabledRemoteMethods = ['find', 'prototype.patchAttributes', 'create', 'deleteById'];
  PrivilegeGroup.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      PrivilegeGroup.disableRemoteMethodByName(methodName);
    }
  });
};
