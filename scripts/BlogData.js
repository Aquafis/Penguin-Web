var Nonsense = require('./nonsense/Nonsense.js'),
	util = require('../util.js');

var n = new Nonsense();
exports.randomBlog = function (UUID) {

	var B = {
		OWNER_UUID: UUID || n.uuid(),
		CREATED: new Date(n.timestamp(Date.parse('2012-JAN-01'), Date.parse('2012-DEC-31'))),
		NAME: n.words(n.integerInRange(1, 5)),
		DESCRIPTION: n.sentences(n.integerInRange(1, 3)),
		POSTCOUNT: 0
	};

	return B;
}
