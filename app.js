/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , db	 = require('./db');

var app = express();


app.configure(function(){
  app.set('port', process.env.PORT || 8800);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('page_size', 25);
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

app.get('/', function(req, res) {
	res.render('index', {title: req.params.title});
});

/* USERS */

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
		res.locals.where = {LAST: req.params.name};
	} else {
		res.locals.where = {FIRST: req.params.name};
	}
	next();
}, user.paginate, user.many);

// Get all users by full name
app.get('/users/:first/:last', function (req, res, next) {
	if (req.param('lastFirst') == true) {
		res.locals.where = {FIRST: req.params.last, LAST: req.params.first};
	} else {
		res.locals.where = {FIRST: req.params.first, LAST: req.params.last};
	}
	next();
}, user.paginate, user.many);



// Get user by student ID
app.get(/^\/users\/([\d]{1,8})$/, user.byStuId);














db.Connect();
db.fetchModels();
db.syncModels();
db.addSampleData();

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
