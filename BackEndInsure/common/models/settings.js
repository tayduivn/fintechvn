'use strict';

module.exports = function(Settings) {

	const enabledRemoteMethods = ['find', 'prototype.patchAttributes', 'create'];
  Settings.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Settings.disableRemoteMethodByName(methodName);
    }
  });
  
};
