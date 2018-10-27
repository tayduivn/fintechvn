'use strict';

module.exports = function(Messages) {
	const enabledRemoteMethods = ['find', 'prototype.patchAttributes', 'create'];
  Messages.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Messages.disableRemoteMethodByName(methodName);
    }
  });

  Messages.afterRemote('prototype.patchAttributes', function(ctx, res, next) {
    let {id} = ctx.result;
    
    Messages.findById(id, {
      include: [
        {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
      ]})
      .then(res => {
        ctx.result = res;
        next();
      }, e => Promise.reject(e))
      .catch(e => next(e))
  });
  
};
