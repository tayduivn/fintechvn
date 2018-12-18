'use strict';

module.exports = function(Country) {
  const enabledRemoteMethods = ['find', 'prototype.patchAttributes', 'create'];
  Country.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Country.disableRemoteMethodByName(methodName);
    }
  });
};
