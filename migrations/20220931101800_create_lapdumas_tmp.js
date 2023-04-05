'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Tbl_lapdumas_tmp', {
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true
            },
            kode_satker: Sequelize.STRING,
            inst_nama: Sequelize.STRING,
            nomor_surat: Sequelize.STRING,
            tanggal_surat: Sequelize.DATEONLY,
            tanggal_terima: Sequelize.DATEONLY,
            kasus_posisi: Sequelize.STRING,
            asal_surat: Sequelize.STRING,
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
        await queryInterface.dropTable('Tbl_lapdumas_tmp');
    }
};
