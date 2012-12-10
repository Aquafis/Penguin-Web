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
	db.Models.comment
		.findAll({
			offset: res.locals.offset,
			limit: page_size,
			where: res.locals.where,
		})
		.success(function (posts) {
			res.locals.data = posts;
			next();
		})
		.error(function (err) {
			res.locals.error = err;
			next();
		});
}
