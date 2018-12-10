'use strict'
module.exports = (sequelize, DataTypes) => {
  const Ratings = sequelize.define(
    'Ratings',
    {
      rating: DataTypes.INTEGER
    },
    {}
  )
  Ratings.associate = function(models) {
    // associations can be defined here
    Ratings.belongsTo(models.Users)
    Ratings.belongsTo(models.Items)
  }
  return Ratings
}
