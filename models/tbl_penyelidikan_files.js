// Tbl_penyelidikan_files_tmp schema
module.exports = (sequelize, DataTypes) => {
    const Tbl_penyelidikan_files_tmp = sequelize.define('Tbl_penyelidikan_files_tmp', {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		id_penyelidikan: DataTypes.STRING,
        filename: DataTypes.TEXT,
        originalname: DataTypes.STRING,
        keterangan: DataTypes.STRING,
		createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    { freezeTableName: true }
    );

    Tbl_penyelidikan_files_tmp.associate = function (models) {
        Tbl_penyelidikan_files_tmp.belongsTo(models.Tbl_penyelidikan_tmp, {
            foreignKey: 'id_penyelidikan',
            as: 'penyelidikan'
        });
        models.Tbl_penyelidikan_tmp.hasMany(Tbl_penyelidikan_files_tmp, {
            foreignKey: 'id_penyelidikan',
            as: 'files'
        });
    };

    return Tbl_penyelidikan_files_tmp;
}