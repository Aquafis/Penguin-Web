var db = require('./../../db'),
	util = require('util'),
	API = require('./../API');

/*** UTIL ***/
var count = exports.count = function (req, res, next) {
	db.Models.user.count({where: res.locals.where})
		.success(function (count) {
			res.locals.count = count;
			next();
		})
		.error(function (err) {
			res.locals.err = err;
			next();
		});
}


/*----- GET REQUESTS -----*/

// Get many users, based on WHERE 
exports.many = function (req, res, next) {

	db.Models.user
		.findAll({
			offset: res.locals.paging.offset,
			limit: res.locals.paging.size,
			where: res.locals.where
		})
		.success(function (users) {
			res.locals.data = users;
			next();
		})
		.error(function (err) {
			res.locals.error = err;
			next();
		});
}

// Set where for users that are authors
exports.authors = function (req, res, next) {
	res.locals.where = {AUTHOR: true};
}

// Set where users that are admins
exports.admins = function (req, res, next) {
	res.locals.where = {ADMIN: true};
}

// Set where for users with similar last/first name
exports.name = function (req, res, next) {
	req.param(params.lastFirst) == true 
		? res.locals.where = ['LAST LIKE ?', '%' + req.params.name + '%']
		: res.locals.where = ['FIRST LIKE ?', '%' + req.params.name + '%']
	next();
}

// Set where for users with similar last and first names
exports.fullName = function (req, res, next) {
	req.param(params.lastFirst) == true
		? res.locals.where = ['LAST LIKE ? AND FIRST LIKE ?', 
			'%' + req.params.first + '%',
			'%' + req.params.last + '%']
		: res.locals.where = ['FIRST LIKE ? AND LAST LIKE ?',
			'%' + req.params.first + '%',
			'%' + req.params.last + '%'];
	next();
};
/*---- END MANY USERS ----*/

// Get user by ID
exports.id = function (req, res, next) {
	db.Models.user
		.find({ where: { ID: req.params.id }})
		.success( function (student) {
			res.locals.data = student;
			next();
		})
		.error( function (err) {
			res.locals.error = err;
			next();
		});
}
/*----- END GET REQUESTS -----*/	

/*----- POST REQUESTS -----*/
exports.update = function (req, res, next) {
	var id, user;

	// Make sure we have all required parameters
	if (!req.body[API.params.user.id] || !req.body[API.params.user.userData]) {
		res.locals.err = {
			status: 'FAILED',
			message: 'Could not update user',
			reason: 'Missing id or user parameter'
		}
		next();
	} else {
		// Parse user ID and user data
		id = decodeURIComponent(req.body[API.params.user.id]);
		user = JSON.parse(
				decodeURIComponent(req.body[API.params.user.userData]));

		// Validate, retrieve user, and update its data
		db.Models.user.find({where: { STUID: id }})
			.success(function (currUser) {
				if (!currUser) {
					res.locals.err = {
						status: 'FAILED',
						message: 'Could not update user',
						reason: 'Resource could not be found'
					}
					next();
				} else {
					currUser.updateAttributes(user)
						.success(function (upUser) {
							res.locals.data = {
								status: 'SUCCESS',
								message: 'User updated'
							}
							next();
						})
						.error (function (err) {
							res.locals.err = err;
							next();
						});
				}
			})
			.error(function (err) {
				res.locals.err = err;
				next();
			});
	}
}
/*----- END POST REQUESTS -----*/

/*----- PUT REQUESTS -----*/
exports.create = function (req, res, next){
	var user;
	
	// Make sure we have all required parameters
	if (!req.body[API.params.user.userData]) {
		res.locals.err = {
			status: 'FAILED',
			message: 'Could not create user',
			reason: 'No user object supplied'
		}
		next();
	} else {
		// Get user data from body and parse into JSON Object
		user = JSON.parse(
				decodeURIComponent(req.body[API.params.user.userData]));

		// Validate & insert user into database
		db.Models.user.create(user)
			.success(function (user) {
				res.locals.data = {
					status: 'SUCCESS',
					message: 'User created',
				}
				next();
			})
			.error(function (err) {
				res.locals.err = err;
				next();
			});
	}
};
/*----- END PUT REQUESTS -----*/


/*----- DELETE REQUESTS -----*/
exports.remove = function (req, res, next) {
	var id, chain;

	// Make sure we have all required parameters
	if (!req.body[API.params.user.id]) {
		res.locals.err = {
			status: 'FAILED',
			message: 'Could not delete user',
			reason: 'Missing id parameter'
		}
		next();
	} else {
		// Parse user ID and user data
		id = decodeURIComponent(req.body[API.params.user.id]);

		
		// Find user, destroy it and associations
		db.Models.user.find({ where: {STUID: id} })
			.success(function (user) {
				if (!user) {
					res.locals.err = {
						status: 'FAILED',
						message: 'Could not delete user',
						reason: 'No user resource found'
					}
				} else {
					chain = new db._sqlize.Utils.QueryChainer();
					chain.add(user.destroy())

					// Check and destroy author association
					if (user.AUTHOR) {
						// Would like to fetch the specific author model
						// db.models.author.find({})
						// ... and destroy it too,
						// author.destroy()
						// without having to nest
					}
					

				}
			})
			.error(function (err) {
				res.locals.err = err;
				next();
			});
	}
}
/*----- END DELETE REQUESTS -----*/
