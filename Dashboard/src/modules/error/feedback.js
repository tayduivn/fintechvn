"use strict";

var _ftCfg = {

    URLServer : 'http://example.com/handler.php',

    MilisecondsShowMessage : 2000,

    AJAXSuccess : function(msg){
        _ftSetMessage(msg, 'success');
    },

    AJAXError : function(msg){
        _ftSetMessage(msg);
    },

    BeforeAJAX : function(form){
        form.append('location', window.location.host);
    },

    EnableUseLocalStorage : true,

    LocalItemName : 'FTFB_Feedback_FormData',

    FeedbackDefaultShow : false,

    FeedbackBoxWidth : '300px',//

    FeedbackBoxHeight : '450px',//

    FeedbackBoxLayer : 999999,//

    FeedbackPositionX : 'right',//

    FeedbackPositionY : 'bottom',//

    FeedbackBackgroundColor : '#fff',//

    FeedbackBorderColor : '#5ca2e0',//

    FeedbackHeadBackgroundColor : '#5ca2e0',//

    FeedbackHeadTextColor : '#fff',//

    FeedbackHeadHeight : '30px',//

    FeedbackHeadTextSize : '16px',//

    FeedbackIconSize : '16px',//

    FeedbackFormHeight : '385px',//

    FeedbackShowScrollBarY : true, //

    FeedbackShowScroolBarX : false, //

    FeedbackDistanceRows : '15px', //

    FeedbackTextboxBorderColor : '#5ca2e0',//

    FeedbackTextboxBackgroundColor : '#fff',//

    FeedbackButtonBackgroundColor : '#5ca2e0',//

    FeedbackButtonTextColor : '#fff',

    FeedbackMessagePosition : 'bottom',

    FeedbackMessageErrorColor : '#b25747',

    FeedbackMessageErrorAlphaColor : 'background:rgba(178, 87, 71, 0.2)',

    FeedbackMessageSuccessColor : '#63b75b',

    FeedbackMessageSuccessAlphaColor : 'rgba(99, 183, 91, 0.2)',

};

var _ftFormCtrl = [
    { name : 'Function', tags : [ { tag : 'textbox', attr : { type : 'text', name : 'function', placeholder : 'Enter function...' } } ] },
    { name : 'Link', tags : [ { tag : 'textbox', attr : { type : 'text', name : 'link', placeholder : 'Enter link...' } } ] },
    { name : 'Description', tags : [ { tag : 'textarea', attr : { name : 'description', rows : 7, placeholder: 'Enter description detail...' } } ] },
    { name : 'Attachment', tags : [ { tag : 'textbox', attr : { type : 'file', name : 'attachment', multiple : true } } ] },
    { tags : [ 
        { tag : 'button', value : 'Feedback', attr : { type : 'submit' } }, 
        { tag : 'button', value : 'Clear', attr : { type : 'button' }, events : { click : '_clearButton' } } 
    ] }
];

