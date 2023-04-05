'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Tbl_prapenuntutan_tmp', {
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
            },
            kode_satker: Sequelize.STRING,
            inst_nama: Sequelize.STRING,
            nomor_berkas: Sequelize.STRING,
            tanggal_berkas: Sequelize.DATEONLY,
            tanggal_terima: Sequelize.DATEONLY,
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
        await queryInterface.dropTable('Tbl_prapenuntutan_tmp');
    }
};
