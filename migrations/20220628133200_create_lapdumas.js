'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Lapdumas', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            no_laporan: Sequelize.STRING,
            tanggal_surat: Sequelize.DATE,
            tanggal_terima: Sequelize.DATE,
            asal_surat: Sequelize.STRING,
            perihal: Sequelize.STRING,
            isi: Sequelize.STRING,
            status: Sequelize.STRING,
            pembuat_catatan: Sequelize.STRING,
            created_by: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Lapdumas');
    }
};
