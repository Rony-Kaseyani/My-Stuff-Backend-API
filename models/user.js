'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: { isEmail: true }
    },
    password: { allowNull: false, type: DataTypes.STRING },
    is_admin: DataTypes.BOOLEAN,
    last_login: DataTypes.DATE
  }, {})
  User.associate = function (models) {
    // associations can be defined here
  }
  return User
}