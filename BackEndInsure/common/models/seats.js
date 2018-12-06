'use strict';

module.exports = function(Seats) {
	const enabledRemoteMethods = ['find', 'prototype.patchAttributes', 'create'];
  Seats.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Seats.disableRemoteMethodByName(methodName);
    }
  });
};
