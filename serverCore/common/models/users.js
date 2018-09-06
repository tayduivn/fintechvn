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
    Users.findById(res.userId, function(err, dt) {
      if (err) { req.result = {error: mess.USER_DISABLED, data: null}; next(); };
      if (null != dt) {
        if (dt.status === 1) {
          let serectKeyModel      = Users.app.models.serectServer;
          let {ip, serectkey}     = Users.app.serverData;

          serectKeyModel.findOne({
            include: {
              relation: 'channel',
              scope: {
                fields: {'channel_type': true},
              },
            },
            where: {'key': serectkey, 'ipServer': ip}},
            function(e, dtKey) {
              if (e) { req.result = {error: mess.USER_DISABLED, data: null}; next(); }

              req.result = {error: mess.SERECT_KEY_INVALID, data: null};
              if (null != dtKey) {
                req.result = {error: mess.USER_NOT_EXIST_CHANNEL, data: null};
                if (dt.channel == dtKey.channel_id) {

                  req.result = {error: null, data: res};
                  if (dtKey.__data.channel.channel_type === 1) {
                    if (dt.account_type === 0) req.result = {error: mess.USER_NOT_EXIST_CHANNEL, data: null};
                  } else
                    if (dt.account_type === 2) req.result = {error: mess.USER_NOT_EXIST_CHANNEL, data: null};
                }
              }
              next();
            }
          );
        } else { req.result = {error: mess.USER_DISABLED, data: null}; next(); }
      } else { req.result = {error: mess.USER_DISABLED, data: null}; next(); }
    });
  });

  Users.afterRemoteError('login', function(req, next) {
    return req.res.json({error: mess.LOGIN_FAILED, data: null});
  });
};
