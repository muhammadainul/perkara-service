// FILE LAPDUMAS Schema
module.exports = (sequelize, DataTypes) => {
    const File_lapdumas = sequelize.define('File_lapdumas',
        {
            id: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            id_lapdumas: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                references: {
                    model: 'Lapdumas',
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

    File_lapdumas.associate = function (models) {
        File_lapdumas.belongsTo(models.Lapdumas, {
            foreignKey: 'id_lapdumas',
            as: 'files'
        });
        // File_lapdumas.belongsTo(models.Master_file_lapdumas, {
        //     foreignKey: 'id_master_file',
        //     as: 'master_file'
        // });
    };

    return File_lapdumas;
};