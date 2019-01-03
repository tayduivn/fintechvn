'use strict';

var Fun             = require('./../../libs/functions');

module.exports = function(Carmodel) {

  /* Validate Data */
  Carmodel.validatesLengthOf('name', { min: 3, max: 250, message: {min: 'Name is too short', max: 'Name is too long'}})
  Carmodel.validateAsync('carLabelId', hasCarLabelId, { message: 'CarLabelId not found models' });
  
  async function hasCarLabelId(err, next) { 
    if (!this.carLabelId) return next();
    var CarLabel = Carmodel.app.models.carLabel;
    let test = await CarLabel.exists(this.carLabelId);
    if(!test) err();
    return next();
  }
  // Carmodel.validatesFormatOf('carLabelId', {with: /^[a-z\d]{24}$/g, message: 'CarLine id invalid'});
  
  /* disableRemoteMethodByName */
  const enabledRemoteMethods = ['find', 'patchAttributes', 'create', 'deleteById'];
  Fun.disableAllMethodsBut(Carmodel, enabledRemoteMethods);
};
