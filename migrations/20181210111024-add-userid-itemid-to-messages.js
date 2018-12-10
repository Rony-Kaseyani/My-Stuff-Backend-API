'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('messages', 'userId', {
        allowNull: false,
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('messages', 'itemId', {
        allowNull: false,
        type: Sequelize.INTEGER
      })
    ]
  },

  down: (queryInterface, Sequelize) => {
    return [queryInterface.removeColumn('messages', 'userId'), queryInterface.removeColumn('messages', 'itemId')]
  }
}
