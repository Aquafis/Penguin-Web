var db = require('./../db');

var page_size = 5;

exports.paginate = function (req, res, next) {
	page_size = +req.param('size') || 5;
	res.locals.page = parseInt(req.param('page'), 10) || 1;
	res.locals.offset = 
		(res.locals.page == 1) ? 0 : (res.locals.page * page_size)-page_size;
	if (res.locals.where) { db.Models.post.count({where: res.locals.where})
			.success(function(count) {
				res.locals.total = count;
				res.locals.pages = Math.ceil(res.locals.total / page_size);
			});
	} else {
		db.Models.post.count().success(function (count) {	
			res.locals.total = count;
			res.locals.pages = Math.ceil(res.locals.total / page_size);
		});
	}

	if (res.locals.offset < res.locals.total) { res.locals.prev = true; }
	if (res.locals.offset > res.locals.total) { res.locals.next = true; }

	next();
}

exports.many = function (req, res, next) {
	db.Models.post
		.findAll({
			offset: res.locals.offset,
			limit: page_size,
			where: res.locals.where,
			order: 'CREATED DESC'
		})
		.success(function (posts) {
			res.locals.data = {
				data: posts,
				meta: {
					count: posts.length,
					total: res.locals.total,
				},
				paging: {
					pages: res.locals.pages,
					page: res.locals.page,
					next: res.locals.next,
					prev: res.locals.prev
				}
			};
			next();
		})
		.error(function (err) {
			res.locals.error = err;
			next();
		});
}

exports.single = function (req, res, next) {
	db.Models.post.find({
		where: res.locals.where
	})
	.success(function (post) {
		res.locals.data = post;
		next();
	})
	.error(function (err) {
		res.locals.error = err;
		next();
	});
}
