'use strict';

var mess      = require('./../../errorMess/messagse.json');

module.exports = function(Years) {

	const enabledRemoteMethods = ['find', 'prototype.patchAttributes', 'create'];
  Years.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Years.disableRemoteMethodByName(methodName);
    }
  });

};
