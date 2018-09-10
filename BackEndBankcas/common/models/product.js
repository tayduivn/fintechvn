'use strict';

module.exports = function(Product) {

  Product.validatesLengthOf('name', {min: 3, max: 500, message: {min:'Name file is too short', max: 'Name file is too long'}});
  Product.validatesLengthOf('icon', {min: 3, max: 100, message: {min:'Icon file is too short', max: 'Icon file is too long'}});

  const enabledRemoteMethods = ['find'];
  Product.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Product.disableRemoteMethodByName(methodName);
    }
  });
};
