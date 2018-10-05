var Validate = {
	// Array element error
	error : [],

	// Check is number
	isNum : function(value){
		if (undefined === value) return false;
		return /^\-?\d+(\.\d+)?$/g.test(value.toString());
	},

	// Check is integer
	isInt : function(value){
		if(!this.isNum(value)) return false;
		return /^\-?\d+$/g.test(value.toString());
	},

	// Get value of element validate
	getValue : function(element){
		let value = null;

		if ('INPUT' === element.nodeName){ 
			let type = $(element).attr('type');
			switch(type){
				case 'file':
					if (element.files.length) value = element.files;
					break;
				case 'checkbox':
				case 'radio':
					if ($(element).is(':checked')) value = $(element).val()
					break;
				default:
					value = $(element).val();
			}
		}else if ('string' == $.type($(element).attr('form-editor'))){
			if ('string' == $.type($(element).attr('form-name'))){
				let editorName = $(element).attr('form-editor'),
					name = $(element).attr('form-name');
				switch(editorName){
					case 'ckeditor':
						value = CKEDITOR.instances[name].getData();
						break;
					case 'tinymce':
						value = tinyMCE.get(name).getContent();
						break;
					case 'ace':
						value = editor.getValue();
						break;
				}
			}
			
		}else if (
			'string' == $.type($(element).attr('form-div')) && 
			+$(element).attr('form-div') === 1
		) value = $(element).html();
		else value = $(element).val();
		return value;
	},

	checkRuleRange : function(value, rule, element, name){
		if (undefined !== rule[1]){
			let min = +rule[1];
			if (value < min) this.error.push([element, name + '_MIN']);
		}
		if (undefined !== rule[2]){
			let max = +rule[2];
			if (value > max) this.error.push([element, name + '_MAX']);
		}
	},

	// Validate type string
	validString : function(value, rule, element){
		//let value = this.getValue(element);
		this.checkRuleRange(value.length, rule, element, 'INVALID_STRING');
	},

	// Validate type number
	validNumber : function(value, rule, element){
		//let value = this.getValue(element);
		if (this.isNum(value)){
			value = +value;
			this.checkRuleRange(value, rule, element, 'INVALID_NUMBER');
		}else this.error.push([element, 'INVALID_NOT_NUMBER']);
	},

	// Validate type integer
	validInteger : function(value, rule, element){
		//let value = this.getValue(element);
		if (this.isInt(value)){
			value = parseInt(value);
			this.checkRuleRange(value, rule, element, 'INVALID_INTEGER');
		}else this.error.push([element, 'INVALID_NOT_INTEGER']);
	},

	// Validate type email
	validEmail : function(value, rule, element){
		//let value = this.getValue(element),
		let regex = /^[A-Za-z\d]+[A-Za-z\d_\-\.]*[A-Za-z\d]+@([A-Za-z\d]+[A-Za-z\d\-]*[A-Za-z\d]+\.){1,2}[A-Za-z]{2,}$/g;
		if (regex.test(value)) this.checkRuleRange(value, rule, element, 'INVALID_EMAIL');
		else this.error.push([element, 'INVALID_NOT_EMAIL']);
	},

	// Validate type file
	validSingleFile : function(file, rule, element){
		if (undefined !== rule[3] && rule[3] != ''){
			let arrExt = rule[3].toLowerCase().split(','),
				arrName = file.name.split('.'),
				length = arrName.length;
			if ($.inArray(arrName[length - 1].toLowerCase(), arrExt) < 0){
				this.error.push([element, 'INVALID_DENY_FILE']);
				return false;
			}
		}
		let minSize = (undefined !== rule[4]) ? rule[4] : null,
			maxSize = (undefined !== rule[5]) ? rule[5] : null;
		this.checkRuleRange(file.size, ['', minSize, maxSize], element, 'INVALID_FILESIZE');
		return true;
	},

	// Validate type files
	validFile : function(value, rule, element){
		//let value = this.getValue(element),
		let isFiles = (undefined !== value && null !== value && FileList === value.constructor),
			length = isFiles ? value.length : 0;
		this.checkRuleRange(length, rule, element, 'INVALID_FILE');
		if (isFiles){
			let limit = length;
			if (undefined !== rule[1] && this.isInt(rule[1])) limit = parseInt(rule[1]);
			if (undefined !== rule[2] && this.isInt(rule[2])) limit = parseInt(rule[2]);
			if (limit > length) limit = length;
			for (let i = 0; i < limit; i++){
				let isAllow = this.validSingleFile(value[i], rule, element);
				if (!isAllow) break;
			}
		}else if (undefined !== rule[1]) this.checkRuleRange(0, rule, element, 'INVALID_FILES');
	},

	// Validate type IP
	validIP : function(value, rule, element){
		let flag = true,
			//value = this.getValue(element),
			regex = /^((1\d{0,2})|(2(([0-4]\d?)|(5[0-5]?)|([6-9]))?)|([3-9]\d?))(\.((1\d{0,2})|(2(([0-4]\d?)|(5[0-5]?)|([6-9]))?)|([3-9]\d?))){3}$/g;
		if ('' === value){
			if (undefined === rule[1] || 0 !== parseInt(rule[1])) flag = false;
		}else if (!regex.test(value)) flag = false;
		if (!flag) this.error.push([element, 'INVALID_IP_ADDRESS']);
	},

	// Validate type domain
	validDomain : function(value, rule, element){
		// let value = this.getValue(element),
		let regex = /^(https?:\/\/)?(www\.)?([A-Za-z\d]+[A-Za-z\d\-]*[A-Za-z\d]+\.){1,2}[A-Za-z]{2,}\/?$/g;
		if (regex.test(value)) this.checkRuleRange(value.length, rule, element, 'INVALID_DOMAIN');
		else this.error.push([element, 'INVALID_NOT_DOMAIN']);
	},

	splitType : function(value, rule, element){
		switch(rule[0]){
			case 'str':
				Validate.validString(value, rule, element);
				break;
			case 'num':
				Validate.validNumber(value, rule, element);
				break;
			case 'int':
				Validate.validInteger(value, rule, element);
				break;
			case 'email':
				Validate.validEmail(value, rule, element);
				break;
			case 'file':
				Validate.validFile(value, rule, element);
				break;
			case 'ip':
				Validate.validIP(value, rule, element);
				break;
			case 'domain':
				Validate.validDomain(value, rule, element);
				break;
		}
	},

	// Main method validate form
	action : function(selector, options){
		// Reset options
		//if ('object' === $.type(options)) this.bindOptions(options);
		//else if (this.options === null) this.initOptions();

		let init = {
			doAjax : true,
			attribute : 'form-valid',
			submit : false,
			beforeValid : function(){},
			validError : function(){},
			handlingForm : function(){},
			beforeSend : function(){},
			ajaxSuccess : function(){},
			ajaxError : function(){},
			afterSend	: function(){}
		};
		if ('object' === $.type(options)){
			if ('function' === $.type(options.validError)) init.validError = options.validError;
			if ('boolean' === $.type(options.doAjax)) init.doAjax = options.doAjax;
			if ('function' === $.type(options.handlingForm)) init.handlingForm = options.handlingForm;
			if ('function' === $.type(options.beforeSend)) init.beforeSend = options.beforeSend;
			if ('function' === $.type(options.ajaxError)) init.ajaxError = options.ajaxError;
			if ('function' === $.type(options.ajaxSuccess)) init.ajaxSuccess = options.ajaxSuccess;
			if ('string' === $.type(options.attribute)) init.attribute = options.attribute;
			if ('function' === $.type(options.beforeValid)) init.beforeValid = options.beforeValid;
			if ('function' === $.type(options.afterSend)) init.afterSend = options.afterSend;
		}

		// Reset element and error
		//if (!this.element) this.element = $(selector);
		this.error = [];

		// Blur element and call before validate function
		document.activeElement.blur();
		init.beforeValid(selector, init.attribute);

		// Each element has rule of Validate
		$(selector).find('[' + init.attribute + ']').each(function(){
			let rule = $(this).attr(init.attribute).split(':'),
				value = Validate.getValue(this);
			Validate.splitType(value, rule, this);
		});

		if (!this.error.length){
			if (init.doAjax){
				let action = $(selector).attr('action') || '/',
					method = $(selector).attr('method') || 'get',
					form = new FormData();
				$(selector).find('[name]').each(function(){
					if (!$(this).prop('disabled')){
						let name = $(this).attr('name'),
							value = Validate.getValue(this);
						if (undefined !== value && null !== value){
							if (FileList === value.constructor){
								let length = value.length;
								for(let i = 0; i < length; i++) form.append(name + '[]', value[i]);
							}else form.append(name, value);
						}
					}
				});
				init.beforeSend(selector, form);
				
				///////////////////////////////////////////////////////////////
				var typeOptions = undefined;
				if ('typeAction' in options) typeOptions = options.typeAction;
				///////////////////////////////////////////////////////////////
				
				$.ajax({
					url : action,
					data : form,
					method : method,
					contentType: false,
					processData: false,
					success : function(response, status, xhr){
						init.afterSend(selector, form);
						init.ajaxSuccess(selector, response, typeOptions, xhr);
						
					},
					error : function(xhr, status, statusText){
						init.afterSend(selector, form);
						init.ajaxError(selector, typeOptions, xhr, statusText);
					}
				});
			}else init.handlingForm(selector);
		}else init.validError(selector, this.error);
		this.error = [];
	},

	// Bind submit for form
	submit : function(selector, options){
		//this.bindOptions(options);
		$(document).on('submit', selector, function(){
			//Validate.element = this;
			Validate.action(this, options);
			return ('object' === $.type(options) && !!options.submit);
		});
	}
};