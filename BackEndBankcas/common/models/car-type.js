'use strict';

module.exports = function(Cartype) {
const enabledRemoteMethods = ['find'];
  Cartype.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Cartype.disableRemoteMethodByName(methodName);
    }
  });
};
