'use strict'
module.exports = (sequelize, DataTypes) => {
  const Items = sequelize.define(
    'Items',
    {
      category: DataTypes.STRING,
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      condition: DataTypes.STRING,
      price: DataTypes.DECIMAL(10, 2),
      city: DataTypes.STRING,
      image: DataTypes.STRING,
      published: DataTypes.BOOLEAN,
      reported: DataTypes.BOOLEAN
    },
    {}
  )
  Items.associate = function(models) {
    // associations can be defined here
    Items.belongsTo(models.user)
    Items.hasMany(models.Ratings)
  }
  return Items
}