var fnCf = {

    c : _ftCfg,

    fbPosX : function(){
        return this.c.FeedbackPositionX === 'left' ? 'left' : 'right';
    },

    fbPosY : function(){
        return this.c.FeedbackPositionY === 'top' ? 'top' : 'bottom';
    },

    fbWidth : function(){
        return /^[1-9](%|px|(0(0?%|\dpx)|[1-9](%|\dpx)))$/g.test(this.c.FeedbackBoxWidth) ? this.c.FeedbackBoxWidth : '300px';
    },

    fbHeight : function(){
        return /^[1-9](%|px|(0(0?%|\dpx)|[1-9](%|\dpx)))$/g.test(this.c.FeedbackBoxHeight) ? this.c.FeedbackBoxHeight : '450px';
    },

    fbLayer : function(){
        return /^\d{1,6}$/g.test(this.c.FeedbackBoxLayer) ? this.c.FeedbackBoxLayer : 999999;
    },

    fbBdrCor : function(){
        return /^#([\da-f]{3}){1,2}$/gi.test(this.c.FeedbackBorderColor) ? this.c.FeedbackBorderColor : '#5ca2e0';
    },

    fbBgCor : function(){
        return /^\#([\da-f]{3}){1,2}$/gi.test(this.c.FeedbackBackgroundColor) ? this.c.FeedbackBackgroundColor : '#fff';
    },

    fbHBgCor : function(){
        return /^\#([\da-f]{3}){1,2}$/gi.test(this.c.FeedbackHeadBackgroundColor) ? this.c.FeedbackHeadBackgroundColor : '#5ca2e0';
    },

    fbHHeight : function(){
        return /^[1-9]\dpx$/g.test(this.c.FeedbackHeadHeight) ? this.c.FeedbackHeadHeight : '30px';
    },

    fbHTxtCor : function(){
        return /^\#([\da-f]{3}){1,2}$/gi.test(this.c.FeedbackHeadTextColor) ? this.c.FeedbackHeadTextColor : '#fff';
    },

    fbHTxtSz : function(){
        return /^[12]\dpx$/g.test(this.c.FeedbackHeadTextSize) ? this.c.FeedbackHeadTextSize : '16px';
    },

    fbHIcoSz : function(){
        return /^(1\d|20)px$/g.test(this.c.FeedbackIconSize) ? this.c.FeedbackIconSize : '16px';
    },

    fbFmHeight : function(){
        return /^[1-9](%|px|(0(0?%|\dpx)|[1-9](%|\dpx)))$/g.test(this.c.FeedbackFormHeight) ? this.c.FeedbackFormHeight : '385px';
    },

    fbScrollX : function(){
        return true === this.c.FeedbackShowScroolBarX ? ';overflow-x:auto' : '';
    },

    fbScrollY : function(){
        return true === this.c.FeedbackShowScroolBarY ? ';overflow-y:auto' : '';
    },

    fbDstRw : function(){
        return /^([12]\d|30)px$/g.test(this.c.FeedbackDistanceRows) ? this.c.FeedbackDistanceRows : '15px';
    },

    fbTbBdrCor : function(){
        return /^\#([\da-f]{3}){1,2}$/gi.test(this.c.FeedbackTextboxBorderColor) ? this.c.FeedbackTextboxBorderColor : '#5ca2e0';
    },

    fbTbBgCor : function(){
        return /^\#([\da-f]{3}){1,2}$/gi.test(this.c.FeedbackTextboxBackgroundColor) ? this.c.FeedbackTextboxBackgroundColor : '#fff';
    },

    fbBtnBgCor : function(){
        return /^\#([\da-f]{3}){1,2}$/gi.test(this.c.FeedbackButtonBackgroundColor) ? this.c.FeedbackButtonBackgroundColor : '#5ca2e0';
    },

    fbBtnBdrCor : function(){
        return /^\#([\da-f]{3}){1,2}$/gi.test(this.c.FeedbackButtonBackgroundColor) ? this.c.FeedbackButtonBackgroundColor : '#5ca2e0';
    },

    fbBtnTxtCor: function(){
        return /^\#([\da-f]{3}){1,2}$/gi.test(this.c.FeedbackButtonTextColor) ? this.c.FeedbackButtonTextColor : '#fff';
    },

    enStorage : function(){
        return !!this.c.EnableUseLocalStorage;
    },

    lcItem : function(){
        return (!!this.c.LocalItemName && String === this.c.LocalItemName.constructor) ? this.c.LocalItemName : 'FTFB_Feedback_FormData';
    },

    path : function(){
        return this.c.URLServer;
    },

    closeMsg : function(){
        return /^[1-9]\d{3}$/g.test(this.c.MilisecondsShowMessage) ? this.c.MilisecondsShowMessage : 2000;
    },

    fbMsgPos : function(){
        return 'top' === this.c.FeedbackMessagePosition ? 'top' : 'bottom';
    },



};

