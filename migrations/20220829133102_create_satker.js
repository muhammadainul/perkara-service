module.exports = {
    up: async (queryInterface, Sequelize) =>
        await queryInterface.createTable("Satker", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            nama_satker: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            akronim: {
                type: Sequelize.STRING,
                allowNull: true
            },
            id_kejati: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: null
            },
            id_kejari: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: null
            },
            id_cabjari: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: null
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        }),
    down: async (queryInterface, Sequelize) => 
        await queryInterface.createTable("Satker", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            nama_satker: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        }),
  }