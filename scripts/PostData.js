var Nonsense = require('./nonsense/Nonsense.js'),
	util = require('../util.js');

var n = new Nonsense();

exports.randomPost = function (maxBlog, authorId, mediaId) {
	
	maxBlog = maxBlog || 100;

	var P = {
		BLOG_ID: n.integerInRange(0, maxBlog),
		AUTHOR: 'HAY SUES',
		AUTHOR_ID: authorId || n.integerInRange(1, 1000),
		CREATED: new Date(n.timestamp(Date.parse('2012-JAN-01'), Date.parse('2012-DEC-31'))),
		TITLE: n.words(n.integerInRange(2, 10)),
		BLURB: n.sentences(n.integerInRange(1, 4)),
		MEDIA_ID: mediaId || null,
		CONTENT: n.sentences(n.integerInRange(4, 100)),
		COMMENTS: 0
	};

	return P;
}