var _ftfbCSS = function(){

    let b = fnCf.fbPosX() + ':0;' + fnCf.fbPosY() + ':0' + ';z-index:' + fnCf.fbLayer();
    b += ';width:' + fnCf.fbWidth() + ';height:' + fnCf.fbHeight();
    b += ';border:1px solid ' + fnCf.fbBdrCor() + ';background:' + fnCf.fbBgCor();

    let h = ';background:' + fnCf.fbHBgCor() + ';height:' + fnCf.fbHHeight();

    let a = ';color:' + fnCf.fbHTxtCor() + ';font-size:' + fnCf.fbHTxtSz();

    let s = fnCf.fbHIcoSz(), i = ';width:' + s + ';height:' + s;

    s = fnCf.fbFmHeight();
    let o = ';min-height:' + s + ';max-height:' + s + fnCf.fbScrollX() + fnCf.fbScrollY();

    let p = ';border:1px solid ' + fnCf.fbTbBdrCor() + ';background:' + fnCf.fbTbBgCor();

    s = fnCf.fbBtnBgCor();
    let t = ';background:' + s + ';border:1px solid ' + s + ';color:' + fnCf.fbBtnTxtCor();

    let m = fnCf.fbMsgPos() + ':0;';

    return {
        
        box : "position:fixed;border-top-left-radius:4px;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;box-sizing:border-box;transition:all ease 0.3s;" + b,
        
        head : "position:relative;cursor:pointer" + h,
        
        headH2 : "line-height:30px;padding:0 30px;margin:0;" + a,
        
        headIcons : "position:absolute;top:0;left:5px;height:30px;width:30px;",
        
        headSpanIcon : "margin-top:4px;border:1px solid #fff;border-radius:50%;display:inline-block;position:relative" + i,
        
        headIconI : "display:inline-block;width:5px;height:5px;border-right:1px solid #fff;border-bottom:1px solid #fff;top:5px;left:4px;position:absolute;transition:all ease 0.3s",
        
        body : "padding:15px" + o,
        
        bodyUl : "list-style:none;margin:0;padding:0;",
        
        bodyLiOdd : "margin-bottom:" + fnCf.fbDstRw(),
        
        bodyControl : "width:100%;padding:3px 8px;border-radius:4px;outline:0;box-sizing:border-box" + p,
        
        bodyButton : "font-weight:bold;padding:5px 15px;margin-right:5px;cursor:pointer;border-radius:4px;outline:0" + t,
        
        message : "position:absolute;right:-350px;border:2px solid #b25747;background:rgba(178, 87, 71, 0.2);padding:10px;font-size:12px;font-weight:bold;color:#b25747;width:100%;box-sizing:border-box;transition:all ease 0.3s;"
    };
}

var d = document;
var css = _ftfbCSS.apply();
var _ftLcItem = fnCf.lcItem();

var _ftEl = { headClick : false, buttons : {}, controls : {} };

var _ftAJAXToServer = function(data, cb){
    let xhttp = new XMLHttpRequest();
    xhttp.open('post', fnCf.path(), true);
    xhttp.onload = function(){
        cb(xhttp);
    }
    xhttp.send(data);
};

var _ftSetMessage = function(msg, type){
    var elMsg = _ftEl.message;
    elMsg.innerHTML = msg.toString();

    if ('success' === type){
        elMsg.style.color = '#63b75b';
        elMsg.style.background = 'rgba(99, 183, 91, 0.2)';
        elMsg.style.border = '2px solid #63b75b';
    }
    else{
        elMsg.style.color = '#b25747';
        elMsg.style.background = 'rgba(178, 87, 71, 0.2)';
        elMsg.style.border = '2px solid #b25747';
    }

    elMsg.style.right = 0;
    setTimeout(function(){
        elMsg.style.right = '-350px';
    }, fnCf.closeMsg());
};

var _ftCtrl = {

    _clearButton : function(){
        _ftEl.form.reset();
        if (fnCf.enStorage()) _ftfbClearLocal();
    },

    _formSubmit : function(event){
        event.preventDefault();console.log('aaa');
        if ('submit' in _ftEl.buttons){console.log('bbb');
        console.log(_ftEl.buttons.submit.disabled)
            _ftEl.buttons.submit.disabled = true;
            console.log(_ftEl.buttons.submit.disabled)
            let hasData = false, formData = new FormData();

            for (let name in _ftEl.controls){
                let type = _ftEl.controls[name].getAttribute('type');

                if ('file' === type){
                    let files = _ftEl.controls[name].files;
                    if (files.length){
                        for (let i = 0; i < files.length; ++i){
                            formData.append(name + '[]', files[i], files[i].name);
                        }
                    }
                    continue;
                }

                let value = _ftEl.controls[name].value.trim();
                hasData = hasData || value.length;
                formData.append(name, value);
            }

            if (hasData){
                try{
                    _ftCfg.BeforeAJAX(formData);
                    _ftAJAXToServer(formData, function(xhttp){
                        if (xhttp.readyState === 4){
                            _ftCfg.AJAXSuccess(xhttp.responseText)
                            if (fnCf.enStorage()) _ftfbClearLocal();
                        }
                        else{
                            _ftCfg.AJAXError(xhttp.responseText);
                        }
                        _ftEl.buttons.submit.disabled = false;
                    });
                }catch(e){
                    _ftCfg.AJAXError('UNKNOWN: ' + e.message);
                    _ftEl.buttons.submit.disabled = false;
                }
            }
            else{
                _ftSetMessage('Please enter data');
                _ftEl.buttons.submit.disabled = false;
            }
        }
    }
    
};

