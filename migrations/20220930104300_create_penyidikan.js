'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Penyidikan', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            id_penyelidikan: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'Penyelidikan',
                    key: 'id'
                }
            },
            inst_nama: Sequelize.STRING,
            no_sprintdik: Sequelize.STRING,
            tanggal_sprintdik: Sequelize.DATEONLY,
            nama_perkara: Sequelize.STRING,
            nama_tersangka: Sequelize.STRING,
            jenis_perkara: Sequelize.STRING,
            tppu: Sequelize.STRING,
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
        await queryInterface.dropTable('Penyidikan');
    }
};
