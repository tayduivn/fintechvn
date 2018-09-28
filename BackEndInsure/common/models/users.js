'use strict';

var mess      = require('./../../errorMess/messagse.json');
module.exports = function(Users) {
  const enabledRemoteMethods = ['find', 'prototype.patchAttributes', 'login'];
  Users.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Users.disableRemoteMethodByName(methodName);
    }
  });



 
  Users.signOut = function(token, cb) {
    if (token.length !== 64) cb(mess.DATA_NO_MATCH);

    Users.app.models.AccessToken.destroyById(token)
      .then(res => {
        if (null == res) cb(mess.DATA_NOT_DELETED);
        cb(null, res)
      })
      .catch(e => cb(e));
  };

  Users.remoteMethod(
    'signOut', {
      http: {path: '/signOut', verb: 'post'},
      accepts: {arg: 'token', type: 'string', required: true},
      returns: {arg: '', type: 'object', root: true},
    }
  );

  Users.beforeRemote('prototype.patchAttributes', function(context, res, next) {
    let { password, passNew, repass }  = context.args.data;

    if(undefined != password){ 
      let { id } = context.instance;
      if (undefined == id) next({...mess.DATA_NO_MATCH, messagse: 'User not exist'});
      Users.findById(id, function(err, user){
        if(err) return next({...mess.DATA_NO_MATCH, messagse: 'Password current invalid'});
        if(null == user) return next({...mess.DATA_NO_MATCH, messagse: 'Password current invalid'});
        user.hasPassword(password, function(e, isMacth){
          if (e) return next({...mess.DATA_NO_MATCH, messagse: 'Password current invalid'});
          if (!isMacth) return next({...mess.DATA_NO_MATCH, messagse: 'Password current invalid'});
          if(undefined == passNew || undefined == repass || passNew !== repass) return next({...mess.DATA_NO_MATCH, messagse: 'Password new invalid'});
          context.args.data.password = passNew;
          delete context.args.data.passNew;
          delete context.args.data.repass;

          return next();
        })
      });
    }else next();
	});

  // ============================= METHOD checkToken =======================================

  Users.checkToken = function(token, cb) {
    let lenToken = 64;

    if (token && token.length === lenToken) {
     Users.app.models.AccessToken.findById(token, {fields: ['userId']})
      .then(res => {
        if (null == res) cb(mess.USER_NOT_EXIST);

        let {userId} = res;

        Users.findById(userId, {
          include: [
            {relation: "agency", scope: { fields: { insur_id: true, bankcas_id: true }}},
          ]
        })
          .then(user => { 
            if (null == user) return cb(mess.USER_NOT_EXIST);

            let { channel } = user.__data;
            let { id: agency }  = user.__data.agency;
            
            Users.app.models.apiClient.findOne({fields: ['key'], where: {'channel_id': channel, 'agency_id': agency}})
              .then(resKey => {
                if(!resKey) return cb(mess.USER_NOT_EXIST);
                if(resKey.key !== Users.app.apikey) return cb(mess.USER_NOT_EXIST_CHANNEL);
                else cb(null, user);
              })
              .catch(err => cb(err))
            
          })
          .catch(err => cb(err));
      })
      .catch(e => cb(e));
    } else return cb({...mess.DATA_NO_MATCH, message: 'Token not exist.'})
  }

  Users.remoteMethod(
    'checkToken', {
      http: {path: '/checkToken', verb: 'post'},
      accepts: {arg: 'token', type: 'string'},
      returns: {arg: 'res', type: 'object', root: true},
    }
  );
  
};
