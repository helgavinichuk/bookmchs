// checkup ***
// for input[type=checkbox/radio]
// $('input').checkup();
// $('input').checkup('checked', true/false);
// $('input').checkup('disabled', true/false);
// $('input').checkup('destroy');
// <input class="active disabled" type="checkbox/radio" />
// $('input').bind('change/disabled', function() {});

(function($){

	$.fn.checkup = function( method ) {
		if ( $.fn.checkup.methods[ method ] ) {
			return $.fn.checkup.methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return $.fn.checkup.methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist' );
		}
	};

	$.fn.checkup.methods = {

		init : function( options ) {

			options = $.extend( {}, $.fn.checkup.options, options );

			var all = this;

			var action_c = function(e, p) {
					if(e.is(':checked')) {
						e.addClass('active');
						if(p.length) p.addClass('active');
						options.onChange(e);
					} else {
						e.removeClass('active');
						if(p.length) p.removeClass('active');
					};
				},
				action_r = function(e, p) {
					if(e.is(':checked')) {
						e.addClass('active');
						if(p.length) p.addClass('active');
						options.onChange(e);
					} else {
						e.removeClass('active');
						if(p.length) p.removeClass('active');
					};
				},
				action_disabled = function(e, p) {
					if(e.is(':disabled')) {
						e.addClass('disabled');
						if(p.length) p.addClass('disabled');
					} else {
						e.removeClass('disabled');
						if(p.length) p.removeClass('disabled');
					};
				};

			return this.each(function () {

				// start ******************************

				var e = $(this),
					g = all.filter('[name="'+e.attr('name')+'"]'),
					p = e.parent('label'), // p = (p.length) ? p : e.next('label'),
					type = e.attr('type');

				var checkup_change, checkup_changeonce, checkup_disabled, checkup_destroy;

				checkup_disabled = function() {
					action_disabled(e, p);
				};
				checkup_destroy = function() {
					e.unbind('change', checkup_change).unbind('changeonce', checkup_changeonce).unbind('disabled', checkup_disabled).unbind('destroy', checkup_destroy).removeClass('active disabled');
				};

				// action start
				switch(type) {
					case 'checkbox' :
						checkup_change = function () {
							action_c(e, p);
						};
						e.unbind('change', checkup_change).bind('change', checkup_change);
						break;
					case 'radio' :
						checkup_change = function() {
							action_r(e, p);
							g.trigger('changeonce');
						};
						checkup_changeonce = function() {
							action_r(e, p);
						};
						e.unbind('change', checkup_change).bind('change', checkup_change).unbind('changeonce', checkup_changeonce).bind('changeonce', checkup_changeonce);
						break;
					default :
						return false;
				};
				e.unbind('disabled', checkup_disabled).bind('disabled', checkup_disabled);

				e.trigger('change').trigger('disabled');
				// action end

				// api start
				e.bind('destroy', checkup_destroy);
				// api end

				// end ********************************

			});
		},
		checked : function(val) {
			return this.each(function() {
				$(this).prop('checked', val).trigger('change');
			});
		},
		disabled : function(val) {
			return this.each(function() {
				$(this).prop('disabled', val).trigger('disabled');
			});
		},
		destroy : function() {
			return this.each(function() {
				$(this).trigger('destroy');
			});
		}

	};

	$.fn.checkup.options = {
		onChange: function() {} //(element)
	};

})(jQuery);



// select ***
// $('select').select();

