'use strict';

var mess      = require('./../../errorMess/messagse.json');

module.exports = function(Users) {
  const enabledRemoteMethods = ['find', 'login'];
  Users.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
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
        'http://localhost:4000/api/v1/users/login',
        Users.app.get('serectkey'),
        null,
        {
          email,
          password,
        },
        function(e, da) {
          if (e) return callback(null, {error: mess.LOGIN_FAILED, data: null});
          if (null !== da)callback(null, da[0]);
          else return callback(null, {error: mess.LOGIN_FAILED, data: null});
        }
      );
    } else
      return callback(null, res);
  }

  Users.afterRemote('*', function(req, res, next) {
    req.result = {error: null, data: res};
    next();
	});
	
  Users.afterRemoteError('*', function(context, next) {

    return context.res.json({error: {
      code: context.error.name,
      message: context.error.message,
      num: context.error.statusCode,
    }, data: null});
  });
};
