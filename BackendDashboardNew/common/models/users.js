'use strict';

const randomstring  = require('randomstring');
var mess            = require('./../../constants/errorMessage.json');
var Validate        = require('./../../libs/validate');
var Fun             = require('./../../libs/functions');
var CONST           = require('./../../constants/constants.json');

module.exports = function(Users) {
  
  /* Validate Data */
  Users.validatesUniquenessOf('email', {message: 'Email already exist'});
  Users.validateAsync('password', async function(err, next){
    let isPass = await Users.findOne({password: this.password});
    if(!isPass && !Validate.validateString(this.password, {min: 7, max: 32})) err();
    next();
  }, {message: 'Password invalid'});
  Users.validatesLengthOf('firstname', {  min: 3, max: 200, message: { min: 'Firstname is too short', max: "Firstname is too long"}});
  Users.validatesLengthOf('lastname', { min: 3, max: 200,  message: { min: 'Lastname is too short', max: "Lastname is too long"}});
  Users.validate('phone', function(err){
    if (!!this.phone && !(/^(84|0)\d{9}$/.test(this.phone))) err();
  }, { message: 'Phone id invalid'} );
  Users.validate('token', function(err){
    if (!!this.token && !(/^[a-zA-Z\d]{86}$/.test(this.token))) err();
  }, { message: 'Token id invalid'} );
  Users.validatesInclusionOf('gender', {in: [0, 1], allowNull: true});
  Users.validatesInclusionOf('status', {in: [0, 1], allowNull: true});
  Users.validatesInclusionOf('account_type', {in: [0, 1, 2], allowNull: true});
  Users.validateAsync('channel', async function(err, next){
    // let fl = 
    next();
  }, { message: "Channel not found models"});
  Users.validateAsync('agency', async function(err, next){
    // let fl = 
    next();
  }, { message: "Agency not found models"});
  Users.validateAsync('created_at', async function(err, next){
    // let fl = 
    next();
  }, { message: "Created at not found models"});

  /* disableRemoteMethodByName */
  const enabledRemoteMethods = ['login', 'patchAttributes'];
  Fun.disableAllMethodsBut(Users, enabledRemoteMethods);

  /* METHOD SIGNOUT */
  Users.signOut = function(token, cb) {
    if (token.length !== 64) cb(mess.DATA_NO_MATCH);

    Users.app.models.AccessToken.destroyById(token)
      .then(res => {
        if (null == res) cb(mess.DATA_NOT_DELETED);
        cb(null, res);
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

  // ========================== afterRemote login ================================//

  Users.afterRemote('login', function(req, res, next) {
    let data = res;
    let { userId, id } = res;
    Users.findOne({
      where: { 
        and: [
          { id: userId },
          { or: [
              { account_type: 0 },
              { account_type: 1 }
              ]}
            ] 
          }
        })
      .then(res => {
        if (!res) return Promise.reject(mess.USER_NOT_EXIST);
        if (res.status === 0)  return Promise.reject(mess.USER_DISABLED);

        if (res.status === 1) { 
          next(null, data);
        }
      }, e => Promise.reject(mess.USER_DISABLED))
      .catch(e => {
        Users.app.models.AccessToken.destroyById(id);
        next(e);
      });
  });

  // ========================== METHOD getUserInToken ================================//

  Users.getUserInToken = async function(token) {
    let error = { ...mess.DATA_NO_MATCH, message: "Token invalid"};
    let data  = null;
    let rule = { token: { type : 'string', base: /^[a-zA-Z\d]{64}$/g } };

    let valid = Validate.validDataForm(rule, { token });

    if (!!Fun.isEmpty(valid.error)) {
      error = mess.USER_NOT_EXIST;
      
      let accessToken = await Users.app.models.AccessToken.findById(token, {fields: ['userId']});
      
      if (!!accessToken && !!accessToken.userId){
        let user = await Users.findById(accessToken.userId);
        if (!!user){
          error = null;
          data  = user;
        }
      }
    }

    if (!!error) return Promise.reject(error);
    return data;
  };

  Users.remoteMethod(
    'getUserInToken', {
      http: {path: '/getUserInToken', verb: 'get'},
      accepts: {arg: 'token', type: 'string', required: true},
      returns: {arg: '', type: 'object', root: true},
    }
  );

};