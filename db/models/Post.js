module.exports = function (sequelize, DataTypes) {
	return sequelize.define('Post', {
		ID:
			{ type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		BLOG_ID:
			{ type: DataTypes.INTEGER, allowNull: false },
		AUTHOR:
			{ type: DataTypes.TEXT, allowNull: false },
		AUTHOR_ID:
			{ type: DataTypes.INTEGER, allowNull: false },
		CREATED:
			{ type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		TITLE:
			{ type: DataTypes.TEXT, allowNull: false },
		BLURB:
			{ type: DataTypes.TEXT, allowNull: false },
		MEDIA_ID:
			{ type: DataTypes.INTEGER, allowNull: true },
		CONTENT:
			{ type: DataTypes.TEXT, allowNull: false },
		COMMENTS:
			{ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
	});
}
