// Tbl_penyidikan_jaksa_tmp schema
module.exports = (sequelize, DataTypes) => {
    const Tbl_penyidikan_jaksa_tmp = sequelize.define('Tbl_penyidikan_jaksa_tmp', {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
        id_penyidikan: DataTypes.STRING,
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
    
    Tbl_penyidikan_jaksa_tmp.associate = function (models) {
        models.Tbl_penyidikan_tmp.hasMany(Tbl_penyidikan_jaksa_tmp, {
            foreignKey: 'id_penyidikan',
            as: 'penyidikan_jaksa'
        });
    };

    return Tbl_penyidikan_jaksa_tmp;
}