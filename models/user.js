'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'Users',
    {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        validate: { isEmail: true }
      },
      password: { allowNull: false, type: DataTypes.STRING },
      is_admin: DataTypes.BOOLEAN,
      last_login: DataTypes.DATE
    },
    {}
  )
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Items)
    User.hasMany(models.Ratings)
    User.hasMany(models.Messages)
    User.hasMany(models.Reports)
  }
  return User
}