var _ftHandlerEvent = function(DOMElement, eventName, handlerFunction){
    if (!!DOMElement){
        if ('addEventListener' in DOMElement) DOMElement.addEventListener(eventName, handlerFunction);
        else if ('attachEvent' in DOMElement) DOMElement.attachEvent('on' + eventName, handlerFunction);
        else DOMElement['on' + eventName] = handlerFunction;
    }
};

var _ftDiv = function(id, cls){
    let div = d.createElement('div');
    if (!!id && String === id.constructor) div.setAttribute('id', id);
    if (!!cls && String === cls.constructor) div.setAttribute('class', cls);
    return div;
};

var _ftfbBox = function(){
    var ftfbBox = _ftDiv('ftfb2018');
    
    ftfbBox.setAttribute('style', css.box);
    _ftEl.box = ftfbBox;

    return ftfbBox;
};

var _ftClkIco = function(event){
    let i = _ftEl.i, c = i.classList.contains('mini');
    i.setAttribute('class', c ? 'maxi' : 'mini');
    i.style.left = c ? '6px' : '4px';
    i.style.transform = c ? 'rotate(135deg)' : 'rotate(-45deg)';
};

var _ftClkHead = function(event){
    event.preventDefault();
    let c = _ftEl.headClick;
    _ftEl.box.style.bottom = c ? 0 : '-420px';
    _ftEl.box.style.right = c ? 0 : '-170px';
    _ftEl.headClick = !c;
    _ftClkIco.apply();
};

var _ftfbHead = function(){
    var ftfbHead = _ftDiv('ftfb-head');
    ftfbHead.setAttribute('style', css.head)
    
    var h2 = d.createElement('h2');
    h2.setAttribute('style', css.headH2);
    h2.innerText = 'Feedback';

    var icons = _ftDiv('ftfb-icons');
    icons.setAttribute('style', css.headIcons);

    var icon = d.createElement('span');
    icon.setAttribute('class', 'ftfb-icon');
    icon.setAttribute('style', css.headSpanIcon);

    var mima = d.createElement('i');
    mima.setAttribute('style', css.headIconI);

    _ftEl.i = mima;
    _ftClkIco.apply();

    icon.appendChild(mima);
    icons.appendChild(icon);

    ftfbHead.appendChild(h2);
    ftfbHead.appendChild(icons);

    _ftHandlerEvent(ftfbHead, 'click', _ftClkHead);

    _ftEl.head = ftfbHead;

    return ftfbHead;
};

var _ftList = () => {
    let ul = d.createElement('ul');
    ul.setAttribute('style', css.bodyUl);
    return ul;
};
var _ftItem = (c, s) => {
    let li = d.createElement('li');
    if (!!s && String === s.constructor) li.setAttribute('style', s);
    if (!!c) li.appendChild(c);
    return li;
};

var _ftOption = function(info){
    let el = d.createElement('option');
    el.setAttribute('value', info.value);
    el.innerText = info.text;
    return el;
};

function _ftfbAddListener(el, events){
    for (let name in events) {
        if (events[name] in _ftCtrl) _ftHandlerEvent(el, name, _ftCtrl[events[name]]);
    }
}

function _ftfbClearLocal(){
    localStorage.removeItem(_ftLcItem);
}

function _ftfbSetLocal(){
    let data = {};
    let controls = _ftEl.controls;

    for (let name in controls){
        let type = controls[name].getAttribute('type');
        if ('file' !== type){
            data[name] = controls[name].value;
        }
    }

    localStorage.setItem(_ftLcItem, JSON.stringify(data));
}

function _ftfbRestoreLocal(){
    let data = localStorage.getItem(_ftLcItem);
    if (!!data) data = JSON.parse(data);
    
    for (let name in data){
        if (name in _ftEl.controls){
            _ftEl.controls[name].value = data[name];
        }
    }
}

_ftCtrl.textbox = function(tag){
    let el = d.createElement('input');
    
    for (let a in tag.attr) el.setAttribute(a, tag.attr[a]);
    el.setAttribute('style', css.bodyControl);
    
    let nameElement = tag.attr.name || tag.attr.id || null;
    if (!!nameElement) _ftEl.controls[nameElement] = el;
    
    return el;
};

