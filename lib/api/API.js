// MODULE INCLUDES

// API INCLUDES
var user = require('./resources/user'),
	post = require('./resources/post'),
	blog = require('./resources/blog'),
	comments = require('./resources/comments');



// API CONSTANTS
var __INITPAGE = 1;
var __PAGESIZE = 25;

/*** Penguin API ***/

var params = exports.params = {
	user: {
		userData: 'user',
		id: 'stuid'
	},
	lastFirst: 'lastFirst',
	paging: {
		size: 'size',
		page: 'page'
	},
	after: 'after',
	before: 'before'
}


exports.customResourceParam = {
	'stuid': /^([\d]{1,8})$/,
	'blogid': /^\d+$/,
	'postid': /^\d+$/
}

exports.resources = {
	GET: {

		/*----- USERS -----*/
		// Get All Users
		'/users': [user.count, paginate, user.many, JSONResponse],

		// Get all authors
		'/users/authors': [user.authors, user.count, paginate, user.many, JSONResponse],

		// Get all admins
		'/users/admins': [user.admins, user.count, paginate, user.many, JSONResponse],

		// Get all faculty
		'/users/faculty': [user.faculty, user.count, paginate, user.many, JSONResponse],

		// Get all featured
		'/users/featured': [user.featured, user.count, paginate, user.many, JSONResponse],

		'/users/online': [user.online, user.count, paginate, user.many, JSONResponse],

		// Get all users by name (either match first OR match last)
		'/users/:name': [user.name, user.count, paginate, user.many, JSONResponse],

		// Get all users by full name
		'/users/:first/:last': [user.fullName, user.count, paginate, user.many, JSONResponse],


		// Get user by ID
		'/users/:id': [user.id, JSONResponse],

		'/users/:id': [user.id, JSONResponse],

		/*----- END USERS -----*/


		/*----- BLOGS -----*/
		// Get all blogs
		'/blog': [blog.count, paginate, blog.many, JSONResponse],

		// Get blog by ID
		'/blog/:blogid': [function (req, res, next) {
			res.locals.where = {BLOG_ID: req.params.blogid};
			next();
		}, blog.fetch, JSONResponse],

		// Get blogs by name
		'/blog/:name': [function (req, res, next) {
			res.locals.where = ['NAME LIKE ?', '%' + req.params.name + '%'];
			next();
		}, blog.count, paginate, blog.fetch, JSONResponse],
		/*----- END BLOGS -----*/


		/*----- POSTS -----*/
		// Get all posts by blogID
		/*'/blog/:blogid/posts': [function (req, res, next) }{
			res.locals.where = {BLOG_ID: req.params.blogid};
			next();
		}, post.count, paginate, post.fetch, JSONResponse],*/

		// Get post by postID
		'/posts/:postid': [function (req, res, next) {
				res.locals.where = {ID: req.params.postid};
				next();
		}, post.fetch, JSONResponse],

		// Get all posts by post title
		'/posts/:title': [function (req, res, next) {
			res.locals.where = [
				'BLOG_ID = ? AND TITLE like ?',
				'%' + req.params.blogid + '%', 
				'%' + req.params.title + '%'
			];
			next();
		}, post.count, paginate, post.fetch, JSONResponse],

		// Get all posts
		'/latest': [post.count, paginate, post.fetch, JSONResponse],
		'/posts': [post.count, paginate, post.fetch, JSONResponse],

		/*----- END POSTS -----*/


		/*----- COMMENTS -----*/
		// Get latest comments
		'/comments': [comments.count, paginate, comments.fetch, JSONResponse],

		// Get all comments for a post
		'/posts/:postid/comments': [function (req, res, next) {
			res.locals.where = {POSTID: req.params.postid};
			next();
		}, comments.count, paginate, comments.fetch, JSONResponse],

		// Get all comments for a user
		'/users/:userid/comments': [function (req, res, next) {
			res.locals.where = {}
		}],
	},

	POST: {
		'/users': [user.update, JSONResponse]
	},

	PUT: {
		/*----- USERS -----*/
		'/users': [user.create, JSONResponse] // TODO - Validate
	}
}

function paginate (req, res, next) {
	
	// The object holding our paging data
	var paging = {
		next: '',
		offset: 0,
		page: 0,
		pages: 0,
		prev : '',
		size : 0,
		total: 0 
	}

	// Get or set paging size
	paging.size = +req.param(params.paging.size) || __PAGESIZE;

	// Get or set current page
	paging.page = +req.param(params.paging.page) || __INITPAGE;

	// Get the offset (starting index) based on page size and page
	paging.offset =
		paging.page === __INITPAGE
			? 0
			: (paging.page * (paging.size) - paging.size);

	// Set the total
	paging.total = res.locals.count;

	// Calculate number of pages available
	paging.pages = 
		Math.ceil(paging.total / paging.size);
	
	// Determine next and prev resource links
	paging.next = (paging.pages - paging.page);
	paging.prev = (paging.page - 1);
		
	// Attach our paging object to the response, and carry on
	res.locals.paging = paging;
	next();
}

function JSONResponse (req, res) {
	var JSON = {};
	if (res.locals.err) {
		res.json(500, {error: res.locals.err});

	} else {
		if (res.locals.data) {
			JSON.data = res.locals.data;
		}

		if (res.locals.paging) {
			JSON.paging = res.locals.paging;
		}

		res.json(JSON);
	}
}
