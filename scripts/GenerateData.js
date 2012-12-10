// Dependencies
var db = require('../db.js'),
    UD = require('./UserData'),
    PUD = require('./ProcessUserData.js'),
	BD = require('./BlogData.js'),
	PD = require('./PostData.js'),
	AD = require('./AuthorData.js'),
	CD = require('./CommentData.js'),
	ND = require('./NotificationData.js'),
	Nonsense = require('./nonsense/Nonsense.js');

var n = new Nonsense();

// Connect, import schema, refresh database
db.Connect();
db.fetchModels();
db.createRelations();
db.overwriteModels(createData);


function createData () {
	// Arrays used to generate dependent data
	var userUUIDs = [],
		blogs = [],
		authors = [],
		posts = [],
		comments = [],
		notifications = [];

	// Create new users
	for (i = 0; i < 100; i++) {

		var user = UD.randomUser();
		if (user.AUTHOR)
			userUUIDs.push(user.UUID);

		var newUser = db.Models.user.build(user);
		newUser.save()
			.error(function (err) {
				console.log('Could not save new user: ' + user.UUID);
			});
	}

	console.log('There are ' + userUUIDs.length + ' authors to be created');

	// Create new process users
	for (i = 0; i < 50; i++) {

		var puser = PUD.randomPUser();
		var newPUser = db.Models.processUser.build(puser);
		newPUser.save()
			.error(function (err) {
				console.log('Could not save process user: ' + puser.UUID);
			});
	}


	// Create new blogs
	for (i = 0; i < 10; i++) {
		blogs.push(BD.randomBlog(n.pick(userUUIDs)));
	}

	// Create Authors
	for (i = 0; i < userUUIDs.length; i++) {
		var uuid = userUUIDs[i],
			auth = AD.randomAuthor(uuid, blogs.length);
		console.log('Author with ID: ' + i + ' created');
		addAuthorIDToUser(uuid, i+1);
		authors.push(auth);
	}



	// Create new blog posts
	for (i = 0; i < 1000; i++) {
		var post = PD.randomPost(blogs.length, n.integerInRange(1, authors.length));
		posts.push(post);

		// Increment postcounts
		blogs[posts[i].BLOG_ID].POSTCOUNT++;
		authors[posts[i].AUTHOR_ID].POSTCOUNT++;
	}


	// Save Blogs
	for (var blog in blogs) {
		var newBlog = db.Models.blog.build(blogs[blog]);

		newBlog.save()
			.success(function () {
			})
			.error(function (err) {
				console.log('Could not create blog: ' + newBlog.ID);
			});
	}

	// Save authors
	for(var author in authors) {
		var newAuthor = db.Models.author.build(authors[author]);
		newAuthor.save()
			.success(function (author) {
				console.log('Author ' + author.ID + ' saved.');
			})
			.error(function (err) {
				console.log('Could not save author: ' + newAuthor.ID);
			});
	}
	// Save posts
	for (var x = 0; x < posts.length; x++) {
		var newPost = db.Models.post.build(posts[x]);
		newPost.save()
			.success(function (post) {
			})
			.error(function (err) {
				console.log('Could not save post: ' + newPost.ID);
			});
	}

	// Create some comments
	for (i = 0; i < 1000; i++) {
		var x				= n.integerInRange(0, posts.length-1);
			post			= posts[x],
			comment_uuid	= userUUIDs[n.integerInRange(0, userUUIDs.length-1)],
			comment			= CD.randomComment(comment_uuid, x+1),

		// Let's find the OP, is he or she a faggot?
		// We needed the ID from the comment for notifications, we can store now
		comments.push(comment);
		//createNotification (post.AUTHOR_ID, comment_uuid);

	}

	// Save comments
	for (var comment in comments) {
		var newComment = db.Models.comment.build(comments[comment]);

		newComment.save()
			.success(function() {

			})
			.error(function (err) {
				console.log('Could not save comment: %j', comments[comment]);
			});
	}
}

function addAuthorIDToUser (userUUID, authorId) {
	db.Models.user.find({where: { UUID: userUUID }}).success(function(user) {
		console.log('Adding author ID ' + authorId + ' to User ' + userUUID);
		user.AUTHOR_ID = authorId;
		user.save();
	});
}

function createNotification (author_id, poster_id) {

		db.Models.author.find({where: {ID: author_id}})
			.success(function (op) {
				var notification = ND.randomNotification(op.UUID, poster_id),	
					newNotification = db.Models.notification.build(notification);
				newNotification.save()
					.success(function() {

					})
					.error(function (err) {
						console.log(err);
					});
			})
			.error(function (err) {
				console.log('Couldn\'t find OP, probably a faggot.');
			});
}
