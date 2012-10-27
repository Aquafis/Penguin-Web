/**
 * Papercake.normalWidget();
 * 
 * Creates a basic, metallic, styled widget for the papercake site. 
 * 
 * You will need the widget.css file, jQuery, and jQuery UI linked to the
 * page, or at least the controller/master file calling the page somewhere in
 * the call chain.
 *
 * normalWidget needs a basic markup to function. First create a
 * container for the element (preferably a <div>), and then invoke
 * normalWidget() on the selector.
 *
 * -> Inside the container, specify an <h1> for the main header, an <h2> for
 *  the subheader (optional, will be ignored if not flagged. More on this
 *  later), a <div> for the content of the widget, and lastly a <div> for the
 *  footer (also optional).
 *
 * Options: defaults
 *			centerHeader: false
 *			draggable: false*
 *			footer: false
 *			height: 300 (px)
 *			subHeader: false
 *			width: 450 (px)
 *			xScroll: false
 *			yScroll: false
 *		
 *		*To grab, use the header of the widget.
 * -> Options and flags work similar to jQuery UI widget calls.
 *  Ex: $('#selector').normalWidget({centerHeader: true});
 *  Ex (getter): $('selector').normalWidget('option', 'centerHeader');
 *  Ex (setter): $('selector').normalWidget('option', 'centerHeader', true);
 *
 */
(function($){
	$.widget("Papercake.normalWidget", $.ui.mouse, {
		/* Major Selectors */
		content   : null,//$('div:eq(0)', this.element),
		footer    : null,//$('div:eq(1)', this.element),
		header	  : null,//$('h1:eq(0)', this.element),
		subHeader : null,//$('h2:eq(0)', this.element),

		/* Options */
		options: {
			centerHeader: false,
			draggable: false,
			footer: false,
			height: '300px',
			notify: 0,
			show: function(){},
			subHeader: false,
			width: '450px',
			xScroll: false,
			yScroll: false
		},

		_create: function() {
			/* Set Properties */
			this.content   = $('div:eq(0)', this.element);
			this.footer    = $('div:eq(1)', this.element);
			this.header	   = $('h1:eq(0)', this.element);
			this.subHeader = $('h2:eq(0)', this.element);

			/* Assign Children respective class styles */

			// Widget container
			this.element.css({
				'width': this.options.width,
				'height': this.options.height
			}).addClass('widget');

			// Header
			this.header.addClass('widgetHeader').css('height', '35px');

			// Subheader + notifications
			if (this.options.centerHeader && this.options.subHeader) {
				this.subHeader.addClass('widgetSubHeader');
				if (this.options.notify > 0) {
					notify = $('<span>'+this.options.notify+'</span>');
					notify.addClass('widgetNotification');
					this.subHeader.append(notify);
				}
			}
			else
				this.subHeader.hide(); //Even if present in markup, hide

			// Footer)
			if (this.options.footer)
				this.footer.addClass('widgetFooter');
			else
				this.footer.hide(); //Even if present in markup, hide.

			// Content
			this.content.addClass('widgetContent');
			this._resizeContent();
		},

		_init: function() {
			// Change header position
			if (this.options.centerHeader)
				this.header.css('text-align', 'center');

			// Enable dragging
			if (this.options.draggable)
				this.element.draggable({ handle: this.header });

			// Enable horizontal scrolling
			if(this.options.xScroll)
				this.content.css('overflow-x', 'auto');

			// Enable vertical scrolling
			if(this.options.yScroll)
				this.content.css('overflow-y', 'auto');

			// Register the callback
			$(this.header).on('click', this.options.show);
		},

		_setOption: function(key, value) {
			switch (key) {
				case 'centerHeader':
					if (value)
						this.header.css('text-align', 'center');
					else
						this.header.css('text-align', 'left');
					break;
				case 'draggable':
					if (value)
						this.element.draggable({disabled: false, hande: this.header});
					else
						this.element.draggable({disabled: true});
					break;
				case 'footer':
					if (value)
						this.footer.addClass('widgetFooter').show();
					else 
						this.footer.hide();
					this._resizeContent();
					break;
				case 'height':
					this.element.css('height', value);
					this._resizeContent();
					break;
				case 'show':
					this.options.show = value;
					break;
				case 'subHeader':
					if (value && this.options.centerHeader) {
						this.subHeader.show();
					}
					else
						this.subHeader.hide();
					break;
				case 'notify':
					if (value > 0 && this.options.centerHeader 
							&& this.options.subHeader) {
						$('.widgetNotification', this.subHeader).remove();
						notify = $('<span>'+value+'</span>');
						notify.addClass('widgetNotification');
						$(this.subHeader).append(notify);
					}
					else
						$('.widgetNotification', this.options.subHeader).remove();
					break;
				case 'width':
					this.element.css('width', value);
					break;
				case 'xScroll':
					if (value)
						this.content.css('overflow-x', true);
					else
						this.content.css('overflow-x', false);
					break;
				case 'yScroll':
					if (value)
						this.content.css('overflow-y', true);
					else
						this.content.css('overflow-y', false);
					break;
			}
			$.Widget.prototype._setOption.apply(this, arguments);
		},

		// Content height is liquid, resizing is often needed
		_resizeContent: function(){
			this.content.css('height', function(self){
				var totHeight = self.element.outerHeight() - self.header.outerHeight();
				if (self.options.footer)
					totHeight = totHeight - self.footer.outerHeight();
				return totHeight - (self.content.outerHeight() - self.content.height());
			}(this));
		},
		destroy: function(){
			$.Widget.prototype.destroy.call( this )
		}
	});
}(jQuery));


