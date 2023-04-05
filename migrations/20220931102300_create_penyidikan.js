'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Tbl_penyidikan_tmp', {
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
            },
            id_penyelidikan: {
                type: Sequelize.STRING,
                allowNull: true,
                references: {
                    model: 'Tbl_penyelidikan_tmp',
                    key: 'id'
                }
            },
            kode_satker: Sequelize.STRING,
            inst_nama: Sequelize.STRING,
            nomor_sprintdik: Sequelize.STRING,
            tanggal_sprintdik: Sequelize.DATEONLY,
            nama_perkara: Sequelize.STRING,
            nama_tersangka: Sequelize.STRING,
            jenis_perkara: Sequelize.STRING,
            tppu: Sequelize.STRING,
            status: Sequelize.STRING,
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Tbl_penyidikan_tmp');
    }
};
