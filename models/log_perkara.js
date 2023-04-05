// LOG schema
module.exports = (sequelize, DataTypes) => {
    const LogPerkara = sequelize.define('Log_perkara', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
		id_perkara: DataTypes.STRING,
		user_id: DataTypes.UUID,
		logtime: {
			type: DataTypes.DATE,
			defaultValue: sequelize.fn('now')
		},
		logdetail: DataTypes.STRING,
        kategori_id: DataTypes.INTEGER
    },
    { 
        timestamps: false,
        freezeTableName: true
    }
    );

    LogPerkara.associate = function (models) {
        LogPerkara.belongsTo(models.Users, {
            foreignKey: 'user_id',
            as: 'user'
        });
        LogPerkara.belongsTo(models.Perkara, {
            foreignKey: 'id_perkara',
            as: 'perkara'
        });
        LogPerkara.belongsTo(models.Kategori_perkara, {
            foreignKey: 'kategori_id',
            as: 'kategori'
        });
    }

    return LogPerkara;
}