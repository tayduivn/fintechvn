'use strict';

module.exports = function(District) {
  const enabledRemoteMethods = ['find', 'prototype.patchAttributes', 'create', 'deleteById'];
  District.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      District.disableRemoteMethodByName(methodName);
    }
  });
};
