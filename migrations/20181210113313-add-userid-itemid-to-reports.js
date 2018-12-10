'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('reports', 'userId', {
        allowNull: false,
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('reports', 'itemId', {
        allowNull: false,
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('reports', 'reporterId', {
        allowNull: false,
        type: Sequelize.INTEGER
      })
    ]
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('reports', 'userId'),
      queryInterface.removeColumn('reports', 'itemId'),
      queryInterface.removeColumn('reports', 'reporterId')
    ]
  }
}
