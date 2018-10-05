/**
 * 
 * jQuery
 * Validate
 * Toast            /css
 * sweetalert       /css
 */
function chane_slug(str) {
    var str = str;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/([^\w]+)|\s+/g,"-");
    str = str.replace(/[\-+]/g,"-");
    str = str.replace(/^\-+/g,"");
    str = str.replace(/\-+$/g,""); 
    return str;
}
    
function interface_popup_error_top_right(msg){
    $.toast({
        heading: 'Error',
        text: msg,
        position: 'top-right',
        loaderBg: '#ff6849',
        icon: 'error',
        hideAfter: 1500

    });
}

function interface_popup_success_top_right(msg){
    $.toast({
        heading: 'Success',
        text: msg,
        position: 'top-right',
        loaderBg: '#ff6849',
        icon: 'success',
        hideAfter: 3500,
        stack: 6
    });
}

function get_class_info_calling(status){
    let add = 'btn-default';
    switch (status){
        case 0:
            add = 'btn-success';
            break;
        case 1:
        case 2:
        case 16:
            add = 'btn-danger';
            break;
        case 3:
            add = 'btn-warning';
            break;
        case 8:
            add = 'btn-info';
            break;
    }
    return add;
}

function get_text_calling(status, phone){
    let text = '';
    if (!!status) {
        if (3 === status) text = 'Call out <strong>' + phone + '</strong>';
        else if (8 === status) text = '<strong>' + phone + '</strong> call in';
    }
    return text;
}

function interface_before_validate(selector, attr){
    //beforeValid
    $(selector).find('[' + attr + ']').parent().removeClass('has-error')
    .find('.help-block').addClass('hidden');
}

function interface_error_validate(selector, error){
    //validError()
    error.forEach(function(element, index){
        if ('file' !== $(element).attr('type')){
            $(element).parent().addClass('has-error')
            .find('.help-block').removeClass('hidden');
        }
        else interface_popup_error_top_right('File upload invalid.');
    });
}

function interface_handing_form(){
    //handingForm
}

function interface_ajax_error(selector, type, xhr, status){
    //ajaxError
    console.log(xhr.responseText);
    interface_popup_error_top_right('Cannot connect to server')
    if ('interface_after_full_ajax_error' in window){ console.log('1');
        if (Function === interface_after_full_ajax_error.constructor){ console.log('2');
            interface_after_full_ajax_error(selector, type, xhr, status);
        }
    }
}

function interface_before_send(){
    $('body').append(`
        <div id="blockScreen">
            <div class="block">
            </div>
            <div class="blockConent">
                <i class="fa fa-spin fa-circle-o-notch"></i>
            </div>
        </div>
    `);
}

function interface_after_send(){
    $('#blockScreen').remove();
}

function interface_ajax_success(selector, response, type, xhr){
    //ajaxSuccess
    var rtype = $.type(response); console.log(response);
    if ('object' === rtype || 'string' === rtype){
        
        try{
            if ('string' === rtype) response = JSON.parse(response);

            if ('success' == response.status){
                interface_popup_success_top_right(response.message);
                if (!!type && Function === type.constructor) type(selector, response);
                else if ('interface_after_full_ajax_success' in window){
                    if (Function === interface_after_full_ajax_success.constructor){
                        interface_after_full_ajax_success(selector, response, type);
                    }
                }

                if (!!response.url){
                    setTimeout(function(){
                        window.location.href = response.url;
                    }, 1500);
                }
            }
            else if ('error' == response.status){
                interface_popup_error_top_right(response.message);
            }
            else interface_popup_error_top_right('Has error in server.');
        }catch(e){
            interface_popup_error_top_right('Has error in server.');
        }
    }
    else interface_popup_error_top_right('Response invalid.');
}

function interface_event_click_delete(element, msg){
    let call_do_delete = function(){
        swal.close();
        $(element).find('input:disabled').prop('disabled', false);
        Validate.action(element, {
            ajaxError : interface_ajax_error,
            ajaxSuccess : interface_ajax_success,
            typeAction : function(){
                if ('interface_after_delete_success' in window){
                    if (Function === interface_after_delete_success.constructor){
                        interface_after_delete_success(element);
                    }
                }
            }
        });
    };
    swal({   
        title: "Are you sure delete item?",  
        type: "warning",   
        showCancelButton: true,   
        confirmButtonColor: "#fb0808",   
        confirmButtonText: "Yes, delete it!",   
        closeOnConfirm: false,
        closeOnCancel: true
    }, function(isConfirm){
        if (isConfirm) {
            call_do_delete();
        }
    });
}

$(document).ready(function(){

    Validate.submit('.formSubmit', {
        beforeValid : interface_before_validate,
        validError  : interface_error_validate,
        beforeSend  : interface_before_send,
        ajaxError   : interface_ajax_error,
        ajaxSuccess : interface_ajax_success,
        afterSend   : interface_after_send
    });

    $(document).on('keyup change paste', 'input.nameSlug', function(){

        $('input[name=slug]').val(chane_slug($(this).val()));
    });

    $(document).on('click', '.deleteItemList', function(){
        interface_event_click_delete(this, 'Are you sure delete item?');
        return false;
    });

    $(document).on('change', '.autoUpload', function(){
        if (this.files.length){
            var el = this;
            Validate.action($(this).parent(), {
                validError : interface_error_validate,
                attribute : 'form-upload',
                ajaxError : interface_ajax_error,
                ajaxSuccess : interface_ajax_success,
                typeAction : function(selector, response){
                    if (!!response.url_avatar){
                        $(document).find('img.autoImage-' + response.id).attr('src', response.url_avatar);
                        $(el).val('');
                    }
                    //console.log('typeAction', response);
                }
            });           
        }
    });

    $(document).on('click', '.btnSelectFile', function(){
        $(this).parent().find('input[type=file]').click();
        return false;
    });

    $(document).on('click', '.updateItemList', function(){
        var id = $(this).attr('data-id');
        Validate.action('#list-data-' + id, {
            beforeValid : interface_before_validate,
            validError : interface_error_validate,
            ajaxError : interface_ajax_error,
            ajaxSuccess : interface_ajax_success,
            typeAction : 'SENBAC-UPDATE-ITEM-LIST'
        });
        return false;
    });

    $(document).on('click', '.activity-toolbar .toolbarEdit', function(){
        var box = $(this).parent().parent();
        
        box.find('.activity-content').addClass('open');
        box.find('.contentShow').addClass('hidden');
        box.find('.activityFormEdit').removeClass('hidden');
        
        return false;
    });

    $(document).on('click', '.resetEditActivities', function(){
        var form = $(this).parent().parent().parent();
        form[0].reset();
        form.addClass('hidden');
        form.parent().find('.contentShow').removeClass('hidden');
    });

    $(document).on('click', '.attachName', function(){
        $(this).parent().find('.attachBox').toggleClass('hidden');
        return false;
    });

    $(document).on('click', '.leftPanel a', function(){
        $(this).find('i').toggleClass('ti-minus').toggleClass('ti-plus');
        let content = $('#' + $(this).attr('data-content'));
        
        if (content.hasClass('hidden')){
            content.removeClass('hidden');
            content.slideDown(function(){
                
            });
        }
        else{
            content.slideUp(function(){
                content.addClass('hidden');
            });
        }

        return false;
    });

});