(function($) {
	$.widget('Papercake.tableWidget', $.ui.mouse, {
		/* Major selectors */
		content		: null,
		header		: null,
		subHeader	: null,
		table		: null,

		options: {
			callBack: function(){},
			centerHeader: false,
			draggble: false,
			height: '300px',
			show: function() {},
			subHeader: false,
			width: '450px',
			xScroll: false,
			yScroll: false
		},

		_create: function() {
			/* Set properties */	
			this.content	= $('div:eq(0)', this.element);
			this.header		= $('h1:eq(0)', this.element);
			this.subHeader	= $('h2:eq(0)', this.element);
			this.table		= $('table:eq(0)', this.content);

			/* Assign Children respective class styles */

				// Widget container
				this.element.css({
					'width': this.options.width,
					'height': this.options.height
				}).addClass('widget');

				// Header
				this.header.addClass('widgetHeader');

				// Subheader
				this.subHeader.addClass('widgetSubHeader');

				// Content
				this.content.addClass('tableWidgetContent');
				this._resizeContent();

				// Table
				this.table.addClass('tableWidgetOuterTable');

				// Rows & Columns
				$('tr td:nth-child(odd)', this.table).addClass('tableWidgetOddColumn');				
		},

		_init: function() {
			// Center header text
			if (this.options.centerHeader)
				this.header.css('text-align', 'center');

			// Make widget draggable
			if (this.options.draggable)
				this.element.draggable({handle: this.header});

			// Show subheader, if the main header is centered
			if (this.options.subHeader && this.options.centerHeader) {
				this.subHeader.show();

				//Add notifications
				if (this.options.notify > 0) {
					notify = $('<span>'+this.options.notify+'</span>');
					notify.addClass('widgetNotification');
					this.subHeader.append(notify);
				}
			}
			else
				this.subHeader.hide();

			// Enable horizontal scrolling
			if(this.options.xScroll)
				this.content.css('overflow-x', 'auto');

			// Enable vertical scrolling
			if(this.options.yScroll)
				this.content.css('overflow-y', 'auto');

			// Register the callback
			$(this.header).on('click', this.options.show);
		},

		_setOption: function(key, value) {
			switch (key) {
				case 'centerHeader':
					if (value)
						this.header.css('text-align', 'center');
					else
						this.header.css('text-align', 'left');
					break;
				case 'draggable':
					if (value)
						this.element.draggable({disabled: false, hande: this.header});
					else
						this.element.draggable({disabled: true});
					break;
				case 'height':
					this.element.css('height', value);
					this._resizeContent();
					break;
				case 'subHeader':
					if (value && this.options.centerHeader) {
						this.subHeader.show();
					}
					else
						this.subHeader.hide();
					break;
				case 'notify':
					if (value > 0 && this.options.centerHeader 
							&& this.options.subHeader) {
						$('.widgetNotification', this.subHeader).remove();
						notify = $('<span>'+value+'</span>');
						notify.addClass('widgetNotification');
						$(this.subHeader).append(notify);
					}
					else
						$('.widgetNotification', this.options.subHeader).remove();
					break;
				case 'show':
					this.options.show = value;
					break;
				case 'width':
					this.element.css('width', value);
					break;
				case 'xScroll':
					if (value)
						this.content.css('overflow-x', true);
					else
						this.content.css('overflow-x', false);
					break;
				case 'yScroll':
					if (value)
						this.content.css('overflow-y', true);
					else
						this.content.css('overflow-y', false);
					break;
			}
			$.Widget.prototype._setOption.apply(this, arguments);
		},

		// Content height is liquid, resizing is often needed
		_resizeContent: function(){
			this.content.css('height', function(self){
				var totHeight = self.element.outerHeight() - self.header.outerHeight();
				if (self.options.footer)
					totHeight = totHeight - self.footer.outerHeight();
				return totHeight - (self.content.outerHeight() - self.content.height());
			}(this));
		},
		destroy: function() {
			$.Widget.prototype.destroy.call(this);
		}
	});
}(jQuery));

