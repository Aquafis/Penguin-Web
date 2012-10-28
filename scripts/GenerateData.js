var db = require('../db.js'),
    UD = require('./UserData'),
    PUD = require('./ProcessUserData.js');

db.Connect();
db.fetchModels();

for (i = 0; i < 1000; i++) {
	/*var user = UD.randomUser();
	var newUser = db.Models.user.build(user);
	newUser.save();*/
	var puser = PUD.randomPUser();
	var newPUser = db.Models.processUser.build(puser);
	newPUser.save();
}
/*
U.save()
	.success(function () {
		console.log('Saved user: ' + U.FIRST);
	})
	.error(function (err) {
		console.log('User not saved');
		console.log(err);
	});
*/
