// Dependencies
var db = require('../db.js'),
    UD = require('./UserData'),
    PUD = require('./ProcessUserData.js'),
	BD = require('./BlogData.js'),
	PD = require('./PostData.js'),
	AD = require('./AuthorData.js'),
	Nonsense = require('./nonsense/Nonsense.js');

var n = new Nonsense();

// Connect, import schema, refresh database
db.Connect();
db.fetchModels();
db.overwriteModels(createData);


function createData () {
	// Arrays used to generate dependent data
	var userUUIDs = [],
		blogs = [],
		authors = [];

	// Create new users
	for (i = 0; i < 100; i++) {

		var user = UD.randomUser();
		if (user.AUTHOR)
			userUUIDs.push(user.UUID);

		var newUser = db.Models.user.build(user);
		newUser.save()
			.error(function (err) {
				console.log(err);
			});
	}

	// Create new process users
	for (i = 0; i < 50; i++) {
		
		var puser = PUD.randomPUser();
		var newPUser = db.Models.processUser.build(puser);
		newPUser.save()
			.error(function (err) {
				console.log(err);
			});
	}


	// Create new blogs
	for (i = 0; i < 10; i++) {
		blogs.push(BD.randomBlog(n.pick(userUUIDs)));
	}

	// Create Authors
	for (i = 0; i < 30; i++) {
		authors.push(AD.randomAuthor(n.pick(userUUIDs), n.pick(blogs).BLOG_ID));
	}

	console.log(authors);

	
	// Create new blog posts
	for (i = 0; i < 1000; i++) {
		var post = PD.randomPost(blogs.length, n.integerInRange(1, authors.length));

		// Increment postcounts
		blogs[post.BLOG_ID].POSTCOUNT++;
		authors[post.AUTHOR_ID].POSTCOUNT++;

		var newPost = db.Models.post.build(post);
		newPost.save()
			.success(function () {

			})
			.error(function (err) {
				console.log(err);
			});
	}

	// Save Blogs
	for (var blog in blogs) {
		var newBlog = db.Models.blog.build(blogs[blog]);

		newBlog.save()
			.success(function () {
			})
			.error(function (err) {
				console.log(err);
			});
	}

	// Save authors
	for(var author in authors) {
		var newAuthor = db.Models.author.build(authors[author]);
		newAuthor.save()
			.success(function () {
			})
			.error(function (err) {
				console.log(err);
			});
	}
}
