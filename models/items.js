'use strict'
module.exports = (sequelize, DataTypes) => {
  const Items = sequelize.define('Items', {
    category: DataTypes.STRING,
    product: DataTypes.STRING,
    description: DataTypes.TEXT,
    condition: DataTypes.STRING,
    price: DataTypes.DECIMAL(10,2),
    city: DataTypes.STRING,
    published: DataTypes.BOOLEAN,
    image_path: DataTypes.STRING,
    video: DataTypes.STRING,
    audio: DataTypes.STRING
  }, {})
  Items.associate = function(models) {
    // associations can be defined here
  }
  return Items
}