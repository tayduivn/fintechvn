'use strict';

let fun = require('./functions');

const Validate = {
  error: {},
  data: {},
  isNum: n => typeof(n) === Number.name.toLowerCase() || n instanceof Number || Object.prototype.toString.call(n) === '[object Number]',
  isPhone: phone => {
    if (undefined === phone) return false;
    return /^(84|0)\d{9}$/.test(phone.toString());
  },
  isInt: i => Validate.isNum(+i) && /^\-?\d+$/g.test(i.toString()),
  isString: s => typeof(s) === String.name.toLowerCase() || s instanceof String || Object.prototype.toString.call(s) === '[object String]',
  isArr: a => typeof(a) === Object.name.toLowerCase() && (a instanceof Array || Object.prototype.toString.call(a) === '[object Array]'),
  isObj: o => typeof(o) === Object.name.toLowerCase() || o instanceof Object || Object.prototype.toString.call(o) === '[object Object]',
  inArr: (arr, val) => Validate.isArray(arr) && arr.indexOf(val) > -1,
  checkRuleRange: (value, rule) => {
    if (undefined !== rule.min && !!Validate.isNum(rule.min) && value < rule.min) return false;
    
    if (undefined !== rule.max && !!Validate.isNum(rule.max) && value > rule.max) return false;
  
    return true;
  },
  checkRuleExist: (value, rule) => {
    // if (!!rule.in && Validate.isArr(rule.in) && rule.in.indexOf(value) === -1) return false;
    if (!!rule.in && Validate.inArr(rule.in, value)) return false;

    if (!!rule.notin && !Validate.inArr(rule.notin, value)) return false;
    // if (!!rule.notin && Validate.isArr(rule.notin) && rule.notin.indexOf(value) !== -1) return false;

    return true;
  },
  validatePhone: phone => Validate.isPhone(phone),
  validateString: (value, rule) => {
    if (!Validate.isString(value)) return false;

    let length = value.length;

    if (!Validate.checkRuleRange(length, rule)) return false;
    
    if (!!rule.base && !(new RegExp(rule.base).test(value))) return false;
    
    if (!Validate.checkRuleExist(value, rule)) return false;
    
    return true;
  },
  validateInt: (value, rule) => {
    if (undefined === value || !Validate.isInt(value)) return false;
    value = parseInt(value, 10);

    if (!Validate.checkRuleRange(value, rule)) return false;

    if (!Validate.checkRuleExist(value, rule)) return false;
    
    return true;
  },
  validateEmail: (value, rule) => {
    if (!Validate.isString(value)) return false;
    let length = value.length; 

    let reg = /^[\w\.\-]+@([\w\-]{2,}\.){1,2}[A-Za-z]{2,}$/;
    if (!reg.test(value)) return false;

    if (!Validate.checkRuleRange(length, rule)) return false;

    if (!!rule.base && !(new RegExp(rule.base).test(value))) return false;

    if (!Validate.checkRuleExist(value, rule)) return false;

    return true;
  },
  validateArr: (value, rule) => {
    if (!Validate.isArr(value)) return false;
    let length = value.length;

    if (!Validate.checkRuleRange(length, rule)) return false;

    if (!!rule.base) {
      let str = JSON.stringify(value);
      if (!(new RegExp(rule.base).test(str))) return false;
    }
    return true;
  },
  validateBool: value => Validate.inArr([true, false], value), // ([true, false, 1, 0].indexOf(value) === -1) ? false : true,
  validateDomain: (value, rule) => {
    if (!Validate.isString(value)) return false;

    let pattern = '^(https?://)?(www\.)?([A-Za-z0-9]+[A-Za-z0-9\-]*[A-Za-z0-9]+\.){1,2}[A-Za-z]{2,}/?';

    if (!(new RegExp(pattern).test(value))) return false;

    if (!Validate.checkRuleExist(value, rule)) return false;

    return true;
  },
  validateObj: (value, rule) => {
    if (!Validate.isObj(value)) return false;
    let length = Object.keys(value).length;

    if (!Validate.checkRuleRange(length, rule)) return false;
    
    return true;
  },
  validDataForm: (rules, data) => {
    Validate.data   = {};
    Validate.error  = {};

    Object.keys(rules).forEach(e => {
      let method = `validate${fun.ucfirst(!!rules[e].type ? rules[e].type : '')}`;
      if (!!fun.isExistFun(Validate, method)) {
        if (!!Validate[method](data[e], rules[e])) Validate.data[e] = data[e];
        else Validate.error[e] = true;
      };
    });
    return Validate;
  },
};

module.exports = Validate;
