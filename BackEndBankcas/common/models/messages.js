'use strict';

module.exports = function(Messages) {
	const enabledRemoteMethods = ['find', 'prototype.patchAttributes', 'create'];
  Messages.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Messages.disableRemoteMethodByName(methodName);
    }
  });
};
