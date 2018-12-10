'use strict'
module.exports = (sequelize, DataTypes) => {
  const Reports = sequelize.define(
    'Reports',
    {
      report: DataTypes.TEXT
    },
    {}
  )
  Reports.associate = function(models) {
    // associations can be defined here
    Reports.belongsTo(models.Users)
    Reports.belongsTo(models.Items)
  }
  return Reports
}
