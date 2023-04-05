module.exports = {
    up: async (queryInterface, Sequelize) =>
        await queryInterface.createTable("File_penyidikan", {
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
                unique: true
            },
            id_penyidikan: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'Penyidikan',
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
    down: async (queryInterface /* , Sequelize */) => await queryInterface.dropTable("File_penyidikan"),
  }