'use strict';
module.exports = (sequelize, DataTypes) => {
  const Ratings = sequelize.define('Ratings', {
    rating: DataTypes.INTEGER
  }, {});
  Ratings.associate = function(models) {
    // associations can be defined here
  };
  return Ratings;
};