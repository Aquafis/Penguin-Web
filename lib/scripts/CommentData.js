var Nonsense	= require('./nonsense/Nonsense.js'),
	util		= require('../util.js');

var n = new Nonsense();

exports.randomComment = function (useruuid, postid) {
	var C = {
		UUID: n.uuid(),
		POSTID: postid,
		CREATED: new Date(),
		USER_UUID: useruuid,
		CONTENT: n.sentences(n.integerInRange(1, 9))	
	}
	return C;
}
