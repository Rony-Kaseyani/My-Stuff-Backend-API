'use strict';
module.exports = (sequelize, DataTypes) => {
  const Items = sequelize.define('Items', {
    category: DataTypes.STRING,
    product: DataTypes.STRING,
    description: DataTypes.TEXT,
    condition: DataTypes.STRING,
    price: DataTypes.INTEGER,
    city: DataTypes.STRING,
    published: DataTypes.BOOLEAN,
    image: DataTypes.STRING,
    video: DataTypes.STRING,
    audio: DataTypes.STRING
  }, {});
  Items.associate = function(models) {
    // associations can be defined here
  };
  return Items;
};