(function($){

	$.fn.select = function( method ) {
		if ( $.fn.select.methods[ method ] ) {
			return $.fn.select.methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return $.fn.select.methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist' );
		}
	};

	$.fn.select.methods = {

		init : function( options ) {

			options = $.extend( {}, $.fn.select.options, options );

			var template =  (options.template)
					?
				'<div class="select-container">'+
				options.template +
				'</div>'
					:
				'<div class="select-container">'+
				'<div class="select-input"></div>'+
				'<div class="select-list">'+
				'<div class="select-holder"></div>'+
				'</div>'+
				'</div>',
				template_small = 	'<div class="select-container">'+
					'<div class="select-input"></div>'+
					'</div>',
				template_item = '<div class="select-item {class}" rel="{id}">{before}<span>{content}</span>{after}</div>',
				body = $('body'),
				select_last,
				select_timer,
				select_close = function() {
					clearTimeout(select_timer);
					select_timer = setTimeout(function () {
						if (select_last) select_last.trigger('change');
						body.unbind('click', select_close);
					}, 200);
				};

			return this.each(function() {

				// start ******************************

				var e = $(this),
					ar,
					ar_o,
					s = (options.small) ? $(template_small) : $(template),
					s_input = s.find('.select-input'),
					s_list = s.find('.select-holder'),
					temp = '',
					c;
				var select_change, select_list_click, select_input_click, select_destroy, select_search_click, select_search_input, select_set, select_update, select_disabled;

				// action start
				ar_o = e.children('option');

				if(options.small) {
					s.css({ 'position' : 'relative' });
					e.css({ 'position' : 'absolute', 'top' : 0, 'left' : 0, 'width' : '100%', 'height' : '100%', 'opacity' : 0, 'z-index' : 1 });
					ar_o.each(function(i) {
						$(this).attr('rel', i);
					});
				} else {
					s.css({ 'position' : 'relative' });
					e.hide();
					ar_o.each(function(i) {
						temp += template_item.replace( '{class}', $(this).is(':disabled') ? 'disabled' : '' ).replace( '{id}', i ).replace( '{content}', $(this).text() ).replace( '{before}', $(this).data('select-before') ? $(this).data('select-before') : '' ).replace( '{after}', $(this).data('select-after') ? $(this).data('select-after') : '' );
						$(this).attr('rel', i);
					});
					s_list.append(temp);
					ar = s_list.children();
				};

				c = e.attr('class').match(/(t\-[a-z0-9]+)/ig);
				e.after(s);
				s.prepend(e).addClass( c ? c.join(' ') : '' );

				if(options.small) {
					select_change = function(event) {
						var sel = [];
						ar_o.filter(':selected').each(function() {
							sel.push( $(this).text() );
						});
						s_input.text( sel.join(', ') );
					};
					select_input_click = function(event) {
						if( e.prop('multiple') ) {
							e.css({ 'top' : '100%', 'height' : 'auto', 'opacity' : 1 })
						};
					};
					select_list_click = function(event) {
						if( e.prop('multiple') ) {
							e.css({ 'top' : 0, 'height' : '100%', 'opacity' : 0 })
						};
					};

					e.bind('change', select_change).bind('click', select_input_click);
					s_input.bind('click', select_list_click);
				} else {
					select_change = function() {
						var sel = [];
						select_last = null;
						clearTimeout(select_timer);
						body.unbind('click', select_close);
						s.removeClass('active');
						ar.removeClass('active');
						ar_o.filter(':selected').each(function() {
							sel.push( $(this).text() );
							$(ar[ this.getAttribute('rel') ]).addClass('active');
						});
						s_input.text( sel.join(', ') );
						ar.removeClass('hidden');
					};
					select_set = function() {
						var sel = [];
						clearTimeout(select_timer);
						ar.removeClass('active');
						ar_o.filter(':selected').each(function() {
							sel.push( $(this).text() );
							$(ar[ this.getAttribute('rel') ]).addClass('active');
						});
						s_input.text( sel.join(', ') );
					};
					select_update = function() {
						temp = '';
						ar_o = e.children('option');
						ar_o.each(function(i) {
							temp += template_item.replace( '{class}', $(this).is(':disabled') ? 'disabled' : '' ).replace( '{id}', i ).replace( '{content}', $(this).text() ).replace( '{before}', $(this).data('select-before') ? $(this).data('select-before') : '' ).replace( '{after}', $(this).data('select-after') ? $(this).data('select-after') : '' );
							$(this).attr('rel', i);
						});
						s_list.empty().append(temp);
						ar = s_list.children();
						ar.bind('click', select_list_click);
						select_set();
					};
					select_list_click = function() {
						var i = $(this).attr('rel');
						if( $(ar_o[i]).prop('disabled') ) return false;
						if( $(ar_o[i]).prop('selected') ) $(ar_o[i]).prop('selected', false);
						else $(ar_o[i]).prop('selected', true);
						if( !e.prop('multiple') ) {
							e.trigger('change');
							s.removeClass('active');
						} else {
							setTimeout(function () {
								e.trigger('set');
							}, 50);
						};
					};
					select_input_click = function() {
						if (e.is(':disabled')) return;
						s.toggleClass('active');
						if (s.hasClass('active')) {
							if (select_last) select_last.trigger('change');
							setTimeout(function () {
								body.bind('click', select_close);
							}, 50);
							select_last = e;
						} else {
							e.trigger('change');
						};
					};
					select_disabled = function(event) {
						if(e.is(':disabled')) {
							s.addClass('disabled');
						} else {
							s.removeClass('disabled');
						};
					};

					e.hide();
					e.bind('change', select_change).bind('set', select_set).bind('update', select_update).bind('disabled', select_disabled);
					ar.bind('click', select_list_click);
					s_input.bind('click', select_input_click);
				};

				options.onLoad(e, s, s_list);

				e.trigger('change');
				// action end

				// api start
				select_destroy = function() {
					s.after(e);
					e.show();
					e.unbind('change', select_change).unbind('set', select_set).unbind('update', select_update).unbind('disabled', select_disabled);
					s.remove();
				};
				e.bind('destroy', select_destroy);
				// api end

				// end ********************************

			});
		},
		destroy : function() {
			return this.each(function() {
				$(this).trigger('destroy');
			});
		}

	};

	$.fn.select.options = {
		template: null,
		small: false,
		onLoad: function() {}, //(select, element, element_list)
		onSelect: function() {} //()
	};

})(jQuery);



// tooltip ***
// $('div').tooltip();