(function($){
	$.widget('Papercake.tabbedWidget', $.ui.mouse, {
		/* Major Selectors */
		content: null,
		footer: null,
		header: null,
		subHeader: null,
		tabs: null,

		options: {
			centerHeader: false,
			draggable: false,
			height: '300px',
			start: 0,
			width: '450px',
			xScroll: false,
			yScroll: false
		},

		_create: function() {
			// this has no global scope
			// use self for inside function scope instead of this
			var self = this;

			/* Set properties */
			this.header		= $('h1:eq(0)', this.element);
			this.subHeader	= $('h2:eq(0)', this.element);
			this.content	= $('<div></div>');
			this.tabs		= $('ul:eq(0)', this.element);
			this.footer		= $('<div></div>');
			this.divs		= [];

			// Populate a list of content divs
			$('input[name=tab]', this.tabs).each(function(idx, input){
				divId = $(input).val();
				div = $('#'+divId);
				self.divs.push(div[0]);
			});

			/* Assign Children respective class styles */
			// Widget Styling
			this.element.addClass('widget').css({
				'height': this.options.height,
				'width': this.options.width
			});	

			// Header
			this.header.addClass('widgetHeader');

			// Subheader
			this.subHeader.addClass('widgetSubHeader');


			// Footer
			this.footer.addClass('widgetFooter');
			this.element.append(this.footer);

			// Tabs ul
			this.footer.append(this.tabs[0]); //We want the tabs inside of the footer
			this.tabs.addClass('tabbedWidgetTabMenu').css('padding-bottom',
				this.footer.height() - this.tabs.height());

			// Content
			this.content.addClass('widgetContent');
			this._resizeContent();

			/* Finishing touches */

			// We want the content before the footer
			this.header.after(this.content); 

			// Append and hide all tabbed divs inside the content	
			$(this.divs).each(function(idx, div){
				$(self.content).append(div);
				$(div).hide();
			});
		},

		_init: function() {
			// this has no global scope
			// use self for inside function scope instead of this
			var self = this;

			// Center the header
			if (this.options.centerHeader)
				this.header.css('text-align', 'center');

			// Enable ubheader
			if (this.options.subHeader && this.options.centerHeader)
				this.subHeader.show();

			// Enable dragging
			if (this.options.draggable)
				this.element.draggable({handle: this.header});

			// Enable horizontal scrolling
			if(this.options.xScroll)
				this.content.css('overflow-x', 'auto');

			// Enable vertical scrolling
			if(this.options.yScroll)
				this.content.css('overflow-y', 'auto');

			// Select appropriate radio & div to match open tab
			$('div:eq('+this.options.start+')', this.content).show();
			$('li input[name=tab]:eq('+this.options.start+')', this.tabs)
				.attr('checked', true);

			/* Click events */
			$('input[name=tab]', this.tabs).unbind('click');
			$('input[name=tab]', this.tabs).bind('click', function(e){
				//Hide active div and uncheck active radio
				$(self.divs).each(function(idx, div){
					if ($(':visible', div))
						$(div).hide();
				});
				//Show the new event radio div and check the event radio
				target = $(e.target);
				divId = target.val();
				$('#'+divId).show();
				target.attr('checked', true);
			});
		},
		_setOption: function(key, value) {
			switch (key) {
				case 'centerHeader':
					if (value)
						this.header.css('text-align', 'center');
					else
						this.header.css('text-align', 'left');
					break;
				case 'draggable':
					if (value)
						this.element.draggable({disabled: false, hande: this.header});
					else
						this.element.draggable({disabled: true});
					break;
				case 'height':
					this.element.css('height', value);
					this._resizeContent();
					break;
				case 'subHeader':
					if (value && this.options.centerHeader) {
						this.subHeader.show();
					}
					else
						this.subHeader.hide();
					break;
				case 'width':
					this.element.css('width', value);
					break;
				case 'xScroll':
					if (value)
						this.content.css('overflow-x', true);
					else
						this.content.css('overflow-x', false);
					break;
				case 'yScroll':
					if (value)
						this.content.css('overflow-y', true);
					else
						this.content.css('overflow-y', false);
					break;
			}
			$.Widget.prototype._setOption.apply(this, arguments);
		},

		_resizeContent: function(){
			this.content.css('height', function(self){
				var totHeight = self.element.outerHeight() - self.header.outerHeight();
				if (self.options.footer)
					totHeight = totHeight - self.footer.outerHeight();
				return totHeight - (self.content.outerHeight() - self.content.height());
			}(this));
		},

		destroy: function(){
			$.Widget.prototype.destroy.call(this);
		}
	});
}(jQuery));

