'use strict';

module.exports = function(server) {
  var remotes = server.remotes();

  // remotes.before('**', function (ctx, next, method) {
  //   next();
  // });

  remotes.after('**', function (ctx, next) { 
    ctx.result = {error: null, data: ctx.result};
    next();
  });

  remotes.afterError('**', function (ctx, next) {
    return ctx.res.json({error: {
      code: ctx.error.name,
      messagse: ctx.error.message,
      num: ctx.error.statusCode,
      ...ctx.error,
    }, data: null});
  });
};