(function($){

	$.fn.tooltip = function( method ) {
		if ( $.fn.tooltip.methods[ method ] ) {
			return $.fn.tooltip.methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return $.fn.tooltip.methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist' );
		}
	};

	$.fn.tooltip.methods = {

		init : function( options ) {

			options = $.extend( {}, $.fn.tooltip.options, options );

			var template = '<div class="tooltip-container"><div class="tooltip-holder"></div></div>',
				l = $(options.layer),
				t = $(template),
				h = t.find('.tooltip-holder');

			t.addClass(options.tooltipClass);
			l.append(t.css('visibility', 'hidden'));

			function getPos(el, event, tt, options) {
				var p = {},
					el_pos,
					el_width,
					el_height;
				switch(options.mode) {
					case 'element':
						el_pos = el.offset();
						el_width = el.outerWidth();
						el_height = el.outerHeight();
						break;
					case 'cursor':
						el_pos = { 'left' : event.pageX, 'top' : event.pageY };
						el_width = 0;
						el_height = 0;
						break;
				};
				switch(options.pos) {
					case 'top':
						p.top = el_pos.top-tt.outerHeight();
						p.left = el_pos.left+el_width/2-tt.outerWidth()/2;
						break;
					case 'bottom':
						p.top = el_pos.top+el_height;
						p.left = el_pos.left+el_width/2-tt.outerWidth()/2;
						break;
					case 'right':
						p.top = el_pos.top+el_height;
						p.left = el_pos.left+el_width+10;
						break;
				};
				return p;
			};

			return this.each(function() {

				// start ******************************

				var e = $(this),
					e_event,
					trigger = false, //mouseover
					to;
				var tooltip_mouseover, tooltip_mouseout, tooltip_mousemove, tooltip_destroy;

				tooltip_mouseover = function (event) {
					var el = $(this)
					e_event = event;
					trigger = true;
					clearTimeout(to);
					to = setTimeout(function() {
						h.html( el.attr(options.attr) );
						var p = getPos(el, e_event, t, options);
						t.addClass(options.pos).css({ 'position' : 'absolute', 'top' : p.top, 'left' : p.left, 'visibility' : 'visible' });
					}, options.timeout);
				};
				tooltip_mousemove = function (event) {
					if(!trigger) return;
					e_event = event;
				};
				tooltip_mouseout = function () {
					trigger = false;
					clearTimeout(to);
					to = setTimeout(function() {
						t.css({ 'visibility' : 'hidden' });
					}, options.timeout/2);
				};


				// action start
				e
					.bind('mouseover', tooltip_mouseover)
					.bind('mouseout', tooltip_mouseout)
				if(options.mode == 'cursor') e.bind('mousemove', tooltip_mousemove);
				// action end

				// api start
				tooltip_destroy = function () {
					e
						.unbind('mouseover', tooltip_mouseover)
						.unbind('mouseout', tooltip_mouseout)
						.unbind('mousemove', tooltip_mousemove)
						.unbind('destroy', tooltip_destroy);
					t.remove();
				};
				e.bind('destroy', tooltip_destroy);
				// api end

				// end ********************************

			});
		},
		destroy : function() {
			return this.each(function() {
				$(this).trigger('destroy');
			});
		}

	};

	$.fn.tooltip.options = {
		layer: 'body',
		pos: 'top', //top, bottom
		mode: 'element', //element, cursor
		attr: 'data-tooltip',
		tooltipClass: '',
		timeout: 200
	};

})(jQuery);



// popup ***
// 	$('a').popup();
//	$('a').popup({
//		overlay: '#overlay',
//		layer: '#layer',
//		type: 'iframe/html/image/ajax',
//		width: 560,
//		height: 315
//	});
// 	$('a').popup('update');
// 	$('a').popup('destroy');

