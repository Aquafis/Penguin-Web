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

exports.many = function (req, res, next) {
	db.Models.blog
		.findAll({
			offset: res.locals.offset,
			limit: page_size,
			where: res.locals.where
		})
		.success(function (blogs) {
			var blogsWithAuthors = [];
			for (var i in blogs) {
				attachAuthors(blogs[i], function (blogWAuthor) {
					blogsWithAuthors.push(blogWAuthor);
					if (blogsWithAuthors.length == blogs.length) {
						res.locals.data = {
							data: blogsWithAuthors,
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
						};
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

exports.single = function (req, res, next) {
	db.Models.blog.find({
		where: res.locals.where
	})
	.success(function (blog) {
		attachAuthors(blog, function (blogWithAuthor) {
			res.locals.data = blogWithAuthor;
			next();
		});
	})
	.error(function (err) {
		res.locals.error = err;
		next();
	});
}

function attachAuthors (blog, fn) {
	blog.attributes.splice(5, 0, 'AUTHORS');

	db.Models.author.findAll({
		where: { BLOG_ID: blog.BLOG_ID }
	})
	.success(function (authors) {
		blog.AUTHORS = authors;
		fn(blog);
	})
	.error (function (err) {
		blog.AUTHORS = [];
		fn(blog);
	});
}
