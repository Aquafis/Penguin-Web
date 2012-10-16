var penguin = {
	
	// Functions to handle all Penguin app events
	Events: {	
	
		// EVENT - Hover on a main menu element [ STYLE & BEHAVIOR ]
		e_hoverOnMainMenuElement: function (e) {
			var elem = $(this);

			if (!elem.data('active')) {
				elem.css({
					'border-left'	: '8px solid white',
					'cursor'		: 'pointer'
				});
			}
		},

		// EVENT - Hover off a main menu element [ STYLE & BEHAVIOR ]
		e_hoverOffMainMenuElement: function (e) {
			var elem = $(this);
			
			if (!elem.data('active')) {
				elem.css({
					'border-left'	: 'none',
					'cursor'		: 'default'
				});
			}
		},


		// EVENT - Hover on a sub menu element [ STYLE & BEHAVIOR ]
		e_hoverOnSubMenuElement: function (e) {
			var elem = $(this);

			if (!elem.data('active')) {
				elem.addClass('submenuhover');
			}
		},

		// EVENT - Hover off a sub menu element [ STYLE & BEHAVIOR ]
		e_hoverOffSubMenuElement: function (e) {
			var elem = $(this);

			if (!elem.data('active')) {
				elem.removeClass('submenuhover');
			}
		},

		// EVENT - Click on a main menu element [ STYLE & BEHAVIOR ]
		e_clickOnMainMenuElement: function (e) {
			// Let's fetch the dom uno
			var elem = $(this),
				self = true;		// Used to see if we've re-clicked

			// Turn off any other active siblings
			$.each(elem.siblings(), function (elem) {
				var elem = $(this);

				// Found the other active sibling, turn it off
				if (elem.data('active')) {
					elem.data('active', false);
					elem.children('.triangle').toggleClass('hidden');
					elem.css({
						'background'	: 'none',
						'box-shadow'	: 'none',
						'color'			: 'white'
					});

					self = false;
				}
			});
			
			// Now that we've looped through siblings, let's make sure we didn't
			// click on ourself. If so, jump out of the entire event chain. This
			// event should fire FIRST in the bubble.
			if (self && elem.data('active')) {
				e.stopImmediatePropagation();
				return false;
			}

			// Toggle the active flag
			elem.data('active', !elem.data('active'));

			// Active CSS
			if (elem.data('active')) {
				elem.css({
					'background'	: 'white',
					'border-left'	: 'none',
					'box-shadow'	: '-6px 2px 19px -2px #333',
					'color'			: '#333' //TODO make color dynamic
				});
				elem.children('.triangle').toggleClass('hidden');

			} else {
				elem.css({
					'background'	: 'none',
					'box-shadow'	: 'none',
					'color'			: 'white'
				});
				elem.children('.triangle').toggleClass('hidden');
			}
			
		},

		// EVENT - Click on a sub menu element [ STYLE & BEHAVIOR ]
		e_clickOnSubMenuElement: function (e) {
			var elem = $(this),
				self = true;

			// Disable any other active sibling
			$.each(elem.siblings(), function () {
				var elem = $(this);

				// Found active sibling, banish it back to default status
				if (elem.data('active')) {
					elem.data('active', false);
					elem.removeClass('submenuactive');

					self = false;
				}
			});

			// Now that we've looped through siblings, let's make sure we didn't
			// click on ourself. If so, jump out of the entire Event. This should run
			// first in the entire Event bubble.
			if (self && elem.data('active')) {
				e.stopImmediatePropagation();
				return false;
			}

			// Toggle the active flag
			elem.data('active', !elem.data('active'));

			// Active CSS
			if (elem.data('active')) {
				elem.addClass('submenuactive');
				elem.removeClass('submenuhover');
			} else {
				elem.removeClass('submenuactive');
			}
		},
	
		// EVENT - Click on a main menu element and change the slate
		e_clickOnMainMenuElement_slateChange: function (id) {
			var elem		= $(this),
				currSlate	= $('#content').children(':visible'),
				newSlate	= null;

			switch (id) {
				case 'penguin':
					newSlate = $('#content-penguin');	
					break;
				case 'students':
					newSlate = $('#content-students');	
					break;
				case 'faculty':
					newSlate = $('#content-faculty');	
					break;
				case 'clubs':
					newSlate = $('#content-clubs');	
					break;
				case 'blog':
					newSlate = $('#content-blog');	
					break;
				default:
					break;
			}

			penguin._slateHide(currSlate, function() {
				penguin._slateShow(newSlate);
			});
		}
	
	},
	

	// Bind all penguin events to DOM
	_initEvents: function () {
		var self = this;

		/* GENERIC MENU EVENT BINDINGS */
			// EVENT BIND - Main Menu element hover [ STYLE & BEHAVIOR ]
			$('.menuitem').hover(
				self.Events.e_hoverOnMainMenuElement,
				self.Events.e_hoverOffMainMenuElement
			);

			// EVENT BIND - Sub Menu element hover [ STYLE & BEHAVIOR ]
			$('.submenuitem').hover(
				self.Events.e_hoverOnSubMenuElement,
				self.Events.e_hoverOffSubMenuElement
			);

			// EVENT BIND - Menu element click [ STYLE & BEHAVIOR ]
			$('.menuitem').click(self.Events.e_clickOnMainMenuElement);

			// EVENT BIND - Sub menu click [ STYLE & BEHAVIOR ]
			$('.submenuitem').click(self.Events.e_clickOnSubMenuElement);
		/* ----- END GENERIC
		
		/* SPECIFIC MENU EVENT BINDINGS */
			// EVENT BIND - Penguin Main Menu item click
			$('#sidebar-menu-penguin').click(function () {
				self.Events.e_clickOnMainMenuElement_slateChange('penguin');
			});
			// EVENT BIND - Students Main Menu item click
			$('#sidebar-menu-students').click(function () {
				self.Events.e_clickOnMainMenuElement_slateChange('students');
			});
			// EVENT BIND - Faculty Main Menu item click
			$('#sidebar-menu-faculty').click(function () {
				self.Events.e_clickOnMainMenuElement_slateChange('faculty');
			});
			// EVENT BIND - Clubs Main Menu item click
			$('#sidebar-menu-clubs').click(function () {
				self.Events.e_clickOnMainMenuElement_slateChange('clubs');
			});
			// EVENT BIND - Blog Main Menu blog click
			$('#sidebar-menu-blog').click(function () {
				self.Events.e_clickOnMainMenuElement_slateChange('blog');
			});
	},

	Init: function () {
		var self = this;
		
		// Create function bindings for all events
		this._initEvents();

		/* MENU RELATED */

		// Set the first item in the main menu as the default
		/*$('#sidebar-menu').children(':first').data('active', true)
			.addClass('menuitemactive').children('.triangle').toggleClass('hidden');*/

	},

	_slateHide: function (elem, callback) {
		// Check and see element 

		elem = (elem instanceof jQuery) ? elem : jQuery(elem);
		elem.animate({'margin-left': '100%'}, 400, function () {
			elem.addClass('hidden');
			callback();
		});

		return;
	},

	_slateShow: function (elem, callback) {
		elem = (elem instanceof jQuery) ? elem : jQuery(elem);
		elem.removeClass('hidden').animate({'margin-left': '0'}, 400, callback);
		return;
	}
}
