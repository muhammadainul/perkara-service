// FILE PENYELIDIKAN Schema
module.exports = (sequelize, DataTypes) => {
    const File_penyelidikan = sequelize.define('File_penyelidikan',
        {
            id: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            id_penyelidikan: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                references: {
                    model: 'Penyelidikan',
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

    File_penyelidikan.associate = function (models) {
        File_penyelidikan.belongsTo(models.Penyelidikan, {
            foreignKey: 'id_penyelidikan',
            as: 'penyelidikan'
        });
        // File_penyelidikan.belongsTo(models.Master_file_penyelidikan, {
        //     foreignKey: 'id_master_file',
        //     as: 'master_file'
        // });
    };

    return File_penyelidikan;
};