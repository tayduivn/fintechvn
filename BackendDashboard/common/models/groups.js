'use strict';

var mess      = require('./../../errorMess/messagse.json');

module.exports = function(Groups) {

	Groups.validatesLengthOf('name', {min: 3, max: 200, message: {min: 'Name to a short', max: "Name to a long"}});
	Groups.validatesInclusionOf('removed', {in: [0, 1], message: "is not allowed"});
  Groups.validatesLengthOf('agency_id', {min: 24, max: 24, message: {min: 'is invalid'}});
	Groups.validatesLengthOf('channel_id', {min: 24, max: 24, message: {min: 'is invalid'}});

	const enabledRemoteMethods = ['find', 'prototype.patchAttributes', 'create'];
  Groups.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Groups.disableRemoteMethodByName(methodName);
    }
  });

  Groups.beforeRemote('**', function(context, res, next){
  	let { account_type } = Groups.app.userCurrent;

  	if(account_type === 0 || account_type === 1) next()
  	else next(mess.ACCOUNT_NOT_PERMISSION);
  })
};
