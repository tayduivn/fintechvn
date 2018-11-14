'use strict';

module.exports = function(FeeAssethome) {
  const enabledRemoteMethods = ['find'];
  FeeAssethome.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      FeeAssethome.disableRemoteMethodByName(methodName);
    }
  });
};
