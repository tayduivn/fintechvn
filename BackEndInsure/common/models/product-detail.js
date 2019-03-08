'use strict';
var mess      = require('./../../errorMess/messagse.json');
var socket    = require('./../../config/socket.json');
var fs          = require('fs');

var formDataPdf = require('./../../libs/cks/formData.js');
const Sign = require('./../../libs/cks/baominh-ds/index');

module.exports = function(Productdetail) {

  Productdetail.validatesInclusionOf('status', {in: [0, 1, 2, 3]});
  Productdetail.validatesUniquenessOf('code', {message: 'Code already exists'});
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

  // Productdetail.observe('before save', function(ctx, next) { //console.log(ctx);
  //   if(ctx.instance){
  //     let {created_by} = ctx.instance;
  //     let {id} = Productdetail.app.userCurrent;
  //     if (id.toString() === created_by.toString()) next();
  //     else next ({...mess.DATA_NO_MATCH, messagse: 'User not exist'});
  //   }else next();

  // });

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

  Productdetail.afterRemote('prototype.patchAttributes', async function(ctx, res, next) {
    let {id} = ctx.result;
    let { socketID, userCurrent } = Productdetail.app;
    //formDataPdf
    let product = await Productdetail.findById(id, {
        include: [
          {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
          {relation: "product", scope: { fields: { name: true, type: true }}},
          {relation: "agency", scope: { fields: { name: true }}},
        ]});


    if(!!product && (product.status === 2 || product.status === 3)){
      let { agency_id, id } = product;

      if(product.status === 3){
        let dir = 'policies';
        let dirPath = `${__dirname}/../../client/${dir}`;

        if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);

        let filename = `${id}.pdf`;
        let urlFile = `${dirPath}/${filename}`;

        if (fs.existsSync(urlFile)) fs.unlinkSync(urlFile);

        let datapdf = Productdetail.getDataPDF(product);

        new Sign(datapdf, urlFile);

        let resu = await Productdetail.findById(id);

        let patchRoot   = Productdetail.app.baseUrl;
        let url         = `${patchRoot}/${dir}/${filename}`;

        resu.filePDF    = url;
        product.filePDF = url;
        resu.save();
      }

      if(!!socketID && !!socketID[agency_id] ){
        for(let idS in socketID[agency_id]){
          !!socketID[agency_id][idS] && socketID[agency_id][idS].emit(socket.SEND.SERVER_SEND_REQUEST_TO_CLIENT, product)
        }
      }

      let insurAgencyId = userCurrent.__data.agency.id;

      if(!!socketID && !!socketID[insurAgencyId]){
        for(let idS in socketID[insurAgencyId]){
          idS !== userCurrent.__data.id.toString() && !!socketID[insurAgencyId][idS] && socketID[insurAgencyId][idS].emit(socket.SEND.SERVER_INSUR_UPDATE_REQUEST, product)
        }
      }

    }

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


  Productdetail.pdf = async function(pdfBase, id, cb) {
    let error = {...mess.DATA_NO_MATCH, messagse: "Product not exist"};
    let data = null;

    let product = await Productdetail.findById(id);

    if(!!product && product.status === 3){
      let dir = 'policies';

      let dirPath = `${__dirname}/../../client/${dir}`;
      if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);

      let filename = `${id}.pdf`;
      let urlFile = `${dirPath}/${filename}`;

      let doc = new PDFDocument({ layout: 'landscape', size: [900, 600]});

      doc.pipe(fs.createWriteStream(urlFile));

      doc.image(pdfBase, 0, 0, { scale: 0.75});

      doc.addPage();
      doc.image(pdfBase, 0, -900, { scale: 0.75});

      doc.addPage();
      doc.image(pdfBase, 0, -1800, { scale: 0.75});

      doc.addPage();
      doc.image(pdfBase, 0, -2700, { scale: 0.75});

      doc.addPage();
      doc.image(pdfBase, 0, -3600, { scale: 0.75});

      doc.addPage();
      doc.image(pdfBase, 0, -4500, { scale: 0.75});

      doc.end();

      let patchRoot   = Productdetail.app.baseUrl;
      let urlF      = `${patchRoot}/${dir}/${filename}`;
      product.policies = urlF;

      await product.save();

      data = await Productdetail.findById(id, {
        include: [
          {relation: "users", scope: { fields: { firstname: true, lastname: true }}},
          {relation: "product", scope: { fields: { name: true, type: true }}},
          {relation: "agency", scope: { fields: { name: true }}}
        ]});

      if (!!data) error = null;

      let { socketID, userCurrent } = Productdetail.app;
      let idAg = userCurrent.__data.agency.id;
      if(!!socketID && !!socketID[idAg]){
        for(let idS in socketID[idAg]){
          idS !== userCurrent.__data.id.toString()
          && !!socketID[idAg][idS]
          && socketID[idAg][idS].emit(socket.SEND.SERVER_BANKCAS_UPDATE_REQUEST, data)
        }
      }

    }

    if (!!error) return Promise.reject(error);
    console.log(data);
    return data;

  };

  Productdetail.remoteMethod(
      'pdf',
      {
       http: {path: '/pdf/:id', verb: 'post'},
       accepts: [
          {arg: 'pdfBase', type: 'string', "required": true},
          {arg: 'id', type: 'string', "required": true}
       ],
       returns: {arg: 'status', type: 'string'}
      }
  );

  Productdetail.getDataPDF = function(product){
		if(!product) return {};

		let { page1, page2 } =  formDataPdf;
		let { detail } = product;

		page1.policyInformation.bestCode = !!product.code ? product.code : "";
		page1.policyInformation.agency = !!product.agency ? product.agency.name: "";

		page1.policyHolder = {
			policyHolder  : !!detail.nameCustomer ? detail.nameCustomer : "",
			address       : !!detail.addressCustomer && !!detail.addressCustomer.addressFull ? detail.addressCustomer.addressFull : "",
			idTaxNo       : !!detail.tax_number ? detail.tax_number : ""
		};

		page1.periodInsurance = {
			from  : !!product.startDay ? convertDMY(product.startDay, '-') : "",
			to    : !!product.endDay ? convertDMY(product.endDay, '-') : "",
		};

		page1.dateProposal = !!product.create_at ? convertDMY(product.create_at, '-') : "";

		let { price, connguoi, hanghoa, priceMore, disPrice } = detail;
		connguoi  = !!connguoi && !!connguoi.sumFee ? connguoi.sumFee: 0;
		hanghoa   = !!hanghoa && !!hanghoa.fee ? hanghoa.fee: 0;
		priceMore = !!priceMore ? priceMore : 0;
		disPrice  = !!disPrice ? disPrice : 0;

		page1.premium = {
			compulsory  : `${!!detail.tnds && !!detail.tnds.feeTnds ? formatPrice(detail.tnds.feeTnds) : 0} VNĐ`,
			voluntary   : `${formatPrice(price +  connguoi + hanghoa + priceMore - disPrice)} VNĐ`,
			total       : `${!!detail.sumPrice ? formatPrice(detail.sumPrice) : 0} VND`,
			vat         : `${!!detail.priceVAT ? formatPrice(detail.priceVAT) : 0} VND`,
			totalVat    : `${!!product.price ? formatPrice(product.price) : 0} VND`,
		}

		page1.riskDetail = {
			typeCover       : 'Bảo hiểm tự nguyện vật chất xe',
			regnNo          : `${!!detail.registration_number ? detail.registration_number : ""}`,
			chassisNo       : `${!!detail.chassis_number ? detail.chassis_number : ""}`,
			engineNo        : `${!!detail.engine_number ? detail.engine_number : ""}`,
			typeUse         : `${!!detail.listInfo._getCareType && !!detail.listInfo._getCareType.text ? detail.listInfo._getCareType.text : ""}`,
			makeModel       : `${!!detail.make_model ? detail.make_model : ""}`,
			yearManufacture : `${!!detail.yearcar ? detail.yearcar : ""}`,
			seating         : `${!!detail.listInfo && !!detail.listInfo._getSeatsPayload && !!detail.listInfo._getSeatsPayload.name
				? detail.listInfo._getSeatsPayload.name : ""}`,
			carValue        : `${!!detail.listInfo && !!detail.listInfo._getPriceCar ? formatPrice(detail.listInfo._getPriceCar.value) : 0} VND`,
			sumInsured      : `${!!detail.listInfo && !!detail.listInfo._getPriceCar ? formatPrice(detail.listInfo._getPriceCar.value) : 0} VND`,
		},

		page1.inheritorInformation = {
			inheritor   : `${!!detail.inheritor ? detail.inheritor : ""}`,
			address     : `${!!detail.address ? detail.address : ""}`,
			taxId       : `${!!detail.tax_amount ? detail.tax_amount : ""}`,
		};

		page1.listCoverage.compulsoryCoverage = {
			value : `${ !!detail.tnds && !!detail.tnds.feeTnds ? formatPrice(detail.tnds.feeTnds) : 0} VNĐ`,
			childList : {
				thirdPartyBodilyInjury : {
					sumInsured : `${ !!detail.tnds && !!detail.tnds.feeTnds ? formatPrice(100000000) : 0} VNĐ`,
					passengerWeight : '',
					premium : ''
				},
				thirdPartyPropertyDamage : {
					sumInsured : `${ !!detail.tnds && !!detail.tnds.feeTnds ? formatPrice(100000000) : 0} VNĐ`,
					passengerWeight : '',
					premium : ''
				},
				passengerBodilyInjury : {
					sumInsured : '0 VNĐ',
					passengerWeight : '',
					premium : ''
				},
				motorCertificate : {
					sumInsured : '',
					passengerWeight : '',
					premium : ''
				},
			}
		};

		page1.listCoverage.voluntaryCoverage = {
			value : '',
			childList : {
				physicalDamage : {
					sumInsured : `${!!detail._getPriceCar && !!detail.listInfo._getPriceCar.value ?
						formatPrice(detail.listInfo._getPriceCar.value) : '0,00' } VNĐ`,
					passengerWeight : '',
					premium : `${ !!detail.price ?  formatPrice(detail.price) : '0,00' } VNĐ`
				},
				deductible : {
					sumInsured : '0.00',
					passengerWeight : '',
					premium : ''
				}
			}
		}

		page2.payment.duePaymentDate = {
			dueDate       : `${ !!product.startDay ?  convertDMY(product.startDay, '-') : ""}`,
			paymentDate   : `${ !!product.endDay ?  convertDMY(product.endDay, '-') : ""}`,
		}

		let premium       = `${!!detail.priceVAT && !!product.price ?  formatPrice(product.price - detail.priceVAT) : ""} VNĐ`;
		let vat           = `${!!detail.priceVAT ?  formatPrice(detail.priceVAT) : ""} VNĐ`;
		let amountPayable = `${!!product.price ?  formatPrice(product.price) : ""} VNĐ`;

		page2.payment.premium       = premium;
		page2.payment.vat           = vat;
		page2.payment.amountPayable = amountPayable;

		page2.payment.total = { premium, vat, amountPayable};

		return { page1, page2 };
	}

};




function convertDMY(date, currency){
  if(!currency) currency = "-";
  let fullDate = new Date(date);

  let dd   = fullDate.getDate();
  if( dd < 10 )  dd = '0' + dd;

  let mm   = fullDate.getMonth() + 1;
  if( mm < 10 )  mm = '0' + mm;

  let yyyy   = fullDate.getFullYear();

  return dd + currency + mm + currency + yyyy;
}


function formatPrice(n, currency, fix = 1){
  if(!currency) currency = "";
  if(!n || n === 0) return 0 + ` ${currency}`;
  return n.toFixed(fix).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' ' + currency;
}
