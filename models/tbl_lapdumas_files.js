// Tbl_lapdumas_files_tmp schema
module.exports = (sequelize, DataTypes) => {
    const Tbl_lapdumas_files_tmp = sequelize.define('Tbl_lapdumas_files_tmp', {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		id_lapdumas: DataTypes.STRING,
        filename: DataTypes.TEXT,
        originalname: DataTypes.STRING,
        keterangan: DataTypes.STRING,
		createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    { freezeTableName: true }
    );

    Tbl_lapdumas_files_tmp.associate = function (models) {
        Tbl_lapdumas_files_tmp.belongsTo(models.Tbl_lapdumas_tmp, {
            foreignKey: 'id_lapdumas',
            as: 'lapdumas'
        });
        models.Tbl_lapdumas_tmp.hasMany(Tbl_lapdumas_files_tmp, {
            foreignKey: 'id_lapdumas',
            as: 'files'
        });
    };

    return Tbl_lapdumas_files_tmp;
}