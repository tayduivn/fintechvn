'use strict';

require('dotenv').config();

var loopback  = require('loopback');
var boot      = require('loopback-boot');
var mess      = require('./../constants/errorMessage.json');
var app       = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});

app.use(function(req, res, next) {
  let accessToken        = req.headers['access-token'];
  let serectKeyModel     = app.models.serectServer;
  let ip                 = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  let ipServer           = app.get('ipServer');
  let restApiRoot        = app.get('restApiRoot');
  let urlReuest          = req.url;

  let noAccessToken = [
    `${restApiRoot}/users/login`,
    `${restApiRoot}/users/register`,
    `${restApiRoot}/emails/sendEmail`,
  ];
 
  //if (undefined === ip || undefined === ipServer) return res.json({error: mess.IP_NOT_EXIST, data: null});
  //if (ip !== ipServer) return res.json({error: mess.IP_INVALID, data: null});
  next();
  // if (noAccessToken.indexOf(urlReuest) === -1) {
    
  // } else next();
});

app.get('remoting').errorHandler = { 
  handler: function(error, req, res, next) {    
    if (error instanceof Error) {
      let {message, statusCode, name, ...rest} = error;
      
      res.json({
        error: {
          message,
          statusCode,
          name,
          num: statusCode,
          ...rest
        },
        data: null
      });
    }
    next();
  },
  debug: true,
};