_ftCtrl.select = function(tag){
    let el = d.createElement('select');
    
    for (let a in tag.attr) el.setAttribute(a, tag.attr[a]);
    for (let opt of tag.opts)el.appendChild(_ftOption(opt));
    
    el.setAttribute('style', css.bodyControl);
    
    let nameElement = tag.attr.name || tag.attr.id || null;
    if (!!nameElement) _ftEl.controls[nameElement] = el;
    
    return el;
};

_ftCtrl.textarea = function(tag){
    let el = d.createElement('textarea');
    
    for (let a in tag.attr) el.setAttribute(a, tag.attr[a]);
    if (!!tag.content) el.innerHTML = tag.content.toString();
    
    el.setAttribute('style', css.bodyControl);
    el.style.resize = 'vertical';
    
    let nameElement = tag.attr.name || tag.attr.id || null;
    if (!!nameElement) _ftEl.controls[nameElement] = el;
    
    return el;
}

_ftCtrl.button = function(tag){
    let el = d.createElement('button');
    
    for (let a in tag.attr) el.setAttribute(a, tag.attr[a]);
    if (!!tag.value) el.innerHTML = tag.value;
    
    el.setAttribute('style', css.bodyButton);
    if (tag.events) _ftfbAddListener(el, tag.events);
    
    let typeElement = tag.attr.type || null;
    if (!!typeElement) _ftEl.buttons[typeElement] = el;
    
    return el;
}

var _ftLabel = function(name){
    let el = d.createElement('label');
    el.innerHTML = name;
    return el;
};

var _ftRow = function(info, list){
    if (!!info.name){
        let elLabel = _ftLabel(info.name);
        let elLiLabel = _ftItem(elLabel);
        list.appendChild(elLiLabel);
    }

    let elLiControl = null;

    for (let tag of info.tags){
        if (tag.tag in _ftCtrl){
            let elControl = _ftCtrl[tag.tag](tag);
            if (elLiControl) elLiControl.appendChild(elControl);
            else elLiControl = _ftItem(elControl, css.bodyLiOdd);
        }
    }

    if (elLiControl) list.appendChild(elLiControl);
};

var _ftForm = function(){
    var form = d.createElement('form');

    form.setAttribute('id', "ftfb-form");
    form.setAttribute('method', "post");
    
    var ftfbList = _ftList.apply();
    form.appendChild(ftfbList);

    for (let pos in _ftFormCtrl) _ftRow(_ftFormCtrl[pos], ftfbList);
    if (fnCf.enStorage()){
        let controls = _ftEl.controls;
        _ftfbRestoreLocal();
        for (let name in controls) _ftHandlerEvent(controls[name], 'keyup', _ftfbSetLocal);
    }

    if ('_formSubmit' in _ftCtrl) _ftHandlerEvent(form, 'submit', _ftCtrl._formSubmit);
    _ftEl.form = form;

    return form;
};

var _ftfbBody = function(){
    var ftfbMain = _ftDiv('ftfb-body');
    ftfbMain.setAttribute('style', css.body);

    var ftfbForm = _ftForm.apply();
    ftfbMain.appendChild(ftfbForm);

    _ftEl.body = ftfbMain;

    return ftfbMain;
};

var _ftfbMessage = function(){
    var ftfbMsg = _ftDiv('ftfb-message');
    ftfbMsg.setAttribute('style', css.message);
    _ftEl.message = ftfbMsg;
    return ftfbMsg;
}

var _ftfbLoaded = function(){ console.log('vào')
    // Variable body element;
    var ftfbBody = d.getElementsByTagName('body')[0];

    // Variable FTFB Box
    var ftfbBox = _ftfbBox.apply();

    // Variable FTFB Head
    var ftfbHead = _ftfbHead.apply();//initFTFBHead.apply();

    // Variable FTFB Body
    var ftfbMain = _ftfbBody.apply();  //initFTFBBody.apply();

    // Variable FTFB Message
    var ftfbMsg = _ftfbMessage.apply();//  initMessage.apply();

    // Append head and body and message inside box FTFB
    ftfbBox.appendChild(ftfbHead);
    ftfbBox.appendChild(ftfbMain);
    ftfbBox.appendChild(ftfbMsg);

    // Append box FTFB inside body element
    ftfbBody.appendChild(ftfbBox);
};

// (_ftfbLoaded)();

_ftHandlerEvent(window, 'DOMContentLoaded', _ftfbLoaded);
// console.log(window, '-==============================')