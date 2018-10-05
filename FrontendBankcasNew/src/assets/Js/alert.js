var Alert = {
	options : null,

	html : null,

	initOptions : function(){
		this.options = {
			hasTitle : false,
			title : '',
			message : '',
			button : [],
			classes : '',
			hasIconClose : false,
			width : '300px',
			focus : null
		};
	},

	setOptions : function(options){
		this.initOptions();
		if ('object' == $.type(options)){
			if (!!options.title && 'string' == $.type(options.title)){
				this.options.hasTitle = true;
				this.options.title = options.title;
			}
			if (!!options.message && 'string' == $.type(options.message)) this.options.message = options.message;
			if (!!options.classes && 'string' == $.type(options.classes)) this.options.classes = options.classes;
			if ('boolean' == $.type(options.closeIcon)) this.options.hasIconClose = options.closeIcon;
			if ('string' == $.type(options.width) && /^\d+%|(px)$/g.test(options.width)) this.options.width = options.width;
			if ($.isArray(options.btn) && options.btn.length){
				var arrBtn = options.btn;
				for (var x in arrBtn){
					var item = arrBtn[x];
					if (
						'object' == $.type(item) && 
						'string' == $.type(item.label) && 
						!!item.label
					) this.options.button.push(item);
				}
			}
		}
	},

	popup : function(options){
		this.setOptions(options);
		this.html = $('<div/>').addClass('alertLock');
		this.html.append(
			$('<div/>').addClass('alertPage').addClass(this.options.classes).css('width', this.options.width)
		);
		if (this.options.hasTitle){
			this.html.find('.alertPage').append(
				$('<div/>').addClass('alertTitle').html(this.options.title)
			);
		}
		this.html.find('.alertPage').append(
			$('<div/>').addClass('alertBody').append(
				$('<div/>').addClass('alertMsg').html(this.options.message)
			)
		);
		if (this.options.button.length){
			this.html.find('.alertBody').append(
				$('<div/>').addClass('alertBtn')
			);
			var arrBtn = this.options.button;
			for (var x in arrBtn){
				let item = arrBtn[x];
				let btn = $('<button/>').addClass('alertButton').attr('type', 'button').html(item.label);
				if ('string' === $.type(item.color) && !!item.color) btn.addClass(item.color);
				if ('function' === $.type(item.fn)) btn.bind('click', function(){
					item.fn();
				});
				if ('boolean' === $.type(item.isFocus) && item.isFocus) this.options.focus = btn;
				this.html.find('.alertBtn').append(btn);
			}
		}
		if (this.options.hasIconClose){
			this.html.find('.alertPage').append(
				$('<span/>').addClass('alertClose').bind('click', this.close)
			);
		}
		$('body').append(this.html);
		if (!!this.options.focus) this.options.focus.focus();
		this.options = null;
		this.html = null;
	},

	close : function(){
		$('.alertLock').last().find('.alertButton, .alertClose').unbind('click');
		$('.alertLock').last().remove();
	}
};