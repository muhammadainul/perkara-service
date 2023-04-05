module.exports = {
    up: async (queryInterface, Sequelize) =>
        await queryInterface.createTable("File_perkara", {
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
                unique: true
            },
            id_perkara: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'Perkara',
                    key: 'id'
                }
            },
            id_master_file: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Master_file_perkara',
                    key: 'id'
                }
            },
            destination: {
                type: Sequelize.STRING,
                allowNull: true
            },
            filename: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            path: { 
                type: Sequelize.STRING,
                allowNull: true
            },
            tanggal: {
                type: Sequelize.DATE,
                allowNull: false
            },
            keterangan: Sequelize.STRING,
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        }),
    down: async (queryInterface /* , Sequelize */) => await queryInterface.dropTable("File_perkara"),
  }