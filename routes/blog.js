var db = require('./../db');

var page_size = 25;

exports.paginate = function (req, res, next) {
	res.locals.page = parseInt(req.param('page'), 10) || 1;
	res.locals.offset = 
		(res.locals.page == 1) ? 0 : (res.locals.page * page_size)-page_size;
	if (res.locals.where) { db.Models.blog .count({where: res.locals.where})
			.success(function(count) {
				res.locals.total = count;
				res.locals.pages = Math.ceil(res.locals.total / page_size);
			});
	} else {
		db.Models.blog.count().success(function (count) {	
			res.locals.total = count;
			res.locals.pages = Math.ceil(res.locals.total / page_size);
		});
	}

	if (res.locals.offset < res.locals.total) { res.locals.prev = true; }
	if (res.locals.offset > res.locals.total) { res.locals.next = true; }

	next();
}

exports.many = function (req, res) {
	db.Models.blog
		.findAll({
			offset: res.locals.offset,
			limit: page_size,
			where: res.locals.where
		})
		.success(function (blogs) {
			res.json({
				data: blogs,
				meta: {
					count: blogs.length,
					total: res.locals.total,
				},
				paging: {
					pages: res.locals.pages,
					page: res.locals.page,
					next: res.locals.next,
					prev: res.locals.prev
				}
			});
		})
		.error(function (err) {
			res.json(500, {error: err});
		});
}

exports.single = function (req, res) {
	db.Models.blog.find({
		where: res.locals.where
	})
	.success(function (blog) {
		res.json({ data: blog });
	})
	.error(function (err) {
		res.json(500, {error: err});
	});
}
