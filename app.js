/**
 * Module dependencies.
 */

var
    blog	= require('./routes/blog')
  , connect	= require('connect')
  , cookie  = require('cookie')
  , db		= require('./db')
  , express = require('express')
  , http	= require('http')
  , https	= require('https')
  , io		= require('socket.io')
  , params	= require('express-params')
  , path	= require('path')
  , post	= require('./routes/post')
  , routes	= require('./routes')
  , user	= require('./routes/user')
  , Session	= connect.middleware.session.Session
  , Store	= connect.middleware.session.MemoryStore;

var app		= express(),
	server	= http.createServer(app),
	rtn		= io.listen(server),
	store	= new Store();

/* Express extentions */
params.extend(app);


/* Express Configuration */
app.configure(function(){
  app.set('port', process.env.PORT || 8000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());

  app.use(express.session({
	  store: store,
	  secret: 'secret',
	  key: 'express.sid'
  }));

  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Conect HTTP server
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


/* REAL TIME NOTIFICATION SERVER CONFIG */
rtn.configure(function() {
	// Let sessions be accessible by socket.io (RTN)
	rtn.set('authorization', function (data, accept) {
		if (data.headers.cookie) {
			try {
				var signed_cookies = cookie.parse(decodeURIComponent(data.headers.cookie));
				data.cookie = connect.utils.parseSignedCookies(signed_cookies, 'secret');
			} catch (err) {
				return accept('Cookie parse error', false);
			}

			data.sessionID		= data.cookie['express.sid'];
			data.sessionStore	= store;
			store.load(data.sessionID, function (err, session) {
				if (err || !session)
					accept('Error', err);
				else {
					data.session = session; //new Session();
					accept(null, true);
				}
			});
		} else {
			return accept('No Cookie transmitted', false);
		}
	});
});

// RTN - ON CONNECT EVENT
rtn.sockets.on('connection', function (socket) {
	var hs = socket.handshake;
	console.log('SOCKET CONNECTION. SESSID: ' + hs.sessionID);

	var intID = setInterval(function () {
		hs.session.reload(function() {
			console.log('touching cookies');
			hs.session.touch().save();
		});
	}, 60 * 1000);
	socket.emit('conn', {success: 'RTN connection successful. Hello! ' + hs.sessionID});
	balls(socket.id);

	socket.on('boner', function (data) {
		console.log('BONER RECEIVED!');
		hs.session.reload(function() {
			hs.session.boner = 'boner activated';
			hs.session.touch().save();
		});
	});

	socket.on('test', function (data) {
			hs.session.test = 'test activated';
			hs.session.touch().save();
	});

	socket.on('cdump', function () {
		hs.session.reload(function () {
			console.log('SESSION DATA: %j ', hs.session);
			socket.emit('cdump', {session: hs.session});
		});
	});

	socket.on('disconnect', function () {
		rtn.log.debug('Goodbye: ' + hs.sessionID);
		clearInterval(intID);
	});
});



function balls (client) {
	rtn.sockets.socket(client).emit('conn', {success: 'SPECIFIC MESSAGE TO: ' + client});
}

/* END RTN */

/* MIDDLE WARE */
function filterXHR (req, res, next) {
	if (!req.xhr) {
		// ANNND YOU'RE GONE
		res.send(404);
	} else {
		next();
	}
}

function apiResponse (req, res, next) {
	if (res.locals.error) {
		res.json(500, {error: res.locals.error});
	} else {
		res.json(res.locals.data);
	}
}


/* ROUTES */


// Some param pre-definitions
app.param('stuid', /^([\d]{1,8})$/);
app.param('blogid', /^\d+$/);
app.param('postid', /^\d+$/);

app.get('/', function(req, res) {
	var loggedin	= false, 
		user		= false
	console.log('session1: %j', req.session);

	if (req.session.login) {
		loggedin	= true;
		user		= req.session.login.user;

	}

	res.render('index',  {
		loggedin: loggedin, 
		user: user
	});
});

app.post('/login', function (req, res) {
	// TODO Validate the user
	console.log('LOGIN SESSION: %j', req.session);
	
	if (!req.param('user') == 'kjackson' || !req.param('pass') == 'letmein') {
		res.send({error: 'Bad login'});
		return;
	} else {

	var u = {
		uuid: '003056c1-aa91-4032-b124-edf44144c90a',
		first: 'Kevin',
		last: 'Jackson',
		stuid: '285335',
		admin: true,
		author: true,
		faculty: true
	}

	// TODO Set all of the session data we'll need
	/*store.load(req.sessionID, function (err, session) {
		if (err || !session)
			res.send({'error': 'Session not found'});
		else {
			session.login = {
				loggedin: true,
				user: u,
				session: req.sessionID
			}
			session.touch().save();
		}
	});*/

	req.session.login = {
		loggedin: true,
		user: u
	}
	req.session.touch();
	
	console.log('LOGIN SESSION: AFTER %j', req.session);
	res.send({success: 'succesfully logged in!'});
	}
});

app.post('/signup', function (req, res) {
});

/* USERS */

// Get user by student ID
app.get('/users/:stuid', user.byStuId, apiResponse);

// Get all users
app.get('/users', user.paginate, user.many, apiResponse);

// Get all admins
app.get('/users/admin', function (req, res, next) {
	res.locals.where = {admin: true};
	next();
}, user.paginate, user.many, apiResponse);

// Get all authors
app.get('/users/author', function (req, res, next) {
	res.locals.where = { author: true };
	next();
}, user.paginate, user.many, apiResponse);

// Get all faculty
app.get('/users/faculty', function (req, res, next) {
	res.locals.where = { faculty: true };
	next();
}, user.paginate, user.many, apiResponse);

// Get all featured users
app.get('/users/featured', function (req, res, next) {
	res.locals.where = { featured: true };
	next();
}, user.paginate, user.many, apiResponse);


// Get all users user by name
app.get('/users/:name', function (req, res, next) {
	if (req.param('lastFirst') == true) {
		res.locals.where = ['LAST like ?', '%' + req.params.name + '%'];//{LAST: req.params.name};
	} else {
		res.locals.where = ['FIRST like ?', '%' + req.params.name + '%'];//{FIRST: req.params.name};
	}
	next();
}, user.paginate, user.many, apiResponse);

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
}, user.paginate, user.many, apiResponse);

