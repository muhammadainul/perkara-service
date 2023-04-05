// Tbl_prapenuntutan_files_tmp schema
module.exports = (sequelize, DataTypes) => {
    const Tbl_prapenuntutan_files_tmp = sequelize.define('Tbl_prapenuntutan_files_tmp', {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		id_prapenuntutan: DataTypes.STRING,
        filename: DataTypes.TEXT,
        originalname: DataTypes.STRING,
        keterangan: DataTypes.STRING,
		createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    { freezeTableName: true }
    );

    Tbl_prapenuntutan_files_tmp.associate = function (models) {
        Tbl_prapenuntutan_files_tmp.belongsTo(models.Tbl_prapenuntutan_tmp, {
            foreignKey: 'id_prapenuntutan',
            as: 'prapenuntutan'
        });
        models.Tbl_prapenuntutan_tmp.hasMany(Tbl_prapenuntutan_files_tmp, {
            foreignKey: 'id_prapenuntutan',
            as: 'files'
        });
    };

    return Tbl_prapenuntutan_files_tmp;
}