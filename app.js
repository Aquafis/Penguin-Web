/**
 * Module dependencies.
 */

var express = require('express')
  , params = require('express-params')
  , routes = require('./routes')
  , user = require('./routes/user')
  , blog = require('./routes/blog')
  , post = require('./routes/post')
  , http = require('http')
  , https = require('https')
  , path = require('path')
  , db	 = require('./db');

var app = express();

/* Extentions */
params.extend(app);


/* Configuration */
app.configure(function(){
  app.set('port', process.env.PORT || 80);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('93hf9ihj8HT93THOG84H'));

  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/* MIDDLE WARE */
function filterXHR (req, res, next) {
	if (!req.xhr) {
		// ANNND YOU'RE GONE
		res.send(404);
	} else {
		next();
	}
}


/* ROUTES */


// Some param pre-definitions
app.param('stuid', /^([\d]{1,8})$/);
app.param('blogid', /^\d+$/);
app.param('postid', /^\d+$/);

app.get('/', function(req, res) {
	res.render('index', {title: req.params.title});
});

/* USERS */

// Get user by student ID
app.get('/users/:stuid', user.byStuId);

// Get all users
app.get('/users', user.paginate, user.many);

// Get all admins
app.get('/users/admin', function (req, res, next) {
	res.locals.where = {admin: true};
	next();
}, user.paginate, user.many);

// Get all authors
app.get('/users/author', function (req, res, next) {
	res.locals.where = { author: true };
	next();
}, user.paginate, user.many);

// Get all faculty
app.get('/users/faculty', function (req, res, next) {
	res.locals.where = { faculty: true };
	next();
}, user.paginate, user.many);

// Get all featured users
app.get('/users/featured', function (req, res, next) {
	res.locals.where = { featured: true };
	next();
}, user.paginate, user.many);


// Get all users user by name
app.get('/users/:name', function (req, res, next) {
	if (req.param('lastFirst') == true) {
		res.locals.where = ['LAST like ?', '%' + req.params.name + '%'];//{LAST: req.params.name};
	} else {
		res.locals.where = ['FIRST like ?', '%' + req.params.name + '%'];//{FIRST: req.params.name};
	}
	next();
}, user.paginate, user.many);

// Get all users by full name
app.get('/users/:first/:last', function (req, res, next) {
	if (req.param('lastFirst') == true) {
		res.locals.where = 
			['FIRST like ? AND LAST like ?', '%' + req.params.last + '%', '%' + req.params.first + '%'];
			//{FIRST: req.params.last, LAST: req.params.first};
	} else {
		res.locals.where = 
			['FIRST like ? AND LAST like ?', '%' + req.params.first + '%', '%' + req.params.last + '%'];
			//{FIRST: req.params.first, LAST: req.params.last};
	}
	next();
}, user.paginate, user.many);

// User create
app.put('/users/create', user.create);

// Edit user by student ID
app.post('/users/:stuid', user.edit);

// Delete user by student ID
app.delete('/users/:stuid', user.delete);



/* BLOG */

// Get all blogs
app.get('/blog',blog.paginate, blog.many);

// Get blog by ID
app.get('/blog/:blogid', function (req, res, next) {
	res.locals.where = { BLOG_ID: req.params.blogid };
	next();
}, blog.single);

// Get blogs by name
app.get('/blog/:name', function (req, res, next) {
	res.locals.where = ['NAME like ?', '%' + req.params.name + '%'];
	next();
}, blog.paginate, blog.many);

// Blog Create
app.put('/blog/create', blog.create);

// Blog edit
app.post('/blog/edit', blog.edit);

// Blog remove
app.delete('/blog/remove', blog.delete);


/* BLOG POST */

// Get all posts by blog id
app.get('/blog/:blogid/post', function (req, res, next) {
	res.locals.where = { BLOG_ID: req.params.blogid };
	next();
}, post.paginate, post.many);

// Get all posts by blog ID and post ID
app.get('/blog/:blogid/post/:postid', function (req, res, next) {
	res.locals.where = { BLOG_ID: req.params.blogid, ID: req.params.postid };
	next();
}, post.single);

// Get all posts by blog ID and post title
app.get('/blog/:blogid/post/:title', function (req, res, next) {
	res.locals.where = 
		['BLOG_ID = ? AND TITLE like ?', req.params.blogid, '%' + req.params.title + '%' ]
	next();
}, post.paginate, post.many);

// Get latest posts
app.get('/latest', post.paginate, post.many);


db.Connect();
db.fetchModels();

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
