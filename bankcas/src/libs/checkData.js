
import $ from 'jquery';

export const checkData = (id) => {
  let data  = {};
  let error = [];

  $(`form#${id}`).find('.form-item').each(function(){
    if ('DIV' === this.nodeName){
      let selector = $(this).find('input');
      let name  = $(this).find('input').attr('name');
      let rule  = $(this).find(`[form-valid]`).attr('form-valid');
      if(!validate(selector, rule)){
        $(selector).parents('.form-item').addClass('error');
        error.push({[name]: selector.val()});
      }
      else{
        data[name] = selector.val();
        $(selector).parents('.form-item').removeClass('error');
      }
    }else if('SELECT' === this.nodeName){
      let selector = $(this);
      let name  = $(this).attr('name');
      let rule  = $(this).attr('form-valid');

      if(!validate(selector, rule)){
        $(selector).parents('.field').addClass('error');
        error.push({[name]: selector.val()});
      }
      else{
        data[name] = selector.val();
        $(selector).parents('.field').removeClass('error');
      }
    }else if('TEXTAREA' === this.nodeName){
      let selector = $(this);
      let name  = $(this).attr('name');
      let rule  = $(this).attr('form-valid');

      if(!validate(selector, rule)){
        $(selector).parents('.fields').addClass('field error');
        error.push({[name]: selector.val()});
      }
      else{
        data[name] = selector.val();
        $(selector).parents('.fields').removeClass('field error');
      }
    }
  })

  return {data, error}
}

const validate = (selector, rules) => {
  let r = rules.split(':');

  switch(r[0]){
    case 'str':
      return validString(selector, r);
    case 'num':
      return validNumber(selector, r);
    case 'int':
      return validInteger(selector, r);
    case 'email':
      return validEmail(selector, r);
    case 'file':
      return validFile(selector, r);
    case 'ip':
      return validIP(selector, r);
    case 'domain':
      return validDomain(selector, r);
    case 'base':
      return validBase(selector, r);
    case 'phone':
      return validPhone(selector, r);
    default:
      return true;
  }
}

const validString = (selector, rule) => {
  let value = $(selector).val().trim();
  if(!checkRuleRange(value.length, rule)) return false;
  return true;
}

const validNumber = (selector, rule) => {
  let value = selector.value;
  let flag = true;
  if(isNaN(value)) flag = false;
  else{
    value = +value;
    if(!checkRuleRange(value, rule)) flag = false;
  }
  return flag;
}

const validInteger = (selector, rule) => {
  let value   = $(selector).val().trim();
  value       = parseInt(value, 10);
  let flag    = true;
  if(isNaN(value)) flag = false;
  else{
    if(!checkRuleRange(value, rule)) flag = false;
  }
  return flag;
}

const validEmail = (selector, rule) => {
  let value = $(selector).val().trim();
  let flag = true;
    let regex = /^[A-Za-z\d]+[A-Za-z\d_\-.]*[A-Za-z\d]+@([A-Za-z\d]+[A-Za-z\d-]*[A-Za-z\d]+.){1,2}[A-Za-z]{2,}$/g;
  
  if (regex.test(value)){
    if(!checkRuleRange(value, rule)) flag =  false;
  }else flag = false;

  return flag;
}

const validFile = (selector, r) => {
  return true
}

const validIP = (selector, r) => {
  return true
}

const validDomain = (selector, r) => {
  return true
}

const validBase = (selector, rule) => {
  let value = $(selector).val().trim();
  rule = new RegExp(rule[1]);
  if (!rule.test(value)) return false;
  return true
}

const validPhone = (selector, r) => {
  let value = $(selector).val().trim();
  let rule = /^\d{7,15}$/
  if (!rule.test(value)) return false;
  return true;
}

const checkRuleRange = (value, rule) => {
  let flag = true;
  if (undefined !== rule[1]){
    let min = +rule[1];
    if (value < min) flag = false;
  }
  if (undefined !== rule[2]){
    let max = +rule[2];
    if (value > max) flag = false;
  }

  return flag;
}