'use strict';

var mess      = require('./../../errorMess/messagse.json');

module.exports = function(Agency) {

	Agency.validatesLengthOf('name', {min: 3, max: 200, message: {min: 'Name to a short', max: "Name to a long"}});
	Agency.validatesLengthOf('chanel_id', {min: 24, max: 24, message: {min: 'Channel id invalid', max: "Channel id invalid"}});
	Agency.validatesInclusionOf('removed', {in: [0, 1], message: "Is allowed 0 or 1"});

	const enabledRemoteMethods = ['find', 'prototype.patchAttributes', 'create'];
  Agency.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Agency.disableRemoteMethodByName(methodName);
    }
  });

  Agency.beforeRemote('**', function(context, res, next){
  	let { account_type } = Agency.app.userCurrent;

  	if(account_type === 0) next()
  	else next(mess.ACCOUNT_NOT_PERMISSION);
  })

  Agency.afterRemote('prototype.patchAttributes', function(context, res, next){
  	let { result } = context;
  	let { id } = res;
  	Agency.findById(id, {
  		include: [
        {relation: "channel", scope: { fields: { name: true, path: true, channel_type: true}}},
      ]
 		})
	  	.then(res => {
	  		if(!res) return Promise.reject(mess.DATA_UPDATE_FAIL)
	  		context.result = res;
	  		next();
	  	})
	  	.catch(e => next(e))
  });

  Agency.afterRemote('create', function(context, res, next){
  	let { result } = context;
  	let { id } = res;
  	Agency.findById(id, {
  		include: [
        {relation: "channel", scope: { fields: { name: true, path: true, channel_type: true}}},
      ]
 		})
	  	.then(res => {
	  		if(!res) return Promise.reject(mess.DATA_UPDATE_FAIL)
	  		context.result = res;
	  		next();
	  	})
	  	.catch(e => next(e))
  })
};
