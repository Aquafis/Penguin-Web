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

		// Load latest news
		self.loadLatestNews('#latest-news');

	},

	_createArticle: function (elem, callback) {
		elem = (elem instanceof jQuery) ? elem : jQuery(elem);
	},

	_slateHide: function (elem, callback) {
		// Check and see element 

		elem = (elem instanceof jQuery) ? elem : jQuery(elem);
		elem.animate({'margin-top': '100%'}, 100, function () {
			elem.addClass('hidden');
			callback();
		});

		return;
	},

	_slateShow: function (elem, callback) {
		elem = (elem instanceof jQuery) ? elem : jQuery(elem);
		elem.removeClass('hidden').animate({'margin-top': '0'}, 100, callback);
		return;
	},


	loadLatestNews: function (elem, callback) {
		var self = this;
		elem = (elem instanceof jQuery) ? elem : jQuery(elem);

		// Fetch the latest post data
		$.ajax({
			url: '/latest',
			success: function (articles) {
				var articleCollection = [],
					i = 0;

				$.each(articles.data, function(idx, article) {
					var articleRow = self._buildSmallArticleMarkup(article);
					articleRow.hide();
					elem.append(articleRow)
					
					articleCollection.push(articleRow);
				});

				// Seqentially show articles loaded
				// TODO Make sure to start with offset once paging is embeded 
				(function() {
					$(articleCollection[i++]).show('fast', arguments.callee);	
				})();

				
				// TODO Embed paging and metadata for forward requests
				if (callback) {
					callback(data);
				}
			}
		});
	},

	_buildSmallArticleMarkup: function (article) {
		// Construct DOM elements / parse date

		var articleRow = $('<tr></tr>'),
			articleHeader = $('<td></td>'),
			articleTease = $('<td></td>'),
			articleMeta = $('<td></td>'),
			date = this._mysqlTimeStampToDate(article.CREATED);

		// Fill in CSS & Content for the article and article children
			articleRow.addClass('article');
			articleRow.attr('title', article.TITLE);

			articleHeader.addClass('article-header');
			if (article.TITLE.length > 20) {
				articleHeader.html(article.TITLE.substr(0, 20) + '...');
			} else {
				articleHeader.html(article.TITLE);
			}

			articleTease.addClass('article-teaser');
			if (article.BLURB.length > 25) {
				articleTease.html(article.BLURB.substr(0, 25) + '...');
			} else {
				articleTease.html(article.BLURB);
			}

			articleMeta.addClass('article-meta');
			articleMeta.html('<p>'+article.AUTHOR_ID+'</p><p>'+date.toDateString()+'</p>');

		// Embed article object into the article row
		articleRow.data('data', article);
	
		// Attach children to article row
		articleRow.append(articleHeader);
		articleRow.append(articleTease);
		articleRow.append(articleMeta);

		return articleRow;
	},

	_mysqlTimeStampToDate: function (timestamp) {
		//function parses mysql datetime string and returns javascript Date object
		//input has to be in this format: 2007-06-05 15:26:02
		timestamp = timestamp.replace(/[T]/g, ' ');
		timestamp = timestamp.replace(/(\.\d+Z)/, '');    
		var regex=
			/^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9]) (?:([0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/;
		var parts=timestamp.replace(regex,"$1 $2 $3 $4 $5 $6").split(' ');
		return new Date(parts[0],parts[1]-1,parts[2],parts[3],parts[4],parts[5]);
  }
}
