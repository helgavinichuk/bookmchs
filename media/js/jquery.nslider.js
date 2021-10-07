(function($){

	$.fn.nslider = function( method ) {
		if ( $.fn.nslider.methods[ method ] ) {
		  return $.fn.nslider.methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
		  return $.fn.nslider.methods.init.apply( this, arguments );
		} else {
		  $.error( 'Method ' +  method + ' does not exist' );
		}
	};

	$.fn.nslider.methods = {

		init : function( options, functions ) {

			var selector = this.selector.replace(/[#]+/g, '1_').replace(/[\.]+/g, '2_').replace(/[^a-z0-9_]+/ig, '').slice(0,50);

			options = $.extend( {}, $.fn.nslider.options, options );
			functions = $.fn.nslider.functions;

			var template =  '<div class="nslider">'+
								'<div class="nslider-holder"></div>'+
								'<div class="nslider-control">'+
									'<div class="nslider-nav">'+
										'<a href="javascript:void(0);" class="nslider-nav-prev">Назад</a>'+
										'<a href="javascript:void(0);" class="nslider-nav-next">Дальше</a>'+
									'</div>'+
									'<div class="nslider-count"></div>'+
									'<div class="nslider-point"></div>'+
								'</div>'+
							'</div>',
				body = $('body'),
				total = 0;

			this.each(function(i) {

				var hold = {
						s : $(template)
					},
					tr = {
						action : false,
						prev : false,
						next : false
					},
					nav = {
						index: options.current,
						exindex: options.current
					},
					keeper = $.fn.nslider.keeper[ selector+'--'+i ] = {},
					timer;

				hold.s_holder = hold.s.find('.nslider-holder'),
				hold.s_nav = hold.s.find('.nslider-nav'),
				hold.s_nav_p = hold.s_nav.find('.nslider-nav-prev'),
				hold.s_nav_n = hold.s_nav.find('.nslider-nav-next'),
				hold.s_point = hold.s.find('.nslider-point');
				hold.s_count = hold.s.find('.nslider-count');

				keeper.e = $(this);
				keeper.e_ar = keeper.e.children();
				keeper.total = keeper.e_ar.length;

				if(keeper.total < 2) {
					hold.s_nav.remove();
					hold.s_point.remove();
				};

				hold.s.addClass(options.sliderClass);
				hold.s_nav.addClass(options.navClass);
				hold.s_point.addClass(options.pointClass);

				if(options.point) options.point.append( hold.s_point );
				if(options.nav) options.nav.append( hold.s_nav );

				keeper.init = function() {
					hold = functions.setSlider( keeper.e_ar, hold, options );

					keeper.set();
					clearInterval(timer);
					if(options.autoplay) timer = setInterval(function () { keeper.nslider_next(); }, options.autoplaySpeed);
				};
				keeper.set = function() {
					tr = $.extend( {}, tr, functions.setNavigation( nav.index, nav.exindex, keeper.total, hold ) );
					functions.setPoint( nav.index, hold, options );
					if(options.count) functions.setCount( nav.index, keeper.total, hold, options.countText );
					tr.action = true;
					setTimeout(function() { tr.action = false; }, options.speed);
					options.onSet(hold.s, keeper.e_ar, nav.index, keeper.total);
				};
				keeper.nslider_prev = function(event) {
					if (event) clearInterval(timer);
					if(!tr.action && (options.loop || tr.prev)) {
						nav.index--;
						if(nav.index < 0) nav.index = keeper.total-1;
						nav.exindex = functions.animateSlider( keeper.e_ar, nav.index, nav.exindex, options );
						keeper.set();
					};
				};
				keeper.nslider_next = function(event) {
					if (event) clearInterval(timer);
					if(!tr.action && (options.loop || tr.next)) {
						nav.index++;
						if(nav.index >= keeper.total) nav.index = 0;
						nav.exindex = functions.animateSlider( keeper.e_ar, nav.index, nav.exindex, options );
						keeper.set();
					};
				};
				keeper.nslider_point = function(event) {
					if (event) clearInterval(timer);
					nav.index = parseInt( $(this).attr('rel') );
					if(!tr.action && nav.index != nav.exindex) {
						if($(this).closest('div').hasClass('t-inner')) {
							$('.nslider-point.t-outer .f-column').eq( $(this).attr('rel')).children('a').first().trigger("click");
						}
						nav.exindex = functions.animateSlider( keeper.e_ar, nav.index, nav.exindex, options );
						keeper.set();
					};
				};
				keeper.destroy = function() {
					hold.s.before( keeper.e );
					keeper.e_ar.removeAttr('style');

					if(options.point) hold.s_point.remove();
					if(options.nav) hold.s_nav.remove();
					hold.s.remove();
				};

				// start ******************************

				hold.s_nav_p
					.bind('click', keeper.nslider_prev);
				hold.s_nav_n
					.bind('click', keeper.nslider_next);

				keeper.e.before( hold.s );
				hold.s_holder.append( keeper.e );

				keeper.init();

				hold.s_point_ar
					.bind('click', keeper.nslider_point);

				functions.loadImage( keeper.e_ar, options, function(mh) {
					options.onLoad(hold.s, keeper.e_ar, hold.s_nav_p, hold.s_nav_n, hold.s_point, hold.s_point_ar, mh, nav.index);
				});

				// end ********************************

			});

			return this;

		},
		destroy : function() {
			var selector = this.selector.replace(/[#]+/g, '1_').replace(/[\.]+/g, '2_').replace(/[^a-z0-9_]+/ig, '').slice(0,50),
				keeper;

			this.each(function(i) {
				keeper = $.fn.nslider.keeper[selector+'--'+i];
				keeper.destroy();
				$.fn.nslider.keeper[selector+'--'+i] = keeper = {};
			});
		}

	};

	$.fn.nslider.functions = {
		loadImage : function(e_ar, options, func) {
			var loaded = e_ar.length,
				mh = 0;
			e_ar.each(function(i, v) {
				var el = $(this),
					img = el.find('img'),
					img_w = img.data('width'),
					img_h = img.data('height');

				if(!img.length) {

					mh = mh < el.outerHeight() ? el.outerHeight() : mh;
					loaded--;
					if(!loaded) func(mh);

				} else {

					if(typeof img_w == 'Number' && typeof img_h == 'Number') {
						if(img_w > img_h) el.addClass('horizontal');
						else el.addClass('vertical');
						mh = mh < el.outerHeight() ? el.outerHeight() : mh;
						loaded--;
						if(!loaded) func(mh);
					} else {
						var temp = new Image();
						$(temp).load(function() {
							img_w = temp.naturalWidth,
							img_h = temp.naturalHeight;
							if(img_w > img_h) el.addClass('horizontal');
							else el.addClass('vertical');
							mh = mh < el.outerHeight() ? el.outerHeight() : mh;
							loaded--;
							if(!loaded) func(mh);
						});
						temp.src = img.attr('src');
					};

				};
			});
		},
		setSlider : function(e_ar, hold, options) {
			var html = '',
				tmpl = '';
			for(var i=0; i<e_ar.length; i++) {
				if (e_ar[i].hasAttribute('data-nslider-preview')) tmpl = '<span class="nslider-point-preview"><img src="'+ e_ar[i].getAttribute('data-nslider-preview') +'" /></span>';
				else if (e_ar[i].hasAttribute('data-nslider-name')) tmpl = '<span class="nslider-point-name">'+ e_ar[i].getAttribute('data-nslider-name') +'</span>';
				else tmpl = i+1;
				html += '<a class="nslider-point-item" href="javascript:void(0);" rel="'+i+'">'+ tmpl +'</a>';
			};

			hold.s_point.empty().html( html );

			hold.s_point_ar = hold.s_point.children();

			hold.s_holder.css({ 'position' : 'relative' });
			e_ar.css({ 'position' : 'absolute', 'top' : 0, 'width' : '100%', 'display' : 'none' });
			$(e_ar[options.current]).css({ 'position' : 'relative', 'display' : 'block' });

			return hold;
		},
		animateSlider : function(e_ar, index, exindex, options) {
			var dir = (index > exindex) ? 1 : -1;

			switch(options.animation) {
				case 1:
					$( e_ar[index] )
						.css({ 'position' : 'relative', 'top': 50*dir, 'opacity' : 0, 'display' : 'block', 'z-index' : 1 })
						.stop(true, true)
						.animate({
							opacity : 1,
							top: 0
						}, options.speed, function() {
							$(this).css({ 'opacity' : '', 'z-index' : '' });
						});
					$( e_ar[exindex] )
						.css({ 'position' : 'absolute' })
						.stop(true, true)
						.animate({
							opacity : 0,
							top: -50*dir
						}, options.speed, function() {
							$(this).css({ 'top' : '', 'opacity' : '', 'display' : 'none' });
						});
					break;
				case 2:
					$( e_ar[index] )
						.css({ 'position' : 'relative', 'left': 50*dir, 'opacity' : 0, 'display' : 'block', 'z-index' : 1 })
						.stop(true, true)
						.animate({
							opacity : 1,
							left: 0
						}, options.speed, function() {
							$(this).css({ 'opacity' : '', 'z-index' : '' });
						});
					$( e_ar[exindex] )
						.css({ 'position' : 'absolute' })
						.stop(true, true)
						.animate({
							opacity : 0,
							left: -50*dir
						}, options.speed, function() {
							$(this).css({ 'left' : '', 'opacity' : '', 'display' : 'none' });
						});
					break;
				case 3:
					$( e_ar[index] )
						.css({ 'position' : 'relative', 'opacity' : 0, 'display' : 'block', 'z-index' : 1 })
						.stop(true, true)
						.animate({
							opacity : 1
						}, options.speed, function() {
							$(this).css({ 'opacity' : '', 'z-index' : '' });
						});
					$( e_ar[exindex] )
						.css({ 'position' : 'absolute' })
						.stop(true, true)
						.animate({
							opacity : 0
						}, options.speed, function() {
							$(this).css({ 'opacity' : '', 'display' : 'none' });
						});
					break;
				case 4:
					$( e_ar[index] )
						.css({ 'position' : 'relative', 'opacity' : 0, 'display' : 'block', 'z-index' : 2 })
						.addClass( dir>0 ? 'f-sliderinright' : 'f-sliderinleft')
						.stop(true, true)
						.animate({
							opacity : 1
						}, options.speed, function() {
							$(this).css({ 'opacity' : '', 'z-index' : '' }).removeClass('f-sliderinright f-sliderinleft');
						});
					$( e_ar[exindex] )
						.css({ 'position' : 'absolute' })
						.addClass( 'f-sliderout')
						.stop(true, true)
						.animate({
							opacity : 0
						}, options.speed, function() {
							$(this).css({ 'opacity' : '', 'display' : 'none' }).removeClass('f-sliderout');
						});
					break;
					case 5:
					$( e_ar[index] )
						.css({ 'position' : 'relative', 'left': 900*dir, 'display' : 'block', 'z-index' : 1 })
						.stop(true, true)
						.animate({
							opacity : 1,
							left: 0
						}, options.speed, function() {
							$(this).css({ 'opacity' : '', 'z-index' : '' });
						});
					$( e_ar[exindex] )
						.css({ 'position' : 'absolute', 'display': 'block' })
						.stop(true, true)
						.animate({
							opacity : 0,
							left: -900*dir
						}, options.speed, function() {
							$(this).css({ 'left' : '', 'opacity' : '', 'display' : 'none' });
						});
					break;
			};

			return index;
		},
		setNavigation : function(index, exindex, total, hold) {
			var tr = {
					prev : (index) ? true : false,
					next : (index != (total-1)) ? true : false
				};

			hold.s_nav_p.removeClass('disabled').addClass( (tr.prev) ? '' : 'disabled' );
			hold.s_nav_n.removeClass('disabled').addClass( (tr.next) ? '' : 'disabled' );

			return tr;
		},
		setPoint : function(index, hold, options) {
			hold.s_point_ar.removeClass('active');
			$( hold.s_point_ar[index] ).addClass('active');
		},
		setCount : function(index, total, hold, text) {
			hold.s_count.html( text.replace('{current}', (index+1)).replace('{total}', total) );
		}
	};

	$.fn.nslider.options = {
		point: null,
		nav: null,
		sliderClass: '',
		pointClass: '',
		navClass: '',
		speed: 200,
		loop: false,
		animation: 3, //1-top, 2-left, 3-fade
		current: 0,
		autoplay: false,
		autoplaySpeed: 2000,
		countText: '<b>{current}</b> / <b>{total}</b>',
		onLoad: function() {},
		onSet: function() {}
	};

	$.fn.nslider.keeper = {};

})(jQuery);


(function($){

	$.fn.oldslider = function( method ) {
		if ( $.fn.oldslider.methods[ method ] ) {
		  return $.fn.oldslider.methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
		  return $.fn.oldslider.methods.init.apply( this, arguments );
		} else {
		  $.error( 'Method ' +  method + ' does not exist' );
		}
	};

	$.fn.oldslider.methods = {

		init : function( options ) {

			options = $.extend( {}, $.fn.oldslider.options, options );
			var func = $.fn.oldslider.func;

			return this.each(function() {

			// start ******************************

				// action start

				$(this).children().wrapAll('<div class="' + options.container + '"></div>');
				$(this).append('<div class="nslider-title ' + options.title + '"></div>');
				if(options.holderNav) options.holderNav.append('<div class="nslider-nav ' + options.nav + '"><a href="#" class="' + options.prev + '">Назад</a><a href="#" class="' + options.next + '">Дальше</a></div>'); else $(this).append('<div class="nslider-nav ' + options.nav + '"><a href="#" class="' + options.prev + '">Назад</a><a href="#" class="' + options.next + '">Дальше</a></div>');
				if(options.holderPoint) options.holderPoint.append('<div class="nslider-point ' + options.point + '"></div>'); else $(this).append('<div class="nslider-point ' + options.point + '"></div>');

				var e = $(this),
					c = e.find('.' + options.container),
					ar = c.children(),
					prev = (options.holderNav) ? options.holderNav.find('.' + options.prev) : e.find('.' + options.prev),
					next = (options.holderNav) ? options.holderNav.find('.' + options.next) : e.find('.' + options.next),
					nav = (options.holderNav) ? options.holderNav.find('.nslider-nav') : e.find('.nslider-nav'),
					title = e.find('.nslider-title'),
					point = (options.holderPoint) ? options.holderPoint.find('.nslider-point') : e.find('.nslider-point'),
					pa = point.children('a'),
					count = e.find('.nslider-count'),
					total = ar.length,
					prop = {},
					add,
					interval_auto,
					nslider_mousedown, nslider_mousemove, nslider_mouseup;

				if(options.count > 1) {
					for( var i=0; i<total; i+=options.count ) {
						ar.slice( i, i+options.count).wrapAll('<div class="'+ options.holder +'"></div>' );
					};
					var n = total%options.count;
					if(n) {
						add = ar.slice(total-options.count, total-n).clone(true);
					};
					ar = c.children(),
					total = ar.length;
					ar.last().prepend(add);
				};
				if(total < 2) {
					func.title(ar, title, 0);
					ar.unwrap().removeAttr('style');
					if(options.count > 1) {
						ar.children().unwrap();
					};
					nav.remove();
					point.remove();
					if(add) add.remove();
					return false;
				};

				func.preload(ar, point, total, init);

				function init(h) {
					prop.exindex = -1,
					prop.index = 0,
					prop.nav = {
						'prev' : false,
						'next' : true
					},
					prop.c_width = c.width(),
					prop.c_height = h,
					pa = point.children('a');
					ar.first().css({ 'position' : 'relative' }).siblings().css({ 'position' : 'absolute', 'display' : 'none' });
					c.css({ 'position' : 'relative'/*, 'overflow' : 'hidden', 'width' : prop.c_width, 'height' : prop.c_height*/ });
					ar.css({ 'top' : 0, 'left' : 0, 'width' : '100%' });

					func.navigation(prev, next, prop.nav, pa, prop.index);
					func.count(count, prop.index+1, total);
					func.title(ar, title, prop.index);
					if(options.autoplay) autoOn();
					options.onLoad(e, ar, nav, point);

					prev.click(function() {
						autoOff();
						if(!prop.locked && (options.loop || prop.nav.prev)) {
							prevS();
						};
						return false;
					})
					.bind('mouseover', function() {
						options.onNavHover(nav, $(this), prop.index, (prop.nav.prev)?$(ar[prop.index-1]):false);
					});
					next.click(function() {
						autoOff();
						if(!prop.locked && (options.loop || prop.nav.next)) {
							nextS();
						};
						return false;
					})
					.bind('mouseover', function() {
						options.onNavHover(nav, $(this), prop.index, (prop.nav.next)?$(ar[prop.index+1]):false);
					});
					pa.click(function() {
						autoOff();
						if(!prop.locked) {
							pointS( Number(($(this).attr('href')).replace('#', '')) );
						};
						return false;
					});
				};
				function lock() {
					prop.locked = true;
				};
				function unlock() {
					prop.locked = false;
					c.css( 'height', '' );
				};
				function prevS() {
					prop.exindex = prop.index,
					prop.index = prop.exindex-1,
					prop.index = (prop.index < 0) ? total-1 : prop.index,
					c.css( 'height', prop.c_height );
					func.action(ar, prop, -1, options.speed, unlock, options.animation);
					action();
				};
				function nextS() {
					prop.exindex = prop.index,
					prop.index = prop.exindex+1,
					prop.index = (prop.index >= total) ? 0 : prop.index;
					c.css( 'height', prop.c_height );
					func.action(ar, prop, 1, options.speed, unlock, options.animation);
					action();
				};
				function pointS(n) {
					prop.exindex = prop.index,
					prop.index = n;
					if(prop.exindex != prop.index) {
						if(!options.autoheight) {
							c.css( 'height', prop.c_height );
						}
						func.action(ar, prop, (prop.index>prop.exindex)?1:-1, options.speed, unlock, options.animation);
						action();
					};
				};
				function action() {
					navigation();
					func.title(ar, title, prop.index);
					func.navigation(prev, next, prop.nav, pa, prop.index);
					func.count(count, prop.index+1, total);
					lock();
					options.onSet(e, ar, nav, point, prop.index, total);
				};
				function navigation() {
					prop.nav.prev = (prop.index == 0) ? false : true;
					prop.nav.next = (prop.index == (total-1)) ? false : true;
				};
				function autoOn() {
					autoOff();
					interval_auto = setInterval(function() {
						nextS();
					}, options.autoplaySpeed);
				};
				function autoOff() {
					clearInterval(interval_auto);
				};
				// action end

				// api start
				e
					.bind('destroy', function() {
						$(document).unbind('mousemove', nslider_mousemove).unbind('mouseup', nslider_mouseup);
						e.unbind('destroy');
						ar.unwrap().removeAttr('style');
						if(options.count > 1) {
							ar.children().unwrap();
						};
						nav.remove();
						point.remove();
						if(add) add.remove();
					});
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

	$.fn.oldslider.func = {

		preload : function(ar, point, loaded, func) {
			var h = 0, html = '';
			ar.each(function(i, v) {
				var e = $(this),
					img = e.find('img');
				html += '<a href="#'+i+'">'+(i+1)+'</a>'
				if(img.length) {
					var temp = new Image();
					$(temp).load(function() {
						loaded -= 1;
						h = (e.height() > h) ? e.height() : h;
						if(!loaded) {
							point.append(html);
							func(h);
						};
					});
					temp.src = img.attr('src');
				} else {
					loaded -= 1;
					h = (e.height() > h) ? e.height() : h;
					if(!loaded) {
						point.append(html);
						func(h);
					};
				};
			});
		},
		action : function(ar, prop, dir, speed, func, a) {
			switch(a) {
				case 1:
					$(ar[prop.exindex]).css({ 'position' : 'absolute', 'z-index' : '' }).stop(true).animate({
						opacity : 0,
						top: 30*dir*(-1)
					}, speed, function() {
						$(this).css({ 'top' : '', 'opacity' : '', 'display' : 'none' });
						func();
					});
					$(ar[prop.index]).css({ 'position' : 'relative', 'top': 30*dir, 'opacity' : 0, 'display' : 'block', 'z-index' : 1 }).stop(true).animate({
						opacity : 1,
						top: 0
					}, speed, function() {
						$(this).css({ 'opacity' : '', 'z-index' : '' });
					});
					break;
				case 2:
					$(ar[prop.exindex]).css({ 'position' : 'absolute', 'z-index' : '' }).stop(true).animate({
						opacity : 0,
						left: 50*dir*(-1)
					}, speed, function() {
						$(this).css({ 'left' : '', 'opacity' : '', 'display' : 'none' });
						func();
					});
					$(ar[prop.index]).css({ 'position' : 'relative', 'left': 50*dir, 'opacity' : 0, 'display' : 'block', 'z-index' : 1 }).stop(true).animate({
						opacity : 1,
						left: 0
					}, speed, function() {
						$(this).css({ 'opacity' : '', 'z-index' : '' });
					});
					break;
				case 3:
					$(ar[prop.exindex]).css({ 'position' : 'absolute', 'z-index' : '' }).stop(true).animate({
						opacity : 0
					}, speed, function() {
						$(this).css({ 'opacity' : '', 'display' : 'none' });
						func();
					});
					$(ar[prop.index]).css({ 'position' : 'relative', 'opacity' : 0, 'display' : 'block', 'z-index' : 1 }).stop(true).animate({
						opacity : 1
					}, speed, function() {
						$(this).css({ 'opacity' : '', 'z-index' : '' });
					});
					break;
				case 4:
					$(ar[prop.exindex]).css({ 'position' : 'absolute', 'z-index' : '' }).stop(true).animate({
						opacity : 0.6,
						left: 50*dir*(+1)
					}, speed, function() {
						$(this).css({ 'opacity' : '', 'display' : 'block' });
						func();
					});
					$(ar[prop.index]).css({ 'position' : 'relative', 'opacity' : 0, 'display' : 'block', 'z-index' : 1 }).stop(true).animate({
						opacity : 1,
						left: 0
					}, speed, function() {
						$(this).css({ 'opacity' : '', 'z-index' : '' });
					});
					break;
				case 5:
					$(ar[prop.exindex]).css({ 'position' : 'absolute', 'z-index' : '' }).stop(true).animate({
						opacity : 1,
						left: 425*dir*(-1)
					}, speed, function() {
						$(this).css({ 'left' : '', 'opacity' : '1', 'display' : 'none' });
						func();
					});
					$(ar[prop.index]).css({ 'position' : 'relative', 'left': 425*dir, 'opacity' : 1, 'display' : 'block', 'z-index' : 1 }).stop(true).animate({
						opacity : 1,
						left: 0
					}, speed, function() {
						$(this).css({ 'opacity' : '', 'z-index' : '' });
					});
					break;
			};
		},
		navigation : function(prev, next, nav, pa, index) {
			if(nav.prev) prev.removeClass('disabled');
			else prev.addClass('disabled');
			if(nav.next) next.removeClass('disabled');
			else next.addClass('disabled');
			pa.removeClass('active');
			$(pa[index]).addClass('active');
		},
		count : function(count, index, total) {
			count.html(index+'<span>/</span>'+total);
		},
		title : function(ar, title, index) {
			var t = $(ar[index]).attr('title');
			title.text( t ? t : '' );
		}

	};

	$.fn.oldslider.options = {
		container: 'nslider-container',
		holder: 'nslider-holder',
		prev: 'nslider-nav-prev',
		next: 'nslider-nav-next',
		point: '',
		nav: '',
		scroll: '',
		autoheight: 'true',
		title: '',
		speed: 300,
		loop: false,
		holderPoint: null,
		holderNav: null,
		animation: 1,
		count: 1,
		autoplay: false,
		autoplaySpeed: 4000,
		onNavHover: function() {},
		onLoad: function() {},
		onSet: function() {}
	};
})(jQuery);
