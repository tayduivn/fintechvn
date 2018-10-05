function beforeValid(selector, attr){
	//$(selector).find('[' + attr + ']').removeClass('invalid');
	$(selector).find('[' + attr + ']').each(function(){
		//$(this).parent().addClass('has-error').find('.help-block').removeClass('hidden');
		$(this).parent().removeClass('has-error').find('.help-block').addClass('hidden');
	});
}
function validError(selector, error){
	error.forEach(function(element){
		$(element).parent().addClass('has-error').find('.help-block').removeClass('hidden');
		//$(element).addClass('invalid')
	});
	// Alert.popup({
	// 	title : 'Validate Error',
	// 	classes : 'error',
	// 	message : 'Please check again data.',
	// 	btn : [{label : 'OK', color : 'red', isFocus : true, fn : Alert.close}]
	// });
	$(error[0]).focus();
}
function beforeSend(){
	Alert.popup({
		classes : 'confirm',
		message : $('#LoadingTemplate').html()
	});
}
function ajaxError(selector, type, xhr, status){console.log(xhr.responseText);
	Alert.close();
	Alert.popup({
		title : 'Error',
		classes : 'error',
		message : 'Cannot connect server.',
		btn : [{label : 'OK', color : 'red', isFocus : true, fn : Alert.close}]
	});
}
function ajaxSuccess(selector, response, type, xhr){console.log(response);
	var result = response;
	Alert.close();
	try{
		if ('object' !== $.type(result) && 'array' !== $.type(result)) result = JSON.parse(response);
		if ('success' === result.status){
			var oa = {title : 'Process Success', classes : 'success', message : result.message};
			if ('afterAjaxSuccessCallback' in window){
				if (Function === afterAjaxSuccessCallback.constructor){
					afterAjaxSuccessCallback(selector, response);
				}
			}
			if (1 === result.click){
				var btn = function(){
					if (undefined !== result.url) window.location.href = result.url;
					else Alert.close();
				};
				oa.btn = [{label : 'OK', color : 'green', isFocus : true, fn : btn}];
				Alert.popup(oa);
			}else{
				Alert.popup(oa);
				setTimeout(function(){
					if (undefined !== result.url) window.location.href = result.url;
					else window.location.reload(true);
				}, 2000);
			}
		}else{
			Alert.popup({
				title : 'Process Error',
				classes : 'error',
				message : result.message,
				btn : [{label : 'OK', color : 'red', isFocus : true, fn : Alert.close}]
			});
			if (undefined !== result.element){//console.log(result.element);
				result.element.forEach(function(name){
					$(selector).find('[name=' + name + ']').addClass('invalid');
				});
			}
		}
	}catch(e){
		Alert.popup({
			title : 'Error',
			classes : 'error',
			message : 'Response invalid.',
			btn : [{label : 'OK', color : 'red', isFocus : true, fn : Alert.close}]
		});
	}
	response = null;
}

function postAjaxData(url, data, success, error){
	$.ajax({
		url : url,
		data : data,
		method : 'post',
		contentType: false,
		processData: false,
		success : function(response, status, xhr){
			success(null, response, xhr);
		},
		error : function(xhr, status, statusText){
			error(null, xhr, statusText);
		}
	});
}

function generateToken(){
	let date = new Date();
	let token = date.getTime() + Math.random();
	return token.toString().replace('.', '');
}