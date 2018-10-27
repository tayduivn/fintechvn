'use strict';
var mess      = require('./../../errorMess/messagse.json');
var socket    = require('./../../config/socket.json');
var fs = require('fs');

module.exports = function(Productdetail) {

  Productdetail.validatesInclusionOf('status', {in: [0, 1, 2, 3]});
  // Productdetail.validatesFormatOf('product_id', {with: /^\w{24}$/, message: 'Product id invalid'});
  // Productdetail.validatesFormatOf('created_by', {with: /^\w{24}$/, message: 'Created_by id invalid'});

  // Productdetail.beforeValidate = function(next, modelInstance) {
  //   if(!!modelInstance.file && modelInstance.file != "")
  //     Productdetail.validatesLengthOf('file', {max: 500, message: {max: 'Link file is too long'}});
  //   if(!!modelInstance.code && modelInstance.code != "")
  //     Productdetail.validatesLengthOf('code', {max: 100, message: { max: 'Code file is too long'}});
  //   next();
  // };

  const enabledRemoteMethods = ['find', 'findById', 'prototype.patchAttributes', 'deleteById', 'create',];
  Productdetail.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    // console.log(methodName);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Productdetail.disableRemoteMethodByName(methodName);
    }
  });

  Productdetail.observe('before delete', function(ctx, next) {
    Productdetail.findById(ctx.where.id, {fields: ['status']})
    .then(data => {
      if (undefined != data && data.status === 0) next();
      else next(mess.DATA_NOT_DELETE);
    })
    .catch(e => next(mess.DATA_NOT_DELETE));
  });

  Productdetail.observe('after delete', function(ctx, next) {
    let id = ctx.where.id;
    let dirPath = `client/uploads/${id}`;
    if (fs.existsSync(dirPath)){
      fs.readdirSync(dirPath).forEach( (f) => {
        var filePath = dirPath + "/" + f;
        if(fs.existsSync(filePath)) fs.unlinkSync(filePath);
      })
      fs.rmdirSync(dirPath);
    }
    next();
  });

  Productdetail.observe('before save', function(ctx, next) { //console.log(ctx);
    if(ctx.instance){
      let {created_by} = ctx.instance;
      let {id} = Productdetail.app.userCurrent;
      if (id.toString() === created_by.toString()) next();
      else next ({...mess.DATA_NO_MATCH, messagse: 'User not exist'});
    }else next();
    
  });

  Productdetail.afterRemote('create', function(ctx, user, next) { 
    let {id} = ctx.result;
    Productdetail.findById(id, {
      include: [
        {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
        {relation: "product", scope: { fields: { name: true }}},
      ]})
      .then(res => {
        ctx.result = res;
        next();
      }, e => Promise.reject(e))
      .catch(e => next(e))
  });

  Productdetail.afterRemote('prototype.patchAttributes', function(ctx, res, next) {
    let {id} = ctx.result;
    let { socketID, userCurrent } = Productdetail.app;

    Productdetail.findById(id, {
      include: [
        {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
        {relation: "product", scope: { fields: { name: true, type: true }}},
      ]})
      .then(res => {
        ctx.result = res;

        if(undefined !== res.status && (res.status === 2 || res.status === 3)){

          let { agency_id } = res.__data;

          if(!!socketID[agency_id] ){
            for(let idS in socketID[agency_id]){
              !!socketID[agency_id][idS] && socketID[agency_id][idS].emit(socket.SEND.SERVER_SEND_REQUEST_TO_CLIENT, res)
            }
          }

        }
        next();
      }, e => Promise.reject(e))
      .catch(e => next(e))
  });




  Productdetail.upload = function(file, id, cb) {

    Productdetail.findById(id, {
      include: [
        {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
        {relation: "product", scope: { fields: { name: true }}},
      ]})
      .then(res => {
        if(!res) return Promise.reject(mess.DATA_NOT_EXIST);

        file.req.params.container = id;
        let dirPath = `client/uploads/${id}`;
        if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);

        Productdetail.app.models.storage.upload(file.req, file.result, {}, function(err, fileS){
          if(err) return Promise.reject(err);

          let data        = fileS.files['file'][0];
          let patchRoot   = Productdetail.app.baseUrl;
          let urlImg      = `${patchRoot}/uploads/${id}/${data.name}`;

          res.file.push({...data, url: urlImg});
          res.save();
          cb(null, {...res.__data});
        });

      }, e => Promise.reject(e))
      .catch(e => cb(e));
  };

  Productdetail.remoteMethod(
      'upload',
      {
       http: {path: '/upload/:id', verb: 'post'},
       accepts: [
          {arg: 'file', type: 'object', 'http': {source: 'context'}},
          {arg: 'id', type: 'string', "required": true}
       ],
       returns: {arg: 'status', type: 'string'}
      }
  );


  //=========================================

  Productdetail.removeFile = function(name, id, cb) {

    Productdetail.findById(id, {
      include: [
        {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
        {relation: "product", scope: { fields: { name: true }}},
      ]})
      .then(res => {
        if(!res) return Promise.reject(mess.DATA_NOT_EXIST);

        let dirPath = `client/uploads/${id}/${name}`;
        if (fs.existsSync(dirPath)) fs.unlink(dirPath);

        res.file = res.file.filter(e => e.name !== name);
        res.save()

        cb(null, res);

      }, e => Promise.reject(e))
      .catch(e => cb(e));
  };

  Productdetail.remoteMethod(
      'removeFile',
      {
       http: {path: '/removeFile/:id', verb: 'post'},
       accepts: [
          {arg: 'name', type: 'string', "required": true},
          {arg: 'id', type: 'string', "required": true}
       ],
       returns: {arg: 'status', type: 'string'}
      }
  );


};
