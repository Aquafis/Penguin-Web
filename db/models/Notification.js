module.exports = function (sequelize, DataTypes) {
	return sequelize.define('Notification', {
		ID: { 
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		USER_UUID: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: { isUUID: 4 }
		},
		COMMENT_ID: {
			type: DataTypes.STRING,
			allowNull: false,
		    validate: { isUUID: 4 }
		},
		CREATED: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
		},
		READ: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	});
}
