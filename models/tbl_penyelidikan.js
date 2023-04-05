// Tbl_penyelidikan_tmp schema
module.exports = (sequelize, DataTypes) => {
    const Tbl_penyelidikan_tmp = sequelize.define('Tbl_penyelidikan_tmp', {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
        id_lapdumas: DataTypes.STRING,
        kode_satker: DataTypes.STRING,
        inst_nama: DataTypes.STRING,
		nomor_sprintlid: DataTypes.STRING,
        tanggal_sprintlid: DataTypes.DATEONLY,
        kasus_posisi: DataTypes.STRING,
        status: DataTypes.STRING,
		createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    { freezeTableName: true }
    );

    Tbl_penyelidikan_tmp.associate = function (models) {
        Tbl_penyelidikan_tmp.belongsTo(models.Tbl_lapdumas_tmp, {
            foreignKey: 'id_lapdumas',
            as: 'lapdumas'
        });
    };

    return Tbl_penyelidikan_tmp;
}