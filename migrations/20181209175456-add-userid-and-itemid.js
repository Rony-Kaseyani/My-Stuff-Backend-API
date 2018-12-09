'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('ratings', 'userId', {
        allowNull: false,
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('ratings', 'newsId', {
        allowNull: false,
        type: Sequelize.INTEGER
      })
    ]
  },

  down: (queryInterface, Sequelize) => {
    return [queryInterface.removeColumn('ratings', 'userId'), queryInterface.removeColumn('ratings', 'newsId')]
  }
}
