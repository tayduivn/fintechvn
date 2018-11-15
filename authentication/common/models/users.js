'use strict';

const randomstring  = require('randomstring');
var mess      = require('./../../errorMess/messagse.json');

module.exports = function(Users) {

  const enabledRemoteMethods = ['login'];
  Users.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Users.disableRemoteMethodByName(methodName);
    }
  });

  Users.afterRemote('login', function(req, res, next) {
    let data = res;
    Users.findById(res.userId, {
      include: [
        {relation: "channel", scope: { fields: { path: true }}}
    ]})
      .then(res => {
        if(!res) return Promise.reject(mess.USER_NOT_EXIST); //USER_NOT_EXIST_CHANNEL
        if(res.status === 0)  return Promise.reject(mess.USER_DISABLED);
        if(res.account_type !== 2)  return Promise.reject(mess.USER_NOT_EXIST_CHANNEL);

        if(res.status === 1){
          if(!res.__data.channel.path || res.__data.channel.path == "") return Promise.reject(mess.CHANNEL_NOT_EXIST_PATH);

          if(res.__data.channel.path && res.__data.channel.path != ""){
            data.path = res.__data.channel.path;
            next(null, data);
          }
          
        }
        
      }, e => Promise.reject(mess.USER_DISABLED))
      .catch(e => next(e));
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

};
