'use strict';

var loopback  = require('loopback');
var boot      = require('loopback-boot');
var mess      = require('./../errorMess/messagse.json');
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
  let serectkey          = req.headers['serectkey'];
  let serectKeyModel     = app.models.serectServer;
  let ip                 = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
console.log(ip);
//console.log('111111111111111111');
  if (undefined !== serectkey) {
    
    serectKeyModel.findOne({fields: ['ipServer', 'key', 'status'], where: {'key': serectkey}}, function(err, resDT) {
      if (err) return res.json({error: mess.SERECT_KEY_NOT_EXIST, data: null});

      if (null !== resDT) {
        if (resDT.ipServer === ip || true) {
          if (resDT.status === 1) {
            app.serverData = {serectkey, ip};
            next();
          } else return res.json({error: mess.SERECT_KEY_DISABLED, data: null});
        } else return res.json({error: mess.IP_SERVER_DENY, data: null});
      } else return res.json({error: mess.SERECT_KEY_INVALID, data: null});
    });
  } else return res.json({error: mess.SERECT_KEY_NOT_EXIST, data: null});
});

