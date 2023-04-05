module.exports = {
    up: async (queryInterface, Sequelize) =>
        await queryInterface.createTable("File_lapdumas", {
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
                unique: true
            },
            id_lapdumas: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'Lapdumas',
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
    down: async (queryInterface /* , Sequelize */) => await queryInterface.dropTable("File_lapdumas"),
  }