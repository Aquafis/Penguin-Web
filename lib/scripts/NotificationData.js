var Nonsense	= require('./nonsense/Nonsense.js'),
	util		= require('../util.js');

var n = new Nonsense();

exports.randomNotification = function (useruuid, commentid) {
	var N = {
		USER_UUID: useruuid,
		COMMENT_ID: commentid,
		READ: util.randBOOL()
	}

	return N;
}
