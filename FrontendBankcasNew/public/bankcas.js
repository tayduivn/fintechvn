var optionsCar = [];
var filterForm = {};

filterForm.seatspayload = function(valueID, options){
  if(!!options && 'push' in options){
    options.filter(e => {
      if(e.value === null) return e;
      let defaultType = !!valueID && 'loaixe' in valueID ? valueID.loaixe : -1;
      if(e.type === defaultType ) return e;
    })
  }
  return [];
}

function actionFilter(name, valueID, data){
  if(name in filterForm) filterForm[name](valueID, data);
}

function onLoad(obj){
  let { component } = obj;
  let { props } = component;

  optionsCar = props.product.data.motor.steps.step1.controls[1][1].options;
  let newOption = optionsCar.filter(e => e.value == null);
  props.product.data.motor.steps.step1.controls[1][1].options = newOption;
};

function onLoadEidt(obj){
  let { component } = obj;
  let { props } = component;
  let obtions = props.product.data.motor.steps;

  for(let key in obtions){
    let { controls } = obtions[key];
    
    if(!!controls && !isEmpty(controls)){
      for(let step of controls){
        for(let val of step){
          let { id, events } = val;

          if(!!events && !isEmpty(events)){
            for(let k in events){
              let el = document.getElementById(id);
              isFnStatic(events[k], {...obj, el})
            }
          }
        }
      }
    }
  }
  
}

function _getYearCar(obj, cb){
  let {newObj, newCb} = changeParam(obj, cb)
  if(!!newObj){
    let { component, el } = newObj;
    let { state, props } = component;

    _ftNumber.listener(el, {struct: 'year'});

    let year = _ftNumber.parse(_ftNumber.value(el));
    let yearCurrent = new Date().getFullYear();
    
    let {listInfo} = state;
    listInfo._getYearCar = {};

    let rexYear = /^\d{4}$/

    if(rexYear.test(year) && year <= yearCurrent){
      let cYear = yearCurrent - year;
      let { years } = props;
      let id = undefined;

      for(let key in years.data){
        let { min, max } = years.data[key];
        if(cYear >= min && cYear < max){
          id = key;
          break;
        }
      }

      optionChange(component, {year_id: id});
      listInfo._getYearCar =  {name: "Số năm xe", text: cYear, value: id};
    }

    component.setState({...state, listInfo, sumPrice: 0})
  }

  !!newCb  && newCb(newObj, '_getYearCar');
}

function _getPriceCar(obj, cb){
  let {newObj, newCb} = changeParam(obj, cb);

  if(!!newObj){
    let { component, el } = newObj;
    let { state } = component;

    _ftNumber.listener(el, {maxLength: 12});

    let price = _ftNumber.parse(_ftNumber.value(el))

    let {listInfo} = state;
    listInfo._getPriceCar = {};

    if(price > 0 && price <= 999999999999){
      listInfo._getPriceCar = {name: "Giá trị xe", text: formatPrice(price, ' VNĐ') , value: price};
    }

    component.setState({...state, listInfo, sumPrice: 0})
  }
}

function _getCareType(obj, cb){
  let {newObj, newCb} = changeParam(obj, cb);
  
  if(!!newObj){
    let { component, el } = newObj;
    let { state, props } = component;
    let type = +el.value;
    let text = $(el).find('option:selected').text();
    

    let { listInfo } = state;
    listInfo._getCareType = {};
    optionChange(component, {type});

    if(+type === 0 || +type === 1){
      listInfo._getCareType = {name: "Loại xe", text , value: +type};
    }

    component.setState({...state, listInfo, sumPrice: 0})
  }
}

function _getSeatsPayload(obj, cb) {
  let {newObj, newCb} = changeParam(obj, cb);
  if(!!newObj){
    let { component, el } = newObj;
    let { state, props } = component;
    let value = el.value;

    let rexYear = /^\w{24}$/;

    let text = '';
    let ratio = 0;
    let name = $(el).find('option:selected').text();

    let { listInfo } = state;
    listInfo._getSeatsPayload = {};

    if(rexYear.test(value)){
      let options = props.product.data.motor.steps.step1.controls[1][1].options;
      options.forEach(e => {
        if(e.value === value) {
          text = `${e.ratio}%`;
          ratio = e.ratio;
          return;
        }
      })
      // console.log();
      // console.log($(el).find(`option[value=${value}]`).value())
      $(el).find(`option[value="${value}"]`).attr('aaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaa');

    //  console.log( $(el).find(`option[value="${value}"]`).attr("value", "1111111111111111"));
      listInfo._getSeatsPayload = {name, text , value: value, ratio};
    }

    component.setState({...state, listInfo, sumPrice: 0})
  }
}

function _getRuleExtends(obj, cb){
  let {newObj, newCb} = changeParam(obj, cb);
  if(!!newObj){
    let { component, el } = newObj;
    let { state, props } = component;
    let id = $(el).attr('id');
    options = props.product.data.motor.steps.step1.controls[2];

    option = options.filter(e => e.id === id)[0];
    let checked = $(el).is(':checked');

    let { listInfo } = state;
    listInfo._getRuleExtends = listInfo._getRuleExtends || {name: "Lựa chọn thêm", options: {}};

    if(!!option){
      if(checked) listInfo._getRuleExtends.options[id] = {name: option.name, ratio:  option.ratio, type: option.type};
      else delete listInfo._getRuleExtends.options[id];
    }
    
    component.setState({...state, listInfo, sumPrice: 0})
  }
}

function optionChange(component, where){
  let { state, props } = component;

  if(isEmpty(optionsCar)) optionsCar = props.product.data.motor.steps.step1.controls[1][1].options;

  let { _getCareType, _getYearCar } = state.listInfo;
  
  let year_id = !!_getYearCar && !isEmpty(_getYearCar) ? (_getYearCar.value) : where.year_id;
  let type    = !!_getCareType  && !isEmpty(_getCareType) ? (_getCareType.value) : (undefined !=  where.type && where.type != -1 ? where.type : null);
  type = isNaN(type) ? null : type;

  options = optionsCar.filter(e => {
    return (
      (year_id && e.year_id == year_id) &&
      (type == null || e.type == type) || e.value == null
    )
  });
  props.product.data.motor.steps.step1.controls[1][1].options = options
}

function changeParam(obj, cb){
  let newObj = null;
  let newCb = null;
  
  if(obj instanceof Function) {
    newCb = obj;
    if(cb instanceof Object) newObj = cb;
  }else if(cb instanceof Function){
    newCb = cb;
    if(obj instanceof Object) newObj = obj;
  }else if(obj instanceof Object){
    newObj = obj;
    if(cb instanceof Function) newCb = cb;
  }
  return {newObj, newCb};
}
