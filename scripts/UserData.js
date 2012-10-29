var Sequelize = require('sequelize'),
db = require('../db.js'),
User = db.Models.user,
Nonsense = require('./nonsense/Nonsense.js'),
util = require('../util.js');

var n = new Nonsense();
exports.randomUser = function () {
	var U = {
		UUID: n.uuid(),
		FIRST: n.firstName(),
		LAST: n.lastName(),
		STUID: util.createSTUID(),
		ADMIN: util.randBOOL(),
		AUTHOR: 1 || util.randBOOL(),
		FACULTY: util.randBOOL(),
		FEATURED: util.randBOOL()
	};

	return U;
}
