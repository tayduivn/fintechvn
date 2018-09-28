'use strict';

module.exports = function(SeatsPayload) {
	const enabledRemoteMethods = ['find', 'prototype.patchAttributes', 'create'];
  SeatsPayload.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      SeatsPayload.disableRemoteMethodByName(methodName);
    }
  });
};
