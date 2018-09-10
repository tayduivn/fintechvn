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
    app.baseUrl = baseUrl;
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
  let restApiRoot        = app.get('restApiRoot');
  let noAccessToken = [
    `${restApiRoot}/users/login`,
    `${restApiRoot}/users/forgotPassword`,
    `${restApiRoot}/users/checkToken`,
    `${restApiRoot}/users/accessForgotPassword`,
    `${restApiRoot}/emails/sendEmail`,
  ];
  
  let urlReuest          = req.url;
  let apikey             = req.headers['apikey'];
  let apiClientModel     = app.models.apiClient;
  let accessToken        = req.headers['access-token'];
  
  if(urlReuest.indexOf(restApiRoot) !== -1){
    if (undefined === apikey) return res.json({error: mess.API_KEY_NOT_EXIST, data: null});
    apiClientModel.findOne({fields: ['key', 'status', 'agency_id'], where: {'key': apikey}})
      .then(resDT => {
        if (null != resDT) {
          if (resDT.status === 0) return res.json({error: mess.API_KEY_DISABLED, data: null});
          if (noAccessToken.indexOf(urlReuest) === -1) {
            if (undefined === accessToken) return res.json({error: mess.ACCESS_TOKEN_NOT_EXIST, data: null});
            app.models.AccessToken.findById(accessToken)
              .then(dataToken => {
                if (null === dataToken) return res.json({error: mess.ACCESS_TOKEN_INVALID, data: null});
                app.models.Users.findById(dataToken.userId, {
                  include: {
                    relation: 'agency',
                    scope: {
                      fields: {name: true},
                    },
                  }
                })
                  .then(dataU => {
                    if (null === dataU || undefined === dataU.__data.agency) return res.json({error: mess.USER_NOT_EXIST_FOR_AGENCY, data: null});
                    if (dataU.__data.agency.id != resDT.agency_id) return res.json({error: mess.USER_NOT_EXIST_FOR_AGENCY, data: null});
                    app.userCurrent = dataU;
                    next();
                  })
                  .catch(e => res.json({error: mess.USER_NOT_EXIST_FOR_AGENCY, data: null}));
              })
              .catch(e => res.json({error: mess.ACCESS_TOKEN_NOT_EXIST, data: null}));
          } else next();
        } else return res.json({error: mess.API_KEY_NOT_EXIST, data: null});
      })
      .catch(e => res.json({error: mess.API_KEY_NOT_EXIST, data: null}));
  }else next();
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
  disableStackTrace: true,
};
