module.exports = function (sequelize, DataTypes) {
	return sequelize.define('Comment', {
		UUID:
			{
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
				validate: { isUUID: 4 }
			},
		POSTID:
			{
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: { isNumeric: true }
			},
		USER_UUID:
			{
				type: DataTypes.STRING,
				allowNull: false,
				validate: { isUUID: 4 }
			},
		CREATED:
			{
				type: DataTypes.DATE,
				allowNull: false,
				defaulValue: DataTypes.NOW
			},
		UPDATED:
			{
				type: DataTypes.DATE,
				allowNull: true
			},
		APPROVED:
			{
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true
			},
		APPROVED_DATE:
			{
				type: DataTypes.DATE,
				allowNull: true
			},
		EDITIED:
			{
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false
			},
		EDITED_DATE:
			{
				type: DataTypes.DATE,
				allowNull: true
			},
		EDITED_BY:
			{
				type: DataTypes.STRING,
				allowNull: true,
				validate: { isUUID: 4 }
			},
		EDITCOUNT:
			{
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
				validate: { isNumeric: true }
			},
		DELETED:
			{
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false
			},
		DELETED_BY:
			{
				type: DataTypes.STRING,
				allowNull: true,
				validate: { isUUID: 4 }
			},
		DELETED_DATE:
			{
				type: DataTypes.DATE,
				allowNull: true
			},
		DELETED_REASON:
			{
				type: DataTypes.TEXT,
				allowNull: true
			},
		CONTENT:
			{
				type: DataTypes.TEXT,
				allowNull: false
			}
	});
}
