var Sequelize = require('sequelize');

var db = {

	/* Connection constants */
	__HOST: 'localhost',
	__PORT:  8889,
	__DATABASE: 'penguin2',
	__USERNAME: 'penguin2',
	__PASSWORD: 'ou8one2',

	/* Sequelize Object (Used throughout) */
	_sqlize: null,

	/* Model definitions */
	Models: {
		blog: null,
		user: null,
		processUser: null,
		author: null,
		post: null,
		comment: null,
		notification: null,
		media: null,
		_fetched: false
	},
	

	Connect : function () {
		var	self = this;
		console.log('connecting...');

		self._sqlize = new Sequelize(
				'penguin_test',
				'penguin2',
				'ou8one2',
				{
					host: 'localhost',
					port: 8889,
					logging: false
				});
	},

	_fetchModels: function () {
		var self = this;

		self.Models.blog = 
			self._sqlize.import(__dirname + '/db/models/Blog.js');
		self.Models.user =
			self._sqlize.import(__dirname + '/db/models/User.js');
		self.Models.processUser =
			self._sqlize.import(__dirname + '/db/models/ProcessUser.js');
		self.Models.author =
			self._sqlize.import(__dirname + '/db/models/Author.js');
		self.Models.post =
			self._sqlize.import(__dirname + '/db/models/Post.js');
		self.Models.comment =
			self._sqlize.import(__dirname + '/db/models/Comment.js');
		self.Models.notification =
			self._sqlize.import(__dirname + '/db/models/Notification.js');
		self.Models.media =
			self._sqlize.import(__dirname+ '/db/models/Media.js');

		self.Models._fetched = true;
	},

	_createRelations: function () {
		var self = this;

		/*----- BLOG RELATIONSHIPS ----*/
		self.Models.blog.belongsTo(self.Models.user, {as: 'Owner', foreignKey: 'OWNER_UUID'});
		self.Models.blog.hasMany(self.Models.post, {as: 'Posts'});
		self.Models.blog.hasMany(self.Models.author, {as: 'Authors'});
	},

	_overwriteModels: function (callback) {
		var self = this;

		self._sqlize.sync({force: true})
			.success(callback || new Function)
			.error(function (err) {
				console.log(err);
			});
	},
}

exports.Models = db.Models;
exports.Connect = db.Connect;
exports.fetchModels = db._fetchModels;
exports.createRelations = db._createRelations;
exports.overwriteModels = db._overwriteModels;
