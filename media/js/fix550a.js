//HTML5 support
(function () {
	if(!/*@cc_on!@*/0) return;
	var e = 'abbr,article,aside,audio,bb,canvas,datagrid,datalist,details,dialog,eventsource,figure,footer,header,hgroup,mark,menu,meter,nav,output,progress,section,time,video'.split(',');
	var i = e.length;
	while(i--) {
		document.createElement(e[i]);
	};
})();
