'use strict';
var mess      = require('./../../errorMess/messagse.json');
var socket    = require('./../../config/socket.json');
var fs          = require('fs');
var PDFDocument = require('pdfkit');

module.exports = function(Productdetail) {

  Productdetail.validatesInclusionOf('status', {in: [0, 1, 2]});
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

    let { socketID, userCurrent } = Productdetail.app;
        
    let idAg = userCurrent.__data.agency.id;

    if(!!mess && !!socketID[idAg]){
      for(let idS in socketID[idAg]){
        idS !== userCurrent.__data.id.toString() && !!socketID[idAg][idS] && socketID[idAg][idS].emit(socket.SEND.SERVER_BANKCAS_DELETE_REQUEST, id)
      }
    }

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
        {relation: "product", scope: { fields: { name: true, type: true }}},
      ]})
      .then(res => {
        ctx.result = res;
        let { socketID, userCurrent } = Productdetail.app;
        
        let idAg = userCurrent.__data.agency.id;

        if(!!mess && socketID[idAg]){
          for(let idS in socketID[idAg]){ console.log(idS)
            idS !== userCurrent.__data.id.toString() && !!socketID[idAg][idS] && socketID[idAg][idS].emit(socket.SEND.SERVER_BANKCAS_UPDATE_REQUEST, res)
          }
        }

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
      .then(resPro => {
        ctx.result = resPro;

        let idAg = userCurrent.__data.agency.id;

        if(!!mess && socketID[idAg]){
          for(let idS in socketID[idAg]){
            idS !== userCurrent.__data.id.toString() && !!socketID[idAg][idS] && socketID[idAg][idS].emit(socket.SEND.SERVER_BANKCAS_UPDATE_REQUEST, resPro)
          }
        }

        if(!!resPro.status && resPro.status === 1){
          let dataMess = {
            userID: userCurrent.id,
            nameAction: "Send request",
            nameWork: !!resPro.detail.nameCustomer ? resPro.detail.nameCustomer : "",
            idWork: id,
            agencyID: null,
            link: `/product/${resPro.__data.product.type}/${id}`,
            time: Date.now()
          }

          Productdetail.app.models.agency.findById(userCurrent.__data.agency.id)
            .then(age => {
              if(!!age){ 
                let { insur_id } = age.__data;

                dataMess.agencyID = insur_id;
                Productdetail.app.models.messages.create(dataMess)
                  .then(messSend => {
                    if(!!socketID && !!messSend && !!socketID[insur_id] ){
                      Productdetail.app.models.messages.findById(messSend.__data.id, {
                        include: [
                          {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
                        ]
                      })
                      .then(mess => {
                        if(!!mess && socketID[insur_id]){
                          for(let idS in socketID[insur_id]){
                            !!socketID[insur_id][idS] && socketID[insur_id][idS].emit(socket.SEND.SERVER_SEND_MESS_TO_CLIENT, mess)
                          }
                        }
                      })
                      
                    }
                  })

                if(!!socketID && !!socketID[insur_id] ){
                  for(let idS in socketID[insur_id]){
                    !!socketID[insur_id][idS] && socketID[insur_id][idS].emit(socket.SEND.SERVER_SEND_REQUEST_TO_CLIENT, resPro)
                  }
                }
              }
            })
        }
        next();
      }, e => Promise.reject(e))
      .catch(e => next(e))
  });




  Productdetail.upload = function(file, id, cb) {

    Productdetail.findById(id, {
      include: [
        {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
        {relation: "product", scope: { fields: { name: true, type: true }}},
      ]})
      .then(res => {
        if(!res) return Promise.reject(mess.DATA_NOT_EXIST);

        file.req.params.container = id;
        let dirPath = `client/uploads/${id}`;
        if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);

        Productdetail.app.models.storagess.upload(file.req, file.result, {}, function(err, fileS){
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
        {relation: "product", scope: { fields: { name: true, type: true }}},
      ]})
      .then(res => {
        if(!res) return Promise.reject(mess.DATA_NOT_EXIST);

        let dirPath = `client/uploads/${id}/${name}`;
        if (fs.existsSync(dirPath)) fs.unlink(dirPath);

        res.file = res.file.filter(e => e.name !== name);
        
        res.save();

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

  //==================== Create PDF ===================

  Productdetail.pdf = function(pdf, id, cb) {
    let doc = new PDFDocument({
        layout: 'landscape',
        size: [900, 600] // a smaller document for small badge printers
      });
    let imgWidth    = 794; 
    let pageHeight  = 1200; 
    let canW        = 794;
    let canH        = 7275;
    let imgHeight   = canH * imgWidth / canW;
    let heightLeft  = imgHeight;
    let position    = 0;

    doc.pipe(fs.createWriteStream(__dirname + './../../client/test/output.pdf'))
    doc.image(pdf, 0, position, { scale: 0.75});
    heightLeft -= pageHeight;

    doc.addPage();
    doc.image(pdf, 0, -900, { scale: 0.75});

    doc.addPage();
    doc.image(pdf, 0, -1800, { scale: 0.75});

    doc.addPage();
    doc.image(pdf, 0, -2700, { scale: 0.75});

    doc.addPage();
    doc.image(pdf, 0, -3600, { scale: 0.75});

    doc.addPage();
    doc.image(pdf, 0, -4500, { scale: 0.75});

    doc.end();

  };

  Productdetail.remoteMethod(
      'pdf',
      {
       http: {path: '/pdf', verb: 'post'},
       accepts: [
          {arg: 'pdf', type: 'string', "required": true},
       ],
       returns: {arg: 'status', type: 'string'}
      }
  );


};
