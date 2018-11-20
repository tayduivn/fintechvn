'use strict';

module.exports = function(Setting) {
	const enabledRemoteMethods = ['find', 'prototype.patchAttributes', 'create'];
  Setting.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Setting.disableRemoteMethodByName(methodName);
    }
  });
};
