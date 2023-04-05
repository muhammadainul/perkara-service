// Tbl_penyelidikan_jaksa_tmp schema
module.exports = (sequelize, DataTypes) => {
    const Tbl_penyelidikan_jaksa_tmp = sequelize.define('Tbl_penyelidikan_jaksa_tmp', {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
        id_penyelidikan: DataTypes.STRING,
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

    Tbl_penyelidikan_jaksa_tmp.associate = function (models) {
        models.Tbl_penyelidikan_tmp.hasMany(Tbl_penyelidikan_jaksa_tmp, {
            foreignKey: 'id_penyelidikan',
            as: 'penyelidikan_jaksa'
        });
    };

    return Tbl_penyelidikan_jaksa_tmp;
}