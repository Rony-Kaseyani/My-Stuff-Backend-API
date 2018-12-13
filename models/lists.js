'use strict'
module.exports = (sequelize, DataTypes) => {
  const Lists = sequelize.define(
    'Lists',
    {
      list: DataTypes.STRING
    },
    {}
  )
  Lists.associate = function(models) {
    // associations can be defined here
    Lists.belongsTo(models.Users)
    Lists.belongsTo(models.Items)
  }
  return Lists
}
