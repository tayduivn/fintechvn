'use strict';

var TB = require('./../../libs/TB');

module.exports = function(server) {
  var remotes = server.remotes();

  remotes.before('**', function (ctx, next, method) {
    let { data } = ctx.args;
    if (!!data){
      let model = ctx.methodString.split('.')[0];
      if (!!model){
        model = `TB_${model.toUpperCase()}`;
        let dt = {};
        if (!!TB[model]){
          Object.keys(data).forEach(e => {
            if (TB[model].indexOf(e) !== -1) dt[e] = data[e];
          });
        }
        ctx.args.data = dt;
      }
    }
    next();
  });

  remotes.after('**', function (ctx, next) {
    ctx.result = {error: null, data: ctx.result};
    next();
  });

  remotes.afterError('**', function (ctx, next) {
    return ctx.res.json({error: {
      code: ctx.error.name,
      message: ctx.error.message,
      num: ctx.error.statusCode,
      ...ctx.error,
    }, data: null});
  });
};