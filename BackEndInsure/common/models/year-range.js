'use strict';

module.exports = function(Yearrange) {
	
	Yearrange.validatesNumericalityOf('min', {int: true, min: 0, max: 100});
	Yearrange.validatesNumericalityOf('max', {int: true, min: 0, max: 100});
	// Yearrange.validatesFormatOf('insur_id', { with: /^\w{24}$/, message: "InsurId invalid"});
	Yearrange.validatesInclusionOf('removed', {in: [0, 1]});

	const enabledRemoteMethods = ['find', 'prototype.patchAttributes', 'create'];
  Yearrange.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Yearrange.disableRemoteMethodByName(methodName);
    }
  });

};
