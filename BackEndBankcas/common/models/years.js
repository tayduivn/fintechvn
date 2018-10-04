'use strict';

module.exports = function(Years) {
  const enabledRemoteMethods = ['find'];
  Years.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Years.disableRemoteMethodByName(methodName);
    }
  });
};
