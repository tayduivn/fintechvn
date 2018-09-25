export const validateForm = (selector, rules) => {

  if(undefined === rules || rules.length === 0){
    let flag = true;
    let inputs = selector.getElementsByClassName('form-control');
    for(let id in inputs){
      if(!validate(inputs[id])) flag = false;
    }
    return flag;
  }
  else{
    let flag = true;

    let i = 0;
    rules.forEach((item) => {
      let inputs = document.getElementById(item.id);
      if(!validate(inputs, item.rule)) flag = false;
      ++i;
    });

    if(i === rules.length) return flag;
    return false;
  }
  
}

export const validate = (selector, rule) => {
  if (typeof selector !== 'object') return true;

  if(selector == null) return false;
  
  let rules = selector.getAttribute('form-valid');
  if(rule) rules = rule;

  if(null === rules || undefined === rules) return true;
  selector.setAttribute('class', 'form-control');
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
  let value = selector.value.trim();
  if(!checkRuleRange(value.length, rule)){
    selector.setAttribute('class', 'form-control error');
    return false;
  }
  return true;
}

const validNumber = (selector, rule) => {
  let value = selector.value;
  let flag = true;
  if(isNaN(value)){
    selector.setAttribute('class', 'form-control error');
    flag = false;
  }
  else{
    value = +value;
    if(!checkRuleRange(value, rule)){
      selector.setAttribute('class', 'form-control error');
      flag = false;
    }
  }
  return flag;
}

const validInteger = (selector, rule) => {
  let value = parseInt(selector.value, 10);
  let flag = true;
  if(isNaN(value)){
    selector.setAttribute('class', 'form-control error');
    flag = false;
  }
  else{
    if(!checkRuleRange(value, rule)){
      selector.setAttribute('class', 'form-control error');
      flag = false;
    }
  }
  return flag;
}

const validEmail = (selector, rule) => {
  let value = selector.value;
  let flag = true;
    let regex = /^[A-Za-z\d]+[A-Za-z\d_\-.]*[A-Za-z\d]+@([A-Za-z\d]+[A-Za-z\d-]*[A-Za-z\d]+.){1,2}[A-Za-z]{2,}$/g;
  
  if (regex.test(value)){
    if(!checkRuleRange(value, rule)){
      selector.setAttribute('class', 'form-control error');
      flag =  false;
    }
  }else{
    selector.setAttribute('class', 'form-control error');
    flag = false;
  }

  return flag;
        
}

const validFile = (selector, rule) => {
  selector.setAttribute('class', 'form-control error');
  return false;
}

const validIP = (selector, rule) => {
  selector.setAttribute('class', 'form-control error');
  return false;
}

const validDomain = (selector, rule) => {
  selector.setAttribute('class', 'form-control error');
  return false;
}

const validBase = (selector, rule) => {
  let value = selector.value;
  rule = new RegExp(rule[1]);
  if (!rule.test(value)){
    selector.setAttribute('class', 'form-control error');
    return false;
  }
  return true;
}

const validPhone = (selector) => {
  let value = selector.value;
  let rule = /^\d{7,15}$/
  if (!rule.test(value)){
    selector.setAttribute('class', 'form-control error');
    return false;
  }
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