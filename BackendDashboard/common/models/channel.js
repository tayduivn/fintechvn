'use strict';

var mess      = require('./../../errorMess/messagse.json');

module.exports = function(Channel) {

	let regexPath = /^https?:\/\/(www\.)?([A-Za-z\d]+[A-Za-z\d\-]*[A-Za-z\d]+\.){1,}[A-Za-z]{2,}\/?$/g;

	Channel.validatesLengthOf('name', {min: 3, max: 200, message: {min: 'Name to a short', max: "Name to a long"}});
	Channel.validatesInclusionOf('removed', {in: [0, 1], message: "Is allowed 0 or 1"});
	Channel.validatesInclusionOf('channel_type', {in: [0, 1], message: "Is allowed 0 or 1"});
	Channel.validatesInclusionOf('status', {in: [0, 1], message: "Is allowed 0 or 1"});
	Channel.validatesFormatOf('path', {with: regexPath, messagse: "Path channel invalid"});

	const enabledRemoteMethods = ['find', 'prototype.patchAttributes', 'create'];
  Channel.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Channel.disableRemoteMethodByName(methodName);
    }
  });

  Channel.beforeRemote('**', function(context, res, next){
  	let { account_type } = Channel.app.userCurrent;

  	if(account_type === 0) next()
  	else next(mess.ACCOUNT_NOT_PERMISSION);
  })

};
