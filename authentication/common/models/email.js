'use strict';
var mess      = require('./../../errorMess/messagse.json');

module.exports = function(Email) {

  Email.sendEmail = function(data, cb) {
    
    let { to, subject, html, from = 'account@financal.vn' } = data;

    let flag = true;

    let pattEmail  = /^[a-z\d]+[a-z\d\-\._]*[a-z\d]+@([a-z\d\-]+\.){1,2}[a-z]{2,}$/gi;
    if (!pattEmail.test(to)) flag = false;

    if (undefined === subject) subject = '';
    if (undefined === html) html = '';

    if (flag) {
      const MAILER = require('nodemailer');

      let transporter = MAILER.createTransport({
        service : 'Yandex',
        auth : {
            user : 'account@financal.vn',
            pass : 'FintechVietnam2018'
        }
      });

      var mailOptions = { from, to, subject, html };

      transporter.sendMail(mailOptions)
        .then(() => { cb(null, data) })
        .catch((e) => { cb(e) });

    } else return cb({...mess.DATA_NO_MATCH, messagse: "Email invalid"});
   
  };

  Email.remoteMethod(
    'sendEmail', {
      http: {path: '/sendEmail', verb: 'post'},
      accepts: {arg: 'data', type: 'object', http: {source: 'body'}},
      returns: {arg: 'res', type: 'object', root: true},
    }
  );
};
