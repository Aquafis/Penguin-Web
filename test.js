/*var Penguin = require('./penguin');

var app = Penguin.Create();
app.StartServers(80, 443);
*/

var db = require('./db');
var Sequelize = require('sequelize');

db.Connect();
db.fetchModels();
db.createRelations();
db.overwriteModels();

/*db.Models.user.find({where: { STUID: 627437 }})
	.success(function (user) {
		console.log('%j', user);
	});
*/
