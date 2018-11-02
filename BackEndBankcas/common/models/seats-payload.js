'use strict';

module.exports = function(SeatsPayload) {
	const enabledRemoteMethods = ['find'];
  SeatsPayload.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      SeatsPayload.disableRemoteMethodByName(methodName);
    }
  });
};
