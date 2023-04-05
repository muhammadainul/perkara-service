'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Penyelidikan', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            id_lapdumas: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'Lapdumas',
                    key: 'id'
                }
            },
            no_p2: Sequelize.STRING,
            tanggal_surat: Sequelize.DATE,
            tanggal_terima: Sequelize.DATE,
            tanggal_penyelidikan: Sequelize.DATE,
            asal_surat: Sequelize.STRING,
            perihal: Sequelize.STRING,
            status: { 
                type: Sequelize.STRING,
                allowNull: true
            },
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
        await queryInterface.dropTable('Penyelidikan');
    }
};
