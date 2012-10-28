var db = require('../db.js');

function Run() {
	db.Connect();
	db.fetchModels();
}


function Process() {
	db.Models.processUser
		.all()
		.success(function (users)
		{

			for (var i in users)
			{
				if(users[i].DELETE)
					console.log("Delete user: " + users[i].UUID);
			}
		})
		.error(function () {

		});
}


exports.Run = Run;
exports.Process = Proccess;
