var
    blog	= require('./routes/blog')
  , connect	= require('connect')
  , cookie  = require('cookie')
  , db		= require('./db')
  , express = require('express')
  , fs		= require('fs')
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


var Penguin = function () {
	var app		= express(),
		server	= http.createServer(app),
		rtn		= io.listen(server),
		store	= new Store(),
		self	= this;

	self.initServer = function (port, secret) {
		// Initialze and configure express
		app = express();
		server = http.createServer(app);
		rtn = io.listen(server);

		// Express extensions
		params.extend(app);

		// Configure Express
		app.configure(function(){
		  app.set('port', process.env.PORT || 80);
		  app.set('views', __dirname + '/views');
		  app.set('view engine', 'jade');
		  app.use(express.favicon());
		  app.use(express.logger('dev'));
		  app.use(express.bodyParser());
		  app.use(express.methodOverride());
		  app.use(express.cookieParser());

		  app.use(express.session({
			  store: store,
			  secret: secret
			  key: 'express.sid'
		  }));

		  app.use(app.router);
		  app.use(express.static(path.join(__dirname, 'public')));
		});

		app.configure('development', function(){
		  app.use(express.errorHandler());
		});

		/* TODO ITERATE OVER ROUTES */
	}

	self.initRTNServer = function (secret) {
		rtn.configure(function() {
			// Let sessions be accessible by socket.io (RTN)
			rtn.set('authorization', function (data, accept) {
				if (data.headers.cookie) {
					try {
						var signed_cookies = 
							cookie.parse(decodeURIComponent(data.headers.cookie));
						data.cookie = 
							connect.utils.parseSignedCookies(signed_cookies, secret);
					} catch (err) {
						io.log.error('Cookie could not be parsed, bad secret?');
						return accept('Cookie parse error', false);
					}

					data.sessionID		= data.cookie['express.sid'];
					data.sessionStore	= store;
					store.load(data.sessionID, function (err, session) {
						if (err || !session) {
							io.log.error('Session could not loaded from memorystore');
							accept('Error', err);
						} else {
							data.session = session; //new Session();
							accept(null, true);
						}
					});
				} else {
					return accept('No Cookie transmitted', false);
				}
			});
		});
	}

	self.startServers = function () {
		rtn.sockets.on('connection', function (socket) {
			var hs = socket.handshake;

			var intID = setInterval(function () {
				hs.session.reload(function() {
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
			socket.on('cdump', function () {
				console.log('SESSION DATA: %j ', hs.session);
			});
});

	}

	self.acquireSecret = function (fn) {
		fs.readFile('secret.key', 'ascii', function (err, data) {
			if (err) {
				rtn.log.info('No secret found, generated a new one');
				crypto.randomBytes(48, function (ex, buf) {
					data = buf.toString('hex');
					fs.writeFile('secret.key', data, function (err) {
						if (err) {
							io.log.error('Key could not be created');
						}
					});
				});
			}
			if (fn)
				fn(data);
			else
				return data;
		});
	}
}