// User create
app.put('/users/create', user.create);

// Edit user by student ID
app.post('/users/:stuid', user.edit);

// Delete user by student ID
app.delete('/users/:stuid', user.delete);



/* BLOG */

// Get all blogs
app.get('/blog',blog.paginate, blog.many, apiResponse);

// Get blog by ID
app.get('/blog/:blogid', function (req, res, next) {
	res.locals.where = { BLOG_ID: req.params.blogid };
	next();
}, blog.single, apiResponse);

// Get blogs by name
app.get('/blog/:name', function (req, res, next) {
	res.locals.where = ['NAME like ?', '%' + req.params.name + '%'];
	next();
}, blog.paginate, blog.many, apiResponse);

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
}, post.paginate, post.many, apiResponse);

// Get all posts by blog ID and post ID
app.get('/blog/:blogid/post/:postid', function (req, res, next) {
	res.locals.where = { BLOG_ID: req.params.blogid, ID: req.params.postid };
	next();
}, post.single, apiResponse);

// Get all posts by blog ID and post title
app.get('/blog/:blogid/post/:title', function (req, res, next) {
	res.locals.where = 
		['BLOG_ID = ? AND TITLE like ?', req.params.blogid, '%' + req.params.title + '%' ]
	next();
}, post.paginate, post.many, apiResponse);

// Get latest posts
app.get('/latest', post.paginate, post.many, apiResponse);


// JUNK
app.get('/broadcast', function (req, res) {
	rtn.broadcast(req.params.broadcast);	
});

db.Connect();
db.fetchModels();

