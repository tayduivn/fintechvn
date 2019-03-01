'use strict';

module.exports = function(PrivilegeModule){
  const enabledRemoteMethods = ['find', 'prototype.patchAttributes', 'create', 'deleteById'];
  PrivilegeModule.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      PrivilegeModule.disableRemoteMethodByName(methodName);
    }
  });
};
