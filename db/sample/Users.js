var Sequelize = require('sequelize');

var db = require('../../db.js');

var User = db.Models.user;

var UUID = [
	'334c37b5-e5ea-44c2-96b6-07407613bff4',
	'4f40a585-ff58-4b13-8022-b56474697b01',
	'91603dfc-0e87-4ed6-8b56-d6259c7e79a5',
	'a65f554a-0d0a-4cfc-844f-091c0c8d38ec',
	'e9b41c04-2bdb-47b7-9fac-9986484d3414',
	'1d290864-1ebb-4fd8-8909-b9d197be8dee',
	'a8cc4117-a33d-45f5-88a2-310113fd60ea',
	'd71f28fa-ea47-40f6-9d05-ee671eafd2f5',
	'383b1f99-7ea6-4d92-a8db-540633b655d2',
	'60e6b13d-e0ae-4ea6-b2fd-f7c19b484013'
];

var FIRST = [
	'Francis', 'Jeremy', 'Matt', 'Steve', 'Thomas',
	'Cree', 'Krish', 'Shawn', 'Evan', 'Scott'
];

var LAST = [
	'Wertz', 'Beightol', 'Judd', 'Vasilo', 'Baughman',
	'Flory', 'Pillai', 'Carr', 'Rose', 'Mcendrick'
];

var STUID = [
	'627437', '679918', '655490', '648112', '686590',
	'709931', '600121', '662319', '692316', '697313'
];

var ADMIN = [ 1,1,1,0,0,0,1,0,0,0 ];
var AUTHOR = [ 1,1,0,0,0,0,1,0,1,1 ];
var FACULTY = [ 0,0,0,0,0,0,1,0,0,0 ];
var FEATURED = [ 0,0,0,0,1,1,0,0,1,0 ];


exports.save = function () {
	for (i = 0; i < 10; i++) {
		var U = User.build({
			UUID: UUID[i],
			FIRST: FIRST[i],
			LAST: LAST[i],
			STUID: STUID[i],
			ADMIN: ADMIN[i],
			AUTHOR: AUTHOR[i],
			FACULTY: FACULTY[i],
			FEATURED: FEATURED[i]
		});

		U.save()
			.success(function () {
				console.log('Saved user: ' + U.FIRST);
			})
			.error(function (err) {
				console.log('User not saved');
				console.log(err);
			});
	}
}
