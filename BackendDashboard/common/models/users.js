'use strict';

const randomstring  = require('randomstring');
var mess      = require('./../../errorMess/messagse.json');

module.exports = function(Users) {

  const enabledRemoteMethods = ['login', 'find', 'prototype.patchAttributes', 'create'];
  Users.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Users.disableRemoteMethodByName(methodName);
    }
  });

  Users.afterRemote('login', function(req, res, next) {
    let data = res;
    let { userId, id } = res;
    Users.findOne( {where: { and: [{id: userId}, {or: [{account_type: 0}, {account_type: 1}]}] }})
      .then(res => {
        if(!res) return Promise.reject(mess.USER_NOT_EXIST);
        if(res.status === 0)  return Promise.reject(mess.USER_DISABLED);

        if(res.status === 1){ 
          // if(!res.__data.channel.path || res.__data.channel.path == "") return Promise.reject(mess.CHANNEL_NOT_EXIST_PATH);

          // if(res.__data.channel.path && res.__data.channel.path != ""){
          //   data.path = res.__data.channel.path;
          //   next(null, data);
          // }

          next(null, data);
          
        }
        
      }, e => Promise.reject(mess.USER_DISABLED))
      .catch(e => {
        Users.app.models.AccessToken.destroyById(id);
        next(e)
      });
  });

  Users.afterRemoteError('login', function(req, next) {
    return req.res.json({error: mess.LOGIN_FAILED, data: null});
  });

  // ========================== METHOD forgotPassword ================================//

 
  Users.forgotPassword = function(email, cb) {
    let flag = true;

    let pattEmail  = /^[A-Za-z\d]+[A-Za-z\d_\-\.]*[A-Za-z\d]+@([A-Za-z\d]+[A-Za-z\d\-]*[A-Za-z\d]+\.){1,2}[A-Za-z]{2,}$/g;
    if (!pattEmail.test(email)) flag = false;

    if (flag) {
      Users.findOne({fields: ['id', 'email'], where: {'email': email}})
        .then( user => {
          if (!user) return Promise.reject(mess.USER_NOT_EXIST);
          if (user.status === 0) return Promise.reject(mess.USER_DISABLED);
          let tokenActive   = randomstring.generate(32);
          let {id}   = user;
          
          return Users.upsertWithWhere({'id': id }, {'token': tokenActive});
        }, e => Promise.reject(e))
        .then(res => {
          if (!res) return Promise.reject(mess.USER_NOT_EXIST);
          let {id, email, token} = res;
          let mailToken     = randomstring.generate(10) + id + randomstring.generate(10) + token + randomstring.generate(10);

          let data = {
            id,
            email,
            mailToken,
          }
          return cb(null, data);
        }, e => Promise.reject(e))
        .catch(e => cb(e));
    } else return cb({...mess.DATA_NO_MATCH, message: 'Email invalid'});
  };

  Users.remoteMethod(
    'forgotPassword', {
      http: {path: '/forgotPassword', verb: 'post'},
      accepts: {arg: 'email', type: 'string'},
      returns: {arg: 'res', type: 'object', root: true},
    }
  );

  // ========================== METHOD checkToken ================================//

  Users.checkToken = function(token, cb) {
    let lenToken = 86;
    
    if (token && token.length === lenToken) {
      let id      = token.substring(10, 34);
      let active  = token.substring(44, 76);

      id        = id.match(/^[a-f\d]{24}$/)[0];
      active    = active.match(/^[A-Za-z\d]{32}$/)[0];

      Users.findOne({fields: ['id'], where: {
        and: [
          {id},
          {'token': active},
          {
            or: [{account_type: 0}]
          }
        ]}
      })
        .then(data => {
          if (null == data || undefined === data.id) return Promise.reject({...mess.USER_NOT_EXIST})
          cb(null, {id, token: active});
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

  // ========================== METHOD accessForgotPassword ================================//

  Users.accessForgotPassword = function(data, cb) {
    let { id, token, password } = data;
    let flag      = true;
    
    let pattID    = /^\w{24}$/;
    let pattToken = /^\w{32}$/;
    let pattPass  = /^\w{6,32}$/;

    if (!pattID.test(id)) flag = false;
    if (!pattToken.test(token)) flag = false;
    if (!pattPass.test(password)) flag = false;

    if (flag) {
      Users.findOne({fields: ['id'], where: {'id': id, 'token': token}})
      .then(user => {
        if(!user) return Promise.reject(mess.USER_TOKEN_NOT_EXIST);
        if(user.status === 0) return Promise.reject(mess.USER_DISABLED);
        return Users.upsertWithWhere({'id': id}, {'token': '', 'password': password});
      }, e => Promise.reject(e))
      .then(res => {
        if(!res) return Promise.reject(mess.USER_NOT_EXIST);
        cb(null, res)
      }, e => Promise.reject(e))
      .catch(e => cb(e));

    } else return cb(mess.DATA_NO_MATCH);
  }

  Users.remoteMethod(
    'accessForgotPassword', {
      http: {path: '/accessForgotPassword', verb: 'post'},
      accepts: {arg: 'data', type: 'object', http: {source: 'body'}},
      returns: {arg: 'res', type: 'object', root: true},
    }
  );


  // ========================== METHOD getUserInToken ================================//

  Users.getUserInToken = function(token, cb) {
    if (token.length !== 64) cb(mess.DATA_NO_MATCH);
    else {
      Users.app.models.AccessToken.findById(token, {fields: ['userId']})
        .then(res => {
          if (null == res) cb(mess.USER_NOT_EXIST);
          let {userId} = res;
          Users.findById(userId)
            .then(user => {
              if (null == res) cb(mess.USER_NOT_EXIST);
              cb(null, user);
            })
            .catch(err => cb(err));
        })
        .catch(e => cb(e));
    }
   
  };

  Users.remoteMethod(
    'getUserInToken', {
      http: {path: '/getUserInToken', verb: 'get'},
      accepts: {arg: 'token', type: 'string', required: true},
      returns: {arg: '', type: 'object', root: true},
    }
  );

  // ========================== METHOD signOut ================================//

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

  // ========================== METHOD updateUserByID ================================//

  Users.updateUserByID = function(id, data, cb) {
    if (id.length !== 24) cb(mess.DATA_NO_MATCH);
    else {
      Users.findById(id, {fields: ['id']})
        .then(res => {
          if(!res) return Promise.reject({...mess.DATA_NO_MATCH, messagse: "User not exit"});

          if(!data) return Promise.reject({...mess.DATA_NO_MATCH, messagse: "Data not empty"});
            return Users.upsertWithWhere({'id': id}, data);
        }, e => Promise.reject(e))
        .then(data => {
          if(!data) return Promise.reject({...mess.DATA_UPDATE_FAIL});
            return Users.findById(id, {
              include: [
                {relation: "agency", scope: { fields: { name: true}}},
                {relation: "channel", scope: { fields: { name: true }}},
              ]
            })
        }, e => Promise.reject(e))
        .then(dt => cb(null, dt))
        .catch(e => cb(e));
    }
  }

  Users.remoteMethod(
    'updateUserByID', {
      http: {path: '/updateUserByID', verb: 'post'},
      accepts: [
        {arg: 'id', type: 'string', http: {source: 'query'}},
        {arg: 'data', type: 'object', http: {source: 'body'}}
      ],
      returns: {arg: 'res', type: 'object', root: true},
    }
  );

// ========================== beforeRemote prototype.patchAttributes ================================//

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

  // ========================== beforeRemote create ================================//

  Users.beforeRemote('create', function(context, res, next) {
    let { agency, created_at, account_type } = context.args.data;
    let maxUser = 1;

    Users.count({agency})
      .then(res => {
        if(res == null) return Promise.reject({...mess.DATA_NO_MATCH});
        maxUser = res;
        
        return Users.findById(created_at, {
          fields: ['account_type']
        });
        // next();
      }, e => Promise.reject({...mess.DATA_NO_MATCH}))
      .then(resU => {
        if(!resU) return Promise.reject({...mess.DATA_NO_MATCH});
        let accountType = resU.account_type === 0 ? 1 : 2;
        if (account_type !== accountType) return Promise.reject({...mess.DATA_NO_MATCH, messagse: 'You not create user to agency'});
        
        return Users.app.models.agency.findById(agency, {fields: ['max_user']})
      }, e => Promise.reject({...mess.DATA_NO_MATCH}))
      .then(agen => { 
        if(!agen) return Promise.reject({...mess.DATA_NO_MATCH, messagse: 'User to agency maximum'});

        let { max_user } = agen;
        if(maxUser >= max_user) return Promise.reject({...mess.DATA_NO_MATCH, messagse: 'User to agency maximum'});
        next();
      }, e => Promise.reject({...mess.DATA_NO_MATCH, messagse: 'User to agency maximum'}))
      .catch(e => next(e))
  });

  Users.afterRemote('create', function(context, res, next) {
    let {id} = context.result;
    Users.findById(id, {
      include: [
        {relation: "agency", scope: { fields: { name: true}}},
        {relation: "channel", scope: { fields: { name: true }}},
      ]
    })
    .then(res => {
      context.result = res;
      next();
    })
    .catch(e => next(e))
  });

};
