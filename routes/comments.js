var db = require('./../db');

var page_size = 25;

exports.paginate = function (req, res, next) {
	page_size = +req.param('size') || page_size;
	res.locals.page = +req.param('page') || 1;
	res.locals.offset =
		(res.locals.page == 1) ? 0: (res.locals.page * page_size)-page_size;

	if (res.locals.where) {
		db.Models.comment.count({where: res.locals.where})
			.success(function (count) {
				res.locals.total = count;
				res.locals.pages = Math.ceil(res.locals.total / page_size);
			});
	} else {
		db.Models.comment.count().success(function (count) {
			res.locals.total = count;
			res.locals.pages = Math.ceil(res.locals.total / page_size);
		});
	}

	if (res.locals.offset < res.locals.total)
		res.locals.prev = true;
	if (res.locals.offset > res.locals.total)
		res.locals.next = true;
	
	next();
}

exports.many = function (req, res, next) {
	var toRemove = ['USER_UUID'];
	db.Models.comment
		.findAll({
			offset: res.locals.offset,
			limit: page_size,
			where: res.locals.where,
		})
		.success(function (comments) {
			if (!comments || comments.length == 0) {
				res.locals.data = {
					data: comments,
					metha: {
						count: comments.length,
						total: res.locals.total
					},
					paging: {
						pages: res.locals.pages,
						page: res.locals.page,
						next: res.locals.next,
						prev: res.locals.prev
					}
				}
				next();
			}
			var commentsWithAuthors = [];
			
			for (var i in comments) {
				attachAuthor(comments[i], function (commentWithAuthor) {
					commentsWithAuthors.push(commentWithAuthor);
					if (commentsWithAuthors.length == comments.length) {
						for (var x in commentsWithAuthors)
							delete commentsWithAuthors[toRemove[x]];
						res.locals.data = {
							data: commentsWithAuthors,
							meta: {
								count: comments.length,
								total: res.locals.total
							},
							paging: {
								pages: res.locals.pages,
								page: res.locals.page,
								next: res.locals.next,
								prev: res.locals.prev
							}
						}
						next();
					}
				});
			}
		})
		.error(function (err) {
			res.locals.error = err;
			next();
		});
}

function attachAuthor (comment, fn) {
	var toRemove = ['ADMIN', 'ADMIN_ID', 'CREATED', 'FACULTY', 'FEATURED',
					'LAST_LOGIN', 'UUID', 'createdAt', 'updatedAt'];
	
	db.Models.user.find({where: { UUID: comment.USER_UUID }})
		.success(function (user) {
			comment.attributes.splice(5, 0, 'AUTHOR');
			for (var x in toRemove)
				delete user[toRemove[x]];
			comment.AUTHOR = user;
			fn(comment);
		})
		.error(function (err) {
			fn(comment);
		});
}
