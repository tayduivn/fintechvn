'use strict';

module.exports = function(Yearrange) {
	
	const enabledRemoteMethods = ['find'];
  Yearrange.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Yearrange.disableRemoteMethodByName(methodName);
    }
  });

};