(function($){
	$.widget('Papercake.accordionWidget', $.ui.mouse, {
		options: {
			width: '450px',
			height: 'auto',
			start: [0],
			footer: false,
			xScroll: false,
			yScroll: false

		},

		_create: function() {
			var self = this;
			var header = $('h1:eq(0)', self.element);
			var divs = $('div[class=widget]', self.element);
			var content = $('<div></div>');

			/* Apply Classes */
			self.element.addClass('widget');
			header.addClass('widgetHeader');
			content.addClass('widgetContent');
		//	self.element.css('padding-left', '14px');

			/* Add elements */
			header.after(content);
			divs.each(function(key, val){
				content.append(val);
			});

			/* Extra styling */
			self.element.css({
				width: self.options.width,
				height: self.options.height
			});

			content.css('padding', '0');
			divs.each(function(idx, val){
				$(val).css('height', 'auto');
			});
		},

		_init: function() {
			var self = this;
			var divs = $('div[class=widget]', self.element);

			// Actual accordion code
			console.log(divs);
			divs.each(function(idx, val){
			//	$('.widgetHeader', val).unbind('click');
				$('.widgetHeader', val).bind('click', function(e){
					$('.widgetContent', val).slideToggle(function(){
						if (self.options.yScroll)
							$(this).css('overflow-y', 'auto');
						if (self.options.xScroll)
							$(this).css('overflow-x', 'auto');
					});
					$('.tableWidgetContent', val).slideToggle(function(){
						if (self.options.yScroll)
							$(this).css('overflow-y', 'auto');
						if (self.options.xScroll)
							$(this).css('overflow-x', 'auto');
					});
				});
			});

			// Close Set default accordion open
			$(divs).each(function(idx,div){ $('.widgetContent', div).hide();})
			for (var i = 0; i < self.options.start.length; i++)
				$('.widgetContent', divs[self.options.start[i]]).show();

			/* * * * * * * * * *
			 * * ACTUAL INIT * *
			 * * * * * * * * * */

			// Enable vertical scrolling
			if (this.options.yScroll)
				this.element.css('overflow-y', 'auto');

		},

		_setOption: function(key, value){

		},

		destroy: function(){

		}
	});
 }(jQuery));

/** todo
 * Merge all the widgets together and make one HUGE ass widget.
 *    -> Base it on a type flag, which takes a string of widget type. Brilliant!
 *
 * Figure out the precedence and needs of styles based on which flags are enabled.
 * Refactor a good chunk of it, add comments where voodoo occurs
 * Figure how-the-F to use the set option method
 * Figure how-the-F to use the destroy method
 * Create the logic/widget for accordion
 */
