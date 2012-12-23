var	API			= require('./api/API')
	, RTN		= require('./rtn/RTN')
	, connect	= require('connect')
	, cookie	= require('cookie')
	, crypto	= require('crypto')
	, db		= require('./db')
	, express	= require('express')
	, fs		= require('fs')
	, http		= require('http')
	, https		= require('https')
	, io		= require('socket.io')
	, params	= require('express-params')
	, path		= require('path')
	, Session	= connect.middleware.session.Session
	, Store		= connect.middleware.session.MemoryStore;

exports.Create = function () {
	var app		= express(),
		privKey	= fs.readFileSync('privkey.pem').toString(),
		cert	= fs.readFileSync('certificate.pem').toString(),
		server	= http.createServer(app),
		sserver = https.createServer({key: privKey, cert: cert}, app),
		rtn		= io.listen(server),
		store	= new Store(),
		self	= this;

	self._configWebServers = function (port, sport, secret) {
		// Express extensions
		params.extend(app);
		
		// Configure Express
		app.configure(function() {
		  app.set('port', process.env.PORT || port);
		  app.set('sport', process.env.SPORT || sport);
		  app.set('views', __dirname + '/views');
		  app.set('view engine', 'jade');
		  app.use(express.favicon());
		  app.use(express.logger('dev'));
		  app.use(express.bodyParser());
		  app.use(express.methodOverride());
		  app.use(express.cookieParser());

		  app.use(express.session({
			  store: store,
			  secret: secret,
			  key: 'express.sid'
		  }));

		  app.use(app.router);
		  app.use(express.static(path.join(__dirname, 'public')));
		});

		app.configure('development', function(){
		  app.use(express.errorHandler());
		});

		// Register special API paramater names
		for (var param in API.customResourceParams) {
			app.param(param, API.customResourceParams[param]);
		}

		// API - GET RESOURCES ROUTES
		for (var gr in API.resources.GET) {
			app.get(gr, API.resources.GET[gr]);
		}

		// API - POST RESOURCES ROUTES
		for (var po in API.resources.POST) {
			app.post(po, API.resources.POST[po]);
		}

		// API - PUT RESOURCES ROUTES
		for (var pt in API.resources.PUT) {
			app.put(pt, API.resources.PUT[pt]);
		}
		
		// API - DELETE RESOURCE ROUTES
		for (var rm in API.resources.DELETE) {
			app.delete(rm, API.resources.DELETE[rm]);
		}

		server.listen(app.get('port'), function () {
			console.log('Express Server running on port: ' + app.get('port'));
		});

		sserver.listen(app.get('sport'), function () {
			console.log('Express Secure Server running on port: ' + app.get('sport'));
		});
	}


	self._configRTNServer = function (secret) {
		// RTN Configuration
		rtn.configure(function() {
			// Let Express sessions be accessible by socket.io (RTN)
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
		
		// Client connection handler
		rtn.sockets.on('connection', RTN.ConnectHandler);
	}

	self._acquireSecret = function (fn) {
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

	self.StartServers = function (port, sport) {
		// Get the secret, then config / launch servers
		self._acquireSecret(function (secret) {
			self._configWebServers(port || 8000, sport || 8001,  secret);
			self._configRTNServer(secret);
		});

		// Connect to the database and load in the data models
		db.Connect();
		db.fetchModels();
	}

	return this;
}

