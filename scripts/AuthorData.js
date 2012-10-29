var Nonsense = require('./nonsense/Nonsense.js'),
	util = require('../util.js');

var n = new Nonsense();

exports.randomAuthor = function (UUID, BLOG_ID) {
	var A = {
		UUID: UUID || n.uuid(),
		BLOG_ID: BLOG_ID || n.integerInRange(1, 100),
		CREATED: new Date(n.timestamp(Date.parse('2012-JAN-01'), Date.parse('2012-DEC-31'))),
		POSTCOUNT: 0
	};

	return A;
}
