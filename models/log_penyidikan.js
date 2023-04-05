// LOG penyidikan schema
module.exports = (sequelize, DataTypes) => {
    const Log_penyidikan = sequelize.define('Log_penyidikan', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
		id_penyidikan: DataTypes.STRING,
		user_id: DataTypes.UUID,
		logtime: {
			type: DataTypes.DATE,
			defaultValue: sequelize.fn('now')
		},
		logdetail: DataTypes.STRING
    },
    { 
        timestamps: false,
        freezeTableName: true
    }
    );

    Log_penyidikan.associate = function (models) {
        Log_penyidikan.belongsTo(models.Users, {
            foreignKey: 'user_id',
            as: 'user'
        });
        Log_penyidikan.belongsTo(models.Penyidikan, {
            foreignKey: 'id_penyidikan',
            as: 'penyidikan'
        });
    }

    return Log_penyidikan;
}