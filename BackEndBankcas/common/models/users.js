'use strict';

var mess      = require('./../../errorMess/messagse.json');
const randomstring  = require('randomstring');

module.exports = function(Users) {
  const enabledRemoteMethods = ['find', 'prototype.patchAttributes', 'login'];
  Users.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Users.disableRemoteMethodByName(methodName);
    }
  });

  Users.login = function(credentials, include, callback) {

    let {email, password} =  credentials;
    let res               = {error: mess.DATA_NO_MATCH, data: null};
    let flag              =  true;

    let pattEmail  = /^[A-Za-z\d]+[A-Za-z\d_\-\.]*[A-Za-z\d]+@([A-Za-z\d]+[A-Za-z\d\-]*[A-Za-z\d]+\.){1,2}[A-Za-z]{2,}$/g;
    if (!pattEmail.test(email)) flag = false;

    if (undefined === password || password.length < 6 || password.length > 32) flag = false;

    if (flag) {
      Users.app.dataSources.restAPI.axios(
        'POST',
        'http://auth.fintechvietnam.com.vn/api/v1/users/login',
        Users.app.get('serectkey'),
        null,
        {
          email,
          password,
        },
        function(e, da) {
          let data = da[0];
          if (e) return callback(mess.LOGIN_FAILED);
          
          if (null !== da){
            if(data.error) callback(data.error);
            else callback(null, data.data);
          } else return callback(mess.LOGIN_FAILED);
        }
      );
    } else
      return callback(null, res);
  };

  Users.getUserInToken = function(token, cb) {
    if (token.length !== 64) cb(mess.DATA_NO_MATCH);
    else {
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

  Users.checkToken = function(token, cb) {
    let lenToken = 86;
    
    if (token && token.length === lenToken) {
      let id      = token.substring(10, 34);
      let active  = token.substring(44, 76);

      id        = id.match(/^[a-f\d]{24}$/)[0];
      active    = active.match(/^[A-Za-z\d]{32}$/)[0];

      Users.findOne({fields: ['id'], where: {id, 'token': active}})
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
  
};
