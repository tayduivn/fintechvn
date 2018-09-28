'use strict';

module.exports = function(RuleExtends) {
	const enabledRemoteMethods = ['find', 'prototype.patchAttributes', 'create'];
  RuleExtends.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      RuleExtends.disableRemoteMethodByName(methodName);
    }
  });
};
