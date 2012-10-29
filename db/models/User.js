module.exports = function (sequelize, DataTypes) {
	return sequelize.define('User', {
		UUID:
			{
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
				validate: { isUUID: 4 }
			},
		FIRST:
			{
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					isAlpha: true,
					len: [2, 25]
				}
				
			},
		LAST:
			{
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					isAlpha: true,
					len: [2, 25]
				}
			},
		STUID:
			{
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isNumeric: true,
					len: [7, 9]
				}
			},
		MEDIA:
			{
				type: DataTypes.INTEGER,
				allowNull: true,
				validate: {
					isNumeric: true
				}
			},
		CREATED:
			{ type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
		LAST_LOGIN:
			{ type: DataTypes.DATE, allowNull: true },
		ADMIN:
			{ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 0 },
		ADMIN_ID:
			{ type: DataTypes.INTEGER, allowNull: true },
		AUTHOR:
			{ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 0 },
		AUTHOR_ID:
			{ type: DataTypes.INTEGER, allowNull: true },
		FACULTY:
			{ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 0 },
		FEATURED:
			{ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 0 }

	});
}
