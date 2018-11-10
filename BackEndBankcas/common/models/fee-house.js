'use strict';

module.exports = function(Feehouse) {
	const enabledRemoteMethods = ['find'];
  Feehouse.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Feehouse.disableRemoteMethodByName(methodName);
    }
  });
};
