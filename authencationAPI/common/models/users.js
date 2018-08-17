'use strict';

const randomstring  = require('randomstring');
var mess      = require('./../../errorMess/messagse.json');

module.exports = function(Users) {

  let methodNameDisable = [
    'updateAll', 'replaceOrCreate', 'upsertWithWhere', 'setPassword', 'resetPassword',
    ];

  methodNameDisable.forEach(e => {
    Users.disableRemoteMethod(e, true);
  });
  
  Users.forgotPassword = function(email, cb) {
    let flag = true;

    let pattEmail  = /^[A-Za-z\d]+[A-Za-z\d_\-\.]*[A-Za-z\d]+@([A-Za-z\d]+[A-Za-z\d\-]*[A-Za-z\d]+\.){1,2}[A-Za-z]{2,}$/g;
    if (!pattEmail.test(email)) flag = false;

    if (flag) {
      Users.findOne({fields: ['id', 'email'], where: {'email': email}}, function(e, res) {
        if(e) return cb(null, {"status": 500,"message": "Server disconect"});

        if(null === res) return cb(null, {"status": 500,"message": "Not exist email"});

        let { id, email } = res;
        let tokenActive  = randomstring.generate(32);
        let mailToken = randomstring.generate(10) + id + randomstring.generate(10) + tokenActive + randomstring.generate(10);
        
        Users.upsertWithWhere({'id': id }, {'token': tokenActive}, function(err, res){
          if(e) return cb(null, {"status": 500,"message": "Server disconect"});
          let data = {
            id,
            email,
            mailToken,
          }
          return cb(null, {"status": 200, res: data});
        })

        // return cb(null, {"status": 200,"message": "subject"});
      });
    } else return cb(null, {'status': 500, 'messages': 'Data no match'});
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

    if (token.length === lenToken) {
      let id      = token.substring(10, 34);
      let active  = token.substring(44, 76);

      id        = id.match(/^[a-f\d]{24}$/)[0];
      active    = active.match(/^[A-Za-z\d]{32}$/)[0];

      Users.findOne({fields: ['id'], where: {id, 'token': active}}, function(err, data) {
        if (err) return cb(null, {'status': 500, 'messages': 'Disconnect server'});
        if (null != data && undefined !== data.id)  return cb(null, {'status': 200, 'res': {id, token: active}});
        else return cb(null, {'status': 500, 'messages': 'Disconnect server'});
      });
     
    } else return cb(null, {'status': 500, 'messages': 'Token not exist'})
  }

  Users.remoteMethod(
    'checkToken', {
      http: {path: '/checkToken', verb: 'post'},
      accepts: {arg: 'token', type: 'string'},
      returns: {arg: 'res', type: 'object', root: true},
    }
  );

  Users.resetPassWord = function(data, cb) {
    let { id, token, password } = data;
    let flag = true;

    let pattID    = /^\w{24}$/;
    let pattToken = /^\w{32}$/;
    let pattPass  = /^\w{6,32}$/;

    if (!pattID.test(id)) flag = false;
    if (!pattToken.test(token)) flag = false;
    if (!pattPass.test(password)) flag = false;

    if (flag) {
      Users.findOne({fields: ['id'], where: {'id': id, 'token': token}}, function(e, r) {
        if (e) return cb(null, {'status': 500, 'message': 'Server disconect'});

        if (r != null && undefined !== r.id) {
          Users.upsertWithWhere({'id': id}, {'token': '', 'password': password}, function(err, res) {
            if (e) return cb(null, {'status': 500, 'message': 'Server disconect'});
            return cb(null, {'status': 200, res});
          });
        } else return cb(null, {'status': 500, 'messages': 'Error'});
      });
    } else return cb(null, {'status': 500, 'messages': 'Data no match'});
  }

  Users.remoteMethod(
    'resetPassWord', {
      http: {path: '/resetPassWord', verb: 'post'},
      accepts: {arg: 'data', type: 'object', http: {source: 'body'}},
      returns: {arg: 'res', type: 'object', root: true},
    }
  );

  Users.afterRemote('login', function(req, res, next) {
    Users.findById(res.userId, function(err, dt) {
      if (err) req.result = {error: mess.USER_DISABLED, data: null};
      if (null != dt) {
        if (dt.status === 1) req.result = {error: null, data: res};
        else req.result = {error: mess.USER_DISABLED, data: null};
      } else req.result = {error: mess.USER_DISABLED, data: null};
      next();
    });
  });

  Users.afterRemoteError('login', function(req, next) {
    return req.res.json({error: mess.LOGIN_FAILED, data: null});
  });
};
