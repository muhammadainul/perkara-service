'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Perkara', {
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
            id_satker: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Satker',
                    key: 'id'
                }
            },
            no_perkara: Sequelize.STRING,
            judul_perkara: Sequelize.STRING,
            status: { 
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: false
            },
            bulan: Sequelize.INTEGER,
            tahun: Sequelize.SMALLINT,
            lokasi_berkas: Sequelize.STRING,
            uraian: Sequelize.STRING,
            jenis: Sequelize.STRING,
            kondisi: Sequelize.STRING,
            kategori_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Kategori_perkara',
                    key: 'id'
                }
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
        await queryInterface.dropTable('Perkara');
    }
};
