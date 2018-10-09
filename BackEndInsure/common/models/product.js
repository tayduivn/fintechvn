'use strict';

var mess      = require('./../../errorMess/messagse.json');

module.exports = function(Product) {

  Product.validatesLengthOf('name', {min: 3, max: 500, message: {min:'Name file is too short', max: 'Name file is too long'}});
  Product.validatesLengthOf('icon', {min: 3, max: 100, message: {min:'Icon file is too short', max: 'Icon file is too long'}});

  const enabledRemoteMethods = ['find'];
  Product.sharedClass.methods().forEach(function(method) {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      Product.disableRemoteMethodByName(methodName);
    }
  });

  Product.getProductType = function(type, cb) {

  	let types = ['motor'];
  	if(types.indexOf(type) !== -1){
  		switch(type){
  			case 'motor':
  				this.getTypeMotor(cb);
  				break;
  			default:
  				cb({...mess.DATA_NO_MATCH, messagse: "type invalid"})
  		}
  	}else cb({...mess.DATA_NO_MATCH, messagse: "type invalid"});

  };

  Product.remoteMethod(
    'getProductType', {
      http: {path: '/getProductType', verb: 'get'},
      accepts: {arg: 'type', type: 'string', required: true},
      returns: {arg: '', type: 'object', root: true}
    }
  );

  //============================= Function ===========================
  Product.getTypeMotor = function(cb){
  	let data = {};
  	let { userCurrent } = Product.app;
  	let insur_id = userCurrent.agency.insur_id;

  	Product.findOne({where: {type: 'motor'}})
  		.then(res => {
  			if(!res) return Promise.reject(mess.REQUEST_REFUSED);
  			let steps = res.block;
  			data = {steps};
  			data.id = res.id;
  			
  			return Product.app.models.seatsPayload.find({where: {insur_id, removed: 0}});
  		})
  		.then(res => {
  			if(!!res){
  				let step = {
                "label" : "Số chổ ngồi xe",
                "question" : "Số chổ ngồi xe bao nhieu?",
                "tag" : "select>name:select>id:seatspayload",
                "required" : false,
                "rule" : "str:24:24",
                "col": 6,
				  			"id" : "seatspayload",
				  			"events" : {
                            "click" : "_getSeatsPayload",
                            "change" : "_getSeatsPayload"
                        },
                "defaultValue": null,
                "message" : "Không được trống"
              }
          let options = [{text: "-- Chọn số ghế xe", value: null}];
          for(let va of res){
          	let { name, id, ...rest } = va.__data;
          	options.push({text:name, value: id, ...rest});
          }
          step['options'] = options;
          data.steps.step1.controls[1].push(step);
  			}
				
				return Product.app.models.ruleExtends.find({where: {insur_id}})
  		})
  		.then(res => {
  			let ruleExtends = [];
        if(!!res){
        	for(let val of res){
        		let { name, id, ...rest } = val.__data;

        		let step = {
        				"name": name,
                "tag" : "checkbox",
                "required" : false,
                "col": 12,
                "events" : {
                            "click" : "_getRuleExtends",
                        },
				  			"id" : id,
				  			...rest
              }
             ruleExtends.push(step);
        	}
        }
  			data.steps.step1.controls.push(ruleExtends);
  			cb(null, data);
  		})
  		.catch(e => cb(e));
  }
};
