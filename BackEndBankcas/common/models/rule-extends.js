'use strict';

module.exports = function(RuleExtends) {
  const enabledRemoteMethods = ['find'];
  RuleExtends.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      RuleExtends.disableRemoteMethodByName(methodName);
    }
  });
};
