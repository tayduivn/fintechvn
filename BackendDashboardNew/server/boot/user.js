'use strict';

module.exports = function(app) {
  delete app.models.users.validations.email;
  delete app.models.users.validations.username;
};