(function($){

	$.fn.popup = function( method ) {
		if ( $.fn.popup.methods[ method ] ) {
			return $.fn.popup.methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return $.fn.popup.methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist' );
		}
	};

	$.fn.popup.methods = {

		init : function( options, functions ) {

			var selector = this.selector.replace(/[#]+/g, '1_').replace(/[\.]+/g, '2_').replace(/[^a-z0-9_]+/ig, '').slice(0,50);

			options = $.extend( {}, $.fn.popup.options, options );
			functions = $.fn.popup.functions;

			var template =  (options.template)
					?
				'<div class="popup">'+
				options.template +
				'<div class="popup-preload">Загрузка...</div>'+
				'</div>'
					:
				'<div class="popup">'+
				'<div class="popup-wrapper">'+
				'<div class="popup-title"></div>'+
				'<div class="popup-holder"></div>'+
				'<div class="popup-error">Error</div>'+
				'<a class="popup-but-close" href="#close">Close</a>'+
				'<a class="popup-but-prev" href="#prev">Prev</a>'+
				'<a class="popup-but-next" href="#next">Next</a>'+
				'</div>'+
				'<div class="popup-preload">Loading...</div>'+
				'</div>',
				template_holder =   '<div class="popup-holder">'+
					'<div class="popup-content"></div>'+
					'</div>',
				body = $('body'),
				hold = {
					o : $(options.overlay),
					l : $(options.layer),
					p : $(template),
					h : $(template_holder)
				},
				current,
				tr = {
					open : false
				},
				nav = {
					prev : null,
					next : null
				},
				keeper = $.fn.popup.keeper[selector] = {},
				parent = false,
				line = false;

			hold.p_wrapper = hold.p.find('.popup-wrapper'),
				hold.p_holder = hold.p.find('.popup-holder'),
				hold.p_close = hold.p.find('.popup-but-close'),
				hold.p_prev = hold.p.find('.popup-but-prev'),
				hold.p_next = hold.p.find('.popup-but-next'),
				hold.p_preload = hold.p.find('.popup-preload'),
				hold.p_error = hold.p.find('.popup-error');

			keeper.ar = this,
				keeper.g_ar = {},
				keeper.total = keeper.ar.length;

			keeper.init = function(ar) {
				keeper.g_ar = functions.groupElements( 0, keeper.total, keeper.ar, {}, options );

				ar.bind('click open', keeper.popup_open);
			};
			keeper.popup_open = function() {
				if(!tr.open) {
					line = ($.fn.popup.line.length) ? true : false;
					tr.open = functions.openPopup( hold.o, hold.l, hold.p, hold.p_wrapper, hold.p_preload, hold.p_error, body, line, options );
					options.onOpen($(this), hold.p);
					$(document).bind('keyup', keeper.keypress);
				};
				current = $(this),
				hold.p_holder_old = hold.p_holder,
				hold.p_holder = hold.h.clone().hide();
				if (options.onOpenLast && (parseInt($(this).data('popup-index')) == keeper.total - 1)) {
					var that = this;
					options.onOpenLast($(this), hold.p, function () {
						nav = functions.setPopup( $(that), keeper.g_ar[ that.getAttribute(options.group) ], hold.p_prev, hold.p_next ),
						parent = functions.loadPopup( $(that), hold.p, hold.p_wrapper, hold.p_holder, hold.p_holder_old, hold.p_preload, hold.p_error, parent, options, keeper.g_ar[ that.getAttribute(options.group) ] );
					});
				} else {
					nav = functions.setPopup( $(this), keeper.g_ar[ this.getAttribute(options.group) ], hold.p_prev, hold.p_next ),
					parent = functions.loadPopup( $(this), hold.p, hold.p_wrapper, hold.p_holder, hold.p_holder_old, hold.p_preload, hold.p_error, parent, options, keeper.g_ar[ this.getAttribute(options.group) ] );
				};
				return false;
			};
			keeper.popup_close = function() {
				if(tr.open) {
					options.onClose(hold.p);
					functions.unloadPopup( hold.p_wrapper, hold.p_preload, hold.p_error, options );
					tr.open = functions.closePopup( hold.o, hold.l, hold.p, body, line, options );
					hold.p_holder.children().remove();
					$(document).unbind('keyup', keeper.keypress);
				};
				return false;
			};
			keeper.popup_prev = function() {
				if(nav.prev) {
					functions.unloadPopup( hold.p_wrapper, hold.p_preload, hold.p_error, options );
					nav.prev.trigger('click');
				};
				return false;
			};
			keeper.popup_next = function() {
				if(nav.next) {
					functions.unloadPopup( hold.p_wrapper, hold.p_preload, hold.p_error, options );
					nav.next.trigger('click');
				};
				return false;
			};
			keeper.destroy = function() {
				keeper.ar.unbind('click open', keeper.popup_open);
				hold.p.remove();
			};
			keeper.click = function(event) {
				if(!event.target || event.target == event.currentTarget) {
					keeper.popup_close.apply(this);
					return false;
				};
			};
			keeper.keypress = function(event) {
				if (event.which == 27 || event.keyCode == 27) {
					keeper.popup_close.apply(this);
				} else if (event.which == 37 || event.keyCode == 37) {
					keeper.popup_prev.apply(this);
				} else if (event.which == 39 || event.keyCode == 39) {
					keeper.popup_next.apply(this);
				};
			};

			// start ******************************

			hold.p_close
				.bind('close click', keeper.popup_close);
			hold.p
				.bind('close', keeper.popup_close);
			if (!options.disableHolderClick) {
				hold.p
					.bind('click', keeper.click);
			} else {
				hold
					.p.addClass('t-q-noclick')
			}
			hold.p_prev
				.bind('click', keeper.popup_prev);
			hold.p_next
				.bind('click', keeper.popup_next);

			hold.p.addClass( options.popupClass );

			keeper.init( keeper.ar );

			// end ********************************

			return this;

		},
		open : function() {
			var selector = this.selector.replace(/[#]+/g, '1_').replace(/[\.]+/g, '2_').replace(/[^a-z0-9_]+/ig, '').slice(0,50),
				keeper = $.fn.popup.keeper[selector],
				ar, new_el;
			keeper.ar.first().trigger('open');

			return this;
		},
		update : function() {
			var selector = this.selector.replace(/[#]+/g, '1_').replace(/[\.]+/g, '2_').replace(/[^a-z0-9_]+/ig, '').slice(0,50),
				keeper = $.fn.popup.keeper[selector],
				ar, new_el;
			if(keeper) {
				ar = this,
				new_el = ar.not(keeper.ar);
			};
			keeper.ar = ar,
			keeper.total = ar.length;
			keeper.init(new_el);

			return new_el;
		},
		destroy : function() {
			var selector = this.selector.replace(/[#]+/g, '1_').replace(/[\.]+/g, '2_').replace(/[^a-z0-9_]+/ig, '').slice(0,50),
				keeper = $.fn.popup.keeper[selector];

			if (keeper) {
				keeper.destroy();
				$.fn.popup.keeper[selector] = keeper = {};
			};
		}

	};

	$.fn.popup.functions = {
		groupElements : function(start, end, ar, g_ar, options) {
			for(var i=start; i<end; i++) {
				var g_name = ar[i].getAttribute(options.group);
				if( !g_name ) {
					g_name = 'g'+( (options.grouped)?0:i );
					ar[i].setAttribute( options.group, g_name );
				};
				if(!g_ar[g_name]) g_ar[g_name] = [];
				g_ar[g_name].push( $(ar[i]) );
				ar[i].setAttribute( 'data-popup-index', g_ar[g_name].length-1 );
			};

			return g_ar;
		},
		openPopup : function(o, l, p, p_wrapper, p_preload, p_error, body, line, options) {
			l.append(p);
			o.css({ 'display' : 'block' }).addClass( options.overlayClass );
			l.addClass( options.layerClass );
			p.css({ 'display' : 'block' });
			p_wrapper.css({ 'display' : 'none' });
			p_preload.css({ 'display' : 'block' });
			p_error.css({ 'display' : 'none' });
			if (options.blocked) body.css('overflow', 'hidden');

			if(line) {
				$.fn.popup.line[ $.fn.popup.line.length-1 ].css({ 'display' : 'none' });
			};
			$.fn.popup.line.push( p );

			return true;
		},
		setPopup : function(e, g, p_prev, p_next) {
			var index = e.data('popup-index'),
				total = g.length,
				tr = {
					prev : (index) ? true : false,
					next : (index != (total-1)) ? true : false
				},
				nav = {
					prev : (tr.prev) ? g[index-1] : null,
					next : (tr.next) ? g[index+1] : null
				};

			p_prev.removeClass('disabled').addClass( (tr.prev) ? '' : 'disabled' );
			p_next.removeClass('disabled').addClass( (tr.next) ? '' : 'disabled' );

			return nav;
		},
		loadPopup : function(e, p, p_wrapper, p_holder, p_holder_old, p_preload, p_error, parent_old, options, ar) {
			var title = e.attr('title'),
				p_title = p_wrapper.find('.popup-title'),
				p_content = p_holder.find('.popup-content'),
				html, parent;

			switch(options.type) {
				case 'html':
					html = $( e.attr('href').replace( /[^0-9a-zA-Z_#\-]+/g, '' ) );
					parent = html.parent();
					break;
				case 'iframe':
					html = $('<iframe class="popup-content-iframe" src="'+e.attr('href')+'" style="width: 100%; height: 100%;" frameborder="0" allowfullscreen="true">Error</iframe>');
					break;
				case 'image':
					html = $('<img class="popup-content-image" src="'+e.attr('href')+'" alt="" />');
					break;
				case 'ajax':
					options.request.url = e.attr('href');
					html = $('<div class="popup-content-ajax"></div>');
					break;
			};

			p_holder_old.after( p_holder );
			p_title.text( (title) ? title : '' );

			try {
				if( html.length != 1) { throw new Error('Error'); };
				switch(options.type) {
					case 'iframe':
					case 'image':
						p_content.html( html );
						html
							.bind('load', function() {
								return success();
							})
							.bind('error', function() {
								return error();
							});
						break;
					case 'html':
						p_content.html( html );
						if(parent_old) {
							parent_old.append( p_holder_old.find('.popup-content').children() );
						};
						return success();
						break;
					case 'ajax':
						$.ajax(options.request)
							.done(function( data ) {
								p_content.html( data );
								return success();
							})
							.fail(function() {
								return error();
							});
						break;
				};
			} catch(er) {
				return error();
			};

			function success() {
				p_holder_old.remove();
				p_wrapper.css({ 'display' : 'block' });
				p_holder.css({ 'display' : 'block' });
				p_preload.css({ 'display' : 'none' });
				style();
				options.onLoad(e, p, ar);
				return (parent) ? parent : false;
			};
			function error() {
				p_holder_old.remove();
				p_wrapper.css({ 'display' : 'block' });
				p_preload.css({ 'display' : 'none' });
				p_error.css({ 'display' : 'block' });
				style();
				return false;
			};
			function style() {
				var w = (options.width == 'auto' && options.type == 'image') ? html.get(0).width : options.width,
					h = options.height;
				p_wrapper.css({ 'max-width' : w });
				p_content.css({ 'height' : h });
			};
		},
		unloadPopup : function(p_wrapper, p_preload, p_error, options) {
			p_preload.css({ 'display' : 'block' });
			p_error.css({ 'display' : 'none' });
		},
		closePopup : function(o, l, p, body, line, options) {
			if(!line) {
				o.css({ 'display' : 'none' }).removeClass( options.overlayClass );
				l.removeClass( options.layerClass );
				if (options.blocked) body.css({ 'overflow' : '' });
			};
			p.detach();

			$.fn.popup.line.pop();
			if(line) {
				$.fn.popup.line[$.fn.popup.line.length-1].css({ 'display' : 'block' });
			};

			return false;
		}
	};

	$.fn.popup.options = {
		template: null,
		overlay: null,
		layer: 'body',
		overlayClass: '',
		layerClass: '',
		popupClass: '',
		disableHolderClick: false,
		grouped: true,
		blocked: true,
		group: 'rel',
		type: 'image', //iframe, image, html, ajax
		width: 'auto',
		height: 'auto',
		request: {},
		onOpen: function() {}, //(element, popup)
		onClose: function() {}, //(popup)
		onLoad: function() {}, //(element, popup)
		onOpenLast: null //(element, popup, fn_end)
	};

	$.fn.popup.keeper = {};

	$.fn.popup.line = [];

})(jQuery);

// popup *** old
// 	$('a').popup();
//	$('a').popup({
//		overlay: '#overlay',
//		layer: '#layer',
//		type: 'iframe/html/image/ajax',
//		width: 560,
//		height: 315
//	});
// 	$('a').popup('update');
// 	$('a').popup('destroy');

(function($){

	$.fn.popup2 = function( method ) {
		if ( $.fn.popup2.methods[ method ] ) {
			return $.fn.popup2.methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return $.fn.popup2.methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist' );
		}
	};

	$.fn.popup2.methods = {

		init : function( options, functions ) {

			var selector = this.selector.replace(/[#]+/g, '1_').replace(/[\.]+/g, '2_').replace(/[^a-z0-9_]+/ig, '').slice(0,50);

			options = $.extend( {}, $.fn.popup2.options, options );
			functions = $.fn.popup2.functions;

			var template =  (options.template)
					?
				'<div class="popup">'+
				options.template +
				'<div class="popup-preload">Загрузка...</div>'+
				'</div>'
					:
				'<div class="popup">'+
				'<div class="popup-holder">'+
				'<div class="popup-title"></div>'+
				'<div class="popup-container"></div>'+
				'<div class="popup-error">Error</div>'+
				'<a class="popup-but-close" href="#close">Close</a>'+
				'<a class="popup-but-prev" href="#prev">Prev</a>'+
				'<a class="popup-but-next" href="#next">Next</a>'+
				'</div>'+
				'<div class="popup-preload">Loading...</div>'+
				'</div>',
				template_holder =   '<div class="popup-container">'+
					'<div class="popup-content"></div>'+
					'</div>',
				body = $('body'),
				hold = {
					o : $(options.overlay),
					l : $(options.layer),
					p : $(template),
					h : $(template_holder)
				},
				current,
				tr = {
					open : false
				},
				nav = {
					prev : null,
					next : null
				},
				keeper = $.fn.popup2.keeper[selector] = {},
				parent = false,
				line = false;

			hold.p_wrapper = hold.p.find('.popup-holder'),
				hold.p_holder = hold.p.find('.popup-container'),
				hold.p_close = hold.p.find('.popup-but-close'),
				hold.p_prev = hold.p.find('.popup-but-prev'),
				hold.p_next = hold.p.find('.popup-but-next'),
				hold.p_preload = hold.p.find('.popup-preload'),
				hold.p_error = hold.p.find('.popup-error');

			keeper.ar = this,
				keeper.g_ar = {},
				keeper.total = keeper.ar.length;

			keeper.init = function(ar) {
				keeper.g_ar = functions.groupElements( 0, keeper.total, keeper.ar, {}, options );

				ar.bind('click open', keeper.popup_open);
			};
			keeper.popup_open = function() {
				if(!tr.open) {
					line = ($.fn.popup2.line.length) ? true : false;
					tr.open = functions.openPopup( hold.o, hold.l, hold.p, hold.p_wrapper, hold.p_preload, hold.p_error, body, line, options );
					options.onOpen($(this), hold.p);
					$(document).bind('keyup', keeper.keypress);
				};
				current = $(this),
					hold.p_holder_old = hold.p_holder,
					hold.p_holder = hold.h.clone().hide(),
					nav = functions.setPopup( $(this), keeper.g_ar[ this.getAttribute(options.group) ], hold.p_prev, hold.p_next ),
					parent = functions.loadPopup( $(this), hold.p, hold.p_wrapper, hold.p_holder, hold.p_holder_old, hold.p_preload, hold.p_error, parent, options, keeper.g_ar[ this.getAttribute(options.group) ] );
				return false;
			};
			keeper.popup_close = function() {
				if(tr.open) {
					options.onClose(hold.p);
					functions.unloadPopup( hold.p_wrapper, hold.p_preload, hold.p_error, options );
					tr.open = functions.closePopup( hold.o, hold.l, hold.p, body, line, options );
					hold.p_holder.children().remove();
					$(document).unbind('keyup', keeper.keypress);
				};
				return false;
			};
			keeper.popup_prev = function() {
				if(nav.prev) {
					functions.unloadPopup( hold.p_wrapper, hold.p_preload, hold.p_error, options );
					nav.prev.trigger('click');
				};
				return false;
			};
			keeper.popup_next = function() {
				if(nav.next) {
					functions.unloadPopup( hold.p_wrapper, hold.p_preload, hold.p_error, options );
					nav.next.trigger('click');
				};
				return false;
			};
			keeper.destroy = function() {
				keeper.ar.unbind('click open', keeper.popup_open);
				hold.p.remove();
			};
			keeper.click = function(event) {
				if(!event.target || event.target == event.currentTarget) {
					keeper.popup_close.apply(this);
					return false;
				};
			};
			keeper.keypress = function(event) {
				if (event.which == 27 || event.keyCode == 27) {
					keeper.popup_close.apply(this);
				} else if (event.which == 37 || event.keyCode == 37) {
					keeper.popup_prev.apply(this);
				} else if (event.which == 39 || event.keyCode == 39) {
					keeper.popup_next.apply(this);
				};
			};

			// start ******************************

			hold.p_close
				.bind('close click', keeper.popup_close);
			hold.p
				.bind('close', keeper.popup_close)
				.bind('click', keeper.click);
			hold.p_prev
				.bind('click', keeper.popup_prev);
			hold.p_next
				.bind('click', keeper.popup_next);

			hold.p.addClass( options.popupClass );

			keeper.init( keeper.ar );

			// end ********************************

			return this;

		},
		open : function() {
			var selector = this.selector.replace(/[#]+/g, '1_').replace(/[\.]+/g, '2_').replace(/[^a-z0-9_]+/ig, '').slice(0,50),
				keeper = $.fn.popup2.keeper[selector],
				ar, new_el;
			keeper.ar.first().trigger('open');

			return this;
		},
		update : function() {
			var selector = this.selector.replace(/[#]+/g, '1_').replace(/[\.]+/g, '2_').replace(/[^a-z0-9_]+/ig, '').slice(0,50),
				keeper = $.fn.popup2.keeper[selector],
				ar, new_el;
			if(keeper) {
				ar = this,
				new_el = ar.not(keeper.ar);
			};
			keeper.ar = ar,
			keeper.total = ar.length;
			keeper.init(new_el);

			return new_el;
		},
		destroy : function() {
			var selector = this.selector.replace(/[#]+/g, '1_').replace(/[\.]+/g, '2_').replace(/[^a-z0-9_]+/ig, '').slice(0,50),
				keeper = $.fn.popup2.keeper[selector];

			keeper.destroy();
			$.fn.popup2.keeper[selector] = keeper = {};
		}

	};

	$.fn.popup2.functions = {
		groupElements : function(start, end, ar, g_ar, options) {
			for(var i=start; i<end; i++) {
				var g_name = ar[i].getAttribute(options.group);
				if( !g_name ) {
					g_name = 'g'+( (options.grouped)?0:i );
					ar[i].setAttribute( options.group, g_name );
				};
				if(!g_ar[g_name]) g_ar[g_name] = [];
				g_ar[g_name].push( $(ar[i]) );
				ar[i].setAttribute( 'data-popup-index', g_ar[g_name].length-1 );
			};

			return g_ar;
		},
		openPopup : function(o, l, p, p_wrapper, p_preload, p_error, body, line, options) {
			l.append(p);
			o.css({ 'display' : 'block' }).addClass( options.overlayClass );
			l.css({ 'display' : 'block' }).addClass( options.layerClass );
			p.css({ 'display' : 'block' });
			p_wrapper.css({ 'display' : 'none' });
			p_preload.css({ 'display' : 'block' });
			p_error.css({ 'display' : 'none' });
			if (options.blocked) body.css('overflow', 'hidden');

			if(line) {
				$.fn.popup.line[ $.fn.popup.line.length-1 ].css({ 'display' : 'none' });
			};
			$.fn.popup2.line.push( p );

			return true;
		},
		setPopup : function(e, g, p_prev, p_next) {
			var index = e.data('popup-index'),
				total = g.length,
				tr = {
					prev : (index) ? true : false,
					next : (index != (total-1)) ? true : false
				},
				nav = {
					prev : (tr.prev) ? g[index-1] : null,
					next : (tr.next) ? g[index+1] : null
				};

			p_prev.removeClass('disabled').addClass( (tr.prev) ? '' : 'disabled' );
			p_next.removeClass('disabled').addClass( (tr.next) ? '' : 'disabled' );

			return nav;
		},
		loadPopup : function(e, p, p_wrapper, p_holder, p_holder_old, p_preload, p_error, parent_old, options, ar) {
			var title = e.attr('title'),
				p_title = p_wrapper.find('.popup-title'),
				p_content = p_holder.find('.popup-content'),
				html, parent;

			switch(options.type) {
				case 'html':
					html = $( e.attr('href').replace( /[^0-9a-zA-Z_#\-]+/g, '' ) );
					parent = html.parent();
					break;
				case 'iframe':
					html = $('<iframe class="popup-content-iframe" src="'+e.attr('href')+'" style="width: 100%; height: 100%;" frameborder="0" allowfullscreen="true">Error</iframe>');
					break;
				case 'image':
					html = $('<img class="popup-content-image" src="'+e.attr('href')+'" alt="" />');
					break;
				case 'ajax':
					options.request.url = e.attr('href');
					html = $('<div class="popup-content-ajax"></div>');
					break;
			};

			p_holder_old.after( p_holder );
			p_title.text( (title) ? title : '' );

			try {
				if( html.length != 1) { throw new Error('Error'); };
				switch(options.type) {
					case 'iframe':
					case 'image':
						p_content.html( html );
						html
							.bind('load', function() {
								return success();
							})
							.bind('error', function() {
								return error();
							});
						break;
					case 'html':
						p_content.html( html );
						if(parent_old) {
							parent_old.append( p_holder_old.find('.popup-content').children() );
						};
						return success();
						break;
					case 'ajax':
						$.ajax(options.request)
							.done(function( data ) {
								p_content.html( data );
								return success();
							})
							.fail(function() {
								return error();
							});
						break;
				};
			} catch(er) {
				return error();
			};

			function success() {
				p_holder_old.remove();
				p_wrapper.css({ 'display' : 'block' });
				p_holder.css({ 'display' : 'block' });
				p_preload.css({ 'display' : 'none' });
				style();
				options.onLoad(e, p, ar);
				return (parent) ? parent : false;
			};
			function error() {
				p_holder_old.remove();
				p_wrapper.css({ 'display' : 'block' });
				p_preload.css({ 'display' : 'none' });
				p_error.css({ 'display' : 'block' });
				style();
				return false;
			};
			function style() {
				var w = (options.width == 'auto' && options.type == 'image') ? html.get(0).width : options.width,
					h = options.height;
				p_wrapper.css({ 'max-width' : w });
				p_content.css({ 'height' : h });
			};
		},
		unloadPopup : function(p_wrapper, p_preload, p_error, options) {
			p_preload.css({ 'display' : 'block' });
			p_error.css({ 'display' : 'none' });
		},
		closePopup : function(o, l, p, body, line, options) {
			if(!line) {
				o.css({ 'display' : 'none' }).removeClass( options.overlayClass );
				l.css({ 'display' : 'none' }).removeClass( options.layerClass );
				if (options.blocked) body.css({ 'overflow' : '' });
			};
			p.detach();

			$.fn.popup2.line.pop();
			if(line) {
				$.fn.popup2.line[$.fn.popup2.line.length-1].css({ 'display' : 'block' });
			};

			return false;
		}
	};

	$.fn.popup2.options = {
		template: null,
		overlay: null,
		layer: 'body',
		overlayClass: '',
		layerClass: '',
		popupClass: '',
		grouped: true,
		blocked: true,
		group: 'rel',
		type: 'image', //iframe, image, html, ajax
		width: 'auto',
		height: 'auto',
		request: {},
		onOpen: function() {}, //(element, popup)
		onClose: function() {}, //(popup)
		onLoad: function() {} //(element, popup)
	};

	$.fn.popup2.keeper = {};

	$.fn.popup2.line = [];

})(jQuery);



// errortip ***
// $('div').errortip();

(function($){

	$.fn.errortip = function( method ) {
		if ( $.fn.errortip.methods[ method ] ) {
			return $.fn.errortip.methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return $.fn.errortip.methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist' );
		}
	};

	$.fn.errortip.methods = {

		init : function( options ) {

			options = $.extend( {}, $.fn.errortip.options, options );

			var template = '<div class="errortip-container"><div class="errortip-holder">{title}</div></div>',
				fn_get_position = function (el, tip, upos) {
					var w = el.outerWidth(),
						h = el.outerHeight();
					hh = tip.outerHeight();
					if (options.superposition) {
						return {
							'top' : el.offset().top + h - upos.top,
							'left' : el.offset().left - upos.left,
							'width' : w
						};
					} else {
						return {
							'top' : el.offset().top + h,
							'left' : el.offset().left,
							'width' : w
						};
					};
				};

			return this.each(function() {

				// start ******************************

				var e = $(this),
					l, t,
					trigger = false;
				var errortip_bind, errortip_click, errortip_destroy;

				if (this.hasAttribute('data-errortip-set')) return;

				errortip_bind = function () {
					if (trigger || !e.attr('data-errortip')) return;
					var pos, upos,
						temp = template.replace('{title}', e.attr('data-errortip'));
					l = $(options.layer);
					t = $(temp).addClass(options.errorClass);
					upos = l.offset();
					upos.top -= l.scrollTop();
					upos.left -= l.scrollLeft();
					l.append(t);
					pos = fn_get_position(e.is(':visible') ? e : e.parent(), t, upos);
					t.css({ 'top' : pos.top, 'left' : pos.left, 'width' : pos.width });
					t.bind('click', errortip_click);
					e.bind('unerror', errortip_click);
					if (options.onError) options.onError(e);
					trigger = true;
				};
				errortip_click = function () {
					e.bind('error', errortip_bind).unbind('unerror', errortip_click);
					e.trigger('unerror').find('input, select, textarea').trigger('unerror');
					if (t) t.remove();
					if (options.onUnerror) options.onUnerror(e);
					trigger = false;
					return false;
				};

				// action start
				e.bind('error', errortip_bind);
				e.attr('data-errortip-set', true);
				errortip_bind();
				// action end

				// api start
				errortip_destroy = function () {
					e.unbind('error', errortip_bind).unbind('unerror', errortip_click);
					if (t) t.remove();
				};
				e.bind('destroy', errortip_destroy);
				// api end

				// end ********************************

			});
		},
		destroy : function() {
			return this.each(function() {
				$(this).trigger('destroy');
			});
		}

	};

	$.fn.errortip.options = {
		errorClass: '',
		layer: 'body',
		superposition: false,
		onError: null,
		onUnerror: null
	};

})(jQuery);



// onefile ***
// for input[type=file]
// $('input').onefile();
// $('input').onefile('destroy');

(function($){

	$.fn.onefile = function( method ) {
		if ( $.fn.onefile.methods[ method ] ) {
		  return $.fn.onefile.methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
		  return $.fn.onefile.methods.init.apply( this, arguments );
		} else {
		  $.error( 'Method ' +  method + ' does not exist' );
		}
	};

	$.fn.onefile.methods = {

		init : function( options ) {
	
			options = $.extend( {}, $.fn.onefile.options, options );

			var template =  '<div class="onefile"><div class="onefile-add"><span class="button t-form_blue">Выберите файл</span></div><div class="onefile-holder"></div></div>';

			return this.each(function() {

			// start ******************************

				var e = $(this),
					ar = $(),
					total = 0,
					f = $(template),
					f_but = f.find('.onefile-add'),
					f_h = f.find('.onefile-holder');
				var onefile_change, onefile_destroy;

				onefile_change = function() {
					var name, title;
					name = this.value,
					title = name.replace(/.*\\(.*)/, "$1"),
					title = title.replace(/.*\/(.*)/, "$1");
					f_h.empty().append(title);
					options.onChange( f, title );
				};

				// action start
				e.after(f).appendTo(f_but);

				e.bind('change', onefile_change).trigger('change');
				// action end

				// api start
				onefile_destroy = function() {
					f.after(e);
					f.remove();
					e.unbind('change', onefile_change);
				};
				e.bind('destroy', onefile_destroy);
				// api end

			// end ********************************

			});
		},
		destroy : function() {
			return this.each(function() {
				$(this).trigger('destroy');
			});
		}

	};

	$.fn.onefile.options = {
		onChange: function() {}
	};

})(jQuery);

