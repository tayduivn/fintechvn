'use strict';
var mess            = require('./../../constants/errorMessage.json');

module.exports = function(Email) {
  // Email.sendEmail = function(data, cb) {
  //   let {to, text, subject, html} = data;
  //   let flag = true;

  //   let pattEmail  = /^[A-Za-z\d]+[A-Za-z\d_\-\.]*[A-Za-z\d]+@([A-Za-z\d]+[A-Za-z\d\-]*[A-Za-z\d]+\.){1,2}[A-Za-z]{2,}$/g;
  //   if (!pattEmail.test(to)) flag = false;

  //   if (undefined === subject) subject = '';
  //   if (undefined === text) text = '';
  //   if (undefined === html) html = '';

  //   if (flag) {
  //     Email.app.models.Email.send({to, subject, text, html}, function(err, mail) {
  //       if (err) return cb(err);
  //       cb(null, data);
  //     });
  //   } else return cb({ ...mess.DATA_NO_MATCH, message: 'Email invalid' });
  // };

  // Email.remoteMethod(
  //   'sendEmail', {
  //     http: {path: '/sendEmail', verb: 'post'},
  //     accepts: {arg: 'data', type: 'object',  required: true, http: {source: 'body'}},
  //     returns: {arg: 'res', type: 'object', root: true},
  //   }
  // );
};
