var penguin = {//

	Resize: {

		// TODO RESIZE REGISTER FUNCTIONS
		// Post Modal Content
		// management modal
		// All post-containers will need to re-compute default pagination count
		//		based on element height to parent floor
		// 
		register: [],
		all: function () {

		},

		priority: function (min, max) {

		}
	},

	Post: {
		postViewOpen: false,
		postViewMini: false,
		postLoading: true,
		loadedPosts: [],

		// Load / Open post view
		loadPost: function (postData) {
			var self = penguin;

			if (!self.Post.postViewOpen) {
				self.Events.e_showPostModal();
			} else if (self.Post.postViewMini) {
				self.Events.e_maximizePostModal();
			}

			// TODO Implement caching
			$('#modal-post-content').empty();
			// ajaxElement('#modal-post-container');
			self._createArticle(postData);
			// unAjaxElement('#modal-post-container');
		}
	},

	Resize: {
		register: []
	},

	// Functions to handle all Penguin app events
	Events: {	

		/* APP MAIN AND SUBMENU EVENTS */
	
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
		},
		
		// EVENT - Click on a submenu element and change slate
		e_clickOnSubMenuElement_slateChange: function(elem, id) {
			var idx		= $(elem).index(),
				toHide	= null,
				toShow	= null;
			
			switch (id) {
				case 'penguin':
					toHide = $('#content-penguin').children(':visible').not('.submenu');
					toShow = $('#content-penguin').children()[idx];
					break;
				case 'students':
					toHide = $('#content-students').children(':visible').not('.submenu');
					toShow = $('#content-students').children()[idx];
					break;
				case 'faculty':
					toHide = $('#content-faculty').children(':visible').not('.submenu');
					toShow = $('#content-faculty').children()[idx];
					break;
				case 'clubs':
					toHide = $('#content-clubs').children(':visible').not('.submenu');
					toShow = $('#content-clubs').children()[idx];
					break;
				case 'blog':
					toHide = $('#content-blog').children(':visible').not('.submenu');
					toShow = $('#content-blog').children()[idx];
					break;
				default:
					break;
			}

			$(toHide).hide();
			$(toShow).show();
		},
	
		/* POST MODAL EVENTS */
		
		// EVENT - Show the post-viewer modal (shows from left)
		e_showPostModal: function (e) {
			$('#modal-post-container').removeClass('hidden');
			$('#modal-post-container').show('slide', {direction: 'left'}, 200);	
			penguin.Post.postViewOpen = true;
		},

		// EVENT - Hide the post-viewer modal (hides to left)
		e_hidePostModal: function (e) {
			$('#modal-post-container').hide('slide', {direction: 'left'}, 200);	
			penguin.Post.postViewOpen = false;
		},

		// EVENT - Minimize the post-view modal (Hides mostly to left)
		e_minimizePostModal: function (e) {
			$('#modal-post-container').animate({left: -550});
			penguin.Post.postViewMini = true;
		},

		// EVENT - Restore the post-view modal to it's full viewable width
		e_maximizePostModal: function (e) {
			$('#modal-post-container').animate({left: 0});
			penguin.Post.postViewMini = false;
		},

		/* FORM & INPUT EVENTS */

		// EVENT - Keyup on a username input field
		e_validateUser: function (e) {
			var elem = $(this),
				btn	 = $('#penguin-form').find('button'),
				user = '/images/hero_cosmic.png',
				chk  = '/images/tickbox.png',
				warn = '/images/warning.png';


			if (elem.val() == '') {
				elem.css('background', 'url('+user+')');
				if (btn.data('active')) {
					penguin._toggleButton(btn);
				}
			}
			else if (!penguin._checkUser(elem.val())) {
				elem.css('background', 'url('+warn+')');
				if (btn.data('active')) {
					penguin._toggleButton(btn);
				}
			}
			else {
				elem.css('background', 'url('+chk+')');
				/*if (!btn.data('active')){
					penguin._toggleButton(btn);
				}*/
			}
		},

		// EVENT - Keyup on a password input field
		e_validatePass: function (e) {
			var elem = $(this),
				btn	 = $('#penguin-form').find('button'),
				lock = '/images/lock.png',
				chk  = '/images/tickbox.png',
				warn = '/images/warning.png';

			if (elem.val() == '') {
				elem.css('background', 'url('+lock+')');
				if (btn.data('active')) {
					penguin._toggleButton(btn);
				}
			}
			else if (!penguin._checkPass(elem.val())) {
				elem.css('background', 'url('+warn+')');
				if (btn.data('active')) {
					penguin._toggleButton(btn);
				}
			}
			else {
				elem.css('background', 'url('+chk+')');
			/*	if (!btn.data('active')) {
					penguin._toggleButton(btn);
				}*/
			}
		},

		e_login: function () {
			var form = $('#penguin-login'),
				user = form.find('input[type="text"]').val() || null,
				pass = form.find('input[type="password"]').val() || null;

			if (user == null || pass == null) {
				form.find('.error')
					.html('Make sure user and pass entered.')
					.parent().removeClass('hidden');
			} else {
				$.ajax({
					url: '/login',
					type: 'POST',
					data: {
						user: user,
						pass: pass
					},
					success: function (res) {
						if (res.error) {
							form.find('.error').html('Bad login')
								.parent()
								.removeClass('hidden');
							
							form.find('input[type="password"]').val('');
						} else {
							window.location = '/';
						}
					}
				})	
			}
		},

		/* MANAGEMENT MODAL EVENTS */
		e_showManagementModal: function (e) {
			var mo = $('#modal-overlay'),
				mm = $('#modal-manage-container');

			if (!mm.is(':visible')) {
				mo.removeClass('hidden');
				mm.slideDown('clip').removeClass('hidden');
			}
		},

		e_hideManagementModal: function (e) {
			var mo = $('#modal-overlay'),
				mm = $('#modal-manage-container');

			if (mm.is(':visible')) {
				mm.slideUp(function () {
					mo.addClass('hidden');
					$(this).addClass('hidden');
				});
			}
			
		},

		/* LOUPE MODAL EVENTS */

		/* PROFILE MODAL EVENTS */

		/* ARTICLE EVENTS */

		// EVENT - Click to view an article
		e_clickOnArticle: function (e) {
			var elem = $(this),
				data = elem.data('data');

			// TODO Implement caching
			if (data.viewed) {}
				//elseif

			elem.addClass('viewed');
			penguin.Post.loadPost(data);
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

			// EVENT BIND - Penguin Sub-menu item click
			$('#content-penguin-submenu').find('.submenuitem').each(function(idx, item) {
				$(item).bind('click', function (e) {
					self.Events.e_clickOnSubMenuElement_slateChange(this, 'penguin');
				});
			});
			// EVENT BIND - Students Sub-menu item click
			$('#content-students-submenu').find('.submenuitem').each(function(idx, item) {
				$(item).bind('click', function (e) {
					self.Events.e_clickOnSubMenuElement_slateChange(this, 'students');
				});
			});
			// EVENT BIND - Faculty Sub-menu item click
			$('#content-faculty-submenu').find('.submenuitem').each(function(idx, item) {
				$(item).bind('click', function (e) {
					self.Events.e_clickOnSubMenuElement_slateChange(this, 'faculty');
				});
			});
			// EVENT BIND - Clubs Sub-menu item click
			$('#content-clubs-submenu').find('.submenuitem').each(function(idx, item) {
				$(item).bind('click', function (e) {
					self.Events.e_clickOnSubMenuElement_slateChange(this, 'clubs');
				});
			});
			// EVENT BIND - Blog Sub-menu item click
			$('#content-blog-submenu').find('.submenuitem').each(function(idx, item) {
				$(item).bind('click', function (e) {
					self.Events.e_clickOnSubMenuElement_slateChange(this, 'blog');
				});
			});


			// EVENT BIND - Post modal close button
			$('#modal-post-close').bind('click', self.Events.e_hidePostModal);

			// EVENT BIND - Post modal minimize maximize toggle
			$('#modal-post-minimize').bind('click', function () {
				var elem = $(this);
				if (self.Post.postViewMini) {
					self.Events.e_maximizePostModal();
					elem.html('_');
				} else {
					self.Events.e_minimizePostModal();
					elem.html('+');
				}
			});

			// EVENT BIND - Management modal open link click
			$('#sidebar-welcome').bind('click', self.Events.e_showManagementModal);
			$('#modal-manage-aside')
				.find('.modal-close')
				.bind('click', self.Events.e_hideManagementModal);


			// EVENT BIND - Validate username input
			$('input[placeholder="username"]').bind('keyup', self.Events.e_validateUser);
			$('input[placeholder="password"]').bind('keyup', self.Events.e_validatePass);

			// EVENT BIND - Button login
			$('#penguin-login').find('button').bind('click', self.Events.e_login);

	},

	Init: function () {
		var self = this;
		
		// Create function bindings for all events
		this._initEvents();

		/* MENU RELATED */

		// Set the first item in the main menu as the default
		$('#sidebar-menu').children(':first').data('active', true)
			.css({
				'background'	: 'white',
				'border-left'	: 'none',
				'box-shadow'	: '-6px 2px 19px -2px #333',
				'color'			: '#333',
				'cursor'		: 'pointer'
			}).children('.triangle').toggleClass('hidden');

		// Set first items of all submenus to active
		$('.submenu').find('.submenuitem:first').each(function(idx, item){
			$(item).addClass('submenuactive').data('active', true);
		});

		// Hide all non-active content elements
		$('#content-penguin').children().not('.submenu').not(':first').hide()
		$('#content-students').children().not('.submenu').not(':first').hide()
		$('#content-faculty').children().not('.submenu').not(':first').hide()
		$('#content-clubs').children().not('.submenu').not(':first').hide()
		$('#content-blog').children().not('.submenu').not(':first').hide()
		/*-- END MENU RELATED */

		// Load latest news
		self.loadLatestNews('#latest-news');

		// Set login and register buttons to inactive
	//	self._toggleButton($('#penguin-login').find('button').data('active', true));

	},

	_createArticle: function (postData) {
		var self = penguin;
		// TODO Load comments and other data here
		// FAKE DATA 
		var media = {
			thumb : {
				src: '/images/acm.png',
				title: 'ACM logo'
			},
			img: 
				[
					{ src: '/images/acm.png', title: 'ACM logo' },
					{ src: '/images/acm.png', title: 'ACM logo' },
					{ src: '/images/acm.png', title: 'ACM logo' },
					{ src: '/images/acm.png', title: 'ACM logo' },
					{ src: '/images/acm.png', title: 'ACM logo' },
				]
		},
			author = {
				name: 'Kevin Jackson',
				posts: '33',
				stuid: '285335',
				media: {
					thumb: {
						src: '/images/acm.png',
						title: 'ACM logo',
					}
				}
			}


		var loupeCntr = $('<div id="post-loupe-container"></div>'),
			loupeMain = $('<img id="post-loupe-main" />'),
			loupeThms = $('<table id="post-loupe-thumbs"></table>'),
			loupeRow = $('<tr class="post-loupe-row"></tr>'),
			loupeThmHeight = 3;

			authorCntr = $('<div id="post-author-container"></div>'),
			authorThumb = $('<img id="post-author-thumb" />'),
			authorData = $('<ul id="post-author-data"></ul>'),

			contentCntr = $('<div id="post-content-container"></div>'),
			contentTitl = $('<h2 id="post-content-title"></h2>'),
			contentBlrb = $('<h3 id="post-content-blurb"></h3>'),
			contentMain = $('<div id="post-content-main"></div>'),
			
			postCntr = $('#modal-post-content');

		// Create the loupe section
		loupeMain.attr('src', media.thumb.src);
		loupeMain.attr('alt', media.thumb.title);

		for (idx in media.img) {
			var loupeCol = $('<td class="post-loupe-col"></td>'),
				loupeThm = $('<img src="' + media.img[idx].src 
							+ '" title="'+ media.img[idx].title+'" />');

			loupeCol.append(loupeThm);
			loupeRow.append(loupeCol);

			if (idx != 0 && (idx % loupeThmHeight == 0)) {
				loupeThms.append(loupeRow);
				loupeRow = $('<tr class="post-loupe-row"></tr>');
			}
		}

		loupeCntr.append(loupeMain);
		loupeCntr.append(loupeThms);

		// Create the author section
		authorThumb.attr('src', author.media.thumb.src);
		authorThumb.attr('alt', author.media.thumb.title);

		authorData.append('<li>Posted: ' 
				+ self._mysqlTimeStampToDate(postData.CREATED).toDateString() + '</li>'),
		authorData.append('<li>Author: ' + author.name + '</li>');
		authorData.append('<li>Posts: ' + author.posts + '</li>');
		authorData.append('<li><a href="#">Profile</a></li>');

		authorCntr.append(authorThumb);
		authorCntr.append(authorData);

		// Create content section
		contentTitl.html(postData.TITLE);
		contentBlrb.html(postData.BLURB);
		contentMain.html(postData.CONTENT);

		contentCntr.append(contentTitl);
		contentCntr.append(contentBlrb);
		contentCntr.append(contentMain);

		postCntr.append(loupeCntr);
		postCntr.append(authorCntr);
		postCntr.append(contentCntr);

			// TODO - build comment logic
			//commentView = $('<div id="post-comment-container"></div>');
	},

	_slateHide: function (elem, callback) {
		// Check and see element 

		elem = (elem instanceof jQuery) ? elem : jQuery(elem);
		elem.animate({'margin-left': '100%'}, 100, function () {
			elem.addClass('hidden');
			callback();
		});

		return;
	},

	_slateShow: function (elem, callback) {
		elem = (elem instanceof jQuery) ? elem : jQuery(elem);
		elem.removeClass('hidden').animate({'margin-left': '0'}, 100, callback);
		return;
	},

	loadLatestBlog: function (elem, blogId, size, callback) {
		elem = (elem instanceof jQuery) ? elem : jQuery(elem);
		var self = this,
			page = 1;

		if (!elem.data('blog-data')) {
			elem.data('blog-data', {blogId: blogId, size: size} );
		}

		if (elem.data('paging')) {
			page = elem.data('paging').page + 1;
		};

		$.ajax({
			url: '/blog/' + (elem.data('blog-data').blogId || blogId) + '/post',
			data: { page: page, size: elem.data('blog-data').size || size },
			success: function (articles) {
				// Add meta & paging data to parent element
				elem.data('paging', articles.paging);

				// Used in sequential fade-in animation
				var articleCollection = [],
					i = 0;

				// Iterate over articles and build them
				$.each(articles.data, function(idx, article) {
					var articleRow = self._buildSmallArticleMarkup(article);
					articleRow.hide();
					elem.append(articleRow)
					
					articleCollection.push(articleRow);
				});

				// Seqentially show articles loaded
				(function() {
					$(articleCollection[i++]).show('fast', arguments.callee);	
				})();

				if (callback) {
					callback(data);
				}
			}
		});
	},

	loadLatestNews: function (elem, callback) {
		elem = (elem instanceof jQuery) ? elem : jQuery(elem);
		var self = this,
			page = 1
			size = 10;

		// Calculate pagination size based on size of content (prevents init scroll)
		size =
			Math.round((elem.parent().height() - elem.position().top) / 35);

		// Factor in paging
		if (elem.data('paging')) {
			page = elem.data('paging').page + 1;
		}

		// Fetch the latest post data
		$.ajax({
			url: '/latest',
			data: { page: page, size: size },
			success: function (articles) {
				var more;

				// Add meta & paging data to parent element
				elem.data('paging', articles.paging);

				// Used in sequential fade-in animation
				var articleCollection = [],
					i = 0;

				// Iterate over articles and build them
				$.each(articles.data, function(idx, article) {
					var articleRow = self._buildSmallArticleMarkup(article);
					articleRow.hide();
					elem.append(articleRow)
					
					articleCollection.push(articleRow);
				});

				// Detach  the old Load more
				if (page > 1) {
					more = elem.find('.more').detach();
				}
				
				// Seqentially show articles loaded
				(function() {
					$(articleCollection[i++]).show('fast', arguments.callee);	
				})();

				// Add/Create load more
				if (page == 1) {
					more = $('<a class="more" href="#">Load more</a>');
					more.bind('click', function () {
						penguin.loadLatestNews(elem);
					});
				}
				elem.append(more);

				if (callback) {
					callback(data);
				}
			}
		});
	},

	getNotification: function (id) {

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

		// Bind click to event
		articleRow.bind('click', this.Events.e_clickOnArticle);

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
  },
	_ajaxElement: function (elem) {
		elem = (elem instanceof jQuery) ? elem : $(elem);

		if (elem.has('#temp-load').length) {
			console.log('loader already present');
			elem.children().hide();
			elem.find('#temp-load').show();
			return;
		}

		var loadCtnr = $('<div id="temp-load" class="bounds"></div>'),
			loader   = $('<img src="/images/loader.gif" />'),
			height   = (elem.height() / 2) - (loader.height() / 2),
			width    = (elem.width() / 2) - (loader.width() / 2);

		console.log('ELEM HEIGHT BEFORE:' + elem.height());
		elem.css('height', elem.height());

		loadCtnr.append(loader);
		elem.children().hide();
		elem.append(loadCtnr);

		loader.css({
			left: width,
			position: 'absolute',
			top: height
		});

		console.log('ELEM HEIGHT AFTER:' + elem.height());
	},

	_unAjaxElement: function (elem) {
		elem = (elem instanceof jQuery) ? elem : $(elem);
		elem.css('height', 'auto');
		var loader = elem.find('#temp-load').hide();
		elem.children().not(loader).show();
	},

	_checkUser: function (username) {
		var usregx = /^[A-Za-z0-9_]{3,20}$/;
		if (usregx.test(username)) {
			return true;
		}
		return false;
	},

	_checkPass: function (password) {
		var passregx = /^[A-Za-z0-9!@#$%\^&*()_]{6,20}$/;
		if (passregx.test(password)) {
			return true;
		}
		return false;
	},
	_toggleButton: function (elem, fn) {
		elem = (elem instanceof jQuery) ? elem : $(elem);

		if (!elem.data('active')) {
			elem.data('active', true);
			elem.css({
				cursor: 'pointer',
				opacity: '1.0'
			});
			elem.bind('click', fn);
		} else {
			elem.data('active', false);
			elem.css({
				cursor: 'none',
				opactiy: '0.7'
			});
			elem.unbind('click', fn);
		}

	}
}
