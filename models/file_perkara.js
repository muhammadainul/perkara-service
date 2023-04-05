// FILE_PERKARA Schema
module.exports = (sequelize, DataTypes) => {
    const File_perkara = sequelize.define('File_perkara',
        {
            id: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            id_perkara: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                references: {
                    model: 'Perkara',
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

    File_perkara.associate = function (models) {
        File_perkara.belongsTo(models.Perkara, {
            foreignKey: 'id_perkara',
            as: 'perkara'
        });
        // File_perkara.belongsTo(models.Master_file_perkara, {
        //     foreignKey: 'id_master_file',
        //     as: 'master_file'
        // });
    };

    return File_perkara;
};