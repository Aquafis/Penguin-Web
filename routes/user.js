var db = require('./../db');

/*
 * GET
 */

var page_size = 1;

exports.paginate = function (req, res, next) {
	res.locals.page = parseInt(req.param('page'), 10) || 1;
	res.locals.offset = 
		(res.locals.page == 1) ? 0 : (res.locals.page * page_size)-page_size;
	if (res.locals.where) { db.Models.user .count({where: res.locals.where})
			.success(function(count) {
				res.locals.total = count;
				res.locals.pages = Math.ceil(res.locals.total / page_size);
			});
	} else {
		db.Models.user.count().success(function (count) {	
			res.locals.total = count;
			res.locals.pages = Math.ceil(res.locals.total / page_size);
		});
	}

	if (res.locals.offset < res.locals.total) { res.locals.prev = true; }
	if (res.locals.offset > res.locals.total) { res.locals.next = true; }

	next();
}

// Multiple users

exports.many = function (req, res) {
	db.Models.user
		.findAll({
			offset: res.locals.offset,
			limit: page_size,
			where: res.locals.where
		})
		.success(function (users) {
			res.json({
				data: users,
				meta: {
					count: users.length,
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

exports.online = function (req, res){};
exports.featured = function (req, res) {};
exports.faculty = function (req, res) {};

exports.name = function (req, res){
	db.Models.user
		.find({ where: res.locals.where })
		.success( function (student) {
			res.json({ data: student });
		})
		.error( function (err) {
			res.json(500, { error: err });
		});
};


exports.fullName = function (req, res){
	db.Models.user
		.find({ where: res.locals.where })
		.success( function (student) {
			res.json({ data: student });
		})
		.error( function (err) {
			res.json(500, { error: err });
		});
};

// Single User 
exports.byStuId = function (req, res) {
	db.Models.user
		.find({ where: {STUID: req.params[0] }})
		.success( function (student) {
			res.json({ data: student });
		})
		.error( function (err) {
			res.json(500, { error: err });
		});
}
	

/*
 * POST
 */

// Multiple users

// Single user
exports.update = function (req, res){};
exports.login = function (req, res){};

/*
 * PUT
 */

// Multiple users

//
// Single user
exports.create = function (req, res){};

/*
 * DELETE
 */

// Multiple users

// Single user
exports.remove = function (req, res){};

