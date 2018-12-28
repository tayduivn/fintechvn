'use strict';

const Functions = {
  ucfirst: str => {
    if (!str || str.length === 0 || typeof str !== 'string') return '';
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  },
  isFun: fn => fn instanceof Function,
  isExistFun: (it, fun) => !!it && !!fun && fun in it && Functions.isFun(it[fun]),
  isEmpty: input => !input || ('push' in input && input.length === 0) || Object.keys(input).length === 0,
  isArr: input => !!input && 'push' in input,
  isObj: input => !!input && 'delete' in input && Object.keys(input).length > 0,
  disableAllMethodsBut: (model, methodsToExpose) => {
    if (model && model.sharedClass) {
      methodsToExpose       = methodsToExpose || [];

      var modelName         = model.sharedClass.name;
      var methods           = model.sharedClass.methods();
      var relationMethods   = [];
      var hiddenMethods     = [];

      try {
        Object.keys(model.definition.settings.relations).forEach(function(relation) {
          relationMethods.push({ name: '__findById__' + relation, isStatic: false });
          relationMethods.push({ name: '__destroyById__' + relation, isStatic: false });
          relationMethods.push({ name: '__updateById__' + relation, isStatic: false });
          relationMethods.push({ name: '__exists__' + relation, isStatic: false });
          relationMethods.push({ name: '__link__' + relation, isStatic: false });
          relationMethods.push({ name: '__get__' + relation, isStatic: false });
          relationMethods.push({ name: '__create__' + relation, isStatic: false });
          relationMethods.push({ name: '__update__' + relation, isStatic: false });
          relationMethods.push({ name: '__destroy__' + relation, isStatic: false });
          relationMethods.push({ name: '__unlink__' + relation, isStatic: false });
          relationMethods.push({ name: '__count__' + relation, isStatic: false });
          relationMethods.push({ name: '__delete__' + relation, isStatic: false });
        });
      } catch (err) {}

      methods.concat(relationMethods).forEach(function(method) {
        let methodName = method.name;
        if (methodsToExpose.indexOf(methodName) < 0) {
          hiddenMethods.push(methodName);
          model.disableRemoteMethod(methodName, method.isStatic);
        }
      });

      /*
        =============================== OPTION ==================================
        - create
        - patchOrCreate
        - replaceOrCreate
        - upsertWithWhere
        - exists
        - findById
        - replaceById
        - find
        - findOne
        - updateAll
        - deleteById
        - count
        - patchAttributes
        - createChangeStream,
        - login,
        - logout
        - verify
        - confirm
        - resetPassword,
        - changePassword
        - setPassword
        - __findById__[relations] vd: __findById__accessTokens
        - __destroyById__[relations]
        - __updateById__[relations]
        - __exists__[relations]
        - __link__[relations]
        - __get__[relations]
        - __create__[relations]
        - __update__[relations]
        - __destroy__[relations]
        - __unlink__[relations]
        - __count__[relations]
        - __destroy__[relations]
        - __delete__[relations]
      */
    }
  },
};

module.exports = Functions;
