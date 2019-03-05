'use strict';

var loopback  = require('loopback');
var boot      = require('loopback-boot');
var mess      = require('./../errorMess/messagse.json');
var app       = module.exports = loopback();

let socketID  = {};

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
  if (require.main === module){
    app.io = require('socket.io')(app.start());

    app.io.on('connection', function(socket){
      socket.on('setSocketId', (id) => {
        app.models.users.findById(id)
          .then(res => {
            if(!!res) {
              let { agency } = res.__data;

              socketID[agency] = {
                ...socketID[agency],
                [id]: app.io.sockets.connected[socket.id]
              };
              app.socketID = socketID;
            }
          })
      })

      socket.on('disconnect', function(){
        let { id } = socket;
        for (let idInsur in socketID){
          if(!!socketID[idInsur]){
            let group = socketID[idInsur];
            for(let idUer in group){
              if(id === group[idUer].id){
                delete socketID[idInsur][idUer];
                break;
              }
            }
          }
        }
      })

    })
  }
  
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
    if (undefined === apikey) return res.json({error: {...mess.API_KEY_NOT_EXIST, messagse: "Request refused"}, data: null});
    app.apikey = apikey;
    
    apiClientModel.find({fields: ['key', 'status', 'agency_id'], where: {'key': apikey, 'status': 1}})
      .then(resDT => {
        if (null != resDT) {
          if (resDT.status === 0) return res.json({error: {...mess.API_KEY_DISABLED, messagse: "Request refused"}, data: null});
          if (noAccessToken.indexOf(urlReuest) === -1) {
            if (undefined === accessToken) return res.json({error: {...mess.ACCESS_TOKEN_NOT_EXIST, messagse: "Request refused"}, data: null});
            app.models.AccessToken.findById(accessToken)
              .then(dataToken => {
                if (null === dataToken) return res.json({error: {...mess.ACCESS_TOKEN_INVALID, messagse: "Request refused"}, data: null});
                app.models.Users.findById(dataToken.userId, {
                  include: {
                    relation: 'agency',
                    scope: {
                      fields: {name: true},
                    },
                  }
                })
                  .then(dataU => {
                    if (null === dataU || undefined === dataU.__data.agency) return res.json({error: {...mess.USER_NOT_EXIST_FOR_AGENCY, messagse: "Request refused"}, data: null});
        
                    let f = false;
                    for(let ag of resDT){
                      if(ag.agency_id.toString() === dataU.__data.agency.id.toString()){
                        f = true;
                        break
                      }
                    }

                    if (!f) return res.json({error: {...mess.USER_NOT_EXIST_FOR_AGENCY, messagse: "Request refused"}, data: null});
                    
                    app.userCurrent = dataU;
                    next();
                  })
                  .catch(e => res.json({error: {...mess.USER_NOT_EXIST_FOR_AGENCY, messagse: "Request refused"}, data: null}));
              })
              .catch(e => res.json({error: {...mess.ACCESS_TOKEN_NOT_EXIST, messagse: "Request refused"}, data: null}));
          } else next();
        } else return res.json({error: {...mess.API_KEY_NOT_EXIST, messagse: "Request refused"}, data: null});
      })
      .catch(e => res.json({error: {...mess.API_KEY_NOT_EXIST, messagse: "Request refused"}, data: null}));
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
