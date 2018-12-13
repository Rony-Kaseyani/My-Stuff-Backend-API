'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('lists', 'userId', {
        allowNull: false,
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('lists', 'itemId', {
        allowNull: false,
        type: Sequelize.INTEGER
      })
    ]
  },

  down: (queryInterface, Sequelize) => {
    return [queryInterface.removeColumn('lists', 'userId'), queryInterface.removeColumn('lists', 'itemId')]
  }
}
