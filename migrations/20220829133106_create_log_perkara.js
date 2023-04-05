module.exports = {
    up: async (queryInterface, Sequelize) =>
        await queryInterface.createTable("Log_perkara", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            id_perkara: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'Perkara',
                    key: 'id'
                }
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            kategori_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Kategori_perkara',
                    key: 'id'
                }
            },
            logtime: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('now')
            },
            logdetail: { 
                type: Sequelize.STRING,
                allowNull: true
            }
        }),
    down: async (queryInterface /* , Sequelize */) => await queryInterface.dropTable("Log_perkara"),
  }