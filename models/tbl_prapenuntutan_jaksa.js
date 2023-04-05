// Tbl_prapenuntutan_jaksa_tmp schema
module.exports = (sequelize, DataTypes) => {
    const Tbl_prapenuntutan_jaksa_tmp = sequelize.define('Tbl_prapenuntutan_jaksa_tmp', {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
        id_prapenuntutan: DataTypes.STRING,
		nip: DataTypes.STRING,
        nama: DataTypes.STRING,
        golongan: DataTypes.STRING,
        pangkat: DataTypes.STRING,
        jabatan: DataTypes.STRING,
		createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    { freezeTableName: true }
    );

    Tbl_prapenuntutan_jaksa_tmp.associate = function (models) {
        models.Tbl_prapenuntutan_tmp.hasMany(Tbl_prapenuntutan_jaksa_tmp, {
            foreignKey: 'id_prapenuntutan',
            as: 'penuntutan_jaksa'
        });
    };

    return Tbl_prapenuntutan_jaksa_tmp;
}