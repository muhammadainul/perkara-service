// Tbl_penyidikan_files_tmp schema
module.exports = (sequelize, DataTypes) => {
    const Tbl_penyidikan_files_tmp = sequelize.define('Tbl_penyidikan_files_tmp', {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		id_penyidikan: DataTypes.STRING,
        filename: DataTypes.TEXT,
        originalname: DataTypes.STRING,
        keterangan: DataTypes.STRING,
		createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    { freezeTableName: true }
    );

    Tbl_penyidikan_files_tmp.associate = function (models) {
        Tbl_penyidikan_files_tmp.belongsTo(models.Tbl_penyidikan_tmp, {
            foreignKey: 'id_penyidikan',
            as: 'penyidikan'
        });
        models.Tbl_penyidikan_tmp.hasMany(Tbl_penyidikan_files_tmp, {
            foreignKey: 'id_penyidikan',
            as: 'files'
        });
    };

    return Tbl_penyidikan_files_tmp;
}