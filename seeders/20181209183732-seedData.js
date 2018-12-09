'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return [
      queryInterface.bulkInsert('user', [
        {
          first_name: 'Admin',
          last_name: 'User',
          email: 'admin@email.com',
          password: 'admin',
          is_admin: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          first_name: 'Armin',
          last_name: 'Naimi',
          email: 'armin@email.com',
          password: 'password',
          is_admin: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstName: 'Mahmoud',
          lastName: 'Awad',
          email: 'mahmoud@email.com',
          password: 'password',
          is_admin: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstName: 'Reema',
          lastName: 'Kaseyani-Jones',
          email: 'reema@email.com',
          password: 'password',
          is_admin: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          firstName: 'Rony',
          lastName: 'Kaseyani',
          email: 'rony@email.com',
          password: 'password',
          is_admin: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
    ]
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('user', null, {})
  }
}
