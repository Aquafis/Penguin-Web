var Sequelize = require('sequelize');

var db = {

	/* Connection constants */
	__HOST: 'localhost',
	__PORT:  8889,
	__DATABASE: 'penguin',
	__USERNAME: 'penguin',
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
		media: null,
		_fetched: false
	},
	

	Connect : function () {
		var	self = this;
		console.log('connecting...');

		self._sqlize = new Sequelize(
				'penguin',
				'penguin',
				'ou8one2',
				{
					host: 'localhost',
					port: 3306
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
		self.Models.media =
			self._sqlize.import(__dirname+ '/db/models/Media.js');

		self.Models._fetched = true;
	},

	_createRelations: function () {
		var self = this;
		if (!this.Models._fetched) return;

		// Blog Relationships
		this.Models.user.hasOne(self.Models.blog, {
			as: 'Owner',
			foreignKey: 'OWNER_UUID',
			type: self._sqlize.STRING
		});
	},

	_syncModels: function () {
		var self = this;

		self._sqlize.sync({force: true})
			.error(function (err) {
				console.log(err);
			});
	},
}

exports.Models = db.Models;
exports.Connect = db.Connect;
exports.fetchModels = db._fetchModels;
exports.createRelations = db._createRelations;
exports.syncModels = db._syncModels;
