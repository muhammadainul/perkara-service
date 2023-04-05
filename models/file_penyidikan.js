// FILE_PENYIDIKAN Schema
module.exports = (sequelize, DataTypes) => {
    const File_penyidikan = sequelize.define('File_penyidikan',
        {
            id: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            id_penyidikan: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                references: {
                    model: 'Penyidikan',
                    key: 'id'
                }
            },
            destination: DataTypes.STRING,
            filename: {
                type: DataTypes.TEXT,
                unique: true
            },
            path: DataTypes.STRING,
            tanggal: DataTypes.DATE,
            keterangan: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        },
        { freezeTableName: true }
    );

    File_penyidikan.associate = function (models) {
        File_penyidikan.belongsTo(models.Penyidikan, {
            foreignKey: 'id_penyidikan',
            as: 'penyidikan'
        });
    };

    return File_penyidikan;
};