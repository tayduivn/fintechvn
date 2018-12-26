'use strict';

module.exports = function(Province) {
  const enabledRemoteMethods = ['find', 'prototype.patchAttributes', 'create'];
  Province.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Province.disableRemoteMethodByName(methodName);
    }
  });
};
