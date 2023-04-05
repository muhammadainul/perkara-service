'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn(
                'Lapdumas',
                'tanggal_surat',
                { 
                    type: Sequelize.DATEONLY,
                    allowNull: true
                }
            ),
            queryInterface.changeColumn(
                'Lapdumas',
                'tanggal_terima',
                { 
                    type: Sequelize.DATEONLY,
                    allowNull: true
                }
            ),
            queryInterface.changeColumn(
                'Penyelidikan',
                'tanggal_surat',
                { 
                    type: Sequelize.DATEONLY,
                    allowNull: true
                }
            ),
            queryInterface.renameColumn(
                'Penyelidikan',
                'tanggal_surat',
                'tanggal_sprintlid'
            ),
            queryInterface.renameColumn(
                'Penyelidikan',
                'no_p2',
                'no_sprintlid'
            ),
            queryInterface.removeColumn(
                'Penyelidikan',
                'tanggal_terima'
            ),
            queryInterface.removeColumn(
                'Penyelidikan',
                'tanggal_penyelidikan'
            ),
            queryInterface.addColumn(
                'Penyelidikan',
                'kasus_posisi',
                {
                    type: Sequelize.STRING,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                'Lapdumas',
                'inst_nama',
                {
                    type: Sequelize.STRING,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                'Penyelidikan',
                'inst_nama',
                {
                    type: Sequelize.STRING,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                'Perkara',
                'inst_nama',
                {
                    type: Sequelize.STRING,
                    allowNull: true
                }
            ),
            queryInterface.removeColumn(
                'Perkara',
                'id_penyelidikan'
            ),
            queryInterface.addColumn(
                'Perkara',
                'tanggal_berkas',
                {
                    type: Sequelize.DATEONLY,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                'Perkara',
                'tanggal_terima',
                {
                    type: Sequelize.DATEONLY,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                'Perkara',
                'nama_tersangka',
                {
                    type: Sequelize.STRING,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                'Perkara',
                'tppu',
                {
                    type: Sequelize.STRING,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                'Perkara',
                'keterangan',
                {
                    type: Sequelize.STRING,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                'Lapdumas',
                'kasus_posisi',
                {
                    type: Sequelize.STRING,
                    allowNull: true
                }
            ),
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn(
                'Lapdumas',
                'tanggal_surat',
                { 
                    type: Sequelize.DATEONLY,
                    allowNull: true
                }
            ),
            queryInterface.changeColumn(
                'Lapdumas',
                'tanggal_terima',
                { 
                    type: Sequelize.DATEONLY,
                    allowNull: true
                }
            ),
            queryInterface.changeColumn(
                'Penyelidikan',
                'tanggal_surat',
                { 
                    type: Sequelize.DATEONLY,
                    allowNull: true
                }
            ),
            queryInterface.renameColumn(
                'Penyelidikan',
                'tanggal_surat',
                'tanggal_sprintlid'
            ),
            queryInterface.renameColumn(
                'Penyelidikan',
                'no_p2',
                'no_sprintlid'
            ),
            queryInterface.removeColumn(
                'Penyelidikan',
                'tanggal_terima'
            ),
            queryInterface.removeColumn(
                'Penyelidikan',
                'tanggal_penyelidikan'
            ),
            queryInterface.addColumn(
                'Penyelidikan',
                'kasus_posisi',
                {
                    type: Sequelize.STRING,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                'Lapdumas',
                'inst_nama',
                {
                    type: Sequelize.STRING,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                'Penyelidikan',
                'inst_nama',
                {
                    type: Sequelize.STRING,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                'Perkara',
                'inst_nama',
                {
                    type: Sequelize.STRING,
                    allowNull: true
                }
            ),
            queryInterface.removeColumn(
                'Perkara',
                'id_penyelidikan'
            ),
            queryInterface.addColumn(
                'Perkara',
                'tanggal_berkas',
                {
                    type: Sequelize.DATEONLY,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                'Perkara',
                'tanggal_terima',
                {
                    type: Sequelize.DATEONLY,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                'Perkara',
                'nama_tersangka',
                {
                    type: Sequelize.STRING,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                'Perkara',
                'tppu',
                {
                    type: Sequelize.STRING,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                'Perkara',
                'keterangan',
                {
                    type: Sequelize.STRING,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                'Lapdumas',
                'kasus_posisi',
                {
                    type: Sequelize.DATEONLY,
                    allowNull: true
                }
            ),
        ]);
    }
};
