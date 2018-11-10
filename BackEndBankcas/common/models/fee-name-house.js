'use strict';

module.exports = function(Feenamehouse) {
	Feenamehouse.validatesLengthOf('name', {min: 3, max: 250, message: {min: 'Name short', max: "Name long"}});
	// Feenamehouse.validatesFormatOf('insur_id', { with: /^\w{24}$/, message: "InsurId invalid"});
	Feenamehouse.validatesInclusionOf('removed', {in: [0, 1]});

	const enabledRemoteMethods = ['find'];
  Feenamehouse.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Feenamehouse.disableRemoteMethodByName(methodName);
    }
  });
};
