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

  	let types = ['motor', 'house'];
  	if(types.indexOf(type) !== -1){
  		switch(type){
  			case 'motor':
  				this.getTypeMotor(cb);
  				break;
        case 'house':
          this.getTypeHouse(cb);
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
        cb(null, data);

        
      })
      .catch(e => cb(e));
  }

  Product.getTypeHouse = function(cb){
    let data = {};
    let { userCurrent } = Product.app;
    let insur_id = userCurrent.agency.insur_id;

    Product.findOne({where: {type: 'house'}})
      .then(res => {
        if(!res) return Promise.reject(mess.REQUEST_REFUSED);
        let steps = res.block;
        data = {steps};
        data.id = res.id;
        cb(null, data);
      })
      .catch(e => cb(e));
  }
};
